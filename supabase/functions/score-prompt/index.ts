import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a prompt quality evaluator. You analyze AI prompts and score them across 7 dimensions.

For each prompt, evaluate these dimensions (0-10 each):
1. **Specificity** — How focused and detailed is the request? Vague = low, precise = high.
2. **Context** — Does it provide background info, constraints, or situational details?
3. **Output Format** — Does it define desired structure, length, format, or style?
4. **Role/Persona** — Does it assign the AI a role, expertise, or perspective?
5. **Examples** — Are examples of desired output included (few-shot)?
6. **Constraints** — Are there boundaries on scope, tone, audience, what NOT to do?
7. **Actionability** — Can the AI produce a genuinely useful, non-generic response?

Calculate total score using weighted formula:
Total = round((Specificity×2 + Context×1.5 + OutputFormat×1.5 + Role×1 + Examples×1 + Constraints×1 + Actionability×2) × 10 / 100)

Then provide:
- An improved version of the prompt that would score significantly higher
- A list of specific changes made and why each helps
- A one-sentence summary of the prompt's main weakness

Consider the target model when scoring:
- **ChatGPT**: Benefits from clear system/user separation, step-by-step instructions
- **Claude**: Benefits from XML tags, detailed context, explicit constraints
- **Gemini**: Benefits from structured prompts, clear task decomposition
- **Midjourney**: Score on subject clarity, style keywords, composition, technical params, negative prompts — different rubric entirely
- **General**: Use the standard rubric

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "dimensions": {
    "specificity": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "context": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "output_format": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "role_persona": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "examples": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "constraints": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" },
    "actionability": { "score": <0-10>, "max": 10, "feedback": "<one sentence>" }
  },
  "improved_prompt": "<the improved prompt text>",
  "changes": [
    { "what": "<what was changed>", "why": "<why it helps>" }
  ],
  "summary": "<one sentence about the main weakness>"
}`;

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Anthropic API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // Auth: extract user from JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Authentication required" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // Ensure user_usage row exists (handles existing users without one)
  await supabaseAdmin
    .from("user_usage")
    .upsert(
      { user_id: user.id, prompt_count: 0 },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

  // Atomic rate limit check + increment via RPC
  const { data: allowed, error: rpcError } = await supabaseAdmin.rpc(
    "check_and_increment_usage",
    { p_user_id: user.id }
  );

  if (rpcError) {
    console.error("Usage check error:", rpcError);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  if (!allowed) {
    return new Response(JSON.stringify({ error: "limit_reached" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { prompt, target_model = "general" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (prompt.length > 10000) {
      return new Response(
        JSON.stringify({
          error: "Prompt too long (max 10,000 characters)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Target model: ${target_model}\n\nPrompt to evaluate:\n${prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to score prompt. Please try again.",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const data = await response.json();
    let content = data.content[0]?.text;

    // Strip markdown code fences if present (e.g. ```json ... ```)
    content = content
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "");

    // Parse the JSON response from Claude
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: "Failed to parse scoring response" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const scoreResult = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(scoreResult), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

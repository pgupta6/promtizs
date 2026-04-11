import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const POSTHOG_API_KEY = Deno.env.get("POSTHOG_API_KEY");
const POSTHOG_PROJECT_ID = Deno.env.get("POSTHOG_PROJECT_ID");

const ADMIN_EMAIL = "pgupta6@binghamton.edu";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Authentication required" }, 401);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return jsonResponse({ error: "Invalid or expired token" }, 401);
  }

  if (user.email !== ADMIN_EMAIL) {
    return jsonResponse({ error: "Access denied" }, 403);
  }

  try {
    const { metric, days = 30 } = await req.json();

    switch (metric) {
      case "overview": {
        const { count: totalUsers } = await supabaseAdmin
          .from("users_view")
          .select("*", { count: "exact", head: true });

        const { data: promptStats } = await supabaseAdmin.rpc(
          "admin_prompt_stats"
        );

        return jsonResponse({
          total_users: totalUsers ?? 0,
          total_prompts: promptStats?.[0]?.total_prompts ?? 0,
          avg_score: Math.round(promptStats?.[0]?.avg_score ?? 0),
        });
      }

      case "daily_stats": {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const { data } = await supabaseAdmin
          .from("prompt_history")
          .select("created_at, score")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true });

        // Group by date
        const byDate: Record<string, { count: number; totalScore: number }> =
          {};
        for (const row of data ?? []) {
          const date = row.created_at.split("T")[0];
          if (!byDate[date]) byDate[date] = { count: 0, totalScore: 0 };
          byDate[date].count++;
          byDate[date].totalScore += row.score;
        }

        const daily = Object.entries(byDate).map(([date, v]) => ({
          date,
          count: v.count,
          avg_score: Math.round(v.totalScore / v.count),
        }));

        return jsonResponse(daily);
      }

      case "model_stats": {
        const { data } = await supabaseAdmin
          .from("prompt_history")
          .select("target_model");

        const counts: Record<string, number> = {};
        for (const row of data ?? []) {
          counts[row.target_model] = (counts[row.target_model] || 0) + 1;
        }

        const models = Object.entries(counts).map(([model, count]) => ({
          model,
          count,
        }));

        return jsonResponse(models);
      }

      case "score_distribution": {
        const { data } = await supabaseAdmin
          .from("prompt_history")
          .select("score");

        const buckets = Array.from({ length: 10 }, (_, i) => ({
          range: `${i * 10}-${i * 10 + 9}`,
          count: 0,
        }));

        for (const row of data ?? []) {
          const idx = Math.min(Math.floor(row.score / 10), 9);
          buckets[idx].count++;
        }

        return jsonResponse(buckets);
      }

      case "user_growth": {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const { data } = await supabaseAdmin
          .from("users_view")
          .select("created_at")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true });

        const byDate: Record<string, number> = {};
        for (const row of data ?? []) {
          const date = row.created_at.split("T")[0];
          byDate[date] = (byDate[date] || 0) + 1;
        }

        let cumulative = 0;
        const growth = Object.entries(byDate).map(([date, count]) => {
          cumulative += count;
          return { date, signups: count, total: cumulative };
        });

        return jsonResponse(growth);
      }

      case "posthog_visitors": {
        if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) {
          return jsonResponse({ error: "PostHog not configured" }, 500);
        }

        const since = new Date();
        since.setDate(since.getDate() - days);
        const dateFrom = since.toISOString().split("T")[0];

        // Fetch unique visitors trend
        const response = await fetch(
          `https://us.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","type":"events","math":"dau"}]&date_from=${dateFrom}`,
          {
            headers: {
              Authorization: `Bearer ${POSTHOG_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("PostHog API error:", err);
          return jsonResponse({ error: "PostHog API error" }, 502);
        }

        const phData = await response.json();
        const results = phData.result?.[0];

        const visitors =
          results?.days?.map((day: string, i: number) => ({
            date: day,
            visitors: results.data[i] ?? 0,
          })) ?? [];

        return jsonResponse(visitors);
      }

      default:
        return jsonResponse({ error: `Unknown metric: ${metric}` }, 400);
    }
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

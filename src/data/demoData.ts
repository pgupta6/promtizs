import type { ScoreResult } from '../types';

export const DEMO_PROMPT = 'Write me a blog post about AI';

export const DEMO_RESULT: ScoreResult = {
  score: 32,
  dimensions: {
    specificity: { score: 2, max: 10, feedback: 'Extremely vague — no topic focus, length, or angle specified.' },
    context: { score: 1, max: 10, feedback: 'No background, audience, or purpose provided.' },
    output_format: { score: 2, max: 10, feedback: 'No structure, word count, or formatting requirements.' },
    role_persona: { score: 0, max: 10, feedback: 'No role or expertise assigned to the AI.' },
    examples: { score: 0, max: 10, feedback: 'No examples of desired tone, style, or content.' },
    constraints: { score: 1, max: 10, feedback: 'No boundaries on scope, tone, or what to avoid.' },
    actionability: { score: 3, max: 10, feedback: 'The AI can respond but will produce generic, unfocused content.' },
  },
  improved_prompt: `You are an experienced tech journalist who writes for a non-technical audience. Write a 1,200-word blog post titled "5 Ways AI Is Quietly Changing Your Daily Life in 2025."

Structure:
- Hook opening (2-3 sentences with a surprising stat)
- 5 sections, each covering one real-world AI application (e.g., email filtering, navigation, healthcare diagnostics)
- For each section: explain what the AI does, give a concrete example, and mention one limitation
- Closing paragraph with a forward-looking takeaway

Tone: Conversational, optimistic but balanced — acknowledge concerns without fear-mongering.
Audience: General readers, ages 25-45, who use technology daily but don't follow AI news.
Avoid: Jargon, hype phrases like "revolutionary" or "game-changing", and speculation about AGI.`,
  changes: [
    { what: 'Added expert role', why: 'Gives the AI a clear voice and perspective to write from.' },
    { what: 'Specified word count and title', why: 'Sets concrete expectations for length and focus.' },
    { what: 'Defined clear structure with 5 sections', why: 'Prevents rambling and ensures organized output.' },
    { what: 'Added audience and tone guidelines', why: 'Helps calibrate language complexity and style.' },
    { what: 'Listed explicit constraints', why: 'Prevents common AI writing pitfalls like hype and jargon.' },
  ],
  summary: 'The prompt is too vague to produce anything beyond generic, unfocused content about a massive topic.',
};

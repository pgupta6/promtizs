export interface DimensionScore {
  score: number;
  max: number;
  feedback: string;
}

export interface PromptChange {
  what: string;
  why: string;
}

export interface ScoreResult {
  score: number;
  dimensions: {
    specificity: DimensionScore;
    context: DimensionScore;
    output_format: DimensionScore;
    role_persona: DimensionScore;
    examples: DimensionScore;
    constraints: DimensionScore;
    actionability: DimensionScore;
  };
  improved_prompt: string;
  changes: PromptChange[];
  summary: string;
}

export type TargetModel = 'general' | 'chatgpt' | 'claude' | 'gemini' | 'midjourney';

export interface PromptHistoryEntry {
  id: string;
  user_id: string;
  original_prompt: string;
  improved_prompt: string;
  score: number;
  target_model: TargetModel;
  dimensions: ScoreResult['dimensions'];
  changes: PromptChange[];
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

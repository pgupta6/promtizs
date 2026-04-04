import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ScoreResult, TargetModel } from '../types';

interface UsePromptScorerReturn {
  score: ScoreResult | null;
  loading: boolean;
  error: string | null;
  scorePrompt: (prompt: string, targetModel: TargetModel) => Promise<void>;
  setScore: (score: ScoreResult | null) => void;
  reset: () => void;
}

export function usePromptScorer(): UsePromptScorerReturn {
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scorePrompt = async (prompt: string, targetModel: TargetModel) => {
    setLoading(true);
    setError(null);
    setScore(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('score-prompt', {
        body: { prompt, target_model: targetModel },
      });

      if (fnError) throw fnError;
      setScore(data as ScoreResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to score prompt');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setScore(null);
    setError(null);
  };

  return { score, loading, error, scorePrompt, setScore, reset };
}

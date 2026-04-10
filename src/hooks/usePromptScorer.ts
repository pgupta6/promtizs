import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ScoreResult, TargetModel } from '../types';

interface UsePromptScorerReturn {
  score: ScoreResult | null;
  loading: boolean;
  error: string | null;
  limitReached: boolean;
  scorePrompt: (prompt: string, targetModel: TargetModel) => Promise<void>;
  setScore: (score: ScoreResult | null) => void;
  reset: () => void;
}

export function usePromptScorer(): UsePromptScorerReturn {
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const scorePrompt = async (prompt: string, targetModel: TargetModel) => {
    setLoading(true);
    setError(null);
    setScore(null);
    setLimitReached(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('score-prompt', {
        body: { prompt, target_model: targetModel },
      });

      if (fnError) {
        // Supabase functions.invoke wraps non-2xx as FunctionsHttpError
        // Check if the response body contains limit_reached
        if (fnError.message?.includes('limit_reached') || data?.error === 'limit_reached') {
          setLimitReached(true);
          setError(null);
          return;
        }
        throw fnError;
      }

      if (data?.error === 'limit_reached') {
        setLimitReached(true);
        return;
      }

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
    setLimitReached(false);
  };

  return { score, loading, error, limitReached, scorePrompt, setScore, reset };
}

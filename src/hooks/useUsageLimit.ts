import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const MAX_PROMPTS = 5;

interface UseUsageLimitReturn {
  promptCount: number;
  maxPrompts: number;
  remaining: number;
  limitReached: boolean;
  loading: boolean;
  increment: () => void;
  refresh: () => Promise<void>;
}

export function useUsageLimit(): UseUsageLimitReturn {
  const { user } = useAuth();
  const [promptCount, setPromptCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_usage')
      .select('prompt_count')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setPromptCount(data.prompt_count);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const increment = () => {
    setPromptCount((c) => Math.min(c + 1, MAX_PROMPTS));
  };

  return {
    promptCount,
    maxPrompts: MAX_PROMPTS,
    remaining: Math.max(MAX_PROMPTS - promptCount, 0),
    limitReached: promptCount >= MAX_PROMPTS,
    loading,
    increment,
    refresh,
  };
}

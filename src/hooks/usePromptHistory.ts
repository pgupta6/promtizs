import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { PromptHistoryEntry, ScoreResult, TargetModel } from '../types';

export function usePromptHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setHistory((data as PromptHistoryEntry[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveEntry = async (
    originalPrompt: string,
    result: ScoreResult,
    targetModel: TargetModel,
  ) => {
    if (!user) return;
    await supabase.from('prompt_history').insert({
      user_id: user.id,
      original_prompt: originalPrompt,
      improved_prompt: result.improved_prompt,
      score: result.score,
      target_model: targetModel,
      dimensions: result.dimensions,
      changes: result.changes,
    });
    fetchHistory();
  };

  return { history, loading, saveEntry, refresh: fetchHistory };
}

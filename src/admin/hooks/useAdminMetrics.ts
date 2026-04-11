import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export interface OverviewData {
  total_users: number;
  total_prompts: number;
  avg_score: number;
}

export interface DailyStat {
  date: string;
  count: number;
  avg_score: number;
}

export interface ModelStat {
  model: string;
  count: number;
}

export interface ScoreBucket {
  range: string;
  count: number;
}

export interface UserGrowthPoint {
  date: string;
  signups: number;
  total: number;
}

export interface VisitorPoint {
  date: string;
  visitors: number;
}

interface AdminMetrics {
  overview: OverviewData | null;
  dailyStats: DailyStat[];
  modelStats: ModelStat[];
  scoreDistribution: ScoreBucket[];
  userGrowth: UserGrowthPoint[];
  visitors: VisitorPoint[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

async function fetchMetric(metric: string, days: number) {
  const { data, error } = await supabase.functions.invoke('admin-analytics', {
    body: { metric, days },
  });
  if (error) throw new Error(error.message || 'Failed to fetch metric');
  if (data?.error) throw new Error(data.error);
  return data;
}

export function useAdminMetrics(days: number): AdminMetrics {
  const { session } = useAuth();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [modelStats, setModelStats] = useState<ModelStat[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreBucket[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthPoint[]>([]);
  const [visitors, setVisitors] = useState<VisitorPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        fetchMetric('overview', days),
        fetchMetric('daily_stats', days),
        fetchMetric('model_stats', days),
        fetchMetric('score_distribution', days),
        fetchMetric('user_growth', days),
        fetchMetric('posthog_visitors', days),
      ]);

      if (results[0].status === 'fulfilled') setOverview(results[0].value);
      if (results[1].status === 'fulfilled') setDailyStats(results[1].value);
      if (results[2].status === 'fulfilled') setModelStats(results[2].value);
      if (results[3].status === 'fulfilled') setScoreDistribution(results[3].value);
      if (results[4].status === 'fulfilled') setUserGrowth(results[4].value);
      if (results[5].status === 'fulfilled') setVisitors(results[5].value);

      // Report first error if all critical ones failed
      const firstError = results.find(
        (r) => r.status === 'rejected'
      ) as PromiseRejectedResult | undefined;
      if (results.slice(0, 5).every((r) => r.status === 'rejected') && firstError) {
        setError(firstError.reason?.message || 'Failed to load metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [days, session]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    overview,
    dailyStats,
    modelStats,
    scoreDistribution,
    userGrowth,
    visitors,
    loading,
    error,
    refresh: load,
  };
}

import { useState } from 'react';
import { Users, FileText, TrendingUp, RefreshCw, Loader2, ShieldX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminMetrics } from './hooks/useAdminMetrics';
import { MetricCard } from './components/MetricCard';
import { DailyChart } from './components/DailyChart';
import { ModelPieChart } from './components/ModelPieChart';
import { ScoreHistogram } from './components/ScoreHistogram';
import { VisitorsChart } from './components/VisitorsChart';
import { UserGrowthChart } from './components/UserGrowthChart';

const ADMIN_EMAIL = 'pgupta6@binghamton.edu';
const RANGE_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

export function AdminDashboard() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [days, setDays] = useState(30);
  const metrics = useAdminMetrics(days);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
        <ShieldX className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
        <p>Please sign in to continue.</p>
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 gradient-btn text-white rounded-xl text-sm font-medium"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
        <ShieldX className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
        <p>Signed in as {user.email} — not authorized.</p>
        <a href="/" className="text-indigo-500 hover:underline text-sm">Back to PromtizS</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-white/[0.06] glass">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Promt<span className="text-indigo-500">izS</span>
            </a>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Date range selector */}
            <div className="flex items-center bg-gray-100 dark:bg-white/[0.06] rounded-lg p-0.5">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setDays(opt.days)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    days === opt.days
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={metrics.refresh}
              disabled={metrics.loading}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${metrics.loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {metrics.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 rounded-xl p-4 text-sm">
            {metrics.error}
          </div>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={metrics.overview?.total_users ?? '—'}
          />
          <MetricCard
            icon={<FileText className="w-5 h-5" />}
            label="Prompts Scored"
            value={metrics.overview?.total_prompts ?? '—'}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Score"
            value={metrics.overview?.avg_score ?? '—'}
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyChart data={metrics.dailyStats} />
          <ModelPieChart data={metrics.modelStats} />
          <ScoreHistogram data={metrics.scoreDistribution} />
          <VisitorsChart data={metrics.visitors} />
          <UserGrowthChart data={metrics.userGrowth} />
        </div>
      </div>
    </div>
  );
}

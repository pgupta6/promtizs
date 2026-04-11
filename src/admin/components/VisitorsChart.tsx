import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { VisitorPoint } from '../hooks/useAdminMetrics';

interface VisitorsChartProps {
  data: VisitorPoint[];
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  if (data.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/25">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Unique Visitors (PostHog)</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
          PostHog not configured or no data yet
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/25">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Unique Visitors (PostHog)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: textColor }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: textColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                color: isDark ? '#e2e8f0' : '#1e293b',
              }}
            />
            <Line type="monotone" dataKey="visitors" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import type { ModelStat } from '../hooks/useAdminMetrics';

const MODEL_COLORS: Record<string, string> = {
  general: '#6366f1',
  chatgpt: '#10b981',
  claude: '#f59e0b',
  gemini: '#3b82f6',
  midjourney: '#ec4899',
};

interface ModelPieChartProps {
  data: ModelStat[];
}

export function ModelPieChart({ data }: ModelPieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="glass rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/25">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Model Popularity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="model"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name }) => name}
            >
              {data.map((entry) => (
                <Cell key={entry.model} fill={MODEL_COLORS[entry.model] || '#8b5cf6'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                color: isDark ? '#e2e8f0' : '#1e293b',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

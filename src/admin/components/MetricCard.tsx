import type { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
}

export function MetricCard({ icon, label, value, change }: MetricCardProps) {
  return (
    <div className="glass rounded-2xl p-6 shadow-lg shadow-black/5 dark:shadow-black/25">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      {change && (
        <div className="mt-1 text-xs text-green-600 dark:text-green-400">{change}</div>
      )}
    </div>
  );
}

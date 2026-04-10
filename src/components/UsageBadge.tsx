interface UsageBadgeProps {
  used: number;
  max: number;
}

export function UsageBadge({ used, max }: UsageBadgeProps) {
  const remaining = max - used;
  const color =
    remaining >= 3
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      : remaining >= 1
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {remaining > 0 ? `${remaining} of ${max} free left` : 'No free prompts left'}
    </span>
  );
}

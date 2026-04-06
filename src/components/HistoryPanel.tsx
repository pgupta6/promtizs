import { Clock, ChevronRight } from 'lucide-react';
import type { PromptHistoryEntry } from '../types';
import { getScoreColor } from '../utils/scoreHelpers';

interface HistoryPanelProps {
  history: PromptHistoryEntry[];
  loading: boolean;
  onSelect: (entry: PromptHistoryEntry) => void;
}

export function HistoryPanel({ history, loading, onSelect }: HistoryPanelProps) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Clock className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No prompts scored yet</p>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Your scored prompts will appear here</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-white/[0.06]">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Prompts</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-white/[0.06]">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all text-left"
          >
            <div className={`text-2xl font-bold tabular-nums shrink-0 w-12 ${getScoreColor(entry.score)}`}>
              {entry.score}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{entry.original_prompt}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded">{entry.target_model}</span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

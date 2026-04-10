import { useState, useEffect } from 'react';
import { Send, Loader2, Lock } from 'lucide-react';
import type { TargetModel } from '../types';
import { UsageBadge } from './UsageBadge';

interface PromptInputProps {
  onSubmit: (prompt: string, model: TargetModel) => void;
  loading: boolean;
  initialPrompt?: string;
  initialModel?: TargetModel;
  used?: number;
  max?: number;
  limitReached?: boolean;
}

const models: { value: TargetModel; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'midjourney', label: 'Midjourney' },
];

export function PromptInput({ onSubmit, loading, initialPrompt, initialModel, used, max, limitReached }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [model, setModel] = useState<TargetModel>(initialModel || 'general');

  useEffect(() => {
    if (initialPrompt !== undefined) setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (initialModel !== undefined) setModel(initialModel);
  }, [initialModel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onSubmit(prompt.trim(), model);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/25">
        <div className="p-1.5 border-b border-gray-200 dark:border-white/[0.06] flex items-center gap-1">
          {models.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setModel(m.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                model === m.value
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your AI prompt here to get a score and improved version..."
          className="w-full bg-transparent text-slate-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 p-5 resize-none focus:outline-none text-base leading-relaxed min-h-[160px]"
          rows={6}
        />

        <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-mono">
              {prompt.length} chars
            </span>
            {used !== undefined && max !== undefined && (
              <UsageBadge used={used} max={max} />
            )}
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || loading || limitReached}
            className="flex items-center gap-2 px-5 py-2.5 gradient-btn disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-700 dark:disabled:text-gray-500 disabled:shadow-none text-white font-medium rounded-xl transition-all text-sm hover:-translate-y-px disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scoring...
              </>
            ) : limitReached ? (
              <>
                <Lock className="w-4 h-4" />
                Limit Reached
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Score My Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

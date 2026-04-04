import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { TargetModel } from '../types';

interface PromptInputProps {
  onSubmit: (prompt: string, model: TargetModel) => void;
  loading: boolean;
  initialPrompt?: string;
  initialModel?: TargetModel;
}

const models: { value: TargetModel; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'midjourney', label: 'Midjourney' },
];

export function PromptInput({ onSubmit, loading, initialPrompt, initialModel }: PromptInputProps) {
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
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-1 border-b border-gray-800 flex items-center gap-1">
          {models.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setModel(m.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                model === m.value
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
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
          className="w-full bg-transparent text-gray-100 placeholder-gray-600 p-5 resize-none focus:outline-none text-base leading-relaxed min-h-[160px]"
          rows={6}
        />

        <div className="flex items-center justify-between p-3 border-t border-gray-800">
          <span className="text-xs text-gray-500">
            {prompt.length} characters
          </span>
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-all text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scoring...
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

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoreSkeleton } from './ScoreSkeleton';
import { DEMO_PROMPT, DEMO_RESULT } from '../data/demoData';

interface DemoAnimationProps {
  onSignUp: () => void;
}

type Phase = 'typing' | 'loading' | 'result';

export function DemoAnimation({ onSignUp }: DemoAnimationProps) {
  const [phase, setPhase] = useState<Phase>('typing');
  const [typedText, setTypedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedText.length >= DEMO_PROMPT.length) {
      const timeout = setTimeout(() => setPhase('loading'), 600);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setTypedText(DEMO_PROMPT.slice(0, typedText.length + 1));
    }, 60);
    return () => clearTimeout(timeout);
  }, [phase, typedText]);

  // Loading → result transition
  useEffect(() => {
    if (phase !== 'loading') return;
    const timeout = setTimeout(() => setPhase('result'), 3000);
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Demo badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Sparkles className="w-3 h-3" />
          Live Demo
        </span>
      </div>

      {/* Fake prompt input */}
      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/25">
        <div className="p-1.5 border-b border-gray-200 dark:border-white/[0.06] flex items-center gap-1">
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
            General
          </span>
        </div>
        <div className="p-5 min-h-[80px]">
          <p className="text-slate-900 dark:text-gray-100 text-base leading-relaxed">
            {typedText}
            {phase === 'typing' && (
              <span className="inline-block w-0.5 h-5 bg-indigo-500 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </p>
        </div>
      </div>

      {/* Loading or result */}
      {phase === 'loading' && <ScoreSkeleton />}
      {phase === 'result' && (
        <>
          <ScoreDisplay result={DEMO_RESULT} />

          {/* CTA */}
          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Ready to score your own prompts?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign up free and get 5 prompt scores to supercharge your AI results.
            </p>
            <button
              onClick={onSignUp}
              className="inline-flex items-center gap-2 px-8 py-3 gradient-btn text-white font-semibold rounded-xl transition-all text-sm hover:-translate-y-px"
            >
              <Sparkles className="w-4 h-4" />
              Sign Up Free
            </button>
          </div>
        </>
      )}
    </div>
  );
}

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
    <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
      {/* Fake prompt input */}
      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/25">
        <div className="p-1.5 border-b border-gray-200 dark:border-white/[0.06] flex items-center gap-1">
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
            General
          </span>
        </div>
        <div className="p-5 min-h-[60px]">
          <p className="text-slate-900 dark:text-gray-100 text-base leading-relaxed">
            {typedText}
            {phase === 'typing' && (
              <span className="inline-block w-0.5 h-5 bg-indigo-500 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </p>
        </div>
      </div>

      {phase === 'loading' && <ScoreSkeleton />}

      {phase === 'result' && (
        <>
          <ScoreDisplay result={DEMO_RESULT} />

          <div className="text-center pt-4">
            <button
              onClick={onSignUp}
              className="inline-flex items-center gap-2 px-8 py-3.5 gradient-btn text-white font-semibold rounded-xl transition-all text-sm hover:-translate-y-px"
            >
              <Sparkles className="w-4 h-4" />
              Sign Up Free — Score Your Own
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { ScoreDisplay } from './ScoreDisplay';
import { ScoreSkeleton } from './ScoreSkeleton';
import { DEMO_PROMPT, DEMO_RESULT } from '../data/demoData';

interface DemoAnimationProps {
  onSignUp: () => void;
}

type Phase = 'model-select' | 'typing' | 'loading' | 'result' | 'pause';

const models = ['General', 'ChatGPT', 'Claude', 'Gemini', 'Midjourney'];

export function DemoAnimation({ onSignUp }: DemoAnimationProps) {
  const [phase, setPhase] = useState<Phase>('model-select');
  const [typedText, setTypedText] = useState('');
  const [activeModel, setActiveModel] = useState(-1);
  const [key, setKey] = useState(0); // forces ScoreDisplay remount for animation replay

  const resetDemo = useCallback(() => {
    setTypedText('');
    setActiveModel(-1);
    setPhase('model-select');
    setKey((k) => k + 1);
  }, []);

  // Model selection animation: cycle through models then land on "General"
  useEffect(() => {
    if (phase !== 'model-select') return;
    if (activeModel >= models.length - 1) {
      // Cycled through all, select "General" and move on
      const timeout = setTimeout(() => {
        setActiveModel(0);
        setPhase('typing');
      }, 300);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      setActiveModel((m) => m + 1);
    }, 200);
    return () => clearTimeout(timeout);
  }, [phase, activeModel]);

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

  // Result → pause → loop
  useEffect(() => {
    if (phase !== 'result') return;
    const timeout = setTimeout(() => setPhase('pause'), 6000);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'pause') return;
    const timeout = setTimeout(resetDemo, 1500);
    return () => clearTimeout(timeout);
  }, [phase, resetDemo]);

  const selectedModel = activeModel >= 0 ? activeModel : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
      {/* Fake prompt input with model tabs */}
      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/25">
        <div className="p-1.5 border-b border-gray-200 dark:border-white/[0.06] flex items-center gap-1">
          {models.map((m, i) => (
            <span
              key={m}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                i === selectedModel
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {m}
            </span>
          ))}
        </div>
        <div className="p-5 min-h-[60px]">
          <p className="text-slate-900 dark:text-gray-100 text-base leading-relaxed">
            {typedText}
            {(phase === 'typing' || phase === 'model-select') && (
              <span className="inline-block w-0.5 h-5 bg-indigo-500 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </p>
        </div>
      </div>

      {phase === 'loading' && <ScoreSkeleton />}

      {(phase === 'result' || phase === 'pause') && (
        <>
          <div className={phase === 'pause' ? 'opacity-50 transition-opacity duration-1000' : ''}>
            <ScoreDisplay key={key} result={DEMO_RESULT} />
          </div>

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

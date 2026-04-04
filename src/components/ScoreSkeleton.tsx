const steps = [
  'Analyzing prompt structure...',
  'Evaluating specificity & context...',
  'Scoring across 7 dimensions...',
  'Generating improved version...',
];

import { useEffect, useState } from 'react';

export function ScoreSkeleton() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Progress steps */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <defs>
              <linearGradient id="skeletonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="url(#skeletonGradient)" strokeWidth="6"
              strokeDasharray={`${((step + 1) / steps.length) * 251} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold gradient-text">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>
        <p className="text-sm text-gray-400 transition-all duration-300">{steps[step]}</p>
      </div>

      {/* Skeleton bars */}
      <div className="glass rounded-2xl p-6 space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-white/[0.06] rounded" />
              <div className="h-3 w-8 bg-white/[0.06] rounded" />
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-white/[0.04] rounded-full animate-pulse"
                style={{ width: `${30 + Math.random() * 40}%`, animationDelay: `${i * 150}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

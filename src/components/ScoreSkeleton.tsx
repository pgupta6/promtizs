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
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1f2937" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="#6366f1" strokeWidth="6"
              strokeDasharray={`${((step + 1) / steps.length) * 213} 213`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary-400">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>
        <p className="text-sm text-gray-400 transition-all duration-300">{steps[step]}</p>
      </div>

      {/* Skeleton bars */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-gray-800 rounded" />
              <div className="h-3 w-8 bg-gray-800 rounded" />
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-700 rounded-full animate-pulse"
                style={{ width: `${30 + Math.random() * 40}%`, animationDelay: `${i * 150}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
import { DemoAnimation } from './DemoAnimation';

interface LandingHeroProps {
  onSignUp: () => void;
}

export function LandingHero({ onSignUp }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(248,250,252)_70%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(2,6,23)_70%)]" />

      <div className="relative">
        {/* Compact hero */}
        <div className="text-center pt-16 sm:pt-24 pb-8 px-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-tight">
            Score your prompts.
            <br />
            <span className="gradient-text">Get better AI outputs.</span>
          </h1>

          <p className="text-base text-slate-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Instant scoring, detailed feedback, and an improved version — free.
          </p>

          <button
            onClick={onSignUp}
            className="inline-flex items-center gap-2.5 px-8 py-4 gradient-btn text-white font-semibold rounded-xl transition-all text-base hover:-translate-y-px"
          >
            <Sparkles className="w-5 h-5" />
            Sign Up Free — 5 Prompts
          </button>
        </div>

        {/* Demo auto-plays inline */}
        <DemoAnimation onSignUp={onSignUp} />
      </div>
    </div>
  );
}

import { Sparkles, BarChart3, ArrowUpRight } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
  onSignUp?: () => void;
  showSignUp?: boolean;
}

export function LandingHero({ onGetStarted, onSignUp, showSignUp }: LandingHeroProps) {
  return (
    <div className="relative text-center py-20 sm:py-32 px-4 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(248,250,252)_70%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(2,6,23)_70%)]" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-xs text-indigo-600 dark:text-indigo-300 mb-8">
          <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
          AI-powered prompt analysis
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-5 tracking-tight">
          Score your prompts.
          <br />
          <span className="gradient-text">Get better AI outputs.</span>
        </h1>

        <p className="text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
          Paste any AI prompt and get an instant score, detailed feedback across 7 dimensions, and an improved version — with explanations of every change.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2.5 px-8 py-4 gradient-btn text-white font-semibold rounded-xl transition-all text-base hover:-translate-y-px"
          >
            <Sparkles className="w-5 h-5" />
            {showSignUp ? 'See It in Action' : 'Score a Prompt — Free'}
          </button>
          {showSignUp && onSignUp && (
            <button
              onClick={onSignUp}
              className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-slate-900 dark:text-white font-medium rounded-xl transition-all text-sm"
            >
              Sign Up Free
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-24 max-w-3xl mx-auto">
          {[
            {
              icon: BarChart3,
              title: '7-Dimension Scoring',
              desc: 'Specificity, context, format, role, examples, constraints, and actionability.',
            },
            {
              icon: ArrowUpRight,
              title: 'Improved Version',
              desc: 'Get a rewritten prompt that scores higher — with every change explained.',
            },
            {
              icon: Sparkles,
              title: 'Multi-Model Support',
              desc: 'Optimize for ChatGPT, Claude, Gemini, or Midjourney — each scored differently.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass glass-hover rounded-xl p-6 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Sparkles, BarChart3, ArrowUpRight, Zap } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="text-center py-16 sm:py-24 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-950 border border-primary-800 rounded-full text-xs text-primary-300 mb-6">
        <Sparkles className="w-3 h-3" />
        AI-powered prompt analysis
      </div>

      <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
        Score your prompts.
        <br />
        <span className="text-primary-400">Get better AI outputs.</span>
      </h1>

      <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
        Paste any AI prompt and get an instant score, detailed feedback across 7 dimensions, and an improved version — with explanations of every change.
      </p>

      <button
        onClick={onGetStarted}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all text-base shadow-lg shadow-primary-600/25"
      >
        <Zap className="w-5 h-5" />
        Score a Prompt — Free
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left">
          <div className="w-9 h-9 bg-primary-950 rounded-lg flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">7-Dimension Scoring</h3>
          <p className="text-xs text-gray-500">Specificity, context, format, role, examples, constraints, and actionability.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left">
          <div className="w-9 h-9 bg-primary-950 rounded-lg flex items-center justify-center mb-3">
            <ArrowUpRight className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Improved Version</h3>
          <p className="text-xs text-gray-500">Get a rewritten prompt that scores higher — with every change explained.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left">
          <div className="w-9 h-9 bg-primary-950 rounded-lg flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Multi-Model Support</h3>
          <p className="text-xs text-gray-500">Optimize for ChatGPT, Claude, Gemini, or Midjourney — each scored differently.</p>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { PromptInput } from './components/PromptInput';
import { ScoreDisplay } from './components/ScoreDisplay';
import { ScoreSkeleton } from './components/ScoreSkeleton';
import { HistoryPanel } from './components/HistoryPanel';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { usePromptScorer } from './hooks/usePromptScorer';
import { usePromptHistory } from './hooks/usePromptHistory';
import { useUsageLimit } from './hooks/useUsageLimit';
import type { TargetModel, PromptHistoryEntry, ScoreResult } from './types';

function AppContent() {
  const { user } = useAuth();
  const { score, loading, error, limitReached: scorerLimitReached, scorePrompt, setScore, reset } = usePromptScorer();
  const { history, loading: historyLoading, saveEntry } = usePromptHistory();
  const usage = useUsageLimit();
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showScorer, setShowScorer] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const scorerRef = useRef<HTMLDivElement>(null);
  const [lastPrompt, setLastPrompt] = useState<{ text: string; model: TargetModel } | null>(null);

  const effectiveLimitReached = usage.limitReached || scorerLimitReached;

  const handleSubmit = async (prompt: string, model: TargetModel) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (effectiveLimitReached) {
      setShowSubscriptionModal(true);
      return;
    }

    setLastPrompt({ text: prompt, model });
    reset();
    await scorePrompt(prompt, model);
  };

  // Save when score updates
  const lastScoreRef = useRef<ScoreResult | null>(null);
  useEffect(() => {
    if (score && lastPrompt && score !== lastScoreRef.current) {
      lastScoreRef.current = score;
      if (user) {
        saveEntry(lastPrompt.text, score, lastPrompt.model);
        usage.increment();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Handle limit_reached error from scorer as fallback
  useEffect(() => {
    if (scorerLimitReached) {
      setShowSubscriptionModal(true);
      usage.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scorerLimitReached]);

  // Show subscription modal when user logs in with exhausted limit
  useEffect(() => {
    if (user && usage.limitReached && !usage.loading) {
      setShowSubscriptionModal(true);
    }
  }, [user, usage.limitReached, usage.loading]);

  const handleHistorySelect = (entry: PromptHistoryEntry) => {
    const restored: ScoreResult = {
      score: entry.score,
      dimensions: entry.dimensions,
      improved_prompt: entry.improved_prompt,
      changes: entry.changes,
      summary: '',
    };
    setScore(restored);
    lastScoreRef.current = restored;
    setLastPrompt({ text: entry.original_prompt, model: entry.target_model });
    setShowHistory(false);
    setShowScorer(true);
  };

  const handleGetStarted = () => {
    setShowScorer(true);
    setTimeout(() => {
      scorerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogoClick = () => {
    setShowHistory(false);
    setShowScorer(false);
    setLastPrompt(null);
    reset();
  };

  // Unauthenticated: show landing with inline demo
  // Authenticated: show scorer
  const showLanding = !showScorer && !score && !showHistory;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onHistoryClick={user ? () => setShowHistory(!showHistory) : undefined}
        showHistory={showHistory}
        onSignIn={!user ? () => setShowAuth(true) : undefined}
        onLogoClick={handleLogoClick}
      />

      <main className="flex-1">
        {showLanding && (
          <LandingHero onSignUp={user ? handleGetStarted : () => setShowAuth(true)} isLoggedIn={!!user} />
        )}

        {/* Scorer + history */}
        {!showLanding && (
          <div ref={scorerRef} className="max-w-3xl mx-auto px-4 py-8 space-y-8">
            {(showScorer || score) && !showHistory && (
              <>
                <PromptInput
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialPrompt={lastPrompt?.text}
                  initialModel={lastPrompt?.model}
                  used={user ? usage.promptCount : undefined}
                  max={user ? usage.maxPrompts : undefined}
                  limitReached={user ? effectiveLimitReached : false}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 rounded-xl p-4 text-sm">
                    {error}
                  </div>
                )}

                {loading && <ScoreSkeleton />}

                {score && <ScoreDisplay result={score} />}
              </>
            )}

            {showHistory && user && (
              <HistoryPanel
                history={history}
                loading={historyLoading}
                onSelect={handleHistorySelect}
              />
            )}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        <div className="gradient-border max-w-5xl mx-auto mb-6" />
        Promt<span className="text-indigo-400/60">izS</span> &mdash; Score your AI prompts. Get better outputs.
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

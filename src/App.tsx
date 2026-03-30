import { useState, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { PromptInput } from './components/PromptInput';
import { ScoreDisplay } from './components/ScoreDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { AuthModal } from './components/AuthModal';
import { usePromptScorer } from './hooks/usePromptScorer';
import { usePromptHistory } from './hooks/usePromptHistory';
import type { TargetModel, PromptHistoryEntry, ScoreResult } from './types';

function AppContent() {
  const { user } = useAuth();
  const { score, loading, error, scorePrompt, reset } = usePromptScorer();
  const { history, loading: historyLoading, saveEntry } = usePromptHistory();
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showScorer, setShowScorer] = useState(false);
  const scorerRef = useRef<HTMLDivElement>(null);
  const lastSavedRef = useRef<ScoreResult | null>(null);
  const [lastPrompt, setLastPrompt] = useState<{ text: string; model: TargetModel } | null>(null);

  const handleSubmit = async (prompt: string, model: TargetModel) => {
    setLastPrompt({ text: prompt, model });
    lastSavedRef.current = null;
    reset();
    await scorePrompt(prompt, model);
  };

  // Save when score updates
  if (score && lastPrompt && score !== lastSavedRef.current) {
    lastSavedRef.current = score;
    if (user) {
      saveEntry(lastPrompt.text, score, lastPrompt.model);
    }
  }

  const handleHistorySelect = (_entry: PromptHistoryEntry) => {
    setShowHistory(false);
  };

  const handleGetStarted = () => {
    setShowScorer(true);
    setTimeout(() => {
      scorerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onHistoryClick={user ? () => setShowHistory(!showHistory) : undefined}
        showHistory={showHistory}
      />

      <main className="flex-1">
        {!showScorer && !score && (
          <LandingHero onGetStarted={handleGetStarted} />
        )}

        <div ref={scorerRef} className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {(showScorer || score) && (
            <>
              <PromptInput onSubmit={handleSubmit} loading={loading} />

              {error && (
                <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {score && <ScoreDisplay result={score} />}

              {!user && score && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                  <p className="text-sm text-gray-400 mb-3">Sign in to save your prompt history and track improvement</p>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              )}
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
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
        PromtizS &mdash; Score your AI prompts. Get better outputs.
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

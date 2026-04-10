import { useState } from 'react';
import { X, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface SubscriptionModalProps {
  onClose: () => void;
}

export function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const { user } = useAuth();
  const [showPayInput, setShowPayInput] = useState(false);
  const [willingToPay, setWillingToPay] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInterested = async () => {
    setShowPayInput(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    await supabase.from('subscription_interest').insert({
      user_id: user.id,
      interested: true,
      willing_to_pay: willingToPay || null,
    });
    setSubmitted(true);
    setLoading(false);
  };

  const handleNotNow = async () => {
    if (user) {
      await supabase.from('subscription_interest').insert({
        user_id: user.id,
        interested: false,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-sm mx-4 p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">&#10003;</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Thanks for your interest!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              We'll notify you when PromtizS Pro launches.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 gradient-btn text-white font-medium rounded-xl transition-all text-sm"
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              You've used all 5 free prompts!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We're building PromtizS Pro with unlimited scoring, history analytics, and more. Interested?
            </p>

            {showPayInput ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={willingToPay}
                  onChange={(e) => setWillingToPay(e.target.value)}
                  placeholder="What would you pay per month? (optional)"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-2.5 gradient-btn text-white font-medium rounded-xl transition-all text-sm"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Skip &amp; just register interest
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleInterested}
                  className="w-full px-6 py-2.5 gradient-btn text-white font-medium rounded-xl transition-all text-sm hover:-translate-y-px"
                >
                  Yes, I'm interested!
                </button>
                <button
                  onClick={handleNotNow}
                  className="w-full px-6 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors"
                >
                  Not right now
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

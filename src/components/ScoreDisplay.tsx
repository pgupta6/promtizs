import { useEffect, useState } from 'react';
import { Copy, Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { ScoreResult } from '../types';
import { getScoreColor, getScoreBarColor, getScoreLabel, formatDimensions } from '../utils/scoreHelpers';

interface ScoreDisplayProps {
  result: ScoreResult;
}

function getScoreGradient(score: number): string {
  if (score >= 70) return 'from-emerald-400 to-cyan-400';
  if (score >= 40) return 'from-amber-400 to-orange-400';
  return 'from-red-400 to-rose-400';
}

function AnimatedScore({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);

  return <span>{current}</span>;
}

function DimensionBar({ label, score, max, feedback }: { label: string; score: number; max: number; feedback: string }) {
  const [expanded, setExpanded] = useState(false);
  const pct = (score / max) * 100;

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm group"
      >
        <span className="text-gray-300 group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-mono text-xs">{score}/{max}</span>
          {expanded ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
        </div>
      </button>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(score, max)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {expanded && (
        <p className="text-xs text-gray-400 mt-1 pl-1">{feedback}</p>
      )}
    </div>
  );
}

export function ScoreDisplay({ result }: ScoreDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const dimensions = formatDimensions(result.dimensions);

  const copyImproved = async () => {
    await navigator.clipboard.writeText(result.improved_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score Circle */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {result.score >= 70 ? (
                  <>
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </>
                ) : result.score >= 40 ? (
                  <>
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </>
                )}
              </linearGradient>
            </defs>
            <circle
              cx="64" cy="64" r="56" fill="none"
              stroke="url(#scoreGradient)" strokeWidth="8"
              strokeDasharray={`${(result.score / 100) * 352} 352`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold tabular-nums bg-gradient-to-r ${getScoreGradient(result.score)} bg-clip-text text-transparent`}>
              <AnimatedScore target={result.score} />
            </span>
            <span className="text-xs text-gray-500 font-medium">/100</span>
          </div>
        </div>
        <span className={`text-base font-semibold ${getScoreColor(result.score)}`}>
          {getScoreLabel(result.score)}
        </span>
        <p className="text-sm text-gray-400 max-w-md text-center">{result.summary}</p>
      </div>

      {/* Dimension Breakdown */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Score Breakdown</h3>
        <div className="space-y-4">
          {dimensions.map((d) => (
            <DimensionBar key={d.key} label={d.label} score={d.score} max={d.max} feedback={d.feedback} />
          ))}
        </div>
      </div>

      {/* Improved Prompt */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Improved Prompt</h3>
          </div>
          <button
            onClick={copyImproved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs glass-subtle hover:bg-white/[0.06] text-gray-300 rounded-lg transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-score-high" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-5">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {result.improved_prompt}
          </p>
        </div>
      </div>

      {/* Changes Explanation */}
      {result.changes.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowChanges(!showChanges)}
            className="w-full flex items-center justify-between p-5 glass-hover transition-all"
          >
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              What Changed & Why ({result.changes.length})
            </h3>
            {showChanges ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showChanges && (
            <div className="p-5 pt-0 space-y-3">
              {result.changes.map((change, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-cyan-400 mt-0.5 shrink-0">&#10003;</span>
                  <div>
                    <span className="text-gray-200 font-medium">{change.what}</span>
                    <span className="text-gray-500"> — {change.why}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

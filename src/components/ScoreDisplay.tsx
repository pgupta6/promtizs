import { useEffect, useState } from 'react';
import { Copy, Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { ScoreResult } from '../types';
import { getScoreColor, getScoreBarColor, getScoreLabel, formatDimensions } from '../utils/scoreHelpers';

interface ScoreDisplayProps {
  result: ScoreResult;
  originalPrompt?: string;
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
    <div className="space-y-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm group"
      >
        <span className="text-gray-300 group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-mono text-xs">{score}/{max}</span>
          {expanded ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
        </div>
      </button>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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

export function ScoreDisplay({ result, originalPrompt }: ScoreDisplayProps) {
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
      <div className="flex flex-col items-center gap-3">
        <div className={`text-7xl font-bold ${getScoreColor(result.score)} tabular-nums`}>
          <AnimatedScore target={result.score} />
          <span className="text-2xl text-gray-500">/100</span>
        </div>
        <span className={`text-lg font-medium ${getScoreColor(result.score)}`}>
          {getScoreLabel(result.score)}
        </span>
        <p className="text-sm text-gray-400 max-w-md text-center">{result.summary}</p>
      </div>

      {/* Dimension Breakdown */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Score Breakdown</h3>
        <div className="space-y-3">
          {dimensions.map((d) => (
            <DimensionBar key={d.key} label={d.label} score={d.score} max={d.max} feedback={d.feedback} />
          ))}
        </div>
      </div>

      {/* Original Prompt */}
      {originalPrompt && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Original Prompt</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {originalPrompt}
            </p>
          </div>
        </div>
      )}

      {/* Improved Prompt */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary-400" />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Improved Prompt</h3>
          </div>
          <button
            onClick={copyImproved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
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
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <button
            onClick={() => setShowChanges(!showChanges)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              What Changed & Why ({result.changes.length})
            </h3>
            {showChanges ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showChanges && (
            <div className="p-4 pt-0 space-y-3">
              {result.changes.map((change, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-score-high mt-0.5 shrink-0">&#10003;</span>
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

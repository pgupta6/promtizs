import type { ScoreResult } from '../types';

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-score-high';
  if (score >= 40) return 'text-score-mid';
  return 'text-score-low';
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-score-high';
  if (score >= 40) return 'bg-score-mid';
  return 'bg-score-low';
}

export function getScoreBarColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 70) return 'bg-score-high';
  if (pct >= 40) return 'bg-score-mid';
  return 'bg-score-low';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Needs Work';
  return 'Poor';
}

export function getDimensionLabel(key: string): string {
  const labels: Record<string, string> = {
    specificity: 'Specificity',
    context: 'Context',
    output_format: 'Output Format',
    role_persona: 'Role / Persona',
    examples: 'Examples',
    constraints: 'Constraints',
    actionability: 'Actionability',
  };
  return labels[key] || key;
}

export function formatDimensions(dimensions: ScoreResult['dimensions']) {
  return Object.entries(dimensions).map(([key, value]) => ({
    key,
    label: getDimensionLabel(key),
    ...value,
  }));
}

# CLAUDE.md

## Project Overview

PromtizS is an AI prompt rating and improvement tool. Users paste AI prompts, get a 0-100 score across 7 dimensions, and receive an improved version with explanations. Think "Grammarly for AI prompts."

## Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint check
```

## Architecture

- **Frontend:** React 18 + TypeScript + Vite 5 + Tailwind CSS 3
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **AI Engine:** Claude API via Supabase Edge Function (`supabase/functions/score-prompt/`)
- **Deployment:** AWS Amplify (frontend), Supabase (backend)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)

### Key Files
- `src/App.tsx` — Main app with scoring flow
- `src/components/PromptInput.tsx` — Prompt input with model selector
- `src/components/ScoreDisplay.tsx` — Score visualization with dimension bars
- `src/context/AuthContext.tsx` — Supabase auth (Google + email)
- `src/hooks/usePromptScorer.ts` — Scoring API hook
- `src/hooks/usePromptHistory.ts` — History CRUD hook
- `supabase/functions/score-prompt/index.ts` — Edge function that calls Claude API

### Database
- `prompt_history` table — stores user's scored prompts with RLS policies

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | `.env` + GitHub Secrets | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` + GitHub Secrets | Supabase public key |
| `ANTHROPIC_API_KEY` | Supabase Edge Function secrets | Claude API for scoring |

## Supabase

- **Project:** promtizs (us-east-1)
- **Project ID:** rgeqazzzrhtvuyslpfyi

## Workflow

- Always create a commit and PR after making changes
- Deploy via GitHub Actions on push to main

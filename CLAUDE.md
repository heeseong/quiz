# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **Vite + React 19 + TypeScript** — `@vitejs/plugin-react`
- **Tailwind CSS v4** — loaded via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **Zustand** — global game state in `src/store/gameStore.ts`
- **React Router v6** — route-based page navigation
- **Lucide React** — icon library

## Architecture

### Game flow (phase machine)
The app is driven by a single Zustand store (`useGameStore`) that tracks a `phase` field:

```
HOME → NICKNAME → CATEGORY_SELECT → QUIZ → CATEGORY_RESULT → (back to CATEGORY_SELECT or) FINAL_RESULT
```

Routes mirror this flow: `/` → `/nickname` → `/category` → `/quiz` → `/result/category` → `/result/final`.

### Key design decisions

**Answer correctness mapping** — `src/data/questions.ts` stores answers as original option indices (0–3). `shuffleOptions()` in `src/utils/quiz.ts` shuffles displayed options and returns `shuffledToOriginal[]` so QuizPage can map a user's shuffled selection back to the original index before calling `submitAnswer`. The store always compares against `question.answer` (original index).

**Score calculation** (in `gameStore.ts`):
- Correct answer: +10 pts; within 10 s: +5 bonus (15 total)
- Time-out (`selected === -1`) or wrong: 0 pts
- Perfect category (20/20 correct): +50 bonus applied in `completeCategory()`

**Leaderboard** — persisted to `localStorage` key `quiz_leaderboard`, max 20 entries sorted by `totalScore` desc. Written once per session in `FinalResultPage` via a `useRef` guard to prevent double-writes in StrictMode.

**Timer** — `src/hooks/useTimer.ts` resets when its `initialSeconds` dependency changes (keyed to `currentQuestionIndex` via a `useEffect` in QuizPage).

### Data

`src/data/questions.ts` — 60 questions total (20 per category: `KOREAN_HISTORY`, `SCIENCE`, `ENGLISH`), targeting elementary school 5th grade level.

### Types

All shared types live in `src/types/index.ts`: `Category`, `Difficulty`, `Question`, `PlayerRecord`, `GameSession`.

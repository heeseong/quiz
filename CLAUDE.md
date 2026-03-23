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

Route guard: `RequireSession` in `App.tsx` redirects to `/` if `nickname` is empty, protecting `/category`, `/quiz`, `/result/*`.

### Design system

Brand colors defined in `src/index.css` via `@theme`:
- Main: `--color-brand: #3B5BA5` (deep blue)
- Accent: `--color-accent: #FF6B35` (orange)

CSS animation classes also defined there: `.animate-float`, `.animate-fade-up`, `.animate-scale-in`, `.animate-slide-up`, `.animate-sparkle`.

### Common components (`src/components/`)

| File | Purpose |
|------|---------|
| `Button.tsx` | `variant` (primary/secondary/ghost) × `size` (sm/md/lg) + `loading` prop |
| `Card.tsx` | `clickable` hover-lift effect, `selected` ring highlight |
| `Badge.tsx` | Category-aware color via `color="category" category={cat}` |
| `ProgressBar.tsx` | CSS transition progress fill, `height` (sm/md/lg), `showLabel` |
| `LeaderboardModal.tsx` | Full-screen overlay, ESC/backdrop close, TOP3 medal icons |
| `FeedbackOverlay.tsx` | Bottom-sheet overlay after answering; shows result, score chips, explanation, 2-s auto-advance countdown ring |
| `Modal.tsx` | Generic confirmation modal; ESC/backdrop close, `animate-scale-in`; used for destructive-action dialogs |

### Key design decisions

**Answer correctness mapping** — `src/data/questions.ts` stores answers as original option indices (0–3). `shuffleOptions()` in `src/utils/quiz.ts` shuffles displayed options and returns `shuffledToOriginal[]` so QuizPage can map a user's shuffled selection back to the original index before calling `submitAnswer`. The store always compares against `question.answer` (original index).

**Score calculation** (in `gameStore.ts`):
- Correct answer: +10 pts; within 10 s: +5 bonus (15 total)
- Time-out (`selected === -1`) or wrong: 0 pts
- Perfect category (20/20 correct): +50 bonus applied in `completeCategory()`

**Leaderboard** — persisted to `localStorage` key `quiz_leaderboard`, max 20 entries sorted by `totalScore` desc. Written once per session in `FinalResultPage` via a `useRef` guard (`saved`) to prevent double-writes in StrictMode. `sessionId` is generated with `crypto.randomUUID()` and passed to `/leaderboard` via `location.state` for current-session row highlighting.

**Timer** — `src/hooks/useTimer.ts` uses `useReducer` internally (`TICK` / `STOP` / `RESET` actions) to avoid `setState`-in-effect lint violations. Returns `{ remaining, stop }`. `onExpire` is synced to a ref via `useEffect` (no deps) to avoid stale-closure issues. `stop()` dispatches `RESET` is triggered when `initialSeconds` changes.

**QuizPage state** — `selected`, `revealed`, `timeSpentState` are managed by a single `useReducer` (`SELECT` / `EXPIRE` / `RESET`). Reset on `currentQuestionIndex` change via `dispatch({ type: 'RESET' })` (avoids `setState`-in-effect). Elapsed time is computed as `TIME_LIMIT - remaining` at the moment of selection (no `Date.now()` in event handlers).

**Nickname validation** — 2–10 chars, Korean/English/numbers only (`/^[가-힣a-zA-Z0-9]+$/`), validated in real-time in `NicknamePage.tsx`.

**Completed category detection** — `CategorySelectPage` and `CategoryResultPage` both check completion by verifying all questions in a category have an entry in `answers` (not by ID prefix), using `questions` data directly.

**Feedback flow** — After an answer (or timeout), `QuizPage` sets `revealed=true` and renders `FeedbackOverlay`. The overlay auto-advances after 2 s; the user can also tap the next button to skip. The overlay calculates `earnedBase` (+10 if correct) and `earnedBonus` (+5 if correct within 10 s) independently of the store to display a score breakdown.

**QuizPage timer colors** — Circular SVG timer: blue (`#3B5BA5`) for >10 s, orange (`#f97316`) for 4–10 s, red (`#ef4444`) + `animate-pulse` for ≤3 s.

**CategoryResultPage score breakdown** — `totalScore = scores[currentCategory]` (already includes perfect bonus after `completeCategory()` runs). `perfectBonus = isPerfect ? 50 : 0`; `baseScore = totalScore - perfectBonus`. Wrong answers show user's choice vs correct answer with explanation, with a collapse toggle.

**FinalResultPage** — `getGrade(totalScore)` returns `{ grade, label, emoji }` with point-based thresholds (S≥550, A≥450, B≥350, C≥250, D<250). `durationSeconds` is computed via lazy `useState(() => Math.round((Date.now() - startedAt) / 1000))` so it runs only once on mount. Count-up animation uses `setInterval` in `useCountUp` hook. Category bar widths animate from 0% to actual percentage via `animated` state toggled after 400 ms. Share button copies formatted score text to clipboard. `resetQuiz()` store action keeps nickname but clears scores/answers/phase for "다시 도전하기".

**LeaderboardPage** — reads `localStorage` on mount into local state. Top-3 rendered as a podium (display order: 2nd | 1st | 3rd). Rows 4–20 in a table. Current-session row highlighted via `location.state.currentSessionId`. Data-clear confirmation uses `Modal.tsx`. Route `/leaderboard` is public (no `RequireSession` guard).

**getGrade** — signature changed from ratio-based `(score, total) → string` to point-based `(totalScore) → { grade, label, emoji }`. Update all callers accordingly.

### Data

`src/data/questions.ts` — 60 questions total (20 per category: `KOREAN_HISTORY`, `SCIENCE`, `ENGLISH`), targeting elementary school 5th grade level.

### Types

All shared types live in `src/types/index.ts`: `Category`, `Difficulty`, `Question`, `PlayerRecord`, `GameSession`.

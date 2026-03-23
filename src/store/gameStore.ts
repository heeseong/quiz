import { create } from 'zustand';
import type { Category, GameSession, PlayerRecord } from '../types';
import { questions } from '../data/questions';

const LEADERBOARD_KEY = 'quiz_leaderboard';
const MAX_LEADERBOARD = 20;

const INITIAL_SCORES: Record<Category, number> = {
  KOREAN_HISTORY: 0,
  SCIENCE: 0,
  ENGLISH: 0,
};

const initialSession: GameSession = {
  nickname: '',
  currentCategory: null,
  currentQuestionIndex: 0,
  answers: {},
  scores: { ...INITIAL_SCORES },
  startedAt: 0,
  phase: 'HOME',
};

interface GameStore extends GameSession {
  setNickname: (nickname: string) => void;
  startCategory: (category: Category) => void;
  /** selected: original option index (0-3), or -1 for time-out */
  submitAnswer: (questionId: string, selected: number, timeSpent: number) => void;
  nextQuestion: () => void;
  completeCategory: () => void;
  resetGame: () => void;
  resetQuiz: () => void;
  getLeaderboard: () => PlayerRecord[];
  saveToLeaderboard: (record: PlayerRecord) => void;
}

function calcScore(isCorrect: boolean, timeSpent: number): number {
  if (!isCorrect) return 0;
  return timeSpent <= 10 ? 15 : 10;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialSession,

  setNickname(nickname) {
    set({ nickname, phase: 'CATEGORY_SELECT', startedAt: Date.now() });
  },

  startCategory(category) {
    set({
      currentCategory: category,
      currentQuestionIndex: 0,
      phase: 'QUIZ',
    });
  },

  submitAnswer(questionId, selected, timeSpent) {
    const { answers, scores, currentCategory } = get();
    const question = questions.find((q) => q.id === questionId);
    if (!question || !currentCategory) return;

    const isCorrect = selected !== -1 && selected === question.answer;
    const earned = calcScore(isCorrect, timeSpent);

    set({
      answers: {
        ...answers,
        [questionId]: { selected, isCorrect, timeSpent },
      },
      scores: {
        ...scores,
        [currentCategory]: scores[currentCategory] + earned,
      },
    });
  },

  nextQuestion() {
    const { currentQuestionIndex } = get();
    set({ currentQuestionIndex: currentQuestionIndex + 1 });
  },

  completeCategory() {
    const { scores, currentCategory, answers } = get();
    if (!currentCategory) return;

    const categoryQuestions = questions.filter((q) => q.category === currentCategory);
    const allCorrect = categoryQuestions.every((q) => answers[q.id]?.isCorrect);
    if (allCorrect) {
      set({
        scores: {
          ...scores,
          [currentCategory]: scores[currentCategory] + 50,
        },
      });
    }

    set({ phase: 'CATEGORY_RESULT' });
  },

  resetGame() {
    set({ ...initialSession });
  },

  resetQuiz() {
    const { nickname } = get();
    set({ ...initialSession, nickname, startedAt: Date.now(), phase: 'CATEGORY_SELECT' });
  },

  getLeaderboard() {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      return raw ? (JSON.parse(raw) as PlayerRecord[]) : [];
    } catch {
      return [];
    }
  },

  saveToLeaderboard(record) {
    try {
      const existing = get().getLeaderboard();
      const updated = [...existing, record]
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, MAX_LEADERBOARD);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    } catch {
      // Silently ignore storage errors (private browsing, quota exceeded)
    }
  },
}));

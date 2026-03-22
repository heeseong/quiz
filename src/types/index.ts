export type Category = 'KOREAN_HISTORY' | 'SCIENCE' | 'ENGLISH';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface PlayerRecord {
  sessionId: string;
  nickname: string;
  totalScore: number;
  categoryScores: Record<Category, number>;
  correctCount: number;
  playedAt: string; // ISO 8601
  durationSeconds: number;
}

export interface GameSession {
  nickname: string;
  currentCategory: Category | null;
  currentQuestionIndex: number;
  answers: Record<string, { selected: number; isCorrect: boolean; timeSpent: number }>;
  scores: Record<Category, number>;
  startedAt: number; // Date.now()
  phase: 'HOME' | 'NICKNAME' | 'CATEGORY_SELECT' | 'QUIZ' | 'CATEGORY_RESULT' | 'FINAL_RESULT';
}

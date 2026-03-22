import type { Category, Question } from '../types';

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleOptions(question: Question): {
  shuffledOptions: string[];
  newAnswerIndex: number;
  /** shuffledToOriginal[shuffledPos] = originalPos */
  shuffledToOriginal: number[];
} {
  const indexed = question.options.map((opt, i) => ({ opt, i }));
  const shuffled = shuffleArray(indexed);
  const newAnswerIndex = shuffled.findIndex((item) => item.i === question.answer);
  return {
    shuffledOptions: shuffled.map((item) => item.opt),
    newAnswerIndex,
    shuffledToOriginal: shuffled.map((item) => item.i),
  };
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}분` : `${m}분 ${s}초`;
}

export function getGrade(score: number, total: number): string {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.97) return 'A+';
  if (ratio >= 0.93) return 'A';
  if (ratio >= 0.90) return 'A-';
  if (ratio >= 0.87) return 'B+';
  if (ratio >= 0.83) return 'B';
  if (ratio >= 0.80) return 'B-';
  if (ratio >= 0.77) return 'C+';
  if (ratio >= 0.73) return 'C';
  if (ratio >= 0.70) return 'C-';
  if (ratio >= 0.60) return 'D';
  return 'F';
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    KOREAN_HISTORY: '한국사',
    SCIENCE: '과학',
    ENGLISH: '영어',
  };
  return labels[category];
}

export function getCategoryEmoji(category: Category): string {
  const emojis: Record<Category, string> = {
    KOREAN_HISTORY: '📜',
    SCIENCE: '🔬',
    ENGLISH: '🔤',
  };
  return emojis[category];
}

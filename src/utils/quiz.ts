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

export function getGrade(totalScore: number): { grade: string; label: string; emoji: string } {
  if (totalScore >= 550) return { grade: 'S', label: '퀴즈 천재!', emoji: '🏆' };
  if (totalScore >= 450) return { grade: 'A', label: '훌륭해요!', emoji: '⭐' };
  if (totalScore >= 350) return { grade: 'B', label: '잘했어요!', emoji: '👍' };
  if (totalScore >= 250) return { grade: 'C', label: '조금만 더!', emoji: '😊' };
  return { grade: 'D', label: '다시 도전!', emoji: '💪' };
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

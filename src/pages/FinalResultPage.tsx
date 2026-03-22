import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { getGrade, getCategoryLabel, getCategoryEmoji, formatTime } from '../utils/quiz';
import type { Category } from '../types';

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

export default function FinalResultPage() {
  const navigate = useNavigate();
  const { nickname, scores, answers, startedAt, resetGame, saveToLeaderboard } = useGameStore(
    (s) => s
  );
  const saved = useRef(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const correctCount = questions.filter((q) => answers[q.id]?.isCorrect).length;
  const maxScore = questions.length * 15 + 3 * 50; // 모든 10초 정답 + 3카테고리 퍼펙트
  const durationSeconds = Math.round((Date.now() - startedAt) / 1000);

  useEffect(() => {
    if (saved.current || !nickname) return;
    saved.current = true;
    saveToLeaderboard({
      sessionId: uuidv4(),
      nickname,
      totalScore,
      categoryScores: { ...scores },
      correctCount,
      playedAt: new Date().toISOString(),
      durationSeconds,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const grade = getGrade(totalScore, maxScore);

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold text-indigo-700">🎉 최종 결과</h1>
      <p className="text-gray-500">{nickname}님의 성적</p>

      <div className="bg-white rounded-2xl shadow p-8 space-y-3">
        <p className="text-6xl font-extrabold text-indigo-600">{totalScore}점</p>
        <p className="text-3xl font-bold text-yellow-500">{grade}</p>
        <p className="text-gray-500">
          {questions.length}문제 중 <strong>{correctCount}문제</strong> 정답 · 소요 시간{' '}
          {formatTime(durationSeconds)}
        </p>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className="flex items-center justify-between bg-white rounded-xl shadow px-5 py-4"
          >
            <span className="font-medium text-gray-700">
              {getCategoryEmoji(cat)} {getCategoryLabel(cat)}
            </span>
            <span className="font-bold text-indigo-600">{scores[cat]}점</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          resetGame();
          navigate('/');
        }}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-2xl text-lg transition-colors shadow"
      >
        처음으로
      </button>
    </div>
  );
}

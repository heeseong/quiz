import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { getCategoryLabel, getCategoryEmoji } from '../utils/quiz';
import type { Category } from '../types';

const ALL_CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

/** 원형 정답률 차트 */
function AccuracyRing({ correct, total }: { correct: number; total: number }) {
  const R = 56;
  const CIRC = 2 * Math.PI * R;
  const pct = total === 0 ? 0 : correct / total;
  const offset = CIRC * (1 - pct);
  const color = pct >= 0.8 ? '#22c55e' : pct >= 0.5 ? '#f59e0b' : '#ef4444';
  const label = Math.round(pct * 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 136, height: 136 }}>
      <svg width="136" height="136" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="68" cy="68" r={R} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="68" cy="68" r={R} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-2xl font-bold" style={{ color }}>{label}%</span>
        <span className="text-xs text-gray-400 mt-1">정답률</span>
      </div>
    </div>
  );
}

export default function CategoryResultPage() {
  const navigate = useNavigate();
  const { currentCategory, scores, answers } = useGameStore((s) => s);
  const [showWrong, setShowWrong] = useState(true);

  if (!currentCategory) {
    navigate('/category');
    return null;
  }

  const catQuestions = questions.filter((q) => q.category === currentCategory);
  const correctCount = catQuestions.filter((q) => answers[q.id]?.isCorrect).length;
  const wrongQuestions = catQuestions.filter((q) => answers[q.id] && !answers[q.id].isCorrect);
  const totalScore = scores[currentCategory];
  const isPerfect = correctCount === catQuestions.length;
  const perfectBonus = isPerfect ? 50 : 0;
  const baseScore = totalScore - perfectBonus;

  // 모든 카테고리 완료 여부 확인
  const allDone = ALL_CATEGORIES.every((cat) => {
    const catQs = questions.filter((q) => q.category === cat);
    return catQs.every((q) => answers[q.id] !== undefined);
  });

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-10 space-y-6 animate-fade-up">

      {/* ── 헤더 ── */}
      <div className="text-center">
        <p className="text-4xl mb-2">{getCategoryEmoji(currentCategory)}</p>
        <h1 className="text-xl font-bold text-gray-800">
          {getCategoryLabel(currentCategory)} 결과
        </h1>
      </div>

      {/* ── 점수 카드 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between gap-4">
          {/* 원형 정답률 */}
          <AccuracyRing correct={correctCount} total={catQuestions.length} />

          {/* 점수 상세 */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">문제 결과</p>
              <p className="text-lg font-bold text-gray-800">
                {catQuestions.length}문제 중 <span className="text-[#3B5BA5]">{correctCount}문제</span> 정답
              </p>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">기본 점수</span>
                <span className="font-semibold text-gray-700">+{baseScore}점</span>
              </div>
              {isPerfect && (
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">🏆 퍼펙트 보너스</span>
                  <span className="font-semibold text-yellow-600">+{perfectBonus}점</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-1.5">
                <span className="text-gray-700">합계</span>
                <span className="text-[#3B5BA5]">{totalScore}점</span>
              </div>
            </div>
          </div>
        </div>

        {isPerfect && (
          <div className="mt-4 text-center bg-yellow-50 rounded-xl py-2 text-sm text-yellow-700 font-semibold">
            🎉 모든 문제를 맞혔습니다! 퍼펙트 보너스 +50점 획득!
          </div>
        )}
      </div>

      {/* ── 오답 목록 ── */}
      {wrongQuestions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowWrong((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-700 text-sm">
              ❌ 틀린 문제 {wrongQuestions.length}개
            </span>
            <span className="text-gray-400 text-sm">{showWrong ? '▲ 접기' : '▼ 펼치기'}</span>
          </button>

          {showWrong && (
            <div className="divide-y divide-gray-100">
              {wrongQuestions.map((q, i) => {
                const ans = answers[q.id];
                const isTimeout = ans?.selected === -1;
                const myText = isTimeout ? '(시간 초과)' : q.options[ans.selected];
                const correctText = q.options[q.answer];

                return (
                  <div key={q.id} className="px-5 py-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400">문제 {i + 1}</p>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{q.question}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 shrink-0">❌</span>
                        <span className="text-red-600">{myText}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 shrink-0">✅</span>
                        <span className="text-green-700 font-medium">{correctText}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 하단 버튼 ── */}
      <button
        onClick={() => navigate(allDone ? '/result/final' : '/category')}
        className="w-full bg-[#3B5BA5] hover:bg-[#2d4a8a] text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-sm"
      >
        {allDone ? '🏁 최종 결과 보기' : '다른 카테고리 선택하기 →'}
      </button>
    </div>
  );
}

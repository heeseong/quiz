import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { getGrade, getCategoryLabel, getCategoryEmoji, formatTime } from '../utils/quiz';
import type { Category } from '../types';

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

const GRADE_STYLES: Record<string, { bg: string; ring: string; text: string }> = {
  S: { bg: 'from-yellow-400 to-amber-500', ring: 'border-yellow-400', text: 'text-yellow-700' },
  A: { bg: 'from-emerald-400 to-green-500', ring: 'border-emerald-400', text: 'text-emerald-700' },
  B: { bg: 'from-[#3B5BA5] to-blue-600', ring: 'border-[#3B5BA5]', text: 'text-[#3B5BA5]' },
  C: { bg: 'from-orange-400 to-amber-500', ring: 'border-orange-400', text: 'text-orange-700' },
  D: { bg: 'from-gray-400 to-gray-500', ring: 'border-gray-400', text: 'text-gray-600' },
};

function useCountUp(target: number, duration = 1500) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setDisplay(Math.round((step / steps) * target));
      if (step >= steps) clearInterval(id);
    }, stepTime);
    return () => clearInterval(id);
  }, [target, duration]);
  return display;
}

export default function FinalResultPage() {
  const navigate = useNavigate();
  const { nickname, scores, answers, startedAt, resetGame, resetQuiz, saveToLeaderboard } =
    useGameStore((s) => s);

  const saved = useRef(false);
  const sessionIdRef = useRef(crypto.randomUUID());
  const [copied, setCopied] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [durationSeconds] = useState(() => Math.round((Date.now() - startedAt) / 1000));

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const correctCount = questions.filter((q) => answers[q.id]?.isCorrect).length;

  const grade = getGrade(totalScore);
  const gradeStyle = GRADE_STYLES[grade.grade] ?? GRADE_STYLES['D'];

  const displayScore = useCountUp(totalScore);

  useEffect(() => {
    if (saved.current || !nickname) return;
    saved.current = true;
    saveToLeaderboard({
      sessionId: sessionIdRef.current,
      nickname,
      totalScore,
      categoryScores: { ...scores },
      correctCount,
      playedAt: new Date().toISOString(),
      durationSeconds,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(id);
  }, []);

  async function handleShare() {
    const lines = CATEGORIES.map(
      (c) => `${getCategoryLabel(c)}: ${scores[c]}점`
    ).join(' | ');
    const text = `📚 상식 퀴즈 결과\n총점: ${totalScore}점 (${grade.grade}등급)\n${lines}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-10 space-y-5 animate-fade-up">

      {/* ── 최종 점수 + 등급 ── */}
      <div className={`bg-gradient-to-br ${gradeStyle.bg} rounded-3xl p-6 text-white text-center shadow-lg`}>
        <p className="text-5xl mb-1">{grade.emoji}</p>
        <p className="text-6xl font-extrabold leading-none mb-2">{displayScore}점</p>
        <p className="text-3xl font-bold">{grade.grade}등급</p>
        <p className="text-lg font-medium opacity-90 mt-1">{grade.label}</p>
        <p className="text-sm opacity-75 mt-3">
          {nickname}님 · {questions.length}문제 중 {correctCount}문제 정답 · {formatTime(durationSeconds)}
        </p>
      </div>

      {/* ── 카테고리별 점수 ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">카테고리별 결과</h2>
        {CATEGORIES.map((cat) => {
          const catQs = questions.filter((q) => q.category === cat);
          const catCorrect = catQs.filter((q) => answers[q.id]?.isCorrect).length;
          const accuracy = Math.round((catCorrect / catQs.length) * 100);
          // max per category: 20*15 + 50 = 350
          const maxCatScore = catQs.length * 15 + 50;
          const barPct = Math.min(100, Math.round((scores[cat] / maxCatScore) * 100));

          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-gray-700">
                  {getCategoryEmoji(cat)} {getCategoryLabel(cat)}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">{catCorrect}/{catQs.length} ({accuracy}%)</span>
                  <span className="font-bold text-[#3B5BA5]">{scores[cat]}점</span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B5BA5] rounded-full transition-all duration-700 ease-out"
                  style={{ width: animated ? `${barPct}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 리더보드 저장 안내 ── */}
      <div className="bg-[#f0f4ff] rounded-xl px-4 py-3 text-sm text-[#3B5BA5] text-center font-medium">
        🏆 {nickname}님의 점수가 리더보드에 저장되었습니다!
      </div>

      {/* ── 공유 버튼 ── */}
      <button
        onClick={handleShare}
        className="w-full border-2 border-[#3B5BA5] text-[#3B5BA5] font-semibold py-3 rounded-2xl hover:bg-[#f0f4ff] transition-colors text-sm"
      >
        {copied ? '✅ 클립보드에 복사되었습니다!' : '📋 결과 공유하기'}
      </button>

      {/* ── 액션 버튼 ── */}
      <div className="space-y-2.5">
        <button
          onClick={() => navigate('/leaderboard', { state: { currentSessionId: sessionIdRef.current } })}
          className="w-full bg-[#3B5BA5] hover:bg-[#2d4a8a] text-white font-semibold py-4 rounded-2xl transition-colors text-base shadow-sm"
        >
          🏆 리더보드 보기
        </button>
        <button
          onClick={() => { resetQuiz(); navigate('/category'); }}
          className="w-full bg-white border-2 border-[#3B5BA5] text-[#3B5BA5] font-semibold py-4 rounded-2xl hover:bg-[#f0f4ff] transition-colors text-base"
        >
          🔄 다시 도전하기
        </button>
        <button
          onClick={() => { resetGame(); navigate('/'); }}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-2xl transition-colors text-sm"
        >
          처음으로
        </button>
      </div>
    </div>
  );
}

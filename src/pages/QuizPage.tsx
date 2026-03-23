import { useState, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { shuffleOptions, getCategoryLabel, getCategoryEmoji } from '../utils/quiz';
import { useTimer } from '../hooks/useTimer';
import Badge from '../components/Badge';
import FeedbackOverlay from '../components/FeedbackOverlay';
import type { Question } from '../types';

const TIME_LIMIT = 30;

interface ShuffledQ {
  question: Question;
  shuffledOptions: string[];
  newAnswerIndex: number;
  /** shuffledToOriginal[shuffledPos] = originalOptionIndex */
  shuffledToOriginal: number[];
}

function prepareQuestions(category: string): ShuffledQ[] {
  return questions
    .filter((q) => q.category === category)
    .map((q) => {
      const { shuffledOptions, newAnswerIndex, shuffledToOriginal } = shuffleOptions(q);
      return { question: q, shuffledOptions, newAnswerIndex, shuffledToOriginal };
    });
}

/** 원형 타이머 SVG */
function CircularTimer({ remaining, max }: { remaining: number; max: number }) {
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - remaining / max);
  const color = remaining <= 3 ? '#ef4444' : remaining <= 10 ? '#f97316' : '#3B5BA5';
  const isPulsing = remaining <= 3;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${isPulsing ? 'animate-pulse' : ''}`}
      style={{ width: 92, height: 92 }}
    >
      <svg width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="46" cy="46" r={R} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="46" cy="46" r={R} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-xl font-bold" style={{ color }}>{remaining}</span>
        <span className="text-[10px] text-gray-400 mt-0.5">초</span>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { currentCategory, currentQuestionIndex, scores, submitAnswer, nextQuestion, completeCategory } =
    useGameStore((s) => s);

  const [prepared] = useState<ShuffledQ[]>(() =>
    currentCategory ? prepareQuestions(currentCategory) : []
  );
  type QState = { selected: number | null; revealed: boolean; timeSpentState: number };
  type QAction =
    | { type: 'SELECT'; idx: number; ts: number }
    | { type: 'EXPIRE' }
    | { type: 'RESET' };

  const [{ selected, revealed, timeSpentState }, dispatch] = useReducer(
    (_: QState, action: QAction): QState => {
      switch (action.type) {
        case 'SELECT': return { selected: action.idx, revealed: true, timeSpentState: action.ts };
        case 'EXPIRE': return { selected: null, revealed: true, timeSpentState: TIME_LIMIT };
        case 'RESET':  return { selected: null, revealed: false, timeSpentState: 0 };
      }
    },
    { selected: null, revealed: false, timeSpentState: 0 }
  );

  const current = prepared[currentQuestionIndex];

  const handleExpire = useCallback(() => {
    if (revealed || !current) return;
    dispatch({ type: 'EXPIRE' });
    submitAnswer(current.question.id, -1, TIME_LIMIT);
  }, [revealed, current, submitAnswer]);

  const { remaining, stop } = useTimer(TIME_LIMIT, handleExpire);

  // 문제가 바뀔 때 상태 초기화
  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, [currentQuestionIndex]);

  if (!currentCategory || !current) {
    navigate('/category');
    return null;
  }

  function handleSelect(shuffledIdx: number) {
    if (revealed) return;
    stop();
    const ts = TIME_LIMIT - remaining;
    dispatch({ type: 'SELECT', idx: shuffledIdx, ts });
    const originalIdx = current.shuffledToOriginal[shuffledIdx] as 0 | 1 | 2 | 3;
    submitAnswer(current.question.id, originalIdx, ts);
  }

  function handleNext() {
    if (currentQuestionIndex + 1 >= prepared.length) {
      completeCategory();
      navigate('/result/category');
    } else {
      nextQuestion();
    }
  }

  const isCorrect = selected !== null && selected === current.newAnswerIndex;
  const isTimeout = revealed && selected === null;
  const feedbackResult = isCorrect ? 'correct' : isTimeout ? 'timeout' : 'wrong';

  const earnedBase = isCorrect ? 10 : 0;
  const earnedBonus = isCorrect && timeSpentState <= 10 ? 5 : 0;

  const progress = ((currentQuestionIndex + 1) / prepared.length) * 100;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const isLastQuestion = currentQuestionIndex + 1 >= prepared.length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-32 space-y-4 animate-fade-up">

      {/* ── 상단 헤더 ── */}
      <div className="flex items-center justify-between gap-2">
        <Badge color="category" category={currentCategory ?? undefined}>
          {getCategoryEmoji(currentCategory)} {getCategoryLabel(currentCategory)}
        </Badge>
        <span className="text-sm font-medium text-gray-500">
          {currentQuestionIndex + 1} / {prepared.length}
        </span>
        <span className="text-sm font-bold text-[#3B5BA5]">{totalScore}점</span>
      </div>

      {/* ── 진행 바 ── */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3B5BA5] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── 타이머 + 문제 ── */}
      <div className="flex items-start gap-3">
        <CircularTimer remaining={remaining} max={TIME_LIMIT} />
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[92px] flex items-center">
          <div>
            <p className="text-xs text-gray-400 mb-1 font-medium">Q{currentQuestionIndex + 1}</p>
            <p className="text-[15px] font-medium text-gray-800 leading-relaxed">
              {current.question.question}
            </p>
          </div>
        </div>
      </div>

      {/* ── 선택지 ── */}
      <div className="space-y-2.5">
        {current.shuffledOptions.map((opt, idx) => {
          const isAnswer = idx === current.newAnswerIndex;
          const isSelected = idx === selected;

          let cls =
            'w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 flex items-center gap-3 ';

          if (!revealed) {
            cls += 'border-gray-200 bg-white hover:border-[#3B5BA5] hover:bg-[#f0f4ff] active:scale-[0.98]';
          } else if (isAnswer) {
            cls += 'border-green-500 bg-green-50 text-green-800';
          } else if (isSelected) {
            cls += 'border-red-400 bg-red-50 text-red-700';
          } else {
            cls += 'border-gray-100 bg-gray-50 text-gray-400 cursor-default';
          }

          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
            >
              <span
                className={`text-base shrink-0 w-6 text-center ${
                  !revealed ? 'text-gray-400' : isAnswer ? 'text-green-600' : isSelected ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                {['①', '②', '③', '④'][idx]}
              </span>
              <span className="flex-1">{opt}</span>
              {revealed && isAnswer && <span className="text-green-500">✅</span>}
              {revealed && isSelected && !isAnswer && <span className="text-red-400">❌</span>}
            </button>
          );
        })}
      </div>

      {/* ── 피드백 오버레이 ── */}
      {revealed && (
        <FeedbackOverlay
          result={feedbackResult}
          earnedBase={earnedBase}
          earnedBonus={earnedBonus}
          explanation={current.question.explanation}
          correctText={current.shuffledOptions[current.newAnswerIndex]}
          isLastQuestion={isLastQuestion}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

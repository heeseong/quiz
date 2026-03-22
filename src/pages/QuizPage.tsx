import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { shuffleOptions, getCategoryLabel, getCategoryEmoji } from '../utils/quiz';
import { useTimer } from '../hooks/useTimer';
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

export default function QuizPage() {
  const navigate = useNavigate();
  const { currentCategory, currentQuestionIndex, submitAnswer, nextQuestion, completeCategory } =
    useGameStore((s) => s);

  const [prepared] = useState<ShuffledQ[]>(() =>
    currentCategory ? prepareQuestions(currentCategory) : []
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [questionStart, setQuestionStart] = useState(Date.now());

  const current = prepared[currentQuestionIndex];

  const handleExpire = useCallback(() => {
    if (revealed || !current) return;
    submitAnswer(current.question.id, -1, TIME_LIMIT);
    setRevealed(true);
  }, [revealed, current, submitAnswer]);

  const timeLeft = useTimer(TIME_LIMIT, handleExpire);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setQuestionStart(Date.now());
  }, [currentQuestionIndex]);

  if (!currentCategory || !current) {
    navigate('/category');
    return null;
  }

  function handleSelect(shuffledIdx: number) {
    if (revealed) return;
    const timeSpent = Math.round((Date.now() - questionStart) / 1000);
    setSelected(shuffledIdx);
    setRevealed(true);
    // Map shuffled index back to original option index for the store
    const originalIdx = current.shuffledToOriginal[shuffledIdx] as 0 | 1 | 2 | 3;
    submitAnswer(current.question.id, originalIdx, timeSpent);
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
  const progress = ((currentQuestionIndex + 1) / prepared.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-indigo-700">
          {getCategoryEmoji(currentCategory)} {getCategoryLabel(currentCategory)}
        </span>
        <span className="text-gray-500 text-sm">
          {currentQuestionIndex + 1} / {prepared.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <span
          className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-indigo-600'}`}
        >
          ⏱ {timeLeft}초
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-lg font-medium text-gray-800 leading-relaxed">
          {current.question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.shuffledOptions.map((opt, idx) => {
          let cls =
            'w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-colors ';
          if (!revealed) {
            cls += 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50';
          } else if (idx === current.newAnswerIndex) {
            cls += 'border-green-500 bg-green-50 text-green-800';
          } else if (idx === selected) {
            cls += 'border-red-400 bg-red-50 text-red-700';
          } else {
            cls += 'border-gray-200 bg-gray-50 text-gray-400';
          }

          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className="mr-3 text-gray-400">{['①', '②', '③', '④'][idx]}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {revealed && (
        <div className="space-y-4">
          <div
            className={`rounded-xl p-4 text-sm ${
              selected === null
                ? 'bg-red-50 border border-red-200 text-red-800'
                : isCorrect
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="font-semibold mb-1">
              {selected === null ? '⏰ 시간 초과!' : isCorrect ? '✅ 정답!' : '❌ 오답'}
            </p>
            <p>{current.question.explanation}</p>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {currentQuestionIndex + 1 >= prepared.length ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
}

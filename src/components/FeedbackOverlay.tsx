import { useEffect, useRef, useState } from 'react';

type FeedbackResult = 'correct' | 'wrong' | 'timeout';

interface FeedbackOverlayProps {
  result: FeedbackResult;
  earnedBase: number;
  earnedBonus: number;
  explanation: string;
  correctText: string;
  isLastQuestion: boolean;
  onNext: () => void;
}

const AUTO_ADVANCE_SEC = 2;

export default function FeedbackOverlay({
  result,
  earnedBase,
  earnedBonus,
  explanation,
  correctText,
  isLastQuestion,
  onNext,
}: FeedbackOverlayProps) {
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SEC);
  const onNextRef = useRef(onNext);
  useEffect(() => { onNextRef.current = onNext; });

  useEffect(() => {
    if (countdown <= 0) {
      onNextRef.current();
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const borderColor =
    result === 'correct' ? 'border-green-400' : result === 'wrong' ? 'border-red-400' : 'border-gray-400';

  const totalEarned = earnedBase + earnedBonus;

  const circleR = 16;
  const circleC = 2 * Math.PI * circleR;
  const progressOffset = circleC * (countdown / AUTO_ADVANCE_SEC);

  return (
    <>
      {/* dim backdrop */}
      <div className="fixed inset-0 bg-black/25 z-40" />

      {/* bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className={`bg-white rounded-t-3xl shadow-2xl border-t-4 ${borderColor} px-6 pt-6 pb-10`}>

          {/* result headline */}
          <div className="text-center mb-4">
            {result === 'correct' && (
              <p className={`text-2xl font-bold text-green-600 ${earnedBase > 0 ? 'animate-sparkle' : ''}`}>
                🎉 정답입니다!
              </p>
            )}
            {result === 'wrong' && (
              <p className="text-2xl font-bold text-red-500">😢 아쉽네요!</p>
            )}
            {result === 'timeout' && (
              <p className="text-2xl font-bold text-gray-500">⏰ 시간 초과!</p>
            )}
          </div>

          {/* score chips */}
          {result === 'correct' && (
            <div className="flex justify-center gap-2 mb-4">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                +{earnedBase}점
              </span>
              {earnedBonus > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
                  ⚡ 스피드 +{earnedBonus}점
                </span>
              )}
            </div>
          )}

          {/* correct answer (for wrong / timeout) */}
          {result !== 'correct' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 text-sm text-green-800 text-center">
              <span className="font-semibold">정답: </span>{correctText}
            </div>
          )}

          {/* explanation */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6 text-center">{explanation}</p>

          {/* next button + countdown ring */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNextRef.current()}
              className="flex-1 bg-[#3B5BA5] hover:bg-[#2d4a8a] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {isLastQuestion ? '결과 보기 →' : '다음 문제 →'}
            </button>

            {/* countdown ring */}
            <div className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
              <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="22" cy="22" r={circleR} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="22" cy="22" r={circleR} fill="none"
                  stroke="#3B5BA5" strokeWidth="3"
                  strokeDasharray={circleC}
                  strokeDashoffset={circleC - progressOffset}
                  style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                />
              </svg>
              <span className="absolute text-xs font-bold text-[#3B5BA5]">{countdown}</span>
            </div>
          </div>

          {/* total score earned */}
          {totalEarned > 0 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              이번 문제 획득 점수: <strong className="text-gray-600">+{totalEarned}점</strong>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

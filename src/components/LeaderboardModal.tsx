import { useEffect } from 'react';
import { X, Trophy, Medal } from 'lucide-react';
import type { PlayerRecord } from '../types';
import { getCategoryEmoji } from '../utils/quiz';
import type { Category } from '../types';

interface Props {
  records: PlayerRecord[];
  onClose: () => void;
}

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

const rankStyle = [
  'text-yellow-500',
  'text-gray-400',
  'text-amber-600',
];

const rankBg = [
  'bg-yellow-50 border-yellow-200',
  'bg-gray-50 border-gray-200',
  'bg-amber-50 border-amber-200',
];

export default function LeaderboardModal({ records, onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-scale-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#3B5BA5]">
            <Trophy size={22} className="text-yellow-500" />
            명예의 전당
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Trophy size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">아직 기록이 없어요!</p>
              <p className="text-sm mt-1">첫 번째 도전자가 되어보세요 🚀</p>
            </div>
          ) : (
            records.map((r, i) => (
              <div
                key={r.sessionId}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${
                  i < 3 ? rankBg[i] : 'bg-gray-50 border-gray-100'
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {i < 3 ? (
                    <Medal size={22} className={rankStyle[i]} />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate">{r.nickname}</p>
                  <div className="flex gap-2 mt-0.5">
                    {CATEGORIES.map((cat) => (
                      <span key={cat} className="text-xs text-gray-400">
                        {getCategoryEmoji(cat)}{r.categoryScores[cat]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-[#3B5BA5] text-lg leading-none">
                    {r.totalScore}
                  </p>
                  <p className="text-xs text-gray-400">점</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#e8edf8] text-[#3B5BA5] font-semibold hover:bg-[#d0d9f0] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

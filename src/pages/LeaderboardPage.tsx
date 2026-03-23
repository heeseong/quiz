import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import type { PlayerRecord, Category } from '../types';
import Modal from '../components/Modal';

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];
const CATEGORY_EMOJI: Record<Category, string> = {
  KOREAN_HISTORY: '📜',
  SCIENCE: '🔬',
  ENGLISH: '🔤',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// 포디엄 화면 표시 순서: 왼쪽=2위(index 1), 가운데=1위(index 0), 오른쪽=3위(index 2)
const PODIUM_ORDER = [1, 0, 2];

const MEDAL = [
  { bg: 'bg-yellow-400', text: 'text-yellow-900', emoji: '🥇', rank: '1위', height: 'h-28' },
  { bg: 'bg-gray-300',  text: 'text-gray-800',   emoji: '🥈', rank: '2위', height: 'h-20' },
  { bg: 'bg-amber-600', text: 'text-amber-100',  emoji: '🥉', rank: '3위', height: 'h-16' },
];

function PodiumCard({ record, rankIdx }: { record: PlayerRecord; rankIdx: number }) {
  const m = MEDAL[rankIdx];
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <p className="text-2xl">{m.emoji}</p>
      <p className="text-xs font-bold text-gray-700 truncate w-full text-center px-1">
        {record.nickname}
      </p>
      <p className="text-sm font-extrabold text-[#3B5BA5]">{record.totalScore}점</p>
      <div className={`w-full ${m.height} ${m.bg} rounded-t-xl flex items-start justify-center pt-2`}>
        <span className={`text-xs font-bold ${m.text}`}>{m.rank}</span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const getLeaderboard = useGameStore((s) => s.getLeaderboard);

  const currentSessionId =
    (location.state as { currentSessionId?: string } | null)?.currentSessionId;

  const [records, setRecords] = useState<PlayerRecord[]>(() => getLeaderboard());
  const [showConfirm, setShowConfirm] = useState(false);

  const top3 = records.slice(0, 3);
  const rest = records.slice(3);

  function handleClearData() {
    localStorage.removeItem('quiz_leaderboard');
    setRecords([]);
    setShowConfirm(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-10 space-y-5 animate-fade-up">

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#3B5BA5]">🏆 명예의 전당</h1>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-gray-100"
        >
          홈으로
        </button>
      </div>

      {/* ── 빈 상태 ── */}
      {records.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">🏆</p>
          <p className="font-semibold text-gray-600">아직 기록이 없어요.</p>
          <p className="text-sm text-gray-400 mt-1">첫 번째 도전자가 되어보세요!</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-[#3B5BA5] text-white text-sm font-semibold rounded-xl hover:bg-[#2d4a8a] transition-colors"
          >
            퀴즈 시작하기
          </button>
        </div>
      )}

      {/* ── TOP 3 포디엄 ── */}
      {top3.length >= 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4 text-center">
            TOP 3
          </p>
          <div className="flex items-end gap-2">
            {PODIUM_ORDER.map((rankIdx) => {
              const record = top3[rankIdx];
              if (!record) return <div key={rankIdx} className="flex-1" />;
              return <PodiumCard key={record.sessionId} record={record} rankIdx={rankIdx} />;
            })}
          </div>
        </div>
      )}

      {/* ── 현재 세션 TOP 3 포함 알림 ── */}
      {currentSessionId && top3.some((r) => r.sessionId === currentSessionId) && (
        <p className="text-center text-xs text-[#3B5BA5] font-medium">
          ★ 현재 세션 결과가 TOP 3에 포함되어 있습니다!
        </p>
      )}

      {/* ── 4위~20위 테이블 ── */}
      {rest.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* 헤더 행 */}
          <div className="grid grid-cols-[36px_1fr_64px_40px_72px] text-xs font-semibold text-gray-400 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-center">순위</span>
            <span>닉네임</span>
            <span className="text-right">총점</span>
            <span className="text-right">정답</span>
            <span className="text-right">날짜</span>
          </div>

          <div className="divide-y divide-gray-100">
            {rest.map((r, i) => {
              const isMe = r.sessionId === currentSessionId;
              return (
                <div
                  key={r.sessionId}
                  className={`grid grid-cols-[36px_1fr_64px_40px_72px] items-center px-4 py-3 text-sm ${
                    isMe ? 'bg-[#f0f4ff]' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-center font-bold ${isMe ? 'text-[#3B5BA5]' : 'text-gray-400'}`}>
                    {i + 4}
                  </span>
                  <span className={`font-semibold truncate ${isMe ? 'text-[#3B5BA5]' : 'text-gray-800'}`}>
                    {isMe && '★ '}{r.nickname}
                  </span>
                  <span className={`text-right font-bold ${isMe ? 'text-[#3B5BA5]' : 'text-gray-700'}`}>
                    {r.totalScore}점
                  </span>
                  <span className="text-right text-gray-500">{r.correctCount}</span>
                  <span className="text-right text-gray-400 text-xs">{formatDate(r.playedAt)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 카테고리 범례 ── */}
      {records.length > 0 && (
        <div className="flex justify-center gap-3 text-xs text-gray-400">
          {CATEGORIES.map((cat) => (
            <span key={cat}>{CATEGORY_EMOJI[cat]} {cat === 'KOREAN_HISTORY' ? '한국사' : cat === 'SCIENCE' ? '과학' : '영어'}</span>
          ))}
        </div>
      )}

      {/* ── 데이터 초기화 ── */}
      {records.length > 0 && (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full text-sm text-gray-400 hover:text-red-500 py-2 transition-colors"
        >
          데이터 초기화
        </button>
      )}

      {/* ── 확인 모달 ── */}
      {showConfirm && (
        <Modal title="리더보드 초기화" onClose={() => setShowConfirm(false)}>
          <p className="text-sm text-gray-600 mb-6">
            모든 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 정말 초기화하시겠습니까?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              취소
            </button>
            <button
              onClick={handleClearData}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
            >
              초기화
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

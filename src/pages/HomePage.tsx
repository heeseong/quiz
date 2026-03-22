import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, BookOpen, FlaskConical, Languages } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LeaderboardModal from '../components/LeaderboardModal';

// 배경 데코 SVG
function BgDecoration() {
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* 상단 우측 원 */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#3B5BA5]/8" />
      {/* 하단 좌측 원 */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#FF6B35]/8" />
      {/* 떠다니는 아이콘들 */}
      <span className="absolute top-14 left-6 text-3xl opacity-20 animate-float">📚</span>
      <span className="absolute top-32 right-8 text-2xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🔬</span>
      <span className="absolute bottom-40 left-10 text-2xl opacity-15 animate-float" style={{ animationDelay: '0.5s' }}>📜</span>
      <span className="absolute bottom-28 right-6 text-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🔤</span>
      {/* 작은 별 */}
      <span className="absolute top-8 right-24 text-lg opacity-25 animate-float" style={{ animationDelay: '0.3s' }}>✨</span>
      <span className="absolute bottom-16 left-28 text-lg opacity-20 animate-float" style={{ animationDelay: '0.8s' }}>⭐</span>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const getLeaderboard = useGameStore((s) => s.getLeaderboard);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const leaderboard = getLeaderboard();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <BgDecoration />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center gap-8 animate-fade-up">

        {/* 타이틀 */}
        <div className="text-center space-y-3">
          <div className="text-7xl animate-float">📚</div>
          <h1 className="text-4xl font-extrabold text-[#3B5BA5] tracking-tight">
            상식 퀴즈
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            한국사 · 과학 · 영어 도전!
          </p>
        </div>

        {/* 카테고리 뱃지 미리보기 */}
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge color="category" category="KOREAN_HISTORY">
            <BookOpen size={13} /> 한국사
          </Badge>
          <Badge color="category" category="SCIENCE">
            <FlaskConical size={13} /> 과학
          </Badge>
          <Badge color="category" category="ENGLISH">
            <Languages size={13} /> 영어
          </Badge>
        </div>

        {/* 버튼 그룹 */}
        <div className="w-full flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full text-xl py-5 shadow-lg shadow-[#3B5BA5]/30"
            onClick={() => navigate('/nickname')}
          >
            <Play size={22} fill="currentColor" />
            플레이 시작
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setShowLeaderboard(true)}
          >
            <Trophy size={20} />
            순위 보기
          </Button>
        </div>

        {/* 하단 통계 뱃지 */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3">
            <span className="text-2xl font-extrabold text-[#3B5BA5]">60</span>
            <span className="text-xs text-gray-400 mt-0.5">총 문제 수</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3">
            <span className="text-2xl font-extrabold text-[#FF6B35]">3</span>
            <span className="text-xs text-gray-400 mt-0.5">카테고리</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3">
            <span className="text-2xl font-extrabold text-emerald-600">{leaderboard.length}</span>
            <span className="text-xs text-gray-400 mt-0.5">참여자</span>
          </div>
        </div>
      </div>

      {showLeaderboard && (
        <LeaderboardModal records={leaderboard} onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}

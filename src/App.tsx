import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import HomePage from './pages/HomePage';
import NicknamePage from './pages/NicknamePage';
import CategorySelectPage from './pages/CategorySelectPage';
import QuizPage from './pages/QuizPage';
import CategoryResultPage from './pages/CategoryResultPage';
import FinalResultPage from './pages/FinalResultPage';
import LeaderboardPage from './pages/LeaderboardPage';

/** nickname이 없으면(게임 세션 없음) 홈으로 리다이렉트 */
function RequireSession({ children }: { children: React.ReactNode }) {
  const nickname = useGameStore((s) => s.nickname);
  if (!nickname) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff5f0]">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/nickname"    element={<NicknamePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* 세션 필요 라우트 */}
          <Route path="/category"       element={<RequireSession><CategorySelectPage /></RequireSession>} />
          <Route path="/quiz"           element={<RequireSession><QuizPage /></RequireSession>} />
          <Route path="/result/category" element={<RequireSession><CategoryResultPage /></RequireSession>} />
          <Route path="/result/final"   element={<RequireSession><FinalResultPage /></RequireSession>} />

          {/* 그 외 → 홈 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

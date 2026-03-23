import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { useSettings } from './hooks/useSettings';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import NicknamePage from './pages/NicknamePage';
import CategorySelectPage from './pages/CategorySelectPage';
import QuizPage from './pages/QuizPage';
import CategoryResultPage from './pages/CategoryResultPage';
import FinalResultPage from './pages/FinalResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

/** nickname이 없으면(게임 세션 없음) 홈으로 리다이렉트 */
function RequireSession({ children }: { children: React.ReactNode }) {
  const nickname = useGameStore((s) => s.nickname);
  if (!nickname) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { settings } = useSettings();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--app-font-size',
      settings.fontSize === 'large' ? '18px' : '16px'
    );
  }, [settings.fontSize]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff5f0]">
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/"            element={<HomePage />} />
            <Route path="/nickname"    element={<NicknamePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings"    element={<SettingsPage />} />

            {/* 세션 필요 라우트 */}
            <Route path="/category"       element={<RequireSession><CategorySelectPage /></RequireSession>} />
            <Route path="/quiz"           element={<RequireSession><QuizPage /></RequireSession>} />
            <Route path="/result/category" element={<RequireSession><CategoryResultPage /></RequireSession>} />
            <Route path="/result/final"   element={<RequireSession><FinalResultPage /></RequireSession>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

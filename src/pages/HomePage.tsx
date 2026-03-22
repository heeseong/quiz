import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function HomePage() {
  const navigate = useNavigate();
  const leaderboard = useGameStore((s) => s.getLeaderboard)();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-indigo-700">📚 상식 퀴즈</h1>
        <p className="text-gray-500">한국사 · 과학 · 영어 60문제 도전!</p>
      </div>

      <button
        onClick={() => navigate('/nickname')}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg"
      >
        <BookOpen size={22} />
        게임 시작
      </button>

      {leaderboard.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-left">
          <h2 className="flex items-center gap-2 font-bold text-lg text-gray-700 mb-4">
            <Trophy size={20} className="text-yellow-500" />
            리더보드 TOP {Math.min(leaderboard.length, 5)}
          </h2>
          <ol className="space-y-2">
            {leaderboard.slice(0, 5).map((r, i) => (
              <li key={r.sessionId} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  <span className="text-gray-400 mr-2">{i + 1}위</span>
                  {r.nickname}
                </span>
                <span className="font-bold text-indigo-600">{r.totalScore}점</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

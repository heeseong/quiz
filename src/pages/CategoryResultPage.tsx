import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import { getCategoryLabel, getCategoryEmoji } from '../utils/quiz';

export default function CategoryResultPage() {
  const navigate = useNavigate();
  const { currentCategory, scores, answers } = useGameStore((s) => s);

  if (!currentCategory) {
    navigate('/category');
    return null;
  }

  const catQuestions = questions.filter((q) => q.category === currentCategory);
  const correctCount = catQuestions.filter((q) => answers[q.id]?.isCorrect).length;
  const score = scores[currentCategory];

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold text-indigo-700">
        {getCategoryEmoji(currentCategory)} {getCategoryLabel(currentCategory)} 결과
      </h1>

      <div className="bg-white rounded-2xl shadow p-8 space-y-4">
        <p className="text-5xl font-bold text-indigo-600">{score}점</p>
        <p className="text-gray-500">
          {catQuestions.length}문제 중 <strong>{correctCount}문제</strong> 정답
        </p>
        {correctCount === catQuestions.length && (
          <p className="text-yellow-600 font-semibold">🏆 완벽! +50점 보너스 획득!</p>
        )}
      </div>

      <div className="space-y-2 text-left">
        {catQuestions.map((q) => {
          const ans = answers[q.id];
          const correct = ans?.isCorrect ?? false;
          return (
            <div
              key={q.id}
              className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm ${
                correct ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
              }`}
            >
              <span>{correct ? '✅' : '❌'}</span>
              <p className="text-sm text-gray-700 flex-1 truncate">{q.question}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/category')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        카테고리 선택으로
      </button>
    </div>
  );
}

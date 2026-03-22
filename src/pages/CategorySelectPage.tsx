import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import type { Category } from '../types';
import { getCategoryEmoji, getCategoryLabel } from '../utils/quiz';

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

export default function CategorySelectPage() {
  const navigate = useNavigate();
  const { nickname, scores, answers, startCategory } = useGameStore((s) => s);

  const attemptedCategories = Object.keys(answers)
    .map((id) => {
      if (id.startsWith('kh')) return 'KOREAN_HISTORY';
      if (id.startsWith('sc')) return 'SCIENCE';
      return 'ENGLISH';
    })
    .filter((v, i, a) => a.indexOf(v) === i) as Category[];

  const allDone = attemptedCategories.length === 3;

  function handleSelect(cat: Category) {
    startCategory(cat);
    navigate('/quiz');
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-700">카테고리 선택</h1>
        <p className="text-gray-500 mt-1">안녕하세요, {nickname}님!</p>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((cat) => {
          const done = attemptedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className="w-full flex items-center justify-between bg-white hover:bg-indigo-50 disabled:opacity-50 border border-gray-200 rounded-2xl px-6 py-5 shadow transition-colors"
            >
              <span className="text-2xl">{getCategoryEmoji(cat)}</span>
              <span className="flex-1 text-left ml-4 font-semibold text-gray-700">
                {getCategoryLabel(cat)}
              </span>
              {done ? (
                <span className="text-green-600 font-bold">{scores[cat]}점 ✓</span>
              ) : (
                <span className="text-gray-400 text-sm">20문제</span>
              )}
            </button>
          );
        })}
      </div>

      {allDone && (
        <button
          onClick={() => navigate('/result/final')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow"
        >
          최종 결과 보기 🎉
        </button>
      )}
    </div>
  );
}

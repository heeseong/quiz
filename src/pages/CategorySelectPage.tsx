import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, ChevronRight, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { questions } from '../data/questions';
import type { Category } from '../types';
import { getCategoryEmoji, getCategoryLabel } from '../utils/quiz';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';

const CATEGORIES: Category[] = ['KOREAN_HISTORY', 'SCIENCE', 'ENGLISH'];

const CATEGORY_DESC: Record<Category, string> = {
  KOREAN_HISTORY: '우리나라의 역사를 알아보자!',
  SCIENCE:        '자연과 과학의 비밀을 풀어봐!',
  ENGLISH:        '영어 단어와 문장에 도전!',
};

const CATEGORY_GRADIENT: Record<Category, string> = {
  KOREAN_HISTORY: 'from-amber-50 to-orange-50',
  SCIENCE:        'from-emerald-50 to-teal-50',
  ENGLISH:        'from-violet-50 to-purple-50',
};

const CATEGORY_ACCENT: Record<Category, string> = {
  KOREAN_HISTORY: 'text-amber-600',
  SCIENCE:        'text-emerald-600',
  ENGLISH:        'text-violet-600',
};

function getCompletedCategories(
  answers: ReturnType<typeof useGameStore.getState>['answers']
): Set<Category> {
  const done = new Set<Category>();
  for (const cat of CATEGORIES) {
    const catQs = questions.filter((q) => q.category === cat);
    if (catQs.length > 0 && catQs.every((q) => answers[q.id] !== undefined)) {
      done.add(cat);
    }
  }
  return done;
}

export default function CategorySelectPage() {
  const navigate = useNavigate();
  const { nickname, scores, answers, startCategory } = useGameStore((s) => s);

  const completed = getCompletedCategories(answers);
  const allDone = completed.size === CATEGORIES.length;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = questions.length;

  function handleSelect(cat: Category) {
    if (completed.has(cat)) return;
    startCategory(cat);
    navigate('/quiz');
  }

  return (
    <div className="relative min-h-screen flex flex-col px-4 py-10 overflow-hidden">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#3B5BA5]/6" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#FF6B35]/6" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-6 animate-fade-up">

        {/* 헤더 */}
        <div className="text-center space-y-1">
          <p className="text-[#FF6B35] font-bold text-sm tracking-wide uppercase">Category</p>
          <h1 className="text-2xl font-extrabold text-gray-800 leading-snug">
            <span className="text-[#3B5BA5]">{nickname}</span>님,<br />
            카테고리를 선택해줘!
          </h1>
        </div>

        {/* 전체 진행률 */}
        <Card className="px-5 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              현재 총점
            </span>
            <span className="text-xl font-extrabold text-[#3B5BA5]">{totalScore}점</span>
          </div>
          <ProgressBar
            value={totalAnswered}
            max={totalQuestions}
            height="md"
            showLabel={false}
          />
          <p className="text-xs text-gray-400 text-right">
            {totalAnswered} / {totalQuestions} 문제 완료
          </p>
        </Card>

        {/* 카테고리 카드 목록 */}
        <div className="space-y-3">
          {CATEGORIES.map((cat, i) => {
            const isDone = completed.has(cat);
            const catQs = questions.filter((q) => q.category === cat);
            const answeredInCat = catQs.filter((q) => answers[q.id] !== undefined).length;

            return (
              <Card
                key={cat}
                clickable={!isDone}
                disabled={false}
                onClick={() => handleSelect(cat)}
                className={`animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
              >
                <div className={`rounded-2xl bg-gradient-to-r ${CATEGORY_GRADIENT[cat]} p-5`}>
                  <div className="flex items-start gap-4">
                    {/* 이모지 아이콘 박스 */}
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl flex-shrink-0">
                      {getCategoryEmoji(cat)}
                    </div>

                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-extrabold text-gray-800 text-lg leading-none">
                          {getCategoryLabel(cat)}
                        </h2>
                        <Badge color="category" category={cat} size="sm">
                          {catQs.length}문제
                        </Badge>
                        {isDone && (
                          <Badge color="green" size="sm">✅ 완료</Badge>
                        )}
                      </div>
                      <p className={`text-sm mt-1 font-medium ${CATEGORY_ACCENT[cat]}`}>
                        {CATEGORY_DESC[cat]}
                      </p>

                      {/* 진행 바 (진행 중) */}
                      {!isDone && answeredInCat > 0 && (
                        <div className="mt-2">
                          <ProgressBar
                            value={answeredInCat}
                            max={catQs.length}
                            height="sm"
                            color="#3B5BA5"
                          />
                          <p className="text-xs text-gray-400 mt-0.5">
                            {answeredInCat}/{catQs.length} 진행 중
                          </p>
                        </div>
                      )}

                      {/* 완료 시 점수 */}
                      {isDone && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-sm font-bold text-[#3B5BA5]">
                            획득 점수:
                          </span>
                          <span className="text-sm font-extrabold text-[#FF6B35]">
                            {scores[cat]}점
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 우측 액션 */}
                    <div className="flex-shrink-0 self-center">
                      {isDone ? (
                        <CheckCircle2 size={26} className="text-emerald-500" />
                      ) : (
                        <ChevronRight size={24} className="text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 잠금 안내 */}
        {completed.size > 0 && !allDone && (
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Lock size={12} />
            완료한 카테고리는 다시 플레이할 수 없어요
          </p>
        )}

        {/* 최종 결과 버튼 */}
        {allDone && (
          <Button
            size="lg"
            className="w-full shadow-lg shadow-[#3B5BA5]/30 animate-scale-in"
            onClick={() => navigate('/result/final')}
          >
            🎉 최종 결과 보기
          </Button>
        )}
      </div>
    </div>
  );
}

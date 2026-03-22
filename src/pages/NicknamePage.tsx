import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCircle2, CheckCircle2, XCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import Card from '../components/Card';

const MIN = 2;
const MAX = 10;
const VALID_RE = /^[가-힣a-zA-Z0-9]+$/;

function validate(v: string): string | null {
  if (v.length === 0) return null;                        // 아직 입력 전
  if (v.length < MIN) return `${MIN}자 이상 입력해줘!`;
  if (!VALID_RE.test(v)) return '한글, 영문, 숫자만 사용할 수 있어!';
  return '';  // 유효
}

export default function NicknamePage() {
  const [value, setValue] = useState('');
  const setNickname = useGameStore((s) => s.setNickname);
  const navigate = useNavigate();

  const error = validate(value);
  const isValid = value.length >= MIN && error === '';

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!isValid) return;
      setNickname(value.trim());
      navigate('/category');
    },
    [isValid, value, setNickname, navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#3B5BA5]/8" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#FF6B35]/8" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto space-y-6 animate-fade-up">
        {/* 뒤로가기 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="self-start -ml-1"
        >
          <ChevronLeft size={18} />
          홈으로
        </Button>

        {/* 아이콘 + 제목 */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#e8edf8] flex items-center justify-center text-[#3B5BA5] animate-float">
              <UserCircle2 size={44} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            플레이어 이름을 입력해줘!
          </h1>
          <p className="text-gray-400 text-sm">
            리더보드에 표시되는 이름이에요 ({MIN}~{MAX}자)
          </p>
        </div>

        {/* 입력 카드 */}
        <Card className="p-6 space-y-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, MAX))}
                onKeyDown={handleKeyDown}
                placeholder="예) 퀴즈왕철수"
                maxLength={MAX}
                autoFocus
                className={`
                  w-full rounded-2xl border-2 px-4 py-3 text-lg font-medium outline-none
                  transition-colors duration-200 pr-10
                  ${
                    error === null || value.length === 0
                      ? 'border-gray-200 focus:border-[#3B5BA5]'
                      : error === ''
                        ? 'border-emerald-400 focus:border-emerald-500'
                        : 'border-red-400 focus:border-red-500'
                  }
                `}
              />
              {/* 유효성 아이콘 */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {value.length > 0 && (
                  isValid
                    ? <CheckCircle2 size={20} className="text-emerald-500" />
                    : <XCircle size={20} className="text-red-400" />
                )}
              </div>
            </div>

            {/* 글자 수 + 에러 메시지 */}
            <div className="flex items-center justify-between mt-2 px-1">
              <span className={`text-xs transition-all ${error ? 'text-red-500' : 'text-gray-400'}`}>
                {value.length > 0 && error ? error : '\u00A0'}
              </span>
              <span className={`text-xs font-medium ${value.length >= MAX ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                {value.length} / {MAX}
              </span>
            </div>

            {/* 시작 버튼 */}
            <Button
              type="submit"
              size="lg"
              disabled={!isValid}
              className="w-full mt-4 shadow-md shadow-[#3B5BA5]/25"
            >
              시작하기 🚀
            </Button>
          </form>
        </Card>

        {/* 힌트 */}
        <p className="text-center text-xs text-gray-400">
          한글, 영문, 숫자 조합으로 입력하거나 Enter를 눌러도 돼요!
        </p>
      </div>
    </div>
  );
}

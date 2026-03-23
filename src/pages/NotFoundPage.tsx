import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animate-fade-up">
      <div className="text-center space-y-4">
        <p className="text-8xl font-extrabold text-[#3B5BA5] leading-none">404</p>
        <h1 className="text-2xl font-bold text-gray-800">페이지를 찾을 수 없어요</h1>
        <p className="text-gray-500 text-base">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-block bg-[#3B5BA5] hover:bg-[#2d4a8a] text-white font-semibold px-8 py-3 rounded-2xl transition-colors shadow-sm"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

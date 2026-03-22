import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export default function NicknamePage() {
  const [value, setValue] = useState('');
  const setNickname = useGameStore((s) => s.setNickname);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    navigate('/category');
  }

  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-indigo-700">닉네임 입력</h1>
        <p className="text-gray-500 mt-2">리더보드에 표시될 이름을 입력하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-6">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="닉네임 (최대 12자)"
          maxLength={12}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          다음
        </button>
      </form>
    </div>
  );
}

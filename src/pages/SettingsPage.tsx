import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Modal from '../components/Modal';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, update } = useSettings();
  const { playClick } = useSoundEffects();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  function handleSoundToggle() {
    update({ soundEnabled: !settings.soundEnabled });
    // play click only when turning sound on
    if (!settings.soundEnabled) {
      // sound is about to be enabled, play after update propagates
      setTimeout(() => playClick(), 0);
    }
  }

  function handleFontSize(size: 'normal' | 'large') {
    playClick();
    update({ fontSize: size });
  }

  function handleResetLeaderboard() {
    try {
      localStorage.removeItem('quiz_leaderboard');
    } catch {
      // ignore storage errors
    }
    setResetDone(true);
    setShowResetModal(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-10 space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors font-medium text-sm"
          aria-label="뒤로 가기"
        >
          ← 뒤로
        </button>
        <h1 className="text-xl font-bold text-gray-800">⚙️ 설정</h1>
      </div>

      {/* Sound section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">사운드 효과</p>
            <p className="text-sm text-gray-400 mt-0.5">정답/오답 효과음</p>
          </div>
          <button
            onClick={handleSoundToggle}
            role="switch"
            aria-checked={settings.soundEnabled}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.soundEnabled ? 'bg-[#3B5BA5]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Font size section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800">폰트 크기</p>
            <p className="text-sm text-gray-400 mt-0.5">텍스트 크기 조정</p>
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0">
            <button
              onClick={() => handleFontSize('normal')}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                settings.fontSize === 'normal'
                  ? 'bg-[#3B5BA5] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              기본
            </button>
            <button
              onClick={() => handleFontSize('large')}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-l border-gray-200 ${
                settings.fontSize === 'large'
                  ? 'bg-[#3B5BA5] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              크게
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard reset section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-semibold text-gray-800 mb-1">리더보드</p>
        <p className="text-sm text-gray-400 mb-4">저장된 리더보드 기록을 모두 삭제합니다.</p>
        {resetDone && (
          <p className="text-sm text-green-600 mb-3 font-medium">✅ 리더보드가 초기화되었습니다.</p>
        )}
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full border-2 border-red-400 text-red-500 hover:bg-red-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          리더보드 데이터 초기화
        </button>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <Modal title="리더보드 초기화" onClose={() => setShowResetModal(false)}>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            저장된 모든 리더보드 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              취소
            </button>
            <button
              onClick={handleResetLeaderboard}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              삭제하기
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

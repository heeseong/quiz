import { useSettings } from './useSettings';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = typeof AudioContext !== 'undefined' ? AudioContext : null;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.15
): void {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainValue, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  } catch {
    // ignore audio errors
  }
}

export function useSoundEffects() {
  const { settings } = useSettings();
  const soundEnabled = settings.soundEnabled;

  function playCorrect() {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      tone(261.63, now, 0.15, 'sine', 0.15);       // C4
      tone(329.63, now + 0.08, 0.15, 'sine', 0.15); // E4
      tone(392, now + 0.16, 0.15, 'sine', 0.15);    // G4
    } catch { /* ignore audio errors */ }
  }

  function playWrong() {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      tone(250, now, 0.15, 'sawtooth', 0.12);
      tone(150, now + 0.1, 0.2, 'sawtooth', 0.12);
    } catch { /* ignore audio errors */ }
  }

  function playTimeout() {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      tone(440, now, 0.1, 'square', 0.1);
      tone(440, now + 0.15, 0.1, 'square', 0.1);
      tone(300, now + 0.3, 0.25, 'sawtooth', 0.1);
    } catch { /* ignore audio errors */ }
  }

  function playClick() {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      tone(800, now, 0.04, 'square', 0.08);
    } catch { /* ignore audio errors */ }
  }

  function playLevelUp() {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      tone(261.63, now, 0.12, 'sine', 0.15);        // C4
      tone(329.63, now + 0.12, 0.12, 'sine', 0.15); // E4
      tone(392, now + 0.24, 0.12, 'sine', 0.15);    // G4
      tone(523.25, now + 0.36, 0.25, 'sine', 0.15); // C5
    } catch { /* ignore audio errors */ }
  }

  function playFinal(gradeStr: string) {
    if (!soundEnabled) return;
    try {
      const c = getCtx();
      if (!c) return;
      const now = c.currentTime;
      if (gradeStr === 'S' || gradeStr === 'A') {
        // Victory fanfare
        tone(392, now, 0.15, 'sine', 0.15);
        tone(523.25, now + 0.15, 0.15, 'sine', 0.15);
        tone(659.25, now + 0.3, 0.15, 'sine', 0.15);
        tone(783.99, now + 0.45, 0.3, 'sine', 0.18);
      } else if (gradeStr === 'B' || gradeStr === 'C') {
        // Moderate fanfare
        tone(392, now, 0.15, 'sine', 0.12);
        tone(523.25, now + 0.15, 0.15, 'sine', 0.12);
        tone(659.25, now + 0.3, 0.25, 'sine', 0.12);
      } else {
        // Encouragement
        tone(329.63, now, 0.2, 'sine', 0.1);
        tone(392, now + 0.25, 0.2, 'sine', 0.1);
        tone(329.63, now + 0.5, 0.3, 'sine', 0.12);
      }
    } catch { /* ignore audio errors */ }
  }

  return { playCorrect, playWrong, playTimeout, playClick, playLevelUp, playFinal };
}

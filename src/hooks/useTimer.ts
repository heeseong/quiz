import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [stopped, setStopped] = useState(false);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(initialSeconds);
    setStopped(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (stopped) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
      return;
    }
    const id = setTimeout(() => setRemaining((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, stopped]);

  const stop = useCallback(() => setStopped(true), []);

  return { remaining, stop };
}

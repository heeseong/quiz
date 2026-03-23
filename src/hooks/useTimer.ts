import { useEffect, useRef, useCallback, useReducer } from 'react';

type TimerState = { remaining: number; stopped: boolean };
type TimerAction = { type: 'TICK' } | { type: 'STOP' } | { type: 'RESET'; seconds: number };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'TICK':  return { ...state, remaining: state.remaining - 1 };
    case 'STOP':  return { ...state, stopped: true };
    case 'RESET': return { remaining: action.seconds, stopped: false };
  }
}

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [{ remaining, stopped }, dispatch] = useReducer(timerReducer, {
    remaining: initialSeconds,
    stopped: false,
  });
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; });

  useEffect(() => {
    expiredRef.current = false;
    dispatch({ type: 'RESET', seconds: initialSeconds });
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
    const id = setTimeout(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearTimeout(id);
  }, [remaining, stopped]);

  const stop = useCallback(() => dispatch({ type: 'STOP' }), []);
  return { remaining, stop };
}

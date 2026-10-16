import { useCallback, useEffect, useRef, useState } from 'react';
import type { Fortune } from '../data/fortunes';
import {
  cookieReducer,
  initialCookieState,
  timedEventFor,
  type CookieEvent,
  type CookieState,
  type PhaseDurations,
} from '../lib/cookieMachine';

interface Options {
  durations: PhaseDurations;
  drawFortune: () => Fortune;
  onPhaseChange?: (state: CookieState) => void;
}

/**
 * Drives the cookie state machine. A ref mirrors the state synchronously so that
 * two clicks in the same frame can never draw two fortunes, and each timed phase
 * owns exactly one timer which is cleared when the phase ends or the component unmounts.
 */
export function useCookieMachine({ durations, drawFortune, onPhaseChange }: Options) {
  const [state, setState] = useState<CookieState>(initialCookieState);
  const stateRef = useRef(state);
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  });

  const send = useCallback((event: CookieEvent) => {
    const next = cookieReducer(stateRef.current, event);
    if (next === stateRef.current) return false;
    stateRef.current = next;
    setState(next);
    onPhaseChangeRef.current?.(next);
    return true;
  }, []);

  const durationRef = useRef(durations);
  useEffect(() => {
    durationRef.current = durations;
  });

  useEffect(() => {
    const event = timedEventFor(state.phase);
    if (!event) return;
    const phase = state.phase as keyof PhaseDurations;
    const timer = window.setTimeout(() => send(event), durationRef.current[phase]);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.round, send]);

  const breakCookie = useCallback(() => {
    if (stateRef.current.phase !== 'idle') return false;
    return send({ type: 'BREAK', fortune: drawFortune() });
  }, [drawFortune, send]);

  const reset = useCallback(() => send({ type: 'RESET' }), [send]);

  return { state, breakCookie, reset };
}

import type { Fortune } from '../data/fortunes';

/** idle → cracking → revealing → revealed → resetting → idle */
export type CookiePhase = 'idle' | 'cracking' | 'revealing' | 'revealed' | 'resetting';

export interface CookieState {
  phase: CookiePhase;
  fortune: Fortune | null;
  /** Increases every time a fresh cookie is served. */
  round: number;
}

export type CookieEvent =
  | { type: 'BREAK'; fortune: Fortune }
  | { type: 'CRACKED' }
  | { type: 'REVEALED' }
  | { type: 'RESET' }
  | { type: 'RESET_DONE' };

export const initialCookieState: CookieState = { phase: 'idle', fortune: null, round: 0 };

/**
 * Pure transition function. Events that are not valid in the current phase
 * return the exact same state object, so repeated clicks are harmless.
 */
export function cookieReducer(state: CookieState, event: CookieEvent): CookieState {
  switch (state.phase) {
    case 'idle':
      return event.type === 'BREAK' ? { ...state, phase: 'cracking', fortune: event.fortune } : state;
    case 'cracking':
      return event.type === 'CRACKED' ? { ...state, phase: 'revealing' } : state;
    case 'revealing':
      return event.type === 'REVEALED' ? { ...state, phase: 'revealed' } : state;
    case 'revealed':
      return event.type === 'RESET' ? { ...state, phase: 'resetting' } : state;
    case 'resetting':
      return event.type === 'RESET_DONE'
        ? { phase: 'idle', fortune: null, round: state.round + 1 }
        : state;
  }
}

export interface PhaseDurations {
  cracking: number;
  revealing: number;
  resetting: number;
}

/** Full motion: crack ~620ms + reveal ~640ms ≈ 1.26s from tap to readable fortune. */
export const FULL_MOTION_DURATIONS: PhaseDurations = { cracking: 620, revealing: 640, resetting: 520 };

/** Reduced motion: short cross-fades only. */
export const REDUCED_MOTION_DURATIONS: PhaseDurations = { cracking: 60, revealing: 220, resetting: 200 };

/** The event that automatically ends a timed phase, if any. */
export function timedEventFor(phase: CookiePhase): CookieEvent | null {
  switch (phase) {
    case 'cracking':
      return { type: 'CRACKED' };
    case 'revealing':
      return { type: 'REVEALED' };
    case 'resetting':
      return { type: 'RESET_DONE' };
    default:
      return null;
  }
}

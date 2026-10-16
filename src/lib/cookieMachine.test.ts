import { describe, expect, it } from 'vitest';
import type { Fortune } from '../data/fortunes';
import { cookieReducer, initialCookieState, timedEventFor, type CookieEvent, type CookieState } from './cookieMachine';

const fortune: Fortune = { id: 'x', category: 'vinnuspa', text: 'Prófunarspá.' };
const other: Fortune = { id: 'y', category: 'jolaspeki', text: 'Önnur spá.' };

const run = (events: CookieEvent[], start: CookieState = initialCookieState) => events.reduce(cookieReducer, start);

describe('cookieReducer', () => {
  it('follows idle → cracking → revealing → revealed → resetting → idle', () => {
    const phases: string[] = [];
    let state = initialCookieState;
    const events: CookieEvent[] = [
      { type: 'BREAK', fortune },
      { type: 'CRACKED' },
      { type: 'REVEALED' },
      { type: 'RESET' },
      { type: 'RESET_DONE' },
    ];
    for (const event of events) {
      state = cookieReducer(state, event);
      phases.push(state.phase);
    }
    expect(phases).toEqual(['cracking', 'revealing', 'revealed', 'resetting', 'idle']);
    expect(state.fortune).toBeNull();
    expect(state.round).toBe(1);
  });

  it('keeps the first fortune when BREAK is sent repeatedly', () => {
    const state = run([{ type: 'BREAK', fortune }, { type: 'BREAK', fortune: other }]);
    expect(state.phase).toBe('cracking');
    expect(state.fortune).toBe(fortune);
  });

  it('returns the same object for events that are invalid in the current phase', () => {
    const cracking = run([{ type: 'BREAK', fortune }]);
    for (const event of [{ type: 'RESET' }, { type: 'REVEALED' }, { type: 'RESET_DONE' }] as CookieEvent[]) {
      expect(cookieReducer(cracking, event)).toBe(cracking);
    }
    expect(cookieReducer(initialCookieState, { type: 'RESET' })).toBe(initialCookieState);
    const revealed = run([{ type: 'BREAK', fortune }, { type: 'CRACKED' }, { type: 'REVEALED' }]);
    expect(cookieReducer(revealed, { type: 'BREAK', fortune: other })).toBe(revealed);
  });

  it('only cracking, revealing and resetting are timed', () => {
    expect(timedEventFor('idle')).toBeNull();
    expect(timedEventFor('revealed')).toBeNull();
    expect(timedEventFor('cracking')).toEqual({ type: 'CRACKED' });
    expect(timedEventFor('revealing')).toEqual({ type: 'REVEALED' });
    expect(timedEventFor('resetting')).toEqual({ type: 'RESET_DONE' });
  });
});

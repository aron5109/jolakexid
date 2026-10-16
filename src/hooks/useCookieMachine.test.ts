import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Fortune } from '../data/fortunes';
import { FULL_MOTION_DURATIONS } from '../lib/cookieMachine';
import { advance } from '../test/timers';
import { useCookieMachine } from './useCookieMachine';

const fortune: Fortune = { id: 'x', category: 'nyarsspa', text: 'Prófunarspá.' };
const { cracking, revealing, resetting } = FULL_MOTION_DURATIONS;

describe('useCookieMachine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('draws exactly one fortune even when broken twice in the same tick', () => {
    const draw = vi.fn(() => fortune);
    const { result } = renderHook(() => useCookieMachine({ durations: FULL_MOTION_DURATIONS, drawFortune: draw }));
    act(() => {
      result.current.breakCookie();
      result.current.breakCookie();
      result.current.breakCookie();
    });
    expect(draw).toHaveBeenCalledTimes(1);
    expect(result.current.state.phase).toBe('cracking');
  });

  it('advances through the timed phases and can be opened again', () => {
    const draw = vi.fn(() => fortune);
    const { result } = renderHook(() => useCookieMachine({ durations: FULL_MOTION_DURATIONS, drawFortune: draw }));

    for (let round = 0; round < 3; round += 1) {
      act(() => void result.current.breakCookie());
      advance(cracking);
      expect(result.current.state.phase).toBe('revealing');
      advance(revealing);
      expect(result.current.state.phase).toBe('revealed');
      expect(result.current.state.fortune).toBe(fortune);

      act(() => void result.current.breakCookie());
      expect(draw).toHaveBeenCalledTimes(round + 1);

      act(() => void result.current.reset());
      act(() => void result.current.reset());
      expect(result.current.state.phase).toBe('resetting');
      advance(resetting);
      expect(result.current.state.phase).toBe('idle');
      expect(result.current.state.round).toBe(round + 1);
    }
  });

  it('completes the reveal within 1.5 seconds', () => {
    const { result } = renderHook(() =>
      useCookieMachine({ durations: FULL_MOTION_DURATIONS, drawFortune: () => fortune }),
    );
    act(() => void result.current.breakCookie());
    advance(1500);
    expect(result.current.state.phase).toBe('revealed');
  });

  it('ignores reset while the cookie is still cracking', () => {
    const { result } = renderHook(() =>
      useCookieMachine({ durations: FULL_MOTION_DURATIONS, drawFortune: () => fortune }),
    );
    act(() => void result.current.breakCookie());
    act(() => void result.current.reset());
    expect(result.current.state.phase).toBe('cracking');
  });

  it('clears pending timers on unmount', () => {
    const onPhaseChange = vi.fn();
    const { result, unmount } = renderHook(() =>
      useCookieMachine({ durations: FULL_MOTION_DURATIONS, drawFortune: () => fortune, onPhaseChange }),
    );
    act(() => void result.current.breakCookie());
    onPhaseChange.mockClear();
    unmount();
    vi.advanceTimersByTime(5000);
    expect(onPhaseChange).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});

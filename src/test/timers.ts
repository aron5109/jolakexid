import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Advances fake time in small steps, letting React commit effects in between,
 * like a real browser would (each phase schedules its timer in an effect).
 */
export function advance(ms: number, step = 20) {
  for (let elapsed = 0; elapsed < ms; elapsed += step) {
    act(() => {
      vi.advanceTimersByTime(Math.min(step, ms - elapsed));
    });
  }
}

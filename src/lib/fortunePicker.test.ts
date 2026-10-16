import { describe, expect, it } from 'vitest';
import type { Fortune } from '../data/fortunes';
import { FORTUNES } from '../data/fortunes';
import {
  RECENT_STORAGE_KEY,
  drawFortune,
  pickFortune,
  pushRecent,
  readRecent,
  recentLimit,
  type KeyValueStore,
} from './fortunePicker';

const pool: Fortune[] = ['a', 'b', 'c', 'd'].map((id) => ({ id, category: 'jolaspeki', text: `Spá ${id}.` }));

function memoryStore(initial: Record<string, string> = {}): KeyValueStore & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

describe('pickFortune', () => {
  it('uses the random source to choose', () => {
    expect(pickFortune(pool, [], () => 0).id).toBe('a');
    expect(pickFortune(pool, [], () => 0.99).id).toBe('d');
  });

  it('never returns a recently shown fortune while fresh ones remain', () => {
    for (let r = 0; r < 1; r += 0.05) {
      expect(['c', 'd']).toContain(pickFortune(pool, ['a', 'b'], () => r).id);
    }
  });

  it('falls back to the full pool when everything is recent', () => {
    expect(pickFortune(pool, ['a', 'b', 'c', 'd'], () => 0.5)).toBeDefined();
  });

  it('is safe when random() returns exactly 1', () => {
    expect(pickFortune(pool, [], () => 1).id).toBe('d');
  });

  it('throws on an empty pool', () => {
    expect(() => pickFortune([], [])).toThrow();
  });
});

describe('recent history', () => {
  it('keeps the newest ids up to the limit without duplicates', () => {
    expect(pushRecent(['a', 'b'], 'c', 2)).toEqual(['b', 'c']);
    expect(pushRecent(['a', 'b'], 'a', 3)).toEqual(['b', 'a']);
    expect(pushRecent(['a'], 'b', 0)).toEqual([]);
  });

  it('scales the limit with the pool size', () => {
    expect(recentLimit(4)).toBe(2);
    expect(recentLimit(69)).toBe(34);
    expect(recentLimit(200)).toBe(40);
  });

  it('ignores corrupt or unavailable storage', () => {
    expect(readRecent(memoryStore({ [RECENT_STORAGE_KEY]: '{not json' }))).toEqual([]);
    expect(readRecent(memoryStore({ [RECENT_STORAGE_KEY]: '{"a":1}' }))).toEqual([]);
    expect(readRecent(null)).toEqual([]);
    const throwing: KeyValueStore = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(() => drawFortune(pool, throwing)).not.toThrow();
  });

  it('does not repeat any fortune across the first half of the real dataset', () => {
    const store = memoryStore();
    const seen = new Set<string>();
    const draws = recentLimit(FORTUNES.length) + 1;
    for (let i = 0; i < draws; i += 1) {
      const fortune = drawFortune(FORTUNES, store);
      expect(seen.has(fortune.id)).toBe(false);
      seen.add(fortune.id);
    }
  });
});

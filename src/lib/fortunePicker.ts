import type { Fortune } from '../data/fortunes';

export const RECENT_STORAGE_KEY = 'jolakexid:nylegir';

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** How many recent fortunes to avoid: half the pool, capped so large pools still feel fresh. */
export function recentLimit(poolSize: number): number {
  return Math.max(0, Math.min(40, Math.floor(poolSize / 2)));
}

export function readRecent(store: KeyValueStore | null | undefined): string[] {
  if (!store) return [];
  try {
    const raw = store.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function writeRecent(store: KeyValueStore | null | undefined, ids: readonly string[]): void {
  if (!store) return;
  try {
    store.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Private browsing or full storage: history is a nice-to-have, never a blocker.
  }
}

/**
 * Picks a fortune uniformly at random, skipping the ones shown recently.
 * Pure: the caller supplies randomness and the recent history.
 */
export function pickFortune(
  pool: readonly Fortune[],
  recentIds: readonly string[],
  random: () => number = Math.random,
): Fortune {
  if (pool.length === 0) throw new Error('Engir spádómar í boði.');
  const recent = new Set(recentIds);
  const fresh = pool.filter((fortune) => !recent.has(fortune.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
  return candidates[index];
}

export function pushRecent(recentIds: readonly string[], id: string, limit: number): string[] {
  if (limit <= 0) return [];
  return [...recentIds.filter((existing) => existing !== id), id].slice(-limit);
}

export function safeLocalStorage(): KeyValueStore | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Picks the next fortune and records it in local history. */
export function drawFortune(
  pool: readonly Fortune[],
  store: KeyValueStore | null = safeLocalStorage(),
  random: () => number = Math.random,
): Fortune {
  const recent = readRecent(store);
  const fortune = pickFortune(pool, recent, random);
  writeRecent(store, pushRecent(recent, fortune.id, recentLimit(pool.length)));
  return fortune;
}

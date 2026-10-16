import { describe, expect, it } from 'vitest';
import { CATEGORY_LABELS, FORTUNES, FORTUNE_CATEGORIES } from './fortunes';

describe('fortune dataset', () => {
  it('has at least 50 fortunes', () => {
    expect(FORTUNES.length).toBeGreaterThanOrEqual(50);
  });

  it('has unique ids and unique texts', () => {
    expect(new Set(FORTUNES.map((f) => f.id)).size).toBe(FORTUNES.length);
    expect(new Set(FORTUNES.map((f) => f.text.trim().toLowerCase())).size).toBe(FORTUNES.length);
  });

  it('covers every category with a reasonable share and a label', () => {
    for (const category of FORTUNE_CATEGORIES) {
      expect(FORTUNES.filter((f) => f.category === category).length).toBeGreaterThanOrEqual(10);
      expect(CATEGORY_LABELS[category]).toBeTruthy();
    }
  });

  it('has tidy, readable texts', () => {
    for (const { text } of FORTUNES) {
      expect(text).toBe(text.trim());
      expect(text).not.toMatch(/\s{2,}/);
      expect(text.length).toBeGreaterThan(20);
      expect(text.length).toBeLessThanOrEqual(160);
      expect(text).toMatch(/[.!?]$/);
    }
  });
});

/**
 * Hand-tuned geometry for the fortune cookie, drawn in a 400×260 viewBox.
 * Only the left half is described; the right half is its mirror image, so
 * both halves always meet perfectly along the centre crease.
 */
export const VIEW_W = 400;
export const VIEW_H = 260;

type Pt = readonly [number, number];
type Seg = readonly [Pt, Pt, Pt];

interface Shape {
  start: Pt;
  segments: readonly Seg[];
  close?: boolean;
}

/**
 * Outer silhouette of the left wing: the crown sits near the centre, the outer
 * edge sweeps down to a low curled tip, and the underside rises back to the
 * centre fold — the classic bow-tie fortune cookie profile.
 */
const LEFT_BODY: Shape = {
  start: [202, 92],
  segments: [
    [[198, 54], [182, 28], [150, 26]],
    [[108, 24], [62, 68], [36, 126]],
    [[24, 154], [12, 186], [5, 210]],
    [[0, 230], [14, 243], [38, 236]],
    [[92, 222], [150, 204], [198, 190]],
    [[208, 156], [210, 126], [202, 92]],
  ],
  close: true,
};

/** The curled inner lip along the underside: widest at the tip, tapering to the centre. */
const LEFT_LIP: Shape = {
  start: [5, 210],
  segments: [
    [[24, 197], [96, 194], [194, 189]],
    [[150, 204], [92, 222], [38, 236]],
    [[14, 243], [0, 230], [5, 210]],
  ],
  close: true,
};

/** Soft ridge that catches the light where the dough was folded. */
const LEFT_RIDGE: Shape = {
  start: [146, 38],
  segments: [[[104, 46], [62, 96], [34, 172]]],
};

/** The shadowed seam just above the lip. */
const LEFT_LIP_SEAM: Shape = {
  start: [10, 204],
  segments: [[[30, 194], [110, 190], [196, 186]]],
};

const round = (n: number) => Math.round(n * 10) / 10;

function mirrorPt([x, y]: Pt): Pt {
  return [VIEW_W - x, y];
}

function toPath(shape: Shape, mirror: boolean): string {
  const map = mirror ? mirrorPt : (p: Pt) => p;
  const [sx, sy] = map(shape.start);
  const parts = [`M${round(sx)} ${round(sy)}`];
  for (const seg of shape.segments) {
    const pts = seg.map(map).map(([x, y]) => `${round(x)} ${round(y)}`);
    parts.push(`C${pts.join(' ')}`);
  }
  if (shape.close) parts.push('Z');
  return parts.join(' ');
}

export type Side = 'left' | 'right';

export function cookiePaths(side: Side) {
  const mirror = side === 'right';
  return {
    body: toPath(LEFT_BODY, mirror),
    lip: toPath(LEFT_LIP, mirror),
    ridge: toPath(LEFT_RIDGE, mirror),
    lipSeam: toPath(LEFT_LIP_SEAM, mirror),
  };
}

/** Mirrors an x coordinate for the right half. */
export function mx(side: Side, x: number): number {
  return side === 'right' ? VIEW_W - x : x;
}

/** Small baked irregularities: darker toasted patches. [x, y, rx, ry, opacity] */
export const BAKE_SPOTS: readonly (readonly [number, number, number, number, number])[] = [
  [64, 160, 22, 14, 0.3],
  [150, 120, 16, 10, 0.16],
  [98, 92, 12, 8, 0.14],
  [26, 210, 12, 9, 0.38],
  [170, 186, 18, 10, 0.26],
];

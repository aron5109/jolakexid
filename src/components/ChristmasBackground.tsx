import type { CSSProperties } from 'react';

/** Deterministic pseudo-random numbers so the decoration is identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2026);
const TWINKLES = Array.from({ length: 34 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1.5 + rand() * 2.5,
  delay: rand() * 6,
  duration: 3 + rand() * 4,
}));

const BOKEH: readonly (readonly [number, number, number, string, number])[] = [
  [6, 12, 90, 'gold', 0.22],
  [92, 8, 120, 'gold', 0.16],
  [86, 40, 70, 'red', 0.35],
  [4, 58, 110, 'red', 0.3],
  [14, 88, 80, 'gold', 0.14],
  [94, 82, 130, 'gold', 0.12],
  [50, 104, 220, 'gold', 0.12],
  [72, 2, 60, 'gold', 0.18],
];

/** A pine bough: dark needles along a gently curved twig, with a few warm lights. */
function PineBranch({ className, seed }: { className: string; seed: number }) {
  const r = mulberry32(seed);
  const needles: { x1: number; y1: number; x2: number; y2: number; shade: number }[] = [];
  const twig = (t: number) => ({ x: 10 + 260 * t, y: 30 + 70 * t * t });
  for (let i = 0; i < 90; i += 1) {
    const t = i / 90;
    const { x, y } = twig(t);
    const len = 26 + r() * 22 - t * 12;
    for (const dir of [-1, 1]) {
      const angle = (dir * (52 + r() * 22) + 18) * (Math.PI / 180);
      needles.push({ x1: x, y1: y, x2: x + Math.cos(angle) * len, y2: y + Math.sin(angle) * len, shade: r() });
    }
  }
  const lights = [0.22, 0.48, 0.71, 0.9].map((t) => {
    const { x, y } = twig(t);
    return { x: x + (r() - 0.5) * 30, y: y + 12 + r() * 16 };
  });
  return (
    <svg className={className} viewBox="0 0 300 160" aria-hidden="true" focusable="false">
      <path d="M10 30 Q 140 30 270 100" stroke="#3A1F0F" strokeWidth="5" fill="none" strokeLinecap="round" />
      {needles.map((n, i) => (
        <line
          key={i}
          x1={n.x1}
          y1={n.y1}
          x2={n.x2}
          y2={n.y2}
          stroke={n.shade > 0.66 ? '#2C6B45' : n.shade > 0.33 ? '#1C4E33' : '#0F3322'}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ))}
      {lights.map((l, i) => (
        <g key={i} className="branch-light" style={{ '--delay': `${i * 0.9}s` } as CSSProperties}>
          <circle cx={l.x} cy={l.y} r="9" fill="#F1CC83" opacity="0.25" />
          <circle cx={l.x} cy={l.y} r="3" fill="#FFF4DF" />
        </g>
      ))}
    </svg>
  );
}

function Bauble({ className, tone, string }: { className: string; tone: 'red' | 'gold'; string: number }) {
  const id = `bauble-${tone}-${className.replace(/\W/g, '')}`;
  const colors =
    tone === 'red' ? ['#F06A5E', '#B3141B', '#5B0809', '#2A0405'] : ['#FFF1C7', '#E5B861', '#9C6A26', '#4A2E0E'];
  return (
    <svg className={className} viewBox={`0 0 100 ${string + 110}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={id} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="0.35" stopColor={colors[1]} />
          <stop offset="0.8" stopColor={colors[2]} />
          <stop offset="1" stopColor={colors[3]} />
        </radialGradient>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor="#8A6326" />
          <stop offset="0.45" stopColor="#F6DA9C" />
          <stop offset="1" stopColor="#8A6326" />
        </linearGradient>
      </defs>
      <line x1="50" y1="0" x2="50" y2={string} stroke="#E5B861" strokeOpacity="0.55" strokeWidth="1" />
      <rect x="42" y={string} width="16" height="11" rx="2" fill={`url(#${id}-cap)`} />
      <circle cx="50" cy={string + 55} r="44" fill={`url(#${id})`} />
      <path
        d={`M10 ${string + 52} Q50 ${string + 66} 90 ${string + 52}`}
        stroke="#F1CC83"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        fill="none"
      />
      <ellipse cx="36" cy={string + 36} rx="11" ry="7" fill="#FFF" opacity="0.35" transform={`rotate(-30 36 ${string + 36})`} />
    </svg>
  );
}

/** Fixed, decorative scene behind the content. Purely visual and hidden from assistive tech. */
export function ChristmasBackground() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__base" />
      <div className="bg__bokeh">
        {BOKEH.map(([left, top, size, tone, opacity], i) => (
          <span
            key={i}
            className={`bokeh bokeh--${tone}`}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity }}
          />
        ))}
      </div>
      <PineBranch className="branch branch--tl" seed={7} />
      <PineBranch className="branch branch--tr" seed={19} />
      <PineBranch className="branch branch--bl" seed={31} />
      <PineBranch className="branch branch--br" seed={43} />
      <Bauble className="bauble bauble--left" tone="gold" string={70} />
      <Bauble className="bauble bauble--right" tone="red" string={120} />
      <Bauble className="bauble bauble--right2" tone="gold" string={40} />
      <div className="bg__twinkles">
        {TWINKLES.map((t, i) => (
          <span
            key={i}
            className="twinkle"
            style={
              {
                left: `${t.left}%`,
                top: `${t.top}%`,
                '--size': `${t.size}px`,
                '--delay': `${t.delay}s`,
                '--duration': `${t.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="bg__vignette" />
    </div>
  );
}

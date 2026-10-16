import { forwardRef, type CSSProperties } from 'react';
import type { CookiePhase } from '../lib/cookieMachine';
import { CookieHalf } from './CookieHalf';

interface FortuneCookieProps {
  phase: CookiePhase;
  onBreak: () => void;
}

/** Crumbs and sparks thrown out when the cookie snaps: [dx, dy, rotation, size, delay, kind] */
const CRUMBS: readonly (readonly [number, number, number, number, number, 'crumb' | 'spark'])[] = [
  [-118, -70, -140, 7, 0, 'crumb'],
  [-84, -104, 90, 5, 30, 'spark'],
  [-52, -128, 200, 6, 10, 'crumb'],
  [-150, 10, -60, 5, 40, 'crumb'],
  [-30, -150, 45, 9, 60, 'spark'],
  [26, -140, -120, 5, 20, 'crumb'],
  [64, -112, 160, 10, 0, 'spark'],
  [104, -82, -30, 6, 35, 'crumb'],
  [140, -20, 110, 5, 15, 'crumb'],
  [96, -136, 70, 6, 50, 'spark'],
  [-102, -30, 30, 4, 25, 'crumb'],
  [12, -98, -80, 4, 45, 'crumb'],
  [160, 30, 180, 7, 55, 'spark'],
  [-168, -48, 20, 8, 5, 'spark'],
];

export const FortuneCookie = forwardRef<HTMLButtonElement, FortuneCookieProps>(function FortuneCookie(
  { phase, onBreak },
  ref,
) {
  const whole = phase === 'idle';
  return (
    <div className="cookie" data-phase={phase}>
      <div className="cookie__glow" aria-hidden="true" />
      <div className="cookie__shadow" aria-hidden="true" />
      <button
        ref={ref}
        type="button"
        className="cookie__button"
        onClick={onBreak}
        disabled={!whole}
        aria-label={whole ? 'Brjóttu jólakexið' : 'Jólakexið er brotið'}
      >
        <span className="cookie__float">
          <span className="cookie__body">
            <CookieHalf side="left" />
            <CookieHalf side="right" />
            <span className="cookie__flash" aria-hidden="true" />
          </span>
        </span>
      </button>
      <div className="cookie__crumbs" aria-hidden="true">
        {CRUMBS.map(([dx, dy, r, s, d, kind], i) => (
          <span
            key={i}
            className={`crumb crumb--${kind}`}
            style={
              {
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                '--r': `${r}deg`,
                '--s': `${s}px`,
                '--d': `${d}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
});

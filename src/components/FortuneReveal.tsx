import type { CSSProperties, Ref } from 'react';
import type { CookieState } from '../lib/cookieMachine';
import { FortuneCookie } from './FortuneCookie';
import { FortunePaper } from './FortunePaper';

interface FortuneRevealProps {
  state: CookieState;
  onBreak: () => void;
  cookieRef?: Ref<HTMLButtonElement>;
  paperRef?: Ref<HTMLElement>;
}

/** Twinkling golden sparks orbiting the cookie: [left %, top %, size px, delay s] */
const SPARKS: readonly (readonly [number, number, number, number])[] = [
  [8, 22, 14, 0],
  [90, 16, 10, 1.4],
  [18, 78, 9, 2.6],
  [84, 70, 16, 0.8],
  [50, 4, 8, 3.1],
  [66, 30, 7, 1.9],
  [30, 10, 6, 2.2],
  [96, 48, 8, 3.6],
  [3, 52, 7, 1.1],
];

/** The stage: cookie, ambient sparkles and the fortune paper share one grid cell. */
export function FortuneReveal({ state, onBreak, cookieRef, paperRef }: FortuneRevealProps) {
  const { phase, fortune, round } = state;
  const showPaper = fortune !== null && (phase === 'revealing' || phase === 'revealed' || phase === 'resetting');

  return (
    <section className="stage" data-phase={phase} aria-label="Jólakexið">
      <div className="stage__sparks" aria-hidden="true">
        {SPARKS.map(([left, top, size, delay], i) => (
          <span
            key={i}
            className="spark"
            style={{ left: `${left}%`, top: `${top}%`, '--size': `${size}px`, '--delay': `${delay}s` } as CSSProperties}
          />
        ))}
      </div>
      <FortuneCookie key={round} ref={cookieRef} phase={phase} onBreak={onBreak} />
      {showPaper && fortune && (
        <div className="stage__paper" data-phase={phase}>
          <FortunePaper ref={paperRef} fortune={fortune} />
        </div>
      )}
    </section>
  );
}

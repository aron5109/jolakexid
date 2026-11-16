import type { Ref } from 'react';
import type { CookieState } from '../lib/cookieMachine';
import { FortuneCookie } from './FortuneCookie';
import { FortunePaper } from './FortunePaper';

interface FortuneRevealProps {
  state: CookieState;
  onBreak: () => void;
  cookieRef?: Ref<HTMLButtonElement>;
  paperRef?: Ref<HTMLElement>;
}

/** The stage: the cookie and the fortune paper share one grid cell. */
export function FortuneReveal({ state, onBreak, cookieRef, paperRef }: FortuneRevealProps) {
  const { phase, fortune, round } = state;
  const showPaper = fortune !== null && (phase === 'revealing' || phase === 'revealed' || phase === 'resetting');

  return (
    <section className="stage" data-phase={phase} aria-label="Jólakexið">
      <FortuneCookie key={round} ref={cookieRef} phase={phase} onBreak={onBreak} />
      {showPaper && fortune && (
        <div className="stage__paper" data-phase={phase}>
          <FortunePaper ref={paperRef} fortune={fortune} />
        </div>
      )}
    </section>
  );
}

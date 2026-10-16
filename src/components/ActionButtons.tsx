import type { Ref } from 'react';
import type { CookiePhase } from '../lib/cookieMachine';
import { CheckIcon, ChevronIcon, CopyIcon, RefreshIcon } from './icons';

export type CopyStatus = 'idle' | 'copied' | 'failed';

interface ActionButtonsProps {
  phase: CookiePhase;
  copyStatus: CopyStatus;
  onBreak: () => void;
  onAnother: () => void;
  onCopy: () => void;
  anotherRef?: Ref<HTMLButtonElement>;
}

export function ActionButtons({ phase, copyStatus, onBreak, onAnother, onCopy, anotherRef }: ActionButtonsProps) {
  const showReveal = phase === 'revealing' || phase === 'revealed' || phase === 'resetting';

  if (!showReveal) {
    return (
      <div className="actions" data-phase={phase}>
        <button type="button" className="btn btn--gold btn--cta" onClick={onBreak} disabled={phase !== 'idle'}>
          <span>Brjóttu jólakexið</span>
          <ChevronIcon className="btn__icon" />
        </button>
      </div>
    );
  }

  const interactive = phase === 'revealed';
  return (
    <div className="actions actions--pair" data-phase={phase}>
      <button
        ref={anotherRef}
        type="button"
        className="btn btn--gold"
        onClick={onAnother}
        disabled={!interactive}
      >
        <RefreshIcon className="btn__icon" />
        <span>Fá annað kex</span>
      </button>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={onCopy}
        disabled={!interactive}
        data-status={copyStatus}
        aria-describedby={copyStatus === 'failed' ? 'copy-error' : undefined}
      >
        {copyStatus === 'copied' ? <CheckIcon className="btn__icon" /> : <CopyIcon className="btn__icon" />}
        <span>{copyStatus === 'copied' ? 'Afritað!' : 'Afrita boðskap'}</span>
      </button>
      {copyStatus === 'failed' && (
        <p className="actions__error" id="copy-error" role="alert">
          Ekki tókst að afrita sjálfkrafa. Textinn hefur verið valinn svo þú getur afritað hann handvirkt.
        </p>
      )}
    </div>
  );
}

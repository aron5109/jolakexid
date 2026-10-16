import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionButtons, type CopyStatus } from './components/ActionButtons';
import { ChristmasBackground } from './components/ChristmasBackground';
import { FortuneReveal } from './components/FortuneReveal';
import { Ornament } from './components/Ornament';
import { SoundToggle } from './components/SoundToggle';
import { CupIcon, GiftIcon, SnowflakeIcon, SparkleIcon, StarIcon } from './components/icons';
import { FORTUNES } from './data/fortunes';
import { useCookieMachine } from './hooks/useCookieMachine';
import { useReducedMotion } from './hooks/useReducedMotion';
import { copyText, formatFortuneForCopy } from './lib/clipboard';
import { FULL_MOTION_DURATIONS, REDUCED_MOTION_DURATIONS, type CookieState } from './lib/cookieMachine';
import { drawFortune } from './lib/fortunePicker';
import { playCrack, playShimmer, unlockAudio } from './lib/sound';

const CATEGORIES = [
  { label: 'Jólaspeki', Icon: StarIcon },
  { label: 'Vinnuspá', Icon: CupIcon },
  { label: 'Jólaheppni', Icon: GiftIcon },
  { label: 'Nýársspá', Icon: SparkleIcon },
] as const;

const COPIED_RESET_MS = 2200;

function focusIsLost(): boolean {
  const active = document.activeElement as HTMLElement | null;
  return !active || active === document.body || (active as HTMLButtonElement).disabled === true;
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [soundOn, setSoundOn] = useState(false);
  const soundRef = useRef(soundOn);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [announcement, setAnnouncement] = useState('');
  const [copyAnnouncement, setCopyAnnouncement] = useState('');
  const copyTimer = useRef<number | undefined>(undefined);
  // Bumped on every reset so a slow clipboard write can't report on the next cookie.
  const copyGeneration = useRef(0);

  const cookieRef = useRef<HTMLButtonElement>(null);
  const anotherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  const draw = useCallback(() => drawFortune(FORTUNES), []);

  const onPhaseChange = useCallback((next: CookieState) => {
    switch (next.phase) {
      case 'cracking':
        if (soundRef.current) playCrack();
        break;
      case 'revealing':
        if (soundRef.current) playShimmer();
        break;
      case 'revealed':
        if (next.fortune) setAnnouncement(`Jólaboðskapurinn þinn: ${next.fortune.text}`);
        break;
      case 'resetting':
        copyGeneration.current += 1;
        window.clearTimeout(copyTimer.current);
        setCopyStatus('idle');
        setCopyAnnouncement('');
        setAnnouncement('');
        break;
      default:
        break;
    }
  }, []);

  const { state, breakCookie, reset } = useCookieMachine({
    durations: reducedMotion ? REDUCED_MOTION_DURATIONS : FULL_MOTION_DURATIONS,
    drawFortune: draw,
    onPhaseChange,
  });

  // Keep keyboard focus somewhere sensible as controls appear and disappear.
  useEffect(() => {
    if (state.phase === 'revealed' && focusIsLost()) anotherRef.current?.focus();
    if (state.phase === 'idle' && state.round > 0 && focusIsLost()) cookieRef.current?.focus();
  }, [state.phase, state.round]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const handleCopy = useCallback(async () => {
    if (!state.fortune) return;
    const generation = copyGeneration.current;
    const ok = await copyText(formatFortuneForCopy(state.fortune.text));
    if (generation !== copyGeneration.current) return;
    window.clearTimeout(copyTimer.current);
    if (ok) {
      setCopyStatus('copied');
      setCopyAnnouncement('Afritað!');
      copyTimer.current = window.setTimeout(() => {
        setCopyStatus('idle');
        setCopyAnnouncement('');
      }, COPIED_RESET_MS);
    } else {
      setCopyStatus('failed');
      const text = document.getElementById('fortune-text');
      const selection = window.getSelection();
      if (text && selection) {
        const range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [state.fortune]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      if (!on) unlockAudio();
      return !on;
    });
  }, []);

  return (
    <>
      <ChristmasBackground />
      <SoundToggle enabled={soundOn} onToggle={toggleSound} />
      <main className="app" data-phase={state.phase} data-reduced-motion={reducedMotion || undefined}>
        <header className="hero">
          <Ornament />
          <h1 className="title">Jólakexið</h1>
          <p className="subtitle">Lítil spá fyrir stóra daga</p>
        </header>

        <p className="intro">Hvaða jólaboðskap geymir kexið þitt?</p>

        <FortuneReveal state={state} onBreak={breakCookie} cookieRef={cookieRef} />

        <ActionButtons
          phase={state.phase}
          copyStatus={copyStatus}
          onBreak={breakCookie}
          onAnother={reset}
          onCopy={handleCopy}
          anotherRef={anotherRef}
        />

        <ul className="categories" aria-label="Tegundir spádóma">
          {CATEGORIES.map(({ label, Icon }) => (
            <li key={label}>
              <Icon className="categories__icon" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <footer className="footer">
          <p>Lítið kex. Stór jólagleði.</p>
          <div className="footer__mark" aria-hidden="true">
            <span />
            <SnowflakeIcon />
            <span />
          </div>
        </footer>

        <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {copyAnnouncement}
        </div>
      </main>
    </>
  );
}

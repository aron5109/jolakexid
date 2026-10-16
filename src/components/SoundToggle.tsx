import { SoundOffIcon, SoundOnIcon } from './icons';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={enabled}
      onClick={onToggle}
      title={enabled ? 'Slökkva á hljóði' : 'Kveikja á hljóði'}
    >
      {enabled ? <SoundOnIcon /> : <SoundOffIcon />}
      <span className="sound-toggle__label">Hljóð</span>
    </button>
  );
}

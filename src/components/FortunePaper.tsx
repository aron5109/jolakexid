import { forwardRef } from 'react';
import { CATEGORY_LABELS, type Fortune } from '../data/fortunes';

interface FortunePaperProps {
  fortune: Fortune;
}

const Flourish = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <path
      d="M3 37V16C3 8.8 8.8 3 16 3h21M8 37V18c0-5.5 4.5-10 10-10h19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <circle cx="14" cy="14" r="1.8" fill="currentColor" />
  </svg>
);

/** The cream paper slip with the fortune. */
export const FortunePaper = forwardRef<HTMLElement, FortunePaperProps>(function FortunePaper({ fortune }, ref) {
  return (
    <article className="paper" ref={ref} tabIndex={-1} aria-labelledby="paper-heading">
      <Flourish className="paper__corner paper__corner--tl" />
      <Flourish className="paper__corner paper__corner--tr" />
      <Flourish className="paper__corner paper__corner--bl" />
      <Flourish className="paper__corner paper__corner--br" />
      <h2 id="paper-heading" className="paper__heading">
        Jólaboðskapurinn þinn
      </h2>
      <div className="paper__divider" aria-hidden="true">
        <span />
        <svg viewBox="0 0 24 24">
          <path d="M12 3c.6 4.6 2.3 6.3 7 7-4.7.7-6.4 2.4-7 7-.6-4.6-2.3-6.3-7-7 4.7-.7 6.4-2.4 7-7z" fill="currentColor" />
        </svg>
        <span />
      </div>
      <p className="paper__text" id="fortune-text">
        {fortune.text}
      </p>
      <p className="paper__category">{CATEGORY_LABELS[fortune.category]}</p>
    </article>
  );
});

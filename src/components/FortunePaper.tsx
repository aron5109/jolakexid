import { forwardRef } from 'react';
import { CATEGORY_LABELS, type Fortune } from '../data/fortunes';

interface FortunePaperProps {
  fortune: Fortune;
}

/** The cream paper slip with the fortune. */
export const FortunePaper = forwardRef<HTMLElement, FortunePaperProps>(function FortunePaper({ fortune }, ref) {
  return (
    <article className="paper" ref={ref} tabIndex={-1} aria-labelledby="paper-heading">
      <h2 id="paper-heading" className="visually-hidden">
        Jólaboðskapurinn þinn
      </h2>
      <p className="paper__text" id="fortune-text">
        {fortune.text}
      </p>
      <p className="paper__category">{CATEGORY_LABELS[fortune.category]}</p>
    </article>
  );
});

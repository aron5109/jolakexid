/** Small golden Christmas tree with a star — the brand mark above the title. */
export function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 48 56" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ornament-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCE6B2" />
          <stop offset="0.5" stopColor="#E5B861" />
          <stop offset="1" stopColor="#B4813A" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ornament-gold)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M24 3.5l1.6 3.4 3.7.4-2.8 2.5.8 3.6L24 11.6l-3.3 1.8.8-3.6-2.8-2.5 3.7-.4z" fill="url(#ornament-gold)" />
        <path d="M24 15 15.5 27h4.5L12 38.5h6L9 50h30l-9-11.5h6L28 27h4.5z" />
        <path d="M24 50v4.5" />
        <path d="M16.5 44.5c5 1.6 10 1.6 15-1.2M19 33.5c3.6 1 7 1 10.2-.9" strokeWidth="1.1" opacity="0.8" />
      </g>
      <g fill="#FCE6B2">
        <circle cx="21" cy="24" r="1.1" />
        <circle cx="27.5" cy="35.5" r="1.1" />
        <circle cx="18" cy="41" r="1.1" />
        <circle cx="31" cy="46" r="1.1" />
      </g>
    </svg>
  );
}

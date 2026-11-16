import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export const RefreshIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.8 4.5v3.8H16" />
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.7a2.2 2.2 0 0 0-2.2-2.2H6.7a2.2 2.2 0 0 0-2.2 2.2v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5.5 12.5 4.2 4.2 8.8-9.4" strokeWidth="2" />
  </svg>
);

export const SoundOnIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" fill="currentColor" fillOpacity="0.15" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
    <path d="M18 6.5a7.6 7.6 0 0 1 0 11" />
  </svg>
);

export const SoundOffIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" fill="currentColor" fillOpacity="0.15" />
    <path d="m15.5 9.5 5 5m0-5-5 5" />
  </svg>
);

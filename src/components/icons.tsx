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

export const ChevronIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9.5 6.5 15 12l-5.5 5.5" strokeWidth="2" />
  </svg>
);

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

export const StarIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8L8 13.6l-4.3-4 5.8-.7z" fill="currentColor" fillOpacity="0.18" />
  </svg>
);

export const CupIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 10h11v4.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14.5z" fill="currentColor" fillOpacity="0.18" />
    <path d="M16 11.5h1.2a2.3 2.3 0 0 1 0 4.6H16" />
    <path d="M8.5 7.5c0-1.2 1.2-1.3 1.2-2.6M12 7.5c0-1.2 1.2-1.3 1.2-2.6" />
  </svg>
);

export const GiftIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="4.5" y="9" width="15" height="10.5" rx="1.2" fill="currentColor" fillOpacity="0.18" />
    <path d="M3.8 9h16.4M12 9v10.5" />
    <path d="M12 9c-1.4-3.6-5.4-4.2-5.4-1.8C6.6 8.6 9 9 12 9zm0 0c1.4-3.6 5.4-4.2 5.4-1.8C17.4 8.6 15 9 12 9z" />
  </svg>
);

export const SparkleIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3.5c.7 4.4 2.1 5.8 6.5 6.5-4.4.7-5.8 2.1-6.5 6.5-.7-4.4-2.1-5.8-6.5-6.5 4.4-.7 5.8-2.1 6.5-6.5z" fill="currentColor" fillOpacity="0.18" />
    <path d="M18 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z" />
  </svg>
);

export const SnowflakeIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    <path d="m9.6 4.6 2.4 2 2.4-2M9.6 19.4l2.4-2 2.4 2M4.6 10.4l3-.9-.7-3M19.4 13.6l-3 .9.7 3M4.6 13.6l3 .9-.7 3M19.4 10.4l-3-.9.7-3" />
  </svg>
);

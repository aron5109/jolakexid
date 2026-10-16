import { useId } from 'react';
import { BAKE_SPOTS, VIEW_H, VIEW_W, cookiePaths, mx, type Side } from './cookieGeometry';

interface CookieHalfProps {
  side: Side;
}

/**
 * One half of the fortune cookie as layered SVG: a warm radial bake, crease and
 * lip shading, procedural surface relief, sugar sparkle, toasted spots and highlights.
 */
export function CookieHalf({ side }: CookieHalfProps) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${name}-${side}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;
  const p = cookiePaths(side);
  const seed = side === 'left' ? 3 : 11;
  const dy = side === 'left' ? 0 : 7;

  return (
    <svg
      className={`cookie-half cookie-half--${side}`}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={id('fill')} gradientUnits="userSpaceOnUse" cx={mx(side, 146)} cy="62" r="178">
          <stop offset="0" stopColor="#FCDDA0" />
          <stop offset="0.24" stopColor="#F0BC6C" />
          <stop offset="0.52" stopColor="#E09D4B" />
          <stop offset="0.8" stopColor="#BC7331" />
          <stop offset="1" stopColor="#7C3F12" />
        </radialGradient>
        <linearGradient id={id('crease')} gradientUnits="userSpaceOnUse" x1={mx(side, 140)} y1="0" x2={mx(side, 206)} y2="0">
          <stop offset="0" stopColor="#5A2208" stopOpacity="0" />
          <stop offset="0.55" stopColor="#5A2208" stopOpacity="0.28" />
          <stop offset="0.85" stopColor="#4A1A05" stopOpacity="0.65" />
          <stop offset="1" stopColor="#2E0E02" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={id('base')} gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="215">
          <stop offset="0" stopColor="#5A2208" stopOpacity="0" />
          <stop offset="1" stopColor="#5A2208" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={id('lip')} gradientUnits="userSpaceOnUse" x1="0" y1="178" x2="0" y2="240">
          <stop offset="0" stopColor="#EDBB6E" />
          <stop offset="0.4" stopColor="#F2C47A" />
          <stop offset="1" stopColor="#B06A26" />
        </linearGradient>
        <radialGradient id={id('shine')} gradientUnits="userSpaceOnUse" cx={mx(side, 146)} cy="56" r="74">
          <stop offset="0" stopColor="#FFF3D2" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#FFE7B0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFE7B0" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id('clip')}>
          <path d={p.body} />
        </clipPath>
        {/* Baked surface: multiplies the colour layers with a lit noise relief and adds sugary glints. */}
        <filter id={id('bake')} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.032 0.042" numOctaves="4" seed={seed} result="noise" />
          <feDiffuseLighting in="noise" surfaceScale="3" diffuseConstant="1" lightingColor="#FFFFFF" result="diffuse">
            <feDistantLight azimuth={side === 'left' ? 235 : 305} elevation="52" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="0.5" k2="0.62" k3="0" k4="0" result="lit" />
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="2" seed={seed + 2} result="fine" />
          <feSpecularLighting
            in="fine"
            surfaceScale="1.6"
            specularConstant="0.85"
            specularExponent="30"
            lightingColor="#FFE6B0"
            result="spec"
          >
            <feDistantLight azimuth={side === 'left' ? 235 : 305} elevation="58" />
          </feSpecularLighting>
          <feComposite in="lit" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0.22" k4="0" result="glint" />
          <feComposite in="glint" in2="SourceAlpha" operator="in" />
        </filter>
        <filter id={id('sugar')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={seed + 4} />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.8  0 0 0 14 -9.6" />
        </filter>
        <filter id={id('blur6')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id('blur3')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g filter={url('bake')}>
        <path d={p.body} fill={url('fill')} />
        <g clipPath={url('clip')}>
          {BAKE_SPOTS.map(([x, y, rx, ry, o], i) => (
            <ellipse
              key={i}
              cx={mx(side, x)}
              cy={y + dy}
              rx={rx}
              ry={ry}
              fill="#7A3A0E"
              opacity={o}
              filter={url('blur6')}
            />
          ))}
          <rect width={VIEW_W} height={VIEW_H} fill={url('base')} />
          <rect width={VIEW_W} height={VIEW_H} fill={url('crease')} />
          <path d={p.ridge} fill="none" stroke="#FFE3A6" strokeWidth="18" strokeLinecap="round" opacity="0.3" filter={url('blur6')} />
          <path d={p.lipSeam} fill="none" stroke="#4A1A05" strokeWidth="10" strokeLinecap="round" opacity="0.38" filter={url('blur3')} />
          <path d={p.body} fill="none" stroke="#5A2208" strokeWidth="22" opacity="0.42" filter={url('blur6')} />
          <path d={p.lip} fill={url('lip')} />
          <ellipse cx={mx(side, 200)} cy="182" rx="22" ry="34" fill="#2E0E02" opacity="0.55" filter={url('blur6')} />
        </g>
      </g>
      <g clipPath={url('clip')}>
        <ellipse
          cx={mx(side, 146)}
          cy="56"
          rx="72"
          ry="30"
          fill={url('shine')}
          transform={`rotate(${side === 'left' ? -22 : 22} ${mx(side, 146)} 56)`}
        />
        <path d={p.lip} fill="none" stroke="#FFF0C8" strokeWidth="1" opacity="0.35" />
        <rect width={VIEW_W} height={VIEW_H} filter={url('sugar')} opacity="0.4" />
      </g>

      <path d={p.body} fill="none" stroke="#5E2508" strokeOpacity="0.45" strokeWidth="1.6" />
      <path d={p.body} fill="none" stroke="#FFDFA0" strokeOpacity="0.32" strokeWidth="1" transform="translate(0 1.2)" />
    </svg>
  );
}

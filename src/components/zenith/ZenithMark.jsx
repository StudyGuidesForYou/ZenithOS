import React from 'react';

let uid = 0;

/* Vector rendition of the ZenithOS mark — a violet sword framed by a
   triangle, matching the uploaded logo. Used where the artwork is too small
   to read (menu bar, dock, tiny glyphs). */
export default function ZenithMark({ className = 'h-8 w-8', glow = false }) {
  const gid = React.useMemo(() => `zenith-grad-${(uid += 1)}`, []);
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={glow ? { filter: 'drop-shadow(0 0 16px rgba(160,32,240,0.6))' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0.15" y1="1" x2="0.85" y2="0">
          <stop offset="0%" stopColor="#3B0A72" />
          <stop offset="52%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>
        <linearGradient id={`${gid}-blade`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="60%" stopColor="#A020F0" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>
      </defs>

      {/* triangular frame */}
      <path
        d="M50 9 L91 85 H9 Z"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="5.5"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path d="M50 24 L77 76 H23 Z" fill={`url(#${gid})`} opacity="0.18" />

      {/* blade */}
      <path d="M79 25 L51.5 62.5 L41.5 53.5 Z" fill={`url(#${gid}-blade)`} />
      <path d="M70 32 L47 58" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />

      {/* crossguard */}
      <path d="M58 66.5 L54.5 70 L34 49.5 L37.5 46 Z" fill={`url(#${gid})`} />

      {/* grip + pommel */}
      <path d="M47.4 59.4 L44.6 56.6 L33.6 67.6 L36.4 70.4 Z" fill={`url(#${gid})`} />
      <circle cx="34.2" cy="69.8" r="3.6" fill={`url(#${gid})`} />
    </svg>
  );
}
import type { ReactNode } from 'react'

/** Small stationery ornaments for the landing site (pure SVG). */

/** A wax-seal monogram — the brand mark. */
export function WaxSeal({ className = '', letter = 'M' }: { className?: string; letter?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="seal-wax" cx="38%" cy="32%">
          <stop offset="0" stopColor="#a8384f" />
          <stop offset=".7" stopColor="#6b2234" />
          <stop offset="1" stopColor="#4c1524" />
        </radialGradient>
      </defs>
      <path
        d="M32 3c5 0 7 3 11 3.5s7 2.5 9 6.5 1 7 3 10.5 3.5 6.5 2 10.5-1 7-3.5 10-6.5 4.5-9 7-5.5 4.5-9.5 5-7.5 1-11 0-6.5-3-9.5-5.5-5.5-4-7-8-1-7.5-2.5-11 .5-7 2.5-10S14 8 18 6.5 27 3 32 3z"
        fill="url(#seal-wax)"
      />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#e7c98d" strokeOpacity=".55" strokeWidth="1" />
      <text x="32" y="40" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontSize="24" fill="#f3dca6">
        {letter}
      </text>
    </svg>
  )
}

/** A fine botanical sprig in gold line-art. */
export function Sprig({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 52 C30 46 60 34 116 10" />
      {[
        [22, 47, -30],
        [38, 41, -38],
        [54, 34, -42],
        [70, 27, -46],
        [86, 20, -50],
        [100, 14, -54],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0 C4 -8 12 -10 16 -6 C12 -2 6 0 0 0Z" />
          <path d="M0 0 C4 8 12 10 16 6 C12 2 6 0 0 0Z" opacity=".7" />
        </g>
      ))}
      <circle cx="116" cy="10" r="2.2" fill="currentColor" />
    </svg>
  )
}

/** Gold hairline with a centre diamond. */
export function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-site-gold ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-current" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-60" />
    </div>
  )
}

/** Small uppercase label used above headings. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] text-site-rose ${className}`}>{children}</p>
}

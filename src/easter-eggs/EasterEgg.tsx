import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useEggs } from './useEasterEggs'

const BUTTERFLY_CSS = `
@keyframes egg-butterfly-drift {
  0%   { opacity: 0; transform: translate3d(0, -4px, 0) rotate(-12deg) scale(.7); }
  18%  { opacity: 1; }
  100% { opacity: 0; transform: translate3d(10px, 52px, 0) rotate(18deg) scale(1.05); }
}
.egg-butterfly-ornament { animation: egg-butterfly-drift 2.4s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .egg-butterfly-ornament { animation: none; opacity: 1; transform: none; }
}
`

function Butterfly() {
  return (
    <svg viewBox="0 0 36 30" className="h-7 w-8" aria-hidden="true">
      <path
        d="M17 14C12 5 3 4 3 11c0 4 5 6 12 6Z"
        fill="rgba(233, 131, 154, 0.85)"
        stroke="rgba(74, 47, 69, 0.45)"
        strokeWidth="0.8"
      />
      <path
        d="M19 14C24 5 33 4 33 11c0 4-5 6-12 6Z"
        fill="rgba(233, 131, 154, 0.85)"
        stroke="rgba(74, 47, 69, 0.45)"
        strokeWidth="0.8"
      />
      <path
        d="M17 16C11 16 6 19 7 24c1 4 7 3 10-2Z"
        fill="rgba(201, 164, 92, 0.85)"
        stroke="rgba(74, 47, 69, 0.45)"
        strokeWidth="0.8"
      />
      <path
        d="M19 16C25 16 30 19 29 24c-1 4-7 3-10-2Z"
        fill="rgba(201, 164, 92, 0.85)"
        stroke="rgba(74, 47, 69, 0.45)"
        strokeWidth="0.8"
      />
      <path d="M18 12v11" stroke="#4a2f45" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12c-2-3-4-4-5.5-4M18 12c2-3 4-4 5.5-4" stroke="#4a2f45" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export default function EasterEgg({
  id,
  tooltip,
  children,
  label,
  className,
  effect,
}: {
  id: string
  tooltip: string
  children: ReactNode
  label: string
  className?: string
  effect?: 'butterfly' | 'none'
}) {
  const { discover } = useEggs()
  const [showTooltip, setShowTooltip] = useState(false)
  const [butterflyKey, setButterflyKey] = useState(0)
  const [showButterfly, setShowButterfly] = useState(false)
  const tooltipTimer = useRef<number | null>(null)
  const butterflyTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (tooltipTimer.current !== null) window.clearTimeout(tooltipTimer.current)
      if (butterflyTimer.current !== null) window.clearTimeout(butterflyTimer.current)
    },
    [],
  )

  const handleClick = () => {
    discover(id)
    setShowTooltip(true)
    if (tooltipTimer.current !== null) window.clearTimeout(tooltipTimer.current)
    tooltipTimer.current = window.setTimeout(() => setShowTooltip(false), 3200)

    if (effect === 'butterfly') {
      setButterflyKey((key) => key + 1)
      setShowButterfly(true)
      if (butterflyTimer.current !== null) window.clearTimeout(butterflyTimer.current)
      butterflyTimer.current = window.setTimeout(() => setShowButterfly(false), 2500)
    }
  }

  return (
    <span className={`relative inline-flex shrink-0 ${className ?? ''}`}>
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-leaf"
      >
        {children}
      </button>

      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-40 w-max max-w-[15rem] -translate-x-1/2 rounded-md washi-paper px-2.5 py-1.5 text-center text-[11px] leading-snug text-sumi sakura-shadow transition-opacity duration-300 ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        {showTooltip ? tooltip : ''}
      </span>

      {effect === 'butterfly' && showButterfly && (
        <>
          <style>{BUTTERFLY_CSS}</style>
          <span
            key={butterflyKey}
            aria-hidden="true"
            className="egg-butterfly-ornament pointer-events-none absolute left-1/2 top-[calc(100%-6px)] z-30"
          >
            <Butterfly />
          </span>
        </>
      )}
    </span>
  )
}

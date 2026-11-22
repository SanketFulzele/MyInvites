import { useEffect, useRef, useState } from 'react'
import { useEggs } from './useEasterEggs'

const RAMEN_TOOLTIP = "Never going back on our word — that's our nindo, believe it."

function RamenBowl({ variant }: { variant: 'first' | 'second' }) {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden="true">
      <path
        d="M17 15c-3-3 2-5 0-9M25 14c-3-4 3-5 1-10M33 15c-3-3 2-5 0-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse cx="24" cy="23" rx="17" ry="5.5" fill="#f3d8b0" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="24" cy="23.5" rx="14" ry="3.8" fill="#d9a24b" opacity="0.7" />
      <path
        d="M14 22c3-2 5 2 8 0s5 2 9 0"
        fill="none"
        stroke="#fff2d4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {variant === 'first' ? (
        <circle cx="30" cy="21" r="3.2" fill="#fff6e2" stroke="#c9a45c" strokeWidth="1" />
      ) : (
        <>
          <circle cx="30" cy="21" r="3.2" fill="#fff6e2" stroke="#c9a45c" strokeWidth="1" />
          <path
            d="M28.4 21a1.7 1.7 0 1 0 3.3.3c0-1.4-2.4-1.6-2.4-.1"
            fill="none"
            stroke="#e9839a"
            strokeWidth="1"
          />
        </>
      )}
      <path
        d="M8 24c1 11 7 16 16 16s15-5 16-16Z"
        fill="#b5532f"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M13 30h22" stroke="#ffe3a0" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export default function RamenEgg({ className }: { className?: string }) {
  const { discover } = useEggs()
  const [clicked, setClicked] = useState<[boolean, boolean]>([false, false])
  const [showTooltip, setShowTooltip] = useState(false)
  const clickedRef = useRef<[boolean, boolean]>([false, false])
  const tooltipTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (tooltipTimer.current !== null) window.clearTimeout(tooltipTimer.current)
    },
    [],
  )

  const handleClick = (index: 0 | 1) => {
    const next: [boolean, boolean] = [clickedRef.current[0], clickedRef.current[1]]
    next[index] = true
    clickedRef.current = next
    setClicked(next)

    if (next[0] && next[1]) {
      setShowTooltip(true)
      discover('ramen')
      if (tooltipTimer.current !== null) window.clearTimeout(tooltipTimer.current)
      tooltipTimer.current = window.setTimeout(() => setShowTooltip(false), 6000)
    }
  }

  return (
    <span className={`relative inline-flex items-center gap-1 ${className ?? ''}`}>
      <button
        type="button"
        aria-label="First steaming bowl"
        aria-pressed={clicked[0]}
        onClick={() => handleClick(0)}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-leaf ${clicked[0] ? 'opacity-50' : 'text-sakura-plum'}`}
      >
        <RamenBowl variant="first" />
      </button>
      <button
        type="button"
        aria-label="Second steaming bowl"
        aria-pressed={clicked[1]}
        onClick={() => handleClick(1)}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-leaf ${clicked[1] ? 'opacity-50' : 'text-sakura-plum'}`}
      >
        <RamenBowl variant="second" />
      </button>
      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-40 w-max max-w-[17rem] -translate-x-1/2 rounded-md washi-paper px-2.5 py-1.5 text-center text-[11px] leading-snug text-sumi sakura-shadow transition-opacity duration-300 ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        {showTooltip ? RAMEN_TOOLTIP : ''}
      </span>
    </span>
  )
}

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { useEggs } from './useEasterEggs'

const DRAGON_BODY =
  'M 52 266 C 100 292 154 260 158 216 C 163 170 110 150 120 110 C 130 70 196 52 236 86 C 278 122 244 178 296 198 C 348 218 410 182 398 128 C 392 100 372 92 352 96'

const STARS: readonly { left: string; top: string; size: number; opacity: number }[] = [
  { left: '8%', top: '16%', size: 2, opacity: 0.7 },
  { left: '17%', top: '62%', size: 1, opacity: 0.5 },
  { left: '24%', top: '30%', size: 2, opacity: 0.45 },
  { left: '33%', top: '78%', size: 1, opacity: 0.65 },
  { left: '41%', top: '12%', size: 1, opacity: 0.6 },
  { left: '52%', top: '54%', size: 2, opacity: 0.35 },
  { left: '61%', top: '22%', size: 1, opacity: 0.7 },
  { left: '70%', top: '70%', size: 2, opacity: 0.5 },
  { left: '78%', top: '36%', size: 1, opacity: 0.6 },
  { left: '87%', top: '14%', size: 2, opacity: 0.55 },
  { left: '92%', top: '62%', size: 1, opacity: 0.5 },
]

function DragonSky() {
  return (
    <svg viewBox="0 0 560 340" className="mx-auto h-auto w-full max-w-3xl" aria-hidden="true">
      <defs>
        <linearGradient id="egg-dragon-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a97c32" />
          <stop offset="45%" stopColor="#ffe6a3" />
          <stop offset="100%" stopColor="#c9a45c" />
        </linearGradient>
        <filter id="egg-dragon-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="#ffffff" opacity="0.07">
        <ellipse cx="96" cy="256" rx="96" ry="17" />
        <ellipse cx="196" cy="226" rx="70" ry="13" />
        <ellipse cx="458" cy="150" rx="108" ry="16" />
        <ellipse cx="384" cy="122" rx="72" ry="11" />
      </g>

      <path d={DRAGON_BODY} fill="none" stroke="#5b3d1c" strokeWidth="27" strokeLinecap="round" opacity="0.55" />
      <path
        d={DRAGON_BODY}
        fill="none"
        stroke="url(#egg-dragon-gold)"
        strokeWidth="20"
        strokeLinecap="round"
        filter="url(#egg-dragon-glow)"
      />
      <path d={DRAGON_BODY} fill="none" stroke="#fff1c9" strokeWidth="3" strokeLinecap="round" opacity="0.4" />

      <g fill="#ffe3a0" opacity="0.8">
        <path d="M118 148l-12-16 20 7Z" />
        <path d="M160 196l4-19 11 16Z" />
        <path d="M212 76l-6-18 18 12Z" />
        <path d="M268 130l14-14-2 20Z" />
        <path d="M330 206l10-17 4 19Z" />
        <path d="M408 158l18-8-10 18Z" />
      </g>

      <g transform="translate(352 96)">
        <path
          d="M6-12C-10-16-28-8-34 2c4 8 20 12 34 8 10-2 14-10 6-22Z"
          fill="url(#egg-dragon-gold)"
          stroke="#7a5524"
          strokeWidth="1.5"
        />
        <path d="M-30 0c-10-2-16 2-14 6 4 3 12 2 16 0Z" fill="#ffe6a3" stroke="#7a5524" strokeWidth="1" />
        <circle cx="-12" cy="-3" r="2.4" fill="#3a1f2b" />
        <circle cx="-12.7" cy="-3.8" r="0.7" fill="#fff8df" />
        <path d="M6-10C12-26 22-30 28-34 22-22 18-14 12-6Z" fill="#ffe3a0" stroke="#7a5524" strokeWidth="1" />
        <path d="M12-4C24-14 34-14 40-18 32-8 24-2 16 2Z" fill="#e9c46a" stroke="#7a5524" strokeWidth="1" />
        <path d="M8 6l18 4-14 6Z" fill="#ffe3a0" opacity="0.9" />
        <path d="M-32 4c-18 4-24 14-38 16M-30 8c-12 8-16 18-26 22" fill="none" stroke="#ffe3a0" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g fill="#ffffff" opacity="0.12">
        <ellipse cx="130" cy="282" rx="86" ry="11" />
        <ellipse cx="430" cy="104" rx="76" ry="9" />
      </g>
    </svg>
  )
}

export default function WishMoment() {
  const { wishOpen, closeWish } = useEggs()
  const reduced = usePrefersReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!wishOpen) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeWish()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [wishOpen, closeWish])

  useEffect(() => {
    if (!wishOpen || reduced) return
    const frame = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [wishOpen, reduced])

  if (!wishOpen) return null

  const shown = reduced || visible

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-night/95 px-5 py-10 transition-opacity ${reduced ? 'duration-0' : 'duration-700'} ${shown ? 'opacity-100' : 'opacity-0'}`}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {STARS.map((star) => (
          <span
            key={`${star.left}-${star.top}`}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wish-title"
        className={`pointer-events-auto relative w-full max-w-3xl rounded-3xl border border-gold-leaf/30 bg-sumi/70 px-6 py-8 text-center sakura-shadow backdrop-blur-sm sm:px-10 sm:py-10 ${reduced ? '' : `transition-transform duration-700 ${shown ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}`}
      >
        <DragonSky />
        <p className="mt-1 font-jp text-[10px] uppercase tracking-[0.4em] text-gold-leaf">A little magic, unlocked</p>
        <h2
          id="wish-title"
          className="mx-auto mt-3 max-w-xl text-balance font-display text-2xl leading-snug text-sakura-cream sm:text-4xl"
        >
          Your wish: to see Anushka &amp; Virat happily ever after. Granted.
        </h2>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close the wish"
          onClick={closeWish}
          className="mt-7 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gold-leaf/50 px-5 font-sans text-xs tracking-[0.2em] text-gold-leaf outline-none transition-colors hover:bg-gold-leaf/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-leaf"
        >
          Close
        </button>
      </div>
    </div>
  )
}

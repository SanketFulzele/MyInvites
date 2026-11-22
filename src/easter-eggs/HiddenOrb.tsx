import { ORB_IDS } from './registry'
import { useEggs } from './useEasterEggs'

const STAR_POSITIONS: readonly { left: string; top: string }[] = [
  { left: '30%', top: '14%' },
  { left: '62%', top: '18%' },
  { left: '76%', top: '42%' },
  { left: '62%', top: '68%' },
  { left: '30%', top: '74%' },
  { left: '16%', top: '48%' },
  { left: '46%', top: '88%' },
]

function TinyStar({ left, top }: { left: string; top: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      className="pointer-events-none absolute h-[5px] w-[5px] fill-vermilion"
      style={{ left, top }}
    >
      <path d="M5 0.5 6.35 3.4 9.6 3.75 7.15 5.95 7.95 9.1 5 7.45 2.05 9.1 2.85 5.95 0.4 3.75 3.65 3.4Z" />
    </svg>
  )
}

export default function HiddenOrb({ id, className, label }: { id: string; className?: string; label?: string }) {
  const { discover, isFound } = useEggs()
  const index = ORB_IDS.findIndex((orbId) => orbId === id)
  const ordinal = index < 0 ? 1 : index + 1
  const found = isFound(id)
  const baseLabel = label ?? `Hidden glowing orb ${ordinal}`
  const accessibleLabel = found ? `${baseLabel} — found` : baseLabel

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      aria-pressed={found}
      onClick={() => discover(id)}
      className={`pointer-events-auto relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-leaf ${className ?? ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none relative block h-3 w-3 rounded-full ${found ? 'opacity-40' : 'animate-breath'}`}
        style={{
          background: found
            ? 'radial-gradient(circle at 35% 30%, #ded0b6 0%, #a08e74 60%, #6f6153 100%)'
            : 'radial-gradient(circle at 35% 30%, #fff8df 0%, #ffd98a 24%, #f2a33a 58%, #c8372d 100%)',
          boxShadow: found
            ? 'none'
            : '0 0 7px 2px rgba(242, 163, 58, 0.8), 0 0 18px 6px rgba(242, 163, 58, 0.35)',
        }}
      />
      {found ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute h-3 w-3 fill-none stroke-2 stroke-sakura-cream"
        >
          <path d="M3 8.5 6.2 11.6 13 4.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        STAR_POSITIONS.slice(0, ordinal).map((star) => (
          <TinyStar key={`${star.left}-${star.top}`} left={star.left} top={star.top} />
        ))
      )}
    </button>
  )
}

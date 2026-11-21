import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useJarvis } from './Jarvis'

// Stone positions on the gauntlet SVG (viewBox 0 0 120 140)
const STONES = [
  { id: 'space', color: '#3b82f6', cx: 41, cy: 52, r: 4.2 },
  { id: 'reality', color: '#ef4444', cx: 55, cy: 49, r: 4.2 },
  { id: 'power', color: '#a855f7', cx: 69, cy: 49, r: 4.2 },
  { id: 'soul', color: '#f97316', cx: 83, cy: 52, r: 4.2 },
  { id: 'time', color: '#22c55e', cx: 30, cy: 82, r: 4.4 },
  { id: 'mind', color: '#facc15', cx: 62, cy: 82, r: 8 },
]

/** Hidden Easter egg: light all six stones, then snap. */
export default function Gauntlet() {
  const { say } = useJarvis()
  const [lit, setLit] = useState<string[]>([])
  const [snapped, setSnapped] = useState(false)
  const complete = lit.length === STONES.length

  const light = (id: string) => {
    if (snapped || lit.includes(id)) return
    const next = [...lit, id]
    setLit(next)
    if (next.length === 1) say('Curious one, aren’t you? Five more to go.', 'gauntlet-start')
    if (next.length === STONES.length) say('All six stones aligned. Snap with caution — preferably at the wedding.')
  }

  const snap = () => {
    if (!complete) return
    setSnapped(true)
    say('I ran 14,000,605 futures. In every single one, they say “yes”.')
    window.setTimeout(() => {
      setSnapped(false)
      setLit([])
    }, 6000)
  }

  return (
    <div className="mx-auto mt-14 flex max-w-xs flex-col items-center">
      <motion.div
        onClick={snap}
        animate={snapped ? { rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.6 }}
        className={`relative ${complete ? 'cursor-pointer' : ''}`}
      >
        <svg viewBox="0 0 120 140" className="h-28 w-24 drop-shadow-[0_0_14px_rgba(232,182,76,.35)]">
          <defs>
            <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe3a0" />
              <stop offset=".45" stopColor="#c9952e" />
              <stop offset="1" stopColor="#7a5414" />
            </linearGradient>
          </defs>
          {/* fingers */}
          {[36, 50, 64, 78].map((x, i) => (
            <rect key={x} x={x} y={i === 0 || i === 3 ? 14 : 6} width="11" height="44" rx="5.5" fill="url(#gold-metal)" stroke="#5c3d0c" strokeWidth=".8" />
          ))}
          {/* thumb */}
          <rect x="12" y="60" width="12" height="36" rx="6" transform="rotate(-28 18 78)" fill="url(#gold-metal)" stroke="#5c3d0c" strokeWidth=".8" />
          {/* back of hand + cuff */}
          <path d="M30 46 h62 v46 c0 10-8 18-18 18 H48 c-10 0-18-8-18-18z" fill="url(#gold-metal)" stroke="#5c3d0c" strokeWidth=".8" />
          <rect x="40" y="108" width="44" height="26" rx="5" fill="url(#gold-metal)" stroke="#5c3d0c" strokeWidth=".8" />
          <path d="M44 116 h36 M44 124 h36" stroke="#7a5414" strokeWidth="1.2" />
        </svg>

        {/* stones as real buttons for touch accuracy */}
        {STONES.map((s) => {
          const on = lit.includes(s.id)
          return (
            <span
              key={s.id}
              role="button"
              tabIndex={0}
              aria-label={`${s.id} stone`}
              onClick={(e) => {
                e.stopPropagation()
                light(s.id)
              }}
              onKeyDown={(e) => e.key === 'Enter' && light(s.id)}
              className="absolute grid place-items-center"
              style={{
                left: `${(s.cx / 120) * 100}%`,
                top: `${(s.cy / 140) * 100}%`,
                width: 28,
                height: 28,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span
                className="block rounded-full transition-all duration-500"
                style={{
                  width: s.r * 2.6,
                  height: s.r * 2.6,
                  background: on ? s.color : '#3a2a12',
                  boxShadow: on ? `0 0 12px 3px ${s.color}` : 'inset 0 0 3px rgba(0,0,0,.8)',
                }}
              />
            </span>
          )
        })}
      </motion.div>

      <div className="mt-3 h-8">
        {complete && !snapped ? (
          <button onClick={snap} className="rounded-full border border-stark-gold/50 px-4 py-1.5 font-hud text-[9px] tracking-[0.35em] text-stark-amber">
            SNAP
          </button>
        ) : (
          <p className="font-hud text-[9px] tracking-[0.35em] text-white/30">{lit.length > 0 && !snapped ? `${lit.length} / 6` : ''}</p>
        )}
      </div>

      <AnimatePresence>
        {snapped && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[65] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

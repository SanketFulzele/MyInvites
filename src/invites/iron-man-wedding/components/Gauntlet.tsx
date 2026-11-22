import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gauntlet as copy } from '../copy'
import { useStatus } from './status'

// Stone positions on the gauntlet artwork (viewBox 0 0 120 140)
const STONES = [
  { id: 'Space', color: '#4f8cff', cx: 41, cy: 52, r: 4 },
  { id: 'Reality', color: '#e0444a', cx: 55, cy: 49, r: 4 },
  { id: 'Power', color: '#a56cf0', cx: 69, cy: 49, r: 4 },
  { id: 'Soul', color: '#f08a3c', cx: 83, cy: 52, r: 4 },
  { id: 'Time', color: '#3fbf6f', cx: 27, cy: 82, r: 4.2 },
  { id: 'Mind', color: '#f2cb45', cx: 62, cy: 82, r: 7.5 },
]

/** Hidden Easter egg: light all six stones to reveal a message. */
export default function Gauntlet() {
  const { say } = useStatus()
  const [lit, setLit] = useState<string[]>([])
  const complete = lit.length === STONES.length

  const light = (id: string) => {
    if (lit.includes(id)) return
    const next = [...lit, id]
    setLit(next)
    if (next.length === STONES.length) say('Six stones aligned. Reality remains intact — barely.')
  }

  return (
    <div className="mx-auto mt-20 flex flex-col items-center">
      <motion.div
        className="relative"
        animate={complete ? { rotate: [0, -6, 5, 0] } : {}}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 120 140" className="h-[7.5rem] w-[6.5rem]" aria-hidden>
          <defs>
            <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e9d3a3" />
              <stop offset=".45" stopColor="#a87d3c" />
              <stop offset="1" stopColor="#5b3f18" />
            </linearGradient>
          </defs>
          {[36, 50, 64, 78].map((x, i) => (
            <rect key={x} x={x} y={i === 0 || i === 3 ? 14 : 6} width="11" height="44" rx="5.5" fill="url(#g-metal)" stroke="#3d2a10" strokeWidth=".7" />
          ))}
          <rect x="12" y="60" width="12" height="36" rx="6" transform="rotate(-28 18 78)" fill="url(#g-metal)" stroke="#3d2a10" strokeWidth=".7" />
          <path d="M30 46 h62 v46 c0 10-8 18-18 18 H48 c-10 0-18-8-18-18z" fill="url(#g-metal)" stroke="#3d2a10" strokeWidth=".7" />
          <rect x="40" y="108" width="44" height="26" rx="4" fill="url(#g-metal)" stroke="#3d2a10" strokeWidth=".7" />
          <path d="M44 116h36M44 124h36" stroke="#5b3f18" strokeWidth="1" />
        </svg>

        {STONES.map((s) => {
          const on = lit.includes(s.id)
          return (
            <button
              key={s.id}
              type="button"
              aria-label={`${s.id} stone${on ? ', lit' : ''}`}
              aria-pressed={on}
              onClick={() => light(s.id)}
              className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${(s.cx / 120) * 100}%`, top: `${(s.cy / 140) * 100}%` }}
            >
              <motion.span
                className="block rounded-full"
                animate={{ scale: on ? [1, 1.6, 1] : 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: s.r * 2.5,
                  height: s.r * 2.5,
                  background: on ? s.color : '#2a1d0c',
                  boxShadow: on ? `0 0 10px 2px ${s.color}` : 'inset 0 0 2px rgba(0,0,0,.9)',
                  transition: 'background .4s, box-shadow .4s',
                }}
              />
            </button>
          )
        })}
      </motion.div>

      <div className="mt-4 min-h-[3.5rem] max-w-xs">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1 }}
              className="font-display text-lg italic leading-snug text-champagne"
            >
              {copy.complete}
            </motion.p>
          ) : (
            <motion.p key="hint" exit={{ opacity: 0 }} className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/30">
              {lit.length ? copy.progress(lit.length) : copy.hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

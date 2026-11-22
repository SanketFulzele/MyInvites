import { useId } from 'react'
import { motion } from 'framer-motion'

interface Props {
  /** false = dormant, true = powered */
  lit: boolean
  /** play the staged power-up sequence (otherwise lights instantly) */
  sequence?: boolean
  /** brief overload — used for taps and the opening transition */
  flare?: boolean
  className?: string
  onPress?: () => void
  label?: string
  /** draw the blue bloom behind it */
  bloom?: boolean
}

const SEGMENTS = 10
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)] as const
}

function segmentPath(i: number) {
  const c = i * (360 / SEGMENTS) - 90
  const [x1, y1] = polar(50, c - 12)
  const [x2, y2] = polar(74, c - 9.5)
  const [x3, y3] = polar(74, c + 9.5)
  const [x4, y4] = polar(50, c + 12)
  return `M${x1} ${y1} L${x2} ${y2} A74 74 0 0 1 ${x3} ${y3} L${x4} ${y4} A50 50 0 0 0 ${x1} ${y1}Z`
}

function windings(i: number) {
  const c = i * (360 / SEGMENTS) - 90
  return [57, 63, 69].map((r) => {
    const [ax, ay] = polar(r, c - 9)
    const [bx, by] = polar(r, c + 9)
    return `M${ax} ${ay} L${bx} ${by}`
  })
}

/**
 * Original arc-reactor illustration. Mechanical power-up: rim draws, bolts
 * seat, coils light in sequence, the inner ring rotates and locks, the core ignites.
 * Once powered it only "breathes" — no perpetual spinning.
 */
export default function Reactor({ lit, sequence = false, flare = false, className = 'h-40 w-40', onPress, label, bloom = true }: Props) {
  const uid = useId().replace(/:/g, '')
  const d = (t: number) => (sequence ? t : 0)
  const Wrapper = onPress ? motion.button : motion.div

  return (
    <Wrapper
      type={onPress ? 'button' : undefined}
      onClick={onPress}
      aria-label={label}
      whileTap={onPress ? { scale: 0.93 } : undefined}
      className={`relative shrink-0 rounded-full ${onPress ? 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-arc/70' : ''} ${className}`}
    >
      {bloom && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgba(102,217,255,.32)_0%,rgba(102,217,255,.08)_35%,transparent_65%)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: lit ? (flare ? 1 : 0.75) : 0, scale: lit ? (flare ? 1.25 : 1) : 0.6 }}
          transition={{ duration: flare ? 0.35 : 1.4, delay: lit ? d(1.5) : 0, ease: 'easeOut' }}
        />
      )}

      <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9dde3" />
            <stop offset=".35" stopColor="#6c727c" />
            <stop offset=".55" stopColor="#c3c8cf" />
            <stop offset="1" stopColor="#2c3038" />
          </linearGradient>
          <linearGradient id={`coil-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eafbff" />
            <stop offset=".5" stopColor="#66d9ff" />
            <stop offset="1" stopColor="#1b7fa6" />
          </linearGradient>
          <radialGradient id={`core-${uid}`}>
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".45" stopColor="#d6f6ff" />
            <stop offset=".8" stopColor="#66d9ff" />
            <stop offset="1" stopColor="#2a9ccc" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* housing */}
        <circle cx="100" cy="100" r="92" fill="#0d1015" />
        <motion.circle
          cx="100"
          cy="100"
          r="96"
          fill="none"
          stroke={`url(#metal-${uid})`}
          strokeWidth="4"
          initial={{ pathLength: sequence ? 0 : 1 }}
          animate={{ pathLength: lit || !sequence ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          style={{ rotate: -90, transformOrigin: '100px 100px' }}
        />
        <circle cx="100" cy="100" r="86" fill="none" stroke="#1d222b" strokeWidth="8" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="#66d9ff" strokeOpacity=".12" strokeWidth="1" />

        {/* bolts */}
        {Array.from({ length: 12 }).map((_, i) => {
          const [x, y] = polar(86, i * 30 - 75)
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2.4"
              fill={`url(#metal-${uid})`}
              initial={{ opacity: sequence ? 0 : 1 }}
              animate={{ opacity: lit || !sequence ? 1 : 0 }}
              transition={{ delay: d(0.35 + i * 0.03), duration: 0.2 }}
            />
          )
        })}

        {/* coils */}
        <g className={lit && !flare ? 'arc-breathe' : ''} filter={lit ? `url(#glow-${uid})` : undefined}>
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0.1 }}
              animate={{ opacity: lit ? 1 : 0.1 }}
              transition={{ delay: lit ? d(0.7 + i * 0.07) : 0, duration: 0.25 }}
            >
              <path d={segmentPath(i)} fill={`url(#coil-${uid})`} stroke="#0d1015" strokeWidth="1" />
              {windings(i).map((w) => (
                <path key={w} d={w} stroke="#0d1015" strokeOpacity=".45" strokeWidth="1.2" />
              ))}
            </motion.g>
          ))}
        </g>

        {/* inner locking ring */}
        <motion.g
          style={{ transformOrigin: '100px 100px' }}
          initial={{ rotate: sequence ? -110 : 0 }}
          animate={{ rotate: lit || !sequence ? 0 : -110 }}
          transition={{ delay: d(1.15), duration: 0.75, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <circle cx="100" cy="100" r="44" fill="none" stroke="#c69a53" strokeWidth="4.5" strokeDasharray="25.6 9" />
          <circle cx="100" cy="100" r="38" fill="#0b0f14" stroke="#2b3039" strokeWidth="1.5" />
        </motion.g>

        {/* core */}
        <motion.circle
          cx="100"
          cy="100"
          r="25"
          fill={`url(#core-${uid})`}
          filter={`url(#glow-${uid})`}
          style={{ transformOrigin: '100px 100px' }}
          initial={{ opacity: 0.08, scale: 0.7 }}
          animate={{ opacity: lit ? 1 : 0.08, scale: lit ? (flare ? 1.22 : 1) : 0.7 }}
          transition={{ delay: lit && !flare ? d(1.55) : 0, duration: flare ? 0.3 : 0.6, ease: 'easeOut' }}
        />

        {/* reflection */}
        <path d="M44 62 A66 66 0 0 1 92 36" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </Wrapper>
  )
}

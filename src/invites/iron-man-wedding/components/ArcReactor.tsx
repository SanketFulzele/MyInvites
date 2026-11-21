import { motion } from 'framer-motion'

interface Props {
  className?: string
  /** 0..1 — how "charged" the reactor looks */
  power?: number
  flare?: boolean
  onClick?: () => void
  label?: string
}

/** Original CSS/SVG arc reactor — layered rings, spokes and a glowing core. */
export default function ArcReactor({ className = 'h-40 w-40', power = 1, flare = false, onClick, label }: Props) {
  const Tag = onClick ? motion.button : motion.div
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={label}
      whileTap={onClick ? { scale: 0.94 } : undefined}
      className={`relative shrink-0 rounded-full ${onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-reactor' : ''} ${className}`}
      style={{ opacity: 0.25 + power * 0.75 }}
    >
      {/* outer glow */}
      <motion.span
        className="absolute -inset-[30%] rounded-full bg-reactor/30 blur-3xl"
        animate={{ opacity: flare ? [0.6, 1, 0.6] : [0.35, 0.6, 0.35], scale: flare ? 1.25 : 1 }}
        transition={{ duration: flare ? 0.6 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* metal housing */}
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#3b3f47,#9aa1ab,#2a2d33,#c8ccd2,#33363c,#8d939c,#3b3f47)] shadow-[inset_0_0_14px_rgba(0,0,0,.8),0_0_0_1px_rgba(255,255,255,.08)]" />
      <span className="absolute inset-[5%] rounded-full bg-[#0c1116] shadow-[inset_0_0_18px_rgba(0,0,0,.9)]" />

      {/* rotating dashed ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-[7%] animate-spin-slow" aria-hidden>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#7fe9ff" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="3 5" />
      </svg>

      {/* coil segments */}
      <span className="absolute inset-[14%]">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 36}deg)` }}>
            <span className="absolute left-1/2 top-0 h-[26%] w-[16%] -translate-x-1/2 rounded-[3px] bg-gradient-to-b from-[#d8f9ff] via-[#7fe9ff] to-[#1a8fb3] opacity-90 shadow-[0_0_8px_rgba(127,233,255,.8)]" />
          </span>
        ))}
      </span>

      {/* inner ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-[30%] animate-spin-rev" aria-hidden>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#e8b64c" strokeOpacity=".85" strokeWidth="5" strokeDasharray="20 8" />
      </svg>

      {/* core */}
      <motion.span
        className="absolute inset-[37%] rounded-full bg-[radial-gradient(circle,#ffffff_0%,#e6fdff_30%,#7fe9ff_62%,#1fb6e0_100%)]"
        animate={{
          boxShadow: flare
            ? ['0 0 30px 12px rgba(127,233,255,.9)', '0 0 70px 30px rgba(127,233,255,1)', '0 0 30px 12px rgba(127,233,255,.9)']
            : ['0 0 18px 6px rgba(127,233,255,.6)', '0 0 30px 12px rgba(127,233,255,.85)', '0 0 18px 6px rgba(127,233,255,.6)'],
        }}
        transition={{ duration: flare ? 0.5 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Tag>
  )
}

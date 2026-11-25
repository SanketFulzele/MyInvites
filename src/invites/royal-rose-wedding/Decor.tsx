import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { MarigoldString, ROSE_CLUSTER } from './art'

/** Rose clusters fixed at the screen corners: bloom in, sway, and drift with scroll (behind the text). */
export function CornerRoses() {
  const { scrollYProgress } = useScroll()
  const drift = useTransform(scrollYProgress, [0, 1], [0, -36])
  const driftUp = useTransform(scrollYProgress, [0, 1], [0, 30])
  const corners = [
    { cls: '-left-12 -top-12 w-40 sm:w-56', rot: 0, y: drift, delay: 0.2 },
    { cls: '-right-12 -top-12 w-36 sm:w-52', rot: 90, y: drift, delay: 0.35 },
    { cls: '-left-12 -bottom-12 w-36 sm:w-52', rot: -90, y: driftUp, delay: 0.5 },
    { cls: '-right-12 -bottom-12 w-40 sm:w-56', rot: 180, y: driftUp, delay: 0.65 },
  ]
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {corners.map((c, i) => (
        // layers: scroll drift → fixed corner rotation → bloom-in scale → CSS sway
        <motion.div key={i} className={`absolute ${c.cls}`} style={{ y: c.y }}>
          <div style={{ transform: `rotate(${c.rot}deg)` }}>
            <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }} transition={{ duration: 1.6, delay: c.delay, ease: [0.22, 1, 0.36, 1] }}>
              <img src={ROSE_CLUSTER} alt="" className="rr-sway w-full" style={{ animationDelay: `${-i * 1.4}s`, transformOrigin: '20% 20%' }} draggable={false} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/** Marigold strings hanging from the top edge; they swing with scroll speed. */
export function MarigoldStrings() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const swingA = useSpring(useTransform(velocity, [-2000, 0, 2000], [14, 0, -14]), { stiffness: 60, damping: 6 })
  const swingB = useSpring(useTransform(velocity, [-2000, 0, 2000], [10, 0, -10]), { stiffness: 45, damping: 5 })
  const strings = [
    { left: '6%', beads: 7, swing: swingA },
    { left: '20%', beads: 4, swing: swingB },
    { left: '78%', beads: 4, swing: swingA },
    { left: '92%', beads: 7, swing: swingB },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-0">
      <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full">
        <path d="M0 2 Q100 22 200 6 T400 2" stroke="#9a7637" strokeWidth="1.2" fill="none" />
      </svg>
      {strings.map((s, i) => (
        <motion.div key={i} className="absolute top-0 w-5 origin-top" style={{ left: s.left, rotate: s.swing }}>
          <MarigoldString beads={s.beads} className="w-5" />
        </motion.div>
      ))}
    </div>
  )
}

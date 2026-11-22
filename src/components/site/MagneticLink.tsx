import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

/** React Bits' Magnet idea, kept subtle enough for a premium invitation site. */
export default function MagneticLink({ to, children, className }: { to: string; children: ReactNode; className: string }) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })

  return (
    <motion.div
      className="inline-block"
      style={reduced ? undefined : { x: springX, y: springY }}
      onMouseMove={(event) => {
        if (reduced) return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  )
}

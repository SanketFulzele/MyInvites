import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { motion, useInView } from 'framer-motion'
import { useStatus } from './status'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Monospaced Stark-style label. Never below 11px. */
export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] uppercase tracking-[0.22em] sm:text-xs ${className}`}>{children}</p>
}

/** Lines rise out of a mask as they enter the viewport. */
export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function FadeUp({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** A hairline that draws itself from the left. */
export function Rule({ className = '', color = 'bg-iron-gold/50', delay = 0 }: { className?: string; color?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left ${color} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay, ease: EASE }}
    />
  )
}

/** Report a section to the J.A.R.V.I.S. status line when it is mostly in view. */
export function useSectionStatus(ref: RefObject<Element | null>, key: string) {
  const { setSection } = useStatus()
  const inView = useInView(ref, { amount: 0.35 })
  useEffect(() => {
    if (inView) setSection(key)
  }, [inView, key, setSection])
}

/** Section wrapper that wires id + status reporting. */
export function Section({ id, className = '', children }: { id: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useSectionStatus(ref, id)
  return (
    <section id={id} ref={ref} className={`relative scroll-mt-14 ${className}`}>
      {children}
    </section>
  )
}

/**
 * Placeholder for a missing asset. Only rendered in development so guests
 * never see it — it tells the editor which config key to fill.
 */
export function DevPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  if (!import.meta.env.DEV) return null
  return (
    <div className={`grid place-items-center border border-dashed border-arc/40 bg-arc/[.04] p-6 text-center ${className}`}>
      <div>
        <Mono className="text-arc/80">Placeholder · dev only</Mono>
        <p className="mt-2 font-body text-sm text-white/60">{label}</p>
      </div>
    </div>
  )
}

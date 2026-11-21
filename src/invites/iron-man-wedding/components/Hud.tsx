import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/** Fade/slide-in wrapper used across sections. */
export function Reveal({ children, delay = 0, className = '', y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Glassy panel with HUD corner brackets. */
export function HudPanel({ children, className = '', glow = 'reactor' }: { children: ReactNode; className?: string; glow?: 'reactor' | 'gold' }) {
  const c = glow === 'gold' ? 'border-stark-gold/70' : 'border-reactor/60'
  return (
    <div
      className={`relative rounded-2xl border border-white/8 bg-gradient-to-b from-white/[.06] to-white/[.02] backdrop-blur-md ${className}`}
    >
      {['left-0 top-0 border-l-2 border-t-2 rounded-tl-2xl', 'right-0 top-0 border-r-2 border-t-2 rounded-tr-2xl', 'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-2xl', 'right-0 bottom-0 border-r-2 border-b-2 rounded-br-2xl'].map(
        (pos) => (
          <span key={pos} className={`pointer-events-none absolute h-5 w-5 ${c} ${pos}`} />
        ),
      )}
      {children}
    </div>
  )
}

export function SectionHeading({ code, title, subtitle, local }: { code: string; title: ReactNode; subtitle?: ReactNode; local?: string }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-xl text-center">
      <p className="font-hud text-[10px] font-semibold tracking-[0.45em] text-reactor/80">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-reactor align-middle" />
        {code}
      </p>
      {local && <p className="mt-4 font-marathi text-lg text-stark-amber/80">{local}</p>}
      <h2 className="mt-2 font-display text-[2.6rem] leading-[1.05] font-semibold text-white text-balance sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-white/60">{subtitle}</p>}
      <div className="mx-auto mt-5 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-stark-gold" />
        <span className="h-1.5 w-1.5 rotate-45 bg-stark-gold" />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-stark-gold" />
      </div>
    </Reveal>
  )
}

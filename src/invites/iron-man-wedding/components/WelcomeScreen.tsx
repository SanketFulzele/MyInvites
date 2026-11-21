import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Power } from 'lucide-react'
import ArcReactor from './ArcReactor'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'

const BOOT_LINES = [
  'STARK INDUSTRIES · WEDDING PROTOCOL',
  '> Initializing J.A.R.V.I.S. …',
  '> Scanning guest … identity confirmed',
  '> Arc reactor output … 100%',
]

interface Props {
  groom: string
  bride: string
  dateLine: string
  blessing?: string
  onEnter: () => void
}

export default function WelcomeScreen({ groom, bride, dateLine, blessing, onEnter }: Props) {
  const reduced = usePrefersReducedMotion()
  const [lines, setLines] = useState(reduced ? BOOT_LINES.length : 0)
  const [leaving, setLeaving] = useState(false)
  const ready = lines >= BOOT_LINES.length

  useEffect(() => {
    if (ready) return
    const id = window.setTimeout(() => setLines((n) => n + 1), lines === 0 ? 350 : 520)
    return () => window.clearTimeout(id)
  }, [lines, ready])

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    onEnter()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-stark-night px-6 text-center"
      exit={{ y: '-100%', transition: { duration: reduced ? 0.01 : 1, ease: [0.76, 0, 0.24, 1], delay: reduced ? 0 : 0.35 } }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_40%,rgba(179,18,31,.28),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(127,233,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(127,233,255,.4)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-[scanline_4s_linear_infinite] bg-gradient-to-b from-transparent via-reactor/[.06] to-transparent" />

      {/* HUD corners */}
      {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-l-2 border-b-2', 'right-4 bottom-4 border-r-2 border-b-2'].map((p) => (
        <span key={p} className={`absolute h-8 w-8 border-reactor/40 ${p}`} />
      ))}

      <div className="relative flex w-full max-w-sm flex-col items-center">
        {blessing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 font-marathi text-sm text-stark-amber/80"
          >
            {blessing}
          </motion.p>
        )}

        <ArcReactor className="h-36 w-36 sm:h-44 sm:w-44" power={Math.min(1, 0.15 + lines / BOOT_LINES.length)} flare={leaving} />

        {/* boot log */}
        <div className="mt-8 min-h-[6.5rem] w-full text-left font-tech text-[13px] leading-6 text-reactor/80">
          {BOOT_LINES.slice(0, lines).map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: ready ? 0.45 : i === lines - 1 ? 1 : 0.55, x: 0 }}
              className={i === 0 ? 'mb-1 whitespace-nowrap font-hud text-[9px] tracking-[0.18em] text-stark-gold' : ''}
            >
              {l}
            </motion.p>
          ))}
        </div>

        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 flex flex-col items-center"
            >
              <p className="font-hud text-[10px] tracking-[0.5em] text-white/50">THE WEDDING OF</p>
              <h1 className="mt-3 font-display text-[2.7rem] leading-none font-semibold sm:text-5xl">
                <span className="gold-shimmer">{groom}</span>
                <span className="mx-3 font-script text-4xl text-stark-red">&amp;</span>
                <span className="gold-shimmer">{bride}</span>
              </h1>
              <p className="mt-4 font-hud text-xs tracking-[0.35em] text-white/70">{dateLine}</p>

              <motion.button
                onClick={enter}
                whileTap={{ scale: 0.96 }}
                className="group relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-full border border-stark-gold/60 bg-gradient-to-r from-stark-crimson via-stark-red to-stark-crimson px-8 py-4 font-hud text-xs font-bold tracking-[0.3em] text-white shadow-[0_0_40px_-6px_rgba(179,18,31,.9)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Power className="h-4 w-4 text-stark-amber" />
                ENTER INVITATION
              </motion.button>
              <p className="mt-4 text-[11px] text-white/40">Best with sound on · tap to begin</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!ready && (
          <button onClick={() => setLines(BOOT_LINES.length)} className="mt-6 font-hud text-[10px] tracking-[0.3em] text-white/35 hover:text-white/60">
            SKIP
          </button>
        )}
      </div>
    </motion.div>
  )
}

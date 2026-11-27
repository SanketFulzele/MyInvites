import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { guestName } from '../copy'
import { motion } from 'framer-motion'
import Reactor from './Reactor'
import { EASE } from './ui'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'

type Phase = 'dark' | 'boot' | 'reveal' | 'exit'

interface Props {
  presenter: string
  occasion: string
  groom: string
  bride: string
  tagline: string
  dateLine: string
  placeLine: string
  /** Called synchronously inside the click — start audio here. */
  onEnter: () => void
  /** Called when the light has covered the screen. */
  onComplete: () => void
}

/**
 * Scene 1 — the reactor powers up in near darkness.
 * Scene 2 — Stark presents the couple; the reactor rises to make room.
 * Scene 3 — on Enter, reactor light floods the screen into the invitation.
 */
export default function Opening({ presenter, occasion, groom, bride, tagline, dateLine, placeLine, onEnter, onComplete }: Props) {
  const guest = useMemo(guestName, [])
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduced ? 'reveal' : 'dark')
  const [skipped, setSkipped] = useState(reduced)
  const [pct, setPct] = useState(reduced ? 100 : 0)
  const [origin, setOrigin] = useState({ x: '50%', y: '40%' })
  const [contentH, setContentH] = useState(420)
  const reactorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContentH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (phase === 'dark') {
      const t = window.setTimeout(() => setPhase('boot'), 450)
      return () => window.clearTimeout(t)
    }
    if (phase === 'boot') {
      const start = performance.now()
      let raf = 0
      const tick = (now: number) => {
        const p = Math.min(100, Math.round(((now - start) / 2100) * 100))
        setPct(p)
        if (p < 100) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      const t = window.setTimeout(() => setPhase('reveal'), 2550)
      return () => {
        cancelAnimationFrame(raf)
        window.clearTimeout(t)
      }
    }
  }, [phase])

  const skip = () => {
    if (phase === 'dark' || phase === 'boot') {
      setSkipped(true)
      setPct(100)
      setPhase('reveal')
    }
  }

  const enter = () => {
    if (phase !== 'reveal') return
    const r = reactorRef.current?.getBoundingClientRect()
    if (r) setOrigin({ x: `${r.left + r.width / 2}px`, y: `${r.top + r.height / 2}px` })
    onEnter()
    setPhase('exit')
    window.setTimeout(onComplete, reduced ? 50 : 1050)
  }

  const lit = phase !== 'dark'
  const show = phase === 'reveal' || phase === 'exit'
  // while booting, push the reactor down so it sits in the optical centre
  const bootOffset = (contentH + 40) / 2
  const fade = (delay: number, y = 10) => ({
    initial: { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { delay: show ? delay : 0, duration: 1, ease: EASE },
  })

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-obsidian text-paper"
      onClick={skip}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.01 : 0.9, ease: 'easeOut' } }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_42%,#0f1620_0%,#080a0f_72%)]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(70%_40%_at_50%_105%,rgba(143,24,32,.32),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 1.8 }}
      />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[.06] mix-blend-overlay" />

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        <motion.div
          ref={reactorRef}
          className="relative"
          initial={false}
          animate={{ y: show ? 0 : bootOffset, scale: show ? 0.72 : 1 }}
          transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
        >
          <Reactor lit={lit} sequence={!skipped} flare={phase === 'exit'} className="h-32 w-32 sm:h-36 sm:w-36" />
          <motion.p
            className="absolute left-1/2 top-full mt-8 -translate-x-1/2 whitespace-nowrap font-mono text-xs tracking-[0.25em] text-arc/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'boot' ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            ARC REACTOR · <span className="tabular-nums">{String(pct).padStart(3, '0')}%</span>
          </motion.p>
        </motion.div>

        <div
          ref={contentRef}
          className={`mt-2 flex w-full max-w-lg flex-col items-center text-center ${show ? '' : 'pointer-events-none'}`}
          aria-hidden={!show}
        >
          <motion.p {...fade(0, 0)} className="font-mono text-[11px] uppercase tracking-[0.24em] text-champagne/65 sm:text-xs">
            {presenter}
          </motion.p>
          <motion.p {...fade(0.3, 0)} className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-champagne sm:text-xs">
            {occasion}
          </motion.p>
          {guest && (
            <motion.p {...fade(0.4, 0)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-arc/30 px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-arc/90">
              <span className="h-1.5 w-1.5 rounded-full bg-arc shadow-[0_0_8px_rgba(102,217,255,.9)]" />
              GUEST IDENTIFIED · <span className="normal-case tracking-normal text-paper">{guest}</span>
            </motion.p>
          )}

          <h1 className="mt-7 font-display font-medium leading-none">
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-[clamp(2.7rem,12.5vw,5.2rem)] italic"
                initial={{ y: '110%' }}
                animate={{ y: show ? 0 : '110%' }}
                transition={{ delay: show ? 0.5 : 0, duration: 1.2, ease: EASE }}
              >
                {groom}
                <span className="mx-[0.2em] align-[0.14em] text-[0.5em] not-italic text-iron-gold">×</span>
                {bride}
              </motion.span>
            </span>
          </h1>

          <motion.p {...fade(0.85)} className="mt-3 max-w-[18rem] font-display text-lg italic leading-snug text-champagne/90 sm:text-xl">
            {tagline}
          </motion.p>

          <motion.span
            className="mt-7 block h-px w-20 origin-center bg-iron-gold/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: show ? 1 : 0 }}
            transition={{ delay: show ? 1 : 0, duration: 1.2, ease: EASE }}
          />
          <motion.div {...fade(1.1, 0)} className="mt-5">
            <p className="font-mono text-xs tracking-[0.25em] text-paper/80">{dateLine}</p>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/45">{placeLine}</p>
          </motion.div>

          <motion.div {...fade(1.35, 12)}>
            <motion.button
              type="button"
              tabIndex={show ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation()
                enter()
              }}
              whileTap="press"
              whileHover="press"
              className="relative mt-9 overflow-hidden border border-iron-gold/70 px-9 py-4 font-body text-[13px] font-medium uppercase tracking-[0.26em] text-paper"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 origin-left bg-iron"
                initial={{ scaleX: 0 }}
                variants={{ press: { scaleX: 1 } }}
                transition={{ duration: 0.45, ease: EASE }}
              />
              <span className="relative flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-arc shadow-[0_0_10px_2px_rgba(102,217,255,.8)]" />
                Enter invitation
              </span>
            </motion.button>
          </motion.div>
          <motion.p {...fade(1.8, 0)} className="mt-4 font-body text-xs text-paper/40">
            Best experienced with sound on
          </motion.p>
        </div>
      </div>

      {(phase === 'dark' || phase === 'boot') && (
        <button
          type="button"
          onClick={skip}
          className="absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper/35"
        >
          Skip
        </button>
      )}

      {/* reactor light floods the screen */}
      {phase === 'exit' && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(circle at ${origin.x} ${origin.y}, #e9fbff 0%, #66d9ff 14%, #123441 42%, #080a0f 78%)` }}
          initial={{ clipPath: `circle(0% at ${origin.x} ${origin.y})` }}
          animate={{ clipPath: `circle(150% at ${origin.x} ${origin.y})` }}
          transition={{ duration: reduced ? 0.01 : 1, ease: [0.7, 0, 0.3, 1] }}
        />
      )}
    </motion.div>
  )
}

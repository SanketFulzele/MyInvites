import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AshokChakra, Garland, Lotus, Mandala, PipalLeaf } from './art'
import LeafField from './LeafField'
import { EASE, store } from './ui'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

type Phase = 'closed' | 'crack' | 'flap' | 'card' | 'hold' | 'return' | 'close' | 'leave'
const ORDER: Phase[] = ['closed', 'crack', 'flap', 'card', 'hold', 'return', 'close', 'leave']
// how long each phase lasts before the next begins (ms)
const DURATION: Partial<Record<Phase, number>> = { crack: 550, flap: 850, card: 1000, hold: 2600, return: 800, close: 750, leave: 900 }
const SEEN_KEY = 'bodhi:envelope-seen'

interface Props {
  bride: string
  groom: string
  /** Full names shown on the card, e.g. "Aarti Fulzele & Akhilesh Gaikwad" */
  fullNames: string
  blessing: string
  guest: string | null
  venue: string
  venueCity: string
  dateLine: string
  timeLine: string
  /** Called inside the tap — start music / chime here. */
  onOpen: () => void
  onDone: () => void
  replay?: boolean
}

function SealSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_8px_rgba(60,10,15,.45)]" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%">
          <stop offset="0" stopColor="#c2263a" />
          <stop offset=".7" stopColor="#8d1d2b" />
          <stop offset="1" stopColor="#5e0f19" />
        </radialGradient>
      </defs>
      <path
        d="M50 4 C60 4 64 10 72 10 C82 12 84 20 90 28 C96 36 94 44 96 52 C98 62 92 68 88 76 C84 86 76 88 68 92 C60 96 54 96 46 96 C36 96 30 92 24 88 C14 82 10 74 6 66 C2 56 6 48 4 40 C4 30 12 24 18 18 C26 10 34 8 40 6 C44 4 47 4 50 4Z"
        fill="url(#wax)"
      />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#e9c46a" strokeOpacity=".5" strokeWidth="1.2" />
      {/* embossed lotus */}
      <g fill="none" stroke="#f1d38a" strokeWidth="1.6" strokeLinejoin="round" opacity=".9">
        <path d="M50 62 C44 54 44 42 50 32 C56 42 56 54 50 62Z" />
        <path d="M50 62 C42 58 36 50 36 40 C44 44 48 52 50 62Z" />
        <path d="M50 62 C58 58 64 50 64 40 C56 44 52 52 50 62Z" />
        <path d="M34 64 C42 68 58 68 66 64" />
      </g>
      {/* tiny chakra */}
      <g transform="translate(43 66) scale(.14)">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#f1d38a" strokeWidth="8" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="50" y1="50" x2={50 + 44 * Math.cos((i * Math.PI) / 6)} y2={50 + 44 * Math.sin((i * Math.PI) / 6)} stroke="#f1d38a" strokeWidth="5" />
        ))}
      </g>
    </svg>
  )
}

export default function Envelope({ bride, groom, fullNames, blessing, guest, venue, venueCity, dateLine, timeLine, onOpen, onDone, replay = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('closed')
  const seenBefore = useMemo(() => store.get(SEEN_KEY) === '1', [])
  const done = useRef(false)

  const at = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p)

  useEffect(() => {
    if (phase === 'closed') return
    const next = ORDER[ORDER.indexOf(phase) + 1]
    const ms = reduced ? (phase === 'hold' ? 1800 : 10) : DURATION[phase] ?? 0
    const t = window.setTimeout(() => {
      if (next) setPhase(next)
      else finish()
    }, ms)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduced])

  const finish = () => {
    if (done.current) return
    done.current = true
    store.set(SEEN_KEY, '1')
    onDone()
  }

  const open = () => {
    if (phase !== 'closed') return
    onOpen()
    setPhase('crack')
  }

  const skip = () => {
    if (phase === 'closed') onOpen()
    finish()
  }

  const flapOpen = at('flap') && !at('close')
  const cardUp = at('card') && !at('return')

  const burst = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
        const dist = 120 + Math.random() * 160
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          r: (Math.random() - 0.5) * 360,
          kind: i % 3 === 0 ? 'petal' : 'leaf',
          color: i % 3 === 0 ? (i % 2 ? '#f2a7b8' : '#c2263a') : ['#5e8c3a', '#9cc46b', '#c9a227'][i % 3],
          delay: Math.random() * 0.25,
        }
      }),
    [],
  )

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-5 text-center"
      style={{ background: 'radial-gradient(120% 80% at 50% 30%, #6b1a26 0%, #3d0d15 60%, #24070c 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'leave' ? 0 : 1 }}
      transition={{ duration: phase === 'leave' ? 0.9 : 0.6, ease: EASE }}
    >
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 w-[140vmin] -translate-x-1/2 -translate-y-1/2 text-bodhi-gold/10" />
      <Garland className="absolute inset-x-0 top-0 h-12 w-full opacity-90 sm:h-16" sag={30} count={17} />
      <LeafField position="absolute" count={9} />

      <div className="relative z-40 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: at('crack') ? 0 : 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-display text-lg italic text-bodhi-saffron/90">{blessing}</p>
          {guest && <p className="mt-2 font-mukta text-[15px] text-bodhi-ivory/85">Dear {guest}, you are invited</p>}
        </motion.div>

        {/* the envelope */}
        <motion.div
          className="relative mx-auto mt-8 aspect-[1.45/1] w-[min(86vw,420px)] cursor-pointer select-none"
          style={{ perspective: 1200 }}
          onClick={open}
          role="button"
          tabIndex={0}
          aria-label="Open the invitation envelope"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
          animate={phase === 'leave' ? { scale: 1.35, opacity: 0 } : phase === 'closed' ? { scale: [1, 1.015, 1] } : { scale: 1 }}
          transition={phase === 'closed' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.9, ease: EASE }}
        >
          {/* back */}
          <div className="absolute inset-0 rounded-[6px] bg-[#e8d7b4] shadow-[0_30px_60px_-25px_rgba(0,0,0,.7)]" />

          {/* card */}
          <motion.div
            className="bodhi-parchment absolute inset-x-[6%] top-[5%] bottom-[5%] z-20 flex flex-col items-center justify-center rounded-[4px] border border-bodhi-gold/70 px-4 text-bodhi-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)]"
            initial={false}
            animate={{ y: cardUp ? '-68%' : '0%' }}
            transition={{ duration: reduced ? 0 : 0.95, ease: EASE }}
          >
            <div className="pointer-events-none absolute inset-1.5 rounded-[3px] border border-bodhi-gold/40" />
            <AshokChakra className="h-6 w-6" />
            <p className="mt-1 font-display text-[15px] italic leading-tight text-bodhi-ink/80">{fullNames}</p>
            <p className="mt-1 font-cinzel text-[11px] tracking-[0.3em] text-bodhi-ink/55">INVITE YOU TO</p>
            <p className="mt-1 font-display text-[1.65rem] leading-none font-semibold text-bodhi-maroon">{venue}</p>
            <p className="font-cinzel text-xs tracking-[0.35em] text-bodhi-gold-deep">{venueCity}</p>
            <div className="my-2 h-px w-16 bg-bodhi-gold/60" />
            <p className="font-mukta text-[13px] font-medium text-bodhi-ink">{dateLine}</p>
            <p className="font-mukta text-xs text-bodhi-ink/65">{timeLine}</p>
          </motion.div>

          {/* front pocket */}
          <div
            className="absolute inset-0 z-30 rounded-[6px] bg-[#f5ead2]"
            style={{ clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <svg viewBox="0 0 100 69" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M0 0 L50 38.6 L100 0" fill="none" stroke="#c9a227" strokeWidth=".5" />
              <rect x="1.5" y="1.5" width="97" height="66" fill="none" stroke="#c9a227" strokeWidth=".4" />
              <rect x="3" y="3" width="94" height="63" fill="none" stroke="#c9a227" strokeWidth=".2" />
            </svg>
            <div className="absolute inset-x-0 bottom-[9%] text-center">
              <p className="font-display text-[1.7rem] leading-none font-medium text-bodhi-maroon sm:text-3xl">
                {bride} <span className="mx-1 text-bodhi-gold">❀</span> {groom}
              </p>
            </div>
          </div>

          {/* flap — two faces so the lining shows when it folds back */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[57%]"
            style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d', zIndex: flapOpen ? 10 : 35 }}
            initial={false}
            animate={{ rotateX: flapOpen ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.85, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="absolute inset-0 bg-[#efe1c3]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }}>
              <svg viewBox="0 0 100 57" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                <path d="M2 1.5 L98 1.5 L50 54Z" fill="none" stroke="#c9a227" strokeWidth=".5" />
              </svg>
            </div>
            <div
              className="absolute inset-0 bg-[#7a1f2b]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <Mandala className="absolute left-1/2 top-0 w-2/3 -translate-x-1/2 text-bodhi-gold/30" />
            </div>
          </motion.div>

          {/* lotus wax seal — splits when cracked */}
          <div className="absolute left-1/2 top-[57%] z-40 h-16 w-16 -translate-x-1/2 -translate-y-1/2 sm:h-[72px] sm:w-[72px]">
            {(['left', 'right'] as const).map((side) => (
              <motion.div
                key={side}
                className="absolute inset-0"
                style={{ clipPath: side === 'left' ? 'polygon(0 0, 52% 0, 46% 30%, 54% 55%, 47% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 47% 100%, 54% 55%, 46% 30%)' }}
                initial={false}
                animate={
                  at('crack')
                    ? { x: side === 'left' ? -26 : 26, y: 34, rotate: side === 'left' ? -38 : 38, opacity: 0 }
                    : { x: 0, y: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.5, 0, 0.75, 0] }}
              >
                <SealSVG />
              </motion.div>
            ))}
          </div>

          {/* leaves & petals burst out with the card */}
          {at('card') && !reduced && (
            <div className="pointer-events-none absolute left-1/2 top-[20%] z-50">
              {burst.map((b, i) => (
                <motion.span
                  key={i}
                  className="absolute"
                  initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
                  animate={{ x: b.x, y: b.y, opacity: [0, 1, 1, 0], rotate: b.r, scale: 1 }}
                  transition={{ duration: 2.2, delay: 0.2 + b.delay, ease: 'easeOut' }}
                >
                  {b.kind === 'leaf' ? (
                    <PipalLeaf className="h-5 w-4" fill={b.color} />
                  ) : (
                    <span className="block h-3 w-2 rounded-[50%]" style={{ background: b.color }} />
                  )}
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="mt-10 h-24">
          {phase === 'closed' && (
            <motion.button
              type="button"
              onClick={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex min-h-[52px] items-center gap-3 rounded-full border border-bodhi-gold/70 bg-bodhi-gold/10 px-8 py-3.5 font-cinzel text-xs tracking-[0.3em] text-bodhi-ivory transition hover:bg-bodhi-gold/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bodhi-saffron active:scale-[.98]"
            >
              <Lotus className="h-5 w-6" tone="gold" />
              {replay ? 'OPEN AGAIN' : 'TAP TO OPEN'}
            </motion.button>
          )}
          {phase === 'closed' && <p className="mt-4 font-mukta text-xs text-bodhi-ivory/50">Sound on for the full experience</p>}
        </div>
      </div>

      {phase !== 'leave' && (
        <button
          type="button"
          onClick={skip}
          className={`absolute bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-50 rounded-full px-4 py-3 font-cinzel text-xs tracking-[0.25em] transition focus-visible:outline-2 focus-visible:outline-bodhi-saffron ${
            seenBefore || replay ? 'border border-bodhi-ivory/30 text-bodhi-ivory/85' : 'text-bodhi-ivory/45'
          }`}
        >
          {seenBefore && !replay ? 'SKIP INTRO' : 'SKIP'}
        </button>
      )}
    </motion.div>
  )
}

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { motion, useInView } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Soft blur-in for small text (never used on large areas). */
export function BlurIn({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'p' | 'h2' | 'h3' | 'span' }) {
  const M = motion[Tag]
  return (
    <M
      className={className}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

/** Types a word letter by letter, each letter blurring in. Starts when `start` turns true. */
export function TypedName({ text, start, delay = 0, className = '' }: { text: string; start: boolean; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
          animate={start ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.09, ease: 'easeOut' }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Ornamental section title: small caps label + Playfair heading + gold flourish. */
export function SectionTitle({ eyebrow, title, light = false, className = '' }: { eyebrow?: string; title: ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <BlurIn as="p" className={`font-montserrat text-xs font-medium uppercase tracking-[0.32em] ${light ? 'text-rr-champagne/80' : 'text-rr-gold-deep'}`}>
          {eyebrow}
        </BlurIn>
      )}
      <BlurIn as="h2" delay={0.1} className={`mt-2 font-playfair text-[2.35rem] leading-[1.1] italic ${light ? 'rr-gold-text' : 'text-rr-wine'}`}>
        {title}
      </BlurIn>
      <Flourish className={`mx-auto mt-3 h-4 w-40 ${light ? 'text-rr-champagne' : 'text-rr-gold'}`} />
    </div>
  )
}

export function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 16" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M0 8 H62" />
      <path d="M98 8 H160" />
      <path d="M62 8 C68 2 74 2 80 8 C86 14 92 14 98 8" />
      <path d="M62 8 C68 14 74 14 80 8 C86 2 92 2 98 8" />
      <circle cx="80" cy="8" r="2.2" fill="currentColor" />
    </svg>
  )
}

/** Adds .rr-offscreen to an element while it is out of view, pausing its CSS loops. */
export function useOffscreenPause(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('rr-offscreen', !e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

/** A section with id + off-screen animation pausing. */
export function Section({ id, className = '', children }: { id: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useOffscreenPause(ref)
  return (
    <section id={id} ref={ref} className={`relative scroll-mt-6 px-5 ${className}`}>
      {children}
    </section>
  )
}

/** Petals drifting down a fixed canvas. `burst` adds a dense shower for a few seconds. */
export function PetalRain({ burstKey = 0, base = 7 }: { burstKey?: number; base?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const burstRef = useRef(burstKey)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const colors = ['#f1c6c4', '#e8a0ab', '#c34f62', '#f7e1df', '#a8344c']
    type P = { x: number; y: number; vy: number; vx: number; r: number; rot: number; spin: number; ph: number; c: string; life: number }
    const make = (top: boolean, life = Infinity): P => ({
      x: Math.random() * w,
      y: top ? -20 - Math.random() * h * 0.5 : Math.random() * h,
      vy: 0.6 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.4,
      r: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.05,
      ph: Math.random() * 6,
      c: colors[Math.floor(Math.random() * colors.length)],
      life,
    })
    let ps: P[] = Array.from({ length: base }, () => make(false))
    let last = burstRef.current
    let raf = 0
    let running = true

    const loop = () => {
      if (!running) return
      if (burstRef.current !== last) {
        last = burstRef.current
        ps = ps.concat(Array.from({ length: w < 640 ? 34 : 60 }, () => make(true, 1)))
      }
      ctx.clearRect(0, 0, w, h)
      ps = ps.filter((p) => {
        p.ph += 0.02
        p.y += p.vy
        p.x += p.vx + Math.sin(p.ph) * 0.6
        p.rot += p.spin
        if (p.y > h + 20) {
          if (p.life !== Infinity) return false
          Object.assign(p, make(true))
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(Math.abs(Math.cos(p.ph)) * 0.7 + 0.3, 1)
        ctx.fillStyle = p.c
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.moveTo(0, -p.r)
        ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.6, p.r * 0.7, p.r * 0.8, 0, p.r)
        ctx.bezierCurveTo(-p.r * 0.7, p.r * 0.8, -p.r * 0.9, -p.r * 0.6, 0, -p.r)
        ctx.fill()
        ctx.restore()
        return true
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
    }
  }, [base])

  useEffect(() => {
    burstRef.current = burstKey
  }, [burstKey])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40 h-full w-full" />
}

/** Confetti + petal burst as DOM bits (small area, short-lived). */
export function Burst({ fire }: { fire: number }) {
  const [bits, setBits] = useState<{ id: number; x: number; y: number; r: number; c: string; s: number; petal: boolean }[]>([])
  useEffect(() => {
    if (!fire) return
    const next = Array.from({ length: 40 }, (_, i) => {
      const a = Math.random() * Math.PI * 2
      const d = 90 + Math.random() * 160
      return {
        id: fire * 100 + i,
        x: Math.cos(a) * d,
        y: Math.sin(a) * d - 60,
        r: Math.random() * 540 - 270,
        c: ['#c6a15b', '#f2dfa8', '#c34f62', '#f1c6c4', '#6e1f2f'][i % 5],
        s: 5 + Math.random() * 6,
        petal: i % 2 === 0,
      }
    })
    setBits(next)
    const t = window.setTimeout(() => setBits([]), 2600)
    return () => window.clearTimeout(t)
  }, [fire])
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-30">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute block"
          style={{ width: b.s, height: b.petal ? b.s * 1.4 : b.s * 0.6, background: b.c, borderRadius: b.petal ? '50% 50% 50% 50% / 60% 60% 40% 40%' : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 140], opacity: [1, 1, 0], rotate: b.r }}
          transition={{ duration: 2.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/** Fires once when the element first scrolls into view. */
export function useSeen<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null)
  const seen = useInView(ref, { once: true, amount })
  return [ref, seen] as const
}

/**
 * Swipeable 3D carousel: big centre card, blurred neighbours, loops, one card
 * per swipe. Only transforms + a small static blur on two side cards.
 */
export function Carousel3D<T>({
  items,
  render,
  cardClass,
  height,
  label,
  onChange,
}: {
  items: T[]
  render: (item: T, active: boolean, index: number) => ReactNode
  cardClass: string
  height: string
  label: string
  onChange?: (i: number) => void
}) {
  const [active, setActive] = useState(0)
  const n = items.length
  const start = useRef<{ x: number; y: number } | null>(null)

  const go = (d: number) => {
    const next = (active + d + n) % n
    setActive(next)
    onChange?.(next)
  }

  const offsetOf = (i: number) => {
    let o = i - active
    if (o > n / 2) o -= n
    if (o < -n / 2) o += n
    if (n === 2 && o !== 0) o = 1
    return o
  }

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        className="relative mx-auto touch-pan-y select-none"
        style={{ height, perspective: 1100 }}
        onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          if (!start.current) return
          const dx = e.clientX - start.current.x
          const dy = e.clientY - start.current.y
          start.current = null
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
        }}
        onPointerCancel={() => (start.current = null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1)
          if (e.key === 'ArrowLeft') go(-1)
        }}
        tabIndex={0}
      >
        {items.map((item, i) => {
          const o = offsetOf(i)
          const hidden = Math.abs(o) > 1
          return (
            <motion.div
              key={i}
              className={`absolute left-1/2 top-0 ${cardClass}`}
              style={{ zIndex: 10 - Math.abs(o), pointerEvents: o === 0 ? 'auto' : 'none', filter: o === 0 ? 'none' : 'blur(2px) brightness(.93)' }}
              initial={false}
              animate={{
                x: `calc(-50% + ${o * 64}%)`,
                rotateY: o * -26,
                scale: o === 0 ? 1 : 0.8,
                opacity: hidden ? 0 : o === 0 ? 1 : 0.7,
              }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-hidden={o !== 0}
              onClick={() => o !== 0 && go(o)}
            >
              {render(item, o === 0, i)}
            </motion.div>
          )
        })}
      </div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-rr-gold/60 bg-rr-ivory/80 text-rr-wine transition active:scale-95">
            ‹
          </button>
          <div className="flex">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${i + 1}`}
                aria-current={i === active}
                onClick={() => go(i - active)}
                className="grid h-11 w-10 place-items-center"
              >
                <span className={`block h-2 rounded-full transition-all ${i === active ? 'w-6 bg-rr-wine' : 'w-2 bg-rr-gold/60'}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-rr-gold/60 bg-rr-ivory/80 text-rr-wine transition active:scale-95">
            ›
          </button>
        </div>
      )}
    </div>
  )
}

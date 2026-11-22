import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Bilingual } from './bodhiWedding.config'
import { GoldDivider } from './art'

export const EASE = [0.22, 1, 0.36, 1] as const

/* ───────── language ───────── */
export type Lang = 'en' | 'mr'
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} })
export const useLang = () => useContext(LangCtx)
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}
/** Pick the right language from a bilingual string. */
export function useT() {
  const { lang } = useLang()
  return (b: Bilingual) => b[lang]
}

/* ───────── reveals ───────── */
export function Reveal({ children, delay = 0, className = '', y = 26 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Flowers and garlands "bloom" in: scale from 0.8 with a soft fade. */
export function Bloom({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Heading with a one-time gold-foil shimmer sweep on reveal. */
export function Shimmer({ children, className = '', as: Tag = 'h2' }: { children: ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3' | 'p' }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <Tag ref={ref as never} className={`bodhi-shimmer ${inView ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

/** Chapter opener: a small Pali / Marathi accent word, chapter number and title. */
export function ChapterHeading({
  accent,
  number,
  title,
  subtitle,
  light = false,
  className = '',
}: {
  accent: string
  number: string
  title: ReactNode
  subtitle?: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <p className={`font-marathi text-xl ${light ? 'text-bodhi-saffron' : 'text-bodhi-gold-deep'}`} lang="mr">
        {accent}
      </p>
      <p className={`mt-2 font-cinzel text-xs tracking-[0.32em] ${light ? 'text-bodhi-ivory/60' : 'text-bodhi-ink/55'}`}>{number}</p>
      {light ? (
        <h2 className="mt-3 font-display text-[2.5rem] leading-[1.05] font-medium text-bodhi-ivory text-balance sm:text-5xl">{title}</h2>
      ) : (
        <Shimmer className="mt-3 font-display text-[2.5rem] leading-[1.05] font-medium text-balance sm:text-5xl">{title}</Shimmer>
      )}
      {subtitle && <p className={`mx-auto mt-3 max-w-md font-mukta text-[15px] leading-relaxed ${light ? 'text-bodhi-ivory/70' : 'text-bodhi-ink/70'}`}>{subtitle}</p>}
      <GoldDivider className="mt-5" />
    </Reveal>
  )
}

/** A full chapter section with consistent spacing and an anchor. */
export function Chapter({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-4 overflow-hidden px-5 py-24 sm:px-8 sm:py-32 ${className}`}>
      {children}
    </section>
  )
}

/* ───────── music ───────── */
export function useMusic(src: string) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const fade = useRef<number | null>(null)

  const clearFade = () => {
    if (fade.current) window.clearInterval(fade.current)
    fade.current = null
  }

  const play = useCallback(async () => {
    try {
      if (!audio.current) {
        audio.current = new Audio(src)
        audio.current.loop = true
        audio.current.preload = 'auto'
      }
      const a = audio.current
      a.volume = 0
      await a.play()
      setPlaying(true)
      clearFade()
      // fade in over ~2s
      fade.current = window.setInterval(() => {
        a.volume = Math.min(0.55, a.volume + 0.55 / 40)
        if (a.volume >= 0.55) clearFade()
      }, 50)
    } catch {
      setPlaying(false)
    }
  }, [src])

  const pause = useCallback(() => {
    clearFade()
    audio.current?.pause()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => (playing ? pause() : void play()), [playing, pause, play])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden' && playing) pause()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [playing, pause])

  useEffect(
    () => () => {
      clearFade()
      audio.current?.pause()
    },
    [],
  )

  return { playing, play, pause, toggle }
}

/** A soft singing-bowl "ding" — layered inharmonic partials with a long decay. */
export function singingBowl() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    const t = ctx.currentTime + 0.02
    const out = ctx.createGain()
    out.gain.value = 0.35
    out.connect(ctx.destination)
    ;[
      [432, 0.5, 5],
      [432 * 2.71, 0.22, 3.5],
      [432 * 5.2, 0.08, 2],
      [436, 0.3, 5],
    ].forEach(([f, g, d]) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const gn = ctx.createGain()
      gn.gain.setValueAtTime(0, t)
      gn.gain.linearRampToValueAtTime(g, t + 0.01)
      gn.gain.exponentialRampToValueAtTime(0.0001, t + d)
      o.connect(gn).connect(out)
      o.start(t)
      o.stop(t + d + 0.1)
    })
    window.setTimeout(() => void ctx.close(), 6000)
  } catch {
    /* audio unavailable */
  }
}

/* ───────── small helpers ───────── */
export const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* storage unavailable */
    }
  },
}

/** Guest name from ?guest=Name (trimmed, limited, plain text). */
export function guestName(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('guest')
    if (!raw) return null
    const clean = raw.replace(/[<>]/g, '').trim().slice(0, 40)
    return clean || null
  } catch {
    return null
  }
}

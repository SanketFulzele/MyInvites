import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { EASE, FadeUp, MaskLines, Mono, Section } from './ui'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'
import type { WeddingInviteConfig } from '../../types'

export default function Story({ config }: { config: WeddingInviteConfig }) {
  const { story, photos } = config
  const filmRef = useRef<HTMLDivElement>(null)
  const actsRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress: filmP } = useScroll({ target: filmRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(filmP, [0, 1], ['-8%', '8%'])
  const { scrollYProgress: actsP } = useScroll({ target: actsRef, offset: ['start 75%', 'end 60%'] })
  // film timecode built from the wedding date, e.g. 00:24:06:26
  const [y, m, d] = config.weddingDateTime.slice(0, 10).split('-')
  const timecode = `00:${d}:${m}:${y.slice(2)}`

  return (
    <Section id="story" className="overflow-hidden bg-obsidian-2 py-24 sm:py-32">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[.05] mix-blend-overlay" />

      {/* opening credits */}
      <div className="relative px-6 text-center">
        <FadeUp>
          <Mono className="text-champagne/60">A Stark Industries production</Mono>
        </FadeUp>
        <MaskLines
          lines={['Our Story']}
          className="mt-5 font-display text-[clamp(3.4rem,15vw,7rem)] leading-none font-light italic text-paper"
        />
        {story.isSample && (
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/35">Sample story · awaiting the couple&apos;s words</p>
        )}
      </div>

      {/* widescreen still */}
      <div ref={filmRef} className="relative">
      {photos.story && (
      <div className="mt-14 sm:mt-20">
        <div className="mx-auto max-w-6xl sm:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-[2.2/1]">
            <motion.img
              src={photos.story!.src}
              alt={photos.story!.alt}
              loading="lazy"
              className="absolute inset-0 h-[116%] w-full object-cover [filter:saturate(.8)_contrast(1.06)]"
              style={{ y: imgY, top: '-8%', objectPosition: photos.story!.focus }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,.55)_0%,transparent_22%,transparent_70%,rgba(8,10,15,.85)_100%)]" />
            <motion.div
              className="absolute inset-0 bg-obsidian"
              initial={{ clipPath: 'inset(0 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0 100%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <Mono className="absolute left-4 top-4 text-paper/60 sm:left-6 sm:top-6">● Rec · Archive 01</Mono>
            <p className="absolute bottom-4 right-4 font-mono text-xs tabular-nums text-paper/60 sm:bottom-6 sm:right-6">{timecode}</p>
          </div>
        </div>
      </div>
      )}
      </div>

      {/* acts */}
      <ol ref={actsRef} className="relative mx-auto mt-16 max-w-xl px-6 sm:mt-24">
        <span className="absolute left-6 top-1 bottom-1 w-px bg-paper/10" />
        <motion.span className="absolute left-6 top-1 bottom-1 w-px origin-top bg-iron-gold" style={{ scaleY: actsP }} />
        {story.chapters.map((c, i) => (
          <li key={c.label} className="relative pb-14 pl-10 last:pb-0">
            <span className="absolute left-[-3px] top-2 h-[7px] w-[7px] rotate-45 bg-iron-gold" />
            <FadeUp delay={0.05}>
              <Mono className="text-iron-gold">{c.label}</Mono>
            </FadeUp>
            <MaskLines lines={[c.title]} as="h3" className="mt-3 font-display text-[2.4rem] leading-[1.02] text-paper" delay={0.08 * i} />
            <FadeUp delay={0.15}>
              <p className="mt-3 font-body text-[16px] leading-relaxed text-paper/65">{c.text}</p>
            </FadeUp>
          </li>
        ))}
      </ol>

      <LoveMeasured />
    </Section>
  )
}

/** "I love you 3000" — the story's closing beat. */
function LoveMeasured() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(reduced ? 3000 : 0)

  useEffect(() => {
    if (!inView || reduced) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2400)
      setN(Math.round(3000 * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced])

  const done = n === 3000

  return (
    <div ref={ref} className="relative mx-auto mt-28 max-w-xl px-6 text-center">
      <Mono className="text-paper/45">Love, measured</Mono>
      <p className="mt-4 font-display text-[clamp(5rem,26vw,10rem)] leading-none font-light tabular-nums text-iron-gold">
        {n.toLocaleString('en-US')}
      </p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={done ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="mt-4 font-display text-3xl italic text-paper"
      >
        I love you 3000.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="mx-auto mt-3 max-w-xs font-body text-sm leading-relaxed text-paper/50"
      >
        Some love can&apos;t be measured. Three thousand is simply where we start counting.
      </motion.p>
    </div>
  )
}

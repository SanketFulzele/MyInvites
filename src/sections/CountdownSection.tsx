import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StarryNight } from '../art/Landscapes'
import PetalField from '../art/PetalField'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import { wedding } from '../data/wedding'
import { useCountdown } from '../hooks/useCountdown'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { fmt, parseLocal } from '../lib/date'
import { gsap, useGSAP } from '../lib/gsapSetup'

const twoDigits = (value: number) => String(value).padStart(2, '0')

/** Episode 11: a quiet night of lantern-flip numbers counting to the vows. */
export default function CountdownSection() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
  const parts = useCountdown(ceremony)

  const dateLine = [
    `${fmt.weekday(ceremony, wedding.timeZone)},`,
    fmt.day(ceremony, wedding.timeZone),
    fmt.month(ceremony, wedding.timeZone),
    fmt.year(ceremony, wedding.timeZone),
    '·',
    wedding.city,
  ].join(' ')

  const devanagariDate = new Intl.DateTimeFormat('hi-IN', {
    timeZone: wedding.timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(ceremony)

  const cells = [
    { label: 'DAYS', value: parts.days },
    { label: 'HRS', value: parts.hours },
    { label: 'MIN', value: parts.minutes },
    { label: 'SEC', value: parts.seconds },
  ]

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-countdown-reveal]', rootRef.current)
      if (items.length === 0) return
      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        items,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
        },
      )
    },
    { scope: rootRef, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section
      id="countdown"
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-night text-sakura-cream"
      aria-label={`Countdown to ${wedding.bride.name} and ${wedding.groom.name}'s wedding`}
    >
      <StarryNight className="z-0" />
      <div
        className="pointer-events-none absolute inset-0 z-[10] bg-gradient-to-b from-night/55 via-night/10 to-night/85"
        aria-hidden="true"
      />
      <PetalField
        position="absolute"
        density={14}
        tint={['#f4c6d0', '#ffe9c4', '#9b7bc8']}
        className="z-[12]"
      />

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <div data-countdown-reveal="">
          <EpisodeTitle
            number="第十一話 · Episode 11"
            title="Until We Meet"
            kanji="待"
            tone="night"
            className="[&>div:first-child]:justify-center [&>h2]:text-center"
          />
        </div>

        <p
          data-countdown-reveal=""
          className="mt-9 font-display text-xl italic tracking-wide text-blossom text-shadow-glow sm:text-2xl"
        >
          {parts.isPast ? 'The day is here.' : `Total Concentration… ${parts.days} days until forever`}
        </p>

        {parts.isPast ? (
          <div data-countdown-reveal="" className="mt-8 space-y-3">
            <p lang="hi" className="font-devanagari text-lg text-sakura-cream/85">
              {wedding.blessingLine}
            </p>
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-blossom/70">
              {wedding.city} · {wedding.country}
            </p>
          </div>
        ) : (
          <div data-countdown-reveal="" className="relative mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {/* Decorative breath rings only — no hidden orb lives in this episode. */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72"
              aria-hidden="true"
            >
              <span className="animate-breath absolute inset-0 rounded-full border border-lantern/20" />
              <span
                className="animate-breath absolute inset-8 rounded-full border border-blossom/20"
                style={{ animationDelay: '-1.8s' }}
              />
            </div>

            {cells.map((cell) => (
              <div
                key={cell.label}
                role="timer"
                aria-label={`${cell.label.toLowerCase()} remaining: ${cell.value}`}
                className="relative flex min-h-[8.5rem] flex-col items-center justify-center rounded-2xl border border-gold-leaf/45 bg-[linear-gradient(180deg,rgba(242,163,58,0.2),rgba(31,35,80,0.6))] px-3 py-5 shadow-[0_0_30px_rgba(242,163,58,0.16)] backdrop-blur-sm"
              >
                <span
                  aria-hidden="true"
                  className="animate-breath pointer-events-none absolute -inset-1 rounded-[1.15rem] border border-lantern/45"
                />
                <span
                  aria-hidden="true"
                  className="animate-lantern pointer-events-none absolute inset-x-5 top-0 h-px bg-lantern/80"
                />

                <div className="relative h-12 w-full overflow-hidden [perspective:420px]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-1/2 z-10 h-px bg-night/70"
                  />
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={cell.value}
                      initial={reduced ? false : { rotateX: -88, opacity: 0, y: -8 }}
                      animate={{ rotateX: 0, opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { rotateX: 88, opacity: 0, y: 8 }}
                      transition={{ duration: reduced ? 0 : 0.36, ease: 'easeOut' }}
                      className="block text-center font-display text-5xl font-semibold leading-[3rem] tabular-nums text-shadow-glow sm:text-6xl"
                    >
                      {twoDigits(cell.value)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="relative mt-3 text-[10px] font-semibold tracking-[0.32em] text-blossom/80">
                  {cell.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div data-countdown-reveal="" className="mt-12 space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-sakura-cream/85">
            {dateLine}
          </p>
          <p lang="hi" className="font-devanagari text-sm text-blossom/85">
            {devanagariDate}
          </p>
          <p className="pt-2 text-[10px] tracking-[0.22em] uppercase text-sakura-cream/55">
            {wedding.timeZone}
          </p>
        </div>
      </div>
    </section>
  )
}

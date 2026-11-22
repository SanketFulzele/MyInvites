import { AnimatePresence, motion } from 'framer-motion'
import { useCountdown } from '../../../hooks/useCountdown'
import { FadeUp, MaskLines, Mono, Section } from './ui'
import Gauntlet from './Gauntlet'

const TICKS = 60

function Digits({ value }: { value: string }) {
  return (
    <span className="inline-flex overflow-hidden">
      {value.split('').map((ch, i) => (
        <span key={i} className="relative inline-block w-[0.56em] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={ch}
              className="inline-block"
              initial={{ y: '-90%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '90%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

export default function Countdown({ target, dateText }: { target: Date; dateText: string }) {
  const c = useCountdown(target)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <Section id="countdown" className="overflow-hidden bg-obsidian-2 py-24 sm:py-32">
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[.04] mix-blend-overlay" />
      <div className="relative mx-auto max-w-xl px-6 text-center">
        <FadeUp>
          <Mono className="text-champagne/60">{c.isPast ? 'Mission accomplished' : 'T-minus to the muhurat'}</Mono>
        </FadeUp>
        <MaskLines
          lines={[c.isPast ? 'Happily married' : 'Until forever']}
          className="mt-4 font-display text-[clamp(2.8rem,12vw,4.8rem)] leading-none italic font-light text-paper"
        />
        <FadeUp delay={0.1}>
          <p className="mt-3 font-body text-sm text-paper/50">{dateText}</p>
        </FadeUp>

        {/* seconds dial */}
        <FadeUp delay={0.15} className="relative mx-auto mt-12 aspect-square w-full max-w-[19rem]">
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="100" cy="100" r="98" fill="none" stroke="#d7c29a" strokeOpacity=".12" />
            {Array.from({ length: TICKS }).map((_, i) => {
              const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2
              const long = i % 5 === 0
              const r1 = long ? 82 : 86
              const on = c.isPast || i < c.seconds
              return (
                <line
                  key={i}
                  x1={100 + r1 * Math.cos(a)}
                  y1={100 + r1 * Math.sin(a)}
                  x2={100 + 92 * Math.cos(a)}
                  y2={100 + 92 * Math.sin(a)}
                  stroke={c.isPast ? '#c69a53' : on ? '#66d9ff' : '#f5efe5'}
                  strokeOpacity={on ? (c.isPast ? 0.7 : 0.9) : 0.12}
                  strokeWidth={long ? 1.6 : 1}
                  style={{ transition: 'stroke-opacity .4s, stroke .4s' }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {c.isPast ? (
              <>
                <p className="font-display text-[4.5rem] leading-none font-light tabular-nums text-iron-gold">{c.daysSince}</p>
                <Mono className="mt-2 text-paper/55">Days of forever</Mono>
              </>
            ) : (
              <>
                <p className="font-display text-[clamp(4.5rem,22vw,6rem)] leading-none font-light text-paper">
                  <Digits value={String(c.days)} />
                </p>
                <Mono className="mt-2 text-paper/55">{c.days === 1 ? 'Day' : 'Days'}</Mono>
              </>
            )}
          </div>
        </FadeUp>

        {!c.isPast && (
          <FadeUp delay={0.2} className="mt-10 flex items-start justify-center divide-x divide-paper/10">
            {(
              [
                ['Hours', c.hours],
                ['Minutes', c.minutes],
                ['Seconds', c.seconds],
              ] as const
            ).map(([label, v]) => (
              <div key={label} className="px-5 sm:px-8">
                <p className="font-display text-[2.6rem] leading-none font-light text-paper tabular-nums">
                  <Digits value={pad(v)} />
                </p>
                <Mono className="mt-2 text-paper/45">{label}</Mono>
              </div>
            ))}
          </FadeUp>
        )}

        <Gauntlet />
      </div>
    </Section>
  )
}

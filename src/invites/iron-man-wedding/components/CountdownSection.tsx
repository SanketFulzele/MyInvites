import { AnimatePresence, motion } from 'framer-motion'
import { useCountdown } from '../../../hooks/useCountdown'
import { HudPanel, SectionHeading } from './Hud'
import Gauntlet from './Gauntlet'

export default function CountdownSection({ target, names }: { target: Date; names: string }) {
  const c = useCountdown(target)
  const units = [
    ['Days', c.days],
    ['Hours', c.hours],
    ['Minutes', c.minutes],
    ['Seconds', c.seconds],
  ] as const

  return (
    <section id="countdown" className="relative px-5 py-20">
      <SectionHeading
        code={c.isPast ? 'MISSION ACCOMPLISHED' : 'T-MINUS'}
        title={c.isPast ? <>Happily <em className="text-stark-amber">Married</em></> : <>Counting down to <em className="text-stark-amber">Forever</em></>}
        subtitle={c.isPast ? `${names} have begun their forever.` : 'Until the muhurat, every second counts.'}
      />

      {c.isPast ? (
        <HudPanel glow="gold" className="mx-auto max-w-sm p-8 text-center">
          <p className="font-display text-7xl font-semibold text-stark-amber">{c.daysSince}</p>
          <p className="mt-2 font-hud text-[10px] tracking-[0.4em] text-white/60">DAYS OF FOREVER · AND COUNTING</p>
        </HudPanel>
      ) : (
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2.5 sm:gap-4">
          {units.map(([label, value]) => (
            <HudPanel key={label} className="flex flex-col items-center py-4">
              <div className="relative h-11 overflow-hidden sm:h-14">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={value}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="block font-hud text-3xl font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(127,233,255,.5)] sm:text-4xl"
                  >
                    {String(value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-1 font-tech text-[11px] font-semibold uppercase tracking-[0.2em] text-reactor/80">{label}</p>
            </HudPanel>
          ))}
        </div>
      )}

      <Gauntlet />
    </section>
  )
}

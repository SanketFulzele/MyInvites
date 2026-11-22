import { motion } from 'framer-motion'
import { AshokChakra, BodhiCanopy, Buddha, LotusPond, PipalLeaf } from '../art'
import { EASE, useLang } from '../ui'
import { bodhiWedding as C } from '../bodhiWedding.config'
import { dateText, timeText, toDate } from '../dates'

/** Chapter 1 · बोधि — Buddha beneath the Bodhi tree, names, date. */
export default function Opening() {
  const d = toDate(C.weddingDateTime)
  const { lang } = useLang()
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 1.2, ease: EASE },
  })

  return (
    <section id="opening" className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden text-center">
      {/* golden-hour sky */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fff2cf_0%,#fde6b5_30%,#fbf0dc_62%,#fbf5e9_100%)]" />
      {/* god-rays through the branches */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%]">
        {[-28, -12, 4, 18, 32].map((r, i) => (
          <span
            key={r}
            className="bodhi-rays absolute left-1/2 top-[-10%] h-[120%] w-[16vw] min-w-[60px] origin-top bg-gradient-to-b from-[#fff6d8] via-[#fff1c4]/60 to-transparent blur-md"
            style={{ transform: `translateX(-50%) rotate(${r}deg)`, animationDelay: `${-i * 1.3}s` }}
          />
        ))}
      </div>

      <BodhiCanopy className="pointer-events-none absolute inset-x-0 top-0 h-[34svh] w-full sm:h-[40svh]" />

      <div className="relative z-10 mt-[17svh] flex flex-col items-center px-5 sm:mt-[21svh]">
        {/* halo + chakra + Buddha */}
        <motion.div className="relative" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: EASE }}>
          <div className="absolute left-1/2 top-[22%] h-[min(68vw,280px)] w-[min(68vw,280px)] -translate-x-1/2 -translate-y-1/2">
            <div className="bodhi-glow absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(255,226,140,.95)_0%,rgba(232,163,61,.35)_45%,transparent_70%)]" />
            <AshokChakra className="absolute inset-0 h-full w-full opacity-30" spin />
            <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,#fff8e1_0%,#ffe7a3_60%,transparent_72%)]" />
          </div>
          <Buddha className="relative h-auto w-[min(52vw,220px)]" />
        </motion.div>

        <motion.p {...rise(0.5)} className="mt-6 max-w-sm font-marathi text-[13px] leading-relaxed text-bodhi-gold-deep sm:text-sm" lang="sa">
          {C.refuge.split(' · ').map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </motion.p>

        <motion.h1 {...rise(0.75)} className="mt-6 font-display font-medium leading-[0.95] text-bodhi-maroon">
          <span className="block text-[clamp(3rem,15vw,5.6rem)]">{C.bride.first}</span>
          <span className="my-1 block text-2xl text-bodhi-gold" aria-hidden>
            ❀
          </span>
          <span className="block text-[clamp(3rem,15vw,5.6rem)]">{C.groom.first}</span>
        </motion.h1>

        <motion.div {...rise(1)} className="mt-6">
          <p className="font-cinzel text-xs tracking-[0.3em] text-bodhi-ink/75">{C.events.find((e) => e.id === 'wedding')?.venue.toUpperCase()}</p>
          <p className="mt-2 font-mukta text-[15px] text-bodhi-ink/70">
            {dateText(d, lang)}
            {d && <> · {timeText(d, lang)}</>}
          </p>
        </motion.div>

        {/* scroll cue — a single leaf drifting down */}
        <a href="#mangal" aria-label="Scroll to the invitation" className="mt-8 flex flex-col items-center gap-1 text-bodhi-ink/50">
          <motion.span
            animate={{ y: [0, 16, 0], rotate: [-12, 14, -12], x: [0, 6, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PipalLeaf className="h-7 w-6" fill="#5e8c3a" />
          </motion.span>
          <span className="font-cinzel text-[10px] tracking-[0.3em]">SCROLL</span>
        </a>
      </div>

      <LotusPond className="relative mt-auto w-full" />
    </section>
  )
}

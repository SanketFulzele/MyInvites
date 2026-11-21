import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Reveal, SectionHeading } from './Hud'
import { useJarvis } from './Jarvis'
import type { WeddingInviteConfig } from '../../types'

export default function StorySection({ config }: { config: WeddingInviteConfig }) {
  const { story } = config
  const { say } = useJarvis()
  const [taps, setTaps] = useState(0)
  const unlocked = taps >= 3

  const tapHeart = () => {
    const n = taps + 1
    setTaps(n)
    if (n === 3) say('Message decrypted. Some love is measured in thousands.', 'love-3000')
  }

  return (
    <section id="story" className="relative px-5 py-20">
      <SectionHeading code="MISSION LOG" title={<>Our <em className="text-stark-amber">Story</em></>} />

      {story.isSample && (
        <p className="mx-auto -mt-4 mb-8 w-fit rounded-full border border-dashed border-white/20 px-3 py-1 text-[11px] text-white/45">
          Sample story — to be replaced with the couple&apos;s own words
        </p>
      )}

      <ol className="relative mx-auto max-w-md">
        {/* glowing timeline line */}
        <span className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-reactor/0 via-reactor/60 to-stark-gold/0" />
        {story.chapters.map((c, i) => (
          <li key={c.title} className="relative pb-10 pl-14 last:pb-0">
            <Reveal delay={i * 0.08} y={20}>
              <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-reactor/40 bg-stark-night font-hud text-xs text-reactor shadow-[0_0_16px_-2px_rgba(127,233,255,.6)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-3xl font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/65">{c.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* "I love you 3000" — tap the heart three times */}
      <Reveal className="mt-14 flex flex-col items-center">
        <motion.button
          onClick={tapHeart}
          whileTap={{ scale: 0.85 }}
          aria-label="A heart. Tap it."
          className="relative grid h-16 w-16 place-items-center rounded-full border border-stark-red/40 bg-stark-red/10"
        >
          <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <Heart className={`h-7 w-7 transition-colors ${unlocked ? 'fill-stark-red text-stark-red' : 'text-stark-red'}`} />
          </motion.span>
          {Array.from({ length: Math.min(taps, 3) }).map((_, i) => (
            <span key={i} className="absolute -bottom-3 h-1 w-1 rounded-full bg-stark-amber" style={{ left: `${38 + i * 12}%` }} />
          ))}
        </motion.button>

        <div className="mt-6 h-24 text-center">
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div key="3000" initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.9 }}>
                <p className="font-script text-5xl text-stark-amber drop-shadow-[0_0_20px_rgba(232,182,76,.5)]">I love you 3000</p>
                <p className="mt-2 font-hud text-[9px] tracking-[0.4em] text-white/40">AND THEN SOME</p>
              </motion.div>
            ) : (
              <motion.p key="hint" exit={{ opacity: 0 }} className="font-display text-lg italic text-white/40">
                Some feelings can&apos;t be measured…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PipalLeaf } from '../art'
import { Chapter, ChapterHeading, EASE, Reveal, useLang, useT } from '../ui'
import { bodhiWedding as C } from '../bodhiWedding.config'

/** Chapter 4 · The Journey — a Bodhi branch that grows as you scroll. */
export default function Story() {
  const { lang } = useLang()
  const t = useT()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const grow = useTransform(scrollYProgress, [0, 1], [0, 1])
  const n = C.story.milestones.length

  return (
    <Chapter id="journey" className="bodhi-parchment">
      <ChapterHeading accent="धम्म" number="CHAPTER IV" title={lang === 'en' ? 'The Journey' : 'प्रवास'} subtitle={lang === 'en' ? 'Every branch begins as a single leaf.' : 'प्रत्येक फांदी एका पानापासून सुरू होते.'} />

      <ol ref={ref} className="relative mx-auto mt-12 max-w-2xl">
        {/* the growing branch */}
        <svg className="absolute left-[22px] top-0 h-full w-10 overflow-visible md:left-1/2 md:-translate-x-1/2" viewBox="0 0 40 400" preserveAspectRatio="none" aria-hidden>
          <path d="M20 0 C6 60 34 110 20 170 C8 230 32 290 20 400" fill="none" stroke="#e7dcc4" strokeWidth="5" strokeLinecap="round" />
          <motion.path d="M20 0 C6 60 34 110 20 170 C8 230 32 290 20 400" fill="none" stroke="#6b4a2c" strokeWidth="5" strokeLinecap="round" style={{ pathLength: grow }} />
        </svg>

        {C.story.milestones.map((m, i) => {
          const right = i % 2 === 1
          return (
            <motion.li initial="off" whileInView="on" viewport={{ once: true, margin: '-80px' }} key={m.title.en} className={`relative pb-14 pl-16 last:pb-0 md:w-1/2 md:pl-0 ${right ? 'md:ml-auto md:pl-14' : 'md:pr-14 md:text-right'}`}>
              {/* leaf unfolds at the branch */}
              <motion.span
                className={`absolute left-[14px] top-1 md:top-1 ${right ? 'md:-left-[17px]' : 'md:left-auto md:-right-[17px]'}`}
                variants={{ off: { scale: 0, rotate: right ? -90 : 90, opacity: 0 }, on: { scale: 1, rotate: right ? -30 : 30, opacity: 1 } }}
                transition={{ duration: 1, ease: EASE }}
              >
                <PipalLeaf className="h-11 w-9" fill={i === n - 1 ? '#c9a227' : '#5e8c3a'} rotate={180} />
              </motion.span>
              <Reveal y={18}>
                <p className="font-cinzel text-xs tracking-[0.3em] text-bodhi-gold-deep">{String(i + 1).padStart(2, '0')}</p>
                <h3 className={`mt-1 leading-tight text-bodhi-maroon ${lang === 'mr' ? 'font-marathi text-[1.6rem]' : 'font-display text-[2rem]'}`}>{t(m.title)}</h3>
                <p className="mt-2 font-mukta text-[15px] leading-relaxed text-bodhi-ink/75">{t(m.text)}</p>
              </Reveal>
            </motion.li>
          )
        })}
      </ol>
    </Chapter>
  )
}

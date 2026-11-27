import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import HeartReactor from './HeartReactor'
import Reactor from './Reactor'
import { EASE, Mono, useSectionStatus } from './ui'
import { reactorSecrets } from '../copy'
import type { WeddingInviteConfig } from '../../types'

interface Props {
  config: WeddingInviteConfig
  ready: boolean
  date: { numeric: string; weekday: string; time: string }
}

export default function Hero({ config, ready, date }: Props) {
  const ref = useRef<HTMLElement>(null)
  useSectionStatus(ref, 'hero')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 40])

  const secrets = reactorSecrets(config.groom.name, config.bride.name)
  const [secret, setSecret] = useState<number | null>(null)
  const [flare, setFlare] = useState(false)
  const pressReactor = () => {
    setSecret((s) => (s === null ? 0 : (s + 1) % secrets.length))
    setFlare(true)
    window.setTimeout(() => setFlare(false), 450)
  }

  const { hero } = config.photos
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 1.1, ease: EASE },
  })

  return (
    <section id="hero" ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-obsidian">
      {hero ? (
      /* photograph — top on mobile, right half on desktop */
      <motion.div className="absolute inset-x-0 top-0 h-[66svh] overflow-hidden lg:inset-y-0 lg:left-auto lg:h-full lg:w-[56%]" style={{ y: imgY }}>
        <motion.img
          src={hero.src}
          alt={hero.alt}
          className="h-full w-full object-cover [filter:saturate(.82)_contrast(1.08)_brightness(.88)]"
          style={{ objectPosition: hero.focus, scale: imgScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          fetchPriority="high"
        />
        {/* grade: warm red rim, obsidian falloff */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_0%_100%,rgba(143,24,32,.45),transparent_60%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian lg:bg-gradient-to-r lg:from-obsidian lg:via-obsidian/10 lg:to-obsidian/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent lg:hidden" />
      </motion.div>
      ) : (
        <HeartReactor ready={ready} rotate={ringRotate} y={imgY} />
      )}

      {/* red key light behind the names */}
      <div className="absolute bottom-0 left-0 h-[55%] w-full bg-[radial-gradient(60%_60%_at_20%_80%,rgba(143,24,32,.35),transparent_70%)]" />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-12 pt-[calc(9svh+min(88vw,430px)+8px)] sm:px-8 lg:justify-center lg:pb-0 lg:pt-24"
      >
        <div className="lg:max-w-[46%]">
          {config.headline && (
            <motion.p {...show(0.2)} className="font-marathi text-lg text-champagne/80">
              {config.headline}
            </motion.p>
          )}
          <motion.div {...show(0.3)}>
            <Mono className="mt-2 text-paper/60">The wedding of</Mono>
          </motion.div>

          <h1 className="mt-3 font-display font-medium leading-[0.86] tracking-[-0.01em] text-paper">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block text-[clamp(3.6rem,18.5vw,8.5rem)]"
                initial={{ y: '105%' }}
                animate={ready ? { y: 0 } : {}}
                transition={{ delay: 0.35, duration: 1.3, ease: EASE }}
              >
                {config.groom.name}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block text-right text-[clamp(3.6rem,18.5vw,8.5rem)] lg:pl-[1.2em] lg:text-left"
                initial={{ y: '105%' }}
                animate={ready ? { y: 0 } : {}}
                transition={{ delay: 0.48, duration: 1.3, ease: EASE }}
              >
                <span className="mr-[0.12em] align-[0.08em] text-[0.5em] italic text-iron-gold">&amp;</span>
                {config.bride.name}
              </motion.span>
            </span>
          </h1>

          <motion.div {...show(0.75)} className="mt-6">
            <motion.span
              className="block h-px origin-left bg-iron-gold/50"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : {}}
              transition={{ delay: 0.8, duration: 1.4, ease: EASE }}
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm tracking-[0.18em] text-paper">{date.numeric}</p>
                <p className="mt-1 font-body text-[13px] text-paper/55">
                  {date.weekday} · {date.time} · {config.placeLine}
                </p>
              </div>
              <Reactor
                lit
                bloom={false}
                flare={flare}
                className="h-11 w-11 opacity-90"
                onPress={pressReactor}
                label="A small arc reactor"
              />
            </div>
            <div className="h-6">
              <AnimatePresence mode="wait">
                {secret !== null && (
                  <motion.p
                    key={secret}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-right font-mono text-[11px] text-arc/80"
                  >
                    {secrets[secret]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.p {...show(0.95)} className="mt-3 max-w-sm font-body text-[15px] leading-relaxed text-paper/70">
            {config.intro}
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

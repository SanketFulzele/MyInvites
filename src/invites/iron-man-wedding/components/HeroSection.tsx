import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import ArcReactor from './ArcReactor'
import { useJarvis } from './Jarvis'
import type { WeddingInviteConfig } from '../../types'

const REACTOR_LINES = [
  'Arc reactor stable. Heart rate: elevated. Cause: wedding.',
  'Fun fact: the groom holds an M.Sc. in Electronics. Suspiciously qualified for reactor maintenance.',
  'Proof that the groom has a heart — it is glowing.',
]

interface Props {
  config: WeddingInviteConfig
  dateParts: { weekday: string; day: string; month: string; year: string; time: string }
}

export default function HeroSection({ config, dateParts }: Props) {
  const { say } = useJarvis()
  const [taps, setTaps] = useState(0)
  const [flare, setFlare] = useState(false)

  const tapReactor = () => {
    const n = taps + 1
    setTaps(n)
    if (n % 3 === 0) {
      setFlare(true)
      window.setTimeout(() => setFlare(false), 1400)
      say(REACTOR_LINES[(n / 3 - 1) % REACTOR_LINES.length])
    }
  }

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-24 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_30%,rgba(179,18,31,.35),transparent_70%)]" />
      <div className="absolute -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-stark-gold/10 blur-3xl" />

      {config.blessingLine && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative font-marathi text-sm text-stark-amber/80">
          {config.blessingLine}
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative mt-4 font-marathi text-4xl text-stark-amber drop-shadow-[0_0_18px_rgba(232,182,76,.35)]"
      >
        {config.headline}
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="relative my-8">
        <ArcReactor className="h-32 w-32 sm:h-40 sm:w-40" onClick={tapReactor} flare={flare} label="Arc reactor" />
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="relative font-hud text-[10px] tracking-[0.5em] text-reactor/80">
        WITH HEARTS FULL OF LOVE
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-4 font-display font-semibold leading-[0.9]"
      >
        <span className="block text-[4.2rem] sm:text-8xl">
          <span className="gold-shimmer">{config.groom.name}</span>
        </span>
        <span className="my-1 block font-script text-5xl text-stark-red drop-shadow-[0_0_14px_rgba(179,18,31,.7)]">&amp;</span>
        <span className="block text-[4.2rem] sm:text-8xl">
          <span className="gold-shimmer">{config.bride.name}</span>
        </span>
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="relative mt-5 max-w-xs text-[15px] leading-relaxed text-white/65">
        are excited for you to join them as they begin their forever.
      </motion.p>

      {/* date strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 0.8 }}
        className="relative mt-8 flex items-stretch divide-x divide-stark-gold/30 rounded-2xl border border-stark-gold/35 bg-black/30 backdrop-blur"
      >
        <div className="px-4 py-3">
          <p className="font-hud text-[9px] tracking-[0.3em] text-white/50">{dateParts.weekday.toUpperCase()}</p>
          <p className="mt-1 font-display text-lg text-white">{dateParts.month}</p>
        </div>
        <div className="px-5 py-2">
          <p className="font-display text-5xl leading-none font-semibold text-stark-amber">{dateParts.day}</p>
          <p className="mt-1 font-hud text-[9px] tracking-[0.3em] text-white/50">{dateParts.year}</p>
        </div>
        <div className="px-4 py-3">
          <p className="font-hud text-[9px] tracking-[0.3em] text-white/50">MUHURAT</p>
          <p className="mt-1 font-display text-lg text-white">{dateParts.time}</p>
        </div>
      </motion.div>

      <motion.a
        href="#couple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 2 } }}
        className="relative mt-8 text-white/40"
        aria-label="Scroll to couple"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  )
}

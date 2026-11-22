import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mail, Share2 } from 'lucide-react'
import { AshokChakra, Buddha, Diya, LotusPond } from '../art'
import { EASE, Reveal, useLang, useT } from '../ui'
import { bodhiWedding as C } from '../bodhiWedding.config'

/** Chapter 12 · Closing — the sky turns from saffron to dusk as you scroll. */
export default function Closing({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const sky = useTransform(scrollYProgress, [0, 0.45, 0.75, 1], ['#f6c56a', '#e08a3c', '#5a2a4a', '#14204a'])
  const sun = useTransform(scrollYProgress, [0, 1], ['10%', '58%'])
  const [note, setNote] = useState('')
  const { lang } = useLang()
  const t = useT()
  const blessing = C.blessings[0]

  const share = async () => {
    const data = { title: C.meta.pageTitle, text: `You're invited to the wedding of ${C.bride.first} & ${C.groom.first} ${C.groom.surname ?? ''} — ${C.events.find((e) => e.id === 'wedding')?.venue}.`, url: window.location.href.split('?')[0] }
    try {
      if (navigator.share) await navigator.share(data)
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, '_blank', 'noopener')
    } catch {
      /* cancelled */
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split('?')[0])
      setNote('Link copied')
      window.setTimeout(() => setNote(''), 2000)
    } catch {
      /* unavailable */
    }
  }

  return (
    <motion.section ref={ref} id="closing" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden text-center" style={{ backgroundColor: sky }}>
      {/* setting sun behind the Buddha */}
      <motion.div className="absolute left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,214,140,.85)_0%,rgba(255,170,80,.35)_40%,transparent_70%)]" style={{ top: sun }} />

      <div className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-end px-6 pt-28">
        <Reveal>
          <Buddha tone="silhouette" className="mx-auto h-auto w-[min(48vw,200px)]" />
        </Reveal>
        <Reveal delay={0.2}>
          <p className={`mt-10 leading-tight text-bodhi-ivory ${lang === 'en' ? 'font-display text-[2.4rem] italic sm:text-5xl' : 'font-marathi text-[2rem]'}`}>“{t(C.closingQuote)}”</p>
          <p className={`mt-4 text-xl text-bodhi-saffron ${lang === 'en' ? 'font-display' : 'font-marathi'}`}>{t(C.closingSignoff)}</p>
          <div className="mx-auto mt-8 max-w-sm border-t border-bodhi-gold/30 pt-5">
            <p className="font-display text-lg italic text-bodhi-ivory/85">{blessing.pali}</p>
            <p className={`mt-1 text-sm text-bodhi-ivory/65 ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>{blessing[lang]}</p>
          </div>
        </Reveal>
      </div>

      {/* diyas lit along the water */}
      <div className="relative z-10 mt-10 flex justify-center gap-[6vw]">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: EASE }}>
            <Diya className="h-12 w-12 sm:h-14 sm:w-14" />
          </motion.span>
        ))}
      </div>
      <LotusPond dusk className="relative z-10 -mt-4 w-full" />

      <footer className="relative z-10 bg-[#0e1638] px-6 pb-28 pt-8 text-bodhi-ivory/80 lg:pb-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <AshokChakra className="h-7 w-7" color="#c9a227" spin />
            <p className="font-cinzel text-[11px] tracking-[0.25em]">
              {C.bride.first.toUpperCase()} · {C.groom.first.toUpperCase()}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onReplay} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-bodhi-gold/40 px-4 font-mukta text-sm transition hover:bg-white/10">
              <Mail className="h-4 w-4 text-bodhi-saffron" /> {lang === 'en' ? 'Replay envelope' : 'पाकीट पुन्हा उघडा'}
            </button>
            <button type="button" onClick={() => void share()} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-bodhi-saffron px-4 font-mukta text-sm font-medium text-bodhi-ink transition hover:brightness-105">
              <Share2 className="h-4 w-4" /> {lang === 'en' ? 'Share' : 'शेअर करा'}
            </button>
            <button type="button" onClick={() => void copy()} className="inline-flex min-h-[44px] items-center rounded-full px-3 font-mukta text-sm underline-offset-4 hover:underline" aria-live="polite">
              {note || (lang === 'en' ? 'Copy link' : 'लिंक कॉपी करा')}
            </button>
          </div>
        </div>
        <p className="mt-6 font-mukta text-xs text-bodhi-ivory/40">
          Crafted with love by <a href="/" className="underline-offset-4 hover:underline">My Invites</a>
        </p>
      </footer>
    </motion.section>
  )
}

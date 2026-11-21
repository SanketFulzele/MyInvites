import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Expand, X } from 'lucide-react'
import { Reveal, SectionHeading } from './Hud'
import type { WeddingInviteConfig } from '../../types'

export default function CardsSection({ config }: { config: WeddingInviteConfig }) {
  const cards = config.cards ?? []
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (cards.length === 0) return null

  return (
    <section id="cards" className="relative px-5 py-20">
      <SectionHeading code="ARCHIVED DOCUMENTS" local="निमंत्रण पत्रिका" title={<>The Invitation <em className="text-stark-amber">Cards</em></>} subtitle="Tap a card to view it in full." />

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <Reveal key={c.src} delay={i * 0.1}>
            <button
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,.8)]"
            >
              <img src={c.src} alt={c.alt} loading="lazy" className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-left">
                <span className="font-display text-lg text-white">{c.label}</span>
                <Expand className="h-4 w-4 text-white/70" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <div className="flex items-center justify-between p-4">
              <p className="font-display text-lg text-white">{cards[open].label}</p>
              <div className="flex gap-2">
                <a
                  href={cards[open].src}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
                  aria-label="Download card"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-3 pb-6" onClick={(e) => e.stopPropagation()}>
              <motion.img
                src={cards[open].src}
                alt={cards[open].alt}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-full max-w-xl rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

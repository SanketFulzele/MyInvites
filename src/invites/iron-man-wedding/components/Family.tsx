import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, FadeUp, Section } from './ui'
import type { Family as FamilyT, Person, WeddingInviteConfig } from '../../types'

type Lang = 'en' | 'mr'

function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 24" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      {[
        'M0 12h86',
        'M134 12h86',
        'M110 2l10 10-10 10-10-10z',
        'M110 7l5 5-5 5-5-5z',
        'M86 12c6 0 8-5 14-5',
        'M86 12c6 0 8 5 14 5',
        'M134 12c-6 0-8-5-14-5',
        'M134 12c-6 0-8 5-14 5',
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: i * 0.05, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  )
}

export default function Family({ config }: { config: WeddingInviteConfig }) {
  const [lang, setLang] = useState<Lang>('en')
  const [card, setCard] = useState<number | null>(null)
  const groomFam = config.families.find((f) => f.side === 'groom')
  const brideFam = config.families.find((f) => f.side === 'bride')
  const cards = config.cards ?? []

  return (
    <Section id="family" className="paper-texture overflow-hidden py-24 text-umber sm:py-32">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {config.blessingLine && (
          <FadeUp>
            <p className="font-marathi text-base text-iron">{config.blessingLine}</p>
          </FadeUp>
        )}
        <FadeUp delay={0.08}>
          <p className="mt-5 font-marathi text-3xl text-umber">सस्नेह निमंत्रण</p>
        </FadeUp>
        <Ornament className="mx-auto mt-6 h-5 w-52 text-iron-gold" />

        {/* language switch */}
        <div className="mt-8 inline-flex items-center gap-1 font-body text-sm" role="tablist" aria-label="Invitation language">
          {(
            [
              ['en', 'English'],
              ['mr', 'मराठी'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={lang === k}
              onClick={() => setLang(k)}
              className={`relative px-4 py-2 transition-colors ${lang === k ? 'text-umber' : 'text-umber/45'} ${k === 'mr' ? 'font-marathi' : ''}`}
            >
              {label}
              {lang === k && <motion.span layoutId="lang-underline" className="absolute inset-x-3 -bottom-px h-px bg-iron" transition={{ duration: 0.45, ease: EASE }} />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {lang === 'en' && (
              <p className="mx-auto mt-10 max-w-md font-display text-xl italic leading-snug text-umber/80">{config.invitationLine.text}</p>
            )}

            <div className="mt-12 grid gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-10">
              {groomFam && <Side person={config.groom} family={groomFam} lang={lang} />}
              <div className="flex items-center justify-center gap-4 md:flex-col">
                <span className="h-px w-12 bg-iron-gold/60 md:h-16 md:w-px" />
                <span className="font-display text-2xl italic text-iron-gold">{lang === 'en' ? 'with' : 'व'}</span>
                <span className="h-px w-12 bg-iron-gold/60 md:h-16 md:w-px" />
              </div>
              {brideFam && <Side person={config.bride} family={brideFam} lang={lang} />}
            </div>

            {lang === 'mr' && config.invitationLine.textLocal && (
              <p className="mx-auto mt-12 max-w-md font-marathi text-lg leading-relaxed text-umber/85">{config.invitationLine.textLocal}</p>
            )}
          </motion.div>
        </AnimatePresence>

        <FadeUp className="mt-16">
          <Ornament className="mx-auto h-4 w-40 text-iron-gold/70" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-umber/55">{lang === 'en' ? 'With love, from' : 'निमंत्रक'}</p>
          <p className="mt-3 font-marathi text-2xl text-iron">{config.inviters.textLocal}</p>
          <p className="mt-1 font-body text-sm text-umber/65">{config.inviters.text}</p>
        </FadeUp>

        {cards.length > 0 && (
          <FadeUp className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-umber/55">The printed patrika</p>
            <div className="mx-auto mt-5 flex max-w-sm justify-center gap-4">
              {cards.map((c, i) => (
                <button
                  key={c.src}
                  onClick={() => setCard(i)}
                  className="group w-1/2 text-left transition-transform active:scale-[.98]"
                  aria-label={`View ${c.label}`}
                >
                  <span className="block overflow-hidden border border-umber/15 bg-white p-1.5 shadow-[0_18px_30px_-20px_rgba(59,42,31,.6)]">
                    <img src={c.src} alt={c.alt} loading="lazy" className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  </span>
                  <span className={`mt-2 block text-center text-sm text-umber/75 ${c.label.match(/[ऀ-ॿ]/) ? 'font-marathi' : 'font-body'}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </FadeUp>
        )}
      </div>

      <Lightbox cards={cards} index={card} onClose={() => setCard(null)} />
    </Section>
  )
}

function Side({ person, family, lang }: { person: Person; family: FamilyT; lang: Lang }) {
  const en = lang === 'en'
  return (
    <FadeUp className="text-center">
      <p className={`text-sm text-umber/60 ${en ? 'font-mono uppercase tracking-[0.2em] text-[11px]' : 'font-marathi'}`}>
        {en ? person.honorific : person.honorificLocal}
      </p>
      <h3 className={`mt-2 leading-none text-iron ${en ? 'font-display text-[3.4rem]' : 'font-marathi text-[2.9rem]'}`}>
        {en ? person.name : person.nameLocal}
      </h3>
      {person.qualification && <p className="mt-2 font-display text-base italic text-umber/60">{person.qualification}</p>}

      {en ? (
        <>
          <p className="mt-6 font-display text-lg italic text-umber/60">{family.relationLine}</p>
          <p className="mx-auto mt-1 max-w-[17rem] font-display text-[1.45rem] leading-snug text-umber">{family.parents}</p>
          <p className="mt-2 font-body text-sm text-umber/60">{family.hometown}</p>
        </>
      ) : (
        <div className="mx-auto mt-6 max-w-[18rem] font-marathi text-lg leading-relaxed text-umber">
          <p>{family.parentsLocal}</p>
          <p className="text-umber/65">{family.hometownLocal}</p>
          <p className="mt-1 text-iron">{family.relationLineLocal}</p>
        </div>
      )}
    </FadeUp>
  )
}

function Lightbox({ cards, index, onClose }: { cards: NonNullable<WeddingInviteConfig['cards']>; index: number | null; onClose: () => void }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [index, onClose])

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-obsidian/97"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={cards[index].label}
        >
          <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] pb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">{cards[index].label}</p>
            <div className="flex items-center gap-5 font-body text-sm text-paper">
              <a href={cards[index].src} download onClick={(e) => e.stopPropagation()} className="py-2 underline-offset-4 active:underline">
                Save
              </a>
              <button className="py-2" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto px-3 pb-8">
            <motion.img
              src={cards[index].src}
              alt={cards[index].alt}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto w-full max-w-xl"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

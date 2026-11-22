import { Cog, HeartPulse } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AshokChakra, BuddhaOnLotus, Garland, Lotus, Mandala } from '../art'
import { Bloom, Chapter, ChapterHeading, Reveal, useLang, useT } from '../ui'
import { bodhiWedding as C, type BodhiPerson } from '../bodhiWedding.config'

/** Chapter 2 · मंगल — the formal invitation, bilingual. */
export function Invitation() {
  const { lang } = useLang()
  const t = useT()
  const fam = C.families

  return (
    <Chapter id="mangal" className="bodhi-parchment">
      <Mandala className="pointer-events-none absolute left-1/2 top-1/2 w-[130vmin] -translate-x-1/2 -translate-y-1/2 text-bodhi-gold/[.08]" />
      <ChapterHeading accent="मंगल" number="CHAPTER II" title={lang === 'en' ? 'An Invitation' : 'निमंत्रण'} />

      <Reveal className="relative mx-auto mt-12 max-w-xl">
        <Bloom>
          <Garland className="relative z-10 mx-auto -mb-3 h-10 w-[92%]" sag={24} />
        </Bloom>
        <div className="relative rounded-[3px] border border-bodhi-gold/60 bg-bodhi-ivory/90 px-6 py-12 text-center shadow-[0_30px_60px_-40px_rgba(59,36,22,.6)] sm:px-12">
          <div className="pointer-events-none absolute inset-2 border border-bodhi-gold/30" />
          <AshokChakra className="mx-auto h-9 w-9" />
          <p className={`mx-auto mt-6 max-w-md text-bodhi-ink/85 ${lang === 'en' ? 'font-display text-xl italic leading-snug' : 'font-marathi text-lg leading-relaxed'}`}>
            {t(C.invitation)}
          </p>

          <p className="mt-8 font-display text-[2.6rem] leading-none text-bodhi-maroon">
            {C.bride.first}
            {C.bride.surname && <span className="block font-cinzel text-xs tracking-[0.35em] text-bodhi-gold-deep">{C.bride.surname.toUpperCase()}</span>}
          </p>
          <p className="my-3 font-display text-lg italic text-bodhi-gold-deep">{lang === 'en' ? 'with' : 'आणि'}</p>
          <p className="font-display text-[2.6rem] leading-none text-bodhi-maroon">
            {C.groom.first}
            {C.groom.surname && <span className="block font-cinzel text-xs tracking-[0.35em] text-bodhi-gold-deep">{C.groom.surname.toUpperCase()}</span>}
          </p>

          <div className="mx-auto my-8 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-bodhi-gold/60" />
            <Lotus className="h-6 w-8" />
            <span className="h-px w-12 bg-bodhi-gold/60" />
          </div>

          <div className="grid gap-7 font-mukta text-[15px] text-bodhi-ink/80 sm:grid-cols-2">
            {[fam.bride, fam.groom].map((f) => (
              <div key={f.surname}>
                <p className="font-cinzel text-[11px] uppercase tracking-[0.25em] text-bodhi-gold-deep">{t(f.relation)}</p>
                <p className={`mt-1 ${lang === 'mr' ? 'font-marathi' : ''}`}>{t(f.parents)}</p>
                <p className={`mt-1.5 text-[12px] uppercase tracking-[0.2em] text-bodhi-maroon ${lang === 'mr' ? 'font-marathi tracking-normal text-sm' : 'font-cinzel'}`}>{t(f.familyLine)}</p>
              </div>
            ))}
          </div>
          {lang === 'en' && <p className="mx-auto mt-8 max-w-sm font-marathi text-[15px] leading-relaxed text-bodhi-ink/55">{C.invitation.mr}</p>}
        </div>
      </Reveal>
    </Chapter>
  )
}

/** Gear that turns into a Dhamma wheel on hover / tap. */
function GearToChakra() {
  const [wheel, setWheel] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setWheel(true)}
      onMouseLeave={() => setWheel(false)}
      onClick={() => setWheel((v) => !v)}
      aria-label="Gear — or is it a Dhamma wheel?"
      className="relative grid h-9 w-9 place-items-center rounded-full bg-bodhi-navy/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {wheel ? (
          <motion.span key="w" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.4 }}>
            <AshokChakra className="h-6 w-6" spin fast />
          </motion.span>
        ) : (
          <motion.span key="g" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.4 }}>
            <Cog className="h-5 w-5 text-bodhi-navy" strokeWidth={1.6} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function Arch({ person, icon, delay }: { person: BodhiPerson; icon: 'nurse' | 'engineer'; delay: number }) {
  const t = useT()
  const { lang } = useLang()
  return (
    <Reveal delay={delay} className="flex flex-col items-center text-center">
      <div className="relative w-[min(62vw,240px)]">
        {/* stupa-shaped arch */}
        <div
          className="relative aspect-[3/4] overflow-hidden border-[3px] border-bodhi-gold bg-[radial-gradient(120%_90%_at_50%_15%,#fde4ea_0%,#f6c9d3_45%,#e9a7b6_100%)] shadow-[0_24px_50px_-30px_rgba(122,31,43,.7)]"
          style={{ borderRadius: '999px 999px 10px 10px' }}
        >
          {person.photo ? (
            <img src={person.photo} alt={`${person.first}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <span className="font-display text-[6.5rem] leading-none text-bodhi-maroon/85">{person.first[0]}</span>
              <Lotus className="mt-2 h-10 w-14" tone="white" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-2 border border-bodhi-ivory/60" style={{ borderRadius: '999px 999px 6px 6px' }} />
        </div>
        {/* draped garland */}
        <Bloom delay={delay + 0.2} className="absolute -left-4 -right-4 -top-3">
          <Garland className="h-12 w-full" sag={40} count={11} />
        </Bloom>
      </div>
      <h3 className="mt-6 font-display text-4xl text-bodhi-maroon">
        {person.first} {person.surname && <span className="text-bodhi-ink/70">{person.surname}</span>}
      </h3>
      <p className="mt-2 inline-flex items-center gap-2 font-mukta text-[15px] font-medium text-bodhi-ink/85">
        {icon === 'nurse' ? (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-bodhi-rose/10">
            <HeartPulse className="h-5 w-5 text-bodhi-rose" strokeWidth={1.6} />
          </span>
        ) : (
          <GearToChakra />
        )}
        <span className={lang === 'mr' ? 'font-marathi' : ''}>{t(person.profession)}</span>
        {person.from && <span className="text-bodhi-ink/55">· {person.from}</span>}
      </p>
      <p className={`mt-2 max-w-[16rem] text-bodhi-ink/70 ${lang === 'mr' ? 'font-marathi text-base' : 'font-display text-lg italic'}`}>{t(person.line)}</p>
    </Reveal>
  )
}

/** Chapter 3 · Two Hearts — the couple in garlanded arches. */
export function Couple() {
  const { lang } = useLang()
  return (
    <Chapter id="couple" className="bg-[linear-gradient(180deg,#fbf5e9_0%,#f8ecd6_100%)]">
      <ChapterHeading accent="मैत्री" number="CHAPTER III" title={lang === 'en' ? 'Two Hearts' : 'दोन हृदये'} subtitle={lang === 'en' ? 'One who cares, one who builds — a shared path ahead.' : 'एक काळजी घेणारी, एक घडवणारा — एकत्र वाटचाल.'} />
      <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-4">
        <Arch person={C.bride} icon="nurse" delay={0} />
        <Bloom delay={0.3} className="flex items-center justify-center md:mt-40">
          <div className="flex items-center gap-2 md:flex-col">
            <span className="h-px w-10 bg-bodhi-gold/60 md:h-10 md:w-px" />
            <BuddhaOnLotus className="h-16 w-14" />
            <span className="h-px w-10 bg-bodhi-gold/60 md:h-10 md:w-px" />
          </div>
        </Bloom>
        <Arch person={C.groom} icon="engineer" delay={0.15} />
      </div>
    </Chapter>
  )
}

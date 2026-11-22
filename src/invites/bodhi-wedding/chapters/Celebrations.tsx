import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Navigation, Shirt } from 'lucide-react'
import { AshokChakra, Diya, Garland, Lotus } from '../art'
import { Bloom, Chapter, ChapterHeading, EASE, Reveal, useLang, useT } from '../ui'
import { bodhiWedding as C, type BodhiEvent } from '../bodhiWedding.config'
import { calendarUrl, dateText, mapsUrl, timeText, toDate, weddingEvent } from '../dates'
import { useCountdown } from '../../../hooks/useCountdown'

/* per-event art direction */
const LOOK: Record<BodhiEvent['id'], { card: string; ink: string; accent: string; chip: string }> = {
  haldi: {
    card: 'bg-[radial-gradient(120%_80%_at_20%_0%,#fff3c4_0%,#fbd877_55%,#f2b941_100%)] border-[#d99a1e]',
    ink: 'text-[#5a3a08]',
    accent: 'text-[#9a5b06]',
    chip: 'bg-[#fff6d6] text-[#7a4a06] border-[#d99a1e]/50',
  },
  wedding: {
    card: 'bg-[radial-gradient(120%_80%_at_50%_0%,#ffffff_0%,#fbf5e9_60%,#f3e6c8_100%)] border-bodhi-gold',
    ink: 'text-bodhi-ink',
    accent: 'text-bodhi-maroon',
    chip: 'bg-bodhi-ivory text-bodhi-maroon border-bodhi-gold/50',
  },
  reception: {
    card: 'bg-[radial-gradient(120%_80%_at_50%_0%,#fde4ea_0%,#f6c9d3_100%)] border-bodhi-rose/60',
    ink: 'text-bodhi-ink',
    accent: 'text-bodhi-rose',
    chip: 'bg-white/70 text-bodhi-rose border-bodhi-rose/40',
  },
  sangeet: {
    card: 'bg-[radial-gradient(120%_80%_at_50%_0%,#e6ecfb_0%,#c9d5f3_100%)] border-bodhi-navy/40',
    ink: 'text-bodhi-ink',
    accent: 'text-bodhi-navy',
    chip: 'bg-white/70 text-bodhi-navy border-bodhi-navy/30',
  },
}

function TurmericSplash() {
  return (
    <svg viewBox="0 0 200 160" className="pointer-events-none absolute -right-10 -top-8 w-56 opacity-40" aria-hidden>
      <path d="M100 20 C140 10 180 40 176 80 C190 110 160 150 120 140 C90 160 40 150 30 116 C6 96 20 50 56 40 C70 24 86 24 100 20Z" fill="#e8a33d" />
      {[
        [30, 30, 6],
        [180, 40, 5],
        [170, 140, 7],
        [20, 140, 4],
        [60, 10, 3],
      ].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#e8a33d" />
      ))}
    </svg>
  )
}

function EventCard({ e, index }: { e: BodhiEvent; index: number }) {
  const t = useT()
  const { lang } = useLang()
  const look = LOOK[e.id]
  const d = toDate(e.start)
  const cal = calendarUrl(e)

  return (
    <Reveal delay={index * 0.1} className="relative">
      <Bloom delay={0.15}>
        <Garland className="relative z-10 mx-auto -mb-4 h-10 w-[88%]" sag={22} count={13} />
      </Bloom>
      <article className={`relative overflow-hidden rounded-[4px] border-2 px-6 pb-8 pt-10 shadow-[0_30px_60px_-40px_rgba(59,36,22,.7)] sm:px-9 ${look.card}`}>
        {e.id === 'haldi' && <TurmericSplash />}
        {e.id === 'wedding' && <AshokChakra className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 opacity-[.07]" spin />}

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className={`font-cinzel text-xs tracking-[0.3em] ${look.accent}`}>{String(index + 1).padStart(2, '0')} · {lang === 'en' ? 'CELEBRATION' : 'सोहळा'}</p>
            <h3 className={`mt-2 text-[2.6rem] leading-none ${lang === 'mr' ? 'font-marathi' : 'font-display'} ${look.ink}`}>{t(e.name)}</h3>
            {lang === 'en' && <p className={`mt-1 font-marathi text-lg ${look.accent}`}>{e.name.mr}</p>}
          </div>
          {e.id === 'wedding' ? <Lotus className="h-12 w-16 shrink-0" /> : <Diya className="h-14 w-14 shrink-0" />}
        </div>

        <p className={`relative mt-4 font-mukta text-[15px] leading-relaxed ${look.ink} opacity-80`}>{t(e.description)}</p>

        <dl className={`relative mt-6 grid grid-cols-[4.5rem_1fr] gap-y-2.5 font-mukta text-[15px] ${look.ink}`}>
          <dt className="font-cinzel text-xs tracking-[0.2em] opacity-60">{lang === 'en' ? 'DATE' : 'तारीख'}</dt>
          <dd className="font-medium">{dateText(d, lang)}</dd>
          <dt className="font-cinzel text-xs tracking-[0.2em] opacity-60">{lang === 'en' ? 'TIME' : 'वेळ'}</dt>
          <dd className="font-medium">{timeText(d, lang)}</dd>
          <dt className="font-cinzel text-xs tracking-[0.2em] opacity-60">{lang === 'en' ? 'VENUE' : 'स्थळ'}</dt>
          <dd>
            {e.venue}
            {e.address && <span className="block opacity-70">{t(e.address)}</span>}
          </dd>
        </dl>

        <p className={`relative mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mukta text-[13px] ${look.chip}`}>
          <Shirt className="h-3.5 w-3.5" /> {lang === 'en' ? 'Dress code' : 'पोशाख'} · {t(e.dressCode)}
        </p>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          {cal ? (
            <a href={cal} target="_blank" rel="noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-bodhi-maroon px-4 font-mukta text-sm font-medium text-bodhi-ivory transition hover:bg-[#61161f] active:scale-[.98]">
              <CalendarPlus className="h-4 w-4" /> {lang === 'en' ? 'Add to Calendar' : 'कॅलेंडरमध्ये जोडा'}
            </a>
          ) : (
            <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-dashed border-current/30 px-3 text-center font-mukta text-[13px] opacity-60" title="Available once the date is announced">
              <CalendarPlus className="h-4 w-4" /> Calendar soon
            </span>
          )}
          <a href={mapsUrl(e)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-bodhi-maroon/40 bg-white/50 px-4 font-mukta text-sm font-medium text-bodhi-maroon transition hover:bg-white active:scale-[.98]">
            <Navigation className="h-4 w-4" /> {lang === 'en' ? 'Directions' : 'मार्ग'}
          </a>
        </div>
      </article>
    </Reveal>
  )
}

/** Chapter 5 · Celebrations */
export function Celebrations() {
  const { lang } = useLang()
  return (
    <Chapter id="celebrations" className="bg-[linear-gradient(180deg,#f8ecd6_0%,#fbf5e9_100%)]">
      <ChapterHeading accent="उत्सव" number="CHAPTER V" title={lang === 'en' ? 'Celebrations' : 'सोहळे'} subtitle={lang === 'en' ? 'Two days of colour, calm and blessings.' : 'रंग, शांतता आणि आशीर्वादांचे सोहळे.'} />
      <div className="mx-auto mt-12 grid max-w-4xl gap-12 md:grid-cols-2 md:gap-8">
        {C.events.map((e, i) => (
          <EventCard key={e.id} e={e} index={i} />
        ))}
      </div>
    </Chapter>
  )
}

/** Chapter 6 · पंचशील — five lotus diyas, five vows. */
export function Precepts() {
  const { lang } = useLang()
  const t = useT()
  const [lit, setLit] = useState<number[]>([])
  const [active, setActive] = useState<number | null>(null)
  const choose = (i: number) => {
    setActive(i)
    setLit((l) => (l.includes(i) ? l : [...l, i]))
  }
  const p = active !== null ? C.precepts[active] : null

  return (
    <Chapter id="panchsheel" className="bg-[radial-gradient(110%_70%_at_50%_0%,#3a1a24_0%,#24101a_70%)] text-bodhi-ivory">
      <ChapterHeading light accent="पंचशील" number="CHAPTER VI" title={lang === 'en' ? 'Panchsheel — Five Precepts' : 'पंचशील — पाच शील'} subtitle={lang === 'en' ? 'Five precepts, read as vows for a shared life. Tap a lamp to light it.' : 'सहजीवनासाठी पाच शील. दिवा उजळण्यासाठी स्पर्श करा.'} />

      <div className="mx-auto mt-12 flex max-w-xl items-end justify-center gap-1.5 sm:gap-5">
        {C.precepts.map((pr, i) => {
          const on = lit.includes(i)
          return (
            <button
              key={pr.pali}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={active === i}
              aria-label={`${pr.title.en} — light this lamp`}
              className={`group flex w-[18%] max-w-[88px] flex-col items-center rounded-2xl pb-2 pt-1 transition focus-visible:outline-2 focus-visible:outline-bodhi-saffron ${active === i ? 'bg-white/5' : ''}`}
            >
              <motion.span animate={{ y: active === i ? -6 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="relative block w-full">
                <Diya className={`w-full transition-opacity duration-700 ${on ? '' : 'opacity-60'}`} lit={on} />
                <Lotus className="-mt-3 w-full" tone={on ? 'pink' : 'white'} />
              </motion.span>
              <span className={`mt-1 font-marathi text-[13px] transition-colors ${on ? 'text-bodhi-saffron' : 'text-bodhi-ivory/50'}`}>{pr.word}</span>
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-8 min-h-[7.5rem] max-w-md text-center">
        <AnimatePresence mode="wait">
          {p ? (
            <motion.div key={p.pali + lang} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5 }}>
              <p className="font-display text-base italic text-bodhi-ivory/60">{p.pali}</p>
              <p className={`mt-2 text-bodhi-saffron ${lang === 'en' ? 'font-cinzel text-xs uppercase tracking-[0.35em]' : 'font-marathi text-lg'}`}>{t(p.title)}</p>
              <p className={`mt-3 leading-snug text-bodhi-ivory ${lang === 'en' ? 'font-display text-2xl italic' : 'font-marathi text-xl'}`}>{t(p.meaning)}</p>
              {lang === 'en' && <p className="mt-2 font-marathi text-[15px] text-bodhi-ivory/55">{p.meaning.mr}</p>}
            </motion.div>
          ) : (
            <motion.p key="hint" exit={{ opacity: 0 }} className="font-display text-xl italic text-bodhi-ivory/50">
              {lang === 'en' ? 'Five small lights, one shared path.' : 'पाच छोटे दिवे, एक सामायिक मार्ग.'}
            </motion.p>
          )}
        </AnimatePresence>
        {lit.length === 5 && <p className="mt-4 font-mukta text-sm text-bodhi-sprout">{lang === 'en' ? 'All five lamps are lit — may they guide the path ahead.' : 'पाचही दिवे उजळले — ते पुढील वाटचालीस प्रकाश देवोत.'}</p>}
      </div>
    </Chapter>
  )
}

/** Chapter 7 · Countdown — four lotus petals around a turning chakra. */
export function Countdown({ target }: { target: Date | null }) {
  const { lang } = useLang()
  const c = useCountdown(target ?? new Date(8.64e15))
  const values = target
    ? [
        [lang === 'en' ? 'Days' : 'दिवस', c.days],
        [lang === 'en' ? 'Hours' : 'तास', c.hours],
        [lang === 'en' ? 'Minutes' : 'मिनिटे', c.minutes],
        [lang === 'en' ? 'Seconds' : 'सेकंद', c.seconds],
      ]
    : [
        ['Days', '—'],
        ['Hours', '—'],
        ['Minutes', '—'],
        ['Seconds', '—'],
      ]
  const pos = ['left-1/2 top-0 -translate-x-1/2', 'right-0 top-1/2 -translate-y-1/2', 'left-1/2 bottom-0 -translate-x-1/2', 'left-0 top-1/2 -translate-y-1/2']
  const rot = [0, 90, 180, 270]

  return (
    <Chapter id="countdown" className="bodhi-parchment">
      <ChapterHeading
        accent="प्रतीक्षा"
        number="CHAPTER VII"
        title={lang === 'en' ? (target && c.isPast ? 'Married, with blessings' : 'Counting the Moments') : 'क्षणांची मोजणी'}
        subtitle={!target ? (lang === 'en' ? 'The muhurat will be announced soon.' : 'मुहूर्त लवकरच कळवला जाईल.') : undefined}
      />
      <Bloom className="relative mx-auto mt-12 aspect-square w-[min(88vw,380px)]">
        <div className="absolute inset-[31%]">
          <div className="bodhi-glow absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgba(232,163,61,.35),transparent_70%)]" />
          <AshokChakra className="relative h-full w-full" spin />
        </div>
        {values.map(([label, v], i) => (
          <div key={i} className={`absolute ${pos[i]} h-[37%] w-[37%]`}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ transform: `rotate(${rot[i]}deg)` }} aria-hidden>
              <path d="M50 96 C20 74 14 40 50 4 C86 40 80 74 50 96Z" fill="#f8d3dc" stroke="#d9718c" strokeWidth="1.2" />
              <path d="M50 90 C34 70 32 44 50 16" fill="none" stroke="#e9a7b6" strokeWidth="1" />
            </svg>
            <div className="relative flex h-full flex-col items-center justify-center">
              <span className="font-display text-[clamp(1.6rem,8vw,2.4rem)] leading-none font-semibold tabular-nums text-bodhi-maroon">
                {typeof v === 'number' ? String(v).padStart(2, '0') : v}
              </span>
              <span className="mt-0.5 font-cinzel text-[11px] tracking-[0.15em] text-bodhi-ink/70 sm:text-[11px]"><span className="sm:hidden">{lang === 'en' ? ({ Days: 'DAYS', Hours: 'HRS', Minutes: 'MIN', Seconds: 'SEC' } as Record<string, string>)[label as string] : label}</span><span className="hidden sm:inline">{lang === 'en' ? (label as string).toUpperCase() : label}</span></span>
            </div>
          </div>
        ))}
      </Bloom>
      <p className="mt-8 text-center font-mukta text-[15px] text-bodhi-ink/70">{weddingEvent().venue} · {dateText(target, lang)}{target && ` · ${timeText(target, lang)}`}</p>
    </Chapter>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Navigation, Phone, X } from 'lucide-react'
import { AshokChakra, Lotus, Mandala, PIPAL_PATH, Stupa } from '../art'
import { Chapter, ChapterHeading, EASE, Reveal, useLang, useT } from '../ui'
import { bodhiWedding as C, type BodhiEvent } from '../bodhiWedding.config'
import { dateText, embedUrl, mapsUrl, shortDate, timeText, toDate } from '../dates'

/**
 * Two trees whose crowns lean in and overlap above, just as their roots
 * intertwine beneath the soil.
 */
const CROWN_GREENS = ['#5e8c3a', '#86b157', '#4d7a2f', '#9cc46b', '#6f9c45']

function crown(cx: number, cy: number, seed: number, n = 92) {
  // golden-angle (sunflower) spread gives an even, full, rounded crown
  return Array.from({ length: n }).map((_, i) => {
    const a = i * 2.39996 + seed
    const r = 50 * Math.sqrt((i + 0.5) / n)
    return {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.86,
      rot: ((a * 180) / Math.PI) % 360,
      c: i % 23 === 7 ? '#c9a227' : CROWN_GREENS[(i + Math.round(seed * 10)) % CROWN_GREENS.length],
    }
  })
}

function TwinTrees() {
  // render both crowns interleaved by height so the leaves mingle where they meet
  const leaves = [...crown(80, 52, 0), ...crown(160, 52, 0.7)].sort((a, b) => a.y - b.y)
  return (
    <svg viewBox="0 0 240 170" className="mx-auto w-[min(92vw,460px)]" aria-hidden>
      <defs>
        <path id="tw-leaf" d={PIPAL_PATH} transform="scale(.15) translate(-50 -60)" />
      </defs>
      <rect x="0" y="112" width="240" height="58" fill="#e9d9b8" opacity=".5" />
      <path d="M0 112 H240" stroke="#c9a227" strokeWidth=".8" />
      {/* trunks lean toward each other, with branches reaching into the shared crown */}
      <path d="M66 112 C64 96 70 82 80 62" stroke="#6b4a2c" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <path d="M174 112 C176 96 170 82 160 62" stroke="#6b4a2c" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <g stroke="#6b4a2c" strokeWidth="2.6" fill="none" strokeLinecap="round">
        <path d="M76 70 C92 58 106 52 122 48" />
        <path d="M164 70 C148 58 134 52 118 48" />
        <path d="M74 74 C62 62 52 56 40 52" />
        <path d="M166 74 C178 62 188 56 200 52" />
        <path d="M80 64 C80 50 84 38 92 28" />
        <path d="M160 64 C160 50 156 38 148 28" />
      </g>
      <g stroke="#8a6440" strokeWidth="2.2" fill="none" strokeLinecap="round">
        {[
          'M66 112 C80 128 110 120 132 140 C146 152 160 150 172 158',
          'M174 112 C160 128 130 120 108 140 C94 152 80 150 68 158',
          'M66 114 C56 128 40 132 26 146',
          'M174 114 C184 128 200 132 214 146',
          'M120 132 C120 142 118 150 120 162',
        ].map((d, i) => (
          <motion.path key={i} d={d} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.2 + i * 0.15, ease: [0.65, 0, 0.35, 1] }} />
        ))}
      </g>
      {leaves.map((l, i) => (
        <use key={i} href="#tw-leaf" fill={l.c} opacity=".95" transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(0)})`} />
      ))}
      <circle cx="120" cy="140" r="3" fill="#c9a227" />
    </svg>
  )
}

/** Chapter 8 · Two Families */
export function Families() {
  const { lang } = useLang()
  const t = useT()
  const sides = [
    { f: C.families.bride, person: C.bride },
    { f: C.families.groom, person: C.groom },
  ]
  return (
    <Chapter id="families" className="bg-[linear-gradient(180deg,#fbf5e9_0%,#f4ead3_100%)]">
      <ChapterHeading accent="कुटुंब" number="CHAPTER VIII" title={lang === 'en' ? 'Two Families, One Root' : 'दोन कुटुंबे, एक मूळ'} />
      <Reveal className="mt-10">
        <TwinTrees />
      </Reveal>
      <div className="mx-auto mt-6 grid max-w-3xl gap-10 text-center sm:grid-cols-2">
        {sides.map(({ f, person }, i) => (
          <Reveal key={f.surname} delay={i * 0.12}>
            <p className={`text-bodhi-gold-deep ${lang === 'en' ? 'font-cinzel text-xs uppercase tracking-[0.3em]' : 'font-marathi text-base'}`}>{t(f.title)}</p>
            <p className="mt-2 font-display text-3xl text-bodhi-maroon">
              {person.first} {person.surname}
            </p>
            <p className={`mt-2 text-[15px] text-bodhi-ink/75 ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>
              {lang === 'en' ? (
                <>
                  {f.relation.en} {f.parents.en}
                </>
              ) : (
                <>
                  {f.parents.mr} {f.relation.mr}
                </>
              )}
            </p>
            <p className={`mt-2 text-bodhi-maroon ${lang === 'en' ? 'font-cinzel text-[12px] uppercase tracking-[0.22em]' : 'font-marathi text-[15px]'}`}>{t(f.familyLine)}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2} className="mx-auto mt-12 max-w-md text-center">
        <p className={`text-bodhi-ink/75 ${lang === 'en' ? 'font-display text-xl italic' : 'font-marathi text-lg'}`}>{t(C.families.blessing)}</p>
      </Reveal>
    </Chapter>
  )
}

/* ───────────────────────── Venue envelopes ───────────────────────── */

const MOTION = 'motion-safe:transition-[translate,scale,transform,opacity] motion-reduce:transition-opacity motion-reduce:translate-none motion-reduce:scale-100'

/**
 * A wax-sealed envelope for one venue. Closed: event name + date.
 * Open: the flap folds back, the envelope sinks away and the card rises with
 * date, time, address, map and directions. Transforms and opacity only — the
 * stage has a fixed height, so nothing around it shifts.
 */
function VenueEnvelope({ ev, open, onToggle }: { ev: BodhiEvent; open: boolean; onToggle: () => void }) {
  const { lang } = useLang()
  const t = useT()
  const d = toDate(ev.start)
  const cardId = `venue-card-${ev.id}`
  // already open when mounted (tab switch) → show the map right away
  const [mapOn, setMapOn] = useState(open)

  // mount the map after the card has risen (keeps the animation smooth)
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => setMapOn(true), 700)
    return () => window.clearTimeout(id)
  }, [open])

  return (
    <div className="relative mx-auto h-[620px] w-full max-w-xl sm:h-[600px]" style={{ perspective: 1400 }}>
      {/* the card that rises out */}
      <div
        id={cardId}
        role="region"
        aria-label={`${ev.name.en} venue details`}
        aria-hidden={!open}
        inert={!open}
        className={`bodhi-parchment absolute inset-0 flex flex-col overflow-hidden rounded-[4px] border-2 border-bodhi-gold/70 px-5 pb-5 pt-6 shadow-[0_30px_60px_-30px_rgba(59,36,22,.7)] duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)] sm:px-7 ${MOTION} ${
          open ? 'translate-y-0 scale-100 opacity-100 delay-[280ms]' : 'pointer-events-none translate-y-[28%] scale-[.86] opacity-0 delay-0'
        }`}
      >
        <div className="pointer-events-none absolute inset-1.5 rounded-[3px] border border-bodhi-gold/30" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="font-cinzel text-xs tracking-[0.3em] text-bodhi-gold-deep">{ev.id === 'haldi' ? 'हळद · HALDI' : 'शुभविवाह · WEDDING'}</p>
            <h3 className="mt-1 font-display text-[1.9rem] leading-tight text-bodhi-maroon">{ev.venue}</h3>
          </div>
          <button type="button" onClick={onToggle} aria-label="Close envelope" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-bodhi-ink/60 hover:bg-bodhi-gold/15">
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className={`relative mt-3 grid grid-cols-[4.8rem_1fr] gap-y-1.5 text-[15px] text-bodhi-ink ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>
          <dt className="font-cinzel text-xs tracking-[0.2em] text-bodhi-ink/55">{lang === 'en' ? 'DATE' : 'तारीख'}</dt>
          <dd className="font-medium">{dateText(d, lang)}</dd>
          <dt className="font-cinzel text-xs tracking-[0.2em] text-bodhi-ink/55">{lang === 'en' ? 'TIME' : 'वेळ'}</dt>
          <dd className="font-medium">{timeText(d, lang)}</dd>
          <dt className="font-cinzel text-xs tracking-[0.2em] text-bodhi-ink/55">{lang === 'en' ? 'ADDRESS' : 'पत्ता'}</dt>
          <dd>{ev.address ? t(ev.address) : ev.venue}</dd>
        </dl>

        <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-[3px] border border-bodhi-gold/50 bg-bodhi-parchment">
          {mapOn ? (
            <iframe title={`Map of ${ev.venue}`} src={embedUrl(ev.mapQuery)} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <div className="grid h-full place-items-center">
              <AshokChakra className="h-10 w-10 opacity-40" spin />
            </div>
          )}
        </div>

        <a
          href={mapsUrl(ev)}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-4 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-bodhi-maroon px-6 font-mukta font-medium text-bodhi-ivory transition hover:bg-[#61161f] active:scale-[.98]"
        >
          <Navigation className="h-4 w-4" /> {lang === 'en' ? 'Get Directions' : 'मार्ग पहा'}
        </a>
      </div>

      {/* the envelope */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={cardId}
          aria-label={`${open ? 'Close' : 'Open'} the ${ev.name.en} envelope`}
          tabIndex={open ? -1 : 0}
          className={`group relative mx-auto block aspect-[1.5/1] w-[min(88vw,430px)] duration-[700ms] ease-[cubic-bezier(.65,0,.35,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bodhi-maroon ${MOTION} ${
            open ? 'pointer-events-none translate-y-[55%] scale-95 opacity-0 delay-[200ms]' : 'translate-y-0 scale-100 opacity-100 delay-[150ms] hover:-translate-y-1'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="absolute inset-0 rounded-[6px] bg-[#e8d7b4] shadow-[0_26px_50px_-24px_rgba(59,36,22,.75)]" />
          {/* front pocket */}
          <span className="absolute inset-0 z-20 overflow-hidden rounded-[6px] bg-[#f5ead2]" style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}>
            <svg viewBox="0 0 100 66" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M0 0 L50 36.3 L100 0" fill="none" stroke="#c9a227" strokeWidth=".5" />
              <rect x="1.5" y="1.5" width="97" height="63" fill="none" stroke="#c9a227" strokeWidth=".4" />
            </svg>
            <Mandala className="absolute -bottom-16 -left-10 w-40 text-bodhi-gold/15" />
            <span className="absolute inset-x-0 bottom-[10%] flex flex-col items-center">
              <span className="font-display text-[1.9rem] leading-none text-bodhi-maroon">
                {ev.name.en} <span className="font-marathi text-[1.4rem] text-bodhi-gold-deep">· {ev.name.mr}</span>
              </span>
              <span className="mt-1.5 font-cinzel text-xs tracking-[0.25em] text-bodhi-ink/70">{d ? shortDate(d, lang).toUpperCase() : lang === 'en' ? 'DATE TO BE ANNOUNCED' : 'तारीख लवकरच'}</span>
            </span>
          </span>
          {/* flap */}
          <span
            className={`absolute inset-x-0 top-0 z-30 h-[56%] origin-top duration-[600ms] ease-[cubic-bezier(.65,0,.35,1)] ${MOTION} ${open ? '[transform:rotateX(180deg)]' : '[transform:rotateX(0deg)]'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="absolute inset-0 bg-[#efe1c3] [backface-visibility:hidden]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
            <span className="absolute inset-0 bg-bodhi-maroon [backface-visibility:hidden] [transform:rotateX(180deg)]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          </span>
          {/* wax seal */}
          <span
            className={`absolute left-1/2 top-[56%] z-40 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_40%_35%,#c2263a,#7a1f2b_70%,#5e0f19)] shadow-[0_6px_10px_-4px_rgba(60,10,15,.6)] duration-500 ${MOTION} ${
              open ? 'scale-50 opacity-0' : 'scale-100 opacity-100 group-hover:scale-105'
            }`}
          >
            <Lotus className="h-7 w-9" tone="gold" />
          </span>
        </button>
        <p className={`mt-6 text-center font-mukta text-sm text-bodhi-ink/60 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}>
          {lang === 'en' ? 'Tap the envelope to open' : 'उघडण्यासाठी पाकिटावर स्पर्श करा'}
        </p>
      </div>
    </div>
  )
}

/** Chapter 9 · Venue & Map — Haldi first, then the wedding. */
export function Venue() {
  const { lang } = useLang()
  const t = useT()
  const events = C.events
  const [tab, setTab] = useState<BodhiEvent['id']>(events[0].id)
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const ev = events.find((e) => e.id === tab)!

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Switching tabs keeps the envelope as it is: if it's open, the other venue's card
  // simply takes its place (no closing / re-opening); if it's closed, it stays closed.
  const choose = (id: BodhiEvent['id']) => {
    window.clearTimeout(timer.current)
    setTab(id)
  }

  return (
    <Chapter id="venue" className="bodhi-parchment">
      <ChapterHeading accent="स्थळ" number="CHAPTER IX" title={lang === 'en' ? 'Finding Your Way' : 'स्थळ आणि नकाशा'} />
      <Stupa className="pointer-events-none mx-auto -mb-2 mt-8 w-36 opacity-80" />

      <div className="mx-auto max-w-xl">
        <div role="tablist" aria-label="Venue" className="mx-auto mb-6 flex w-fit rounded-full border border-bodhi-gold/50 bg-bodhi-ivory p-1">
          {events.map((e) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={tab === e.id}
              aria-controls={`venue-card-${e.id}`}
              onClick={() => choose(e.id)}
              className={`relative min-h-[44px] rounded-full px-5 text-sm font-medium transition ${tab === e.id ? 'text-bodhi-ivory' : 'text-bodhi-ink/70'} ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}
            >
              {tab === e.id && <motion.span layoutId="venue-tab" className="absolute inset-0 rounded-full bg-bodhi-maroon" transition={{ duration: 0.4, ease: EASE }} />}
              <span className="relative">{t(e.name)}</span>
            </button>
          ))}
        </div>

        <motion.div key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <VenueEnvelope ev={ev} open={open} onToggle={() => setOpen((v) => !v)} />
        </motion.div>

        {(C.venueNotes.parking || C.venueNotes.contact) && (
          <ul className="mt-6 grid gap-3 font-mukta text-[15px] text-bodhi-ink/80 sm:grid-cols-2">
            {C.venueNotes.parking && (
              <li className="flex items-start gap-2">
                <Car className="mt-0.5 h-4 w-4 text-bodhi-gold-deep" /> {t(C.venueNotes.parking)}
              </li>
            )}
            {C.venueNotes.contact && (
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-bodhi-gold-deep" /> {t(C.venueNotes.contact)}
              </li>
            )}
          </ul>
        )}
      </div>
    </Chapter>
  )
}

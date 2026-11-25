import { DESIGNER } from '../../../lib/credits'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Minus, Navigation, Plus, Send, Share2 } from 'lucide-react'
import { MapArt, Medallion, RoseImg } from '../art'
import { BlurIn, EASE, Flourish, Section, SectionTitle, useSeen } from '../ui'
import { royalRose as R, W } from '../royalRose.config'
import { useLang, useT } from '../../bodhi-wedding/ui'
import { calendarUrl, dateText, mapsUrl, timeText, toDate, weddingEvent } from '../../bodhi-wedding/dates'
import { rsvpLink } from '../../bodhi-wedding/chapters/Rsvp'
import type { BodhiEvent } from '../../bodhi-wedding/bodhiWedding.config'

/* ───────── Grand Celebration — deep wine card ───────── */
export function Grand() {
  const t = useT()
  const { lang } = useLang()
  const ev = weddingEvent()
  const d = toDate(ev.start)
  const cal = calendarUrl(ev)
  const [ref, seen] = useSeen<HTMLDivElement>(0.35)
  const sparkles = [
    [12, 18],
    [84, 12],
    [70, 40],
    [18, 62],
    [88, 74],
    [40, 88],
    [56, 22],
  ]
  return (
    <Section id="grand" className="py-16">
      <div ref={ref} className="rr-velvet relative mx-auto max-w-md overflow-hidden rounded-[26px] px-5 py-14 sm:px-7 text-center shadow-[0_40px_70px_-35px_rgba(74,18,32,.9)]">
        <div className="pointer-events-none absolute inset-3 rounded-[20px] border border-[#c6a15b]/70" />
        <div className="pointer-events-none absolute inset-[18px] rounded-[16px] border border-[#c6a15b]/30" />
        {sparkles.map(([x, y], i) => (
          <span key={i} className="rr-twinkle absolute h-2 w-2 rotate-45 bg-[#f2dfa8]" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.37}s` }} />
        ))}
        {/* flowers blooming in two corners */}
        <motion.div className="absolute -left-8 -top-8 w-32 origin-top-left" initial={{ scale: 0, rotate: -30 }} animate={seen ? { scale: 1, rotate: 0 } : {}} transition={{ duration: 1.4, ease: EASE }}>
          <RoseImg tone="blush" className="w-full" />
        </motion.div>
        <motion.div className="absolute -bottom-8 -right-8 w-32 origin-bottom-right" initial={{ scale: 0, rotate: 30 }} animate={seen ? { scale: 1, rotate: 0 } : {}} transition={{ duration: 1.4, delay: 0.25, ease: EASE }}>
          <RoseImg tone="ivory" className="w-full" />
        </motion.div>

        <div className="relative">
          <p className="font-marathi text-lg text-[#e9d3a0]">{ev.name.mr}</p>
          <BlurIn as="h2" className="mt-1 font-playfair text-[clamp(1.75rem,9vw,2.3rem)] leading-tight italic rr-gold-text text-balance">
            {t(R.copy.grand)}
          </BlurIn>
          <Flourish className="mx-auto mt-3 h-4 w-36 text-[#d8bb7a]" />
          <p className="mt-6 font-playfair text-[clamp(1.5rem,8vw,1.9rem)] leading-tight text-[#fdf1dc]">
            {W.groom.first} <span className="text-[#d8bb7a]">&amp;</span> {W.bride.first}
          </p>
          <div className={`mt-6 space-y-1.5 text-[15px] text-[#f3e3c8] ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>
            <p className="font-medium">{dateText(d, lang)}</p>
            <p>{timeText(d, lang)}</p>
            <p className="text-[#e9d3a0]">{ev.venue}</p>
          </div>
          <p className={`mx-auto mt-6 max-w-[16rem] text-[13px] text-[#f3e3c8]/80 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>
            {lang === 'en' ? 'Dress code' : 'पोशाख'} · {t(ev.dressCode)}
          </p>
          <p className="mt-6 font-playfair text-base italic text-[#e9d3a0]">{W.blessings[0].pali}</p>
          <p className={`text-[13px] text-[#f3e3c8]/75 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>{W.blessings[0][lang]}</p>
          {cal && (
            <a
              href={cal}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[linear-gradient(105deg,#9a7637,#f2dfa8_45%,#c6a15b)] px-6 font-montserrat text-sm font-semibold text-rr-wine-deep shadow-[0_10px_24px_-12px_rgba(0,0,0,.6)] transition active:scale-[.98]"
            >
              {lang === 'en' ? 'Add to calendar' : 'कॅलेंडरमध्ये जोडा'}
            </a>
          )}
        </div>
      </div>
    </Section>
  )
}

/* ───────── Location — illustrated map ───────── */
export function Location() {
  const t = useT()
  const { lang } = useLang()
  const order: BodhiEvent['id'][] = ['wedding', 'haldi']
  const venues = order.map((id) => W.events.find((e) => e.id === id)).filter(Boolean) as BodhiEvent[]
  const [id, setId] = useState(venues[0].id)
  const [copied, setCopied] = useState(false)
  const ev = venues.find((v) => v.id === id)!
  const address = ev.address ? t(ev.address) : ev.venue

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ev.address ? ev.address.en : ev.venue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Section id="location" className="py-16">
      <SectionTitle eyebrow={lang === 'en' ? 'Find your way' : 'मार्ग शोधा'} title={t(R.copy.location)} />
      <div className="mx-auto mt-8 max-w-md">
        <div className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-rr-gold/50 bg-rr-ivory p-1" role="tablist" aria-label="Venue">
          {venues.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={id === v.id}
              onClick={() => setId(v.id)}
              className={`relative min-h-[42px] rounded-full px-5 font-montserrat text-sm font-medium transition ${id === v.id ? 'text-rr-ivory' : 'text-rr-wine/70'}`}
            >
              {id === v.id && <motion.span layoutId="rr-venue" className="absolute inset-0 rounded-full bg-rr-wine" transition={{ duration: 0.4, ease: EASE }} />}
              <span className="relative">{v.name.en}</span>
            </button>
          ))}
        </div>

        <a
          href={mapsUrl(ev)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${ev.venue} in Google Maps`}
          className="group relative block overflow-hidden rounded-[22px] border border-rr-gold/60 shadow-[0_30px_50px_-30px_rgba(110,31,47,.7)]"
        >
          <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <MapArt label={ev.venue} className="block h-auto w-full" />
            </motion.div>
          </AnimatePresence>
          {/* pin at the end of the route */}
          <span className="absolute left-[73.75%] top-[26.4%] h-12 w-12 rounded-full border-2 border-rr-wine/50" style={{ animation: 'rr-pulse 1.8s ease-out infinite' }} />
          <svg viewBox="0 0 32 42" className="rr-bob absolute left-[73.75%] top-[26.4%] h-11 w-8 -translate-x-1/2 -translate-y-full drop-shadow-[0_6px_6px_rgba(74,18,32,.4)]" aria-hidden>
            <path d="M16 41 C16 41 2 24 2 15 C2 7 8 1 16 1 C24 1 30 7 30 15 C30 24 16 41 16 41Z" fill="#6e1f2f" />
            <circle cx="16" cy="15" r="6" fill="#f2dfa8" />
          </svg>
          </div>
          <div className="relative border-t border-rr-gold/40 bg-rr-ivory px-4 py-3 text-left">
            <p className="font-playfair text-lg leading-tight text-rr-wine">{ev.venue}</p>
            <p className={`text-[13px] text-rr-ink/70 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>{address}</p>
          </div>
        </a>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={mapsUrl(ev)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-rr-wine font-montserrat text-sm font-medium text-rr-ivory shadow-[0_12px_24px_-14px_rgba(110,31,47,.9)] transition active:scale-[.98]"
          >
            <Navigation className="h-4 w-4" /> {lang === 'en' ? 'Get directions' : 'मार्ग पहा'}
          </a>
          <button
            type="button"
            onClick={() => void copy()}
            aria-live="polite"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-rr-wine/40 bg-rr-ivory font-montserrat text-sm font-medium text-rr-wine transition active:scale-[.98]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? (lang === 'en' ? 'Copied' : 'कॉपी झाले') : lang === 'en' ? 'Copy address' : 'पत्ता कॉपी करा'}
          </button>
        </div>
        {W.venueNotes.contact && <p className={`mt-4 text-center text-[13px] text-rr-ink/65 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>{t(W.venueNotes.contact)}</p>}
      </div>
    </Section>
  )
}

/* ───────── Closing + RSVP ───────── */
export function Closing() {
  const t = useT()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('')
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!name.trim()) return setError(lang === 'en' ? 'Please enter your name.' : 'कृपया आपले नाव लिहा.')
    if (!attending) return setError(lang === 'en' ? 'Please choose if you can come.' : 'आपण येणार का ते निवडा.')
    setError('')
    window.open(rsvpLink({ name, phone: '', attending, guests, events: W.events.map((e) => e.id), message: '' }), '_blank', 'noopener')
    setSent(true)
  }

  const share = async () => {
    const url = window.location.href.split('?')[0]
    const text = `${W.groom.first} & ${W.bride.first} — wedding invitation`
    try {
      if (navigator.share) await navigator.share({ title: text, url })
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener')
    } catch {
      /* cancelled */
    }
  }

  return (
    <Section id="closing" className="pb-28 pt-16 text-center">
      <BlurIn>
        <Medallion className="mx-auto h-20 w-20" />
      </BlurIn>
      <BlurIn as="h2" delay={0.1} className={`mx-auto mt-6 max-w-sm leading-tight text-rr-wine ${lang === 'mr' ? 'font-marathi text-3xl' : 'font-playfair text-[2.3rem] italic'}`}>
        {t(R.copy.closing)}
      </BlurIn>
      <Flourish className="mx-auto mt-4 h-4 w-40 text-rr-gold" />
      <BlurIn as="p" delay={0.2} className={`mt-4 text-rr-ink/75 ${lang === 'mr' ? 'font-marathi text-lg' : 'font-montserrat text-[15px]'}`}>
        {t(R.copy.families)}
      </BlurIn>
      <BlurIn as="p" delay={0.3} className="mt-3 font-playfair text-3xl text-rr-wine">
        {W.groom.first} <span className="text-rr-gold">&amp;</span> {W.bride.first}
      </BlurIn>

      {/* RSVP */}
      <BlurIn delay={0.2} className="mx-auto mt-12 max-w-sm rounded-[22px] border border-rr-gold/60 bg-rr-ivory/90 px-6 py-7 text-left shadow-[0_30px_50px_-34px_rgba(110,31,47,.7)]">
        <p className="text-center font-montserrat text-xs font-medium uppercase tracking-[0.28em] text-rr-gold-deep">RSVP</p>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 text-center">
              <p className="font-playfair text-2xl italic text-rr-wine">{lang === 'en' ? `Thank you, ${name.trim().split(' ')[0]}!` : `धन्यवाद, ${name.trim().split(' ')[0]}!`}</p>
              <p className={`mt-2 text-[13px] text-rr-ink/70 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>
                {lang === 'en' ? 'Your message is ready in WhatsApp — just press send.' : 'आपला संदेश WhatsApp मध्ये तयार आहे — फक्त पाठवा दाबा.'}
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-3 min-h-[44px] font-montserrat text-sm text-rr-wine underline underline-offset-4">
                {lang === 'en' ? 'Edit reply' : 'प्रतिसाद बदला'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'en' ? 'Your name' : 'आपले नाव'}
                autoComplete="name"
                aria-label="Your name"
                className="mt-4 w-full rounded-xl border border-rr-gold/50 bg-white/80 px-4 py-3.5 font-montserrat text-base text-rr-ink outline-none focus:border-rr-wine focus:ring-2 focus:ring-rr-gold/30"
              />
              <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Attending">
                {(
                  [
                    ['yes', lang === 'en' ? 'Joyfully yes' : 'होय, नक्की'],
                    ['no', lang === 'en' ? 'Sadly no' : 'खेदपूर्वक नाही'],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={attending === v}
                    onClick={() => setAttending(v)}
                    className={`min-h-[48px] rounded-xl border font-montserrat text-sm transition ${attending === v ? 'border-rr-wine bg-rr-wine text-rr-ivory' : 'border-rr-gold/50 text-rr-wine'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {attending === 'yes' && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-rr-gold/40 px-3 py-1.5">
                  <span className="font-montserrat text-sm text-rr-ink/75">{lang === 'en' ? 'Guests (incl. you)' : 'पाहुणे'}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Fewer guests" disabled={guests <= 1} onClick={() => setGuests(guests - 1)} className="grid h-11 w-11 place-items-center rounded-full text-rr-wine disabled:opacity-30">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-playfair text-xl tabular-nums text-rr-wine">{guests}</span>
                    <button type="button" aria-label="More guests" disabled={guests >= W.rsvp.maxGuests} onClick={() => setGuests(guests + 1)} className="grid h-11 w-11 place-items-center rounded-full text-rr-wine disabled:opacity-30">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="mt-2 font-montserrat text-sm text-rr-rose">{error}</p>}
              <button
                type="button"
                onClick={send}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-rr-wine font-montserrat text-sm font-semibold text-rr-ivory shadow-[0_12px_24px_-14px_rgba(110,31,47,.9)] transition active:scale-[.98]"
              >
                <Send className="h-4 w-4" /> {lang === 'en' ? 'Send RSVP on WhatsApp' : 'WhatsApp वर कळवा'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </BlurIn>

      <button type="button" onClick={() => void share()} className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-montserrat text-sm font-medium text-rr-wine">
        <Share2 className="h-4 w-4" /> {lang === 'en' ? 'Share the invitation' : 'निमंत्रण शेअर करा'}
      </button>
      <div className="mx-auto mt-8 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-rr-gold/50" />
        <p className="font-montserrat text-[11px] font-medium uppercase tracking-[0.25em] text-rr-ink/50">
          {DESIGNER.label} <span className="font-playfair text-base normal-case tracking-normal italic text-rr-wine">{DESIGNER.name}</span>
        </p>
        <span className="h-px w-10 bg-rr-gold/50" />
      </div>
      <p className="mt-1 font-montserrat text-xs text-rr-ink/40">
        Crafted with love by{' '}
        <a href="/" className="inline-flex min-h-[44px] items-center underline-offset-4 hover:underline">
          My Invites
        </a>
      </p>
    </Section>
  )
}

import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Send } from 'lucide-react'
import { Lotus, PipalLeaf } from '../art'
import { Chapter, ChapterHeading, EASE, useLang, useT, type Lang } from '../ui'
import { bodhiWedding as C } from '../bodhiWedding.config'
import { shortDate, timeText, toDate } from '../dates'

interface Form {
  name: string
  phone: string
  attending: 'yes' | 'no' | ''
  guests: number
  events: string[]
  message: string
}

/** Builds https://wa.me/<number>?text=<friendly, URL-encoded RSVP message>. */
export function rsvpLink(f: Form) {
  const name = f.name.trim()
  const couple = `${C.bride.first} & ${C.groom.first}`
  const chosen = C.events
    .filter((e) => f.events.includes(e.id))
    .map((e) => {
      const d = toDate(e.start)
      return `• ${e.name.en}${d ? ` — ${shortDate(d)}, ${timeText(d)}` : ''}`
    })
  const lines =
    f.attending === 'yes'
      ? [
          'Namo Buddhaya!',
          '',
          `Dear Fulzele & Gaikwad families, this is ${name}.`,
          `With great joy, I'll be attending ${couple}'s wedding celebrations:`,
          ...chosen,
          '',
          `Number of guests (including me): ${f.guests}`,
        ]
      : [
          'Namo Buddhaya!',
          '',
          `Dear Fulzele & Gaikwad families, this is ${name}.`,
          `With regret, I won't be able to attend ${couple}'s wedding — but my blessings are with you both.`,
        ]
  if (f.message.trim()) lines.push('', `Message: ${f.message.trim()}`)
  if (f.phone.trim()) lines.push(`Phone: ${f.phone.trim()}`)
  lines.push('', 'Bhavatu Sabba Mangalam 🙏')
  return `https://wa.me/${C.rsvp.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`
}

function Shower() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 80,
        leaf: i % 3 === 0,
        color: ['#f2a7b8', '#c2263a', '#f6c9d3'][i % 3],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className="absolute top-0"
          style={{ left: `${b.left}%` }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: 420, x: b.drift, rotate: 260, opacity: [0, 1, 1, 0] }}
          transition={{ duration: b.dur, delay: b.delay, ease: 'easeIn' }}
        >
          {b.leaf ? <PipalLeaf className="h-4 w-3.5" fill="#9cc46b" /> : <span className="block h-3 w-2 rounded-[50%]" style={{ background: b.color }} />}
        </motion.span>
      ))}
    </div>
  )
}

const L = (lang: Lang, en: string, mr: string) => (lang === 'en' ? en : mr)

/** Chapter 11 · RSVP — opens WhatsApp with a ready, friendly message. */
export default function Rsvp() {
  const { lang } = useLang()
  const t = useT()
  const [form, setForm] = useState<Form>({ name: '', phone: '', attending: '', guests: 1, events: C.events.map((e) => e.id), message: '' })
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone' | 'attending' | 'events', string>>>({})
  const [sent, setSent] = useState(false)

  const toggleEvent = (id: string) =>
    setForm((f) => ({ ...f, events: f.events.includes(id) ? f.events.filter((x) => x !== id) : [...f.events, id] }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = L(lang, 'Please enter your name.', 'कृपया आपले नाव लिहा.')
    if (form.phone.trim() && !/^[+\d\s-]{7,16}$/.test(form.phone.trim())) errs.phone = L(lang, 'Please check the phone number.', 'कृपया फोन नंबर तपासा.')
    if (!form.attending) errs.attending = L(lang, 'Please let us know if you can come.', 'आपण येणार का ते कळवा.')
    if (form.attending === 'yes' && form.events.length === 0) errs.events = L(lang, 'Choose at least one celebration.', 'किमान एक सोहळा निवडा.')
    setErrors(errs)
    if (Object.keys(errs).length) return
    window.open(rsvpLink(form), '_blank', 'noopener')
    setSent(true)
  }

  const label = `text-bodhi-ink/70 ${lang === 'en' ? 'font-cinzel text-[11px] tracking-[0.25em]' : 'font-marathi text-sm'}`
  const field = 'mt-2 w-full rounded-[4px] border bg-white/80 px-4 py-3.5 font-mukta text-base text-bodhi-ink outline-none transition placeholder:text-bodhi-ink/35 focus:border-bodhi-maroon focus:ring-2 focus:ring-bodhi-gold/30'
  const err = (m?: string) => m && <span className="mt-1.5 block font-mukta text-sm text-bodhi-rose">{m}</span>

  return (
    <Chapter id="rsvp" className="bg-[linear-gradient(180deg,#fbf5e9_0%,#f8e6c4_100%)]">
      <ChapterHeading
        accent="करुणा"
        number="CHAPTER XI"
        title={L(lang, 'Will You Join Us?', 'आपण याल ना?')}
        subtitle={L(lang, 'Your reply opens in WhatsApp, ready to send to the family.', 'आपला प्रतिसाद WhatsApp मध्ये तयार होऊन उघडेल.')}
      />

      <div className="relative mx-auto mt-12 max-w-lg overflow-hidden rounded-[4px] border-2 border-bodhi-gold/60 bg-bodhi-ivory px-6 py-10 shadow-[0_30px_60px_-40px_rgba(59,36,22,.7)] sm:px-10">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative py-8 text-center">
              <Shower />
              <motion.div initial={{ scale: 0.2, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
                <Lotus className="mx-auto h-24 w-32" />
              </motion.div>
              <h3 className="mt-6 font-display text-4xl text-bodhi-maroon">
                {L(lang, 'Thank you', 'धन्यवाद')}, {form.name.trim().split(' ')[0]}
              </h3>
              <p className={`mx-auto mt-3 max-w-xs text-[15px] text-bodhi-ink/70 ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>
                {L(lang, 'Your message is ready in WhatsApp — just press send.', 'आपला संदेश WhatsApp मध्ये तयार आहे — फक्त पाठवा दाबा.')}
              </p>
              <a href={rsvpLink(form)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-mukta text-sm font-medium text-bodhi-leaf underline underline-offset-4">
                {L(lang, 'WhatsApp didn’t open? Tap here', 'WhatsApp उघडले नाही? येथे स्पर्श करा')}
              </a>
              <div>
                <button type="button" onClick={() => setSent(false)} className="mt-2 min-h-[44px] font-mukta text-sm text-bodhi-maroon underline underline-offset-4">
                  {L(lang, 'Edit my reply', 'प्रतिसाद बदला')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <label className="block">
                <span className={label}>{L(lang, 'YOUR NAME', 'आपले नाव')}</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" aria-invalid={!!errors.name} placeholder={L(lang, 'Full name', 'पूर्ण नाव')} className={`${field} ${errors.name ? 'border-bodhi-rose' : 'border-bodhi-gold/50'}`} />
                {err(errors.name)}
              </label>

              <fieldset>
                <legend className={label}>{L(lang, 'WILL YOU ATTEND?', 'आपण याल का?')}</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(
                    [
                      ['yes', L(lang, 'Joyfully, yes', 'होय, आनंदाने')],
                      ['no', L(lang, 'Sadly, no', 'खेदपूर्वक, नाही')],
                    ] as const
                  ).map(([v, text]) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={form.attending === v}
                      onClick={() => setForm({ ...form, attending: v })}
                      className={`min-h-[52px] rounded-[4px] border px-3 text-[15px] transition ${lang === 'mr' ? 'font-marathi' : 'font-mukta'} ${
                        form.attending === v ? 'border-bodhi-maroon bg-bodhi-maroon text-bodhi-ivory' : 'border-bodhi-gold/50 text-bodhi-ink'
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>
                {err(errors.attending)}
              </fieldset>

              <AnimatePresence initial={false}>
                {form.attending === 'yes' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="space-y-6 overflow-hidden">
                    <fieldset>
                      <legend className={label}>{L(lang, 'ATTENDING', 'कोणत्या सोहळ्याला')}</legend>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {C.events.map((ev) => {
                          const on = form.events.includes(ev.id)
                          return (
                            <label key={ev.id} className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[4px] border px-4 transition ${on ? 'border-bodhi-maroon bg-bodhi-maroon/5' : 'border-bodhi-gold/50'}`}>
                              <input type="checkbox" checked={on} onChange={() => toggleEvent(ev.id)} className="h-4 w-4 accent-[#7a1f2b]" />
                              <span className={`text-[15px] text-bodhi-ink ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>{t(ev.name)}</span>
                            </label>
                          )
                        })}
                      </div>
                      {err(errors.events)}
                    </fieldset>
                    <div>
                      <span className={label}>{L(lang, 'NUMBER OF GUESTS', 'पाहुण्यांची संख्या')}</span>
                      <div className="mt-2 flex items-center gap-4">
                        <button type="button" aria-label="Fewer guests" disabled={form.guests <= 1} onClick={() => setForm({ ...form, guests: form.guests - 1 })} className="grid h-12 w-12 place-items-center rounded-full border border-bodhi-gold/60 text-bodhi-maroon disabled:opacity-30">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-display text-4xl tabular-nums text-bodhi-maroon" aria-live="polite">
                          {form.guests}
                        </span>
                        <button type="button" aria-label="More guests" disabled={form.guests >= C.rsvp.maxGuests} onClick={() => setForm({ ...form, guests: form.guests + 1 })} className="grid h-12 w-12 place-items-center rounded-full border border-bodhi-gold/60 text-bodhi-maroon disabled:opacity-30">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="block">
                <span className={label}>{L(lang, 'PHONE · OPTIONAL', 'फोन · ऐच्छिक')}</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} placeholder="+91 …" className={`${field} ${errors.phone ? 'border-bodhi-rose' : 'border-bodhi-gold/50'}`} />
                {err(errors.phone)}
              </label>

              <label className="block">
                <span className={label}>{L(lang, 'MESSAGE · OPTIONAL', 'संदेश · ऐच्छिक')}</span>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder={L(lang, 'Blessings for the couple…', 'वधू-वरांसाठी शुभेच्छा…')} className={`${field} resize-none border-bodhi-gold/50`} />
              </label>

              <button type="submit" className={`flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-bodhi-maroon text-base font-medium text-bodhi-ivory shadow-[0_14px_30px_-14px_rgba(122,31,43,.8)] transition hover:bg-[#61161f] active:scale-[.99] ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>
                <Send className="h-4 w-4" /> {L(lang, 'Send RSVP on WhatsApp', 'WhatsApp वर प्रतिसाद पाठवा')}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Chapter>
  )
}

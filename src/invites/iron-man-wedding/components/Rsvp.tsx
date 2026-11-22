import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, FadeUp, MaskLines, Mono, Section } from './ui'
import { useStatus } from './status'
import { rsvpCopy } from '../copy'
import type { WeddingInviteConfig } from '../../types'

const STORE_KEY = 'my-invites:rsvp:iron-man-wedding'

interface Reply {
  name: string
  attending: 'yes' | 'no' | ''
  guests: number
  message: string
}

function loadSaved(): Reply | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Reply) : null
  } catch {
    return null
  }
}

export default function Rsvp({ config }: { config: WeddingInviteConfig }) {
  const { rsvp } = config
  const { say } = useStatus()
  const [saved, setSaved] = useState<Reply | null>(loadSaved)
  const [form, setForm] = useState<Reply>(() => saved ?? { name: '', attending: '', guests: 1, message: '' })
  const [errors, setErrors] = useState<{ name?: string; attending?: string }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.attending) errs.attending = 'Please let us know if you can come.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const couple = `${config.groom.name} & ${config.bride.name}`
    const lines = [
      `RSVP — wedding of ${couple}`,
      `Name: ${form.name.trim()}`,
      form.attending === 'yes'
        ? `Attending: Yes${rsvp.allowGuestCount ? ` (${form.guests} ${form.guests > 1 ? 'guests' : 'guest'})` : ''}`
        : 'Attending: Sorry, I can’t make it',
      form.message.trim() ? `Message: ${form.message.trim()}` : '',
    ].filter(Boolean)
    const num = rsvp.whatsappNumber.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener')

    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(form))
    } catch {
      /* storage unavailable */
    }
    setSaved(form)
    say(form.attending === 'yes' ? 'Confirmation transmitted. Seat reserved.' : 'Message delivered with gratitude.')
  }

  const first = (saved?.name ?? '').trim().split(' ')[0]

  return (
    <Section id="rsvp" className="overflow-hidden bg-obsidian py-24 sm:py-32">
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(143,24,32,.25),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <FadeUp>
            <Mono className="text-iron-gold/80">Kindly respond</Mono>
          </FadeUp>
          <MaskLines lines={['Will you', <em key="b">be there?</em>]} className="mt-4 font-display text-[clamp(3.2rem,14vw,5.6rem)] leading-[0.92] text-paper" />
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-xs font-body text-[15px] leading-relaxed text-paper/55">
              {rsvp.deadlineLabel ?? 'Your reply opens in WhatsApp, ready to send to the family.'}
            </p>
          </FadeUp>
        </div>

        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:pt-6">
              <svg viewBox="0 0 64 64" className="h-16 w-16 text-iron-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <motion.circle cx="32" cy="32" r="30" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE }} />
                <motion.path d="M20 33l8 8 16-17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.6, ease: EASE }} />
              </svg>
              <h3 className="mt-6 font-display text-[2.4rem] leading-tight text-paper">
                {saved.attending === 'yes' ? rsvpCopy.successYes(first) : rsvpCopy.successNo(first)}
              </h3>
              <p className="mt-3 max-w-sm font-body text-[15px] text-paper/60">
                {saved.attending === 'yes'
                  ? `${rsvp.allowGuestCount ? `${saved.guests} ${saved.guests > 1 ? 'guests' : 'guest'} confirmed. ` : ''}${rsvpCopy.successYesSub}`
                  : rsvpCopy.successNoSub}
              </p>
              <p className="mt-4 font-body text-sm text-paper/45">If WhatsApp didn&apos;t open, check that pop-ups are allowed and send again.</p>
              <button onClick={() => setSaved(null)} className="mt-8 border-b border-paper/30 pb-1 font-body text-sm text-paper/75 active:text-paper">
                Edit my response
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-9">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">Your name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  placeholder="Full name"
                  className={`mt-2 w-full border-b bg-transparent py-3 font-body text-lg text-paper outline-none transition-colors placeholder:text-paper/25 ${
                    errors.name ? 'border-[#e0656b]' : 'border-paper/20 focus:border-iron-gold'
                  }`}
                />
                {errors.name && <span className="mt-2 block font-body text-sm text-[#e98a8f]">{errors.name}</span>}
              </label>

              <fieldset>
                <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">Attendance</legend>
                <div className="mt-2 divide-y divide-paper/10 border-y border-paper/10">
                  {(
                    [
                      ['yes', 'Joyfully accepts'],
                      ['no', 'Regretfully declines'],
                    ] as const
                  ).map(([v, label]) => {
                    const on = form.attending === v
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setForm({ ...form, attending: v })}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className={`font-display text-[1.7rem] leading-none transition-colors ${on ? 'text-paper' : 'text-paper/45'}`}>{label}</span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border transition-colors ${on ? 'border-iron-gold' : 'border-paper/30'}`}>
                          <motion.span className="h-2.5 w-2.5 rounded-full bg-iron-gold" initial={false} animate={{ scale: on ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} />
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.attending && <span className="mt-2 block font-body text-sm text-[#e98a8f]">{errors.attending}</span>}
              </fieldset>

              <AnimatePresence initial={false}>
                {rsvp.allowGuestCount && form.attending === 'yes' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">Number of guests, including you</span>
                    <div className="mt-3 flex items-center gap-6">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        disabled={form.guests <= 1}
                        onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                        className="grid h-12 w-12 place-items-center border border-paper/20 font-body text-xl text-paper active:bg-paper/10 disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-display text-4xl tabular-nums text-paper" aria-live="polite">
                        {form.guests}
                      </span>
                      <button
                        type="button"
                        aria-label="More guests"
                        disabled={form.guests >= rsvp.maxGuests}
                        onClick={() => setForm({ ...form, guests: Math.min(rsvp.maxGuests, form.guests + 1) })}
                        className="grid h-12 w-12 place-items-center border border-paper/20 font-body text-xl text-paper active:bg-paper/10 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/45">Blessings for the couple · optional</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={2}
                  className="mt-2 w-full resize-none border-b border-paper/20 bg-transparent py-3 font-body text-lg text-paper outline-none placeholder:text-paper/25 focus:border-iron-gold"
                  placeholder="A few words…"
                />
              </label>

              <motion.button
                type="submit"
                whileHover="on"
                whileTap="on"
                className="relative flex w-full items-center justify-between overflow-hidden bg-iron px-6 py-5 font-body text-[15px] font-medium text-paper"
              >
                <motion.span className="absolute inset-0 origin-left bg-iron-deep" initial={{ scaleX: 0 }} variants={{ on: { scaleX: 1 } }} transition={{ duration: 0.45, ease: EASE }} />
                <span className="relative">Send RSVP on WhatsApp</span>
                <motion.span className="relative" variants={{ on: { x: 4 } }}>
                  →
                </motion.span>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}

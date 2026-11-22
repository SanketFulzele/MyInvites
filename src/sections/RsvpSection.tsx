import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import SakuraBranch from '../art/SakuraBranch'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { fmt, parseLocal } from '../lib/date'

type Attendance = 'going' | 'staying'

interface PlaqueForm {
  name: string
  guests: number
  events: string[]
  message: string
  dietary: string
}

type FormErrors = Partial<Record<keyof PlaqueForm | 'attendance', string>>

const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
const dateLine = `${fmt.day(ceremony, wedding.timeZone)} ${fmt.month(ceremony, wedding.timeZone)} ${fmt.year(ceremony, wedding.timeZone)}`
const couple = `${wedding.bride.name} & ${wedding.groom.name}`

const INITIAL_FORM: PlaqueForm = {
  name: '',
  guests: 1,
  events: [],
  message: '',
  dietary: '',
}

const BURST_PETALS = Array.from({ length: 16 }, (_, index) => ({
  angle: (index / 16) * Math.PI * 2,
  distance: 58 + (index % 5) * 15,
  delay: (index % 4) * 0.05,
}))

/**
 * Preserved data flow: strip non-digits from the configured number, keep the
 * wa.me base even when it is empty, and append the invitation page title.
 * `details` only adds the reply written on the ema plaque.
 */
function whatsappLink(number: string, going: boolean, details?: string) {
  const message = going
    ? `Namaste! I'll be there to celebrate ${couple} on ${dateLine} in ${wedding.city}. Wouldn't miss it! 🌸`
    : `Namaste! I'm afraid I can't make it to ${couple}'s wedding on ${dateLine}. Sending my love and blessings. 🌸`
  const withDetails = details ? `${message}\n${details}` : message
  const base = number ? `https://wa.me/${number.replace(/\D/g, '')}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(`${withDetails}\n\n${wedding.meta.pageTitle}`)}`
}

function validate(attendance: Attendance | null, form: PlaqueForm): FormErrors {
  const errors: FormErrors = {}
  if (!attendance) errors.attendance = 'Please tell us whether you can join us.'
  if (!form.name.trim()) errors.name = 'Please write your name on the plaque.'
  else if (form.name.trim().length < 2) errors.name = 'Please use at least two characters.'

  if (attendance === 'going') {
    if (!Number.isInteger(form.guests) || form.guests < 1 || form.guests > wedding.rsvp.maxGuests) {
      errors.guests = `Choose between 1 and ${wedding.rsvp.maxGuests} guests.`
    }
    if (form.events.length === 0) errors.events = 'Choose at least one celebration.'
    if (!form.message.trim()) errors.message = 'Leave a short note for the couple.'
  }
  return errors
}

function PetalBurst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-40" aria-hidden="true">
      {BURST_PETALS.map((petal, index) => (
        <motion.span
          key={index}
          initial={{ x: 0, y: 0, opacity: 0.95, scale: 0.5, rotate: 0 }}
          animate={{
            x: Math.cos(petal.angle) * petal.distance,
            y: Math.sin(petal.angle) * petal.distance - 16,
            opacity: 0,
            scale: 1,
            rotate: 220,
          }}
          transition={{ duration: 1.25, delay: petal.delay, ease: 'easeOut' }}
          className="absolute h-3 w-2 rounded-[80%_20%_70%_30%] bg-blossom shadow-[0_0_8px_rgba(244,198,208,0.9)]"
        />
      ))}
    </div>
  )
}

/** Episode 13: a wooden ema wish plaque with the original WhatsApp reply flow. */
export default function RsvpSection() {
  const reduced = usePrefersReducedMotion()
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [form, setForm] = useState<PlaqueForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  const guestOptions = Array.from({ length: Math.max(1, wedding.rsvp.maxGuests) }, (_, index) => index + 1)
  const going = attendance === 'going'

  const chosenEvents = wedding.events.filter((event) => form.events.includes(event.id))
  const detailLines = [
    `Name: ${form.name.trim() || '—'}`,
    going ? `Guests: ${form.guests}` : '',
    chosenEvents.length ? `Joining: ${chosenEvents.map((event) => event.name).join(', ')}` : '',
    form.dietary.trim() ? `Dietary notes: ${form.dietary.trim()}` : '',
    form.message.trim() ? `Note: ${form.message.trim()}` : '',
  ].filter(Boolean)
  const replyLink = whatsappLink(wedding.rsvp.whatsappNumber, going, detailLines.join('\n'))

  const fieldClass =
    'min-h-11 w-full rounded-sm border border-sakura-plum/30 bg-[#fbf0e2] px-3 py-2 text-sm text-sumi placeholder:text-sumi/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion'

  const toggleEvent = (id: string) => {
    setForm((current) => ({
      ...current,
      events: current.events.includes(id)
        ? current.events.filter((eventId) => eventId !== id)
        : [...current.events, id],
    }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(attendance, form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      setStatus('Please review the highlighted fields.')
      return
    }

    setSubmitted(true)
    setBurstKey((key) => key + 1)
    setStatus(
      wedding.rsvp.whatsappNumber
        ? 'Opening WhatsApp with your reply ready to send.'
        : 'Opening WhatsApp — guests will be asked to choose the family contact.',
    )
    window.open(replyLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(233,175,192,0.35),transparent_60%)] bg-sakura-cream px-5 py-24 text-sumi sm:px-8 sm:py-28"
    >
      <div className="relative mx-auto max-w-2xl">
        <EpisodeTitle
          number="第十三話 · Episode 13"
          title="Will You Be There?"
          kanji="返"
          tone="light"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />
        <p lang="hi" className="font-devanagari mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-sakura-plum/75">
          {wedding.invitationLine.textLocal}
        </p>

        {!wedding.rsvp.enabled ? (
          <p className="mt-12 text-center font-display text-2xl italic text-sakura-plum">
            {wedding.closingLine}
          </p>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Your attendance">
              <button
                type="button"
                aria-pressed={attendance === 'going'}
                onClick={() => {
                  setAttendance('going')
                  setSubmitted(false)
                  setErrors({})
                }}
                className={`min-h-11 rounded-full border px-6 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf ${
                  attendance === 'going'
                    ? 'border-vermilion bg-vermilion text-sakura-cream'
                    : 'border-sakura-plum/50 bg-white/60 text-sakura-plum hover:border-vermilion hover:text-vermilion'
                }`}
              >
                Yes, I&apos;ll be there
              </button>
              <button
                type="button"
                aria-pressed={attendance === 'staying'}
                onClick={() => {
                  setAttendance('staying')
                  setSubmitted(false)
                  setErrors({})
                }}
                className={`min-h-11 rounded-full border px-6 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf ${
                  attendance === 'staying'
                    ? 'border-sakura-plum bg-sakura-plum text-sakura-cream'
                    : 'border-sakura-plum/50 bg-white/60 text-sakura-plum hover:border-vermilion hover:text-vermilion'
                }`}
              >
                Can&apos;t make it
              </button>
            </div>
            {errors.attendance && (
              <p role="alert" className="mt-2 text-center text-[11px] text-vermilion">
                {errors.attendance}
              </p>
            )}

            {!wedding.rsvp.whatsappNumber && (
              <div
                role="alert"
                className="mt-5 border border-lantern/60 bg-lantern/10 px-4 py-3 text-center text-xs leading-relaxed text-sumi/80"
              >
                No family WhatsApp number has been added yet. The send link still opens WhatsApp with your reply
                ready — guests will be asked to choose the right contact.
              </div>
            )}

            <div className="relative mx-auto mt-16 w-full max-w-xl">
              <SakuraBranch
                className="pointer-events-none absolute -top-20 left-1/2 z-20 h-44 w-72 -translate-x-1/2 opacity-90"
                flip
              />
              <span className="mx-auto block h-9 w-px bg-vermilion/70" aria-hidden="true" />

              <motion.form
                onSubmit={submit}
                noValidate
                key={burstKey}
                initial={reduced ? false : { opacity: 0, y: 18, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: 'easeOut' }}
                style={{ clipPath: 'polygon(0 7%, 50% 0, 100% 7%, 100% 100%, 0 100%)' }}
                className="relative border-[6px] border-[#a9764d] bg-[linear-gradient(155deg,#d9ad7c,#c49363_55%,#b07e50)] px-5 pb-7 pt-10 shadow-[0_35px_60px_-45px_rgba(36,27,49,0.9)] sm:px-8"
              >
                <span className="absolute left-1/2 top-3 size-3 -translate-x-1/2 rounded-full border-2 border-[#7c5639] bg-[#f4e3c8]" aria-hidden="true" />
                <p className="text-center text-[10px] font-semibold tracking-[0.34em] uppercase text-[#422c22]">
                  絵馬 · A wish for the couple
                </p>

                <div className="mt-7 space-y-5 rounded-sm bg-[#fbf0e2]/95 px-4 py-6 sm:px-6">
                  <div>
                    <label htmlFor="rsvp-name" className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-sakura-plum">
                      Your name <span className="text-vermilion">*</span>
                    </label>
                    <input
                      id="rsvp-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="How should we thank you?"
                      className={`${fieldClass} mt-2`}
                    />
                    {errors.name && <p role="alert" className="mt-1 text-[11px] text-vermilion">{errors.name}</p>}
                  </div>

                  {wedding.rsvp.allowGuestCount && (
                    <div>
                      <label htmlFor="rsvp-guests" className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-sakura-plum">
                        Number of guests
                      </label>
                      <select
                        id="rsvp-guests"
                        name="guests"
                        value={form.guests}
                        aria-invalid={Boolean(errors.guests)}
                        onChange={(event) => setForm((current) => ({ ...current, guests: Number(event.target.value) }))}
                        className={`${fieldClass} mt-2`}
                      >
                        {guestOptions.map((count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                      {errors.guests && <p role="alert" className="mt-1 text-[11px] text-vermilion">{errors.guests}</p>}
                    </div>
                  )}

                  <fieldset>
                    <legend className="text-[11px] font-semibold tracking-[0.16em] uppercase text-sakura-plum">
                      Which celebrations? {going && <span className="text-vermilion">*</span>}
                    </legend>
                    <div className="mt-2">
                      {wedding.events.map((event) => (
                        <label
                          key={event.id}
                          className="flex min-h-11 cursor-pointer items-center gap-3 border-b border-sakura-plum/15 px-1 text-sm text-sumi"
                        >
                          <input
                            type="checkbox"
                            name="events"
                            value={event.id}
                            checked={form.events.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                            className="size-5 shrink-0 accent-vermilion"
                          />
                          <span className="flex-1">{event.name}</span>
                          {event.nameLocal && (
                            <span lang="hi" className="font-devanagari text-xs text-sakura-plum/65">
                              {event.nameLocal}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.events && <p role="alert" className="mt-2 text-[11px] text-vermilion">{errors.events}</p>}
                  </fieldset>

                  <div>
                    <label htmlFor="rsvp-message" className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-sakura-plum">
                      Your message {going && <span className="text-vermilion">*</span>}
                    </label>
                    <textarea
                      id="rsvp-message"
                      name="message"
                      rows={3}
                      required={going}
                      value={form.message}
                      aria-invalid={Boolean(errors.message)}
                      onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                      placeholder="A few words for the couple…"
                      className={`${fieldClass} mt-2 resize-y`}
                    />
                    {errors.message && <p role="alert" className="mt-1 text-[11px] text-vermilion">{errors.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="rsvp-dietary" className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-sakura-plum">
                      Dietary notes <span className="font-normal normal-case tracking-normal text-sumi/50">(optional)</span>
                    </label>
                    <input
                      id="rsvp-dietary"
                      name="dietary"
                      type="text"
                      value={form.dietary}
                      onChange={(event) => setForm((current) => ({ ...current, dietary: event.target.value }))}
                      placeholder="Anything we should know?"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sakura-plum px-6 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-sakura-cream transition hover:bg-vermilion focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion"
                  >
                    {going ? 'Hang my wish & reply' : 'Send my blessing'}
                  </button>

                  {submitted && going && !reduced && <PetalBurst />}
                </div>
              </motion.form>
            </div>

            <div aria-live="polite" role="status" className="mt-6 min-h-6 text-center text-xs text-sumi/70">
              {status}
            </div>

            {submitted && (
              <div className="mx-auto mt-4 max-w-lg rounded-sm border border-gold-leaf/60 bg-white/60 px-5 py-6 text-center">
                {going ? (
                  <>
                    <p className="font-display text-2xl italic text-sakura-plum">Your wish is on the branch.</p>
                    <p className="mt-2 text-sm text-sumi/75">We can&apos;t wait to celebrate with you.</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl italic text-sakura-plum">We&apos;ll miss you.</p>
                    <p className="mt-2 text-sm text-sumi/75">Your blessing will stay with us.</p>
                  </>
                )}
                <a
                  href={replyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-vermilion/60 px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-vermilion transition hover:bg-vermilion hover:text-sakura-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf"
                >
                  {going ? 'Send reply on WhatsApp' : 'Send blessing on WhatsApp'} <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}

            {wedding.rsvp.deadlineLabel && (
              <p className="mt-10 text-center text-[11px] tracking-[0.14em] text-sumi/55">
                {wedding.rsvp.deadlineLabel}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

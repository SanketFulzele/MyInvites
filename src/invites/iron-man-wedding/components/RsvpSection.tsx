import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Plus, Send, RotateCcw } from 'lucide-react'
import { HudPanel, SectionHeading } from './Hud'
import { useJarvis } from './Jarvis'
import type { WeddingInviteConfig } from '../../types'

const STORE_KEY = 'my-invites:rsvp:iron-man-wedding'

interface Rsvp {
  name: string
  attending: 'yes' | 'no'
  guests: number
  message: string
}

function loadSaved(): Rsvp | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Rsvp) : null
  } catch {
    return null
  }
}

export default function RsvpSection({ config }: { config: WeddingInviteConfig }) {
  const { say } = useJarvis()
  const [saved, setSaved] = useState<Rsvp | null>(loadSaved)
  const [form, setForm] = useState<Rsvp>(() => saved ?? { name: '', attending: 'yes', guests: 1, message: '' })
  const [error, setError] = useState('')

  const couple = `${config.groom.name} & ${config.bride.name}`

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Please tell us your name.')
      return
    }
    setError('')
    const lines = [
      `RSVP for the wedding of ${couple}`,
      `Name: ${form.name.trim()}`,
      form.attending === 'yes' ? `Attending: Yes — ${form.guests} guest${form.guests > 1 ? 's' : ''}` : 'Attending: Sorry, can’t make it',
      form.message.trim() ? `Message: ${form.message.trim()}` : '',
    ].filter(Boolean)
    const text = encodeURIComponent(lines.join('\n'))
    const num = config.rsvp.whatsappNumber.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${text}`, '_blank', 'noopener')

    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(form))
    } catch {
      /* storage unavailable */
    }
    setSaved(form)
    say(form.attending === 'yes' ? 'RSVP transmitted. Suit up — the celebration awaits.' : 'Message delivered. You will be missed, and blessed.')
  }

  return (
    <section id="rsvp" className="relative scroll-mt-4 px-5 py-20">
      <SectionHeading code="CONFIRM ATTENDANCE" title={<>Will you <em className="text-stark-amber">join us?</em></>} subtitle={config.rsvp.deadlineLabel ?? 'Let the families know you’re coming — it opens WhatsApp with your reply ready to send.'} />

      <HudPanel glow="gold" className="mx-auto max-w-md p-6">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-6 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-reactor/15 text-reactor shadow-[0_0_30px_-4px_rgba(127,233,255,.7)]">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-3xl font-semibold text-white">
                {saved.attending === 'yes' ? `See you there, ${saved.name.split(' ')[0]}!` : `Thank you, ${saved.name.split(' ')[0]}`}
              </h3>
              <p className="mt-2 text-sm text-white/60">
                {saved.attending === 'yes'
                  ? `${saved.guests} guest${saved.guests > 1 ? 's' : ''} confirmed. Skip the shawarma afterwards — there’s a wedding feast.`
                  : 'Your blessings mean the world to us.'}
              </p>
              <button onClick={() => setSaved(null)} className="mt-6 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80">
                <RotateCcw className="h-3.5 w-3.5" /> Edit response
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5" noValidate>
              <label className="block">
                <span className="font-hud text-[9px] tracking-[0.35em] text-reactor/80">YOUR NAME</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  placeholder="Full name"
                  className="mt-2 w-full rounded-xl border border-white/12 bg-black/30 px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:border-reactor/70 focus:outline-none focus:ring-2 focus:ring-reactor/20"
                />
                {error && <span className="mt-1.5 block text-xs text-red-300">{error}</span>}
              </label>

              <div>
                <span className="font-hud text-[9px] tracking-[0.35em] text-reactor/80">ATTENDING?</span>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-white/12 bg-black/30 p-1">
                  {(['yes', 'no'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, attending: v })}
                      className={`rounded-lg py-3 text-sm font-semibold transition ${
                        form.attending === v ? 'bg-gradient-to-r from-stark-crimson to-stark-red text-white shadow' : 'text-white/55'
                      }`}
                    >
                      {v === 'yes' ? 'Joyfully accept' : 'Regretfully decline'}
                    </button>
                  ))}
                </div>
              </div>

              {form.attending === 'yes' && (
                <div>
                  <span className="font-hud text-[9px] tracking-[0.35em] text-reactor/80">NUMBER OF GUESTS</span>
                  <div className="mt-2 flex items-center justify-between rounded-xl border border-white/12 bg-black/30 p-1.5">
                    <button type="button" aria-label="Fewer guests" onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })} className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-white">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-hud text-2xl text-white tabular-nums">{form.guests}</span>
                    <button type="button" aria-label="More guests" onClick={() => setForm({ ...form, guests: Math.min(15, form.guests + 1) })} className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <label className="block">
                <span className="font-hud text-[9px] tracking-[0.35em] text-reactor/80">BLESSINGS / MESSAGE (OPTIONAL)</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="Wishing you both a lifetime of happiness…"
                  className="mt-2 w-full resize-none rounded-xl border border-white/12 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/30 focus:border-reactor/70 focus:outline-none focus:ring-2 focus:ring-reactor/20"
                />
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-stark-crimson via-stark-red to-stark-crimson py-4 font-hud text-xs font-bold tracking-[0.25em] text-white shadow-[0_0_30px_-8px_rgba(179,18,31,.9)]"
              >
                <Send className="h-4 w-4" /> SEND RSVP
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </HudPanel>
    </section>
  )
}

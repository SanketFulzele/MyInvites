import { CalendarPlus, Clock, Flower2, GlassWater, Hand, MapPin, Music, Sparkles } from 'lucide-react'
import { HudPanel, Reveal, SectionHeading } from './Hud'
import { fmt, googleCalendarLink, parseLocal } from '../../../lib/date'
import type { WeddingEvent, WeddingInviteConfig } from '../../types'

const ICONS: Record<WeddingEvent['icon'], typeof Sparkles> = {
  haldi: Flower2,
  mehendi: Hand,
  sangeet: Music,
  wedding: Sparkles,
  reception: GlassWater,
}

const ACCENTS: Record<WeddingEvent['icon'], string> = {
  haldi: 'from-amber-400/30 to-yellow-600/10 text-amber-300',
  mehendi: 'from-emerald-400/25 to-emerald-700/10 text-emerald-300',
  sangeet: 'from-fuchsia-400/25 to-purple-700/10 text-fuchsia-300',
  wedding: 'from-stark-red/40 to-stark-crimson/10 text-stark-amber',
  reception: 'from-reactor/25 to-reactor-deep/10 text-reactor',
}

export default function EventsSection({ config }: { config: WeddingInviteConfig }) {
  return (
    <section id="events" className="relative scroll-mt-4 px-5 py-20">
      <SectionHeading code="MISSION SCHEDULE" title={<>Wedding <em className="text-stark-amber">Events</em></>} subtitle="Every moment we'd love to share with you." />
      <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
        {config.events.map((e, i) => (
          <EventCard key={e.id} event={e} config={config} index={i} featured={e.icon === 'wedding'} />
        ))}
      </div>
    </section>
  )
}

function EventCard({ event, config, index, featured }: { event: WeddingEvent; config: WeddingInviteConfig; index: number; featured: boolean }) {
  const Icon = ICONS[event.icon]
  const start = event.start ? parseLocal(event.start, config.timezoneOffset) : null
  const dateText = event.dateLabel ?? (start ? fmt.full(start, config.timeZone) : '')
  const timeText = event.timeLabel ?? (start ? fmt.time(start, config.timeZone) : '')
  const calLink = start
    ? googleCalendarLink({
        title: `${event.name} · ${config.groom.name} & ${config.bride.name}`,
        start,
        hours: event.icon === 'wedding' ? 3 : 2,
        details: event.description,
        location: `${config.venue.name}, ${config.venue.address}`,
      })
    : null

  return (
    <Reveal delay={index * 0.08} className={featured ? 'md:col-span-2' : ''}>
      <HudPanel glow={featured ? 'gold' : 'reactor'} className={`h-full overflow-hidden p-6 ${featured ? 'bg-gradient-to-br from-stark-red/20 via-white/[.03] to-stark-gold/10' : ''}`}>
        <div className="flex items-start gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${ACCENTS[event.icon]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-hud text-[9px] tracking-[0.35em] text-white/40">EVENT · {String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-display text-3xl font-semibold leading-tight text-white">{event.name}</h3>
            {event.nameLocal && <p className="font-marathi text-base text-stark-amber/80">{event.nameLocal}</p>}
          </div>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-white/65">{event.description}</p>

        <ul className="mt-5 space-y-2.5 text-sm text-white/85">
          <li className="flex items-start gap-3">
            <CalendarPlus className="mt-0.5 h-4 w-4 shrink-0 text-reactor" />
            <span>{dateText}</span>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-reactor" />
            <span>{timeText}</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-reactor" />
            <span>{event.venue}</span>
          </li>
        </ul>

        {calLink && (
          <a
            href={calLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold tracking-wide text-white/85 transition hover:border-reactor/60 hover:text-white"
          >
            <CalendarPlus className="h-4 w-4 text-reactor" /> Add to calendar
          </a>
        )}
      </HudPanel>
    </Reveal>
  )
}

import { motion } from 'framer-motion'
import EventMotif from './EventMotif'
import { EASE, FadeUp, MaskLines, Mono, Rule, Section } from './ui'
import { fmt, googleCalendarLink, parseLocal } from '../../../lib/date'
import type { EventKind, WeddingEvent, WeddingInviteConfig } from '../../types'

/** Each function's own accent — used sparingly (numerals, motif, a faint wash). */
const IDENTITY: Record<EventKind, { accent: string; wash: string }> = {
  haldi: { accent: '#E0A93F', wash: 'rgba(224,169,63,.10)' },
  mehendi: { accent: '#8FAE6B', wash: 'rgba(143,174,107,.10)' },
  sangeet: { accent: '#C58BA6', wash: 'rgba(197,139,166,.10)' },
  wedding: { accent: '#C69A53', wash: 'rgba(143,24,32,.2)' },
  reception: { accent: '#D7C29A', wash: 'rgba(215,194,154,.08)' },
}

function getEventDates(e: WeddingEvent, config: WeddingInviteConfig) {
  const tz = config.timeZone
  const start = e.start ? parseLocal(e.start, config.timezoneOffset) : null
  const dayDate = start ?? (e.day ? parseLocal(`${e.day}T12:00:00`, config.timezoneOffset) : null)
  return {
    start,
    day: dayDate ? fmt.day(dayDate, tz) : '',
    month: dayDate ? fmt.month(dayDate, tz) : '',
    weekday: dayDate ? fmt.weekday(dayDate, tz) : '',
    full: e.dateLabel ?? (dayDate ? fmt.full(dayDate, tz) : ''),
    time: e.timeLabel ?? (start ? fmt.time(start, tz) : ''),
    calendar: start
      ? googleCalendarLink({
          title: `${e.name} · ${config.groom.name} & ${config.bride.name}`,
          start,
          hours: e.kind === 'wedding' ? 3 : 2,
          details: e.description,
          location: `${config.venue.name}, ${config.venue.address}`,
        })
      : null,
  }
}

export default function Events({ config }: { config: WeddingInviteConfig }) {
  return (
    <Section id="events" className="overflow-hidden bg-obsidian pt-24 sm:pt-32">
      <div className="absolute -right-24 top-10 h-80 w-80 bg-[radial-gradient(circle,rgba(198,154,83,.12),transparent_70%)]" />
      <header className="relative mx-auto max-w-3xl px-6">
        <FadeUp>
          <Mono className="text-iron-gold/80">Itinerary · {String(config.events.length).padStart(2, '0')} functions</Mono>
        </FadeUp>
        <MaskLines
          lines={['The', <em key="c" className="text-champagne">Celebrations</em>]}
          className="mt-4 font-display text-[clamp(3.2rem,14vw,6rem)] leading-[0.92] text-paper"
        />
      </header>

      <div className="relative mt-14 sm:mt-20">
        {config.events.map((e, i) =>
          e.kind === 'wedding' ? (
            <WeddingBand key={e.id} event={e} config={config} />
          ) : (
            <TimelineEntry key={e.id} event={e} config={config} index={i} />
          ),
        )}
      </div>
    </Section>
  )
}

function TimelineEntry({ event, config, index }: { event: WeddingEvent; config: WeddingInviteConfig; index: number }) {
  const id = IDENTITY[event.kind]
  const d = getEventDates(event, config)
  return (
    <article className="relative mx-auto max-w-3xl px-6">
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 bottom-0"
        style={{ background: `radial-gradient(60% 55% at 80% 30%, ${id.wash}, transparent 70%)` }}
      />
      <div className="relative border-l border-paper/10 pb-20 pl-7 sm:pl-12">
        <span className="absolute -left-[4px] top-6 h-[7px] w-[7px] rotate-45" style={{ background: id.accent }} />
        <EventMotif kind={event.kind} className="absolute right-0 top-0 h-16 w-16 opacity-80 sm:h-20 sm:w-20" />

        <FadeUp className="flex items-end gap-4">
          <span className="font-display text-[5.5rem] leading-[0.8] font-light tabular-nums" style={{ color: id.accent }}>
            {d.day}
          </span>
          <div className="pb-1">
            <Mono className="text-paper/70">{d.month}</Mono>
            <Mono className="mt-1 text-paper/40">{d.weekday}</Mono>
          </div>
        </FadeUp>

        <MaskLines lines={[event.name]} as="h3" className="mt-6 font-display text-[2.6rem] leading-none text-paper" />
        {event.nameLocal && (
          <FadeUp delay={0.1}>
            <p className="mt-2 font-marathi text-lg" style={{ color: id.accent }}>
              {event.nameLocal}
            </p>
          </FadeUp>
        )}
        <FadeUp delay={0.15}>
          <p className="mt-4 max-w-md font-body text-[15px] leading-relaxed text-paper/60">{event.description}</p>
          <dl className="mt-6 grid max-w-md grid-cols-[4.5rem_1fr] gap-y-3 font-body text-[15px]">
            <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">Time</dt>
            <dd className="text-paper">
              {d.time}
              {event.note && <span className="text-paper/50"> · {event.note}</span>}
            </dd>
            <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">Venue</dt>
            <dd className="text-paper/85">{event.venue}</dd>
          </dl>
          {d.calendar && <CalendarLink href={d.calendar} accent={id.accent} />}
        </FadeUp>
      </div>
      {index === config.events.length - 1 && <Rule className="mb-2" color="bg-paper/10" />}
    </article>
  )
}

function CalendarLink({ href, accent }: { href: string; accent: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group mt-6 inline-flex items-center gap-3 py-2 font-body text-sm font-medium text-paper"
    >
      <span className="relative">
        Add to calendar
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-500 group-hover:scale-x-50 group-active:scale-x-50" style={{ background: accent }} />
      </span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1">
        →
      </span>
    </a>
  )
}

function WeddingBand({ event, config }: { event: WeddingEvent; config: WeddingInviteConfig }) {
  const d = getEventDates(event, config)
  return (
    <article className="relative my-4 overflow-hidden bg-iron py-20 text-center sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,200,150,.14),transparent_60%),radial-gradient(120%_90%_at_50%_120%,rgba(0,0,0,.55),transparent_60%)]" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-[.09] mix-blend-overlay" />
      {/* fine gold frame lines */}
      <motion.span
        className="absolute inset-x-6 top-6 h-px origin-center bg-iron-gold/50"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <motion.span
        className="absolute inset-x-6 bottom-6 h-px origin-center bg-iron-gold/50"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      <div className="relative mx-auto max-w-xl px-6">
        <Mono className="text-paper/70">The main event</Mono>
        <EventMotif kind="wedding" className="mx-auto mt-6 h-20 w-20 text-iron-gold" />
        <MaskLines lines={[event.name]} className="mt-6 font-display text-[clamp(2.8rem,12vw,5rem)] leading-[0.95] text-paper" />
        {event.nameLocal && <p className="mt-3 font-marathi text-xl text-champagne">{event.nameLocal}</p>}

        <FadeUp delay={0.15} className="mt-10">
          <p className="font-display text-[clamp(4rem,20vw,7rem)] leading-none font-light text-paper">{d.time}</p>
          {event.note && <Mono className="mt-3 text-iron-gold">{event.note}</Mono>}
          <div className="mx-auto mt-8 h-px w-16 bg-paper/30" />
          <p className="mt-6 font-body text-base text-paper">{d.full}</p>
          <p className="mt-1 font-body text-[15px] text-paper/70">{event.venue}</p>
          <p className="mx-auto mt-5 max-w-sm font-display text-lg italic leading-snug text-paper/80">{event.description}</p>
          {d.calendar && (
            <motion.a
              href={d.calendar}
              target="_blank"
              rel="noreferrer"
              whileHover="on"
              whileTap="on"
              className="relative mt-9 inline-flex overflow-hidden border border-paper/60 px-7 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.22em] text-paper"
            >
              <motion.span className="absolute inset-0 origin-bottom bg-paper" initial={{ scaleY: 0 }} variants={{ on: { scaleY: 1 } }} transition={{ duration: 0.4, ease: EASE }} />
              <motion.span className="relative" variants={{ on: { color: '#8f1820' } }}>
                Add to calendar
              </motion.span>
            </motion.a>
          )}
        </FadeUp>
      </div>
    </article>
  )
}

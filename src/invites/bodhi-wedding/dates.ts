import { googleCalendarLink, parseLocal } from '../../lib/date'
import { bodhiWedding as C, type BodhiEvent } from './bodhiWedding.config'
import type { Lang } from './ui'

export const toDate = (iso: string | null) => (iso ? parseLocal(iso, C.timezoneOffset) : null)

const locale = (lang: Lang) => (lang === 'mr' ? 'mr-IN' : 'en-IN')
const fmt = (d: Date, lang: Lang, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale(lang), { timeZone: C.timeZone, ...o }).format(d)

/** "Sunday, 14 February 2027" / "रविवार, १४ फेब्रुवारी, २०२७" */
export const dateText = (d: Date | null, lang: Lang = 'en') =>
  d ? fmt(d, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : lang === 'en' ? 'Date to be announced' : 'तारीख लवकरच'

/** "14 Feb 2027" */
export const shortDate = (d: Date | null, lang: Lang = 'en') => (d ? fmt(d, lang, { day: 'numeric', month: 'short', year: 'numeric' }) : '')

/** "11:30 AM" / "११:३० AM" */
export const timeText = (d: Date | null, lang: Lang = 'en', fallback?: string) =>
  d
    ? fmt(d, lang, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\b(am|pm)\b/i, (m) => m.toUpperCase())
    : fallback ?? (lang === 'en' ? 'Time to be announced' : 'वेळ लवकरच')

export const mapsUrl = (e: Pick<BodhiEvent, 'mapLink' | 'mapQuery'>) =>
  e.mapLink ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.mapQuery)}`

export const embedUrl = (query: string) => `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`

/** Google Calendar link — times are converted from IST to UTC, so it's correct in any time zone. */
export function calendarUrl(e: BodhiEvent) {
  const start = toDate(e.start)
  if (!start) return null
  return googleCalendarLink({
    title: `${e.name.en} · ${C.bride.first} & ${C.groom.first} ${C.groom.surname ?? ''}`.trim(),
    start,
    hours: e.hours,
    details: `${e.description.en}\n\nDirections: ${mapsUrl(e)}`,
    location: e.address ? e.address.en : e.venue,
  })
}

export const weddingEvent = () => C.events.find((e) => e.id === 'wedding')!

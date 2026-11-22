import { CalendarPlus } from 'lucide-react'
import type { Ceremony, WeddingVenue } from '../../data/wedding'

/** Builds a single-event ICS in the wedding's IANA zone (TZID=Africa/Nairobi). */
function icsFor(event: Ceremony, venue: WeddingVenue, timeZone: string) {
  const localStamp = (iso: string) => iso.replace(/[-:]/g, '').slice(0, 15)
  const start = localStamp(event.start ?? event.day ?? '')
  const endHour = (Number(start.slice(11, 13)) + 2) % 24
  const end = `${start.slice(0, 11)}${String(endHour).padStart(2, '0')}${start.slice(13)}`
  const esc = (value: string) => value.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//My Invites//Sakura Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-2027@my-invites`,
    `SUMMARY:${esc(`${event.name} — Anushka & Virat`)}`,
    `DTSTART;TZID=${timeZone}:${start}`,
    `DTEND;TZID=${timeZone}:${end}`,
    `LOCATION:${esc(`${venue.name}, ${venue.address}`)}`,
    `DESCRIPTION:${esc(event.description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export default function AddToCalendar({
  event,
  venue,
  timeZone,
  className = '',
}: {
  event: Ceremony
  venue: WeddingVenue
  timeZone: string
  className?: string
}) {
  const download = () => {
    const blob = new Blob([icsFor(event, venue, timeZone)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `anushka-virat-${event.id}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <button
      type="button"
      onClick={download}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 border-b border-gold-leaf/60 px-1 py-2 text-[10px] font-semibold tracking-[0.22em] text-gold-leaf transition hover:border-gold-leaf hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf ${className}`}
    >
      <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" /> ADD TO CALENDAR
    </button>
  )
}

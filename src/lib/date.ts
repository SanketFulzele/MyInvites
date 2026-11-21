/** Parse a local ISO string ("2026-06-24T13:50:00") in a fixed UTC offset ("+05:30"). */
export function parseLocal(iso: string, offset: string): Date {
  return new Date(`${iso}${offset}`)
}

export function formatDate(d: Date, timeZone: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-IN', { timeZone, ...opts }).format(d)
}


export const fmt = {
  weekday: (d: Date, tz: string) => formatDate(d, tz, { weekday: 'long' }),
  day: (d: Date, tz: string) => formatDate(d, tz, { day: '2-digit' }),
  month: (d: Date, tz: string) => formatDate(d, tz, { month: 'long' }),
  monthShort: (d: Date, tz: string) => formatDate(d, tz, { month: 'short' }),
  year: (d: Date, tz: string) => formatDate(d, tz, { year: 'numeric' }),
  full: (d: Date, tz: string) => formatDate(d, tz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  time: (d: Date, tz: string) =>
    formatDate(d, tz, { hour: 'numeric', minute: '2-digit', hour12: true }).replace('am', 'AM').replace('pm', 'PM'),
}

/** Google Calendar "add event" link (2-hour default duration). */
export function googleCalendarLink(opts: { title: string; start: Date; hours?: number; details?: string; location?: string }) {
  const end = new Date(opts.start.getTime() + (opts.hours ?? 2) * 3600_000)
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${stamp(opts.start)}/${stamp(end)}`,
    details: opts.details ?? '',
    location: opts.location ?? '',
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

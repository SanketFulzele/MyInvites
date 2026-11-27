/**
 * Theme voice — the Stark / J.A.R.V.I.S. lines and hidden Easter-egg text.
 * This is theme copy, not wedding data: names are passed in from config.
 */

/** Guest name from a personal link: /invite/iron-man-wedding?guest=Asha */
export function guestName(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('guest')
    const clean = raw?.replace(/[<>]/g, '').trim().slice(0, 40)
    return clean || null
  } catch {
    return null
  }
}

export const greeting = (d = new Date(), name: string | null = guestName()) => {
  const h = d.getHours()
  const part = h < 5 ? 'evening' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return name ? `Good ${part}, ${name}. The celebration is ready.` : `Good ${part}. The celebration is ready.`
}

/** Contextual status lines, shown in the top bar as each section comes into view. */
export const sectionStatus: Record<string, string> = {
  hero: 'Guest identified. Welcome aboard.',
  story: 'Playing archival footage.',
  events: 'Schedule synced to your timeline.',
  family: 'Family protocol engaged.',
  venue: 'Venue coordinates locked.',
  countdown: 'Monitoring T-minus to the muhurat.',
  rsvp: 'Awaiting your confirmation.',
  closing: 'All systems celebrating.',
}

/** Hidden message behind the small reactor in the hero — cycles on each tap. */
export const reactorSecrets = (groom: string, bride: string) => [
  `Proof that ${groom} has a heart.`,
  `Every Tony needs his Pepper. ${groom} found ${bride}.`,
  'Power source: love. Output: unlimited.',
]

export const gauntlet = {
  hint: 'Six stones. One moment.',
  progress: (n: number) => `${n} of 6`,
  complete: 'I looked at 14,000,605 futures. They say “yes” in every single one.',
}

export const rsvpCopy = {
  successYes: (first: string) => `Assembled, ${first}. The Avengers would be proud.`,
  successYesSub: 'Skip the shawarma afterwards — there is a wedding feast.',
  successNo: (first: string) => `Thank you, ${first}.`,
  successNoSub: 'You will be missed — and your blessings will travel with us.',
}

export const signature = 'Proof that Tony Stark — and every groom — has a heart.'

import type { WeddingEvent, WeddingInviteConfig } from '../invites/types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  The single source of truth for the Sakura invitation.
 *
 *  Every guest-facing word, date, place and link lives in this file. Shape it
 *  to taste; components never hard-code content. Anything tagged `isSample`
 *  (or labelled SAMPLE) is a placeholder — replace it before sharing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Build a keyless Google Maps embed URL from a human-readable place query. */
export const mapsEmbedUrl = (placeQuery: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(placeQuery)}&output=embed`

/** Build a keyless Google Maps directions URL from a human-readable place query. */
export const mapsDirectionsUrl = (placeQuery: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeQuery)}`

export interface WeddingVenue {
  id: string
  name: string
  nameLocal?: string
  address: string
  /** TODO: confirm each coordinate with the family before printing. */
  lat: number
  /** TODO: confirm each coordinate with the family before printing. */
  lng: number
  placeQuery: string
  notes: string
  mapsEmbedUrl: string
  directionsUrl: string
  isSample: true
}

export interface Ceremony extends WeddingEvent {
  venueId: string
  scene: NonNullable<WeddingEvent['scene']>
  kanji: string
  dressCode: string
  episode: string
  arcTitle: string
  arcTitleLocal: string
}

export interface WeddingData extends WeddingInviteConfig {
  events: Ceremony[]
  venues: WeddingVenue[]
  /** IANA zone used by the countdown, calendar files and date labels. */
  timezone: string
  city: string
  country: string
  interlude: { line: string; haiku: string; haikuLocal: string }
  /** Outward link to the film theme, shown only in the side drawer. */
  listen: { label: string; url: string }
  credits: { role: string; name: string }[]
  secrets: { orbHints: string[]; total: number }
}

const villages: WeddingVenue[] = [
  {
    id: 'mehendi',
    name: 'Sarova Woodlands Hotel — Garden Lawn',
    address: 'Kenyatta Ave, Nakuru, Kenya',
    // TODO: confirm
    lat: -0.303,
    // TODO: confirm
    lng: 36.0767,
    placeQuery: 'Sarova Woodlands Hotel, Kenyatta Avenue, Nakuru, Kenya',
    notes: 'SAMPLE · Valet parking at the main entrance; look for the garden lawn arch.',
    mapsEmbedUrl: mapsEmbedUrl('Sarova Woodlands Hotel, Kenyatta Avenue, Nakuru, Kenya'),
    directionsUrl: mapsDirectionsUrl('Sarova Woodlands Hotel, Kenyatta Avenue, Nakuru, Kenya'),
    isSample: true,
  },
  {
    id: 'sangeet',
    name: 'The Merica Hotel — Rooftop Terrace',
    address: 'Kenyatta Ave, Nakuru, Kenya',
    // TODO: confirm
    lat: -0.3015,
    // TODO: confirm
    lng: 36.073,
    placeQuery: 'The Merica Hotel, Kenyatta Avenue, Nakuru, Kenya',
    notes: 'SAMPLE · Lift access to the rooftop; basement parking available.',
    mapsEmbedUrl: mapsEmbedUrl('The Merica Hotel, Kenyatta Avenue, Nakuru, Kenya'),
    directionsUrl: mapsDirectionsUrl('The Merica Hotel, Kenyatta Avenue, Nakuru, Kenya'),
    isSample: true,
  },
  {
    id: 'wedding',
    name: 'Lake Nakuru Lodge — Lakeview Lawns',
    address: 'Lake Nakuru National Park, Nakuru, Kenya',
    // TODO: confirm
    lat: -0.398,
    // TODO: confirm
    lng: 36.038,
    placeQuery: 'Lake Nakuru Lodge, Lake Nakuru National Park, Kenya',
    notes: 'SAMPLE · Gate entry by 10:30 AM; allow 30 minutes from Nakuru town.',
    mapsEmbedUrl: mapsEmbedUrl('Lake Nakuru Lodge, Lake Nakuru National Park, Kenya'),
    directionsUrl: mapsDirectionsUrl('Lake Nakuru Lodge, Lake Nakuru National Park, Kenya'),
    isSample: true,
  },
  {
    id: 'reception',
    name: 'Menengai Crater Viewpoint Pavilion',
    address: 'Menengai Crater, Nakuru, Kenya',
    // TODO: confirm
    lat: -0.245,
    // TODO: confirm
    lng: 36.058,
    placeQuery: 'Menengai Crater Viewpoint, Nakuru, Kenya',
    notes: 'SAMPLE · Covered pavilion beside the main viewpoint; parking on site.',
    mapsEmbedUrl: mapsEmbedUrl('Menengai Crater Viewpoint, Nakuru, Kenya'),
    directionsUrl: mapsDirectionsUrl('Menengai Crater Viewpoint, Nakuru, Kenya'),
    isSample: true,
  },
]

export const wedding: WeddingData = {
  meta: {
    pageTitle: 'Anushka & Virat — Wedding Invitation',
    description: 'A sakura-lit wedding invitation for Anushka & Virat · 26 March 2027 · Nakuru, Kenya',
  },

  opening: {
    presenter: 'Together with our families',
    occasion: 'The wedding of',
    tagline: 'Two hearts, one spring',
  },

  groom: {
    name: 'Virat',
    nameLocal: 'विराट',
    honorificLocal: 'श्री.',
    bio: 'The one who always finds the way home.',
    stats: [
      { label: 'Special move', value: 'Finding the way home (SAMPLE)' },
      { label: 'Weakness', value: 'A second bowl of ramen (SAMPLE)' },
      { label: 'First impression', value: 'Quiet, then unstoppable (SAMPLE)' },
    ],
  },
  bride: {
    name: 'Anushka',
    nameLocal: 'अनुष्का',
    honorificLocal: 'कु.',
    bio: 'The one who makes every ordinary day bloom.',
    stats: [
      { label: 'Special move', value: 'Turning ordinary days into spring (SAMPLE)' },
      { label: 'Weakness', value: 'Petals on her hair ornament (SAMPLE)' },
      { label: 'First impression', value: 'A smile before a hello (SAMPLE)' },
    ],
  },

  weddingDateTime: '2027-03-26T11:30:00',
  timezoneOffset: '+03:00',
  timeZone: 'Africa/Nairobi',
  timezone: 'Africa/Nairobi',
  placeLine: 'Nakuru, Kenya',
  city: 'Nakuru',
  country: 'Kenya',

  blessingLine: '॥ शुभम् भवतु ॥',
  headline: 'प्रेम का नया अध्याय',
  intro:
    'Under a sky the colour of first love, two families gather to celebrate Anushka & Virat as they begin their forever.',

  photos: {},

  story: {
    isSample: true,
    chapters: [
      {
        label: 'Chapter I',
        title: 'A chance encounter',
        text: 'It started with a conversation that neither of them wanted to end — and a walk home that felt a little too short.',
        dialogue: '“Was that your umbrella, or mine?” (SAMPLE)',
      },
      {
        label: 'Chapter II',
        title: 'Small, quiet things',
        text: 'Shared silences, inside jokes, and the kind of ordinary mornings that quietly turn into a whole life together.',
        dialogue: '“Same time tomorrow?” (SAMPLE)',
      },
      {
        label: 'Chapter III',
        title: 'The good weather',
        text: 'Now, with both families beside them, they step into spring — and into a promise to keep choosing each other.',
        dialogue: '“Every season, then.” (SAMPLE)',
      },
    ],
  },

  interlude: {
    line: 'Some springs arrive quietly. Some arrive with a name.',
    haiku: 'petals cross the seam — / two skies learn the same warm light / one unbroken spring',
    haikuLocal: '花びらが縫う　二つの空の春',
  },

  events: [
    {
      id: 'mehendi',
      kind: 'mehendi',
      name: 'Mehendi',
      nameLocal: 'मेहंदी',
      start: '2027-03-25T17:30:00',
      venueId: 'mehendi',
      scene: 'wisteria',
      kanji: '藤',
      dressCode: 'SAMPLE · Pastels and comfortable shoes',
      episode: 'Episode 07',
      arcTitle: 'The Wisteria Arc',
      arcTitleLocal: '藤の章',
      venue: 'Sarova Woodlands Hotel — Garden Lawn',
      description: 'Colour, laughter and henna under the spring trees.',
      icon: 'mehendi',
    },
    {
      id: 'sangeet',
      kind: 'sangeet',
      name: 'Sangeet',
      nameLocal: 'संगीत',
      start: '2027-03-25T20:00:00',
      venueId: 'sangeet',
      scene: 'matsuri',
      kanji: '祭',
      dressCode: 'SAMPLE · Festive, with room to dance',
      episode: 'Episode 08',
      arcTitle: 'The Matsuri Night Arc',
      arcTitleLocal: '祭りの章',
      venue: 'The Merica Hotel — Rooftop Terrace',
      description: 'An evening of music, dancing and stories told too loudly.',
      icon: 'sangeet',
    },
    {
      id: 'wedding',
      kind: 'wedding',
      name: 'The Wedding',
      nameLocal: 'विवाह समारोह',
      start: '2027-03-26T11:30:00',
      timeLabel: '11:30 AM · SAMPLE MUHURAT',
      venueId: 'wedding',
      scene: 'shrine',
      kanji: '結',
      dressCode: 'SAMPLE · Traditional attire, pastel gold welcome',
      episode: 'Episode 09',
      arcTitle: 'The Red Thread Arc',
      arcTitleLocal: '結びの章',
      venue: 'Lake Nakuru Lodge — Lakeview Lawns',
      description: 'Anushka & Virat take their vows. Your presence is our greatest blessing.',
      icon: 'wedding',
    },
    {
      id: 'reception',
      kind: 'reception',
      name: 'Reception',
      nameLocal: 'रिसेप्शन',
      start: '2027-03-26T19:00:00',
      venueId: 'reception',
      scene: 'lake',
      kanji: '宴',
      dressCode: 'SAMPLE · Evening formal, golden hour tones',
      episode: 'Episode 10',
      arcTitle: 'The Grand Voyage Arc',
      arcTitleLocal: '宴の章',
      venue: 'Menengai Crater Viewpoint Pavilion',
      description: 'A toast to the newlyweds, with everyone who helped them get here.',
      icon: 'reception',
    },
  ],

  venues: villages,

  families: [
    {
      side: 'groom',
      title: "Groom's family",
      relationLine: 'Parents of Virat',
      relationLineLocal: 'विराट के माता-पिता',
      parents: 'SAMPLE · Mr. & Mrs. Sharma',
      parentsLocal: 'नमूना · श्री. व सौ. शर्मा',
      hometown: 'Nakuru, Kenya',
    },
    {
      side: 'bride',
      title: "Bride's family",
      relationLine: 'Parents of Anushka',
      relationLineLocal: 'अनुष्का के माता-पिता',
      parents: 'SAMPLE · Mr. & Mrs. Verma',
      parentsLocal: 'नमूना · श्री. व सौ. वर्मा',
      hometown: 'Nakuru, Kenya',
    },
  ],

  invitationLine: {
    text: 'With joy in our hearts, we invite you to celebrate the wedding of',
    textLocal: 'प्रेम व आनंदाने, आम्ही तुम्हांला या विवाह समारंभात सहभागी होण्यास आमंत्रित करतो',
  },

  inviters: {
    text: 'Both families, with love and warmest regards',
    textLocal: 'दोन्ही कुटुंबे, प्रेम व शुभेच्छांसह',
  },

  venue: {
    name: 'Lake Nakuru Lodge — Lakeview Lawns',
    nameLocal: 'नाकुरू तळावरील वसतिशाळ',
    address: 'SAMPLE · Lake Nakuru National Park, Nakuru, Kenya',
    landmark: 'SAMPLE · Main park gate, 30 minutes from Nakuru town',
    mapQuery: 'Lake Nakuru Lodge, Lake Nakuru National Park, Kenya',
  },

  gallery: [],
  cards: [],

  rsvp: {
    enabled: true,
    // Add the family's WhatsApp number (country code + digits) to receive replies directly.
    whatsappNumber: '',
    allowGuestCount: true,
    maxGuests: 10,
    deadlineLabel: 'SAMPLE · Kindly reply by 10 March 2027',
  },

  music: {
    // Your licensed track in public/songs/Suzume.mp3 — loops continuously.
    // If the file is missing or fails to load, the original score plays instead.
    src: `${import.meta.env.BASE_URL}songs/Suzume.mp3`,
    title: 'Suzume no Tojimari — RADWIMPS',
  },

  // The film's actual soundtrack is copyrighted, so it is not bundled. This
  // drawer link simply points guests toward the official music video.
  listen: {
    label: 'Hear the film theme',
    url: 'https://www.youtube.com/results?search_query=RADWIMPS+Suzume+official+music+video',
  },

  credits: [
    { role: 'Cast', name: 'Anushka & Virat' },
    { role: 'Directed by', name: 'Fate' },
    { role: 'Produced by', name: 'Both Families' },
    { role: 'Special thanks to', name: 'Everyone who made the journey' },
  ],

  secrets: {
    total: 12,
    orbHints: [
      'a paper lantern above the festival street',
      'a knot in the old sakura trunk',
      'the breath-ring around the countdown',
      'a compass point on the treasure map',
      'a stone lantern by the river bridge',
      'the wax seal on the invitation scroll',
      'a flamingo feather at the lakeside',
    ],
  },

  closingLine: "We can't wait to celebrate this day with you.",
}

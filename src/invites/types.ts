/**
 * Shared data shape for wedding-style invitations.
 * Each theme keeps its own config file that satisfies this type, so
 * components never hard-code names, dates or venues.
 */

export interface Photo {
  src: string
  alt: string
  /** CSS object-position, e.g. "50% 20%" */
  focus?: string
}

export interface Person {
  /** Display name, e.g. "Nilesh" */
  name: string
  /** Name in a regional script, e.g. Marathi */
  nameLocal?: string
  /** Honorific shown before the local name, e.g. "चि." */
  honorificLocal?: string
  /** Honorific in English, e.g. "Chi." */
  honorific?: string
  qualification?: string
  /** Optional illustrated/photographic portrait */
  photo?: string
  /** Short guest-facing line about the person (used by illustrated themes) */
  bio?: string
  /** Playful profile-card stats used by the anime theme */
  stats?: { label: string; value: string }[]
}

export interface FamilyMember {
  relation: string
  names: string
  namesLocal?: string
}

export interface Family {
  side: 'groom' | 'bride'
  /** Optional heading, e.g. "Groom's family" */
  title?: string
  /** e.g. "eldest son of" */
  relationLine: string
  relationLineLocal?: string
  parents: string
  parentsLocal?: string
  hometown: string
  hometownLocal?: string
  others?: FamilyMember[]
}

export type EventKind = 'haldi' | 'mehendi' | 'sangeet' | 'wedding' | 'reception'

export interface WeddingEvent {
  id: string
  kind: EventKind
  name: string
  nameLocal?: string
  /** ISO date-time in local wedding time zone (no Z), or null if "to follow" */
  start: string | null
  /** Calendar day (YYYY-MM-DD) when there's no fixed start time */
  day?: string
  /** Overrides formatted date/time text when the time isn't fixed */
  timeLabel?: string
  dateLabel?: string
  /** Short qualifier shown with the time, e.g. "Shubh Muhurat" */
  note?: string
  venue: string
  description: string
  /** Icon key a theme maps to its own artwork */
  icon: EventKind
  /** Anime theme: id of the venue in the central wedding config */
  venueId?: string
  /** Anime theme: scene illustration key */
  scene?: 'dawn' | 'river' | 'wisteria' | 'matsuri' | 'shrine' | 'lake' | 'night'
  /** Anime theme: small decorative kanji for the arc */
  kanji?: string
  /** Anime theme: dress-code line (SAMPLE until confirmed) */
  dressCode?: string
}

export interface StoryChapter {
  label: string
  title: string
  text: string
  /** Anime theme: a short in-panel dialogue line */
  dialogue?: string
}

export interface WeddingInviteConfig {
  meta: {
    pageTitle: string
    description: string
  }
  /** Lines used by the cinematic opening */
  opening: {
    presenter: string
    occasion: string
    tagline: string
  }
  groom: Person
  bride: Person
  /** Main ceremony moment, used for the countdown. Local time, ISO without Z. */
  weddingDateTime: string
  /** UTC offset of the wedding location, e.g. "+05:30" */
  timezoneOffset: string
  /** IANA zone used when displaying dates, e.g. "Asia/Kolkata" */
  timeZone: string
  /** Short place line shown with the date, e.g. "Kagal, Kolhapur" */
  placeLine: string
  blessingLine?: string
  headline?: string
  intro: string
  photos: {
    hero?: Photo
    story?: Photo
    /** Optional photograph of the venue */
    venue?: Photo
  }
  /** Set `isSample: true` until the couple provides their real story */
  story: { isSample: boolean; chapters: StoryChapter[] }
  /** Optional illustrated gallery used by anime/romantic themes */
  gallery?: { src: string; alt: string; caption?: string }[]
  events: WeddingEvent[]
  families: Family[]
  invitationLine: { text: string; textLocal?: string }
  inviters: { text: string; textLocal?: string }
  venue: {
    name: string
    nameLocal?: string
    address: string
    addressLocal?: string
    landmark?: string
    /** Query string used for the embedded Google Map and directions */
    mapQuery: string
    /** Link printed as a QR code on the physical card */
    locationLink?: string
  }
  /** The printed / shared invitation cards, shown in full */
  cards?: { src: string; alt: string; label: string }[]
  rsvp: {
    enabled: boolean
    /** WhatsApp number with country code, digits only (e.g. "919876543210"). Empty = guest picks a contact. */
    whatsappNumber: string
    allowGuestCount: boolean
    maxGuests: number
    deadlineLabel?: string
  }
  music: {
    /** Optional audio file in /public. If empty, a soft generated ambient score plays instead. */
    src?: string
    title: string
  }
  closingLine: string
}

/**
 * Shared data shape for wedding-style invitations.
 * Each theme keeps its own config file that satisfies this type, so
 * components never hard-code names, dates or venues.
 */

export interface Person {
  /** Display name, e.g. "Nilesh" */
  name: string
  /** Name in a regional script, e.g. Marathi */
  nameLocal?: string
  /** Honorific shown before the local name, e.g. "चि." */
  honorificLocal?: string
  qualification?: string
  photo?: string
  bio?: string
}

export interface FamilyMember {
  relation: string
  names: string
  namesLocal?: string
}

export interface Family {
  side: 'groom' | 'bride'
  title: string
  /** e.g. "Eldest son of" */
  relationLine: string
  relationLineLocal?: string
  parents: string
  parentsLocal?: string
  hometown: string
  hometownLocal?: string
  others?: FamilyMember[]
}

export interface WeddingEvent {
  id: string
  name: string
  nameLocal?: string
  /** ISO date-time in local wedding time zone (no Z), or null if "to follow" */
  start: string | null
  /** Overrides formatted date/time text when the time isn't fixed */
  timeLabel?: string
  dateLabel?: string
  venue: string
  description: string
  /** Lucide-ish icon key the theme maps to its own icon */
  icon: 'haldi' | 'mehendi' | 'sangeet' | 'wedding' | 'reception'
}

export interface StoryChapter {
  title: string
  text: string
}

export interface WeddingInviteConfig {
  meta: {
    pageTitle: string
    description: string
  }
  groom: Person
  bride: Person
  /** Main ceremony moment, used for the countdown. Local time, ISO without Z. */
  weddingDateTime: string
  /** UTC offset of the wedding location, e.g. "+05:30" */
  timezoneOffset: string
  /** IANA zone used when displaying dates, e.g. "Asia/Kolkata" */
  timeZone: string
  blessingLine?: string
  headline: string
  intro: string
  /** Set `isSample: true` until the couple provides their real story */
  story: { isSample: boolean; chapters: StoryChapter[] }
  events: WeddingEvent[]
  families: Family[]
  inviters: { text: string; textLocal?: string }
  venue: {
    name: string
    nameLocal?: string
    address: string
    addressLocal?: string
    landmark?: string
    /** Query string used for the embedded Google Map */
    mapQuery: string
    /** Link printed as a QR code on the physical card */
    locationLink?: string
  }
  gallery: { src: string; alt: string; caption?: string }[]
  /** The printed / shared invitation cards, shown in full */
  cards?: { src: string; alt: string; label: string }[]
  rsvp: {
    /** WhatsApp number with country code, digits only (e.g. "919876543210"). Leave empty to let the guest choose a contact. */
    whatsappNumber: string
    deadlineLabel?: string
  }
  music: {
    /** Optional audio file in /public. If empty, a soft generated ambient score plays instead. */
    src?: string
    title: string
  }
  closingLine: string
}

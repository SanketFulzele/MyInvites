import type { WeddingInviteConfig } from '../types'

/**
 * ─────────────────────────────────────────────────────────────
 *  Iron Man Wedding — invitation content
 *  Everything a guest reads comes from this file. Edit freely.
 *
 *  Source: the couple's two invitation cards (English + Marathi).
 *  Anything NOT on those cards is marked "SAMPLE" below and should
 *  be replaced with real details before sharing.
 * ─────────────────────────────────────────────────────────────
 */

const base = '/invites/iron-man-wedding'

export const config: WeddingInviteConfig = {
  meta: {
    pageTitle: 'Nilesh & Harshada — Wedding Invitation',
    description: 'You are invited to the wedding of Nilesh & Harshada · 24 June 2026 · D.K.M. Bhavan, Kagal, Kolhapur',
  },

  opening: {
    presenter: 'Stark Industries presents',
    occasion: 'A special celebration',
    tagline: 'A lifetime. One promise. Infinite memories.',
  },

  groom: {
    name: 'Nilesh',
    nameLocal: 'निलेश',
    honorific: 'Chi.',
    honorificLocal: 'चि.',
    qualification: 'M.Sc. Electronics',
  },
  bride: {
    name: 'Harshada',
    nameLocal: 'हर्षदा',
    honorific: 'Chi. Sau. Ka.',
    honorificLocal: 'चि.सौ.का.',
    qualification: 'B.Sc. Mathematics',
  },

  // Shubh muhurat: दुपारी 01:50 (1:50 PM), as on the Marathi card — confirmed.
  weddingDateTime: '2026-06-24T13:50:00',
  timezoneOffset: '+05:30',
  timeZone: 'Asia/Kolkata',
  placeLine: 'Kagal · Kolhapur',

  blessingLine: '॥ श्री गणेशाय नमः ॥',
  headline: 'प्रेम सदैव',
  intro: 'With hearts full of love, we are excited for you to join us as we begin our forever.',

  // Photos are optional. Without them the hero and story use typographic compositions.
  photos: {
    // hero: { src: `${base}/hero.webp`, alt: '…', focus: '50% 20%' },
    // story: { src: `${base}/story.webp`, alt: '…' },
    // venue: { src: `${base}/venue.webp`, alt: 'D.K.M. Bhavan, Kagal' },
  },

  story: {
    // SAMPLE — replace with the couple's real story, then set isSample to false.
    isSample: true,
    chapters: [
      {
        label: 'Act I',
        title: 'Two cities',
        text: 'One from Mhaswad, one from Kagal — two journeys that were always heading toward the same place.',
      },
      {
        label: 'Act II',
        title: 'One frequency',
        text: 'Between long conversations and quiet smiles, two hearts found they were tuned to the same signal.',
      },
      {
        label: 'Act III',
        title: 'Forever, activated',
        text: 'With the blessings of both families, they begin their greatest adventure — together.',
      },
    ],
  },

  events: [
    {
      id: 'haldi',
      kind: 'haldi',
      name: 'Haldi',
      nameLocal: 'हळदी समारंभ',
      start: '2026-06-23T20:30:00',
      venue: 'At the wedding venue — D.K.M. Bhavan',
      description: 'An evening of turmeric, laughter and blessings as the celebrations begin.',
    },
    // Mehendi and Sangeet are not on the cards. Add them here if they're planned — the
    // timeline already has a visual identity for each:
    // { id: 'mehendi', kind: 'mehendi', name: 'Mehendi', start: '2026-06-22T17:00:00', venue: '…', description: '…' },
    // { id: 'sangeet', kind: 'sangeet', name: 'Sangeet', start: '2026-06-22T19:30:00', venue: '…', description: '…' },
    {
      id: 'wedding',
      kind: 'wedding',
      name: 'Wedding Ceremony',
      nameLocal: 'शुभविवाह सोहळा',
      start: '2026-06-24T13:50:00',
      note: 'Shubh Muhurat',
      venue: 'D.K.M. Bhavan, Kagal – Murgud Road, Kagal',
      description: 'Nilesh & Harshada take their vows. Your presence and blessings are our greatest gift.',
    },
    {
      id: 'reception',
      kind: 'reception',
      name: 'Reception',
      start: null,
      day: '2026-06-24',
      dateLabel: 'Wednesday, 24 June 2026',
      timeLabel: 'Following the ceremony',
      venue: 'D.K.M. Bhavan, Kagal',
      description: 'Stay on to celebrate the newlyweds with family, friends and a wedding feast.',
    },
  ],

  families: [
    {
      side: 'groom',
      relationLine: 'eldest son of',
      relationLineLocal: 'यांचे ज्येष्ठ सुपुत्र',
      parents: 'Sau. Gita & Shri. Narayan Ramu Aalavane',
      parentsLocal: 'सौ. गिता व श्री. नारायण रामू आळवणे',
      hometown: 'Mhaswad, Tal. Maan, Dist. Satara',
      hometownLocal: 'रा. म्हसवड ता. माण, जि. सातारा',
    },
    {
      side: 'bride',
      relationLine: 'daughter of',
      relationLineLocal: 'यांची सुकन्या',
      parents: 'Sau. Vasumati & Shri. Chandrakant Shankar Shende',
      parentsLocal: 'सौ. वसुमती व श्री. चंद्रकांत शंकर शेंडे',
      hometown: 'Kagal, Dist. Kolhapur',
      hometownLocal: 'रा. कागल, जि. कोल्हापूर',
    },
  ],

  invitationLine: {
    text: 'We request the pleasure of your presence and blessings at the auspicious wedding of',
    textLocal: 'यांचा शुभविवाह सोहळा करण्याचे योजिले आहे. तरी आपली उपस्थिती प्रार्थनीय आहे.',
  },

  inviters: {
    text: 'The entire Aalavane family, relatives & well-wishers',
    textLocal: 'समस्त आळवणे परिवार आणि आप्तेष्ट',
  },

  venue: {
    name: 'D.K.M. Bhavan',
    nameLocal: 'डी. के. एम. भवन',
    address: 'Kagal – Murgud Road, Donemala, Kagal, Dist. Kolhapur, Maharashtra',
    addressLocal: 'कागल - मुरगुड रोड, डोनेमाळा, कागल',
    landmark: 'About 500 m from Kagal',
    mapQuery: 'DKM Bhavan, Kagal Murgud Road, Kagal, Kolhapur',
    // Decoded from the "Scan for Location" QR code on the English card.
    locationLink: 'https://q.me-qr.com/u3t2l7n4',
  },

  cards: [
    { src: `${base}/card-english.webp`, alt: 'English wedding invitation card for Nilesh and Harshada', label: 'English card' },
    { src: `${base}/card-marathi.webp`, alt: 'Marathi wedding invitation card (शुभविवाह) for Nilesh and Harshada', label: 'मराठी पत्रिका' },
  ],

  rsvp: {
    enabled: true,
    // Add the family's WhatsApp number (country code + number, digits only) to receive RSVPs directly.
    whatsappNumber: '',
    allowGuestCount: true,
    maxGuests: 10,
  },

  music: {
    // Drop an mp3 in public/invites/iron-man-wedding/ and set e.g. `${base}/music.mp3`.
    src: '',
    title: 'Ambient score',
  },

  closingLine: 'Your presence will make our celebration even more special.',
}

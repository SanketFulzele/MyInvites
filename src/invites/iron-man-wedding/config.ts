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

  groom: {
    name: 'Nilesh',
    nameLocal: 'निलेश',
    honorificLocal: 'चि.',
    qualification: 'M.Sc. Electronics',
    photo: `${base}/couple-portrait.webp`,
  },
  bride: {
    name: 'Harshada',
    nameLocal: 'हर्षदा',
    honorificLocal: 'चि.सौ.का.',
    qualification: 'B.Sc. Mathematics',
    photo: `${base}/couple-portrait.webp`,
  },

  // Shubh muhurat: दुपारी 01:50 (1:50 PM), as on the Marathi card — confirmed.
  weddingDateTime: '2026-06-24T13:50:00',
  timezoneOffset: '+05:30',
  timeZone: 'Asia/Kolkata',

  blessingLine: '॥ श्री गणेशाय नमः ॥',
  headline: 'प्रेम सदैव',
  intro:
    'With hearts full of love, Nilesh & Harshada are excited for you to join them as they begin their forever.',

  story: {
    // SAMPLE — replace with the couple's real story.
    isSample: true,
    chapters: [
      {
        title: 'Two paths',
        text: 'One from Mhaswad, one from Kagal — two journeys that were always heading toward the same place.',
      },
      {
        title: 'One signal',
        text: 'Somewhere between conversations and quiet smiles, two hearts found the same frequency.',
      },
      {
        title: 'Forever, activated',
        text: 'With the blessings of both families, they are ready to begin their greatest adventure — together.',
      },
    ],
  },

  events: [
    {
      id: 'haldi',
      name: 'Haldi Ceremony',
      nameLocal: 'हळदी समारंभ',
      start: '2026-06-23T20:30:00',
      venue: 'At the wedding venue — D.K.M. Bhavan, Kagal',
      description: 'An evening of turmeric, laughter and blessings as the celebrations begin.',
      icon: 'haldi',
    },
    {
      id: 'wedding',
      name: 'Wedding Ceremony',
      nameLocal: 'शुभविवाह सोहळा',
      start: '2026-06-24T13:50:00',
      timeLabel: '1:50 PM · Shubh Muhurat',
      venue: 'D.K.M. Bhavan, Kagal – Murgud Road, Donemala, Kagal',
      description: 'Nilesh & Harshada take their vows. Your presence and blessings are our greatest gift.',
      icon: 'wedding',
    },
    {
      id: 'reception',
      name: 'Marriage Reception',
      start: null,
      dateLabel: 'Wednesday, 24 June 2026',
      timeLabel: 'To follow the ceremony',
      venue: 'D.K.M. Bhavan, Kagal',
      description: 'Stay on to celebrate the newlyweds with family, friends and a wedding feast.',
      icon: 'reception',
    },
    // Mehendi and Sangeet are not on the cards — add them here if they're planned:
    // { id: 'mehendi', name: 'Mehendi', start: '2026-06-22T17:00:00', venue: '…', description: '…', icon: 'mehendi' },
  ],

  families: [
    {
      side: 'groom',
      title: "Groom's Family",
      relationLine: 'Eldest son of',
      relationLineLocal: 'यांचे ज्येष्ठ सुपुत्र',
      parents: 'Sau. Gita & Shri. Narayan Ramu Aalavane',
      parentsLocal: 'सौ. गिता व श्री. नारायण रामू आळवणे',
      hometown: 'Mhaswad, Tal. Maan, Dist. Satara',
      hometownLocal: 'रा. म्हसवड ता. माण, जि. सातारा',
    },
    {
      side: 'bride',
      title: "Bride's Family",
      relationLine: 'Beloved daughter of',
      relationLineLocal: 'यांची सुकन्या',
      parents: 'Sau. Vasumati & Shri. Chandrakant Shankar Shende',
      parentsLocal: 'सौ. वसुमती व श्री. चंद्रकांत शंकर शेंडे',
      hometown: 'Kagal, Dist. Kolhapur',
      hometownLocal: 'रा. कागल, जि. कोल्हापूर',
    },
  ],

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

  gallery: [
    { src: `${base}/couple-temple.webp`, alt: 'Nilesh and Harshada holding hands on temple steps', caption: 'Hand in hand' },
    { src: `${base}/couple-portrait.webp`, alt: 'Portrait of Harshada and Nilesh', caption: 'Together, always' },
  ],

  cards: [
    { src: `${base}/card-english.webp`, alt: 'English wedding invitation card for Nilesh and Harshada', label: 'Invitation' },
    { src: `${base}/card-marathi.webp`, alt: 'Marathi wedding invitation card (शुभविवाह) for Nilesh and Harshada', label: 'निमंत्रण पत्रिका' },
  ],

  rsvp: {
    // Add the family's WhatsApp number (country code + number, digits only) to receive RSVPs directly.
    whatsappNumber: '',
  },

  music: {
    // Drop an mp3 in public/invites/iron-man-wedding/ and set e.g. `${base}/music.mp3`.
    src: '',
    title: 'Ambient score',
  },

  closingLine: 'Your presence will make our celebration even more special!',
}

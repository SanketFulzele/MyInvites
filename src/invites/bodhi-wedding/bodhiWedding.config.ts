/**
 * ─────────────────────────────────────────────────────────────
 *  Bodhi Wedding — Aarti & Akhilesh Gaikwad
 *  THE single place for every name, date, link and line a guest reads.
 *
 *  Anything marked `// TODO: replace (dummy)` is placeholder content —
 *  search for "TODO: replace" to find them all.
 *  `null` means "not provided" — the page shows a graceful fallback.
 * ─────────────────────────────────────────────────────────────
 */

export type Bilingual = { en: string; mr: string }

export interface BodhiEvent {
  id: 'haldi' | 'wedding' | 'reception' | 'sangeet'
  name: Bilingual
  /** Local IST date-time "2027-02-14T11:30:00", or null when not fixed yet */
  start: string | null
  /** Hours the event lasts — used for calendar entries */
  hours: number
  venue: string
  address: Bilingual | null
  /** Exact Google Maps link; null falls back to a search for `mapQuery` */
  mapLink: string | null
  mapQuery: string
  dressCode: Bilingual
  description: Bilingual
}

export interface BodhiPerson {
  first: string
  surname: string | null
  profession: Bilingual
  from: string | null
  line: Bilingual
  /** Optional photo in /public; without it the arch shows an illustrated monogram */
  photo: string | null
}

export interface FamilySide {
  title: Bilingual
  surname: string
  /** "Shri … & Smt … Surname" */
  parents: Bilingual
  relation: Bilingual
  /** Shown in capitals (via CSS) — keep normal case here */
  familyLine: Bilingual
}

export const bodhiWedding = {
  meta: {
    pageTitle: 'Aarti & Akhilesh — Wedding Invitation',
    description: 'With the blessings of Lord Buddha, you are invited to the wedding of Aarti & Akhilesh Gaikwad · 14 February 2027 · Rajwada Palace, Nagpur',
  },

  timezoneOffset: '+05:30',
  timeZone: 'Asia/Kolkata',

  bride: {
    first: 'Aarti',
    surname: 'Fulzele',
    profession: { en: 'Nurse', mr: 'परिचारिका' },
    from: 'Takalghat',
    line: { en: 'A heart devoted to caring for others.', mr: 'इतरांच्या सेवेसाठी समर्पित हृदय.' },
    photo: null,
  } as BodhiPerson,

  groom: {
    first: 'Akhilesh',
    surname: 'Gaikwad',
    profession: { en: 'Mechanical Engineer', mr: 'मेकॅनिकल इंजिनिअर' },
    from: 'Nagpur',
    line: { en: 'Builds with precision and patience.', mr: 'अचूकतेने आणि संयमाने घडवणारा.' },
    photo: null,
  } as BodhiPerson,

  /** The wedding moment — drives the countdown and calendar (IST). */
  weddingDateTime: '2027-02-14T11:30:00' as string | null, // TODO: replace (dummy) — the 11:30 AM muhurat time is dummy; the date is real

  refuge: 'बुद्धं सरणं गच्छामि · धम्मं सरणं गच्छामि · संघं सरणं गच्छामि',
  envelopeBlessing: 'With the blessings of Lord Buddha',

  invitation: {
    en: 'With the blessings of Tathagata Gautam Buddha and our elders, we joyfully invite you to celebrate the wedding of',
    mr: 'तथागत गौतम बुद्ध आणि आमच्या वडीलधाऱ्यांच्या आशीर्वादाने, आम्ही आपणास सहर्ष निमंत्रित करतो — शुभविवाह',
  } satisfies Bilingual,

  families: {
    bride: {
      title: { en: "The Bride's Family", mr: 'वधू पक्ष' },
      surname: 'Fulzele',
      parents: { en: 'Shri Sumit & Smt Kajal Fulzele', mr: 'श्री सुमित व सौ. काजल फुलझेले' },
      relation: { en: 'Daughter of', mr: 'यांची कन्या' },
      familyLine: { en: 'The Fulzele family, Takalghat', mr: 'फुलझेले परिवार, टाकळघाट' },
    } as FamilySide,
    groom: {
      title: { en: "The Groom's Family", mr: 'वर पक्ष' },
      surname: 'Gaikwad',
      parents: { en: 'Shri Rohit & Smt Palak Gaikwad', mr: 'श्री रोहित व सौ. पलक गायकवाड' },
      relation: { en: 'Son of', mr: 'यांचे सुपुत्र' },
      familyLine: { en: 'The Gaikwad family, Nagpur', mr: 'गायकवाड परिवार, नागपूर' },
    } as FamilySide,
    blessing: {
      en: 'With the loving blessings of our grandparents',
      mr: 'आजी-आजोबांच्या प्रेमळ आशीर्वादाने',
    },
  },

  // TODO: replace (dummy) — the whole story below is placeholder text in a gentle Buddhist tone
  story: {
    milestones: [
      {
        title: { en: 'A first meeting, in metta', mr: 'मैत्रीतून पहिली भेट' },
        text: {
          en: 'They met the way kindness meets kindness — easily, warmly, without hurry. Metta, loving-kindness, was there from the very first conversation.',
          mr: 'दयाळूपणाला दयाळूपणा भेटावा तशी त्यांची भेट झाली — सहज, उबदार, न घाई करता. पहिल्याच संवादात मैत्री (मेत्ता) होती.',
        },
      },
      {
        title: { en: 'Walking the middle path', mr: 'मध्यम मार्गावर एकत्र' },
        text: {
          en: 'A nurse’s compassion and an engineer’s patience — two temperaments that found balance together, neither too much nor too little.',
          mr: 'परिचारिकेची करुणा आणि अभियंत्याचा संयम — दोन स्वभावांनी एकत्र संतुलन शोधले, ना अति, ना कमी.',
        },
      },
      {
        title: { en: 'Families met on Buddha Purnima', mr: 'बुद्ध पौर्णिमेला कुटुंबांची भेट' },
        text: {
          en: 'Under a full moon, the Fulzele and Gaikwad families shared kheer, laughter and blessings — and two homes began to feel like one.',
          mr: 'पौर्णिमेच्या चांदण्यात फुलझेले आणि गायकवाड कुटुंबांनी खीर, हास्य आणि आशीर्वाद वाटले — आणि दोन घरे एक वाटू लागली.',
        },
      },
      {
        title: { en: 'A promise in karuna', mr: 'करुणेतून दिलेले वचन' },
        text: {
          en: 'With karuna — compassion — as their guide, they choose to walk the rest of the path side by side.',
          mr: 'करुणेला मार्गदर्शक मानून, पुढचा प्रवास हातात हात घालून चालण्याचा त्यांनी निर्णय घेतला.',
        },
      },
    ],
  },

  /** Listed in this order everywhere: tabs, celebrations, calendar. */
  events: [
    {
      id: 'haldi',
      name: { en: 'Haldi', mr: 'हळद' },
      start: '2027-02-13T09:00:00', // TODO: replace (dummy) — Haldi date & time
      hours: 3,
      venue: 'Takalghat',
      address: { en: 'Fulzele residence, Takalghat', mr: 'फुलझेले निवास, टाकळघाट' }, // TODO: replace (dummy) — exact Haldi address
      mapLink: 'https://maps.app.goo.gl/gC4byGGFuCgBHnUV8',
      mapQuery: 'Takalghat, Nagpur, Maharashtra',
      dressCode: { en: 'Shades of yellow', mr: 'पिवळ्या रंगछटा' },
      description: {
        en: 'Turmeric, laughter and marigolds — the bride is blessed by family at home in Takalghat.',
        mr: 'हळद, हास्य आणि झेंडूची फुले — टाकळघाट येथे वधूला कुटुंबाचे आशीर्वाद.',
      },
    },
    {
      id: 'wedding',
      name: { en: 'Wedding', mr: 'शुभविवाह' },
      start: '2027-02-14T11:30:00', // TODO: replace (dummy) — date is real, 11:30 AM time is dummy
      hours: 4,
      venue: 'Rajwada Palace, Nagpur',
      address: { en: 'Rajwada Palace, Nagpur, Maharashtra', mr: 'राजवाडा पॅलेस, नागपूर' },
      mapLink: null, // TODO: replace (dummy) — exact Rajwada Palace pin link; until then a Google Maps search for mapQuery is used
      mapQuery: 'Rajwada Palace Nagpur',
      dressCode: { en: 'White, pastel or traditional', mr: 'पांढरा, फिकट रंग किंवा पारंपरिक' },
      description: {
        en: 'Vows taken in the light of the Dhamma, surrounded by the people we love.',
        mr: 'धम्माच्या प्रकाशात, आपल्या प्रियजनांच्या साक्षीने विवाहबंधन.',
      },
    },
  ] satisfies BodhiEvent[],

  /** Panchsheel — the five precepts, each with a one-line meaning for a shared life. */
  precepts: [
    {
      pali: 'Pāṇātipātā veramaṇī',
      word: 'अहिंसा',
      title: { en: 'Non-harming', mr: 'अहिंसा' },
      meaning: { en: 'To protect all life, and meet each other with gentleness.', mr: 'सर्व जीवांचे रक्षण करणे आणि एकमेकांशी सौम्यतेने वागणे.' },
    },
    {
      pali: 'Adinnādānā veramaṇī',
      word: 'अस्तेय',
      title: { en: 'Generosity', mr: 'अस्तेय' },
      meaning: { en: 'To take only what is freely given, and give freely in return.', mr: 'जे स्वेच्छेने दिले तेच घेणे आणि मोकळ्या मनाने देणे.' },
    },
    {
      pali: 'Kāmesu micchācārā veramaṇī',
      word: 'शील',
      title: { en: 'Faithfulness', mr: 'सदाचार' },
      meaning: { en: 'To honour this bond with loyalty, care and respect.', mr: 'या नात्याचा निष्ठा, काळजी आणि आदराने सन्मान करणे.' },
    },
    {
      pali: 'Musāvādā veramaṇī',
      word: 'सत्य',
      title: { en: 'Truthful speech', mr: 'सत्य वचन' },
      meaning: { en: 'To speak truly and kindly, even when silence would be easier.', mr: 'मौन सोपे असतानाही खरे आणि प्रेमळ बोलणे.' },
    },
    {
      pali: 'Surāmeraya-majja-pamādaṭṭhānā veramaṇī',
      word: 'सजगता',
      title: { en: 'Mindfulness', mr: 'सजगता' },
      meaning: { en: 'To keep a clear, awake mind — present for every moment together.', mr: 'मन स्वच्छ आणि जागृत ठेवणे — प्रत्येक क्षणी एकमेकांसाठी उपस्थित.' },
    },
  ],

  /** Short traditional Pali blessings (public-domain wording, our own translations). */
  blessings: [
    { pali: 'Bhavatu Sabba Maṅgalaṃ', en: 'May all blessings be yours — may all beings be happy.', mr: 'सर्वांचे मंगल होवो — सर्व प्राणी सुखी होवोत.' },
    { pali: 'Sabbe Sattā Sukhitā Hontu', en: 'May all beings be well and at ease.', mr: 'सर्व प्राणी सुखी आणि शांत असोत.' },
    { pali: 'Mettā', en: 'May you be safe, may you be peaceful, may you walk with an open heart.', mr: 'आपण सुरक्षित असा, शांत असा, खुल्या मनाने वाटचाल करा.' },
  ],

  venueNotes: {
    parking: { en: 'Parking available inside the palace grounds', mr: 'पॅलेस परिसरात पार्किंगची सोय आहे' } as Bilingual | null, // TODO: replace (dummy) — confirm parking
    contact: { en: 'For help on the day: Sanket · +91 83810 01406', mr: 'मदतीसाठी: संकेत · +91 83810 01406' } as Bilingual | null,
  },

  gallery: [
    // Add couple photos here — each hangs as a polaroid from the Bodhi branch.
    // { src: '/invites/bodhi-wedding/photo-1.webp', caption: 'First trip' },
  ] as { src: string; caption: string }[],

  rsvp: {
    contactName: 'the Fulzele family' as string | null, // TODO: replace (dummy) — who receives RSVPs (name)
    /** Digits with country code — +91 8381001406 */
    whatsappNumber: '918381001406',
    maxGuests: 10,
  },

  music: {
    // The family's Buddhist track. Starts only after the envelope is opened.
    src: '/songs/buddha-song.mp3',
    title: 'Buddha song',
  },

  closingQuote: { en: 'Peace comes from within.', mr: 'शांती अंतर्मनातून येते.' },
  closingSignoff: { en: 'With love, Aarti & Akhilesh Gaikwad', mr: 'प्रेमपूर्वक, आरती व अखिलेश गायकवाड' },
}

export type BodhiConfig = typeof bodhiWedding

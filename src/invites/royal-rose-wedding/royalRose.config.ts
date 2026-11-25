/**
 * ─────────────────────────────────────────────────────────────
 *  Royal Rose — a velvet-book wedding invitation
 *
 *  The wedding data (names, families, dates, events, venues, map links,
 *  RSVP number, song) is shared with the Bodhi invitation: it is read
 *  straight from ../bodhi-wedding/bodhiWedding.config.ts so there is ONE
 *  place to edit it. Only this theme's photos and design copy live here.
 * ─────────────────────────────────────────────────────────────
 */
import { bodhiWedding, type Bilingual, type BodhiEvent } from '../bodhi-wedding/bodhiWedding.config'

export const W = bodhiWedding

const base = '/invites/royal-rose-wedding'

export const royalRose = {
  meta: {
    pageTitle: `${W.groom.first} & ${W.bride.first} — Wedding Invitation`,
  },

  /** This theme's own song (Bodhi keeps its Buddha song). Fades in when the book opens, loops. */
  music: { src: '/songs/vaaroon-forever.mp3', title: 'Vaaroon — Forever' },

  /** First page: a softly blurred, slowly zooming photo inside a gold arch (pre-blurred file). */
  heroPhoto: `${base}/hero-blur.webp`,

  // NOTE: these sample photos show other couples — replace with Aarti & Akhilesh's own photos.
  /** "Our Story" carousel — captions come from the shared story milestones. */
  story: [
    { src: `${base}/story-1.webp`, alt: 'A bride and groom in red, foreheads touching on a tree-lined path', milestone: 0 },
    { src: `${base}/story-2.webp`, alt: 'The couple walking together along a leafy road', milestone: 1 },
    { src: `${base}/story-3.webp`, alt: 'The couple in royal wedding attire, embracing', milestone: 2 },
  ],

  copy: {
    together: { en: 'Together with their Families', mr: 'आपल्या कुटुंबियांसह' } as Bilingual,
    inviteLine: {
      en: 'request the honour of your presence as they begin their journey together',
      mr: 'आपल्या सहजीवनाच्या शुभारंभास आपली उपस्थिती प्रार्थनीय आहे',
    } as Bilingual,
    tapBook: { en: 'Tap the book to open', mr: 'उघडण्यासाठी पुस्तकावर स्पर्श करा' } as Bilingual,
    saveTheDate: { en: 'Save the Date', mr: 'तारीख लक्षात ठेवा' } as Bilingual,
    pullHint: { en: 'Pull the tassel', mr: 'गोंडा खाली ओढा' } as Bilingual,
    festivities: { en: 'Wedding Festivities', mr: 'विवाह सोहळे' } as Bilingual,
    ourStory: { en: 'Our Story', mr: 'आमची कहाणी' } as Bilingual,
    grand: { en: 'The Grand Celebration', mr: 'मुख्य सोहळा' } as Bilingual,
    location: { en: 'Location', mr: 'स्थळ' } as Bilingual,
    closing: { en: "We can't wait to celebrate with you", mr: 'आपल्यासोबत हा आनंद साजरा करण्यास आम्ही उत्सुक आहोत' } as Bilingual,
    families: {
      en: `With love, the ${W.families.bride.surname} & ${W.families.groom.surname} Families`,
      mr: 'प्रेमपूर्वक, फुलझेले व गायकवाड परिवार',
    } as Bilingual,
  },
}

/** Art direction per function: dress-code swatches and the card's scene. */
export const EVENT_LOOK: Record<BodhiEvent['id'], { swatches: string[]; tint: string; accent: string }> = {
  haldi: { swatches: ['#f2c230', '#f7dc6f', '#e8a33d'], tint: '#fbe39a', accent: '#b9770e' },
  wedding: { swatches: ['#ffffff', '#f4e4d4', '#d9b46a'], tint: '#f6d7cf', accent: '#6e1f2f' },
  reception: { swatches: ['#6e1f2f', '#c6a15b', '#f7e1df'], tint: '#e7c2c6', accent: '#6e1f2f' },
  sangeet: { swatches: ['#7b4bb3', '#e07ab0', '#f2c1dc'], tint: '#e2c9f0', accent: '#6b3fa0' },
}

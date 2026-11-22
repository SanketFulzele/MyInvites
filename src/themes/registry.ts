import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type ThemeCategory =
  | 'Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Haldi & Mehendi'
  | 'Anniversary'
  | 'Baby Shower'
  | 'Celebration'

export interface ThemeMeta {
  /** URL slug — the invitation lives at /invite/:slug */
  slug: string
  title: string
  category: ThemeCategory
  description: string
  /** Short mood words shown as chips on the card */
  highlights: string[]
  /** Which preview artwork the theme card renders */
  preview: 'iron-man' | 'sakura'
  /** Lazily loaded so each theme ships as its own bundle */
  component: LazyExoticComponent<ComponentType>
}

/**
 * Every invitation theme is registered here.
 * To add a theme: create src/invites/<slug>/ with its own config + components,
 * then append an entry below. Nothing else in the app needs to change.
 */
export const themes: ThemeMeta[] = [
  {
    slug: 'iron-man-wedding',
    title: 'Iron Man',
    category: 'Wedding',
    description:
      'A cinematic, arc-reactor-lit wedding invitation in metallic red and gold — with hidden surprises for every Marvel fan on the guest list.',
    highlights: ['Cinematic intro', 'Hidden Easter eggs', 'Live countdown', 'RSVP'],
    preview: 'iron-man',
    component: lazy(() => import('../invites/iron-man-wedding/IronManInvite')),
  },
  {
    slug: 'sakura-wedding',
    title: 'Sakura',
    category: 'Wedding',
    description:
      'A hand-painted anime romance: dusk skies, endless sakura petals and an original film-style score — made for Anushka & Virat.',
    highlights: ['Anime romance', 'Sakura petals', 'Original score', 'English + Hindi'],
    preview: 'sakura',
    component: lazy(() => import('../invites/sakura-wedding/SakuraInvite')),
  },
]

export const getTheme = (slug: string | undefined) => themes.find((t) => t.slug === slug)

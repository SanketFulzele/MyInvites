# My Invites

*Every Celebration Deserves Its Own Story.*

A digital invitation platform: a homepage for all themes, plus individual, mobile-first invitation experiences.

Stack: React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React + React Router.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage (hero, themes, about, contact) |
| `/themes` | All invitation themes |
| `/invite/:slug` | An individual invitation, e.g. `/invite/iron-man-wedding` or `/invite/sakura-wedding` |

## Editing the Sakura anime wedding invitation

All guest-facing copy is in **`src/invites/sakura-wedding/config.ts`** (Anushka & Virat · 26 March 2027 · Nagpur). Values marked `SAMPLE` are placeholders. See `docs/sakura-anime-wedding-plan.md` for the full design plan.

- **Petals** fall continuously across every section (`z-30`) and on the entry screen; they pause for `prefers-reduced-motion`.
- **Music** currently plays `public/songs/Suzume.mp3` on repeat, starting only after **Enter**, with the toggle in the side drawer. To swap in a different track, replace the file (or change `music.src` in `config.ts`) and update `music.title`. If the file is missing or fails to load, the original generated score (`src/lib/sakuraScore.ts`) automatically plays instead.
  Note: you are responsible for having the rights to any audio you host publicly. `listen.url` controls the "Hear the film theme" link in the side drawer.
- **Audio controls live only in the side drawer** — never on the main page.

## Editing the Bodhi wedding invitation

Route: `/invite/bodhi-wedding` (Aarti & Akhilesh · Rajwada Palace, Nagpur). Every name, date, link and line is in **`src/invites/bodhi-wedding/bodhiWedding.config.ts`**.

- Values the family hasn't sent yet are `null`. The page shows "to be announced" instead, and the countdown, Add to Calendar and exact map pins switch on as soon as you fill in `weddingDateTime`, each event's `start`, `address` and `mapLink`.
- **Music** plays `public/songs/buddha-song.mp3` on loop, starting only after the guest opens the envelope. To change it, replace the file or edit `music.src`.
- **Photos**: set `bride.photo` / `groom.photo` for the arched frames, and add entries to `gallery` for the hanging polaroids. Until then, illustrated stand-ins are shown.
- **Personal link**: `/invite/bodhi-wedding?guest=Name` shows "Dear Name, you are invited" on the envelope.

## Editing the Iron Man wedding invitation

All guest-facing content is in **`src/invites/iron-man-wedding/config.ts`**: names, dates, events, families, venue, map, photos, RSVP number and music.
Photos and cards live in `public/invites/iron-man-wedding/`.

- **RSVP on WhatsApp**: set `rsvp.whatsappNumber` (for example `919876543210`). If it's empty, WhatsApp asks the guest to pick a contact.
- **Music**: put an mp3 in the public folder and set `music.src`. If it's empty, a soft generated ambient score plays. Music only starts after the guest taps **Enter Invitation**.
- **Story**: currently a sample (`story.isSample: true`). Replace it with the couple's own words, then set `isSample` to `false`.

## Adding a new theme

1. Create `src/invites/<slug>/` with its own `config.ts` and components.
2. Add an entry to `src/themes/registry.ts` (slug, title, category, description, lazy component).
3. It appears on the homepage and `/themes`, and is served at `/invite/<slug>`. Each theme is code-split into its own bundle.

## Deploying

This is a static SPA. `vercel.json` (Vercel) and `public/_redirects` (Netlify) already rewrite all routes to `index.html`.

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
| `/invite/:slug` | An individual invitation, e.g. `/invite/iron-man-wedding` |

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

# Sakura Invitation — Cinematic Redesign Notes

## Outcome

`/invite/sakura-wedding` is now a continuous anime "episode" experience — **Two Hearts, One Spring** — in a single Nakuru, Kenya dataset. The earlier Nagpur brief was superseded by the attached redesign specification, which was explicit about Nakuru venues, `Africa/Nairobi` and the four named sample locations.

## What changed

### Data (single source of truth)
- Added `src/data/wedding.ts` with typed `WeddingData`, `Ceremony`, `WeddingVenue`, plus keyless `mapsEmbedUrl()` / `mapsDirectionsUrl()` helpers.
- All guest-facing copy, dates, families, venues, RSVP config, music and credits live there. Every venue is `isSample: true`; coordinates carry `// TODO: confirm` comments.
- Extended `src/invites/types.ts` with optional `stats`, `dialogue`, `venueId`, `scene`, `kanji`, `dressCode` fields. The old `src/invites/sakura-wedding/config.ts` was removed.

### Design tokens and primitives
- Extended `sakura-*` tokens in `src/index.css` with `dawn`, `blossom`, `sumi`, `vermilion`, `matcha`, `wisteria`, `lantern`, `night`, `gold-leaf`, `flamingo`; added washi paper, scene grain, vertical Japanese and ink-wipe utilities. Original `sakura-*` tokens were preserved.
- `index.html` now loads Shippori Mincho and Pinyon Script; Great Vibes is only a fallback.
- Shared primitives in `src/components/anime/`: `EpisodeTitle`, `BilingualText`, `Seal`, `RedString`, `ParallaxScene`, `InkTransition`, `VenueMap`, `DirectionsButton`, `AddToCalendar`, `EpisodeNav`, `ScrollBranch`.
- Generic, theme-neutral `src/components/site/InviteLoader.tsx` replaced the Iron Man/nova-styled spinner in `App.tsx`; it works for every invitation.

### Art and petals
- Removed the old CSS `Petals` component entirely. One page-wide canvas `PetalField` (`src/art/PetalField.tsx`) draws four Path2D petal shapes with gradients, veins, gravity, drag, sway, flip, depth, gusts and scroll response; capped at 25 mobile / 60 desktop, paused when hidden, absent with reduced motion. Props allow section-local tinted fields (`position="absolute"`).
- New original SVG art: `SakuraTree`, `SakuraBranch`, and seven layered scenes in `Landscapes.tsx` (`DawnValley`, `RiverBridge`, `WisteriaGarden`, `MatsuriNight`, `ShrineMandap`, `LakeGoldenHour`, `StarryNight`). Scenes accept `imageSrc` and keep SVG layers as foreground parallax.

### Sections (12 + aliases)
`src/sections/` now contains prop-free components in page order:
`top`, `letter`, `couple`, `spring` (new), `story`, `journey` (new, with `#venue` alias), `events`, `countdown`, `family`, `keepsake`, `rsvp`, `closing`.
Each uses a distinct layout grammar: cinematic intro, unfolding washi letter, split-screen profiles, horizontal pan, manga grid, sealed scroll/treasure map, four full-bleed arcs, lantern countdown, facing crests, downloadable keepsake, ema plaque and ending credits.
Old section components, `Sky`, `SakuraBranch` and `Reveal` under `src/invites/sakura-wedding/components/` were deleted; `WelcomeScreen` now uses the new art layer.

### Interactions preserved
- Route `/invite/sakura-wedding` and every original section id (plus `#venue` alias).
- Audio starts only after **Enter**, loops `public/songs/Suzume.mp3`, falls back to `SakuraScore`, and is toggled only in the side drawer.
- RSVP still builds the same WhatsApp `wa.me` link from `wedding.rsvp.whatsappNumber` and page title, now from the ema UI with validation and `aria-live` status.

### Easter eggs
`src/easter-eggs/` holds a 12-egg registry, persisted `localStorage` progress, the 7-orb hunt with a Wish moment (original golden dragon), ramen bowls, butterfly ornament, straw hat, leaf swirl and Konami aura. All are focusable buttons with labels and reduced-motion fallbacks.

### Technology
Added `gsap`, `@gsap/react`, `lenis`, `html-to-image`; kept `framer-motion`. Lenis is synced to ScrollTrigger and disabled with reduced motion. Heavy scenes are reached through the lazily loaded invite route.

## Optional artwork slots

Drop files into `public/art/` and pass their paths as `imageSrc` in the relevant section (or extend `src/data/wedding.ts` with art paths). See `public/art/README.md` for dimensions. Slots:
`hero-bg.webp`, `couple-illustration.webp`, `river-bridge.webp`, `mehndi-scene.webp`, `sangeet-scene.webp`, `wedding-scene.webp`, `reception-scene.webp`, `starry-night.webp`, `sakura-portrait.webp`, `virat-portrait.webp`.

## Editing the content

Edit **`src/data/wedding.ts`**. Do not edit section components to change names, dates, copy or venues. Replace every `SAMPLE` value (names, venues, muhurat, dress codes, family details), confirm the four venue coordinates, and set a real `rsvp.whatsappNumber`. Venue URLs are generated from `placeQuery`, so they keep working without an API key.

## Verification

- `npm run build` — passes.
- `npm run lint` — no errors; only pre-existing warnings in Iron Man helpers and `useCountdown`.
- Browser smoke test — welcome/Enter, audio request, all 13 anchors, one `h1`, no console errors, sealed scroll opens and mounts four lazy map iframes.
- Responsive and reduced-motion checks — see QA output appended by the verification script.

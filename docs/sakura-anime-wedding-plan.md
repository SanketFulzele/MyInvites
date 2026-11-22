# Sakura — Anime Wedding Invitation

**Design & experience plan · v1 — implemented**
Couple: **Anushka & Virat** · Date: **26 March 2027** · City: **Nagpur**
Route: `/invite/sakura-wedding`

> Status: the invitation has been built from this plan. The sections and systems below describe what is in the site now. `SAMPLE` values still need your real details.

**Music note:** the film's actual song is copyrighted, so it is not bundled. The site plays an original Suzume-inspired score and offers a drawer link to the official theme plus an MP3 slot in config.

**Homepage:** the Sakura theme is registered in `src/themes/registry.ts` and links to `/invite/sakura-wedding`. The site shell is now a dark "nova" system (deep space, aurora light, glass panels) instead of the old brown/beige palette. React Bits–style **Aurora**, **Spotlight Card**, **Marquee** and **Magnetic** effects sit alongside Motion-style word reveal, rotating category text and scroll progress. Both invitations have always-visible direct buttons — **Open Sakura Wedding** and **Open Iron Man Wedding** — in the hero, the "My Invitations" section, the navbar, mobile menu and footer. Petals sit above the section backgrounds (`z-30`) and also fall across the entry screen.

---

## 0. Decisions locked from our discussion

| Topic | Decision |
| --- | --- |
| Visual world | Original, Shinkai-style romantic anime: dusk sky, backlit sakura, watercolour clouds, fine gold hairlines, washi-paper grain. **No licensed characters, frames or logos.** |
| Language | English headlines + warm Hindi lines for the ceremonial/family copy. (Marathi can be added later.) |
| Photos | None for now. The couple moment is carried by original CSS/SVG illustration and typography. Photo slots can be added later without redesigning. |
| Petals | Sakura petals fall **continuously, non-stop**, across the entire invitation — fixed layer above the background, below the content. |
| Music | Original anime-film-style score generated in the browser (soft piano plucks + string pad + breathy flute, bittersweet major-key swell). Starts only after the guest taps **Enter**. **No copyrighted anime soundtrack is bundled.** A slot for a licensed MP3 stays in the config. |
| Sound control | **Only inside the side drawer** (hamburger). No music button on the main screen or bottom dock. |
| Design bar | Senior-product quality: restraint, hierarchy, spacing, legibility. No HUD, scanlines, glitch, neon, flashing, fake badges or click-to-reveal gimmicks. Small, purposeful motion only. |

---

## 1. The feeling we are designing

The Iron Man invite is *cinematic, metallic, engineered*. This one is its opposite: **quiet, warm, hand-painted, breathable**.

A guest should feel they have opened a letter at golden hour under a sakura tree — not watched a trailer. Everything serves that: slow fades, generous empty space, thin rules, paper texture, and one clear focal point per screen.

**One-line concept:** *"A letter that falls like a petal — 26 March 2027, Nagpur."*

### Palette

| Role | Colour | Use |
| --- | --- | --- |
| Dusk ink | `#221A33` | Primary text on light surfaces, deep backgrounds |
| Twilight indigo | `#2E2A55` | Top of sky gradients |
| Rose haze | `#E9AFC0` | Mid sky, petal accents |
| Sakura blush | `#F7D9E1` | Petals, soft fills |
| Paper cream | `#FFF9F2` | Cards, letter surfaces |
| Antique gold | `#C6A46A` | Hairlines, dividers, small details |
| Plum shadow | `#4A2F45` | Footer/closing depth |

Gradients: `indigo → rose haze → warm cream` for the sky; `cream → blush` for paper sections. No saturated pink, no neon glow.

### Type

- **Display:** Cormorant Garamond (already loaded) — names, section titles, date.
- **Body / UI:** Manrope (already loaded) — copy, labels, buttons.
- **Hindi:** add Noto Serif Devanagari to `index.html` font request (currently only a Marathi Devanagari face is loaded).
- **Script:** Great Vibes — **one use only**, on the closing signature. Never on body copy or headings.

### Motion language

- Entrances: `opacity 0 → 1` + `translateY 12px → 0`, 500–700 ms, ease `[0.22, 1, 0.36, 1]`.
- Petals: continuous, slow, irregular, 12–22 s per pass. Never sync'd, never bouncy.
- Interaction: 2 px lift or a hairline drawing in. No scaling bounce, no shake, no confetti.
- `prefers-reduced-motion`: petals become a few static blossoms; entrances become instant fades; countdown still updates but without transition.

---

## 2. The section-by-section plan (mobile first)

Baseline viewport: 375 × 812. Everything is a single column; max content width ~440 px, centred, with 20–24 px side gutters and `env(safe-area-inset-bottom)` respected.

### 2.0 Entry scene — "open the letter"

- Full-screen dusk sky, soft sun low on the horizon, a single sakura branch entering from the top corner.
- Small overline: `एक निमंत्रण · AN INVITATION`.
- Centre: `Anushka` / `&` / `Virat` in Cormorant, then `26 · 03 · 2027` and `Nagpur` as quiet meta text.
- One primary button: **Enter the celebration** (paper-white pill, gold hairline). Tapping it is the user gesture that starts music and reveals the invitation.
- A line of micro-copy under the button: *"Sound on for the full experience"* — informational, not a control.
- On exit: the whole scene fades upward like a page being lifted; petals begin.

### 2.1 Hero — the first impression

- Sky gradient fills the viewport; layered watercolour cloud shapes and a distant hill silhouette (CSS/SVG, no photos).
- Frame: sakura branch top-left, a few petals foreground, generous empty sky in the middle.
- Content block low-centre: `Anushka & Virat`, one thin gold rule, `26 March 2027`, `Nagpur, Maharashtra`.
- Hindi whisper line: `प्रेम से आमंत्रित करते हैं` (to be confirmed with you).
- Small scroll cue: a 1 px vertical line with a petal dot sliding down. No bouncing arrow.

### 2.2 The letter — invitation & intro

- A single sheet of "washi paper" on a blush background: subtle noise texture, 1 px warm border, soft shadow.
- Top: `सादर आमंत्रण` small Hindi overline.
- Body: 2–3 short English lines inviting the guest, one Hindi line beneath. Typography does the work — no decorative icon pile.
- Bottom: a tiny gold sakura mark and `With love, both families`.

### 2.3 The couple — illustrated, not photographed

- A framed "petal portrait": original SVG scene — two simple line-art figures beneath a blooming sakura tree, or an elegant `A ♥ V` monogram made of two overlapping blossom outlines. One scene only.
- Caption under the frame: `Anushka` / `Virat` with a single line about their story.
- A gentle `bloom` reveal: blossoms open from 0.6 → 1 scale with fade, once.
- No photo placeholders boxed with "image coming soon" — if photos arrive later, this frame is the natural swap point.

### 2.4 Our story — three chapters

- A vertical hairline timeline with three petal-shaped nodes.
- Each chapter: small number `01 / 02 / 03`, short title (max 3–4 words), 2 lines of copy.
- Cards reveal on scroll with the standard fade + 12 px rise, staggered 120 ms.
- Copy is sample/placeholder until you give me real lines — flagged in config as `isSample: true`, same pattern as the Iron Man invite.

### 2.5 The celebrations — events

- Stacked paper cards, one per event, each ~72–90 px tall:
  - left: thin icon in a pale circle (Flower2 / Music2 / Sparkles / Heart),
  - middle: event name + Hindi name,
  - right: date + time in small caps.
- The **wedding** card gets a gold hairline and a `मुख्य समारंभ · THE WEDDING` label. Others stay quiet.
- Dummy schedule (changeable in `config.ts`):
  - 25 Mar 2027 · 5:30 PM — Mehendi
  - 25 Mar 2027 · 8:00 PM — Sangeet
  - 26 Mar 2027 · 11:30 AM — Wedding (placeholder muhurat)
  - 26 Mar 2027 · 7:00 PM — Reception
- All at the Nagpur venue unless you say otherwise. Tap a card → no modal, no gimmick; the venue line is simply present in the card footer.

### 2.6 The countdown — "the day approaches"

- Minimal: four numbers with thin separators (`DAYS  HRS  MIN  SEC`), tabular digits so nothing jitters.
- Background deepens to twilight; a few petals drift across.
- Underneath: `26 March 2027 · Nagpur` and a one-line Hindi note.
- No ticking sound, no flipping animation, no glow.

### 2.7 With our blessings — families

- Two stacked blocks with a small crest/monogram at the top of each.
- Groom side: `Virat`, `Son of …`, parents, city. Bride side: `Anushka`, `Daughter of …`, parents, city.
- Names + Hindi lines; details are **dummy** until you provide real ones.
- Divider between the blocks: a short gold rule with a single blossom in the centre.

### 2.8 The place — venue

- Paper card with: venue name (dummy, e.g. **The Sakura Gardens, Civil Lines, Nagpur** — clearly marked SAMPLE), address, landmark, and a `Open in Maps` text-link with a tiny arrow.
- Optional embedded static map tile with a single pin (Google Maps query from config), kept muted and low-contrast so it doesn't dominate.
- No fake QR gimmick unless you want one later.

### 2.9 The keepsake — digital card

- A vertical "invitation slip" that looks good enough to screenshot: names, date, venue, one blossom, fine border.
- This replaces the physical-card section of the Iron Man invite (we have no scanned cards for this couple).
- No download button required; guests can screenshot natively.

### 2.10 RSVP — "will you be there?"

- Direct, human: `आपकी उपस्थिति हमारे लिए सबसे बड़ा उपहार है`.
- Two pill buttons: **Yes, I'll be there** / **Sorry, I can't**. They open WhatsApp with a pre-filled message.
- `whatsappNumber` is empty for now → guest picks a contact; I'll add the family number when you give it.
- Small deadline line, e.g. *"Kindly reply by 10 March 2027"* (dummy).

### 2.11 Closing — until we meet

- Return to the dusk sky. A single blossom rests on the paper.
- `धन्यवाद` overline, `We can't wait to celebrate with you.` in Cormorant.
- Signature in Great Vibes: `Anushka & Virat`.
- Quiet `Back to the beginning` text link.

### 2.12 Side drawer — the only place for sound

- Trigger: small hamburger in the top-right, visible from the hero onward; frosted paper panel slides in from the right with a dimmed backdrop.
- Contents:
  1. Short title `The Invitation` + a tiny blossom.
  2. Section links: The letter · The couple · Our story · The celebrations · The place · RSVP.
  3. **Sound** row: label `Soundscape`, sub-label `Original anime-inspired score`, and a play/pause toggle with icon + state text. **This is the only audio control on the site.**
  4. Nothing else — no settings pile, no extra toggles.
- Closes on backdrop tap, link tap, or Escape. Focus trapped while open; `aria-expanded` / `aria-label` set correctly.
- Music pauses automatically when the tab is hidden and resumes when the guest returns (unless they explicitly turned it off).

---

## 3. The petals & sound systems (the two "always on" pieces)

### Petals — `components/Petals.tsx`

- One fixed, `pointer-events-none` layer for the whole invitation; z-index between backdrop and content.
- 14–18 petals on phones, ~24 on larger screens; 3 pink tones, 6–14 px, opacity 0.35–0.7.
- Each petal has its own duration, delay, horizontal drift (sine-ish sway), rotation and scale — so the field never looks like a loop.
- Uses CSS `transform: translate3d(...)` only; no layout-triggering properties. Pause when tab hidden; freeze/reduce for `prefers-reduced-motion`.

### Sound — `lib/sakuraScore.ts` + `components/useMusic.ts`

- Web Audio API, built from oscillators and gain envelopes so nothing is downloaded:
  - **Pad:** slow string-like chords (I–V–vi–IV feel), 2 s attack, long release.
  - **Plucks:** piano/marimba-like notes on a gentle 6/8 pulse (~76 BPM).
  - **Flute:** sparse sine/triangle line with vibrato, entering after the first loop.
  - Soft delay for space; master gain ramps in over ~2.5 s and out over ~0.8 s.
- Same lifecycle as the existing hook: starts on the Enter gesture only, pauses on hidden tab, cleans up on unmount.
- `config.music.src` remains an empty-by-default slot: drop a licensed MP3 in `public/invites/sakura-wedding/` and it replaces the generated score with zero UI changes.

---

## 4. How it maps into this codebase

New files (planned, not created yet):

```
docs/sakura-anime-wedding-plan.md          ← this document
src/invites/sakura-wedding/
  SakuraInvite.tsx                          ← composition root + page chrome
  config.ts                                 ← all guest-facing copy (types from invites/types.ts)
  components/
    Petals.tsx
    WelcomeScreen.tsx
    SideDrawer.tsx                          ← section links + the ONLY sound toggle
    useMusic.ts
    HeroSection.tsx
    LetterSection.tsx
    CoupleSection.tsx
    StorySection.tsx
    EventsSection.tsx
    CountdownSection.tsx
    FamilySection.tsx
    VenueSection.tsx
    KeepsakeSection.tsx
    RsvpSection.tsx
    ClosingSection.tsx
src/lib/sakuraScore.ts                      ← generated original score
```

Edits to existing files:

| File | Change |
| --- | --- |
| `src/themes/registry.ts` | Add `preview: 'sakura'` to the union and a new `ThemeMeta` entry for `/invite/sakura-wedding`. |
| `src/components/site/ThemePreview.tsx` | Add a pure-CSS `SakuraPreview`: dusk sky, sun disc, blossom branch, drifting petal dots. |
| `src/index.css` | Add sakura palette variables, `@keyframes` for petal drift / bloom / soft sway. Do **not** touch Iron Man styles. |
| `index.html` | Add Noto Serif Devanagari to the existing Google Fonts request. |
| `README.md` | Document the new invite, its config, and the music slot. |

Reuse, don't rewrite: `WeddingInviteConfig` types, `useCountdown`, `useReducedMotion`, `lib/date.ts` (formatting), the registry/routing pattern, and the "config drives all copy" approach.

---

## 5. Content currently marked SAMPLE (dummy until you confirm)

- Family names, parents, cities on both sides.
- Venue name/address in Nagpur (placeholder: The Sakura Gardens, Civil Lines).
- Event times on 25–26 March 2027.
- Story chapters (3 short lines).
- RSVP WhatsApp number and reply-by date.
- Hindi lines: `प्रेम से आमंत्रित करते हैं`, `सादर आमंत्रण`, `मुख्य समारंभ`, `धन्यवाद` — please correct the wording if it doesn't feel right.

Confirmed and fixed: **Anushka** (bride), **Virat** (groom), **26 March 2027**, **Nagpur**, English + Hindi, no photos, original score, petals always on.

---

## 6. Build order (completed)

1. **Foundation** — config, palette/fonts, entry scene, hero, petal field, side drawer, audio engine. At the end of this step the "feel" is already visible.
2. **Content sections** — letter, couple illustration, story, events, countdown, family, venue, keepsake, RSVP, closing.
3. **Polish & QA** — responsive check at 360/375/430 px, reduced-motion pass, contrast/focus pass, `npm run build`, then a quick visual review.

---

## 7. What I need from you to update this plan

- Is the section order right? Anything to remove, add, or merge (e.g. drop the keepsake slip, add a Haldi ceremony)?
- Correct/approved Hindi lines and event times.
- Real family names, venue, and RSVP number whenever you have them.
- Do you want the hamburger always visible, or only after the hero?
- Any colour you want changed (the rose-gold balance is the main dial).

Tell me the edits and I'll revise this document before writing any website code.

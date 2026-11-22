# Optional artwork slots

The anime artwork in `src/art/` is drawn entirely with SVG and canvas, so the
invitation works with **no image files at all**. Every scene component accepts
an optional `imageSrc` prop: when a file is present it is painted as a full-bleed
background (`object-cover`) and the original SVG layers stay in front as the
parallax pass. When `imageSrc` is omitted, the SVG artwork is the complete
scene — there is nothing else to configure.

Drop files in this folder using the exact names below and pass the matching path
as `imageSrc` (for example `imageSrc="/art/river-bridge.webp"`).

| Slot | Used by | Recommended dimensions | Format / notes |
| --- | --- | --- | --- |
| `hero-bg.webp` | `DawnValley` / opening hero | 2400 × 1350 (16:9, safe for tall crops) | WebP, quality ~82; soft dawn palette, keep the centre third quiet for type |
| `couple-illustration.webp` | Couple episode / keepsake | 1200 × 1500 (4:5) | WebP **with alpha**; painterly cut-out, no background |
| `river-bridge.webp` | `RiverBridge` | 2400 × 1350 | WebP; moon bridge and river, leave the upper sky open |
| `mehndi-scene.webp` | `WisteriaGarden` | 2000 × 1400 | WebP; dusk garden, violet and gold palette |
| `sangeet-scene.webp` | `MatsuriNight` | 2400 × 1350 | WebP; night festival, keep the top third dark for lanterns and type |
| `wedding-scene.webp` | `ShrineMandap` | 2400 × 1350 | WebP; torii and mandap centred, warm god-ray light |
| `reception-scene.webp` | `LakeGoldenHour` | 2400 × 1350 | WebP; golden shoreline, leave the lower-left shore clear for the Easter egg |
| `starry-night.webp` | `StarryNight` | 2400 × 1350 | WebP; deep indigo field, keep room at the top right for the moon |
| `sakura-portrait.webp` | `SakuraTree` / `SakuraBranch` | 1000 × 1400 | WebP **with alpha**; portrait cut-out framed by blossoms |
| `virat-portrait.webp` | `SakuraTree` / `SakuraBranch` | 1000 × 1400 | WebP **with alpha**; portrait cut-out framed by blossoms |

## Guidelines

- WebP is preferred for its size; keep an alpha channel only for the portrait
  and illustration cut-outs. A PNG is acceptable if transparency is needed and
  file size is not a concern.
- Avoid text, logos, franchise characters and traced frames — all artwork in
  this project is original.
- Images are decorative backgrounds: always keep the SVG foreground so the
  `data-depth` parallax and film grain still work.
- The canvas petal layer (`PetalField`) is independent of these slots and needs
  no image assets.

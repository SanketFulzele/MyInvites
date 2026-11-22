import { useRef } from 'react'
import { LakeGoldenHour, RiverBridge } from '../art/Landscapes'
import PetalField from '../art/PetalField'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import EasterEgg from '../easter-eggs/EasterEgg'
import { wedding, type WeddingData } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsapSetup'

type Person = WeddingData['bride']

/** Original line-art silhouette: bride on the sakura riverbank, hand extended. */
function BrideSilhouette() {
  return (
    <svg
      viewBox="0 0 320 520"
      className="pointer-events-none absolute bottom-0 left-1/2 h-[82%] w-auto max-w-none -translate-x-1/2"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cs-kimono" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b6a85" />
          <stop offset="0.55" stopColor="#6d4a67" />
          <stop offset="1" stopColor="#3d2a3d" />
        </linearGradient>
      </defs>
      {/* Hair bun and hair fall */}
      <path d="M120 84 C116 44 204 40 204 86 C222 106 218 158 198 178 L122 178 C102 156 100 106 120 84 Z" fill="#2a1c2d" />
      <circle cx="208" cy="62" r="20" fill="#2a1c2d" />
      <path d="M204 48 C224 40 240 50 244 66" fill="none" stroke="#c9a45c" strokeWidth="2.4" strokeLinecap="round" />
      {/* Face and neck */}
      <ellipse cx="160" cy="120" rx="33" ry="40" fill="#f0c6b4" />
      <path d="M146 156 L146 178 Q160 190 174 178 L174 156 Z" fill="#e2b2a1" />
      <path d="M128 94 Q160 72 192 94 Q186 78 160 78 Q134 78 128 94 Z" fill="#2a1c2d" />
      {/* Kimono body and sleeves */}
      <path d="M160 176 C112 184 82 228 72 326 L46 520 L274 520 L248 326 C238 228 208 184 160 176 Z" fill="url(#cs-kimono)" />
      <path d="M160 178 L120 226 L160 258 L200 226 Z" fill="#f7d9e1" opacity="0.85" />
      <path d="M72 326 L28 372 L52 398 L92 350 Z" fill="#5b3b56" />
      <path d="M160 258 L160 520" stroke="#f4c6d0" strokeOpacity="0.55" strokeWidth="3" />
      <path d="M96 322 Q160 358 224 322" fill="none" stroke="#c9a45c" strokeOpacity="0.7" strokeWidth="4" />
      {/* Extended hand — a red-thread anchor */}
      <path d="M218 252 C250 246 282 252 306 266 L302 288 C274 276 246 276 216 282 Z" fill="#f0c6b4" />
      <circle data-thread="" cx="306" cy="276" r="9" fill="#f6d2c0" stroke="#c98e86" strokeWidth="1.5" />
    </svg>
  )
}

/** Original line-art silhouette: groom at Nakuru golden hour, hand extended. */
function GroomSilhouette() {
  return (
    <svg
      viewBox="0 0 320 520"
      className="pointer-events-none absolute bottom-0 right-1/2 h-[82%] w-auto max-w-none translate-x-1/2"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cs-suit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d3449" />
          <stop offset="0.6" stopColor="#272339" />
          <stop offset="1" stopColor="#171526" />
        </linearGradient>
      </defs>
      {/* Head and hair */}
      <path d="M126 76 C126 40 194 40 194 76 L198 118 C192 138 128 138 122 118 Z" fill="#2b2230" />
      <ellipse cx="160" cy="114" rx="33" ry="39" fill="#d9a68e" />
      <path d="M126 88 Q160 68 194 88 L194 76 Q160 54 126 76 Z" fill="#2b2230" />
      <path d="M146 150 L146 176 Q160 188 174 176 L174 150 Z" fill="#c9947e" />
      {/* Sherwani-style coat */}
      <path d="M160 174 C110 182 78 228 70 328 L44 520 L276 520 L250 328 C242 228 210 182 160 174 Z" fill="url(#cs-suit)" />
      <path d="M160 176 L136 226 L160 262 L184 226 Z" fill="#f3e0bd" opacity="0.9" />
      <path d="M160 262 L160 520" stroke="#c9a45c" strokeOpacity="0.75" strokeWidth="3" />
      <path d="M102 324 Q160 358 218 324" fill="none" stroke="#c9a45c" strokeOpacity="0.4" strokeWidth="4" />
      <path d="M232 300 L252 300 L246 360 L226 360 Z" fill="#3a2f45" />
      {/* Extended hand — a red-thread anchor */}
      <path d="M102 252 C70 246 38 252 14 266 L18 288 C46 276 74 276 104 282 Z" fill="#d9a68e" />
      <circle data-thread="" cx="14" cy="276" r="9" fill="#e5b49c" stroke="#a96f61" strokeWidth="1.5" />
    </svg>
  )
}

/** An illustrated dossier strip, deliberately not a glass card. */
function Profile({ person, index, mirror = false }: { person: Person; index: string; mirror?: boolean }) {
  return (
    <div className={`border-t-2 border-gold-leaf/70 pt-4 text-sakura-cream ${mirror ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-3 ${mirror ? 'flex-row-reverse' : ''}`} aria-hidden="true">
        <span className="font-display text-[10px] tracking-[0.34em] text-blossom/70">{index}</span>
        <span className="h-px flex-1 bg-gold-leaf/40" />
      </div>
      <h3 className="mt-2 font-display text-4xl italic leading-none text-shadow-glow">{person.name}</h3>
      {person.nameLocal && (
        <p lang="hi" className="font-devanagari mt-1.5 text-sm text-blossom/90">
          {person.nameLocal}
        </p>
      )}
      {person.bio && (
        <p className={`mt-3 max-w-xs text-sm leading-relaxed text-sakura-cream/80 ${mirror ? 'ml-auto' : ''}`}>
          {person.bio}
        </p>
      )}
      <dl className="mt-4 space-y-2">
        {(person.stats ?? []).map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2 border-b border-dotted border-sakura-cream/20 pb-1">
            <dt className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-blossom/65">{stat.label}</dt>
            <span className="min-w-2 flex-1 border-b border-dotted border-sakura-cream/15" aria-hidden="true" />
            <dd className="max-w-[64%] text-right text-[11px] leading-snug text-sakura-cream/85">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Two portrait panels that drift together, with petals crossing their seam. */
export default function CoupleSection() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced) return
      const matchMedia = gsap.matchMedia()
      matchMedia.add('(min-width: 768px)', () => {
        const scrollTrigger = {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'center center',
          scrub: 0.8,
        }
        gsap.fromTo('[data-panel="left"]', { xPercent: -6 }, { xPercent: 0, ease: 'none', scrollTrigger })
        gsap.fromTo('[data-panel="right"]', { xPercent: 6 }, { xPercent: 0, ease: 'none', scrollTrigger })
      })
      return () => matchMedia.revert()
    },
    { scope: rootRef },
  )

  return (
    <section
      id="couple"
      ref={rootRef}
      className="relative overflow-hidden bg-night px-0 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <EpisodeTitle
          number="第二話 · Episode 02"
          title="Two Hearts, One Spring"
          kanji="春"
          tone="night"
          className="mb-12 text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2">
        {/* Left: Japanese spring riverbank */}
        <div data-panel="left" className="relative h-[700px] overflow-hidden md:h-[780px]">
          <RiverBridge className="z-0" />
          <div className="pointer-events-none absolute inset-0 z-[9] bg-gradient-to-t from-night via-night/35 to-transparent" aria-hidden="true" />
          <BrideSilhouette />

          <EasterEgg
            id="butterfly"
            effect="butterfly"
            label={`A hair ornament in ${wedding.bride.name}'s hair`}
            tooltip="A small ornament falls into her hair."
            className="absolute left-[55%] top-[29%] z-30"
          >
            <svg viewBox="0 0 44 34" className="h-9 w-11" aria-hidden="true">
              <path d="M6 26 L34 8" stroke="#c9a45c" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M28 10 C20 2 10 4 10 11 C10 16 18 17 25 14 Z" fill="#e9afc0" stroke="#fff2f4" strokeWidth="1" />
              <path d="M30 8 C38 2 44 6 40 12 C38 16 32 15 28 12 Z" fill="#f7d9e1" stroke="#fff2f4" strokeWidth="1" />
              <circle cx="34" cy="9" r="2.4" fill="#c8372d" />
              {[14, 24, 34].map((x) => (
                <circle key={x} cx={x} cy={30 - (x - 14) * 0.45} r="1.8" fill="#fff2f4" opacity="0.9" />
              ))}
            </svg>
          </EasterEgg>

          <span
            lang="ja"
            aria-hidden="true"
            className="vertical-jp font-jp pointer-events-none absolute right-4 top-10 z-20 text-lg tracking-[0.55em] text-sakura-cream/60"
          >
            春
          </span>

          <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-10">
            <Profile person={wedding.bride} index="01 / 花嫁" />
          </div>
        </div>

        {/* Right: Nakuru golden hour */}
        <div data-panel="right" className="relative h-[700px] overflow-hidden border-t-2 border-gold-leaf/40 md:h-[780px] md:border-l-2 md:border-t-0">
          <LakeGoldenHour className="z-0" />
          <div className="pointer-events-none absolute inset-0 z-[9] bg-gradient-to-t from-night via-night/40 to-transparent" aria-hidden="true" />
          <GroomSilhouette />

          <span
            lang="ja"
            aria-hidden="true"
            className="vertical-jp font-jp pointer-events-none absolute left-4 top-10 z-20 text-lg tracking-[0.55em] text-sakura-cream/60"
          >
            光
          </span>

          <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-10">
            <Profile person={wedding.groom} index="02 / 新郎" mirror />
          </div>
        </div>

        {/* Petals blow across the seam between the two worlds. */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-[15] h-full w-[36%] -translate-x-1/2">
          <PetalField position="absolute" density={12} wind={-1.4} />
        </div>
      </div>
    </section>
  )
}

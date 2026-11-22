import { useRef, type ReactNode } from 'react'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import { wedding, type WeddingData } from '../data/wedding'
import EasterEgg from '../easter-eggs/EasterEgg'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsapSetup'

type Family = WeddingData['families'][number]
type Person = WeddingData['groom']

/** Original kamon: five sakura petals inside a double ring. */
function SakuraCrest() {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" role="img" aria-label="Sakura blossom family crest">
      <circle cx="70" cy="70" r="65" fill="#fbf0e2" stroke="#c8372d" strokeWidth="4" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="#c9a45c" strokeWidth="1.4" strokeDasharray="2 6" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`translate(70 70) rotate(${angle})`}>
          <path
            d="M0 -6 C-14 -16 -16 -31 -5 -38 C-2 -31 0 -26 0 -22 C0 -26 2 -31 5 -38 C16 -31 14 -16 0 -6 Z"
            fill="#f4c6d0"
            stroke="#c8372d"
            strokeWidth="1.6"
          />
          <path d="M0 -8 C-5 -14 -6 -24 0 -28 C6 -24 5 -14 0 -8 Z" fill="#fff7f3" opacity="0.9" />
        </g>
      ))}
      <circle cx="70" cy="70" r="10" fill="#c8372d" />
      <circle cx="70" cy="70" r="3.2" fill="#ffe9c4" />
    </svg>
  )
}

/** Original kamon: an acacia canopy over a straight trunk, ringed in gold. */
function AcaciaCrest() {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" role="img" aria-label="Acacia tree family crest">
      <circle cx="70" cy="70" r="65" fill="#fbf0e2" stroke="#7c8f6b" strokeWidth="4" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="#c9a45c" strokeWidth="1.4" strokeDasharray="2 6" />
      <path d="M70 108 C68 92 70 76 73 60" fill="none" stroke="#4a2f45" strokeWidth="6" strokeLinecap="round" />
      <path d="M73 64 C56 58 42 51 30 41 M73 62 C90 55 105 48 115 38" fill="none" stroke="#4a2f45" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M26 40 C46 22 96 22 116 38 C94 30 48 30 26 40 Z"
        fill="#7c8f6b"
        stroke="#4a2f45"
        strokeWidth="2"
      />
      <path d="M52 88 q12 -11 24 0 q-12 10 -24 0 Z" fill="#7c8f6b" stroke="#4a2f45" strokeWidth="1.6" />
      <path d="M82 82 q11 -9 21 0 q-11 9 -21 0 Z" fill="#7c8f6b" stroke="#4a2f45" strokeWidth="1.6" />
      <circle cx="70" cy="116" r="4" fill="#c9a45c" />
    </svg>
  )
}

/** A moon bridge over a river, drawn as one continuous ink-and-wash vignette. */
function BridgeIllustration() {
  return (
    <svg viewBox="0 0 460 240" className="h-full w-full" role="img" aria-label="A bridge joining two river banks">
      <defs>
        <linearGradient id="fs-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a4b6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f7d9e1" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M0 170 Q230 140 460 170 L460 240 L0 240 Z" fill="url(#fs-water)" />
      {Array.from({ length: 11 }, (_, index) => (
        <path
          key={index}
          d={`M ${18 + index * 42} ${184 + (index % 3) * 14} q 18 -5 36 0`}
          fill="none"
          stroke="#fff9f2"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M46 178 C150 118 310 118 414 178 L414 196 C310 140 150 140 46 196 Z"
        fill="#c6a58f"
        stroke="#4a2f45"
        strokeWidth="2.2"
      />
      <path d="M46 178 C150 118 310 118 414 178" fill="none" stroke="#fbf0e2" strokeWidth="3" />
      {Array.from({ length: 11 }, (_, index) => {
        const t = index / 10
        const x = 56 + t * 348
        const y = 177 - Math.sin(Math.PI * t) * 54
        return (
          <g key={x}>
            <path d={`M${x} ${y} v-22`} stroke="#7c5f57" strokeWidth="3" strokeLinecap="round" />
            <circle cx={x} cy={y - 25} r="2.6" fill="#c9a45c" />
          </g>
        )
      })}
      <path d="M54 128 C160 70 300 70 406 128" fill="none" stroke="#7c5f57" strokeWidth="4" />
      <path d="M0 214 Q230 190 460 214" fill="none" stroke="#f4c6d0" strokeOpacity="0.55" strokeWidth="3" />
    </svg>
  )
}

/** A single turning leaf, wrapped in the leaf-swirl Easter egg. */
function LeafSwirl() {
  return (
    <EasterEgg
      id="leaf-swirl"
      tooltip="A leaf swirls between the two crests."
      label="A small leaf swirl"
      className="absolute left-1/2 top-[18%] z-20 -translate-x-1/2"
    >
      <svg viewBox="0 0 56 56" className="h-12 w-12 drop-shadow-[0_3px_6px_rgba(74,47,69,.45)]" aria-hidden="true">
        <path
          d="M8 36 C14 16 34 8 48 12 C40 30 26 42 8 36 Z"
          fill="#7c8f6b"
          stroke="#4a2f45"
          strokeWidth="1.6"
        />
        <path d="M10 38 C22 32 34 22 46 13" fill="none" stroke="#e9e2c4" strokeWidth="1.3" />
        <path d="M18 30 q3 -8 9 -11 M28 24 q4 -6 10 -8" fill="none" stroke="#4a2f45" strokeOpacity="0.55" strokeWidth="1" />
        <path d="M6 44 C18 50 38 46 44 34" fill="none" stroke="#c9a45c" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </EasterEgg>
  )
}

function ClanColumn({
  family,
  person,
  crest,
  side,
  index,
}: {
  family: Family
  person: Person
  crest: ReactNode
  side: 'groom' | 'bride'
  index: string
}) {
  const mirror = side === 'bride'
  return (
    <div
      data-clan=""
      className={`flex flex-col gap-5 ${mirror ? 'items-center text-center md:items-end md:text-right' : 'items-center text-center md:items-start md:text-left'}`}
    >
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        {crest}
        <span className="absolute -bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gold-leaf/70" aria-hidden="true" />
      </div>

      <div className={`flex items-center gap-3 ${mirror ? 'md:flex-row-reverse' : ''}`}>
        <span className="font-display text-[10px] tracking-[0.3em] text-vermilion/80">{index}</span>
        <span className="h-px w-10 bg-gold-leaf/55" aria-hidden="true" />
      </div>

      {family.title && (
        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-sakura-plum/65">{family.title}</p>
      )}

      <div>
        <p className="font-display text-2xl leading-tight text-sumi sm:text-3xl">{family.parents}</p>
        {family.parentsLocal && (
          <p lang="hi" className="font-devanagari mt-1.5 text-sm text-sakura-plum/70">
            {family.parentsLocal}
          </p>
        )}
      </div>

      <p className="text-xs tracking-[0.06em] text-sumi/75">
        {family.relationLine} <span className="font-display text-base italic text-vermilion">{person.name}</span>
      </p>
      {family.relationLineLocal && person.nameLocal && (
        <p lang="hi" className="font-devanagari text-xs text-sakura-plum/65">
          {family.relationLineLocal} {person.nameLocal}
        </p>
      )}

      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sumi/50">{family.hometown}</p>
    </div>
  )
}

/** Episode 12: two family crests meet across a river bridge — no cards. */
export default function FamilySection() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const groomFamily = wedding.families.find((family) => family.side === 'groom')
  const brideFamily = wedding.families.find((family) => family.side === 'bride')

  useGSAP(
    () => {
      const columns = gsap.utils.toArray<HTMLElement>('[data-clan]', rootRef.current)
      const bridge = rootRef.current?.querySelector<HTMLElement>('[data-bridge]')
      if (!bridge || columns.length === 0) return

      if (reduced) {
        gsap.set([...columns, bridge], { opacity: 1, x: 0, y: 0 })
        return
      }

      const trigger = { trigger: rootRef.current, start: 'top 76%', once: true }
      if (columns[0]) {
        gsap.fromTo(columns[0], { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: trigger })
      }
      if (columns[1]) {
        gsap.fromTo(columns[1], { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: trigger })
      }
      gsap.fromTo(bridge, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: trigger })
    },
    { scope: rootRef, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <section
      id="family"
      ref={rootRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_10%,rgba(244,198,208,0.45),transparent_65%)] bg-sakura-cream px-5 py-24 text-sumi sm:px-8 sm:py-28"
    >
      <span className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold-leaf/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <EpisodeTitle
          number="第十二話 · Episode 12"
          title="The Two Clans"
          kanji="家"
          tone="light"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed tracking-[0.14em] text-sumi/60">
          {wedding.inviters.text}
        </p>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-[1fr_minmax(15rem,25rem)_1fr] md:gap-6">
          {groomFamily && (
            <ClanColumn
              family={groomFamily}
              person={wedding.groom}
              crest={<AcaciaCrest />}
              side="groom"
              index="家 · 01"
            />
          )}

          <div data-bridge="" className="relative h-52 sm:h-64 md:h-72">
            <div className="absolute inset-0 opacity-95">
              <BridgeIllustration />
            </div>
            <LeafSwirl />
            <p
              lang="ja"
              className="font-jp absolute bottom-1 left-1/2 -translate-x-1/2 text-xs tracking-[0.45em] text-sakura-plum/55"
              aria-hidden="true"
            >
              橋
            </p>
          </div>

          {brideFamily && (
            <ClanColumn
              family={brideFamily}
              person={wedding.bride}
              crest={<SakuraCrest />}
              side="bride"
              index="家 · 02"
            />
          )}
        </div>

        <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3 text-center">
          <span className="h-px w-24 bg-gold-leaf/55" aria-hidden="true" />
          <p lang="hi" className="font-devanagari text-sm leading-relaxed text-sakura-plum/75">
            {wedding.inviters.textLocal}
          </p>
          <span className="h-px w-24 bg-gold-leaf/55" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

import { useRef, type ReactNode } from 'react'
import EpisodeTitle, { type EpisodeTone } from '../components/anime/EpisodeTitle'
import AddToCalendar from '../components/anime/AddToCalendar'
import DirectionsButton from '../components/anime/DirectionsButton'
import InkTransition from '../components/anime/InkTransition'
import { LakeGoldenHour, MatsuriNight, ShrineMandap, WisteriaGarden } from '../art/Landscapes'
import PetalField from '../art/PetalField'
import { wedding, type Ceremony } from '../data/wedding'
import EasterEgg from '../easter-eggs/EasterEgg'
import HiddenOrb from '../easter-eggs/HiddenOrb'
import RamenEgg from '../easter-eggs/RamenEgg'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { fmt, parseLocal } from '../lib/date'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsapSetup'

const EPISODE_KANJI = ['第七話', '第八話', '第九話', '第十話']
const TONES: EpisodeTone[] = ['dark', 'lantern', 'gold', 'dark']

/** Shared editorial copy, placed differently inside each world. */
function ArcCopy({
  event,
  index,
  tone,
  className,
}: {
  event: Ceremony
  index: number
  tone: EpisodeTone
  className: string
}) {
  const venue = wedding.venues.find((item) => item.id === event.venueId) ?? wedding.venues[0]
  const when = parseLocal(event.start ?? wedding.weddingDateTime, wedding.timezoneOffset)
  const sampleDress = /sample/i.test(event.dressCode)
  const dressCode = event.dressCode.replace(/^\s*SAMPLE\s*[·:|-]\s*/i, '')

  return (
    <div className={`relative z-20 ${className}`}>
      <EpisodeTitle
        number={`${EPISODE_KANJI[index] ?? event.episode} · ${event.episode}`}
        title={event.arcTitle}
        subtitle={event.nameLocal}
        kanji={event.kanji}
        tone={tone}
      />
      <p lang="ja" className="font-jp mt-3 text-sm tracking-[0.3em] text-sakura-cream/65">
        {event.arcTitleLocal}
      </p>

      <span className="mt-6 block h-px w-24 bg-gold-leaf/70" aria-hidden="true" />
      <h3 className="mt-5 font-display text-3xl italic leading-tight text-sakura-cream sm:text-4xl">{event.name}</h3>
      <time
        dateTime={event.start ?? undefined}
        className="mt-3 block text-[11px] font-semibold tracking-[0.22em] uppercase text-sakura-cream/75"
      >
        {fmt.day(when, wedding.timeZone)} {fmt.month(when, wedding.timeZone)} {fmt.year(when, wedding.timeZone)}
        {' · '}
        {event.timeLabel ?? fmt.time(when, wedding.timeZone)}
      </time>

      <div className="mt-5 border-l border-gold-leaf/70 pl-4">
        <p className="text-sm font-semibold text-sakura-cream">{venue.name}</p>
        <address className="mt-1 text-xs not-italic leading-relaxed text-sakura-cream/70">{venue.address}</address>
      </div>

      <p className="mt-5 max-w-lg text-sm leading-relaxed text-sakura-cream/85">{event.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {sampleDress && (
          <span className="border border-gold-leaf/70 px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] text-gold-leaf">
            SAMPLE
          </span>
        )}
        <p className="text-[11px] tracking-[0.14em] uppercase text-sakura-cream/75">Dress code · {dressCode}</p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2">
        <AddToCalendar event={event} venue={venue} timeZone={wedding.timeZone} />
        <DirectionsButton url={venue.directionsUrl} />
      </div>
    </div>
  )
}

/** A single full-bleed arc. Each one gets its own backdrop and composition. */
function CeremonyArc({
  event,
  index,
  backdrop,
  art,
  copyClassName,
  shadeClassName = 'bg-gradient-to-b from-sumi/55 via-sumi/10 to-sumi/80',
}: {
  event: Ceremony
  index: number
  backdrop: ReactNode
  art: ReactNode
  copyClassName: string
  shadeClassName?: string
}) {
  const arcRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const arc = arcRef.current
      const scene = arc?.querySelector<HTMLElement>('[data-scene]')
      if (!arc || !scene) return

      if (reduced) {
        gsap.set(scene, { opacity: 1, y: 0 })
        return
      }

      const entrance = gsap.fromTo(
        scene,
        { opacity: 0.58, y: 30 },
        { opacity: 1, y: 0, duration: 1.05, ease: 'power2.out', paused: true },
      )
      const trigger = ScrollTrigger.create({
        trigger: arc,
        start: 'top 88%',
        once: true,
        onEnter: () => entrance.play(),
      })

      return () => {
        trigger.kill()
        entrance.kill()
      }
    },
    { scope: arcRef, dependencies: [reduced], revertOnUpdate: true },
  )

  return (
    <article
      ref={arcRef}
      aria-label={`${event.name} · ${event.arcTitle}`}
      className="relative min-h-[100svh] overflow-hidden bg-night text-sakura-cream"
    >
      <div data-scene="" className="absolute inset-0">
        {backdrop}
      </div>
      <div className={`pointer-events-none absolute inset-0 z-[11] ${shadeClassName}`} aria-hidden="true" />
      {art}
      <ArcCopy event={event} index={index} tone={TONES[index] ?? 'dark'} className={copyClassName} />
    </article>
  )
}

/** Original henna trace: the linework is revealed as the reader scrolls. */
function HennaHand({ reduced }: { reduced: boolean }) {
  const handRef = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const strokes = gsap.utils.toArray<SVGPathElement>('[data-henna]', handRef.current)
      if (strokes.length === 0) return

      if (reduced) {
        gsap.set(strokes, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 })
        return
      }

      strokes.forEach((stroke) => {
        const length = Math.max(1, stroke.getTotalLength())
        gsap.fromTo(
          stroke,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: handRef.current,
              start: 'top 84%',
              end: 'top 32%',
              scrub: 0.8,
            },
          },
        )
      })
    },
    { scope: handRef, dependencies: [reduced], revertOnUpdate: true },
  )

  const fingers = [
    'M112 196 L104 86',
    'M142 188 L142 54',
    'M170 194 L178 72',
    'M196 210 L216 112',
    'M102 244 L56 194',
  ]

  return (
    <svg ref={handRef} viewBox="0 0 300 380" className="h-full w-full overflow-visible" aria-hidden="true">
      <g fill="none" strokeLinecap="round" stroke="#4a2f45" strokeWidth="30">
        {fingers.map((path) => (
          <path key={`outline-${path}`} d={path} />
        ))}
      </g>
      <g fill="none" strokeLinecap="round" stroke="#c99074" strokeWidth="23">
        {fingers.map((path) => (
          <path key={`skin-${path}`} d={path} />
        ))}
      </g>
      <path
        d="M96 206 Q98 172 138 166 Q186 160 202 202 L214 282 Q218 330 178 350 Q132 370 104 330 Z"
        fill="#c99074"
        stroke="#4a2f45"
        strokeWidth="3"
      />

      <g fill="none" stroke="#5c3328" strokeWidth="2.2" strokeLinecap="round">
        <path data-henna="" d="M150 226 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0" />
        <path data-henna="" d="M150 204 q13 20 0 44 q-13 -24 0 -44 M128 226 q22 -13 44 0 q-24 13 -44 0" />
        <path data-henna="" d="M150 180 q-9 10 0 18 q9 -8 0 -18 M150 254 q-9 10 0 18 q9 -8 0 -18" />
        <path data-henna="" d="M112 282 q18 -22 36 4 q-26 -2 -36 -4 M162 288 q18 -26 38 -2 q-25 -3 -38 2" />
        <path data-henna="" d="M106 252 q10 -12 20 0 M178 260 q10 -12 20 0" />
        <path data-henna="" d="M104 128 q8 -10 16 0 M140 96 q8 -10 16 0 M176 110 q8 -10 16 0 M208 148 q8 -10 16 0" />
        <path data-henna="" d="M76 210 q10 -12 20 0 M98 226 q10 -12 20 0" />
        <path data-henna="" d="M116 316 q34 16 68 -2" />
      </g>
      <g fill="#5c3328" opacity="0.85">
        {[
          [118, 246], [182, 246], [150, 264], [120, 300], [180, 302],
          [108, 150], [144, 118], [180, 132], [216, 168], [88, 228],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
        ))}
      </g>
    </svg>
  )
}

/** Original ink drawing of two hands reaching across the mandap. */
function UnitedHands() {
  return (
    <svg viewBox="0 0 620 250" className="h-full w-full overflow-visible" aria-hidden="true">
      <g fill="none" strokeLinecap="round" stroke="#3a2430" strokeWidth="20">
        <path d="M-10 214 C80 206 142 178 194 136" />
        <path d="M630 214 C540 206 478 178 426 136" />
      </g>
      <g fill="none" strokeLinecap="round" stroke="#c98e86" strokeWidth="13">
        <path d="M-10 214 C80 206 142 178 194 136" />
        <path d="M630 214 C540 206 478 178 426 136" />
      </g>
      <g fill="#c98e86" stroke="#3a2430" strokeWidth="2.4">
        <g data-thread="">
          <path d="M196 138 q-18 -12 -28 -28 q-6 -10 4 -14 q9 -3 16 9 l9 -24 q4 -10 13 -7 q8 3 6 13 l-6 24 l14 -20 q6 -9 14 -4 q7 5 1 13 l-19 28 q-11 16 -24 18 Z" />
        </g>
        <g data-thread="">
          <path d="M424 138 q18 -12 28 -28 q6 -10 -4 -14 q-9 -3 -16 9 l-9 -24 q-4 -10 -13 -7 q-8 3 -6 13 l6 24 l-14 -20 q-6 -9 -14 -4 q-7 5 -1 13 l19 28 q11 16 24 18 Z" />
        </g>
      </g>
      <g fill="none" stroke="#c8372d" strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
        <path d="M258 126 Q310 168 362 126" strokeDasharray="3 9" />
        <path d="M292 138 q18 20 36 -2" />
      </g>
    </svg>
  )
}

/** Thin asanoha-style border so the mehndi world keeps its framed-scroll feel. */
function InkBorder() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-4 z-[12] h-[calc(100%-2rem)] w-[calc(100%-2rem)]" aria-hidden="true">
      <defs>
        <pattern id="mehndi-asanoha" width="10" height="10" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#c9a45c" strokeWidth="0.5">
            <path d="M5 0 V10 M0 5 H10 M0 0 L10 10 M10 0 L0 10" />
            <path d="M5 0 L2 5 L5 10 L8 5 Z" />
          </g>
        </pattern>
      </defs>
      <rect x="0.4" y="0.4" width="99.2" height="99.2" fill="none" stroke="#c9a45c" strokeOpacity="0.45" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <rect x="1.6" y="1.6" width="96.8" height="3.2" fill="url(#mehndi-asanoha)" opacity="0.5" />
      <rect x="1.6" y="95.2" width="96.8" height="3.2" fill="url(#mehndi-asanoha)" opacity="0.5" />
      <rect x="1.8" y="5.2" width="96.4" height="89.6" fill="none" stroke="#c9a45c" strokeOpacity="0.22" strokeWidth="0.5" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Four ceremony worlds; no cards, no repeated grid, one continuous film. */
export default function EventsSection() {
  const reduced = usePrefersReducedMotion()
  const [mehndi, sangeet, weddingArc, reception] = wedding.events

  return (
    <section id="events" className="relative bg-sumi">
      {mehndi && (
        <CeremonyArc
          event={mehndi}
          index={0}
          copyClassName="left-5 top-[12%] w-[min(90vw,32rem)] sm:left-[8%] sm:top-[14%] sm:w-[34rem]"
          shadeClassName="bg-gradient-to-b from-sumi/45 via-sumi/25 to-sumi/80"
          backdrop={<WisteriaGarden />}
          art={
            <>
              <InkBorder />
              <div className="absolute bottom-[7%] right-[2%] z-[13] hidden h-[46svh] w-[30vw] max-w-[300px] opacity-90 sm:block lg:right-[8%]">
                <HennaHand reduced={reduced} />
              </div>
              <HiddenOrb id="orb-1" className="absolute right-[6%] top-[14%] z-20 sm:right-[12%]" />
            </>
          }
        />
      )}

      <div className="relative z-30 bg-sumi">
        <InkTransition tone="light" />
      </div>

      {sangeet && (
        <CeremonyArc
          event={sangeet}
          index={1}
          copyClassName="bottom-[8%] left-5 w-[min(92vw,36rem)] sm:bottom-[12%] sm:left-[8%]"
          backdrop={
            <>
              <MatsuriNight />
              <PetalField position="absolute" density={14} wind={1.4} tint={['#f2a33a', '#e9839a', '#9b7bc8']} className="z-[12]" />
            </>
          }
          art={
            <>
              <div className="absolute right-[4%] top-[12%] z-[14] hidden sm:block">
                <div className="relative h-28 w-36">
                  <svg viewBox="0 0 144 112" className="h-full w-full" aria-hidden="true">
                    <path d="M8 44 L72 12 L136 44 Z" fill="#c8372d" stroke="#4a2f45" strokeWidth="3" />
                    <path d="M14 46 H130 V94 H14 Z" fill="#6b3f58" stroke="#4a2f45" strokeWidth="3" />
                    <path d="M14 96 H130" stroke="#c9a45c" strokeWidth="5" strokeLinecap="round" />
                    <path d="M28 56 H116" stroke="#f2a33a" strokeWidth="4" strokeOpacity="0.65" />
                    <text x="72" y="80" textAnchor="middle" className="font-jp" fontSize="24" fill="#ffe0a0">麺</text>
                  </svg>
                  <RamenEgg className="absolute left-[30px] top-[62px] scale-[0.68]" />
                </div>
              </div>
              <HiddenOrb id="orb-2" className="absolute right-[24%] top-[18%] z-20" />
            </>
          }
        />
      )}

      <div className="relative z-30 bg-night">
        <InkTransition tone="light" />
      </div>

      {weddingArc && (
        <CeremonyArc
          event={weddingArc}
          index={2}
          copyClassName="bottom-[7%] left-5 w-[min(92vw,34rem)] sm:bottom-[10%] sm:left-[8%]"
          shadeClassName="bg-gradient-to-b from-sumi/35 via-transparent to-sumi/80"
          backdrop={<ShrineMandap />}
          art={
            <>
              <div className="absolute left-1/2 top-[13%] z-20 w-[min(82vw,38rem)] -translate-x-1/2">
                <UnitedHands />
              </div>
              <div className="absolute left-1/2 top-[5%] z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gold-leaf/70 bg-sumi/55 px-4 py-2 text-center">
                <span className="h-1.5 w-1.5 rotate-45 bg-gold-leaf" aria-hidden="true" />
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-gold-leaf">
                  {weddingArc.timeLabel ?? fmt.time(parseLocal(weddingArc.start ?? wedding.weddingDateTime, wedding.timezoneOffset), wedding.timeZone)}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-gold-leaf" aria-hidden="true" />
              </div>
              <HiddenOrb id="orb-3" className="absolute right-[6%] top-[24%] z-20 sm:right-[12%]" />
            </>
          }
        />
      )}

      <div className="relative z-30 bg-sumi">
        <InkTransition tone="light" />
      </div>

      {reception && (
        <CeremonyArc
          event={reception}
          index={3}
          copyClassName="left-5 top-[10%] w-[min(92vw,34rem)] sm:left-[8%] sm:top-[14%]"
          shadeClassName="bg-gradient-to-b from-sumi/45 via-transparent to-sumi/75"
          backdrop={
            <>
              <LakeGoldenHour />
              <PetalField position="absolute" density={14} tint={['#c9a45c', '#f4c6d0', '#ffd8c2']} className="z-[12]" />
            </>
          }
          art={
            <>
              <EasterEgg
                id="straw-hat"
                tooltip="The greatest treasure? Everyone who sailed here with us."
                label="A straw hat on a lantern hook"
                className="absolute bottom-[14%] right-[7%] z-[16] sm:bottom-[19%] sm:right-[19%]"
              >
                <svg viewBox="0 0 64 46" className="h-10 w-14 drop-shadow-[0_4px_6px_rgba(30,27,46,.6)]" aria-hidden="true">
                  <path d="M32 2 V12" fill="none" stroke="#c9a45c" strokeWidth="2" />
                  <path d="M32 10 q-6 4 0 9" fill="none" stroke="#c9a45c" strokeWidth="2" />
                  <ellipse cx="32" cy="33" rx="30" ry="10" fill="#d9ac5e" stroke="#4a2f45" strokeWidth="1.6" />
                  <path d="M18 31 q14 -7 28 0" fill="none" stroke="#a97a3f" strokeWidth="1.4" />
                  <path d="M20 26 q12 -6 24 0 l5 15 q-17 5 -34 0 Z" fill="#e5bd72" stroke="#4a2f45" strokeWidth="1.6" />
                  <path d="M19 28 q13 4 26 0" fill="none" stroke="#8a3b32" strokeWidth="3" />
                </svg>
              </EasterEgg>
              <p className="absolute bottom-[5%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap font-script text-2xl text-sakura-cream drop-shadow-[0_2px_10px_rgba(30,27,46,.85)] sm:text-3xl">
                Set sail together
              </p>
              <HiddenOrb id="orb-7" className="absolute bottom-[26%] right-[5%] z-20 sm:right-[8%]" />
            </>
          }
        />
      )}
    </section>
  )
}

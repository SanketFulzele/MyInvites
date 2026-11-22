import { useEffect, useRef, useState, type RefObject } from 'react'
import DirectionsButton from '../components/anime/DirectionsButton'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import Seal from '../components/anime/Seal'
import VenueMap from '../components/anime/VenueMap'
import { wedding, type Ceremony, type WeddingVenue } from '../data/wedding'
import HiddenOrb from '../easter-eggs/HiddenOrb'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { fmt, parseLocal } from '../lib/date'
import { gsap, useGSAP } from '../lib/gsapSetup'

/** The map is drawn in one fixed coordinate space, then scaled by the SVG viewBox. */
const MAP = { w: 900, h: 520 }
const COMPASS = { x: 152, y: 126 }
const START = { x: 88, y: 432 }
const PIN_FIELD = { x: 300, y: 148, w: 510, h: 276 }

interface MapPin {
  venue: WeddingVenue
  x: number
  y: number
  label: string
  number: number
}

/** Project the configured lat/lng values onto the hand-drawn parchment. */
const PINS: MapPin[] = (() => {
  const venues = wedding.venues
  const lngs = venues.map((venue) => venue.lng)
  const lats = venues.map((venue) => venue.lat)
  const lngMin = Math.min(...lngs) - 0.008
  const lngMax = Math.max(...lngs) + 0.008
  const latMin = Math.min(...lats) - 0.012
  const latMax = Math.max(...lats) + 0.012
  return venues.map((venue, index) => ({
    venue,
    x: PIN_FIELD.x + ((venue.lng - lngMin) / (lngMax - lngMin)) * PIN_FIELD.w,
    y: PIN_FIELD.y + ((latMax - venue.lat) / (latMax - latMin)) * PIN_FIELD.h,
    label: venue.address.split(',')[0] ?? venue.name,
    number: index + 1,
  }))
})()

const weddingPinId = wedding.events.find((event) => event.id === 'wedding')?.venueId
const DESTINATION = PINS.find((pin) => pin.venue.id === weddingPinId) ?? PINS[0]
const COMPASS_ANGLE = (Math.atan2(DESTINATION.y - COMPASS.y, DESTINATION.x - COMPASS.x) * 180) / Math.PI + 90

function TreasureMap({ needleRef }: { needleRef: RefObject<SVGGElement | null> }) {
  const route = `M ${START.x} ${START.y} Q ${(START.x + DESTINATION.x) / 2} ${START.y - 150}, ${DESTINATION.x} ${DESTINATION.y}`

  return (
    <svg
      viewBox={`0 0 ${MAP.w} ${MAP.h}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Hand-inked route to ${wedding.city}, ${wedding.country}`}
    >
      <g data-ink="" fill="none" stroke="#4a2f45">
        <rect x="16" y="16" width={MAP.w - 32} height={MAP.h - 32} strokeWidth="2.4" strokeOpacity="0.6" />
        <rect x="25" y="25" width={MAP.w - 50} height={MAP.h - 50} strokeWidth="1" strokeDasharray="2 8" strokeOpacity="0.5" />
        {/* Low ink ridges and a suggestion of the lake shore. */}
        <path d="M300 156 Q370 100 438 152 T574 146" strokeWidth="2" strokeOpacity="0.28" />
        <path d="M320 178 Q392 128 460 174 T596 168" strokeWidth="1.2" strokeOpacity="0.2" />
        <path
          d="M310 344 C400 310 452 388 544 348 C620 316 700 372 802 330"
          strokeWidth="2.2"
          strokeOpacity="0.38"
        />
        <path d="M330 366 C410 340 470 402 552 368" strokeWidth="1" strokeOpacity="0.24" />
        {[
          [356, 250],
          [488, 224],
          [648, 212],
          [742, 286],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} strokeWidth="1.6" strokeOpacity="0.34">
            <path d={`M${x} ${y} v-22`} />
            <path d={`M${x} ${y - 12} l-9 -8 M${x} ${y - 16} l8 -9 M${x} ${y - 8} l10 -6`} />
          </g>
        ))}
      </g>

      <g data-ink="">
        <path d={route} fill="none" stroke="#c8372d" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" opacity="0.85" />
        <path d={`M ${START.x} ${START.y} l 16 0 m -8 -8 l 0 16`} stroke="#c8372d" strokeWidth="2" strokeLinecap="round" />
        <text x={START.x - 6} y={START.y + 30} className="font-display" fontSize="21" fill="#4a2f45">
          Where you are
        </text>
        <text
          x={DESTINATION.x + 26}
          y={DESTINATION.y + 6}
          className="font-display"
          fontSize="23"
          fontStyle="italic"
          fill="#4a2f45"
        >
          {wedding.city}, {wedding.country}
        </text>
      </g>

      <g data-ink="" fill="none" stroke="#4a2f45">
        <circle cx={COMPASS.x} cy={COMPASS.y} r="54" strokeWidth="1.6" strokeOpacity="0.55" />
        <circle cx={COMPASS.x} cy={COMPASS.y} r="43" strokeWidth="1" strokeDasharray="2 6" strokeOpacity="0.5" />
        <path
          d={`M ${COMPASS.x} ${COMPASS.y - 58} v 10 M ${COMPASS.x} ${COMPASS.y + 48} v 10 M ${COMPASS.x - 58} ${COMPASS.y} h 10 M ${COMPASS.x + 48} ${COMPASS.y} h 10`}
          strokeWidth="2"
          strokeOpacity="0.7"
        />
        <path
          d={`M ${COMPASS.x} ${COMPASS.y - 36} L ${COMPASS.x + 10} ${COMPASS.y - 10} L ${COMPASS.x + 36} ${COMPASS.y} L ${COMPASS.x + 10} ${COMPASS.y + 10} L ${COMPASS.x} ${COMPASS.y + 36} L ${COMPASS.x - 10} ${COMPASS.y + 10} L ${COMPASS.x - 36} ${COMPASS.y} L ${COMPASS.x - 10} ${COMPASS.y - 10} Z`}
          strokeWidth="1.1"
          strokeOpacity="0.35"
        />
      </g>
      <g ref={needleRef} data-ink="">
        <path
          d={`M ${COMPASS.x} ${COMPASS.y - 48} L ${COMPASS.x + 9} ${COMPASS.y + 4} L ${COMPASS.x} ${COMPASS.y + 12} L ${COMPASS.x - 9} ${COMPASS.y + 4} Z`}
          fill="#c8372d"
        />
        <path
          d={`M ${COMPASS.x} ${COMPASS.y + 46} L ${COMPASS.x + 9} ${COMPASS.y + 4} L ${COMPASS.x} ${COMPASS.y + 12} L ${COMPASS.x - 9} ${COMPASS.y + 4} Z`}
          fill="#1e1b2e"
          opacity="0.72"
        />
        <circle cx={COMPASS.x} cy={COMPASS.y} r="5" fill="#c9a45c" stroke="#4a2f45" strokeWidth="1.4" />
      </g>

      <g data-ink="">
        {PINS.map((pin) => {
          const isDestination = pin.venue.id === DESTINATION.venue.id
          return (
            <g key={pin.venue.id}>
              <circle cx={pin.x} cy={pin.y} r="12" fill={isDestination ? '#c8372d' : '#fbf0e2'} stroke="#4a2f45" strokeWidth="2" />
              <text
                x={pin.x}
                y={pin.y + 4}
                textAnchor="middle"
                className="font-display"
                fontSize="12"
                fill={isDestination ? '#fff9f2' : '#4a2f45'}
              >
                {pin.number}
              </text>
              <text
                x={pin.x + 18}
                y={pin.y - 12}
                className="font-display"
                fontSize="16"
                fontStyle="italic"
                fill="#4a2f45"
              >
                {pin.label}
              </text>
              {isDestination && (
                <g stroke="#c8372d" strokeWidth="5" strokeLinecap="round">
                  <path d={`M ${pin.x - 30} ${pin.y - 42} l 60 60`} />
                  <path d={`M ${pin.x + 30} ${pin.y - 42} l -60 60`} />
                </g>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** One horizontal stop, with its map iframe mounted only when needed. */
function TimelineStop({ event, index, forceActive }: { event: Ceremony; index: number; forceActive: boolean }) {
  const stopRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const venue = wedding.venues.find((item) => item.id === event.venueId) ?? wedding.venues[0]
  const when = parseLocal(event.start ?? wedding.weddingDateTime, wedding.timezoneOffset)

  useEffect(() => {
    const node = stopRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: '120px', threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={stopRef}
      className="flex w-[86vw] max-w-sm shrink-0 snap-start flex-col border-t border-gold-leaf/60 pt-5 sm:w-80"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-4xl italic leading-none text-vermilion/80">
          {String(index + 1).padStart(2, '0')}
        </span>
        <time dateTime={event.start ?? undefined} className="text-right text-[10px] font-semibold tracking-[0.18em] text-sumi/60">
          <span className="block">
            {fmt.day(when, wedding.timeZone)} {fmt.month(when, wedding.timeZone)} {fmt.year(when, wedding.timeZone)}
          </span>
          <span className="mt-1 block text-vermilion/80">{event.timeLabel ?? fmt.time(when, wedding.timeZone)}</span>
        </time>
      </div>

      <h3 className="mt-5 font-display text-2xl italic leading-tight text-sumi">{event.name}</h3>
      {event.nameLocal && (
        <p lang="hi" className="font-devanagari mt-1 text-sm text-sakura-plum/80">
          {event.nameLocal}
        </p>
      )}
      <p className="mt-4 text-xs font-semibold tracking-[0.08em] text-sumi/85">{venue.name}</p>
      <address className="mt-1 text-xs not-italic leading-relaxed text-sumi/60">{venue.address}</address>
      <p className="mt-3 text-[11px] leading-relaxed text-sumi/55">{venue.notes}</p>

      <VenueMap venue={venue} active={forceActive || inView} className="mt-5 aspect-[16/10] w-full" />

      <div className="mt-2 flex items-center justify-between gap-3">
        <DirectionsButton url={venue.directionsUrl} />
        <span className="font-jp text-xs text-sumi/40" lang="ja" aria-hidden="true">
          {event.kanji}
        </span>
      </div>
    </article>
  )
}

/** Episode 06: break the seal, unroll the treasure map, then follow the route. */
export default function JourneySection() {
  const rootRef = useRef<HTMLElement>(null)
  const needleRef = useRef<SVGGElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const hasOpenedRef = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      const closed = rootRef.current?.querySelector<HTMLElement>('[data-scroll-closed]')
      const opened = rootRef.current?.querySelector<HTMLElement>('[data-scroll-open]')
      const paper = rootRef.current?.querySelector<HTMLElement>('[data-paper]')
      const folds = gsap.utils.toArray<HTMLElement>('[data-fold]', rootRef.current)
      const ink = gsap.utils.toArray<SVGElement>('[data-ink]', rootRef.current)
      const rodLeft = rootRef.current?.querySelector<HTMLElement>('[data-rod="left"]')
      const rodRight = rootRef.current?.querySelector<HTMLElement>('[data-rod="right"]')
      const needle = needleRef.current
      if (!closed || !opened || !paper || !rodLeft || !rodRight || !needle) return

      // Reduced motion: only a quiet cross-fade, no unrolling or rotation.
      if (reduced) {
        if (open && !hasOpenedRef.current) hasOpenedRef.current = true
        if (!hasOpenedRef.current) {
          gsap.set(closed, { autoAlpha: 1 })
          gsap.set(opened, { autoAlpha: 0 })
          return
        }
        gsap.to(closed, { autoAlpha: open ? 0 : 1, duration: 0.18, ease: 'none' })
        gsap.to(opened, { autoAlpha: open ? 1 : 0, duration: 0.18, ease: 'none' })
        gsap.set(paper, { scaleX: 1 })
        gsap.set(folds, { opacity: 0.35 })
        gsap.set(ink, { opacity: 1, filter: 'blur(0px)' })
        gsap.set(needle, { rotation: COMPASS_ANGLE, svgOrigin: `${COMPASS.x} ${COMPASS.y}` })
        return
      }

      const origin = { svgOrigin: `${COMPASS.x} ${COMPASS.y}` }

      if (!hasOpenedRef.current && !open) {
        gsap.set(closed, { autoAlpha: 1 })
        gsap.set(opened, { autoAlpha: 0 })
        gsap.set(paper, { scaleX: 0, transformOrigin: '50% 50%' })
        gsap.set(folds, { opacity: 0 })
        gsap.set(ink, { opacity: 0, filter: 'blur(10px)' })
        gsap.set([rodLeft, rodRight], { xPercent: 0 })
        gsap.set(needle, { ...origin, rotation: COMPASS_ANGLE - 210 })
        return
      }

      if (open) {
        hasOpenedRef.current = true
        const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        timeline
          .to(closed, { autoAlpha: 0, duration: 0.3 }, 0)
          .set(opened, { autoAlpha: 1 }, 0.1)
          .fromTo(rodLeft, { xPercent: 0 }, { xPercent: -150, duration: 1 }, 0.12)
          .fromTo(rodRight, { xPercent: 0 }, { xPercent: 150, duration: 1 }, 0.12)
          .fromTo(paper, { scaleX: 0 }, { scaleX: 1, duration: 1.05, transformOrigin: '50% 50%' }, 0.12)
          .to(paper, { skewY: 1.4, duration: 0.2, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 0.44)
          .fromTo(
            folds,
            { opacity: 0, skewX: -7 },
            { opacity: 0.32, skewX: 0, duration: 0.55, stagger: 0.06, ease: 'sine.out' },
            0.48,
          )
          .fromTo(
            ink,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', duration: 0.75, stagger: 0.07, ease: 'power2.out' },
            0.55,
          )
          .to(needle, { ...origin, rotation: COMPASS_ANGLE, duration: 1.5, ease: 'power2.inOut' }, 0.6)
        return
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      timeline
        .to(ink, { opacity: 0, filter: 'blur(8px)', duration: 0.22, stagger: { each: 0.02, from: 'end' } }, 0)
        .to(folds, { opacity: 0, duration: 0.2 }, 0.05)
        .to(paper, { scaleX: 0, duration: 0.7, transformOrigin: '50% 50%' }, 0.12)
        .to([rodLeft, rodRight], { xPercent: 0, duration: 0.7 }, 0.12)
        .set(opened, { autoAlpha: 0 }, 0.82)
        .to(closed, { autoAlpha: 1, duration: 0.3 }, 0.82)
    },
    { scope: rootRef, dependencies: [open, reduced], revertOnUpdate: true },
  )

  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
    else if (hasOpenedRef.current) openButtonRef.current?.focus()
  }, [open])

  return (
    <section
      id="journey"
      ref={rootRef}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_12%,rgba(244,198,208,.35),transparent_60%)] bg-sakura-cream px-5 py-24 text-sumi sm:px-8 sm:py-28"
    >
      <span id="venue" className="absolute" aria-hidden="true" />

      <div className="mx-auto max-w-6xl">
        <EpisodeTitle
          number="第六話 · Episode 06"
          title="The Sealed Scroll"
          kanji="結"
          tone="light"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed tracking-[0.12em] text-sumi/60">
          {`${wedding.city}, ${wedding.country} · ${wedding.timeZone}`}
        </p>

        <div className="relative mx-auto mt-12 min-h-[27rem] w-full max-w-5xl sm:min-h-[34rem]">
          <div data-scroll-closed="" className="absolute inset-0 flex flex-col items-center justify-center">
            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="journey-map"
              className="group flex flex-col items-center gap-7 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-vermilion"
            >
              <span className="relative block h-28 w-[min(78vw,30rem)] sm:h-36">
                <span className="absolute -left-3 inset-y-2 w-5 rounded-full bg-gradient-to-r from-[#3b2938] via-[#8b6a49] to-[#c9a45c] sakura-shadow" aria-hidden="true" />
                <span className="absolute inset-x-0 inset-y-3 border-y-4 border-[#7a5a40] washi-paper sakura-shadow" aria-hidden="true" />
                <span className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-sumi/10" aria-hidden="true" />
                <span className="absolute inset-x-8 top-[58%] h-px bg-sumi/10" aria-hidden="true" />
                <span className="absolute -right-3 inset-y-2 w-5 rounded-full bg-gradient-to-l from-[#3b2938] via-[#8b6a49] to-[#c9a45c] sakura-shadow" aria-hidden="true" />
                <span className="absolute inset-0 grid place-items-center">
                  <Seal label="開" sub="封" size="lg" ariaLabel="Break the wax seal to unroll the treasure map" />
                </span>
              </span>
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sumi/60 transition-colors group-hover:text-vermilion">
                Tap to break the seal
              </span>
            </button>
          </div>

          <div
            id="journey-map"
            data-scroll-open=""
            aria-hidden={!open}
            className="invisible absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-4xl border-y-[6px] border-[#7a5a40] washi-paper sakura-shadow">
              <div data-paper="" className="origin-center">
                <div className="relative px-2 py-3 sm:px-6 sm:py-4">
                  {Array.from({ length: 7 }, (_, index) => (
                    <span
                      key={index}
                      data-fold=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-px bg-sumi/20"
                      style={{ left: `${(index + 1) * 12.5}%` }}
                    />
                  ))}
                  <TreasureMap needleRef={needleRef} />
                  <div
                    className="pointer-events-none absolute z-20"
                    style={{
                      left: `${((COMPASS.x - 26) / MAP.w) * 100}%`,
                      top: `${((COMPASS.y - 26) / MAP.h) * 100}%`,
                    }}
                  >
                    <HiddenOrb id="orb-4" label="A glowing point on the treasure map compass" />
                  </div>
                </div>
              </div>
              <span data-rod="left" className="absolute -left-3 inset-y-[-10px] w-5 rounded-full bg-gradient-to-r from-[#3b2938] via-[#8b6a49] to-[#c9a45c] sakura-shadow" aria-hidden="true" />
              <span data-rod="right" className="absolute -right-3 inset-y-[-10px] w-5 rounded-full bg-gradient-to-l from-[#3b2938] via-[#8b6a49] to-[#c9a45c] sakura-shadow" aria-hidden="true" />
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="mt-7 border-b border-vermilion/60 px-3 py-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-vermilion transition hover:border-vermilion hover:text-sumi focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion"
            >
              Close scroll
            </button>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {open ? 'The treasure map is unrolled.' : 'The scroll is closed.'}
        </p>

        <div className="mt-10 border-t border-sumi/15 pt-10 sm:mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.34em] uppercase text-vermilion/80">The road ahead</p>
              <h3 className="mt-2 font-display text-2xl italic text-sumi sm:text-3xl">Four stops, one celebration</h3>
            </div>
            <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-sumi/55 sm:hidden">
              Swipe for all four stops <span aria-hidden="true">→</span>
            </p>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 sm:mx-0 sm:px-0">
            {wedding.events.map((event, index) => (
              <TimelineStop key={event.id} event={event} index={index} forceActive={open} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

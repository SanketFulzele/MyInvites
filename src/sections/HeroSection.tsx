import { useCallback, useEffect, useRef, useState } from 'react'
import { DawnValley } from '../art/Landscapes'
import PetalField from '../art/PetalField'
import SakuraTree from '../art/SakuraTree'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { formatDate, parseLocal } from '../lib/date'
import { gsap, useGSAP } from '../lib/gsapSetup'
import HiddenOrb from '../easter-eggs/HiddenOrb'

const INTRO_KEY = 'sakura-intro-seen'
const STROKE_LENGTH = 720

function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    // Storage can be unavailable in private browsing; the intro still skips.
  }
}

/** Cinematic opening: letterbox, flare, handwritten names, then the date. */
export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishedRef = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [introDone, setIntroDone] = useState(() => reduced || hasSeenIntro())

  const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
  const dateLine = [
    formatDate(ceremony, wedding.timeZone, { day: '2-digit' }),
    formatDate(ceremony, wedding.timeZone, { month: 'long' }).toUpperCase(),
    formatDate(ceremony, wedding.timeZone, { year: 'numeric' }),
  ].join(' · ')

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    timelineRef.current?.pause()
    timelineRef.current?.progress(1)
    markIntroSeen()
    setIntroDone(true)
  }, [])

  useEffect(() => {
    if (introDone) markIntroSeen()
  }, [introDone])

  useGSAP(
    () => {
      if (introDone || !rootRef.current) return

      gsap.set('[data-name]', { strokeDasharray: STROKE_LENGTH, strokeDashoffset: STROKE_LENGTH })
      gsap.set('[data-name-fill]', { fillOpacity: 0 })
      gsap.set('[data-hero-fade]', { opacity: 0, y: 18 })

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish })
      timelineRef.current = timeline

      timeline
        .to('[data-letterbox]', {
          yPercent: (index: number) => (index === 0 ? -105 : 105),
          duration: 0.75,
          stagger: 0.08,
          ease: 'power4.inOut',
        })
        .fromTo(
          '[data-flare]',
          { opacity: 0, scale: 0.35 },
          { opacity: 0.95, scale: 1.5, duration: 0.5, ease: 'power2.out' },
          '-=0.4',
        )
        .to('[data-flare]', { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.05')
        .to(
          '[data-name]',
          { strokeDashoffset: 0, duration: 1.15, stagger: 0.16, ease: 'power2.inOut' },
          '-=0.8',
        )
        .to('[data-name-fill]', { fillOpacity: 1, duration: 0.55, stagger: 0.12 }, '-=0.7')
        .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 0.65, stagger: 0.06 }, '-=0.55')
    },
    { scope: rootRef },
  )

  return (
    <section
      id="top"
      ref={rootRef}
      aria-label={wedding.meta.pageTitle}
      className="relative min-h-[100svh] overflow-hidden bg-night text-sakura-cream"
    >
      <DawnValley className="z-0" />

      {/* The tree frames the left edge like a theatre wing. */}
      <SakuraTree
        className="pointer-events-none absolute -bottom-[8%] -left-[20%] z-[7] h-[118%] w-[92%] max-w-[980px] opacity-95 sm:-left-[12%] sm:w-[72%]"
        sway
      />

      <PetalField position="absolute" density={28} className="z-[9]" />

      {/* A stone lantern hides the fifth orb at the tree's roots. */}
      <div className="pointer-events-none absolute bottom-[19%] left-[4%] z-[11] hidden h-28 w-24 opacity-80 sm:block">
        <svg viewBox="0 0 96 112" className="h-full w-full" aria-hidden="true">
          <path d="M28 108 L68 108 L62 92 L34 92 Z" fill="#3a3340" />
          <path d="M36 92 L60 92 L60 54 L36 54 Z" fill="#514952" />
          <rect x="31" y="40" width="34" height="16" rx="2" fill="#6c6268" />
          <path d="M24 40 L72 40 L62 28 L34 28 Z" fill="#3a3340" />
          <path d="M38 28 L58 28 L52 18 L44 18 Z" fill="#514952" />
          <rect x="41" y="60" width="14" height="18" rx="2" fill="#f2a33a" opacity="0.7" />
        </svg>
        <HiddenOrb id="orb-5" className="absolute left-[30px] top-[58px]" />
      </div>

      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-end px-5 pb-20 pt-32 text-center sm:pb-28">
        <p
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          className="text-[10px] font-semibold tracking-[0.42em] uppercase text-sakura-cream/75"
        >
          {wedding.opening.presenter}
        </p>
        <p
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          className="mt-3 text-[10px] tracking-[0.32em] uppercase text-blossom/75"
        >
          {wedding.opening.occasion}
        </p>

        <h1 className="relative mt-2 w-full max-w-[860px]">
          <span className="sr-only">{`${wedding.bride.name} and ${wedding.groom.name}`}</span>
          <svg viewBox="0 0 900 310" className="w-full overflow-visible" aria-hidden="true">
            <text
              data-thread=""
              data-name=""
              data-name-fill=""
              x="450"
              y="112"
              textAnchor="middle"
              fontSize="132"
              className="font-display italic"
              fill="#fff9f2"
              stroke="#fff4e4"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={STROKE_LENGTH}
              strokeDashoffset={introDone ? 0 : STROKE_LENGTH}
              fillOpacity={introDone ? 1 : 0}
            >
              {wedding.bride.name}
            </text>
            <text
              data-hero-fade=""
              x="450"
              y="196"
              textAnchor="middle"
              fontSize="86"
              className="font-script"
              fill="#f4c6d0"
              style={{ opacity: introDone ? 1 : 0 }}
            >
              &amp;
            </text>
            <text
              data-thread=""
              data-name=""
              data-name-fill=""
              x="450"
              y="292"
              textAnchor="middle"
              fontSize="132"
              className="font-display italic"
              fill="#fff9f2"
              stroke="#fff4e4"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={STROKE_LENGTH}
              strokeDashoffset={introDone ? 0 : STROKE_LENGTH}
              fillOpacity={introDone ? 1 : 0}
            >
              {wedding.groom.name}
            </text>
          </svg>
        </h1>

        <div
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          className="mt-2 flex w-full max-w-xs items-center gap-3"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-gold-leaf/60" />
          <span className="size-1.5 rotate-45 bg-gold-leaf" />
          <span className="h-px flex-1 bg-gold-leaf/60" />
        </div>
        <p
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          className="mt-4 text-xs font-medium tracking-[0.3em] text-sakura-cream/85 sm:text-sm"
        >
          {dateLine}
        </p>
        <p
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          lang="hi"
          className="font-devanagari mt-2 text-sm text-blossom/85"
        >
          {wedding.blessingLine}
        </p>
        <p
          data-hero-fade=""
          style={{ opacity: introDone ? 1 : 0 }}
          className="mt-4 text-[11px] tracking-[0.22em] uppercase text-sakura-cream/60"
        >
          {`${wedding.opening.tagline} · ${wedding.placeLine}`}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 text-sakura-cream/70" aria-hidden="true">
          <span className="text-[9px] tracking-[0.34em]">FOLLOW THE PETALS</span>
          <span className="relative block h-10 w-6">
            <span className="absolute left-1/2 top-0 h-3 w-3 rounded-[80%_20%_70%_30%/30%_60%_40%_70%] bg-blossom animate-[scroll-dot_2.8s_ease-in-out_infinite]" />
          </span>
        </div>
      </div>

      {!introDone && (
        <>
          <div
            aria-hidden="true"
            onClick={finish}
            className="absolute inset-0 z-40 cursor-pointer"
          />
          <button
            type="button"
            onClick={finish}
            className="absolute bottom-[13vh] right-5 z-50 rounded-full border border-sakura-cream/45 bg-sumi/70 px-5 py-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-sakura-cream transition-colors hover:bg-sumi/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf"
          >
            Skip intro
          </button>

          <div data-letterbox="" className="absolute inset-x-0 top-0 z-30 h-[11vh] bg-sumi" aria-hidden="true" />
          <div data-letterbox="" className="absolute inset-x-0 bottom-0 z-30 h-[11vh] bg-sumi" aria-hidden="true" />
          <div
            data-flare=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,222,.85),rgba(242,163,58,.28)_38%,transparent_70%)] mix-blend-screen"
          />
        </>
      )}
    </section>
  )
}

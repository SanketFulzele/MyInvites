import { useRef } from 'react'
import SakuraBranch from '../art/SakuraBranch'
import BilingualText from '../components/anime/BilingualText'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import Seal from '../components/anime/Seal'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { formatDate, parseLocal } from '../lib/date'
import { gsap, useGSAP } from '../lib/gsapSetup'

const BRUSH_LENGTH = 260

/** A folded letter that opens in three washi-paper thirds on scroll. */
export default function LetterSection() {
  const rootRef = useRef<HTMLElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
  const dateLine = formatDate(ceremony, wedding.timeZone, { day: 'numeric', month: 'long', year: 'numeric' })
  const monogram = `${wedding.bride.name.charAt(0)} ♥ ${wedding.groom.name.charAt(0)}`

  useGSAP(
    () => {
      if (reduced || !letterRef.current) return

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: letterRef.current, start: 'top 82%', once: true },
      })

      timeline
        .fromTo(
          '[data-fold="top"]',
          { rotationX: -88, opacity: 0.25 },
          { rotationX: 0, opacity: 1, duration: 1.05 },
        )
        .fromTo(
          '[data-fold="bottom"]',
          { rotationX: 88, opacity: 0.25 },
          { rotationX: 0, opacity: 1, duration: 1.05 },
          '<0.12',
        )
        .fromTo(
          '[data-brush]',
          { strokeDashoffset: BRUSH_LENGTH },
          { strokeDashoffset: 0, duration: 0.9 },
          '-=0.55',
        )
        .fromTo(
          '[data-seal]',
          { scale: 0.5, opacity: 0, rotate: -20 },
          { scale: 1, opacity: 1, rotate: -7, duration: 0.65, ease: 'back.out(1.6)' },
          '-=0.5',
        )
    },
    { scope: rootRef },
  )

  const panelStyle = { backfaceVisibility: 'hidden' } as const

  return (
    <section
      id="letter"
      ref={rootRef}
      className="relative overflow-hidden bg-gradient-to-b from-night via-sakura-plum to-blossom/35 px-5 py-24 sm:px-8 sm:py-32"
    >
      <SakuraBranch className="pointer-events-none absolute -right-16 top-4 w-56 opacity-20 sm:w-72" flip />

      <div className="relative mx-auto max-w-2xl">
        <EpisodeTitle
          number="第一話 · Episode 01"
          title="An Invitation"
          kanji="招"
          tone="night"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />

        <div ref={letterRef} className="relative mx-auto mt-14 h-[690px] [perspective:1400px] sm:h-[720px]">
          {/* Top third */}
          <div
            data-fold="top"
            style={panelStyle}
            className="washi-paper absolute inset-x-0 top-0 h-1/3 origin-bottom border-b border-sakura-gold/25 px-7 pt-9 text-center sm:px-12"
          >
            <p lang="hi" className="font-devanagari text-sm tracking-[0.22em] text-vermilion/85">
              सादर आमंत्रण
            </p>
            <p className="mt-3 font-display text-2xl italic text-sumi sm:text-3xl">{wedding.opening.occasion}</p>
            <svg viewBox="0 0 220 18" className="mx-auto mt-3 h-4 w-52" aria-hidden="true">
              <path
                data-brush=""
                d="M6 12 C 46 4, 92 15, 132 7 S 196 11, 214 5"
                fill="none"
                stroke="#c8372d"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray={BRUSH_LENGTH}
              />
            </svg>
            <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-sumi/50">{wedding.opening.presenter}</p>
          </div>

          {/* Middle third */}
          <div
            data-fold="middle"
            style={panelStyle}
            className="washi-paper absolute inset-x-0 top-1/3 h-1/3 px-7 py-6 text-center sm:px-12 sm:py-8"
          >
            <BilingualText
              en={wedding.invitationLine.text}
              local={wedding.invitationLine.textLocal}
              className="text-[13px] leading-relaxed text-sumi/85 sm:text-sm"
              localClassName="text-[11px] leading-relaxed text-sumi/70 sm:text-xs"
            />
            <p className="mt-4 text-[13px] leading-relaxed text-sumi/75 sm:text-sm">{wedding.intro}</p>
          </div>

          {/* Bottom third */}
          <div
            data-fold="bottom"
            style={panelStyle}
            className="washi-paper absolute inset-x-0 top-2/3 h-1/3 origin-top border-t border-sakura-gold/25 px-7 pb-8 pt-6 text-center sm:px-12"
          >
            <div className="mx-auto h-px w-16 bg-sakura-gold/70" aria-hidden="true" />
            <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-sakura-plum/80">{dateLine}</p>
            <p className="mt-1.5 text-xs text-sumi/70">{wedding.venue.name}</p>
            <BilingualText
              en={wedding.inviters.text}
              local={wedding.inviters.textLocal}
              className="mt-5 text-[11px] leading-snug text-sumi/70"
              localClassName="text-[10px] leading-snug text-sumi/60"
            />
          </div>

          {/* Fold shadows sit above the panels, like creases in thick paper. */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/3 z-10 h-10 -translate-y-1/2 bg-gradient-to-b from-sumi/15 via-sumi/5 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-2/3 z-10 h-10 -translate-y-1/2 bg-gradient-to-t from-sumi/15 via-sumi/5 to-transparent"
            aria-hidden="true"
          />

          <div data-seal="" className="absolute -bottom-8 right-5 z-20 sm:right-10">
            <Seal label={monogram} sub="with love" size="md" />
          </div>
        </div>
      </div>
    </section>
  )
}

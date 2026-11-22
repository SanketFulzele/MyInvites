import { useRef } from 'react'
import { wedding } from '../data/wedding'
import HiddenOrb from '../easter-eggs/HiddenOrb'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { gsap, useGSAP } from '../lib/gsapSetup'

/** Deterministic blossom scatter so server and client draw the same valley. */
const BLOSSOMS = Array.from({ length: 54 }, (_, index) => ({
  x: (index * 137 + 38) % 2200,
  y: 150 + ((index * 83) % 330),
  r: 5 + (index % 5) * 2.2,
  opacity: 0.28 + (index % 4) * 0.16,
  tone: index % 3 === 0 ? '#f7d9e1' : index % 3 === 1 ? '#f4c2ce' : '#fff2f4',
}))

/** A quiet, wide valley that pans sideways as the reader scrolls. */
export default function SpringSection() {
  const rootRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reduced || !stripRef.current) return
      gsap.fromTo(
        stripRef.current,
        { xPercent: 0 },
        {
          xPercent: -38,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <section
      id="spring"
      ref={rootRef}
      className="relative overflow-hidden bg-sakura-cream py-32 text-sumi sm:py-44"
    >
      <div ref={stripRef} className="absolute bottom-0 left-0 top-0 w-[220%] will-change-transform">
        <svg
          viewBox="0 0 2200 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f7d9e1" />
              <stop offset="0.48" stopColor="#ffe4dc" />
              <stop offset="1" stopColor="#fff9f2" />
            </linearGradient>
            <linearGradient id="sp-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4c6d0" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fff9f2" stopOpacity="0.2" />
            </linearGradient>
            <filter id="sp-haze">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <rect width="2200" height="800" fill="url(#sp-sky)" />
          <circle cx="1520" cy="230" r="150" fill="#fff4d8" opacity="0.72" />
          <g filter="url(#sp-haze)" opacity="0.55">
            <ellipse cx="420" cy="360" rx="380" ry="26" fill="#fff9f2" />
            <ellipse cx="1460" cy="410" rx="460" ry="30" fill="#ffe4ea" />
          </g>

          {/* Three receding ridges give the strip its depth. */}
          <path d="M0 470 L240 350 L430 438 L690 306 L910 442 L1160 340 L1400 460 L1660 336 L1900 448 L2200 352 L2200 800 L0 800 Z" fill="#d9b6c2" opacity="0.65" />
          <path d="M0 560 L260 452 L500 548 L760 424 L1010 552 L1280 448 L1540 558 L1800 440 L2200 548 L2200 800 L0 800 Z" fill="#c9a4b6" opacity="0.55" />
          <path d="M0 656 C340 588 620 664 920 616 C1220 568 1540 656 1800 604 C1980 568 2100 592 2200 576 L2200 800 L0 800 Z" fill="#a9899d" opacity="0.5" />

          {/* The river threads through the whole pan. */}
          <path d="M-40 742 C300 690 560 754 880 706 C1200 658 1520 744 1840 686 C2020 654 2120 676 2240 660 L2240 800 L-40 800 Z" fill="url(#sp-water)" />
          {Array.from({ length: 24 }, (_, index) => (
            <path
              key={index}
              d={`M ${index * 96 - 20} ${724 + (index % 4) * 18} q 34 -6 68 0`}
              fill="none"
              stroke="#fff9f2"
              strokeOpacity={0.22 + (index % 3) * 0.1}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}

          {/* Two foreground trees anchor the composition. */}
          {[280, 1820].map((x) => (
            <g key={x}>
              <path d={`M ${x} 660 C ${x - 8} 560 ${x + 12} 470 ${x - 6} 388`} fill="none" stroke="#5c3c4b" strokeWidth="18" strokeLinecap="round" />
              <path d={`M ${x - 2} 520 C ${x - 50} 480 ${x - 82} 446 ${x - 106} 400 M ${x + 4} 468 C ${x + 48} 426 ${x + 84} 398 ${x + 112} 360`} fill="none" stroke="#5c3c4b" strokeWidth="7" strokeLinecap="round" />
            </g>
          ))}

          {BLOSSOMS.map((blossom, index) => (
            <g key={index}>
              <circle cx={blossom.x} cy={blossom.y} r={blossom.r} fill={blossom.tone} opacity={blossom.opacity} />
              <circle cx={blossom.x + blossom.r * 0.3} cy={blossom.y - blossom.r * 0.25} r={blossom.r * 0.4} fill="#fff9f2" opacity={blossom.opacity * 0.7} />
            </g>
          ))}

          <path d="M0 776 C360 748 720 790 1080 758 C1440 726 1800 778 2200 744 L2200 800 L0 800 Z" fill="#7c6574" opacity="0.5" />
        </svg>

        <HiddenOrb id="orb-6" className="absolute left-[61%] top-[54%]" />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="max-w-2xl font-display text-2xl italic leading-snug text-balance text-sumi drop-shadow-[0_1px_12px_rgba(255,249,242,.95)] sm:text-4xl">
          {wedding.interlude.line}
        </p>
        <p
          lang="ja"
          className="font-jp mt-10 text-sm leading-[2] tracking-[0.18em] text-sakura-plum/80 drop-shadow-[0_1px_8px_rgba(255,249,242,.9)] sm:text-base"
        >
          {wedding.interlude.haiku}
        </p>
      </div>

      <p
        lang="ja"
        aria-hidden="true"
        className="vertical-jp font-jp pointer-events-none absolute right-4 top-1/4 z-10 text-base tracking-[0.5em] text-sakura-plum/55 sm:right-10 sm:text-lg"
      >
        {wedding.interlude.haikuLocal}
      </p>
    </section>
  )
}

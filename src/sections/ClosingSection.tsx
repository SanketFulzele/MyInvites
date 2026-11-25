import { DESIGNER } from '../lib/credits'
import { motion } from 'framer-motion'
import { StarryNight } from '../art/Landscapes'
import SakuraTree from '../art/SakuraTree'
import EggCounter from '../easter-eggs/EggCounter'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

const PETAL_TRAIL = Array.from({ length: 7 }, (_, index) => ({
  left: 6 + index * 14,
  delay: (index % 4) * 0.8,
  duration: 5 + (index % 3),
}))

/** Two small figures beneath the blossoms, holding hands at the end. */
function Silhouettes() {
  return (
    <svg
      viewBox="0 0 360 200"
      className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[34%] w-[min(82vw,520px)] -translate-x-1/2"
      aria-hidden="true"
    >
      <ellipse cx="180" cy="190" rx="150" ry="8" fill="#0d0c20" opacity="0.7" />
      <g fill="#0d0c20">
        {/* Bride: bun, head, kimono, two feet. */}
        <circle cx="143" cy="66" r="19" />
        <circle cx="162" cy="50" r="8" />
        <path d="M124 88 Q143 80 162 88 L176 158 L110 158 Z" />
        <path d="M116 154 L132 154 L130 192 L114 192 Z" />
        <path d="M148 154 L164 154 L168 192 L152 192 Z" />
        {/* Groom: head, shoulders, coat, two feet. */}
        <circle cx="213" cy="70" r="19" />
        <path d="M194 91 Q213 83 232 91 L246 158 L180 158 Z" />
        <path d="M186 154 L202 154 L198 192 L182 192 Z" />
        <path d="M218 154 L234 154 L238 192 L222 192 Z" />
      </g>
      <path d="M160 118 Q180 130 200 118" fill="none" stroke="#0d0c20" strokeWidth="7" strokeLinecap="round" />
      <path d="M143 96 C120 104 112 122 108 142" fill="none" stroke="#0d0c20" strokeWidth="8" strokeLinecap="round" />
      <path d="M213 98 C236 106 244 122 248 142" fill="none" stroke="#0d0c20" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

/** The film's closing credits, then a small post-credits scene. */
export default function ClosingSection() {
  const reduced = usePrefersReducedMotion()
  const credits = [
    ...wedding.credits,
    { role: 'Music', name: wedding.music.title },
  ]

  return (
    <section
      id="closing"
      className="relative min-h-[100svh] overflow-hidden bg-night text-sakura-cream"
      aria-label="Ending credits"
    >
      <StarryNight className="z-0" />
      <div className="pointer-events-none absolute inset-0 z-[10] bg-gradient-to-b from-night/60 via-night/35 to-night/90" aria-hidden="true" />

      {/* End credits roll upward, then hold still when motion is reduced. */}
      <div className="relative z-20 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-20">
        <p className="text-[10px] font-semibold tracking-[0.48em] uppercase text-blossom/70">End credits</p>
        <div
          className="relative mt-8 max-h-[68svh] w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)',
          }}
        >
          <motion.div
            className="mx-auto max-w-2xl space-y-12 px-6 py-16 text-center sm:space-y-16"
            initial={reduced ? false : { y: 150 }}
            animate={reduced ? undefined : { y: [150, -300] }}
            transition={reduced ? undefined : { duration: 34, ease: 'linear', repeat: Infinity }}
          >
            {credits.map((credit) => (
              <div key={credit.role}>
                <p className="text-[10px] font-semibold tracking-[0.36em] uppercase text-gold-leaf/80">
                  {credit.role}
                </p>
                <p className="mt-3 font-display text-2xl italic leading-snug text-sakura-cream sm:text-4xl">
                  {credit.name}
                </p>
              </div>
            ))}
            <p lang="hi" className="font-devanagari text-lg tracking-[0.24em] text-blossom/85">
              {wedding.blessingLine}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Post-credits: the two of them under the sakura tree. */}
      <div className="relative z-20 flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-6 pb-14 pt-32 text-center">
        <SakuraTree
          className="pointer-events-none absolute -bottom-[14%] left-1/2 h-[92%] w-[132%] max-w-[1500px] -translate-x-1/2 opacity-90"
          sway={!reduced}
          ariaLabel="A sakura tree sheltering the couple"
        />
        <Silhouettes />

        <div className="relative z-20 flex flex-col items-center">
          <p lang="hi" className="font-devanagari text-sm tracking-[0.34em] text-blossom/85">
            धन्यवाद
          </p>
          <h2 className="mt-5 font-display text-3xl italic leading-snug text-shadow-glow sm:text-5xl">
            To be continued… forever.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-sakura-cream/85">{wedding.closingLine}</p>
          <p className="mt-8 font-script text-4xl text-blossom sm:text-5xl">
            {wedding.bride.name} <span className="text-gold-leaf">&amp;</span> {wedding.groom.name}
          </p>

          <div className="relative mt-14 inline-block">
            {!reduced &&
              PETAL_TRAIL.map((petal, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="petal-fall pointer-events-none absolute -top-16 z-10"
                  style={{
                    left: `${petal.left}%`,
                    animationDelay: `-${petal.delay}s`,
                    animationDuration: `${petal.duration}s`,
                  }}
                >
                  <span className="petal-shape block h-2.5 w-2 rounded-[80%_20%_70%_30%] bg-blossom/85" />
                </span>
              ))}
            <a
              href="#top"
              className="relative z-20 inline-flex min-h-11 items-center justify-center border-b border-gold-leaf/50 pb-1 text-[10px] font-semibold tracking-[0.3em] uppercase text-sakura-cream/85 transition hover:border-blossom hover:text-blossom focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf"
            >
              Back to the beginning
            </a>
          </div>

          {/* end-credit style designer line */}
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.36em] text-gold-leaf/80">{DESIGNER.label}</p>
          <p className="mt-1 font-display text-2xl italic text-sakura-cream">{DESIGNER.name}</p>

          <div className="mt-12 flex flex-col items-center gap-2">
            <EggCounter />
            <p className="text-[10px] tracking-[0.2em] text-sakura-cream/55">
              {wedding.secrets.total} little secrets hidden along the way
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

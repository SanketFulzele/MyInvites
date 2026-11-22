import { useRef } from 'react'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsapSetup'

type Illustration = 'umbrella' | 'tea' | 'family'

const ILLUSTRATIONS: Illustration[] = ['umbrella', 'tea', 'family']
const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-12']

/** Small original line drawings, one per manga panel. */
function ChapterArt({ kind }: { kind: Illustration }) {
  if (kind === 'umbrella') {
    return (
      <svg viewBox="0 0 260 170" className="h-32 w-auto text-sumi/70 sm:h-40" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M18 84 Q130 -14 242 84 Q206 64 180 84 Q150 64 130 84 Q108 64 80 84 Q50 64 18 84 Z" strokeWidth="2.4" />
        <path d="M130 84 V136 Q130 154 150 148" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M130 12 V84 M84 42 Q100 66 80 84 M176 42 Q160 66 180 84" strokeWidth="1.2" strokeOpacity="0.65" />
        {[24, 64, 104, 144, 184, 224].map((x, index) => (
          <path key={x} d={`M${x} ${104 + (index % 2) * 14} l-6 16`} strokeWidth="1.3" strokeOpacity="0.45" strokeLinecap="round" />
        ))}
      </svg>
    )
  }

  if (kind === 'tea') {
    return (
      <svg viewBox="0 0 260 170" className="h-32 w-auto text-sumi/70 sm:h-40" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M46 88 h58 v26 q-8 16 -29 16 t-29 -16 Z" strokeWidth="2.4" />
        <path d="M104 94 q20 -4 18 10 q-2 10 -18 8" strokeWidth="2.2" />
        <path d="M156 88 h58 v26 q-8 16 -29 16 t-29 -16 Z" strokeWidth="2.4" />
        <path d="M214 94 q20 -4 18 10 q-2 10 -18 8" strokeWidth="2.2" />
        <path d="M32 134 q37 10 78 0 M142 134 q37 10 78 0" strokeWidth="2" strokeLinecap="round" />
        <path d="M70 74 q-10 -14 2 -26 M74 70 q10 -12 0 -24 M180 74 q-10 -14 2 -26 M184 70 q10 -12 0 -24" strokeWidth="1.4" strokeOpacity="0.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 320 170" className="h-32 w-auto text-sumi/70 sm:h-40" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M18 44 Q160 -10 302 44" strokeWidth="2.4" />
      {[[54, 40], [96, 26], [140, 18], [184, 22], [228, 32], [268, 44]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="9" strokeWidth="1.4" strokeOpacity="0.7" />
      ))}
      {[70, 122, 198, 250].map((x) => (
        <g key={x} strokeWidth="2.2" strokeLinecap="round">
          <circle cx={x} cy={96} r="10" />
          <path d={`M${x} 106 v32 M${x - 12} 116 h24 M${x - 9} 138 l-6 18 M${x + 9} 138 l6 18`} />
        </g>
      ))}
      <path d="M148 104 q12 -12 24 0" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 158 H320" strokeWidth="1.5" strokeOpacity="0.45" />
    </svg>
  )
}

/** Asymmetric comic page with a pinned reading moment on desktop. */
export default function StorySection() {
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', rootRef.current)
      if (!pinRef.current || panels.length === 0) return

      if (reduced) {
        // No pin, no movement — just a quiet opacity fade as each panel arrives.
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.25,
              ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top 92%', once: true },
            },
          )
        })
        return
      }

      const matchMedia = gsap.matchMedia()

      matchMedia.add('(min-width: 768px)', () => {
        gsap.set(panels, { opacity: 0.22, y: 34 })

        const reveal = (progress: number) => {
          panels.forEach((panel, index) => {
            const local = gsap.utils.clamp(0, 1, progress * panels.length - index)
            gsap.set(panel, { opacity: 0.22 + local * 0.78, y: (1 - local) * 34 })
          })
        }

        const pin = ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top 16%',
          end: '+=80%',
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => reveal(self.progress),
          onRefresh: (self) => reveal(self.progress),
        })

        return () => {
          pin.kill()
          gsap.set(panels, { clearProps: 'opacity,transform' })
        }
      })

      matchMedia.add('(max-width: 767px)', () => {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { opacity: 0.25, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
            },
          )
        })
      })

      return () => matchMedia.revert()
    },
    { scope: rootRef },
  )

  return (
    <section
      id="story"
      ref={rootRef}
      className="relative overflow-hidden bg-gradient-to-b from-blossom/35 via-sakura-cream to-sakura-cream px-5 py-24 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <EpisodeTitle
          number="第三話 · Episodes 03–05"
          title="Three small chapters"
          kanji="話"
          tone="light"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />

        <div
          ref={pinRef}
          className="mt-14 max-h-[78svh] snap-y snap-mandatory space-y-4 overflow-y-auto pb-4 md:max-h-none md:space-y-0 md:overflow-visible md:pb-0"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            {wedding.story.chapters.map((chapter, index) => {
              const illustration = ILLUSTRATIONS[index] ?? 'family'
              return (
                <article
                  key={`${chapter.label}-${chapter.title}`}
                  data-panel=""
                  className={`relative isolate snap-start overflow-hidden border-[3px] border-sumi bg-sakura-cream text-sumi sakura-shadow ${
                    SPANS[index] ?? 'md:col-span-12'
                  } ${index === 2 ? 'md:min-h-[340px]' : 'md:min-h-[470px]'}`}
                >
                  {/* Screentone dots and speed lines, drawn per panel. */}
                  <svg
                    viewBox="0 0 520 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern id={`story-tone-${index}`} width="9" height="9" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.15" fill="#1e1b2e" opacity="0.2" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#story-tone-${index})`} />
                    <g stroke="#1e1b2e" strokeOpacity="0.12" strokeWidth={index === 2 ? 1 : 1.6}>
                      {Array.from({ length: 14 }, (_, line) => (
                        <line
                          key={line}
                          x1={-140 + line * 46}
                          y1="0"
                          x2={-60 + line * 46}
                          y2="100"
                        />
                      ))}
                    </g>
                    <path
                      d={index % 2 === 0 ? 'M0 0 Q220 40 460 8' : 'M0 100 Q260 60 520 92'}
                      fill="none"
                      stroke="#c8372d"
                      strokeOpacity="0.28"
                      strokeWidth="3"
                    />
                  </svg>

                  <div className="relative flex h-full flex-col gap-4 p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        data-thread=""
                        className="grid size-11 shrink-0 place-items-center border-2 border-sumi bg-vermilion font-display text-lg text-sakura-cream"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-sumi/60">
                        {chapter.label}
                      </span>
                    </div>

                    <div className="flex flex-1 items-center justify-center py-2">
                      <ChapterArt kind={illustration} />
                    </div>

                    <div>
                      <h3 className="font-display text-2xl italic leading-tight sm:text-3xl">{chapter.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sumi/75">{chapter.text}</p>
                    </div>

                    {chapter.dialogue && (
                      <div
                        className={`relative w-fit max-w-[88%] rounded-[45%_55%_50%_50%/55%_45%_55%_45%] border-2 border-sumi bg-white/90 px-5 py-3 text-center font-script text-lg text-sakura-plum after:absolute after:-bottom-3 after:left-10 after:size-4 after:rotate-45 after:border-b-2 after:border-r-2 after:border-sumi after:bg-white/90 sm:text-xl ${
                          index % 2 === 1 ? 'ml-auto' : ''
                        }`}
                      >
                        {chapter.dialogue}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

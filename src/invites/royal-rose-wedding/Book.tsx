import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Medallion, RoseImg, ROSE_CLUSTER } from './art'
import { EASE, Flourish } from './ui'

type Phase = 'loading' | 'ready' | 'opening' | 'zoom'

interface Props {
  /** Files to preload behind the loader. */
  assets: string[]
  audio: HTMLAudioElement | null
  coverNames: [string, string]
  tapLabel: string
  onOpen: () => void
  onDone: () => void
}

function preloadImage(src: string) {
  return new Promise<void>((res) => {
    const img = new Image()
    img.onload = img.onerror = () => res()
    img.src = src
  })
}

function preloadAudio(a: HTMLAudioElement | null) {
  return new Promise<void>((res) => {
    if (!a || a.readyState >= 3) return res()
    const done = () => res()
    a.addEventListener('canplaythrough', done, { once: true })
    a.addEventListener('error', done, { once: true })
    a.load()
    // never hold guests hostage to a slow network: give the song 6s max
    window.setTimeout(done, 6000)
  })
}

export default function Book({ assets, audio, coverNames, tapLabel, onOpen, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(0)
  const stage = useRef<HTMLDivElement>(null)

  // load everything behind the loader
  useEffect(() => {
    let done = 0
    const jobs: Promise<void>[] = [...assets.map(preloadImage), preloadAudio(audio), document.fonts?.ready.then(() => undefined) ?? Promise.resolve()]
    const total = jobs.length
    jobs.forEach((j) => j.then(() => setProgress(Math.round((++done / total) * 100))))
    Promise.all(jobs).then(() => window.setTimeout(() => setPhase('ready'), 350))
  }, [assets, audio])

  // gentle pointer parallax for the roses
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      el.style.setProperty('--px', x.toFixed(3))
      el.style.setProperty('--py', y.toFixed(3))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const open = () => {
    if (phase !== 'ready') return
    onOpen()
    setPhase('opening')
    window.setTimeout(() => setPhase('zoom'), 1250)
    window.setTimeout(onDone, 2250)
  }

  const opened = phase === 'opening' || phase === 'zoom'
  const par = (depth: number) => ({ transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px))` })

  return (
    <motion.div
      ref={stage}
      className="motion-keep fixed inset-0 z-[70] overflow-hidden"
      style={{ background: 'radial-gradient(120% 80% at 50% 40%, #fff6f2 0%, #f7e1df 55%, #eec7c8 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'zoom' ? 0 : 1 }}
      transition={{ duration: phase === 'zoom' ? 0.9 : 0.3, delay: phase === 'zoom' ? 0.15 : 0 }}
    >
      {/* back roses — blurred, slow parallax */}
      <div className="absolute inset-0" style={par(-14)}>
        <RoseImg tone="blush" className="rr-float absolute -left-10 top-[12%] w-40 opacity-60 blur-[5px]" />
        <RoseImg tone="ivory" className="rr-float absolute -right-8 top-[34%] w-32 opacity-60 blur-[5px]" style={{ animationDelay: '-2s' }} />
        <RoseImg tone="wine" className="rr-float absolute left-[18%] bottom-[8%] w-24 opacity-40 blur-[6px]" style={{ animationDelay: '-4s' }} />
      </div>

      {/* loader */}
      {phase === 'loading' && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e8d3a8" strokeWidth="2" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#9a7637" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${(progress / 100) * 213.6} 213.6`} style={{ transition: 'stroke-dasharray .4s' }} />
              </svg>
              <Medallion className="absolute inset-3" />
            </div>
            <p className="mt-5 font-montserrat text-xs font-medium uppercase tracking-[0.3em] text-rr-wine/70">Preparing your invitation · {progress}%</p>
          </div>
        </div>
      )}

      {/* the book */}
      {phase !== 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ perspective: 1600 }}>
          <motion.button
            type="button"
            onClick={open}
            aria-label={tapLabel}
            className="relative block aspect-[3/4.15] w-[min(66vw,300px)] cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-rr-gold/50"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, y: 30, rotateY: -18, rotateX: 8 }}
            animate={
              phase === 'zoom'
                ? { opacity: 1, y: 0, rotateY: 0, rotateX: 0, scale: 3.1, x: '-26%' }
                : opened
                  ? { opacity: 1, y: 0, rotateY: -8, rotateX: 4, scale: 1.05, x: '22%' }
                  : { opacity: 1, y: [0, -8, 0], rotateY: -18, rotateX: 8 }
            }
            transition={
              phase === 'zoom'
                ? { duration: 1.05, ease: [0.65, 0, 0.35, 1] }
                : opened
                  ? { duration: 1.2, ease: EASE }
                  : { y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 1.2, ease: EASE } }
            }
          >
            {/* pages (seen when the cover opens) */}
            <div className="rr-paper absolute inset-0 rounded-r-[6px] rounded-l-[2px] shadow-[0_30px_60px_-20px_rgba(74,18,32,.6)]">
              <div className="absolute inset-y-1 -right-[5px] w-[6px] rounded-r-sm bg-[repeating-linear-gradient(180deg,#f3e6d6_0_2px,#d9c6ad_2px_3px)]" />
              <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                <Medallion className="h-16 w-16" />
                <p className="mt-3 font-montserrat text-[10px] font-medium uppercase tracking-[0.28em] text-rr-gold-deep">Together with their Families</p>
                <p className="mt-2 font-playfair text-xl italic text-rr-wine">{coverNames[0]}</p>
                <p className="font-playfair text-sm text-rr-gold-deep">&amp;</p>
                <p className="font-playfair text-xl italic text-rr-wine">{coverNames[1]}</p>
              </div>
            </div>

            {/* cover — swings open on its left hinge */}
            <motion.div
              className="absolute inset-0"
              style={{ transformOrigin: '0% 50%', transformStyle: 'preserve-3d' }}
              initial={false}
              animate={{ rotateY: opened ? -168 : 0 }}
              transition={{ duration: 1.25, ease: [0.6, 0.05, 0.25, 1] }}
            >
              {/* outside */}
              <div className="rr-velvet absolute inset-0 overflow-hidden rounded-r-[8px] rounded-l-[3px] shadow-[inset_8px_0_14px_-6px_rgba(0,0,0,.55),0_30px_60px_-24px_rgba(74,18,32,.75)] [backface-visibility:hidden]">
                <svg viewBox="0 0 300 415" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                  <rect x="14" y="14" width="272" height="387" rx="4" fill="none" stroke="#c6a15b" strokeWidth="2" />
                  <rect x="21" y="21" width="258" height="373" rx="3" fill="none" stroke="#c6a15b" strokeWidth=".8" />
                  {[
                    [21, 21, 1, 1],
                    [279, 21, -1, 1],
                    [21, 394, 1, -1],
                    [279, 394, -1, -1],
                  ].map(([x, y, sx, sy]) => (
                    <path key={`${x}${y}`} transform={`translate(${x} ${y}) scale(${sx} ${sy})`} d="M0 0 C18 2 26 10 28 28 M0 0 C2 18 10 26 28 28 M8 8 L16 16" stroke="#e3c887" strokeWidth="1.4" fill="none" />
                  ))}
                </svg>
                <div className="absolute inset-y-0 left-3 w-[3px] bg-gradient-to-b from-[#c6a15b]/0 via-[#c6a15b]/70 to-[#c6a15b]/0" />
                <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                  <Medallion className="h-[34%] w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,.35)]" />
                  <p className="mt-5 font-playfair text-[1.55rem] leading-tight italic rr-gold-text">
                    {coverNames[0]}
                    <span className="mx-2 not-italic">&amp;</span>
                    {coverNames[1]}
                  </p>
                  <Flourish className="mt-3 h-3 w-28 text-[#d8bb7a]" />
                  <p className="mt-3 font-montserrat text-[10px] font-medium uppercase tracking-[0.34em] text-[#e9d3a0]">Wedding Invitation</p>
                </div>
              </div>
              {/* inside of the cover */}
              <div className="absolute inset-0 rounded-l-[8px] rounded-r-[3px] bg-[#f3e3d6] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="absolute inset-3 rounded border border-rr-gold/40 bg-[radial-gradient(circle_at_50%_50%,#f7e1df,#f3e3d6_70%)]" />
              </div>
            </motion.div>
          </motion.button>

          <motion.p
            className="mt-10 font-montserrat text-xs font-medium uppercase tracking-[0.32em] text-rr-wine"
            initial={{ opacity: 0 }}
            animate={{ opacity: opened ? 0 : [0.45, 1, 0.45] }}
            transition={opened ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity }}
          >
            {tapLabel}
          </motion.p>
        </div>
      )}

      {/* front roses — blurred, faster parallax */}
      <div className="pointer-events-none absolute inset-0" style={par(26)}>
        <img src={ROSE_CLUSTER} alt="" aria-hidden className="absolute -left-14 -top-12 w-56 opacity-95 blur-[2px] sm:w-72" />
        <img src={ROSE_CLUSTER} alt="" aria-hidden className="absolute -bottom-14 -right-14 w-60 rotate-180 opacity-95 blur-[2px] sm:w-80" />
      </div>
    </motion.div>
  )
}

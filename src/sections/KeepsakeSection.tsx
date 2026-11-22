import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { toPng } from 'html-to-image'
import EpisodeTitle from '../components/anime/EpisodeTitle'
import { wedding } from '../data/wedding'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { fmt, parseLocal } from '../lib/date'

const PETAL_ANGLES = [0, 72, 144, 216, 288]

/** Hand-inked blossom spray drawn locally so the keepsake exports without a network. */
function BlossomSpray() {
  const blossoms = [
    { x: 118, y: 56, scale: 1 },
    { x: 78, y: 92, scale: 0.72 },
    { x: 150, y: 104, scale: 0.62 },
  ]

  return (
    <svg viewBox="0 0 190 150" className="pointer-events-none absolute -right-3 -top-4 h-36 w-48" aria-hidden="true">
      <path
        d="M-6 148 C28 124 54 100 86 70 C108 50 134 36 168 22"
        fill="none"
        stroke="#5c3c4b"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M58 100 C48 86 44 72 46 60 M106 58 C100 44 102 32 108 24" fill="none" stroke="#5c3c4b" strokeWidth="2.2" />
      {blossoms.map((blossom) => (
        <g key={`${blossom.x}-${blossom.y}`} transform={`translate(${blossom.x} ${blossom.y}) scale(${blossom.scale})`}>
          {PETAL_ANGLES.map((angle) => (
            <path
              key={angle}
              d="M0 0 C-9 -7 -12 -19 -4 -25 L0 -21 L4 -25 C12 -19 9 -7 0 0 Z"
              transform={`rotate(${angle}) translate(0 -2)`}
              fill={angle % 144 === 0 ? '#f4c6d0' : '#fbd7df'}
              stroke="#c8372d"
              strokeOpacity="0.5"
              strokeWidth="0.9"
            />
          ))}
          <circle r="4.5" fill="#c8372d" />
          <circle r="1.6" fill="#ffe9c4" />
        </g>
      ))}
      <path d="M26 132 q-12 -5 -18 -18 M42 120 q-4 -12 -2 -22" fill="none" stroke="#c9a45c" strokeWidth="2" />
    </svg>
  )
}

/** Episode 14: a downloadable, shareable paper invitation. */
export default function KeepsakeSection() {
  const cardRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const finePointerRef = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [status, setStatus] = useState('')
  const [downloading, setDownloading] = useState(false)

  const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
  const dateLine = `${fmt.weekday(ceremony, wedding.timeZone)}, ${fmt.day(ceremony, wedding.timeZone)} ${fmt.month(ceremony, wedding.timeZone)} ${fmt.year(ceremony, wedding.timeZone)}`
  const timeLine = `${fmt.time(ceremony, wedding.timeZone)} · ${wedding.timeZone}`
  const placeLine = `${wedding.city}, ${wedding.country}`

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)')
    const sync = () => {
      finePointerRef.current = query.matches
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || !finePointerRef.current || !tiltRef.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    tiltRef.current.style.transform = `perspective(1200px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`
  }

  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  const download = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    setStatus('Preparing your keepsake…')
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const anchor = document.createElement('a')
      anchor.href = dataUrl
      anchor.download = `${wedding.bride.name}-${wedding.groom.name}-invitation.png`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setStatus('Your keepsake has been downloaded.')
    } catch {
      setStatus('The image could not be made here. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const share = async () => {
    const text = `${wedding.bride.name} & ${wedding.groom.name} · ${wedding.meta.pageTitle}`
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: wedding.meta.pageTitle, text, url: window.location.href })
        setStatus('Invitation shared.')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setStatus('Sharing cancelled.')
          return
        }
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href)
      setStatus('Invitation link copied to your clipboard.')
    } catch {
      setStatus('Sharing is unavailable — copy the link from your address bar.')
    }
  }

  return (
    <section
      id="keepsake"
      className="relative overflow-hidden bg-gradient-to-b from-blossom/35 via-sakura-cream to-blossom/35 px-5 py-24 text-sumi sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <EpisodeTitle
          number="特別編 · Special Episode"
          title="The Invitation Card"
          kanji="券"
          tone="light"
          className="text-center [&>div:first-child]:justify-center [&>h2]:text-center"
        />
        <p className="mx-auto mt-5 max-w-lg text-center text-xs leading-relaxed tracking-[0.14em] text-sumi/60">
          {wedding.opening.tagline} · {placeLine}
        </p>

        <div
          className="relative mx-auto mt-14 w-full max-w-md [perspective:1200px]"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          onBlur={resetTilt}
        >
          <div
            ref={tiltRef}
            className="transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' }}
          >
            <div
              ref={cardRef}
              className="relative overflow-hidden border border-gold-leaf/55 bg-[#fbf0e2] px-7 py-12 text-center text-sumi sakura-shadow sm:px-11 sm:py-14"
              style={{ backgroundColor: '#fbf0e2' }}
            >
              <BlossomSpray />
              <div className="pointer-events-none absolute inset-2 border border-gold-leaf/25" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gold-leaf/10" aria-hidden="true" />

              <div className="relative z-10">
                <p className="text-[9px] font-semibold tracking-[0.36em] uppercase text-sakura-plum/70">
                  {wedding.opening.presenter}
                </p>
                <p className="mt-2 font-display text-base italic text-sumi/70">{wedding.opening.occasion}</p>

                <div className="mx-auto mt-6 h-px w-20 bg-gold-leaf/70" aria-hidden="true" />

                <p className="mt-7 font-display text-4xl leading-tight sm:text-5xl">{wedding.bride.name}</p>
                <p className="my-1 font-script text-3xl text-vermilion">&amp;</p>
                <p className="font-display text-4xl leading-tight sm:text-5xl">{wedding.groom.name}</p>

                <p lang="hi" className="font-devanagari mt-4 text-base tracking-[0.12em] text-sakura-plum/85">
                  {wedding.blessingLine}
                </p>

                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-sumi/75">{dateLine}</p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-sumi/55">{timeLine}</p>

                <div className="mx-auto mt-6 h-px w-16 bg-gold-leaf/45" aria-hidden="true" />

                <p className="mt-5 text-sm font-medium tracking-wide text-sumi/85">{placeLine}</p>
                <p className="mt-1 text-xs leading-relaxed text-sumi/70">{wedding.venue.name}</p>
                <p className="mt-1 font-devanagari text-xs text-sakura-plum/70">{wedding.venue.nameLocal}</p>

                <p className="mt-9 font-script text-2xl text-vermilion/85">
                  {wedding.bride.name} &amp; {wedding.groom.name}
                </p>
                <p className="mt-2 text-[10px] leading-relaxed tracking-wide text-sumi/55">{wedding.inviters.text}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => void download()}
            disabled={downloading}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-sakura-plum px-6 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-sakura-cream transition hover:bg-vermilion disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf"
          >
            {downloading ? 'Preparing…' : 'Download keepsake'}
          </button>
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-sakura-plum/55 bg-white/55 px-6 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-sakura-plum transition hover:border-vermilion hover:text-vermilion focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf"
          >
            Share
          </button>
        </div>

        <p
          role="status"
          aria-live="polite"
          className="mx-auto mt-4 min-h-5 max-w-md text-center text-xs leading-relaxed text-sumi/65"
        >
          {status}
        </p>
      </div>
    </section>
  )
}

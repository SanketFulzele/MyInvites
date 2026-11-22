import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { DevPlaceholder, EASE, FadeUp, MaskLines, Mono, Section } from './ui'
import type { WeddingInviteConfig } from '../../types'

export default function Venue({ config }: { config: WeddingInviteConfig }) {
  const { venue, photos } = config
  const mapWrap = useRef<HTMLDivElement>(null)
  const [loadMap, setLoadMap] = useState(false)
  const [copied, setCopied] = useState(false)

  const q = encodeURIComponent(venue.mapQuery)
  const embed = `https://maps.google.com/maps?q=${q}&z=15&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`

  useEffect(() => {
    const el = mapWrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadMap(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${venue.address}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Section id="venue" className="overflow-hidden bg-obsidian py-24 sm:py-32">
      <div className="absolute left-1/2 top-40 h-[30rem] w-[30rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(102,217,255,.08),transparent_65%)]" />

      <header className="relative mx-auto max-w-5xl px-6">
        <FadeUp>
          <Mono className="text-arc/80">Target location · {config.placeLine}</Mono>
        </FadeUp>
        <MaskLines lines={[venue.name]} className="mt-4 font-display text-[clamp(3.2rem,15vw,6.5rem)] leading-[0.92] text-paper" />
        {venue.nameLocal && (
          <FadeUp delay={0.1}>
            <p className="mt-2 font-marathi text-xl text-champagne/80">{venue.nameLocal}</p>
          </FadeUp>
        )}
      </header>

      <div className="relative mx-auto mt-10 max-w-5xl sm:px-6">
        {photos.venue ? (
          <FadeUp className="mb-3">
            <img src={photos.venue.src} alt={photos.venue.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" style={{ objectPosition: photos.venue.focus }} />
          </FadeUp>
        ) : (
          <DevPlaceholder label="Venue photograph — set photos.venue in config.ts" className="mx-6 mb-3 aspect-[16/9] sm:mx-0" />
        )}

        {/* live map */}
        <motion.div
          ref={mapWrap}
          className="relative h-[56svh] max-h-[520px] min-h-[340px] overflow-hidden bg-obsidian-2"
          initial={{ clipPath: 'inset(8% 8% 8% 8%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {loadMap && (
            <iframe
              title={`Map showing ${venue.name}`}
              src={embed}
              className="absolute inset-0 h-full w-full border-0 [filter:invert(.92)_hue-rotate(180deg)_saturate(.55)_contrast(.95)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}
          {/* targeting frame */}
          <div className="pointer-events-none absolute inset-3">
            {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => (
              <span key={c} className={`absolute h-4 w-4 border-arc/70 ${c}`} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-obsidian/70 to-transparent" />
          <Mono className="pointer-events-none absolute left-6 top-5 text-arc/90">● Live map</Mono>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-5xl gap-10 px-6 md:grid-cols-[1.2fr_1fr] md:items-end">
        <FadeUp>
          <dl className="grid grid-cols-[5.5rem_1fr] gap-y-4 font-body text-[15px]">
            <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">Address</dt>
            <dd>
              <p className="leading-relaxed text-paper">{venue.address}</p>
              {venue.addressLocal && <p className="mt-1 font-marathi text-paper/55">{venue.addressLocal}</p>}
            </dd>
            {venue.landmark && (
              <>
                <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40">Landmark</dt>
                <dd className="text-paper/80">{venue.landmark}</dd>
              </>
            )}
          </dl>
        </FadeUp>

        <FadeUp delay={0.1}>
          <motion.a
            href={directions}
            target="_blank"
            rel="noreferrer"
            whileHover="on"
            whileTap="on"
            className="relative flex items-center justify-between overflow-hidden bg-iron px-6 py-5 font-body text-[15px] font-medium text-paper"
          >
            <motion.span className="absolute inset-0 origin-left bg-iron-deep" initial={{ scaleX: 0 }} variants={{ on: { scaleX: 1 } }} transition={{ duration: 0.45, ease: EASE }} />
            <span className="relative">Get directions</span>
            <motion.span className="relative" variants={{ on: { x: 4 } }}>
              →
            </motion.span>
          </motion.a>
          <div className="mt-3 grid grid-cols-2 border border-paper/12 font-body text-sm">
            {venue.locationLink && (
              <a href={venue.locationLink} target="_blank" rel="noreferrer" className="border-r border-paper/12 px-4 py-4 text-center text-paper/80 active:bg-paper/5">
                Location from card
              </a>
            )}
            <button onClick={copy} className={`px-4 py-4 text-center text-paper/80 active:bg-paper/5 ${venue.locationLink ? '' : 'col-span-2'}`} aria-live="polite">
              {copied ? <span className="text-arc">Address copied</span> : 'Copy address'}
            </button>
          </div>
        </FadeUp>
      </div>
    </Section>
  )
}

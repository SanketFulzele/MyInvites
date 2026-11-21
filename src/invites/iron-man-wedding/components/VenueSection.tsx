import { useEffect, useRef, useState } from 'react'
import { Copy, Check, MapPin, Navigation, QrCode } from 'lucide-react'
import { HudPanel, Reveal, SectionHeading } from './Hud'
import { useJarvis } from './Jarvis'
import type { WeddingInviteConfig } from '../../types'

export default function VenueSection({ config }: { config: WeddingInviteConfig }) {
  const { venue } = config
  const { say } = useJarvis()
  const ref = useRef<HTMLDivElement>(null)
  const [loadMap, setLoadMap] = useState(false)
  const [copied, setCopied] = useState(false)

  const q = encodeURIComponent(venue.mapQuery)
  const embed = `https://maps.google.com/maps?q=${q}&z=15&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`

  // lazy-load the iframe when the section approaches the viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadMap(true)
          say('Venue coordinates locked. Shall I plot a route?', 'venue')
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [say])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${venue.address}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="venue" ref={ref} className="relative scroll-mt-4 px-5 py-20">
      <SectionHeading code="TARGET LOCATION" local="विवाहस्थळ" title={<>Wedding <em className="text-stark-amber">Venue</em></>} />

      <Reveal className="mx-auto max-w-3xl">
        <HudPanel glow="gold" className="overflow-hidden">
          <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-t-2xl bg-stark-steel sm:aspect-[16/8]">
            {loadMap ? (
              <iframe
                title={`Map to ${venue.name}`}
                src={embed}
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(.25)_contrast(1.05)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/40">
                <MapPin className="h-8 w-8 animate-pulse" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-stark-red/50 to-stark-crimson/20 text-stark-amber">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-3xl font-semibold leading-tight text-white">{venue.name}</h3>
                {venue.nameLocal && <p className="font-marathi text-lg text-stark-amber/85">{venue.nameLocal}</p>}
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">{venue.address}</p>
            {venue.addressLocal && <p className="mt-1 font-marathi text-[15px] text-white/50">{venue.addressLocal}</p>}
            {venue.landmark && <p className="mt-2 text-sm text-reactor/80">{venue.landmark}</p>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-stark-crimson via-stark-red to-stark-crimson px-6 py-4 text-sm font-bold tracking-wide text-white shadow-[0_0_30px_-8px_rgba(179,18,31,.9)]"
              >
                <Navigation className="h-4 w-4" /> Get Directions
              </a>
              {venue.locationLink ? (
                <a
                  href={venue.locationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-stark-gold/50 px-6 py-4 text-sm font-semibold text-stark-amber"
                >
                  <QrCode className="h-4 w-4" /> Location from card
                </a>
              ) : (
                <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-full border border-stark-gold/50 px-6 py-4 text-sm font-semibold text-stark-amber">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy address'}
                </button>
              )}
            </div>
            {venue.locationLink && (
              <button onClick={copy} className="mx-auto mt-4 flex items-center gap-1.5 text-xs text-white/45 hover:text-white/70">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Address copied' : 'Copy address'}
              </button>
            )}
          </div>
        </HudPanel>
      </Reveal>
    </section>
  )
}

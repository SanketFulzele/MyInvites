import type { WeddingVenue } from '../../data/wedding'

interface Props {
  venue: WeddingVenue
  /** Only mount the iframe once the scroll is open or the stop is in view. */
  active: boolean
  className?: string
}

export default function VenueMap({ venue, active, className = '' }: Props) {
  return (
    <div className={`relative overflow-hidden border border-gold-leaf/35 bg-sumi/10 ${className}`}>
      {active ? (
        <iframe
          src={venue.mapsEmbedUrl}
          title={`Map of ${venue.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(201,164,92,.16),transparent_65%)] p-4 text-center">
          <div>
            <div className="mx-auto h-8 w-8 rounded-full border border-vermilion/50 bg-vermilion/10" aria-hidden="true" />
            <p className="mt-3 font-display text-lg italic text-sumi/70">{venue.name}</p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-sumi/45">
              {venue.lat.toFixed(3)}° S · {venue.lng.toFixed(3)}° E
            </p>
          </div>
        </div>
      )}
      {venue.isSample && (
        <span className="absolute right-2 top-2 border border-gold-leaf/40 bg-washi-paper/90 px-2 py-1 text-[9px] tracking-[0.14em] text-sumi/60">
          SAMPLE VENUE
        </span>
      )}
    </div>
  )
}

import { Navigation } from 'lucide-react'

export default function DirectionsButton({
  url,
  label = 'GET DIRECTIONS',
  className = '',
}: {
  url: string
  label?: string
  className?: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 border-b border-vermilion/50 px-1 py-2 text-[10px] font-semibold tracking-[0.22em] text-vermilion transition hover:border-vermilion hover:text-gold-leaf focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion ${className}`}
    >
      {label} <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

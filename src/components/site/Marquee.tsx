import type { ReactNode } from 'react'

/**
 * React Bits–style seamless marquee. Pass the items once; the component
 * duplicates them so the -50% translate loops without a visible jump.
 */
export default function Marquee({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) {
  const track = [...items, ...items]

  return (
    <div className="group relative flex overflow-hidden" aria-hidden="true">
      <div
        className={`flex w-max shrink-0 items-center ${reverse ? '[animation-direction:reverse]' : ''} animate-marquee group-hover:[animation-play-state:paused]`}
      >
        {track.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

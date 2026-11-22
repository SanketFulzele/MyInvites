import { useEffect, useState } from 'react'

export interface EpisodeLink {
  id: string
  label: string
  kanji?: string
}

/** Slim episode rail on desktop; a compact bottom sheet on mobile. */
export default function EpisodeNav({ episodes }: { episodes: EpisodeLink[] }) {
  const [active, setActive] = useState(episodes[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    episodes.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [episodes])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(id)
  }

  return (
    <>
      <nav
        aria-label="Episode navigator"
        className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 lg:flex"
      >
        {episodes.map((episode, i) => (
          <button
            key={episode.id}
            type="button"
            onClick={() => go(episode.id)}
            aria-label={`Episode ${i + 1}: ${episode.label}`}
            aria-current={active === episode.id ? 'true' : undefined}
            className="group flex min-h-[28px] items-center justify-end gap-2"
          >
            <span
              className={`max-w-0 overflow-hidden whitespace-nowrap text-[9px] tracking-[0.18em] transition-all group-hover:max-w-[160px] group-focus-visible:max-w-[160px] ${
                active === episode.id ? 'max-w-[160px] text-sumi' : 'text-sumi/40'
              }`}
            >
              {episode.label}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full border transition-all ${
                active === episode.id
                  ? 'scale-150 border-vermilion bg-vermilion'
                  : 'border-sumi/40 bg-transparent group-hover:border-vermilion'
              }`}
            />
          </button>
        ))}
      </nav>

      <nav
        aria-label="Episode navigator (mobile)"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-leaf/30 bg-washi-paper/90 px-2 py-2 backdrop-blur-md lg:hidden"
      >
        <div className="flex snap-x gap-2 overflow-x-auto pb-[env(safe-area-inset-bottom)]">
          {episodes.map((episode, i) => (
            <button
              key={episode.id}
              type="button"
              onClick={() => go(episode.id)}
              aria-current={active === episode.id ? 'true' : undefined}
              className={`flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full border px-3 text-[10px] tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion ${
                active === episode.id
                  ? 'border-vermilion bg-vermilion text-sakura-cream'
                  : 'border-gold-leaf/35 text-sumi/65'
              }`}
            >
              <span className="font-jp opacity-70">{episode.kanji ?? String(i + 1)}</span>
              {episode.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

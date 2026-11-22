import type { ReactNode } from 'react'

export type EpisodeTone = 'light' | 'dark' | 'vermilion' | 'wisteria' | 'lantern' | 'gold' | 'night'

interface Props {
  number: string
  title: string
  subtitle?: string
  kanji?: string
  tone?: EpisodeTone
  className?: string
  children?: ReactNode
}

const TONES: Record<EpisodeTone, string> = {
  light: 'text-sumi',
  dark: 'text-sakura-cream',
  vermilion: 'text-vermilion',
  wisteria: 'text-wisteria',
  lantern: 'text-lantern',
  gold: 'text-gold-leaf',
  night: 'text-blossom',
}

/** The small title card that opens every episode. */
export default function EpisodeTitle({
  number,
  title,
  subtitle,
  kanji,
  tone = 'light',
  className = '',
  children,
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center gap-3 ${TONES[tone]}`}>
        {kanji && (
          <span className="episode-kanji text-2xl leading-none opacity-80" lang="ja" aria-hidden="true">
            {kanji}
          </span>
        )}
        <span className="h-px w-8 bg-current opacity-45" aria-hidden="true" />
        <p className="text-[10px] font-semibold tracking-[0.32em] uppercase">{number}</p>
      </div>
      <h2 className={`mt-4 font-display text-3xl leading-tight italic sm:text-5xl ${TONES[tone]}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-2 font-devanagari text-sm sm:text-base opacity-75 ${TONES[tone]}`} lang="hi">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

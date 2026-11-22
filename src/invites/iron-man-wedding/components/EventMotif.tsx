import { motion } from 'framer-motion'
import type { EventKind } from '../../types'

/** Original line-art motif for each function, drawn on as it enters view. */
const PATHS: Record<EventKind, string[]> = {
  // marigold — layered petals
  haldi: [
    'M40 22c5 6 5 12 0 18-5-6-5-12 0-18z',
    'M58 40c-6 5-12 5-18 0 6-5 12-5 18 0z',
    'M40 58c-5-6-5-12 0-18 5 6 5 12 0 18z',
    'M22 40c6-5 12-5 18 0-6 5-12 5-18 0z',
    'M53 27c-1 8-5 12-13 13 1-8 5-12 13-13z',
    'M53 53c-8-1-12-5-13-13 8 1 12 5 13 13z',
    'M27 53c1-8 5-12 13-13-1 8-5 12-13 13z',
    'M27 27c8 1 12 5 13 13-8-1-12-5-13-13z',
    'M40 36a4 4 0 1 1 0 8 4 4 0 1 1 0-8z',
  ],
  // paisley
  mehendi: [
    'M46 62c-14 0-22-10-20-22 2-14 16-22 24-14 6 6 2 14-4 14-5 0-7-6-3-8',
    'M50 26c6-8 14-10 18-6',
    'M30 50c4 6 10 8 16 6',
    'M36 40c2-6 8-8 12-5',
  ],
  // sound wave
  sangeet: ['M10 40h6', 'M20 30v20', 'M26 22v36', 'M32 32v16', 'M38 16v48', 'M44 26v28', 'M50 34v12', 'M56 20v40', 'M62 30v20', 'M68 38v4'],
  // mandap arch with sacred flame
  wedding: [
    'M14 66V34c0-14 12-24 26-24s26 10 26 24v32',
    'M22 66V36c0-10 8-18 18-18s18 8 18 18v30',
    'M10 66h60',
    'M40 58c-6-4-6-10 0-18 6 8 6 14 0 18z',
    'M40 54c-2-2-2-5 0-8 2 3 2 6 0 8z',
  ],
  // toast — two glasses meeting
  reception: [
    'M24 18h14l-2 18c-1 5-4 8-5 8s-4-3-5-8z',
    'M31 44v16m-6 0h12',
    'M44 22h14l-3 18c-1 5-4 8-5 8s-4-3-5-8z',
    'M51 48v14m-6 0h12',
    'M38 12l3-5m3 6l5-3',
  ],
}

export default function EventMotif({ kind, className = '' }: { kind: EventKind; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[kind].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2 + i * 0.06, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  )
}

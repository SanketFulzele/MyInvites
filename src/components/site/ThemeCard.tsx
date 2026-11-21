import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ThemeMeta } from '../../themes/registry'
import ThemePreview from './ThemePreview'

export default function ThemeCard({ theme, index = 0 }: { theme: ThemeMeta; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-[0_30px_60px_-35px_rgba(29,21,18,.45)] transition-shadow hover:shadow-[0_40px_80px_-35px_rgba(122,11,20,.45)]"
    >
      <Link to={`/invite/${theme.slug}`} className="block" aria-label={`Explore the ${theme.title} ${theme.category} invitation`}>
        <div className="relative aspect-[4/3.4] overflow-hidden">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]">
            <ThemePreview preview={theme.preview} />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-rose">
            {theme.category}
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
          </span>
        </div>
      </Link>

      <div className="p-6">
        <h3 className="font-display text-3xl font-semibold text-ink">
          {theme.title} <span className="text-ink-soft/70">— {theme.category} Invitation</span>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{theme.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {theme.highlights.map((h) => (
            <li key={h} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink-soft">
              {h}
            </li>
          ))}
        </ul>
        <Link
          to={`/invite/${theme.slug}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-ivory transition hover:bg-stark-crimson sm:w-auto"
        >
          Explore Invitation
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  )
}

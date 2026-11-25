import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ThemeMeta } from '../../themes/registry'
import ThemePreview from './ThemePreview'

/** A stationery-style card: the live preview sits in an arched, gold-edged window. */
export default function ThemeCard({ theme, index = 0 }: { theme: ThemeMeta; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col rounded-[28px] border border-site-line bg-white/80 p-4 shadow-[0_30px_60px_-45px_rgba(42,29,34,.55)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-40px_rgba(107,34,52,.45)] sm:p-5"
    >
      <Link
        to={`/invite/${theme.slug}`}
        aria-label={`Open the ${theme.title} ${theme.category} invitation`}
        className="relative block overflow-hidden rounded-t-[999px] rounded-b-[18px] border border-site-gold/50 p-1.5"
      >
        <div className="relative aspect-[4/3.7] overflow-hidden rounded-t-[999px] rounded-b-[14px]">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]">
            <ThemePreview preview={theme.preview} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-site-rose">{theme.category}</p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-site-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-site-sage" /> Live
          </span>
        </div>
        <h3 className="mt-2 font-playfair text-[2rem] leading-none text-site-ink">{theme.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-site-muted">{theme.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {theme.highlights.map((h) => (
            <li key={h} className="flex items-center gap-1.5 text-[13px] text-site-ink/75">
              <span className="h-1 w-1 rotate-45 bg-site-gold" /> {h}
            </li>
          ))}
        </ul>
        <Link
          to={`/invite/${theme.slug}`}
          className="mt-auto inline-flex min-h-[48px] items-center gap-2 self-start pt-5 text-sm font-semibold text-site-wine"
        >
          <span className="relative">
            Open the invitation
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-site-wine transition-transform duration-300 group-hover:scale-x-50" />
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  )
}

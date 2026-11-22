import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ThemeMeta } from '../../themes/registry'
import SpotlightCard from './SpotlightCard'
import ThemePreview from './ThemePreview'

export default function ThemeCard({ theme, index = 0 }: { theme: ThemeMeta; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard
        spotlightColor="rgba(143,123,255,.22)"
        className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-nova-800/80 shadow-[0_30px_70px_-40px_rgba(0,0,0,.9)] transition-all duration-300 hover:-translate-y-1 hover:border-nova-violet/40 hover:shadow-[0_40px_90px_-35px_rgba(143,123,255,.35)]"
      >
        <Link to={`/invite/${theme.slug}`} className="block" aria-label={`Open the ${theme.title} ${theme.category} invitation`}>
          <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
              <ThemePreview preview={theme.preview} />
            </div>
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-nova-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-nova-cyan backdrop-blur">
              {theme.category}
            </span>
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-nova-950/70 px-3 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Live
            </span>
          </div>
        </Link>

        <div className="p-6">
          <h3 className="font-display text-3xl font-semibold text-nova-text">
            {theme.title} <span className="text-base font-normal text-nova-muted">— {theme.category} Invitation</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-nova-muted">{theme.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {theme.highlights.map((h) => (
              <li key={h} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-nova-muted">
                {h}
              </li>
            ))}
          </ul>
          <Link
            to={`/invite/${theme.slug}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-nova-violet to-nova-cyan px-6 py-3.5 text-sm font-bold text-nova-950 shadow-[0_12px_30px_-12px_rgba(95,225,232,.7)] transition hover:brightness-110"
          >
            Open this invitation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

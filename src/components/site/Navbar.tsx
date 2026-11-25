import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { themes } from '../../themes/registry'

const links = [
  { to: '/#collection', label: 'Invitations' },
  { to: '/#how', label: 'How it works' },
  { to: '/#features', label: 'What’s included' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-site-line bg-site-paper/92 shadow-[0_10px_30px_-24px_rgba(42,29,34,.5)] backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="group relative text-sm font-medium text-site-muted transition-colors hover:text-site-ink">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-site-gold transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/#collection"
          className="group hidden items-center gap-2 rounded-full bg-site-wine px-5 py-2.5 text-sm font-semibold text-site-paper shadow-[0_10px_24px_-12px_rgba(107,34,52,.7)] transition hover:bg-[#561a29] md:inline-flex"
        >
          View invitations
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-site-line bg-site-paper text-site-ink transition hover:border-site-gold lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="site-paper fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-site-line px-5 pb-10 pt-4 sm:px-8 lg:hidden"
          >
            <ul>
              {links.map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link to={l.to} onClick={() => setOpen(false)} className="block border-b border-site-line py-4 font-playfair text-[1.9rem] text-site-ink">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-site-rose">Open an invitation</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {themes.map((t) => (
                <Link
                  key={t.slug}
                  to={`/invite/${t.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center justify-between rounded-2xl border border-site-line bg-white/70 px-5 text-[15px] font-semibold text-site-ink"
                >
                  {t.title} {t.category}
                  <ArrowRight className="h-4 w-4 text-site-wine" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

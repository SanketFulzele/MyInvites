import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Sparkles, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/themes', label: 'My Invitations' },
  { to: '/#about', label: 'About Us' },
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
        scrolled || open ? 'border-b border-white/10 bg-nova-950/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="text-sm font-medium text-nova-muted transition-colors hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/invite/sakura-wedding"
          className="group hidden items-center gap-2 rounded-full border border-nova-violet/40 bg-nova-violet/10 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-12px_rgba(143,123,255,.9)] transition hover:border-nova-cyan/60 hover:bg-nova-violet/20 md:inline-flex"
        >
          <Sparkles className="h-4 w-4 text-nova-cyan" />
          Open Sakura Invite
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-white/10 bg-nova-950/95 px-5 pb-10 pt-6 backdrop-blur-2xl sm:px-8 lg:hidden"
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-4 font-display text-3xl text-nova-text"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-nova-muted">Open an invitation</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link
                to="/invite/sakura-wedding"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-nova-violet to-nova-cyan px-5 py-4 text-sm font-bold text-nova-950"
              >
                <Sparkles className="h-4 w-4" /> Sakura Wedding
              </Link>
              <Link
                to="/invite/iron-man-wedding"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-white"
              >
                Iron Man Wedding <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/invite/bodhi-wedding"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-white"
              >
                Bodhi Wedding <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/invite/royal-rose-wedding"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-white"
              >
                Royal Rose Wedding <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

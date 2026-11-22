import { Link } from 'react-router-dom'
import { ArrowUpRight, Camera, Globe, MessageCircle, PlayCircle, Sparkles } from 'lucide-react'
import Logo from './Logo'

// Placeholder social links — replace "#" with real profiles when ready.
const socials = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Globe, label: 'Facebook', href: '#' },
  { icon: PlayCircle, label: 'YouTube', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
]

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-nova-900">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-nova-violet/15 blur-[110px]" />
      <div className="nova-starfield pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-nova-muted">
            Cinematic digital invitations that turn your special moments into stories your guests will remember — and open straight from WhatsApp.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={`${label} (coming soon)`}
                title={`${label} — coming soon`}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-nova-muted transition hover:border-nova-cyan/60 hover:text-nova-cyan"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-nova-text">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-nova-muted">
            <li><Link className="transition hover:text-nova-cyan" to="/">Home</Link></li>
            <li><Link className="transition hover:text-nova-cyan" to="/themes">My Invitations</Link></li>
            <li><Link className="transition hover:text-nova-cyan" to="/#about">About Us</Link></li>
            <li><Link className="transition hover:text-nova-cyan" to="/#contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-nova-text">Open an invitation</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-nova-muted">
            <li>
              <Link className="group inline-flex items-center gap-1.5 transition hover:text-nova-rose" to="/invite/sakura-wedding">
                <Sparkles className="h-3.5 w-3.5 text-nova-rose" /> Sakura Wedding <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
              </Link>
            </li>
            <li>
              <Link className="group inline-flex items-center gap-1.5 transition hover:text-nova-gold" to="/invite/iron-man-wedding">
                <Sparkles className="h-3.5 w-3.5 text-nova-gold" /> Iron Man Wedding <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
              </Link>
            </li>
            <li className="pt-2 text-xs uppercase tracking-[0.16em] text-nova-muted/60">Weddings · Birthdays · Engagements</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-nova-muted/60 sm:flex-row sm:px-8">
          <p>© {year} My Invites. All rights reserved.</p>
          <p className="font-display text-sm italic text-nova-muted">Every Celebration Deserves Its Own Story.</p>
        </div>
      </div>
    </footer>
  )
}

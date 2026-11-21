import { Link } from 'react-router-dom'
import { Camera, Globe, PlayCircle, MessageCircle } from 'lucide-react'
import Logo from './Logo'

// Placeholder social links — replace "#" with real profiles when ready.
const socials = [
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Globe, label: 'Facebook', href: '#' },
  { icon: PlayCircle, label: 'YouTube', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory/80">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/60">
            Beautifully crafted digital invitations that turn your special moments into stories your guests will
            remember — and open straight from WhatsApp.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={`${label} (coming soon)`}
                title={`${label} — coming soon`}
                className="grid h-10 w-10 place-items-center rounded-full border border-ivory/10 transition hover:border-gold/60 hover:text-gold-soft"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-ivory">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-gold-soft" to="/">Home</Link></li>
            <li><Link className="hover:text-gold-soft" to="/themes">Explore Themes</Link></li>
            <li><Link className="hover:text-gold-soft" to="/#about">About Us</Link></li>
            <li><Link className="hover:text-gold-soft" to="/#contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-ivory">Celebrations</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/60">
            <li>Weddings</li>
            <li>Engagements</li>
            <li>Haldi &amp; Mehendi</li>
            <li>Birthdays &amp; Anniversaries</li>
            <li>Baby Showers</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-ivory/45 sm:flex-row">
          <p>© {new Date().getFullYear()} My Invites. All rights reserved.</p>
          <p className="font-display text-sm italic text-ivory/55">Every Celebration Deserves Its Own Story.</p>
        </div>
      </div>
    </footer>
  )
}

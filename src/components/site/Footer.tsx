import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { Sprig } from './Ornaments'
import { themes } from '../../themes/registry'
import { DESIGNER } from '../../lib/credits'
import { CONTACT } from '../../lib/contact'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-site-line bg-site-cream">
      <Sprig className="pointer-events-none absolute -right-6 top-6 w-56 text-site-gold/30" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-site-muted">
            Digital invitations that open like a story — made for weddings and celebrations, and shared in one WhatsApp link.
          </p>
          <a
            href={CONTACT.whatsappLink('Hi! I’d love a digital invitation from My Invites.')}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-site-line bg-site-paper px-4 text-sm font-semibold text-site-ink transition hover:border-site-gold"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" /> Chat on WhatsApp
          </a>
        </div>

        <div>
          <h4 className="font-playfair text-lg text-site-ink">Explore</h4>
          <ul className="mt-3 space-y-1 text-sm text-site-muted">
            {[
              ['/', 'Home'],
              ['/#collection', 'Invitations'],
              ['/#how', 'How it works'],
              ['/#contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={label}>
                <Link className="inline-flex min-h-[36px] items-center transition hover:text-site-wine" to={to}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-playfair text-lg text-site-ink">The collection</h4>
          <ul className="mt-3 space-y-1 text-sm text-site-muted">
            {themes.map((t) => (
              <li key={t.slug}>
                <Link className="inline-flex min-h-[36px] items-center transition hover:text-site-wine" to={`/invite/${t.slug}`}>
                  {t.title} {t.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-site-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-site-muted sm:flex-row sm:px-8">
          <p>© {year} My Invites</p>
          <p className="font-playfair text-sm italic text-site-ink/80">Every celebration deserves its own story.</p>
          <p>
            {DESIGNER.label} <span className="font-semibold text-site-wine">{DESIGNER.name}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

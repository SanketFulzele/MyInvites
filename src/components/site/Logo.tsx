import { Link } from 'react-router-dom'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="My Invites home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink shadow-[0_6px_20px_-8px_rgba(29,21,18,.6)] ring-1 ring-gold/30 transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe3a0" />
              <stop offset="1" stopColor="#c99a3e" />
            </linearGradient>
          </defs>
          <path
            d="M16 26s-9-5.2-9-11.7C7 10.8 9.6 8.5 12.4 8.5c1.8 0 3 .9 3.6 2 .6-1.1 1.8-2 3.6-2 2.8 0 5.4 2.3 5.4 5.8C25 20.8 16 26 16 26z"
            fill="none"
            stroke="url(#logo-g)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? 'text-ivory' : 'text-ink'}`}>
        My <em className="font-medium text-rose">Invites</em>
      </span>
    </Link>
  )
}

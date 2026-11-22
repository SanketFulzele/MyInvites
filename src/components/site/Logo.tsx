import { Link } from 'react-router-dom'

export default function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="My Invites home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-nova-700/80 shadow-[0_6px_24px_-8px_rgba(143,123,255,.8)] ring-1 ring-nova-violet/40 transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#5fe1e8" />
              <stop offset="1" stopColor="#8f7bff" />
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
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? 'text-nova-text' : 'text-ink'}`}>
        My <em className="font-medium not-italic text-nova-cyan">Invites</em>
      </span>
    </Link>
  )
}

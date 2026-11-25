import { Link } from 'react-router-dom'
import { WaxSeal } from './Ornaments'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="My Invites home">
      <WaxSeal className="h-10 w-10 drop-shadow-[0_6px_10px_rgba(107,34,52,.25)] transition-transform duration-500 group-hover:rotate-[-10deg]" />
      <span className="font-playfair text-[1.45rem] leading-none text-site-ink">
        My <em className="text-site-wine">Invites</em>
      </span>
    </Link>
  )
}

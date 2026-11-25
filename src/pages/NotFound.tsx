import { Link } from 'react-router-dom'
import Logo from '../components/site/Logo'
import { GoldRule } from '../components/site/Ornaments'

export default function NotFound() {
  return (
    <div className="site-paper grid min-h-screen place-items-center px-6 text-center text-site-ink">
      <div className="max-w-xl">
        <Logo />
        <h1 className="mt-10 font-playfair text-[2.6rem] leading-tight text-balance sm:text-6xl">
          This page isn’t on <em className="text-site-wine">the guest list.</em>
        </h1>
        <GoldRule className="mx-auto mt-6 w-32" />
        <p className="mt-5 text-site-muted">The invitation you’re looking for may have moved, or doesn’t exist yet.</p>
        <Link
          to="/#collection"
          className="mt-8 inline-flex min-h-[52px] items-center rounded-full bg-site-wine px-8 font-semibold text-site-paper shadow-[0_16px_30px_-16px_rgba(107,34,52,.8)]"
        >
          See the invitations
        </Link>
      </div>
    </div>
  )
}

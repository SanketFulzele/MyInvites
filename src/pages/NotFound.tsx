import { Link } from 'react-router-dom'
import Logo from '../components/site/Logo'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory px-6 text-center">
      <div>
        <Logo />
        <h1 className="mt-10 font-display text-6xl font-semibold text-ink">This page isn&apos;t on the guest list.</h1>
        <p className="mt-4 text-ink-soft">The invitation you&apos;re looking for may have moved or doesn&apos;t exist yet.</p>
        <Link to="/themes" className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 font-semibold text-ivory">
          Explore Invitations
        </Link>
      </div>
    </div>
  )
}

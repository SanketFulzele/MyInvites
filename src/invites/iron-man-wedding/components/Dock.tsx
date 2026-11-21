import { motion } from 'framer-motion'
import { CalendarDays, Heart, MailCheck, MapPin, Volume2, VolumeX } from 'lucide-react'

const ITEMS = [
  { href: '#couple', label: 'Couple', icon: Heart },
  { href: '#events', label: 'Events', icon: CalendarDays },
  { href: '#venue', label: 'Venue', icon: MapPin },
  { href: '#rsvp', label: 'RSVP', icon: MailCheck },
]

/** Floating bottom navigation — thumb-friendly on phones. */
export default function Dock({ playing, onToggleMusic }: { playing: boolean; onToggleMusic: () => void }) {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]"
      aria-label="Invitation sections"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0b0d12]/85 p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,.9)] backdrop-blur-xl">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} className="flex w-14 flex-col items-center gap-0.5 rounded-full py-1.5 text-white/60 transition hover:text-white active:scale-95 sm:w-16">
            <Icon className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-semibold tracking-wide">{label}</span>
          </a>
        ))}
        <button
          onClick={onToggleMusic}
          aria-label={playing ? 'Pause music' : 'Play music'}
          aria-pressed={playing}
          className={`relative ml-1 grid h-11 w-11 place-items-center rounded-full transition ${
            playing ? 'bg-reactor/15 text-reactor shadow-[0_0_18px_-2px_rgba(127,233,255,.7)]' : 'bg-white/5 text-white/60'
          }`}
        >
          {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          {playing && <span className="absolute inset-0 animate-ping rounded-full border border-reactor/30" />}
        </button>
      </div>
    </motion.nav>
  )
}

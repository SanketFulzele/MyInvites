import type { ThemeMeta } from '../../themes/registry'

/** Pure-CSS preview artwork for each theme (no external images needed). */
export default function ThemePreview({ preview }: { preview: ThemeMeta['preview'] }) {
  if (preview === 'iron-man') return <IronManPreview />
  return null
}

function IronManPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3a0a10_0%,#0b0b10_55%,#050508_100%)]">
      {/* HUD grid */}
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(127,233,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(127,233,255,.18)_1px,transparent_1px)] [background-size:26px_26px]" />
      {/* Red/gold sweep */}
      <div className="absolute -left-1/4 top-1/3 h-40 w-[150%] -rotate-12 bg-gradient-to-r from-transparent via-stark-red/40 to-transparent blur-2xl" />
      <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-stark-gold/20 blur-3xl" />

      {/* Arc reactor */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-32 w-32 sm:h-36 sm:w-36">
          <div className="absolute inset-0 rounded-full bg-reactor/25 blur-2xl animate-reactor" />
          <div className="absolute inset-0 rounded-full border border-reactor/40 animate-spin-slow [border-style:dashed]" />
          <div className="absolute inset-3 rounded-full border-[3px] border-stark-gold/70" />
          <div className="absolute inset-5 rounded-full border border-reactor/60 animate-spin-rev" />
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,#ffffff_0%,#bff6ff_30%,#3fd0f5_65%,transparent_72%)] shadow-[0_0_40px_10px_rgba(127,233,255,.45)]" />
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="absolute inset-[22%]" style={{ transform: `rotate(${i * 36}deg)` }}>
              <span className="absolute left-1/2 top-0 h-[22%] w-[9%] -translate-x-1/2 rounded-sm bg-reactor/60" />
            </span>
          ))}
        </div>
      </div>

      {/* Names */}
      <div className="absolute inset-x-0 bottom-6 text-center">
        <p className="font-hud text-[9px] tracking-[0.5em] text-reactor/80">WEDDING PROTOCOL</p>
        <p className="mt-1.5 font-display text-2xl font-semibold text-stark-amber">The Wedding Suit-Up</p>
        <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-stark-gold to-transparent" />
      </div>

      {/* Corner brackets */}
      {['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'].map(
        (c) => (
          <span key={c} className={`absolute h-5 w-5 border-reactor/60 ${c}`} />
        ),
      )}
    </div>
  )
}

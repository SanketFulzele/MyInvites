import type { ThemeMeta } from '../../themes/registry'

/** Pure-CSS preview artwork for each theme (no external images needed). */
export default function ThemePreview({ preview }: { preview: ThemeMeta['preview'] }) {
  if (preview === 'iron-man') return <IronManPreview />
  if (preview === 'sakura') return <SakuraPreview />
  return null
}

function SakuraPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#2e2a55_0%,#6b4b6e_34%,#e9afc0_68%,#fff4e8_100%)]">
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff8e6_0%,#ffd9b8_45%,rgba(255,205,180,0)_72%)]" />
      <svg viewBox="0 0 240 170" className="absolute -left-4 -top-3 w-40 opacity-90" aria-hidden="true">
        <path d="M-6 168 C44 136 76 108 110 72 C138 42 176 25 242 12" fill="none" stroke="#5c3c4b" strokeWidth="2.4" />
        {[
          [52, 128],
          [90, 82],
          [130, 52],
          [176, 30],
          [212, 18],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} fill="#f7d9e1">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5" rx="3.6" ry="5.2" transform={`rotate(${a})`} />
            ))}
            <circle r="2" fill="#c6a46a" />
          </g>
        ))}
      </svg>
      {[18, 34, 52, 68, 84].map((left, i) => (
        <span
          key={left}
          className="absolute h-2.5 w-2 animate-float rounded-[80%_20%_70%_30%] bg-sakura-blush/80"
          style={{ left: `${left}%`, top: `${20 + ((i * 17) % 55)}%`, animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-5 text-center">
        <p className="text-[9px] font-semibold tracking-[0.45em] text-sakura-ink/60">THE WEDDING OF</p>
        <p className="mt-1 font-display text-2xl italic text-sakura-ink">Anushka &amp; Virat</p>
        <div className="mx-auto mt-2 h-px w-20 bg-sakura-gold" />
      </div>
    </div>
  )
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

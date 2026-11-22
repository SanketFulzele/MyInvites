/**
 * Original illustration set for the Bodhi invitation — soft watercolour
 * fills with temple-gold line-art. All pure SVG, so it stays crisp and light.
 */
import { useId } from 'react'

/* ───────────────────────── Ashok Chakra ───────────────────────── */
export function AshokChakra({ className = '', color = '#0b3d91', spin = false, fast = false, title }: { className?: string; color?: string; spin?: boolean; fast?: boolean; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g className={spin ? (fast ? 'bodhi-spin-fast' : 'bodhi-spin') : ''} style={{ transformOrigin: '50px 50px' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="4" />
        <circle cx="50" cy="50" r="40.5" fill="none" stroke={color} strokeWidth="1" opacity=".6" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180
          const b = ((i * 15 + 7.5) * Math.PI) / 180
          return (
            <g key={i}>
              <path
                d={`M50 50 L${50 + 44 * Math.cos(a - 0.05)} ${50 + 44 * Math.sin(a - 0.05)} L${50 + 44 * Math.cos(a + 0.05)} ${50 + 44 * Math.sin(a + 0.05)}Z`}
                fill={color}
              />
              <circle cx={50 + 43.5 * Math.cos(b)} cy={50 + 43.5 * Math.sin(b)} r="1.2" fill={color} />
            </g>
          )
        })}
        <circle cx="50" cy="50" r="7" fill={color} />
        <circle cx="50" cy="50" r="3" fill="#fbf5e9" />
      </g>
    </svg>
  )
}

/* ───────────────────────── Pipal leaf ───────────────────────── */
/** Heart-shaped pipal leaf with its long drip tip. Points down by default. */
export const PIPAL_PATH =
  'M50 6 C30 6 8 20 8 44 C8 66 28 82 44 96 C47 99 49 108 50 122 C51 108 53 99 56 96 C72 82 92 66 92 44 C92 20 70 6 50 6Z'

export function PipalLeaf({ className = '', fill = '#5e8c3a', vein = '#e9f2d6', rotate = 0 }: { className?: string; fill?: string; vein?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 100 126" className={className} aria-hidden style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <path d={PIPAL_PATH} fill={fill} />
      <path d="M50 10 L50 116" stroke={vein} strokeWidth="2" strokeLinecap="round" opacity=".75" />
      {[24, 38, 52, 66].map((y, i) => (
        <g key={y} stroke={vein} strokeWidth="1.2" fill="none" opacity=".5" strokeLinecap="round">
          <path d={`M50 ${y + 4} Q${34 - i} ${y - 2} ${20 + i * 3} ${y - 6 + i * 4}`} />
          <path d={`M50 ${y + 4} Q${66 + i} ${y - 2} ${80 - i * 3} ${y - 6 + i * 4}`} />
        </g>
      ))}
    </svg>
  )
}

/* ───────────────────────── Lotus ───────────────────────── */
export function Lotus({ className = '', tone = 'pink' }: { className?: string; tone?: 'pink' | 'white' | 'gold' }) {
  const id = useId().replace(/:/g, '')
  const palette = {
    pink: ['#fbd3dc', '#f2a7b8', '#d9718c'],
    white: ['#ffffff', '#f6ece0', '#d9c6a6'],
    gold: ['#fff0c4', '#e8c15a', '#b8901f'],
  }[tone]
  const petal = (rot: number, scale = 1, layer = 0) => (
    <path
      key={`${rot}-${layer}`}
      d="M60 74 C48 60 46 36 60 14 C74 36 72 60 60 74Z"
      fill={`url(#lp-${id})`}
      stroke={palette[2]}
      strokeWidth=".8"
      transform={`rotate(${rot} 60 74) translate(60 74) scale(${scale}) translate(-60 -74)`}
      opacity={layer ? 0.95 : 1}
    />
  )
  return (
    <svg viewBox="0 0 120 92" className={className} aria-hidden>
      <defs>
        <linearGradient id={`lp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette[0]} />
          <stop offset="1" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      {[-62, 62].map((r) => petal(r, 0.85, 1))}
      {[-38, 38].map((r) => petal(r, 0.95, 1))}
      {[-16, 16].map((r) => petal(r))}
      {petal(0, 1.05)}
      <path d="M22 76 C40 84 80 84 98 76 C86 90 34 90 22 76Z" fill="#5e8c3a" opacity=".85" />
    </svg>
  )
}

/* ───────────────────────── Diya ───────────────────────── */
export function Diya({ className = '', lit = true }: { className?: string; lit?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <radialGradient id={`dg-${id}`} cx="50%" cy="60%">
          <stop offset="0" stopColor="#fff6c9" />
          <stop offset=".45" stopColor="#ffc94d" />
          <stop offset="1" stopColor="#e8732f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`dc-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c46a2b" />
          <stop offset="1" stopColor="#7a3a18" />
        </linearGradient>
      </defs>
      {lit && <circle cx="40" cy="34" r="20" fill={`url(#dg-${id})`} className="bodhi-glow" />}
      {lit && (
        <path className="bodhi-flame" d="M40 16 C46 26 47 34 40 42 C33 34 34 26 40 16Z" fill="#ffd25e" stroke="#f59e2c" strokeWidth=".8" />
      )}
      {lit && <path className="bodhi-flame" d="M40 27 C43 32 43 36 40 40 C37 36 37 32 40 27Z" fill="#fff7d6" />}
      <path d="M10 46 C14 62 26 68 40 68 C54 68 66 62 70 46 C60 50 50 51 40 51 C30 51 20 50 10 46Z" fill={`url(#dc-${id})`} />
      <path d="M10 46 C20 50 30 51 40 51 C50 51 60 50 70 46" fill="none" stroke="#c9a227" strokeWidth="1.5" />
      <path d="M22 58 q6 4 12 0 M46 58 q6 4 12 0" stroke="#c9a227" strokeWidth="1" fill="none" opacity=".7" />
    </svg>
  )
}

/* ───────────────────────── Meditating Buddha ───────────────────────── */
export function Buddha({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'silhouette' }) {
  const id = useId().replace(/:/g, '')
  const sil = tone === 'silhouette'
  const skin = sil ? '#141a33' : `url(#bs-${id})`
  const robe = sil ? '#141a33' : `url(#br-${id})`
  const line = sil ? 'transparent' : '#9c7a14'
  return (
    <svg viewBox="0 0 200 214" className={className} role="img" aria-label="Lord Buddha seated in meditation">
      <defs>
        <linearGradient id={`bs-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d78a" />
          <stop offset="1" stopColor="#dcae4b" />
        </linearGradient>
        <linearGradient id={`br-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0b24a" />
          <stop offset=".6" stopColor="#e08a2e" />
          <stop offset="1" stopColor="#b86420" />
        </linearGradient>
      </defs>
      {/* crossed legs */}
      <path d="M22 186 C28 166 58 154 100 156 C142 154 172 166 178 186 C172 202 140 208 100 208 C60 208 28 202 22 186Z" fill={robe} stroke={line} strokeWidth="1.2" />
      {/* torso + robe */}
      <path d="M100 80 C84 80 69 87 61 99 C53 112 53 130 57 146 L64 166 L136 166 L143 146 C147 130 147 112 139 99 C131 87 116 80 100 80Z" fill={robe} stroke={line} strokeWidth="1.2" />
      {/* bare right shoulder */}
      {!sil && <path d="M118 84 C130 88 138 96 141 108 C134 104 124 100 114 98Z" fill={skin} />}
      {/* hands in dhyana mudra */}
      <ellipse cx="100" cy="163" rx="24" ry="8.5" fill={skin} stroke={line} strokeWidth="1" />
      {!sil && <path d="M84 162 q16 -6 32 0" stroke="#b8901f" strokeWidth="1" fill="none" />}
      {/* neck + head */}
      <rect x="92" y="70" width="16" height="14" rx="5" fill={skin} />
      <ellipse cx="100" cy="52" rx="19" ry="22" fill={skin} stroke={line} strokeWidth="1" />
      {/* ushnisha + curls */}
      <path d="M81 46 C82 32 90 26 100 26 C110 26 118 32 119 46 C112 40 106 38 100 38 C94 38 88 40 81 46Z" fill={sil ? skin : '#3d2a1c'} />
      <circle cx="100" cy="24" r="8" fill={sil ? skin : '#3d2a1c'} />
      {!sil &&
        [86, 92, 98, 104, 110, 116].map((x, i) => <circle key={x} cx={x - 1} cy={38 - (i % 2) * 3} r="1.6" fill="#5a3f2a" />)}
      {/* long earlobes */}
      <path d="M81 50 C76 52 76 68 81 74 C83 70 83 58 82 50Z" fill={skin} stroke={line} strokeWidth=".8" />
      <path d="M119 50 C124 52 124 68 119 74 C117 70 117 58 118 50Z" fill={skin} stroke={line} strokeWidth=".8" />
      {!sil && (
        <g stroke="#7a5a1a" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <path d="M89 54 q4 3 8 0" />
          <path d="M103 54 q4 3 8 0" />
          <path d="M96 66 q4 2 8 0" />
          <path d="M100 56 v5" opacity=".5" />
        </g>
      )}
      {!sil && <circle cx="100" cy="45" r="1.4" fill="#c2263a" />}
      {/* robe folds */}
      {!sil && (
        <g stroke="#9c5a1a" strokeWidth="1" fill="none" opacity=".7" strokeLinecap="round">
          <path d="M114 86 C104 108 94 132 86 160" />
          <path d="M70 104 C78 122 82 142 82 160" />
          <path d="M48 188 C70 178 88 176 100 178" />
          <path d="M152 188 C130 178 112 176 100 178" />
          <path d="M64 198 C84 194 116 194 136 198" />
        </g>
      )}
    </svg>
  )
}

/* ───────────────────────── Bodhi tree canopy ───────────────────────── */
// deterministic pseudo-random so the tree looks the same on every render
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}
const LEAF_COLORS = ['#5e8c3a', '#6f9c45', '#4d7a2f', '#9cc46b', '#86b157', '#c9a227']

function bez(p0: number[], p1: number[], p2: number[], p3: number[], t: number) {
  const u = 1 - t
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k])
}

const BOUGHS: number[][][] = [
  [[-20, 30], [80, 10], [150, 70], [230, 58]],
  [[420, 24], [330, 6], [260, 70], [175, 62]],
  [[-10, 90], [40, 70], [70, 110], [120, 120]],
  [[410, 96], [360, 72], [330, 112], [282, 124]],
  [[60, 22], [110, 40], [130, 20], [190, 12]],
  [[340, 18], [300, 40], [270, 16], [215, 10]],
]

/** Branches arching across the top of a scene, heavy with heart-shaped leaves. */
export function BodhiCanopy({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const leaves: { x: number; y: number; r: number; s: number; c: string; g: number }[] = []
  BOUGHS.forEach((b, bi) => {
    for (let i = 0; i < 16; i++) {
      const t = 0.12 + (i / 16) * 0.88
      const [x, y] = bez(b[0], b[1], b[2], b[3], t)
      const seed = bi * 100 + i
      leaves.push({
        x: x + (rand(seed) - 0.5) * 22,
        y: y + 6 + rand(seed + 1) * 26,
        r: (rand(seed + 2) - 0.5) * 70,
        s: 0.13 + rand(seed + 3) * 0.1,
        c: LEAF_COLORS[Math.floor(rand(seed + 4) * (rand(seed + 5) > 0.92 ? 6 : 5))],
        g: Math.floor(rand(seed + 6) * 3),
      })
    }
  })
  return (
    <svg viewBox="0 0 400 170" className={className} preserveAspectRatio="xMidYMin slice" aria-hidden>
      <defs>
        <path id={`leaf-${id}`} d={PIPAL_PATH} transform="translate(-50 -10)" />
      </defs>
      <g stroke="#5a3b22" fill="none" strokeLinecap="round">
        {BOUGHS.map((b, i) => (
          <g key={i}>
            <path d={`M${b[0]} C${b[1]} ${b[2]} ${b[3]}`} strokeWidth={i < 2 ? 7 : i < 4 ? 4.5 : 3} />
            <path d={`M${b[0]} C${b[1]} ${b[2]} ${b[3]}`} strokeWidth={i < 2 ? 2 : 1.2} stroke="#8a6440" opacity=".6" transform="translate(0 -1.5)" />
          </g>
        ))}
      </g>
      {[0, 1, 2].map((g) => (
        <g key={g} className="bodhi-sway" style={{ animationDelay: `${-g * 1.7}s`, animationDuration: `${6 + g}s` }}>
          {leaves
            .filter((l) => l.g === g)
            .map((l, i) => (
              <use key={i} href={`#leaf-${id}`} fill={l.c} opacity=".93" transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`} />
            ))}
        </g>
      ))}
    </svg>
  )
}

/* ───────────────────────── Garland ───────────────────────── */
/** Swag of marigolds with roses — drawn along a gentle catenary. */
export function Garland({ className = '', sag = 26, count = 15 }: { className?: string; sag?: number; count?: number }) {
  const items = Array.from({ length: count }).map((_, i) => {
    const t = i / (count - 1)
    const x = 6 + t * 388
    const y = 8 + sag * 4 * t * (1 - t)
    return { x, y, rose: i % 4 === 2 }
  })
  return (
    <svg viewBox="0 0 400 60" className={className} aria-hidden preserveAspectRatio="none">
      <path d={`M6 8 Q200 ${8 + sag * 2} 394 8`} stroke="#9c7a14" strokeWidth="1" fill="none" />
      {items.map((it, i) =>
        it.rose ? (
          <g key={i} transform={`translate(${it.x} ${it.y})`}>
            <circle r="8" fill="#c2263a" />
            <path d="M-4 -1 q4 -5 8 0 q-4 5 -8 0Z M-2 2 q2 -6 6 -2" stroke="#7a1f2b" strokeWidth="1" fill="none" />
          </g>
        ) : (
          <g key={i} transform={`translate(${it.x} ${it.y})`}>
            <circle r="8.5" fill={i % 2 ? '#e8a33d' : '#f2b941'} />
            <circle r="5" fill="none" stroke="#c46a16" strokeWidth="1" strokeDasharray="2 2" />
            <circle r="2" fill="#c46a16" />
          </g>
        ),
      )}
    </svg>
  )
}

/* ───────────────────────── Stupa (Deekshabhoomi-inspired) ───────────────────────── */
export function Stupa({ className = '', color = '#7a1f2b' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g fill={color}>
        <rect x="96" y="6" width="8" height="14" rx="2" />
        <rect x="88" y="18" width="24" height="6" rx="1" />
        <path d="M40 92 C40 52 66 26 100 26 C134 26 160 52 160 92Z" />
        <rect x="30" y="90" width="140" height="8" rx="2" />
        <rect x="20" y="98" width="160" height="16" />
        {[38, 62, 86, 110, 134, 158].map((x) => (
          <path key={x} d={`M${x - 7} 114 v-10 a7 7 0 0 1 14 0 v10Z`} fill="#fbf5e9" opacity=".35" />
        ))}
      </g>
    </svg>
  )
}

/* ───────────────────────── Lotus pond ───────────────────────── */
/** A shimmering water line with lotuses bobbing on it. */
export function LotusPond({ className = '', dusk = false }: { className?: string; dusk?: boolean }) {
  return (
    <div className={`pointer-events-none relative h-24 overflow-hidden sm:h-28 ${className}`} aria-hidden>
      <div className={`absolute inset-x-0 bottom-0 h-14 ${dusk ? 'bg-gradient-to-b from-[#24336b]/70 to-[#0e1638]' : 'bg-gradient-to-b from-[#bfe0d3]/70 to-[#8fc2b5]/80'}`} />
      <div className="bodhi-water-shine absolute inset-x-0 bottom-9 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="bodhi-water-shine absolute inset-x-[10%] bottom-5 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" style={{ animationDelay: '-2s' }} />
      {[
        { left: '6%', w: 'w-14', delay: '0s', tone: 'pink' as const },
        { left: '28%', w: 'w-10', delay: '-1.4s', tone: 'white' as const },
        { left: '54%', w: 'w-16', delay: '-2.6s', tone: 'pink' as const },
        { left: '80%', w: 'w-11', delay: '-0.8s', tone: 'pink' as const },
      ].map((l) => (
        <div key={l.left} className={`bodhi-bob absolute bottom-6 ${l.w}`} style={{ left: l.left, animationDelay: l.delay }}>
          <Lotus tone={l.tone} className="w-full" />
        </div>
      ))}
      {[18, 44, 68, 92].map((x) => (
        <span key={x} className="absolute bottom-7 h-2 w-7 rounded-[50%] bg-bodhi-leaf/70" style={{ left: `${x}%` }} />
      ))}
    </div>
  )
}

/* ───────────────────────── Small ornaments ───────────────────────── */
export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-bodhi-gold" />
      <PipalLeaf className="h-4 w-3.5" fill="#c9a227" vein="#fbf5e9" rotate={180} />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-bodhi-gold" />
    </div>
  )
}

/** Faint mandala watermark used behind sections. */
export function Mandala({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth=".6">
      {[90, 72, 54, 36].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d="M100 10 C112 40 112 60 100 82 C88 60 88 40 100 10Z" transform={`rotate(${i * 22.5} 100 100)`} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={`b${i}`} d="M100 46 C108 62 108 72 100 82 C92 72 92 62 100 46Z" transform={`rotate(${i * 45 + 22.5} 100 100)`} />
      ))}
    </svg>
  )
}

/* ───────────────────────── Buddha on a lotus (line art) ───────────────────────── */
/** Small hand-drawn line illustration: the Buddha seated in meditation on a lotus, with a soft halo. */
export function BuddhaOnLotus({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 80 96" className={className} role="img" aria-label="The Buddha seated in meditation on a lotus">
      <defs>
        <radialGradient id={`halo-${id}`}>
          <stop offset="0" stopColor="#ffe7a3" stopOpacity=".95" />
          <stop offset=".6" stopColor="#e8a33d" stopOpacity=".25" />
          <stop offset="1" stopColor="#e8a33d" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* halo glow, gently breathing */}
      <circle cx="40" cy="24" r="20" fill={`url(#halo-${id})`} className="bodhi-breathe" />
      <circle cx="40" cy="24" r="14.5" fill="none" stroke="#c9a227" strokeWidth=".7" opacity=".7" />

      <g fill="none" stroke="#9c7a14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* head, ushnisha, ears */}
        <circle cx="40" cy="24" r="8.2" fill="#fbf0d6" />
        <path d="M33.6 19.5 Q40 11.5 46.4 19.5" />
        <circle cx="40" cy="13" r="2.3" fill="#fbf0d6" />
        <path d="M31.8 22 q-1.6 4.2 .6 8.4" />
        <path d="M48.2 22 q1.6 4.2 -.6 8.4" />
        {/* closed eyes, gentle smile */}
        <path d="M35.6 24.6 q1.8 1.3 3.5 0" strokeWidth="1.1" />
        <path d="M40.9 24.6 q1.8 1.3 3.5 0" strokeWidth="1.1" />
        <path d="M38.4 28.6 q1.6 .9 3.2 0" strokeWidth="1" />
        {/* robe: shoulders, sash */}
        <path d="M37 33.5 C28 35 23 41 22 49 C21 56 23 62 26.5 66" fill="#fbf0d6" />
        <path d="M43 33.5 C52 35 57 41 58 49 C59 56 57 62 53.5 66" />
        <path d="M44.5 35.5 C40.5 45 36.5 55 33.5 65.5" strokeWidth="1.1" />
        {/* hands resting in dhyana mudra */}
        <path d="M31.5 63 Q40 58.6 48.5 63 Q40 67.4 31.5 63Z" fill="#fbf0d6" />
        {/* crossed legs */}
        <path d="M17.5 70 C22 62.8 32 62 40 64 C48 62 58 62.8 62.5 70 C58 75.4 50 77.4 40 77.4 C30 77.4 22 75.4 17.5 70Z" fill="#fbf0d6" />
        <path d="M26 72 C32 69.5 36 69.5 40 70.5 C44 69.5 48 69.5 54 72" strokeWidth="1" />
      </g>

      {/* lotus seat */}
      <g stroke="#c9a227" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M40 90 C26 92 15.5 88 11.5 81.5 C22 79 32 84 40 90Z" fill="#fde4ea" />
        <path d="M40 90 C54 92 64.5 88 68.5 81.5 C58 79 48 84 40 90Z" fill="#fde4ea" />
        <path d="M40 90 C30 88.5 24 83.5 22 77.5 C30 77.5 36 82 40 90Z" fill="#f8cbd5" />
        <path d="M40 90 C50 88.5 56 83.5 58 77.5 C50 77.5 44 82 40 90Z" fill="#f8cbd5" />
        <path d="M40 90 C35.5 85 35 80.5 40 77.5 C45 80.5 44.5 85 40 90Z" fill="#f2a7b8" />
        <path d="M15 90.5 Q40 95.5 65 90.5" fill="none" />
      </g>
    </svg>
  )
}

interface SakuraBranchProps {
  className?: string
  flip?: boolean
  imageSrc?: string
}

interface CloseBlossom {
  x: number
  y: number
  scale: number
  rotation: number
  tone: number
}

const PETAL = 'M 0 0 C -9 -6 -13 -17 -5 -23 L 0 -19 L 5 -23 C 13 -17 9 -6 0 0 Z'
const PETAL_INNER = 'M 0 -2 C -5 -7 -7 -14 -3 -18 L 0 -16 L 3 -18 C 7 -14 5 -7 0 -2 Z'

const TONES = [
  { outer: '#f4c2ce', inner: '#fff2f5', center: '#a54d66', stamen: '#eec877' },
  { outer: '#ffe4ea', inner: '#fffaf6', center: '#bd7185', stamen: '#f2d68c' },
  { outer: '#e9afc0', inner: '#f9dbe2', center: '#8f4359', stamen: '#dcb468' },
  { outer: '#fbd7df', inner: '#fff7f3', center: '#b15c75', stamen: '#f6d79a' },
]

const BLOSSOMS: CloseBlossom[] = [
  { x: 48, y: 200, scale: 1.05, rotation: 12, tone: 0 },
  { x: 76, y: 176, scale: 0.85, rotation: 44, tone: 1 },
  { x: 104, y: 150, scale: 1.2, rotation: -18, tone: 2 },
  { x: 128, y: 132, scale: 0.9, rotation: 28, tone: 0 },
  { x: 152, y: 112, scale: 1.05, rotation: 60, tone: 3 },
  { x: 180, y: 94, scale: 0.8, rotation: -32, tone: 1 },
  { x: 204, y: 74, scale: 1.1, rotation: 16, tone: 0 },
  { x: 236, y: 58, scale: 0.95, rotation: -12, tone: 2 },
  { x: 266, y: 40, scale: 1.25, rotation: 36, tone: 1 },
  { x: 294, y: 24, scale: 0.85, rotation: 8, tone: 3 },
  { x: 86, y: 96, scale: 0.95, rotation: 52, tone: 1 },
  { x: 198, y: 52, scale: 0.9, rotation: -40, tone: 0 },
  { x: 272, y: 90, scale: 0.8, rotation: 22, tone: 2 },
  { x: 58, y: 116, scale: 0.72, rotation: -24, tone: 3 },
]

const BUDS: [number, number, number][] = [
  [118, 102, -18],
  [222, 44, 24],
  [36, 164, 12],
  [284, 64, -30],
  [160, 62, 38],
]

function CloseBlossomShape({ x, y, scale, rotation, tone }: CloseBlossom) {
  const palette = TONES[tone % TONES.length]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle}) translate(0 -2)`}>
          <path d={PETAL} fill={palette.outer} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />
          <path d={PETAL_INNER} fill={palette.inner} opacity="0.85" />
        </g>
      ))}
      <circle r="6" fill={palette.center} />
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const sx = Math.cos(rad) * 14
        const sy = Math.sin(rad) * 14
        return (
          <g key={angle}>
            <line x1="0" y1="0" x2={sx} y2={sy} stroke={palette.stamen} strokeWidth="1.3" strokeLinecap="round" />
            <circle cx={sx} cy={sy} r="2" fill="#fff4cf" />
          </g>
        )
      })}
      <circle r="2.6" fill="#fff8e4" />
    </g>
  )
}

/** Close-up foreground branch with fully detailed blossoms and closed buds. */
export default function SakuraBranch({ className = '', flip = false, imageSrc }: SakuraBranchProps) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative h-full w-full">
        {imageSrc && (
          <img src={imageSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <svg
          viewBox="0 0 320 240"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          style={flip ? { transform: 'scaleX(-1)' } : undefined}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sb-wood" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#2b2033" />
              <stop offset="0.5" stopColor="#6b4757" />
              <stop offset="1" stopColor="#3c2a40" />
            </linearGradient>
            <radialGradient id="sb-bud" cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#fff4f5" />
              <stop offset="1" stopColor="#e9afc0" />
            </radialGradient>
          </defs>

          {/* Main limb and twigs */}
          <path
            d="M -8 244 C 34 218 62 190 104 150 C 144 112 172 102 206 72 C 246 38 276 18 322 -6"
            fill="none"
            stroke="url(#sb-wood)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M -4 238 C 40 210 68 184 106 146 C 146 108 174 98 208 68 C 248 34 278 14 318 -8"
            fill="none"
            stroke="#ad8390"
            strokeWidth="1.8"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
          <path d="M 104 150 C 96 126 92 108 86 92" fill="none" stroke="#4d3446" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 172 102 C 184 82 192 66 198 52" fill="none" stroke="#4d3446" strokeWidth="4" strokeLinecap="round" />
          <path d="M 236 52 C 254 60 268 74 272 90" fill="none" stroke="#4d3446" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M 62 190 C 54 168 52 142 58 116" fill="none" stroke="#4d3446" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 150 118 C 148 100 152 78 160 62" fill="none" stroke="#4d3446" strokeWidth="2.8" strokeLinecap="round" />

          {/* Closed buds */}
          {BUDS.map(([x, y, rotation]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rotation})`}>
              <path d="M 0 0 C -6 -7 -5 -16 0 -21 C 5 -16 6 -7 0 0 Z" fill="url(#sb-bud)" stroke="#f7d9e1" strokeWidth="0.8" />
              <path d="M -8 -1 C -4 -6 4 -6 8 -1 C 4 3 -4 3 -8 -1 Z" fill="#7c8f6b" />
              <path d="M 0 -1 L 0 -12" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" />
            </g>
          ))}

          {/* Open five-petal blossoms */}
          {BLOSSOMS.map((blossom) => (
            <CloseBlossomShape key={`${blossom.x}-${blossom.y}`} {...blossom} />
          ))}
        </svg>
      </div>
    </div>
  )
}

import { useEffect, useRef, type ReactNode } from 'react'
import ParallaxScene from '../components/anime/ParallaxScene'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

export interface SceneProps {
  imageSrc?: string
  className?: string
  children?: ReactNode
}

const LAYER = 'pointer-events-none absolute inset-x-0 -inset-y-[12%]'
const PETAL_TONES = ['#f7d9e1', '#f4c2ce', '#ffe4ea', '#e9afc0', '#fff2f4']

function Layer({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <div data-depth={depth} className={LAYER} aria-hidden="true">
      {children}
    </div>
  )
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {children}
    </svg>
  )
}

function Scene({
  imageSrc,
  className,
  alt,
  layers,
  children,
}: SceneProps & { alt: string; layers: ReactNode }) {
  return (
    <ParallaxScene imageSrc={imageSrc} className={className} alt={alt}>
      {layers}
      <div className="absolute inset-0 z-[8]">{children}</div>
    </ParallaxScene>
  )
}

function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeCanopy(count: number, seed: number, band: 'left' | 'right' | 'top') {
  const random = seeded(seed)
  return Array.from({ length: count }, () => ({
    x: band === 'left' ? random() * 480 : band === 'right' ? 1120 + random() * 480 : random() * 1600,
    y: band === 'top' ? random() * 120 : 10 + random() * 280,
    r: 7 + random() * 16,
    o: 0.5 + random() * 0.5,
    tone: Math.floor(random() * PETAL_TONES.length),
  }))
}

const CANOPY_LEFT = makeCanopy(26, 11, 'left')
const CANOPY_RIGHT = makeCanopy(26, 22, 'right')
const CANOPY_TOP = makeCanopy(20, 33, 'top')

const STARS = (() => {
  const random = seeded(77)
  return Array.from({ length: 110 }, () => ({
    x: random() * 1600,
    y: random() * 640,
    r: 0.6 + random() * 1.8,
    o: 0.25 + random() * 0.7,
  }))
})()

const FIREFLIES = (() => {
  const random = seeded(404)
  return Array.from({ length: 18 }, () => ({
    x: random() * 100,
    y: 45 + random() * 55,
    delay: -(random() * 8),
    duration: 5 + random() * 4,
  }))
})()

const WISTERIA = (() => {
  const random = seeded(808)
  return Array.from({ length: 18 }, (_, i) => ({
    x: 40 + i * 88 + random() * 30,
    top: 20 + random() * 90,
    length: 180 + random() * 260,
    blooms: 5 + Math.floor(random() * 5),
  }))
})()

const FLAMINGOS = (() => {
  const random = seeded(1963)
  return Array.from({ length: 11 }, () => ({
    x: 380 + random() * 620,
    y: 470 + random() * 110,
    s: 0.45 + random() * 0.4,
    flip: random() > 0.5,
  }))
})()

function Canopy({ clusters, opacity = 1 }: { clusters: ReturnType<typeof makeCanopy>; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {clusters.map((cluster, i) => (
        <g key={i}>
          <circle cx={cluster.x} cy={cluster.y} r={cluster.r} fill={PETAL_TONES[cluster.tone]} opacity={cluster.o} />
          <circle
            cx={cluster.x + cluster.r * 0.28}
            cy={cluster.y - cluster.r * 0.24}
            r={cluster.r * 0.44}
            fill="#fff9f2"
            opacity={cluster.o * 0.65}
          />
        </g>
      ))}
    </g>
  )
}

/** Pale peach dawn, layered ridges, a torii silhouette and a sakura canopy. */
export function DawnValley({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="Pink dawn over a mountain valley with a torii gate and flowering cherry trees"
      layers={
        <>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="dv-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2e2a55" />
                  <stop offset="0.26" stopColor="#7b5b86" />
                  <stop offset="0.52" stopColor="#d48fa0" />
                  <stop offset="0.76" stopColor="#ffd8c2" />
                  <stop offset="1" stopColor="#fff4e2" />
                </linearGradient>
                <radialGradient id="dv-sun">
                  <stop offset="0" stopColor="#fff7dd" stopOpacity="0.95" />
                  <stop offset="0.45" stopColor="#ffcf9c" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#ffd8c2" stopOpacity="0" />
                </radialGradient>
                <filter id="dv-cloud"><feGaussianBlur stdDeviation="24" /></filter>
              </defs>
              <rect width="1600" height="900" fill="url(#dv-sky)" />
              <circle cx="1120" cy="430" r="250" fill="url(#dv-sun)" />
              <circle cx="1120" cy="430" r="52" fill="#fff4d8" opacity="0.78" />
              <g filter="url(#dv-cloud)" opacity="0.5">
                <ellipse cx="300" cy="330" rx="340" ry="32" fill="#ffe2d6" />
                <ellipse cx="900" cy="250" rx="420" ry="26" fill="#f4c6d0" />
                <ellipse cx="1340" cy="530" rx="300" ry="30" fill="#fff1df" />
              </g>
            </Art>
          </Layer>

          <Layer depth={0.3}>
            <Art>
              <path d="M0 560 L160 430 L280 500 L430 350 L560 470 L700 390 L860 520 L1010 400 L1170 500 L1320 380 L1460 480 L1600 420 L1600 900 L0 900 Z" fill="#bc90a4" opacity="0.72" />
              <path d="M430 350 L470 396 L500 372 L530 410 L560 470 L500 452 L450 424 Z" fill="#f7d9e1" opacity="0.5" />
              <path d="M1010 400 L1050 442 L1080 424 L1120 458 L1170 500 L1100 480 L1040 452 Z" fill="#ffe4ea" opacity="0.45" />
              <path d="M0 640 L180 520 L330 590 L500 470 L660 600 L820 500 L980 620 L1150 490 L1330 600 L1480 510 L1600 580 L1600 900 L0 900 Z" fill="#8c7194" opacity="0.78" />
              <path d="M500 470 L540 514 L570 494 L610 538 L660 600 L590 580 L540 548 Z" fill="#f4c6d0" opacity="0.32" />
            </Art>
          </Layer>

          <Layer depth={0.5}>
            <Art>
              <defs>
                <filter id="dv-mist" x="-20%" y="-40%" width="140%" height="180%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="3" seed="7" result="noise" />
                  <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0.96  0 1 0 0 0.86  0 0 1 0 0.88  0 0 0 0.5 0" result="tinted" />
                  <feGaussianBlur in="tinted" stdDeviation="16" />
                </filter>
              </defs>
              <rect x="-100" y="480" width="1800" height="290" filter="url(#dv-mist)" opacity="0.6" />
            </Art>
          </Layer>

          <Layer depth={0.72}>
            <Art>
              <path d="M0 724 C260 656 520 704 800 662 C1080 620 1320 692 1600 644 L1600 900 L0 900 Z" fill="#594663" />
              <g>
                <rect x="700" y="524" width="18" height="152" rx="4" fill="#c8372d" />
                <rect x="880" y="524" width="18" height="152" rx="4" fill="#c8372d" />
                <path d="M652 516 Q800 486 948 516 L944 534 Q800 508 656 534 Z" fill="#c8372d" />
                <rect x="682" y="552" width="236" height="15" rx="3" fill="#a92c26" />
                <rect x="692" y="574" width="216" height="9" rx="3" fill="#c8372d" />
                <path d="M700 560 Q800 588 898 560" fill="none" stroke="#a92c26" strokeWidth="4" />
              </g>
              <path d="M0 780 C300 730 560 776 820 748 C1120 716 1360 774 1600 736 L1600 900 L0 900 Z" fill="#3a2b47" />
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <path d="M-30 -20 C110 30 224 88 306 174 C350 222 396 246 452 260" fill="none" stroke="#241b31" strokeWidth="20" strokeLinecap="round" />
              <path d="M-10 40 C80 92 128 150 156 220" fill="none" stroke="#241b31" strokeWidth="10" strokeLinecap="round" />
              <path d="M1630 -30 C1490 34 1390 94 1312 182 C1266 236 1226 258 1178 272" fill="none" stroke="#241b31" strokeWidth="22" strokeLinecap="round" />
              <path d="M1610 60 C1520 110 1476 168 1452 240" fill="none" stroke="#241b31" strokeWidth="11" strokeLinecap="round" />
              <Canopy clusters={CANOPY_LEFT} />
              <Canopy clusters={CANOPY_RIGHT} />
              <Canopy clusters={CANOPY_TOP} opacity={0.7} />
              <path d="M0 850 C260 812 520 856 800 830 C1080 804 1340 852 1600 816 L1600 900 L0 900 Z" fill="#20182c" />
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

/** Moon bridge over a river, mountain mist, cherry trees and water reflections. */
export function RiverBridge({ imageSrc, className, children }: SceneProps) {
  const posts = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12
    return { x: 462 + t * 676, y: 690 - Math.sin(Math.PI * t) * 92 }
  })

  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="A stone moon bridge over a misty river lined with cherry trees"
      layers={
        <>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1f2350" />
                  <stop offset="0.34" stopColor="#5a4a7a" />
                  <stop offset="0.62" stopColor="#c48ba0" />
                  <stop offset="0.84" stopColor="#ffd0bb" />
                  <stop offset="1" stopColor="#ffe9d4" />
                </linearGradient>
                <radialGradient id="rb-moon">
                  <stop offset="0" stopColor="#fff8e6" stopOpacity="0.95" />
                  <stop offset="0.4" stopColor="#ffe6c6" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#ffe6c6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#rb-sky)" />
              <circle cx="1240" cy="230" r="180" fill="url(#rb-moon)" />
              <circle cx="1240" cy="230" r="46" fill="#fff8e6" opacity="0.9" />
              <path d="M0 300 C260 280 420 318 640 292 C860 266 1080 306 1280 282 C1420 266 1520 292 1600 280" fill="none" stroke="#ffe4d6" strokeOpacity="0.24" strokeWidth="18" />
            </Art>
          </Layer>

          <Layer depth={0.28}>
            <Art>
              <path d="M0 560 L200 420 L360 510 L540 360 L720 520 L900 400 L1080 540 L1280 380 L1440 500 L1600 440 L1600 900 L0 900 Z" fill="#6b628a" opacity="0.7" />
              <path d="M540 360 L592 420 L626 402 L666 448 L720 520 L650 494 L596 460 Z" fill="#e7c4cf" opacity="0.3" />
              <path d="M0 660 C220 590 420 640 640 604 C860 568 1060 630 1280 590 C1420 564 1520 596 1600 584 L1600 900 L0 900 Z" fill="#4a4267" opacity="0.85" />
            </Art>
          </Layer>

          <Layer depth={0.46}>
            <Art>
              <defs>
                <filter id="rb-mist" x="-20%" y="-30%" width="140%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.009 0.035" numOctaves="3" seed="19" result="n" />
                  <feColorMatrix in="n" type="matrix" values="1 0 0 0 0.92  0 1 0 0 0.88  0 0 1 0 0.95  0 0 0 0.5 0" result="c" />
                  <feGaussianBlur in="c" stdDeviation="20" />
                </filter>
              </defs>
              <rect x="-100" y="490" width="1800" height="250" filter="url(#rb-mist)" opacity="0.65" />
            </Art>
          </Layer>

          <Layer depth={0.68}>
            <Art>
              {/* Cherry trees on both banks */}
              <path d="M 96 726 C 118 660 104 596 146 536 C 176 492 172 440 154 388" fill="none" stroke="#3b2a3d" strokeWidth="18" strokeLinecap="round" />
              <path d="M 146 536 C 190 512 216 480 232 444 M 138 590 C 96 566 66 536 48 500" fill="none" stroke="#3b2a3d" strokeWidth="8" strokeLinecap="round" />
              <path d="M 1504 730 C 1482 654 1500 590 1458 528 C 1430 488 1434 438 1452 390" fill="none" stroke="#3b2a3d" strokeWidth="18" strokeLinecap="round" />
              <path d="M 1458 528 C 1416 502 1390 472 1372 436 M 1466 586 C 1510 560 1540 528 1556 494" fill="none" stroke="#3b2a3d" strokeWidth="8" strokeLinecap="round" />
              <Canopy clusters={CANOPY_LEFT} opacity={0.85} />
              <Canopy clusters={CANOPY_RIGHT} opacity={0.85} />

              {/* Stone moon bridge */}
              <path d="M 430 690 C 600 558 1000 558 1170 690 L 1170 726 L 430 726 Z" fill="#9d8b87" />
              <path d="M 470 690 C 620 598 980 598 1130 690" fill="none" stroke="#ddcabf" strokeWidth="9" />
              <path d="M 430 690 L 1170 690" stroke="#7a6a6a" strokeWidth="13" />
              {posts.map((post) => (
                <g key={post.x}>
                  <line x1={post.x} y1={post.y} x2={post.x} y2={post.y - 46} stroke="#7a6a6a" strokeWidth="5" />
                  <circle cx={post.x} cy={post.y - 48} r="5" fill="#c9a45c" opacity="0.7" />
                </g>
              ))}
              <path d="M 462 644 C 660 564 940 564 1138 644" fill="none" stroke="#a79591" strokeWidth="4" />
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <defs>
                <linearGradient id="rb-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a4267" />
                  <stop offset="0.4" stopColor="#6b5c7e" />
                  <stop offset="1" stopColor="#2e2a55" />
                </linearGradient>
                <filter id="rb-shimmer"><feGaussianBlur stdDeviation="7" /></filter>
              </defs>
              <rect x="0" y="710" width="1600" height="260" fill="url(#rb-water)" />
              <g filter="url(#rb-shimmer)" opacity="0.5">
                <ellipse cx="1240" cy="770" rx="46" ry="9" fill="#ffe6c6" opacity="0.8" />
                <ellipse cx="1240" cy="820" rx="90" ry="7" fill="#ffd0bb" opacity="0.55" />
                <ellipse cx="800" cy="792" rx="220" ry="6" fill="#f4c6d0" opacity="0.35" />
              </g>
              {Array.from({ length: 12 }, (_, i) => (
                <path
                  key={i}
                  d={`M ${120 + i * 128} ${744 + (i % 3) * 42} q 34 -7 68 0`}
                  fill="none"
                  stroke="#f7d9e1"
                  strokeOpacity={0.12 + (i % 4) * 0.06}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              <path d="M0 866 C240 844 480 878 720 860 C1000 840 1280 882 1600 852 L1600 900 L0 900 Z" fill="#241f40" />
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

/** Dusk garden of hanging wisteria with asanoha / ichimatsu borders and stone lanterns. */
export function WisteriaGarden({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="A violet dusk garden hung with wisteria and lit by stone lanterns"
      layers={
        <>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="wg-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1e1b2e" />
                  <stop offset="0.32" stopColor="#3a2f5d" />
                  <stop offset="0.62" stopColor="#6b5688" />
                  <stop offset="0.86" stopColor="#9b7bc8" />
                  <stop offset="1" stopColor="#d9bcd8" />
                </linearGradient>
                <radialGradient id="wg-glow">
                  <stop offset="0" stopColor="#f7d9e1" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#f7d9e1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#wg-sky)" />
              <circle cx="820" cy="320" r="360" fill="url(#wg-glow)" />
              <circle cx="820" cy="300" r="54" fill="#fff2e2" opacity="0.5" />
            </Art>
          </Layer>

          <Layer depth={0.26}>
            <Art>
              <defs>
                <pattern id="wg-asanoha" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="#241b31" opacity="0.85" />
                  <g stroke="#c9a45c" strokeOpacity="0.32" strokeWidth="1.2" fill="none">
                    <path d="M40 0 V80 M0 40 H80 M0 0 L80 80 M80 0 L0 80" />
                    <path d="M40 0 L20 40 L40 80 L60 40 Z" />
                    <path d="M0 40 L40 20 L80 40 L40 60 Z" />
                  </g>
                </pattern>
                <pattern id="wg-ichimatsu" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="#2b2038" />
                  <rect width="40" height="40" fill="#9b7bc8" opacity="0.35" />
                  <rect x="40" y="40" width="40" height="40" fill="#9b7bc8" opacity="0.35" />
                  <rect x="40" width="40" height="40" fill="#151222" opacity="0.6" />
                  <rect y="40" width="40" height="40" fill="#151222" opacity="0.6" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1600" height="72" fill="url(#wg-asanoha)" />
              <rect x="0" y="828" width="1600" height="72" fill="url(#wg-asanoha)" />
              <rect x="0" y="0" width="76" height="900" fill="url(#wg-ichimatsu)" />
              <rect x="1524" y="0" width="76" height="900" fill="url(#wg-ichimatsu)" />
              <path d="M76 84 H1524 M76 816 H1524" stroke="#c9a45c" strokeOpacity="0.5" strokeWidth="2" />
            </Art>
          </Layer>

          <Layer depth={0.46}>
            <Art>
              <defs>
                <filter id="wg-haze"><feGaussianBlur stdDeviation="22" /></filter>
              </defs>
              <path d="M0 690 C300 640 620 700 900 664 C1180 628 1400 686 1600 654 L1600 900 L0 900 Z" fill="#453453" />
              <path d="M620 900 C700 790 760 730 800 700 C860 748 930 812 1000 900 Z" fill="#8d7c91" opacity="0.45" />
              <g filter="url(#wg-haze)" opacity="0.45">
                <ellipse cx="500" cy="620" rx="360" ry="44" fill="#d9bcd8" />
                <ellipse cx="1200" cy="680" rx="320" ry="38" fill="#f7d9e1" />
              </g>
            </Art>
          </Layer>

          <Layer depth={0.72}>
            <Art>
              <defs>
                <linearGradient id="wg-vine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6f5a8f" />
                  <stop offset="0.5" stopColor="#9b7bc8" />
                  <stop offset="1" stopColor="#e0c6ec" />
                </linearGradient>
                <filter id="wg-vine-soft"><feGaussianBlur stdDeviation="3" /></filter>
              </defs>
              <path d="M0 40 C380 120 1220 120 1600 40" fill="none" stroke="#3d3048" strokeWidth="18" />
              {WISTERIA.map((strand, i) => (
                <g key={strand.x}>
                  <path d={`M ${strand.x} ${strand.top} C ${strand.x - 16} ${strand.top + strand.length * 0.45}, ${strand.x + 16} ${strand.top + strand.length * 0.7}, ${strand.x} ${strand.top + strand.length}`} fill="none" stroke="#6f5a8f" strokeWidth="3.5" />
                  <g filter="url(#wg-vine-soft)" opacity="0.55">
                    <path d={`M ${strand.x - 12} ${strand.top + 10} C ${strand.x - 30} ${strand.top + strand.length * 0.6}, ${strand.x + 2} ${strand.top + strand.length * 0.8}, ${strand.x - 4} ${strand.top + strand.length - 20}`} fill="none" stroke="#e0c6ec" strokeWidth="16" />
                  </g>
                  {Array.from({ length: strand.blooms }, (_, j) => {
                    const t = (j + 1) / (strand.blooms + 1)
                    const y = strand.top + strand.length * t
                    const x = strand.x + Math.sin(t * Math.PI * 2 + i) * 9
                    return (
                      <g key={j}>
                        <ellipse cx={x - 10} cy={y} rx="13" ry="9" fill="url(#wg-vine)" transform={`rotate(-24 ${x - 10} ${y})`} />
                        <ellipse cx={x + 10} cy={y + 8} rx="12" ry="8" fill="#b99ad6" transform={`rotate(20 ${x + 10} ${y + 8})`} />
                        <ellipse cx={x} cy={y + 18} rx="11" ry="7" fill="#e6d0ef" opacity="0.9" />
                      </g>
                    )
                  })}
                </g>
              ))}
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <defs>
                <radialGradient id="wg-lantern-glow">
                  <stop offset="0" stopColor="#f2a33a" stopOpacity="0.7" />
                  <stop offset="1" stopColor="#f2a33a" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[
                [250, 700, 1.1],
                [1350, 742, 0.9],
              ].map(([x, y, s]) => (
                <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
                  <circle cy="-56" r="120" fill="url(#wg-lantern-glow)" />
                  <path d="M-34 0 L34 0 L24 -26 L-24 -26 Z" fill="#6d6470" />
                  <rect x="-22" y="-72" width="44" height="46" rx="4" fill="#f2a33a" />
                  <path d="M-30 -76 L30 -76 L22 -84 L-22 -84 Z" fill="#4a4350" />
                  <path d="M-34 -92 L34 -92 L26 -104 L-26 -104 Z" fill="#4a4350" />
                  <rect x="-14" y="-62" width="28" height="22" rx="2" fill="#fff0c6" opacity="0.9" />
                  <path d="M-40 0 H40 L52 14 H-52 Z" fill="#57505d" />
                </g>
              ))}
              <path d="M0 850 C280 826 560 868 840 842 C1120 816 1380 866 1600 836 L1600 900 L0 900 Z" fill="#1e1b2e" />
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

interface Burst {
  sparks: Spark[]
  age: number
}

const FIREWORK_COLORS = ['#f4c6d0', '#f2a33a', '#fff3cf', '#9b7bc8', '#ffd8c2', '#e9839a']

/** Small, capped firework canvas. Pauses offscreen, in a hidden tab, or for reduced motion. */
function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 1
    let height = 1
    let dpr = 1
    const bursts: Burst[] = []

    const makeBurst = (x: number, y: number): Burst => {
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      const total = 36 + Math.floor(Math.random() * 20)
      const sparks: Spark[] = Array.from({ length: total }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = 1.2 + Math.random() * 2.6
        const life = 34 + Math.random() * 30
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: Math.random() > 0.82 ? '#fff8e6' : color,
        }
      })
      return { sparks, age: 0 }
    }

    const paintStatic = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      const centers: [number, number, number][] = [
        [0.28, 0.3, 74],
        [0.62, 0.2, 54],
        [0.78, 0.46, 62],
      ]
      centers.forEach(([cx, cy, radius], i) => {
        ctx.strokeStyle = FIREWORK_COLORS[i % FIREWORK_COLORS.length]
        for (let j = 0; j < 22; j += 1) {
          const angle = (j / 22) * Math.PI * 2
          ctx.globalAlpha = 0.28 + (j % 3) * 0.1
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(cx * width, cy * height)
          ctx.lineTo(cx * width + Math.cos(angle) * radius, cy * height + Math.sin(angle) * radius)
          ctx.stroke()
        }
      })
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      if (reduced) paintStatic()
    }

    resize()
    if (reduced) {
      const observer = new ResizeObserver(resize)
      observer.observe(canvas)
      return () => observer.disconnect()
    }

    let frame = 0
    let last = 0
    let onscreen = false
    let tabVisible = !document.hidden

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick)
      const dt = last ? Math.min(2, (time - last) / 16.67) : 1
      last = time

      if (bursts.length < 3 && Math.random() < 0.014 * dt) {
        bursts.push(makeBurst(width * (0.14 + Math.random() * 0.72), height * (0.08 + Math.random() * 0.44)))
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const burst = bursts[i]
        burst.age += dt
        for (const spark of burst.sparks) {
          spark.x += spark.vx * dt
          spark.y += spark.vy * dt
          spark.vx *= Math.pow(0.99, dt)
          spark.vy = spark.vy * Math.pow(0.99, dt) + 0.035 * dt
          spark.life -= dt
          if (spark.life <= 0) continue
          const alpha = Math.max(0, spark.life / spark.maxLife)
          ctx.globalAlpha = alpha * 0.9
          ctx.fillStyle = spark.color
          ctx.beginPath()
          ctx.arc(spark.x, spark.y, 0.6 + alpha * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
        if (burst.age > 88) bursts.splice(i, 1)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const start = () => {
      if (frame || !onscreen || !tabVisible) return
      last = 0
      frame = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!frame) return
      window.cancelAnimationFrame(frame)
      frame = 0
    }
    const sync = () => (onscreen && tabVisible ? start() : stop())
    const onVisibility = () => {
      tabVisible = !document.hidden
      sync()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        onscreen = entries[0]?.isIntersecting ?? false
        sync()
      },
      { rootMargin: '120px' },
    )
    observer.observe(canvas)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}

/** Night festival street with paper lanterns, fireworks, drums and food stalls. */
export function MatsuriNight({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="A glowing night festival street with paper lanterns and fireworks"
      layers={
        <>
          <style>{`
            @keyframes matsuri-sway {
              0%, 100% { transform: rotate(-4deg); }
              50% { transform: rotate(4deg); }
            }
            .matsuri-lantern {
              transform-box: fill-box;
              transform-origin: 50% 0%;
              animation: matsuri-sway 3.4s ease-in-out infinite;
            }
          `}</style>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#14132f" />
                  <stop offset="0.42" stopColor="#1f2350" />
                  <stop offset="0.75" stopColor="#3c305c" />
                  <stop offset="1" stopColor="#6b3f58" />
                </linearGradient>
                <radialGradient id="mn-haze">
                  <stop offset="0" stopColor="#f2a33a" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#f2a33a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#mn-sky)" />
              <ellipse cx="800" cy="700" rx="700" ry="240" fill="url(#mn-haze)" />
              {STARS.map((star, i) => (
                <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#fff3cf" opacity={star.o * 0.6} />
              ))}
            </Art>
          </Layer>

          <Layer depth={0.3}>
            <Art>
              <path d="M0 620 L120 620 L120 540 L280 540 L280 620 L420 620 L420 500 L600 500 L600 620 L760 620 L760 548 L920 548 L920 620 L1080 620 L1080 490 L1280 490 L1280 620 L1440 620 L1440 536 L1600 536 L1600 900 L0 900 Z" fill="#241b31" />
              {[200, 500, 840, 1160, 1500].map((x) => (
                <g key={x}>
                  <rect x={x - 60} y="560" width="120" height="60" fill="#3c2a40" />
                  <path d={`M ${x - 78} 558 L ${x} 516 L ${x + 78} 558 Z`} fill="#c8372d" opacity="0.85" />
                  <rect x={x - 40} y="580" width="80" height="14" fill="#f2a33a" opacity="0.4" />
                </g>
              ))}
            </Art>
          </Layer>

          <Layer depth={0.5}>
            <Fireworks />
          </Layer>

          <Layer depth={0.72}>
            <Art>
              <defs>
                <linearGradient id="mn-paper" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#d5522f" />
                  <stop offset="0.42" stopColor="#f2a33a" />
                  <stop offset="1" stopColor="#ffe0a0" />
                </linearGradient>
              </defs>
              <path d="M0 110 C340 190 1260 190 1600 104" fill="none" stroke="#14132f" strokeWidth="3" />
              {Array.from({ length: 13 }, (_, i) => {
                const x = 60 + i * 124
                const y = 118 + Math.sin(i * 0.85) * 26
                return (
                  <g key={i} className="matsuri-lantern animate-lantern" style={{ animationDelay: `${(i % 5) * 0.32}s` }}>
                    <line x1={x} y1={y - 42} x2={x} y2={y} stroke="#14132f" strokeWidth="2.5" />
                    <ellipse cx={x} cy={y + 24} rx="23" ry="29" fill="url(#mn-paper)" />
                    <path d={`M ${x - 19} ${y + 6} H ${x + 19} M ${x - 22} ${y + 24} H ${x + 22} M ${x - 18} ${y + 42} H ${x + 18}`} stroke="#c8372d" strokeOpacity="0.6" strokeWidth="2" />
                    <rect x={x - 8} y={y - 8} width="16" height="7" fill="#3c2a40" />
                    <text x={x} y={y + 32} textAnchor="middle" fontSize="22" fill="#8f2d26" className="font-jp">祭</text>
                  </g>
                )
              })}
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <rect x="0" y="760" width="1600" height="140" fill="#1a1427" />
              <path d="M0 770 C300 744 620 786 920 758 C1220 730 1420 782 1600 756" fill="none" stroke="#4a3550" strokeWidth="8" />
              {/* Taiko and dhol motifs */}
              {[
                [300, 800, 1],
                [1280, 812, 0.82],
              ].map(([x, y, s]) => (
                <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
                  <circle r="62" fill="#8a3b32" stroke="#c9a45c" strokeWidth="5" />
                  <circle r="46" fill="#f3e0bd" stroke="#a9542f" strokeWidth="4" />
                  {Array.from({ length: 12 }, (_, i) => {
                    const angle = (i / 12) * Math.PI * 2
                    return (
                      <line
                        key={i}
                        x1={Math.cos(angle) * 48}
                        y1={Math.sin(angle) * 48}
                        x2={Math.cos(angle) * 60}
                        y2={Math.sin(angle) * 60}
                        stroke="#c9a45c"
                        strokeWidth="3"
                      />
                    )
                  })}
                  <circle r="14" fill="#a9542f" opacity="0.5" />
                  <path d="M-88 -66 L-20 -18 M88 -70 L18 -20" stroke="#e9c46a" strokeWidth="7" strokeLinecap="round" />
                </g>
              ))}
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

/** Vermilion torii framing a floral mandap with warm god-rays. */
export function ShrineMandap({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="A vermilion torii gate framing a flower-decked wedding mandap"
      layers={
        <>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="sm-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a2f45" />
                  <stop offset="0.34" stopColor="#a4546a" />
                  <stop offset="0.66" stopColor="#ffd8c2" />
                  <stop offset="1" stopColor="#fff3d9" />
                </linearGradient>
                <radialGradient id="sm-sun">
                  <stop offset="0" stopColor="#fff8dd" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#fff0cc" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#sm-sky)" />
              <circle cx="800" cy="360" r="330" fill="url(#sm-sun)" />
            </Art>
          </Layer>

          <Layer depth={0.3}>
            <Art>
              <path d="M0 600 C240 540 480 620 720 580 C980 536 1240 620 1600 560 L1600 900 L0 900 Z" fill="#8c6574" opacity="0.7" />
              <path d="M0 680 C280 630 560 700 840 660 C1120 620 1380 694 1600 650 L1600 900 L0 900 Z" fill="#5d4357" />
            </Art>
          </Layer>

          <Layer depth={0.52}>
            <Art>
              <defs>
                <linearGradient id="sm-ray" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff3cf" stopOpacity="0.65" />
                  <stop offset="1" stopColor="#fff3cf" stopOpacity="0" />
                </linearGradient>
                <filter id="sm-soft"><feGaussianBlur stdDeviation="20" /></filter>
              </defs>
              <g filter="url(#sm-soft)" opacity="0.7">
                <path d="M760 -40 L980 900 L700 900 Z" fill="url(#sm-ray)" />
                <path d="M900 -40 L1260 900 L1020 900 Z" fill="url(#sm-ray)" opacity="0.7" />
                <path d="M640 -40 L720 900 L460 900 Z" fill="url(#sm-ray)" opacity="0.55" />
                <path d="M1080 -40 L1520 900 L1300 900 Z" fill="url(#sm-ray)" opacity="0.5" />
              </g>
            </Art>
          </Layer>

          <Layer depth={0.72}>
            <Art>
              {/* Torii */}
              <g>
                <rect x="300" y="196" width="42" height="580" rx="8" fill="#c8372d" />
                <rect x="1258" y="196" width="42" height="580" rx="8" fill="#c8372d" />
                <rect x="286" y="580" width="70" height="26" fill="#9c271f" />
                <rect x="1244" y="580" width="70" height="26" fill="#9c271f" />
                <path d="M214 178 Q800 96 1386 178 L1376 220 Q800 146 224 220 Z" fill="#c8372d" />
                <rect x="252" y="260" width="1096" height="34" rx="6" fill="#c8372d" />
                <rect x="272" y="296" width="1056" height="12" fill="#9c271f" />
                <rect x="318" y="214" width="30" height="560" fill="#e0604d" opacity="0.4" />
                <rect x="1276" y="214" width="18" height="560" fill="#e0604d" opacity="0.35" />
              </g>

              {/* Mandap arch and garlands */}
              <g>
                <path d="M470 776 L470 470 Q800 300 1130 470 L1130 776" fill="none" stroke="#c9a45c" strokeWidth="16" />
                <path d="M510 776 L510 488 Q800 336 1090 488 L1090 776" fill="none" stroke="#9c6b3f" strokeWidth="6" />
                {Array.from({ length: 30 }, (_, i) => {
                  const t = i / 29
                  const x = 470 + t * 660
                  const y = 470 - Math.sin(Math.PI * t) * 168
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y + 12} r="12" fill={i % 3 === 0 ? '#f2a33a' : i % 3 === 1 ? '#f7d9e1' : '#ffe4ea'} />
                      <circle cx={x + 4} cy={y + 4} r="7" fill="#e9839a" opacity="0.8" />
                    </g>
                  )
                })}
                <path d="M540 640 Q800 720 1060 640 L1060 700 Q800 780 540 700 Z" fill="#f4c6d0" opacity="0.65" />
                <path d="M560 660 Q800 740 1040 660" fill="none" stroke="#c9a45c" strokeWidth="4" />
                <rect x="600" y="740" width="400" height="36" rx="8" fill="#8a3b32" />
                <path d="M640 742 L640 776 M800 742 L800 776 M960 742 L960 776" stroke="#c9a45c" strokeWidth="4" />
              </g>
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <path d="M-20 -20 C140 40 260 118 340 208 C386 260 428 286 482 298" fill="none" stroke="#241b31" strokeWidth="18" strokeLinecap="round" />
              <path d="M1620 -20 C1460 40 1340 118 1260 208 C1214 260 1172 286 1118 298" fill="none" stroke="#241b31" strokeWidth="18" strokeLinecap="round" />
              <Canopy clusters={CANOPY_LEFT} />
              <Canopy clusters={CANOPY_RIGHT} />
              <path d="M0 842 C280 812 560 858 840 832 C1120 806 1380 856 1600 824 L1600 900 L0 900 Z" fill="#2b1f33" />
              {Array.from({ length: 16 }, (_, i) => (
                <ellipse key={i} cx={80 + i * 100} cy={860 + (i % 3) * 12} rx="9" ry="4" fill="#f7d9e1" opacity="0.5" />
              ))}
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

function Flamingo({ x, y, scale: s, flip }: { x: number; y: number; scale: number; flip: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="#d9647f">
      <path d="M0 0 C8 -7 20 -7 27 0 C31 5 32 13 27 19 L20 16 C24 10 22 6 16 6 C10 6 6 11 6 17 L0 17 Z" />
      <path d="M20 3 C27 -13 23 -28 13 -35 C9 -38 4 -35 7 -31 C15 -24 18 -12 13 -2 Z" />
      <path d="M8 -33 L-4 -31 L6 -26 Z" fill="#2e2a55" />
      <line x1="9" y1="16" x2="7" y2="47" stroke="#b5536f" strokeWidth="2" />
      <line x1="18" y1="16" x2="20" y2="47" stroke="#b5536f" strokeWidth="2" />
    </g>
  )
}

function Acacia({ x, y, scale: s }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#2e2a3d">
      <path d="M-7 0 C-4 -60 -8 -104 -2 -146 L4 -146 C10 -104 6 -60 9 0 Z" />
      <path d="M-8 -142 C-44 -158 -76 -150 -94 -136 C-66 -128 -36 -130 -6 -130" />
      <path d="M8 -146 C44 -162 78 -154 98 -140 C68 -130 36 -134 4 -132" />
      <path d="M-96 -136 C-40 -176 44 -176 100 -140 C46 -152 -42 -152 -96 -136 Z" />
    </g>
  )
}

/** Lake Nakuru golden hour: acacias, flamingos and a festoon-lit boat. */
export function LakeGoldenHour({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="Golden hour on Lake Nakuru with flamingos, acacia trees and a lit boat"
      layers={
        <>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="lg-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a3b63" />
                  <stop offset="0.28" stopColor="#a35f76" />
                  <stop offset="0.54" stopColor="#e9a074" />
                  <stop offset="0.78" stopColor="#f6cf8e" />
                  <stop offset="1" stopColor="#fff0c4" />
                </linearGradient>
                <radialGradient id="lg-sun">
                  <stop offset="0" stopColor="#fff8d8" stopOpacity="1" />
                  <stop offset="0.35" stopColor="#ffd68e" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#ffd68e" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#lg-sky)" />
              <circle cx="1180" cy="400" r="290" fill="url(#lg-sun)" />
              <circle cx="1180" cy="400" r="62" fill="#fff6d6" opacity="0.85" />
              <g opacity="0.35" fill="#ffe6c2">
                <ellipse cx="360" cy="280" rx="260" ry="16" />
                <ellipse cx="940" cy="220" rx="200" ry="12" />
                <ellipse cx="1420" cy="320" rx="220" ry="14" />
              </g>
            </Art>
          </Layer>

          <Layer depth={0.3}>
            <Art>
              <path d="M0 560 L180 500 L340 550 L520 470 L700 540 L880 490 L1060 552 L1240 480 L1420 540 L1600 500 L1600 900 L0 900 Z" fill="#8c6b72" opacity="0.6" />
              <path d="M0 620 C260 586 520 636 780 604 C1040 572 1320 626 1600 594 L1600 900 L0 900 Z" fill="#6d5364" />
              {/* Flamingo flock */}
              {FLAMINGOS.map((bird, i) => (
                <Flamingo key={i} x={bird.x} y={bird.y} scale={bird.s} flip={bird.flip} />
              ))}
            </Art>
          </Layer>

          <Layer depth={0.5}>
            <Art>
              <defs>
                <linearGradient id="lg-lake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d5a07c" />
                  <stop offset="0.3" stopColor="#a97a83" />
                  <stop offset="0.7" stopColor="#5d506f" />
                  <stop offset="1" stopColor="#36334f" />
                </linearGradient>
                <filter id="lg-reflect"><feGaussianBlur stdDeviation="9" /></filter>
              </defs>
              <rect x="0" y="640" width="1600" height="260" fill="url(#lg-lake)" />
              <g filter="url(#lg-reflect)" opacity="0.6">
                <ellipse cx="1180" cy="700" rx="70" ry="10" fill="#fff0c4" />
                <ellipse cx="1180" cy="760" rx="130" ry="9" fill="#ffd68e" opacity="0.7" />
                <ellipse cx="1180" cy="830" rx="190" ry="8" fill="#e9a074" opacity="0.5" />
              </g>
              {Array.from({ length: 14 }, (_, i) => (
                <path
                  key={i}
                  d={`M ${40 + i * 116} ${676 + (i % 4) * 46} q 40 -8 80 0`}
                  fill="none"
                  stroke="#ffe6c2"
                  strokeOpacity={0.08 + (i % 4) * 0.05}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </Art>
          </Layer>

          <Layer depth={0.72}>
            <Art>
              <path d="M0 700 C240 672 480 712 720 690 C980 666 1260 714 1600 680 L1600 900 L0 900 Z" fill="#3d3449" />
              <Acacia x={1360} y={730} scale={1.15} />
              <Acacia x={1520} y={760} scale={0.72} />
              <Acacia x={120} y={744} scale={0.66} />
              <path d="M0 806 C260 780 540 824 820 798 C1100 772 1360 820 1600 792 L1600 900 L0 900 Z" fill="#272339" />
            </Art>
          </Layer>

          {/* Open hook area: the lower-left shore is intentionally quiet so a
              straw-hat Easter egg can be passed through `children`. */}
          <Layer depth={1}>
            <Art>
              <g>
                <path d="M1040 776 Q1180 820 1340 764 L1308 810 Q1180 844 1082 806 Z" fill="#241b31" />
                <path d="M1120 768 L1120 706 L1260 706 L1260 770" fill="none" stroke="#3a2b39" strokeWidth="10" />
                <path d="M1116 710 Q1190 686 1264 708" fill="none" stroke="#c9a45c" strokeWidth="3" />
                <path d="M1080 704 Q1190 760 1300 694" fill="none" stroke="#2b2233" strokeWidth="3" />
                {Array.from({ length: 9 }, (_, i) => {
                  const t = (i + 1) / 10
                  const x = 1080 + t * 220
                  const y = 704 + Math.sin(Math.PI * t) * 46
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y + 7} r="7" fill="#f2a33a" opacity="0.35" />
                      <circle cx={x} cy={y + 7} r="3" fill="#fff3cf" />
                    </g>
                  )
                })}
                <path d="M1190 706 L1190 626" stroke="#3a2b39" strokeWidth="4" />
                <path d="M1190 634 Q1236 646 1256 684 L1190 684 Z" fill="#4a3b4d" opacity="0.8" />
              </g>
              <path d="M0 862 C280 838 560 878 840 854 C1120 830 1380 876 1600 848 L1600 900 L0 900 Z" fill="#1e1b2e" />
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

/** Deep indigo star field with a moon, CSS fireflies and a distant ridge. */
export function StarryNight({ imageSrc, className, children }: SceneProps) {
  return (
    <Scene
      imageSrc={imageSrc}
      className={className}
      alt="A deep indigo starry night with a moon, fireflies and distant hills"
      layers={
        <>
          <style>{`
            @keyframes sn-firefly-drift {
              0% { transform: translate3d(0, 0, 0); opacity: 0.18; }
              50% { transform: translate3d(18px, -26px, 0); opacity: 0.95; }
              100% { transform: translate3d(-8px, -12px, 0); opacity: 0.3; }
            }
            .sn-firefly { animation: sn-firefly-drift 6s ease-in-out infinite; }
          `}</style>
          <Layer depth={0.12}>
            <Art>
              <defs>
                <linearGradient id="sn-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0b0c24" />
                  <stop offset="0.4" stopColor="#1f2350" />
                  <stop offset="0.74" stopColor="#343068" />
                  <stop offset="1" stopColor="#5a4579" />
                </linearGradient>
                <radialGradient id="sn-moon-glow">
                  <stop offset="0" stopColor="#fff4d8" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#fff4d8" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#sn-sky)" />
              <circle cx="1220" cy="240" r="260" fill="url(#sn-moon-glow)" />
            </Art>
          </Layer>

          <Layer depth={0.26}>
            <Art>
              {STARS.map((star, i) => (
                <g key={i}>
                  <circle cx={star.x} cy={star.y} r={star.r} fill="#fff8e6" opacity={star.o} />
                  {i % 13 === 0 && (
                    <path d={`M ${star.x - 7} ${star.y} H ${star.x + 7} M ${star.x} ${star.y - 7} V ${star.y + 7}`} stroke="#fff8e6" strokeOpacity="0.4" strokeWidth="1" />
                  )}
                </g>
              ))}
            </Art>
          </Layer>

          <Layer depth={0.45}>
            <Art>
              <circle cx="1220" cy="240" r="72" fill="#fff4d8" />
              <circle cx="1196" cy="220" r="12" fill="#e6d9bd" opacity="0.55" />
              <circle cx="1244" cy="258" r="17" fill="#e6d9bd" opacity="0.45" />
              <circle cx="1236" cy="208" r="8" fill="#e6d9bd" opacity="0.4" />
              <path d="M0 220 C320 196 640 250 960 214 C1240 184 1440 226 1600 202" fill="none" stroke="#fff4d8" strokeOpacity="0.1" strokeWidth="26" />
            </Art>
            {FIREFLIES.map((fly, i) => (
              <div
                key={i}
                className="sn-firefly absolute h-1.5 w-1.5 rounded-full bg-lantern shadow-[0_0_10px_3px_rgba(242,163,58,0.45)]"
                style={{ left: `${fly.x}%`, top: `${fly.y}%`, animationDelay: `${fly.delay}s`, animationDuration: `${fly.duration}s` }}
              />
            ))}
          </Layer>

          <Layer depth={0.7}>
            <Art>
              <path d="M0 650 L180 560 L340 630 L520 520 L700 620 L880 540 L1060 640 L1240 530 L1420 620 L1600 550 L1600 900 L0 900 Z" fill="#29264c" />
              <path d="M0 740 C260 700 540 752 820 716 C1100 680 1360 744 1600 704 L1600 900 L0 900 Z" fill="#1c1a38" />
              <g fill="#c8372d" opacity="0.8">
                <rect x="780" y="626" width="7" height="76" />
                <rect x="852" y="626" width="7" height="76" />
                <path d="M764 624 Q815 610 866 624 L864 632 Q815 620 766 632 Z" />
              </g>
            </Art>
          </Layer>

          <Layer depth={1}>
            <Art>
              <path d="M-20 900 C60 820 140 786 220 766 C168 806 130 852 108 900 Z" fill="#111026" />
              <path d="M1620 900 C1540 820 1460 786 1380 766 C1432 806 1470 852 1492 900 Z" fill="#111026" />
              <path d="M-20 -10 C120 30 240 96 320 176 C366 224 408 250 460 262" fill="none" stroke="#141327" strokeWidth="14" strokeLinecap="round" />
              <Canopy clusters={CANOPY_TOP} opacity={0.5} />
              <path d="M0 858 C280 832 560 872 840 848 C1120 824 1380 872 1600 842 L1600 900 L0 900 Z" fill="#0d0c20" />
            </Art>
          </Layer>
        </>
      }
    >
      {children}
    </Scene>
  )
}

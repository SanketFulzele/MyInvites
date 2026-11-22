import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

interface SakuraTreeProps {
  className?: string
  sway?: boolean
  imageSrc?: string
  ariaLabel?: string
}

interface Limb {
  d: string
  origin: string
  clusters: [number, number][]
  twigs: string[]
}

interface BlossomSpec {
  x: number
  y: number
  scale: number
  rotation: number
  tone: number
}

const TONES = [
  { petal: '#f7d9e1', edge: '#fff2f4', center: '#b45f76', stamen: '#e8b95f' },
  { petal: '#f4c2ce', edge: '#ffe4ea', center: '#9d4d64', stamen: '#f0c978' },
  { petal: '#ffe4ea', edge: '#fff9f4', center: '#c07b8c', stamen: '#e9c881' },
  { petal: '#e9afc0', edge: '#f9dbe2', center: '#8f4359', stamen: '#dcb468' },
  { petal: '#fbd7df', edge: '#fff6f2', center: '#a95670', stamen: '#f2d08a' },
]

const PETAL_D = 'M 0 0 C -8 -5 -12 -16 -5 -22 L 0 -18 L 5 -22 C 12 -16 8 -5 0 0 Z'

/** Seven limbs, each with its own sway pivot and three blossom clusters. */
const LIMBS: Limb[] = [
  {
    d: 'M 392 424 C 330 402 268 380 196 336 C 150 307 118 278 86 244',
    origin: '392 424',
    clusters: [[196, 336], [140, 291], [86, 244]],
    twigs: ['M 196 336 C 176 316 168 292 166 268', 'M 140 291 C 120 288 100 292 82 306'],
  },
  {
    d: 'M 404 332 C 344 292 300 246 258 190 C 226 148 190 118 148 96',
    origin: '404 332',
    clusters: [[258, 190], [200, 139], [148, 96]],
    twigs: ['M 258 190 C 236 176 222 152 218 128', 'M 200 139 C 184 126 166 118 146 116'],
  },
  {
    d: 'M 442 442 C 520 426 588 396 662 356 C 714 326 762 300 810 268',
    origin: '442 442',
    clusters: [[662, 356], [726, 321], [810, 268]],
    twigs: ['M 662 356 C 676 334 680 310 676 286', 'M 726 321 C 748 314 770 316 790 328'],
  },
  {
    d: 'M 438 302 C 506 262 560 214 612 160 C 650 120 700 92 752 70',
    origin: '438 302',
    clusters: [[612, 160], [680, 110], [752, 70]],
    twigs: ['M 612 160 C 624 138 626 114 618 92', 'M 680 110 C 700 106 718 96 732 82'],
  },
  {
    d: 'M 420 222 C 410 174 398 132 380 88 C 366 54 350 30 334 6',
    origin: '420 222',
    clusters: [[380, 88], [352, 42], [334, 6]],
    twigs: ['M 380 88 C 362 76 348 58 342 38', 'M 352 42 C 336 34 320 34 306 42'],
  },
  {
    d: 'M 396 374 C 336 356 286 322 236 276 C 196 238 160 210 116 186',
    origin: '396 374',
    clusters: [[236, 276], [176, 226], [116, 186]],
    twigs: ['M 236 276 C 222 254 216 232 220 210', 'M 176 226 C 156 220 138 222 122 234'],
  },
  {
    d: 'M 448 488 C 518 486 582 470 646 448 C 700 428 750 410 798 392',
    origin: '448 488',
    clusters: [[646, 448], [720, 420], [798, 392]],
    twigs: ['M 646 448 C 660 428 666 406 664 384', 'M 720 420 C 738 416 756 408 768 396'],
  },
]

/** Small deterministic PRNG so every render shares one stable canopy. */
function mulberry32(seed: number) {
  let value = seed
  return () => {
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createBlossoms(): BlossomSpec[] {
  const random = mulberry32(20270326)
  const blossoms: BlossomSpec[] = []
  for (const limb of LIMBS) {
    for (const [cx, cy] of limb.clusters) {
      const amount = 3 + Math.floor(random() * 3)
      for (let i = 0; i < amount; i += 1) {
        const angle = random() * Math.PI * 2
        const radius = Math.pow(random(), 0.7) * 44
        blossoms.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          scale: 0.55 + random() * 0.72,
          rotation: random() * 72,
          tone: Math.floor(random() * TONES.length),
        })
      }
    }
  }
  return blossoms
}

const BLOSSOMS = createBlossoms()

function Blossom({ x, y, scale, rotation, tone }: BlossomSpec) {
  const palette = TONES[tone % TONES.length]
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotation.toFixed(1)}) scale(${scale.toFixed(2)})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={angle}
          d={PETAL_D}
          transform={`rotate(${angle}) translate(0 -1.5)`}
          fill={i % 2 === 0 ? palette.petal : palette.edge}
          stroke={palette.edge}
          strokeWidth="0.7"
        />
      ))}
      <circle r="4.2" fill={palette.center} />
      {[0, 120, 240].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const sx = Math.cos(rad) * 11
        const sy = Math.sin(rad) * 11
        return (
          <g key={angle}>
            <line x1="0" y1="0" x2={sx} y2={sy} stroke={palette.stamen} strokeWidth="1.1" strokeLinecap="round" />
            <circle cx={sx} cy={sy} r="1.5" fill="#fff2c6" />
          </g>
        )
      })}
      <circle r="1.7" fill="#fff6da" />
    </g>
  )
}

/**
 * A large original sakura tree. The trunk and seven limbs are drawn once;
 * the blossom cloud is generated from a fixed seed and swayed per limb.
 */
export default function SakuraTree({ className = '', sway = true, imageSrc, ariaLabel }: SakuraTreeProps) {
  const root = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !sway || !root.current) return
    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<SVGGElement>('[data-branch]', root.current)
      groups.forEach((group, i) => {
        const origin = group.dataset.origin ?? '50% 100%'
        gsap.set(group, { svgOrigin: origin })
        gsap.to(group, {
          rotation: i % 2 === 0 ? 1.5 : -1.5,
          duration: 3.6 + (i % 3) * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.16,
        })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, sway])

  return (
    <div
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
    >
      <div className="relative h-full w-full">
        {imageSrc && (
          <img src={imageSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <svg
          ref={root}
          viewBox="0 0 900 620"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="st-bark" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#241b31" />
              <stop offset="0.42" stopColor="#5c3c4b" />
              <stop offset="0.72" stopColor="#3d2a3d" />
              <stop offset="1" stopColor="#1e1b2e" />
            </linearGradient>
            <linearGradient id="st-limb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6b4653" />
              <stop offset="1" stopColor="#39283d" />
            </linearGradient>
            <filter id="st-halo" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          {/* Distant bloom haze */}
          <g filter="url(#st-halo)" opacity="0.38">
            <ellipse cx="180" cy="230" rx="150" ry="105" fill="#f7d9e1" />
            <ellipse cx="700" cy="180" rx="170" ry="110" fill="#f4c2ce" />
            <ellipse cx="420" cy="70" rx="130" ry="80" fill="#ffe4ea" />
          </g>

          {/* Gnarled trunk with bark strokes and knots */}
          <g>
            <path
              d="M 350 620 C 372 545 352 500 378 448 C 402 402 372 356 398 312 C 420 274 404 236 426 196 L 462 200 C 448 240 462 276 444 318 C 424 366 452 408 436 454 C 420 506 448 556 470 620 Z"
              fill="url(#st-bark)"
            />
            <path d="M 386 610 C 400 548 382 496 404 446 C 424 398 400 356 420 310" fill="none" stroke="#8a6270" strokeWidth="2.2" strokeOpacity="0.55" strokeLinecap="round" />
            <path d="M 414 606 C 430 548 412 500 432 452 C 448 410 430 372 446 330" fill="none" stroke="#181324" strokeWidth="3" strokeOpacity="0.45" strokeLinecap="round" />
            <path d="M 364 588 C 380 540 366 502 386 466" fill="none" stroke="#a37b84" strokeWidth="1.4" strokeOpacity="0.4" strokeLinecap="round" />
            <path d="M 448 566 C 458 530 446 506 458 478" fill="none" stroke="#140f1e" strokeWidth="2.4" strokeOpacity="0.4" strokeLinecap="round" />
            <ellipse cx="409" cy="520" rx="10" ry="17" fill="#1d1628" stroke="#8a6270" strokeWidth="1.4" strokeOpacity="0.5" />
            <ellipse cx="441" cy="404" rx="7" ry="12" fill="#1d1628" stroke="#8a6270" strokeWidth="1.2" strokeOpacity="0.45" />
            <path d="M 380 448 C 360 428 342 420 318 416 C 340 432 356 444 378 462 Z" fill="#2b2033" />
          </g>

          {/* Limbs: separate groups for staggered GSAP sway */}
          {LIMBS.map((limb, i) => (
            <g key={limb.origin} data-branch="" data-origin={limb.origin}>
              <path d={limb.d} fill="none" stroke="url(#st-limb)" strokeWidth={i % 2 ? 8 : 10} strokeLinecap="round" />
              <path d={limb.d} fill="none" stroke="#9b707d" strokeWidth="1.6" strokeOpacity="0.5" strokeLinecap="round" />
              {limb.twigs.map((twig) => (
                <path key={twig} d={twig} fill="none" stroke="#4b3244" strokeWidth="3.4" strokeLinecap="round" />
              ))}
            </g>
          ))}

          {/* Deterministic five-petal blossom cloud */}
          <g>
            {BLOSSOMS.map((blossom, i) => (
              <Blossom key={i} {...blossom} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

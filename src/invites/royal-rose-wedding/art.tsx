/**
 * Royal Rose art. Roses are built as SVG strings and turned into image URLs
 * ONCE (module load) — browsers rasterise <img> SVGs a single time, so dozens
 * of gradient-heavy flowers cost almost nothing while they sway and scroll.
 */
import { useId, type CSSProperties } from 'react'
import type { BodhiEvent } from '../bodhi-wedding/bodhiWedding.config'

/* ───────────────────────── Roses (pre-rendered) ───────────────────────── */
type RoseTone = 'blush' | 'wine' | 'ivory'
const TONES: Record<RoseTone, [string, string, string]> = {
  blush: ['#fff0ee', '#f3a9b3', '#b5485d'],
  wine: ['#f0a3b0', '#a8344c', '#4f0f1f'],
  ivory: ['#fffaf2', '#f2dcc4', '#c49a74'],
}

// outer petal: wide with a slightly notched tip; base at the origin, tip at -r
const PETAL = (r: number) =>
  `M0 0 C${-r * 0.78} ${-r * 0.12} ${-r * 0.9} ${-r * 0.84} ${-r * 0.22} ${-r} Q0 ${-r * 0.93} ${r * 0.22} ${-r} C${r * 0.9} ${-r * 0.84} ${r * 0.78} ${-r * 0.12} 0 0Z`
// cupped inner petal: a bowl curling around the centre (light rim, shadowed belly)
const CUP = (r: number) => `M${-r} 0 C${-r} ${r * 0.95} ${r} ${r * 0.95} ${r} 0 C${r * 0.55} ${r * 0.38} ${-r * 0.55} ${r * 0.38} ${-r} 0Z`

function roseGroup(id: string, tone: RoseTone, cx: number, cy: number, s: number) {
  const [light, mid, dark] = TONES[tone]
  const ring = (n: number, r: number, rot: number) =>
    Array.from({ length: n })
      .map((_, i) => `<path d="${PETAL(r)}" fill="url(#${id}p)" stroke="${light}" stroke-opacity=".75" stroke-width="1.4" transform="rotate(${rot + (i * 360) / n})"/>`)
      .join('')
  const cups = [
    [46, -14, 10],
    [38, 28, 6],
    [30, -32, 2],
    [23, 16, -2],
    [16, -8, -5],
    [10, 30, -7],
  ]
    .map(([r, rot, y]) => `<path d="${CUP(r)}" fill="url(#${id}c)" stroke="${light}" stroke-opacity=".85" stroke-width="1.2" transform="translate(0 ${y}) rotate(${rot})"/>`)
    .join('')
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
    <defs>
      <linearGradient id="${id}p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${dark}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${light}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
      <radialGradient id="${id}h"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${dark}" stop-opacity="0"/></radialGradient>
      <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.6" flood-color="${dark}" flood-opacity=".5"/></filter>
    </defs>
    <g filter="url(#${id}s)">${ring(6, 100, 0)}</g>
    <g filter="url(#${id}s)">${ring(6, 82, 30)}</g>
    <g filter="url(#${id}s)">${ring(5, 64, 12)}</g>
    <circle r="40" fill="url(#${id}h)" opacity=".7"/>
    <g filter="url(#${id}s)">${cups}</g>
    <path d="M-5 -6 C-2 -12 6 -10 6 -4 C6 1 0 3 -3 0" fill="none" stroke="${dark}" stroke-width="2.4" stroke-linecap="round"/>
  </g>`
}

const LEAF = (x: number, y: number, rot: number, s: number) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C30 -26 78 -24 104 0 C78 24 30 26 0 0Z" fill="#5f7d45"/><path d="M0 0 C30 -26 78 -24 104 0" fill="#78985a"/><path d="M4 0 L98 0" stroke="#3f5a2d" stroke-width="2" fill="none"/></g>`

const toUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

/** Single rose. */
export const ROSE: Record<RoseTone, string> = {
  blush: toUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220">${roseGroup('a', 'blush', 0, 0, 1)}</svg>`),
  wine: toUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220">${roseGroup('b', 'wine', 0, 0, 1)}</svg>`),
  ivory: toUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-110 -110 220 220">${roseGroup('c', 'ivory', 0, 0, 1)}</svg>`),
}

/** Corner cluster: three roses, a bud and leaves — oriented for the top-left corner. */
export const ROSE_CLUSTER = toUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  ${LEAF(120, 70, 20, 1.1)}${LEAF(70, 150, 75, 1)}${LEAF(170, 150, 35, 0.9)}${LEAF(40, 60, -20, 0.8)}
  ${roseGroup('k1', 'wine', 92, 92, 0.78)}
  ${roseGroup('k2', 'blush', 190, 70, 0.55)}
  ${roseGroup('k3', 'blush', 70, 196, 0.5)}
  ${roseGroup('k4', 'ivory', 168, 168, 0.36)}
</svg>`)

export function RoseImg({ tone = 'blush', className = '', style }: { tone?: RoseTone; className?: string; style?: CSSProperties }) {
  return <img src={ROSE[tone]} alt="" aria-hidden className={`pointer-events-none select-none ${className}`} style={style} draggable={false} />
}

/* ───────────────────────── Gold medallion (Dhamma wheel + lotus) ───────────────────────── */
export function Medallion({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const g = `url(#mg-${id})`
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Gold Dhamma wheel emblem">
      <defs>
        <linearGradient id={`mg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e6b8" />
          <stop offset=".4" stopColor="#c6a15b" />
          <stop offset=".7" stopColor="#f2dfa8" />
          <stop offset="1" stopColor="#8f6c30" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke={g} strokeWidth="2.4" />
      <circle cx="60" cy="60" r="51" fill="none" stroke={g} strokeWidth=".9" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180
        return <circle key={i} cx={60 + 54 * Math.cos(a)} cy={60 + 54 * Math.sin(a)} r=".95" fill={g} />
      })}
      {/* eight-spoked Dhamma wheel — double rim, slender spokes, handles beyond the rim */}
      <g stroke={g} fill="none" strokeLinecap="round">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180
          return <line key={`h${i}`} x1={60 + 21 * Math.cos(a)} y1={50 + 21 * Math.sin(a)} x2={60 + 28 * Math.cos(a)} y2={50 + 28 * Math.sin(a)} strokeWidth="2.2" />
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180
          return <circle key={`k${i}`} cx={60 + 29.5 * Math.cos(a)} cy={50 + 29.5 * Math.sin(a)} r="2.3" fill={g} stroke="none" />
        })}
        <circle cx="60" cy="50" r="21" strokeWidth="2.2" />
        <circle cx="60" cy="50" r="17.5" strokeWidth=".9" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = ((i * 45 + 22.5) * Math.PI) / 180
          return <line key={`s${i}`} x1={60 + 4.5 * Math.cos(a)} y1={50 + 4.5 * Math.sin(a)} x2={60 + 17.5 * Math.cos(a)} y2={50 + 17.5 * Math.sin(a)} strokeWidth="1.3" />
        })}
        <circle cx="60" cy="50" r="4.5" fill={g} stroke="none" />
      </g>
      {/* lotus base */}
      <g fill={g}>
        <path d="M60 96 C55 90 55 84 60 78 C65 84 65 90 60 96Z" />
        <path d="M60 96 C51 94 46 88 45 82 C52 83 57 88 60 96Z" />
        <path d="M60 96 C69 94 74 88 75 82 C68 83 63 88 60 96Z" />
        <path d="M60 96 C47 98 39 94 35 88 C44 87 53 91 60 96Z" opacity=".85" />
        <path d="M60 96 C73 98 81 94 85 88 C76 87 67 91 60 96Z" opacity=".85" />
      </g>
      <path d="M40 100 Q60 104 80 100" stroke={g} strokeWidth="1" fill="none" />
    </svg>
  )
}

/* ───────────────────────── Marigold string ───────────────────────── */
export function MarigoldString({ beads = 9, className = '' }: { beads?: number; className?: string }) {
  return (
    <svg viewBox={`0 0 24 ${beads * 20 + 34}`} className={className} aria-hidden>
      <line x1="12" y1="0" x2="12" y2={beads * 20} stroke="#9a7637" strokeWidth="1" />
      {Array.from({ length: beads }).map((_, i) => {
        const y = 10 + i * 20
        const c = i % 3 === 2 ? '#c34f62' : i % 2 ? '#f2b33d' : '#e88a1c'
        return (
          <g key={i} transform={`translate(12 ${y})`}>
            <circle r="9" fill={c} />
            <circle r="6" fill="none" stroke="rgba(120,50,0,.35)" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle r="2.2" fill="rgba(110,40,0,.55)" />
          </g>
        )
      })}
      {/* little brass bell */}
      <g transform={`translate(12 ${beads * 20 + 6})`}>
        <path d="M-7 14 C-7 4 -4 0 0 0 C4 0 7 4 7 14Z" fill="#c6a15b" />
        <circle cy="16" r="2.2" fill="#9a7637" />
      </g>
    </svg>
  )
}

/* ───────────────────────── Tassel ───────────────────────── */
export function Tassel({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="ts" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a7637" />
          <stop offset=".5" stopColor="#f2dfa8" />
          <stop offset="1" stopColor="#9a7637" />
        </linearGradient>
      </defs>
      <path d="M20 0 C17 12 23 22 20 34" stroke="#c6a15b" strokeWidth="2.2" fill="none" />
      <circle cx="20" cy="40" r="7" fill="url(#ts)" />
      <path d="M13 44 L27 44 L25 52 L15 52Z" fill="url(#ts)" />
      {Array.from({ length: 11 }).map((_, i) => (
        <path key={i} d={`M${14 + i * 1.2} 52 C${13 + i * 1.4} 80 ${12 + i * 1.6} 96 ${10 + i * 2} 112`} stroke={i % 2 ? '#c6a15b' : '#e7cf94'} strokeWidth="1.6" fill="none" />
      ))}
    </svg>
  )
}

/* ───────────────────────── Festivity scenes (blurred backgrounds) ───────────────────────── */
export function Scene({ id, className = '' }: { id: BodhiEvent['id']; className?: string }) {
  if (id === 'haldi')
    return (
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
        <rect width="300" height="400" fill="#fbe39a" />
        <circle cx="150" cy="120" r="110" fill="#ffd166" />
        {Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={(i * 67) % 300} cy={40 + ((i * 113) % 360)} r={16 + (i % 4) * 6} fill={i % 3 ? '#f0a31a' : '#e8781a'} />
        ))}
        <ellipse cx="150" cy="330" rx="90" ry="36" fill="#c7671b" />
        <ellipse cx="150" cy="318" rx="74" ry="24" fill="#f5c518" />
      </svg>
    )
  if (id === 'wedding')
    return (
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
        <rect width="300" height="400" fill="#f6d7cf" />
        <path d="M40 400 V150 C40 70 260 70 260 150 V400" fill="#fff4ec" />
        <path d="M30 120 C90 170 210 170 270 120" stroke="#c34f62" strokeWidth="18" fill="none" />
        <path d="M30 150 C90 200 210 200 270 150" stroke="#f1c6c4" strokeWidth="14" fill="none" />
        <rect x="30" y="110" width="16" height="290" fill="#c6a15b" />
        <rect x="254" y="110" width="16" height="290" fill="#c6a15b" />
        <circle cx="150" cy="300" r="46" fill="#ffd27a" />
        <circle cx="150" cy="300" r="22" fill="#fff2c8" />
        {[60, 110, 190, 240].map((x) => (
          <circle key={x} cx={x} cy="360" r="14" fill="#c34f62" />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="300" height="400" fill="#e7c2c6" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={(i * 83) % 300} cy={30 + ((i * 97) % 360)} r={20 + (i % 3) * 10} fill={i % 2 ? '#c6a15b' : '#6e1f2f'} opacity=".7" />
      ))}
    </svg>
  )
}

/** Small animated icon for each function card. */
export function EventIcon({ id }: { id: BodhiEvent['id'] }) {
  if (id === 'haldi')
    return (
      <svg viewBox="0 0 48 48" className="rr-spin h-11 w-11" style={{ animationDuration: '14s' }} aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="24" cy="10" rx="5" ry="9" fill={i % 2 ? '#f2b33d' : '#e88a1c'} transform={`rotate(${i * 30} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r="7" fill="#b25a0c" />
      </svg>
    )
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
      <circle cx="24" cy="18" r="12" fill="#ffd27a" opacity=".35" className="rr-twinkle" />
      <path d="M24 6 C29 14 29 20 24 26 C19 20 19 14 24 6Z" fill="#ffc34d" className="bodhi-flame" />
      <path d="M8 30 C11 40 18 44 24 44 C30 44 37 40 40 30 C32 33 28 33 24 33 C20 33 16 33 8 30Z" fill="#9a4a1c" />
      <path d="M8 30 C16 33 20 33 24 33 C28 33 32 33 40 30" stroke="#c6a15b" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

/* ───────────────────────── Illustrated map ───────────────────────── */
export function MapArt({ label, className = '' }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} role="img" aria-label={`Illustrated map to ${label}`}>
      <rect width="320" height="220" fill="#f6ecdc" />
      {/* river */}
      <path d="M-10 160 C60 130 110 190 180 160 C240 134 280 170 330 150" stroke="#b9d7e0" strokeWidth="16" fill="none" />
      {/* parks */}
      <ellipse cx="60" cy="60" rx="40" ry="26" fill="#d6e5c3" />
      <ellipse cx="260" cy="190" rx="44" ry="20" fill="#d6e5c3" />
      {/* street grid */}
      <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round">
        <path d="M0 100 H320" />
        <path d="M140 0 V220" />
        <path d="M30 0 L120 220" />
        <path d="M200 0 C210 80 230 140 300 220" />
      </g>
      <g stroke="#e8d9bf" strokeWidth="2">
        <path d="M0 100 H320" />
        <path d="M140 0 V220" />
      </g>
      {/* trees */}
      {[
        [40, 52],
        [70, 66],
        [52, 74],
        [250, 186],
        [276, 194],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="#9cb87e" />
      ))}
      {/* animated route */}
      <path d="M36 200 C60 150 100 120 140 100 C176 82 200 72 236 58" stroke="#6e1f2f" strokeWidth="3.5" strokeDasharray="7 7" fill="none" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" from="56" to="0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <circle cx="36" cy="200" r="6" fill="#c6a15b" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

/** A small five-petal sakura blossom, usable in HTML or inside an SVG. */

export function BlossomShape({ x, y, scale = 1, color = 'currentColor' }: { x: number; y: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="0" cy="-6.5" rx="4.6" ry="6.8" transform={`rotate(${angle})`} />
      ))}
      <circle r="2.8" fill="#c6a46a" />
    </g>
  )
}

export default function Blossom({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <BlossomShape x={12} y={12} scale={0.95} />
    </svg>
  )
}

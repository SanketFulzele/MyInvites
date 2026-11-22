import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react'
import './SpotlightCard.css'

type SpotlightStyle = CSSProperties & {
  '--spotlight-x': string
  '--spotlight-y': string
  '--spotlight-color': string
}

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string
}

export default function SpotlightCard({
  className = '',
  spotlightColor = 'rgba(181, 83, 47, 0.14)',
  onPointerMove,
  style,
  ...props
}: SpotlightCardProps) {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)
    if (event.pointerType !== 'mouse') return

    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div
      {...props}
      onPointerMove={handlePointerMove}
      className={`spotlight-card ${className}`.trim()}
      style={
        {
          ...style,
          '--spotlight-x': '50%',
          '--spotlight-y': '50%',
          '--spotlight-color': spotlightColor,
        } as SpotlightStyle
      }
    />
  )
}

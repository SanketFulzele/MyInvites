import { useEffect, useRef } from 'react'

/** A scroll-progress bar drawn as a growing sakura branch across the top. */
export default function ScrollBranch() {
  const fill = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      fill.current?.style.setProperty('transform', `scaleX(${progress})`)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]" aria-hidden="true">
      <div className="h-full w-full bg-sumi/5" />
      <div ref={fill} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-blossom via-vermilion to-gold-leaf" />
    </div>
  )
}

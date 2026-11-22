import { useCallback, useEffect, useRef, useState } from 'react'
import { SakuraScore } from '../../../lib/sakuraScore'

/** Uses a licensed MP3 when configured, otherwise the original generated score. */
export function useMusic(src?: string) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const score = useRef<SakuraScore | null>(null)

  useEffect(
    () => () => {
      audio.current?.pause()
      score.current?.stop()
    },
    [],
  )

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && playing) {
        audio.current?.pause()
        score.current?.stop()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playing])

  const play = useCallback(async () => {
    if (src) {
      try {
        if (!audio.current) {
          audio.current = new Audio(src)
          audio.current.loop = true
          audio.current.volume = 0.5
          audio.current.preload = 'auto'
        }
        await audio.current.play()
        setPlaying(true)
        return
      } catch {
        // Licensed file missing or blocked — fall back so the invite is never silent.
        audio.current?.pause()
        audio.current = null
      }
    }

    try {
      score.current ??= new SakuraScore()
      await score.current.start()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [src])

  const pause = useCallback(() => {
    audio.current?.pause()
    score.current?.stop()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => (playing ? pause() : void play()), [playing, pause, play])

  return { playing, play, pause, toggle }
}

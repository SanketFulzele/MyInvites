/**
 * A tiny generated ambient score (Web Audio API) so the invitation has
 * royalty-free background music without shipping an audio file.
 * Warm pad chords + a sparse bell melody, fed through a soft echo.
 */

type Ctx = AudioContext

const NOTE = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// D major-ish romantic progression: Dmaj7 – Bm7 – Gmaj7 – A6
const CHORDS = [
  [50, 57, 61, 66],
  [47, 54, 57, 62],
  [43, 50, 54, 59],
  [45, 52, 57, 61],
]
const MELODY = [74, 73, 69, 71, 74, 76, 73, 69, 66, 69, 71, 73]

export class AmbientScore {
  private ctx: Ctx | null = null
  private master: GainNode | null = null
  private timer: number | null = null
  private step = 0
  private bar = 0

  get running() {
    return this.timer !== null
  }

  async start() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AC()
      const ctx = this.ctx
      this.master = ctx.createGain()
      this.master.gain.value = 0

      // soft echo
      const delay = ctx.createDelay(1.5)
      delay.delayTime.value = 0.42
      const fb = ctx.createGain()
      fb.gain.value = 0.32
      const wet = ctx.createGain()
      wet.gain.value = 0.35
      delay.connect(fb).connect(delay)
      delay.connect(wet).connect(ctx.destination)
      this.master.connect(ctx.destination)
      this.master.connect(delay)
    }
    await this.ctx.resume()
    const now = this.ctx.currentTime
    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setValueAtTime(this.master!.gain.value, now)
    this.master!.gain.linearRampToValueAtTime(0.55, now + 2.5)

    if (this.timer === null) {
      this.tick()
      this.timer = window.setInterval(() => this.tick(), 750)
    }
  }

  stop() {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.8)
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    window.setTimeout(() => {
      if (this.timer === null) void this.ctx?.suspend()
    }, 900)
  }

  private tick() {
    const ctx = this.ctx!
    const t = ctx.currentTime + 0.05
    // every 8 steps (6s) a new pad chord
    if (this.step % 8 === 0) {
      const chord = CHORDS[this.bar % CHORDS.length]
      chord.forEach((m) => this.pad(NOTE(m), t, 6.6))
      this.bar++
    }
    // sparse bell melody
    if (this.step % 2 === 0 && Math.random() > 0.25) {
      const m = MELODY[(this.step / 2) % MELODY.length]
      this.bell(NOTE(m), t)
    }
    this.step++
  }

  private pad(freq: number, t: number, dur: number) {
    const ctx = this.ctx!
    const g = ctx.createGain()
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 900
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.045, t + 2)
    g.gain.linearRampToValueAtTime(0.03, t + dur - 1.5)
    g.gain.linearRampToValueAtTime(0, t + dur)
    ;[-6, 6].forEach((detune) => {
      const o = ctx.createOscillator()
      o.type = 'triangle'
      o.frequency.value = freq
      o.detune.value = detune
      o.connect(lp)
      o.start(t)
      o.stop(t + dur + 0.1)
    })
    lp.connect(g).connect(this.master!)
  }

  private bell(freq: number, t: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o2.type = 'sine'
    o.frequency.value = freq
    o2.frequency.value = freq * 2.01
    const g2 = ctx.createGain()
    g2.gain.value = 0.25
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.06, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
    o.connect(g)
    o2.connect(g2).connect(g)
    g.connect(this.master!)
    o.start(t)
    o2.start(t)
    o.stop(t + 2.5)
    o2.stop(t + 2.5)
  }
}

/**
 * One-shot "suit power-up" sound: a filtered noise sweep, a rising tone and
 * two mechanical clicks. Must be called from a user gesture.
 */
export function playPowerUp() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    const t = ctx.currentTime + 0.02
    const out = ctx.createGain()
    out.gain.value = 0.5
    out.connect(ctx.destination)

    // noise sweep
    const len = ctx.sampleRate * 1.4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 6
    bp.frequency.setValueAtTime(300, t)
    bp.frequency.exponentialRampToValueAtTime(4200, t + 1.1)
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0, t)
    ng.gain.linearRampToValueAtTime(0.22, t + 0.5)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.35)
    noise.connect(bp).connect(ng).connect(out)
    noise.start(t)

    // rising tone
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(110, t)
    o.frequency.exponentialRampToValueAtTime(880, t + 1)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0, t)
    og.gain.linearRampToValueAtTime(0.12, t + 0.6)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 1.3)
    o.connect(og).connect(out)
    o.start(t)
    o.stop(t + 1.4)

    // locking clicks
    ;[0.05, 0.95].forEach((at) => {
      const c = ctx.createOscillator()
      c.type = 'square'
      c.frequency.value = 1800
      const cg = ctx.createGain()
      cg.gain.setValueAtTime(0.08, t + at)
      cg.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.05)
      c.connect(cg).connect(out)
      c.start(t + at)
      c.stop(t + at + 0.06)
    })
    window.setTimeout(() => void ctx.close(), 2000)
  } catch {
    /* audio unavailable */
  }
}

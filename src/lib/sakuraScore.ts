/**
 * An original, royalty-free Web Audio score for the Sakura invitation.
 * Piano-like plucks, a warm string pad and a sparse breathy flute line —
 * the bittersweet swell of a modern romantic anime film, without using
 * any copyrighted soundtrack.
 */

type Ctx = AudioContext

const NOTE = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// Dmaj7 – Bm7 – Gmaj7 – A6
const CHORDS = [
  [50, 57, 61, 64],
  [47, 54, 57, 62],
  [43, 50, 54, 59],
  [45, 52, 57, 61],
]
const MELODY = [74, 76, 78, 81, 78, 76, 74, 73, 71, 73, 74, 69, 71, 73, 76, 78]
const FLUTE = [86, 88, 86, 83, 81, 83, 86, 78]

export class SakuraScore {
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
      const ctx = new AC()
      this.ctx = ctx

      this.master = ctx.createGain()
      this.master.gain.value = 0

      const delay = ctx.createDelay(1.5)
      delay.delayTime.value = 0.46
      const feedback = ctx.createGain()
      feedback.gain.value = 0.26
      const wet = ctx.createGain()
      wet.gain.value = 0.3
      delay.connect(feedback).connect(delay)
      delay.connect(wet).connect(ctx.destination)
      this.master.connect(ctx.destination)
      this.master.connect(delay)
    }

    await this.ctx.resume()
    const now = this.ctx.currentTime
    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setValueAtTime(this.master!.gain.value, now)
    this.master!.gain.linearRampToValueAtTime(0.5, now + 2.6)

    if (this.timer === null) {
      this.tick()
      this.timer = window.setInterval(() => this.tick(), 620)
    }
  }

  stop() {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.9)
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    window.setTimeout(() => {
      if (this.timer === null) void this.ctx?.suspend()
    }, 1000)
  }

  private tick() {
    if (!this.ctx) return
    const t = this.ctx.currentTime + 0.04

    if (this.step % 8 === 0) {
      const chord = CHORDS[this.bar % CHORDS.length]
      chord.forEach((m) => this.pad(NOTE(m), t, 5.4))
      this.bar++
    }

    if (this.step % 2 === 0) {
      const m = MELODY[(this.step / 2) % MELODY.length]
      this.pluck(NOTE(m), t)
    }

    if (this.step > 16 && this.step % 4 === 0) {
      const m = FLUTE[(this.step / 4 - 4) % FLUTE.length]
      this.flute(NOTE(m), t, 2.7)
    }

    this.step++
  }

  private pad(freq: number, t: number, dur: number) {
    const ctx = this.ctx!
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 780
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.038, t + 1.9)
    gain.gain.linearRampToValueAtTime(0.028, t + dur - 1.6)
    gain.gain.linearRampToValueAtTime(0, t + dur)
    ;[-7, 7].forEach((detune) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq
      osc.detune.value = detune
      osc.connect(filter)
      osc.start(t)
      osc.stop(t + dur + 0.1)
    })
    filter.connect(gain).connect(this.master!)
  }

  private pluck(freq: number, t: number) {
    const ctx = this.ctx!
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.075, t + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.9)
    const body = ctx.createOscillator()
    body.type = 'triangle'
    body.frequency.value = freq
    const shine = ctx.createOscillator()
    shine.type = 'sine'
    shine.frequency.value = freq * 2
    const shineGain = ctx.createGain()
    shineGain.gain.value = 0.22
    body.connect(gain)
    shine.connect(shineGain).connect(gain)
    gain.connect(this.master!)
    body.start(t)
    shine.start(t)
    body.stop(t + 2)
    shine.stop(t + 2)
  }

  private flute(freq: number, t: number, dur: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const vibrato = ctx.createOscillator()
    vibrato.type = 'sine'
    vibrato.frequency.value = 5
    const vibratoGain = ctx.createGain()
    vibratoGain.gain.value = 5
    vibrato.connect(vibratoGain).connect(osc.detune)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.035, t + 0.35)
    gain.gain.setValueAtTime(0.035, t + dur - 0.6)
    gain.gain.linearRampToValueAtTime(0, t + dur)
    osc.connect(gain).connect(this.master!)
    osc.start(t)
    vibrato.start(t)
    osc.stop(t + dur + 0.1)
    vibrato.stop(t + dur + 0.1)
  }
}

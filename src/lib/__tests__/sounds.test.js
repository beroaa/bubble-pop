import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sfx, setMuted, _internal } from '../sounds.js'

// Recording fake AudioContext: chainable spies that count node creation.
function installFakeAudio() {
  const created = { oscillators: 0, bufferSources: 0, gains: 0, filters: 0 }
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() })
  const node = (extra = {}) => ({ connect: vi.fn(function (t) { return t }), disconnect: vi.fn(), ...extra })
  class FakeCtx {
    constructor() {
      this.currentTime = 0
      this.state = 'running'
      this.sampleRate = 48000
      this.destination = node()
    }
    resume() { this.state = 'running'; return Promise.resolve() }
    createBuffer() { return { getChannelData: () => new Float32Array(48000) } }
    createOscillator() {
      created.oscillators++
      return node({ type: 'sine', frequency: param(), detune: { value: 0 }, start: vi.fn(), stop: vi.fn(), set onended(f) { setTimeout(f, 0) } })
    }
    createBufferSource() {
      created.bufferSources++
      return node({ buffer: null, playbackRate: { value: 1 }, start: vi.fn(), stop: vi.fn(), set onended(f) { setTimeout(f, 0) } })
    }
    createGain() { created.gains++; return node({ gain: param() }) }
    createBiquadFilter() { created.filters++; return node({ type: '', frequency: param(), Q: { value: 0 } }) }
    createDynamicsCompressor() {
      return node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() })
    }
    decodeAudioData() { return Promise.resolve({}) }
  }
  globalThis.AudioContext = FakeCtx
  globalThis.performance = globalThis.performance ?? { now: () => Date.now() }
  globalThis.fetch = vi.fn(() => Promise.reject(new Error('no network in tests')))
  globalThis.window = { addEventListener: vi.fn(), removeEventListener: vi.fn() }
  return created
}

beforeEach(() => {
  _internal.resetForTest()
  setMuted(false)
})

describe('sound engine', () => {
  it('clientSecured creates 3 oscillators + 1 noise burst', () => {
    const created = installFakeAudio()
    sfx.clientSecured()
    expect(created.oscillators).toBe(3)
    expect(created.bufferSources).toBe(1)
  })

  it('throttle: two uiClicks 0ms apart schedule one voice set', () => {
    const created = installFakeAudio()
    sfx.uiClick()
    const after = created.oscillators
    sfx.uiClick()
    expect(created.oscillators).toBe(after)
  })

  it('mute short-circuits before node creation (zero CPU)', () => {
    const created = installFakeAudio()
    setMuted(true)
    sfx.rankUp()
    expect(created.oscillators).toBe(0)
    expect(created.gains).toBe(0)
  })

  it('big cues rate-limit to once per 3s', () => {
    const created = installFakeAudio()
    sfx.rankUp()
    const n = created.oscillators
    expect(n).toBeGreaterThan(10) // 6 brass calls x 3 voices
    sfx.rankUp()
    expect(created.oscillators).toBe(n)
  })

  it('cues never throw without an AudioContext', () => {
    delete globalThis.AudioContext
    expect(() => sfx.denied()).not.toThrow()
    expect(() => sfx.menuDelivered()).not.toThrow()
  })
})

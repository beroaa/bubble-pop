// ClientOS sound engine — every cue synthesized with Web Audio at call time.
// Graph: [cue voices] → cueGain(trim) → master → limiter → destination.
// The only audio file in the app is public/pop.wav (bubble tasks), routed
// through the same master so mute/volume governs it too.
// All cues are original synthesis — no sampled or re-created game audio.

let ctx = null, master = null, limiter = null, popBuffer = null, noiseBuffer = null
const state = { muted: false, volume: 0.85 }
const lastFired = {}
let activeVoices = 0

const THROTTLE_MS = { uiClick: 30, xpTick: 30, denied: 150, clientSecured: 120, default: 250 }
const BIG_CUE_MS = 3000 // rankUp/rankDown/mvpEarned rate-limit
const VOICE_CAP = 24

function makeNoiseBuffer(c) {
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return b
}

function getCtx() {
  if (ctx) return ctx
  ctx = new AudioContext({ latencyHint: 'interactive' })
  limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -12
  limiter.knee.value = 30
  limiter.ratio.value = 12
  limiter.attack.value = 0.003
  limiter.release.value = 0.25
  master = ctx.createGain()
  master.gain.value = state.muted ? 0 : state.volume
  master.connect(limiter).connect(ctx.destination)
  noiseBuffer = makeNoiseBuffer(ctx)
  loadPopBuffer()
  return ctx
}

// Browsers block audio until a user gesture; the login tap unlocks the context.
let armed = false
export function armAudio() {
  if (armed) return
  armed = true
  const unlock = () => {
    const c = getCtx()
    if (c.state === 'suspended') c.resume()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('keydown', unlock)
}

// Mute short-circuits BEFORE node creation: zero CPU, not just zero gain.
function ensure(cueName, big = false) {
  if (state.muted) return false
  const now = performance.now()
  const min = big ? BIG_CUE_MS : (THROTTLE_MS[cueName] ?? THROTTLE_MS.default)
  if (lastFired[cueName] && now - lastFired[cueName] < min) return false
  if (activeVoices >= VOICE_CAP && cueName !== 'rankUp') return false
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
  lastFired[cueName] = now
  return true
}

export function setMuted(m) {
  state.muted = m
  if (master) master.gain.setTargetAtTime(m ? 0 : state.volume, ctx.currentTime, 0.01)
}
export function toggleMuted() { setMuted(!state.muted); return state.muted }
export function isMuted() { return state.muted }
export function setVolume(v) {
  state.volume = Math.min(1, Math.max(0, v))
  if (master && !state.muted) master.gain.setTargetAtTime(state.volume, ctx.currentTime, 0.01)
}

// ---- primitives ----

function trackVoice(node) {
  activeVoices++
  node.onended = () => { activeVoices = Math.max(0, activeVoices - 1) }
}

function tone(dest, { type = 'sine', freq, freqEnd, glide = 0.1, detune = 0, t = 0, at = 0.002, dec = 0.15, peak = 0.5, filter, humanize = true }) {
  const c = ctx, t0 = c.currentTime + t
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  o.detune.value = detune + (humanize ? (Math.random() * 2 - 1) * 8 : 0)
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + glide)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + at)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dec)
  let head = o
  if (filter) {
    const f = c.createBiquadFilter()
    f.type = filter.type
    f.frequency.setValueAtTime(filter.freq, t0)
    if (filter.freqEnd) f.frequency.exponentialRampToValueAtTime(filter.freqEnd, t0 + (filter.glide ?? 0.2))
    if (filter.q) f.Q.value = filter.q
    o.connect(f); head = f
  }
  head.connect(g).connect(dest)
  o.start(t0)
  o.stop(t0 + at + dec + 0.05)
  trackVoice(o)
}

function noise(dest, { t = 0, at = 0.001, dec = 0.08, peak = 0.3, filter }) {
  const c = ctx, t0 = c.currentTime + t
  const s = c.createBufferSource()
  s.buffer = noiseBuffer
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + at)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dec)
  let head = s
  if (filter) {
    const f = c.createBiquadFilter()
    f.type = filter.type
    f.frequency.setValueAtTime(filter.freq, t0)
    if (filter.freqEnd) f.frequency.exponentialRampToValueAtTime(filter.freqEnd, t0 + (filter.glide ?? 0.15))
    if (filter.q) f.Q.value = filter.q
    s.connect(f); head = f
  }
  head.connect(g).connect(dest)
  s.start(t0)
  s.stop(t0 + at + dec + 0.05)
  trackVoice(s)
}

function bus(trim) {
  const g = ctx.createGain()
  g.gain.value = trim
  g.connect(master)
  return g
}

// ---- cues (all fire-and-forget, never throw) ----

function uiClick() {
  try {
    if (!ensure('uiClick')) return
    const d = bus(0.5)
    tone(d, { type: 'square', freq: 2200, at: 0.001, dec: 0.055, peak: 0.6, filter: { type: 'bandpass', freq: 2500, q: 6 } })
    tone(d, { type: 'sine', freq: 620, at: 0.001, dec: 0.045, peak: 0.25 })
  } catch { /* audio must never break the app */ }
}

function loginSuccess() {
  try {
    if (!ensure('loginSuccess')) return
    const d = bus(0.6)
    tone(d, { type: 'square', freq: 1046.5, t: 0, at: 0.001, dec: 0.06, peak: 0.5, filter: { type: 'bandpass', freq: 1800, q: 8 } })
    tone(d, { type: 'square', freq: 1046.5, t: 0.12, at: 0.001, dec: 0.06, peak: 0.5, filter: { type: 'bandpass', freq: 1800, q: 8 } })
    tone(d, { type: 'sine', freq: 587.33, t: 0.24, at: 0.01, dec: 0.28, peak: 0.14 })
    tone(d, { type: 'sine', freq: 739.99, t: 0.24, at: 0.01, dec: 0.28, peak: 0.12 })
  } catch { /* ignore */ }
}

// Level-up toast reuses the confirm blip at a lower trim (no new recipe in v1).
function levelUp() {
  try {
    if (!ensure('levelUp')) return
    const d = bus(0.4)
    tone(d, { type: 'square', freq: 1046.5, t: 0, at: 0.001, dec: 0.06, peak: 0.5, filter: { type: 'bandpass', freq: 1800, q: 8 } })
    tone(d, { type: 'sine', freq: 739.99, t: 0.1, at: 0.01, dec: 0.28, peak: 0.12 })
  } catch { /* ignore */ }
}

// Slot-machine ladder: climbs one semitone per consecutive tick.
let lastTickAt = 0, tickStep = 0
function xpTick() {
  try {
    if (!ensure('xpTick')) return
    const now = performance.now()
    tickStep = now - lastTickAt > 400 ? 0 : Math.min(tickStep + 1, 12)
    lastTickAt = now
    const freq = 1046.5 * 2 ** (tickStep / 12)
    const d = bus(0.35)
    tone(d, { type: 'triangle', freq, at: 0.002, dec: 0.07, peak: 0.3, filter: { type: 'highpass', freq: 600 } })
  } catch { /* ignore */ }
}

// THE kill-confirm: bright double-blip + sub thump + noise crack. Must feel earned.
function clientSecured() {
  try {
    if (!ensure('clientSecured')) return
    const d = bus(0.8)
    tone(d, { type: 'square', freq: 1567.98, t: 0, at: 0.001, dec: 0.07, peak: 0.5, filter: { type: 'bandpass', freq: 2000, q: 5 } })
    tone(d, { type: 'square', freq: 1975.53, t: 0.06, at: 0.001, dec: 0.05, peak: 0.25, filter: { type: 'bandpass', freq: 2400, q: 5 } })
    tone(d, { type: 'sine', freq: 180, freqEnd: 50, glide: 0.12, t: 0, at: 0.002, dec: 0.16, peak: 0.9 })
    noise(d, { t: 0, at: 0.001, dec: 0.05, peak: 0.4, filter: { type: 'highpass', freq: 3500 } })
  } catch { /* ignore */ }
}

// Brass-feel D-major arpeggio into a held chord: the ceremony fanfare.
// Fire ~270ms before the badge stamp so the chord lands on impact
// (RankCeremony fires it at t=350ms; chord at 620ms = stamp frame).
function rankUp() {
  try {
    if (!ensure('rankUp', true)) return
    const d = bus(0.9)
    const c = getCtx()
    const sweep = c.createBiquadFilter()
    sweep.type = 'lowpass'
    sweep.frequency.setValueAtTime(800, c.currentTime)
    sweep.frequency.exponentialRampToValueAtTime(3500, c.currentTime + 0.5)
    sweep.connect(d)
    const brass = (note, t, dur, peak) => {
      tone(sweep, { type: 'sawtooth', freq: note, detune: -6, t, at: 0.015, dec: dur, peak, humanize: false })
      tone(sweep, { type: 'sawtooth', freq: note, detune: 6, t, at: 0.015, dec: dur, peak, humanize: false })
      tone(sweep, { type: 'square', freq: note / 2, t, at: 0.015, dec: dur, peak: peak * 0.35, humanize: false })
    }
    brass(293.66, 0.0, 0.12, 0.3)
    brass(369.99, 0.09, 0.12, 0.3)
    brass(440.0, 0.18, 0.12, 0.3)
    brass(587.33, 0.27, 0.6, 0.42)
    brass(293.66, 0.27, 0.5, 0.18)
    brass(440.0, 0.27, 0.5, 0.18)
    noise(d, { t: 0.27, at: 0.002, dec: 0.3, peak: 0.18, filter: { type: 'highpass', freq: 6000 } })
    tone(d, { type: 'sine', freq: 1174.66, t: 0.55, at: 0.05, dec: 0.4, peak: 0.08 })
  } catch { /* ignore */ }
}

// Sombre two-note D-minor descent: stings for half a second, then gets out of the way.
function rankDown() {
  try {
    if (!ensure('rankDown', true)) return
    const d = bus(0.7)
    tone(d, { type: 'triangle', freq: 220.0, t: 0, at: 0.02, dec: 0.3, peak: 0.3, filter: { type: 'lowpass', freq: 1200 } })
    tone(d, { type: 'triangle', freq: 174.61, t: 0.28, at: 0.02, dec: 0.5, peak: 0.3, filter: { type: 'lowpass', freq: 1200 } })
    tone(d, { type: 'sine', freq: 73.42, t: 0, at: 0.05, dec: 0.7, peak: 0.2 })
  } catch { /* ignore */ }
}

// Bright, cocky leaderboard sting.
function mvpEarned() {
  try {
    if (!ensure('mvpEarned', true)) return
    const d = bus(0.75)
    tone(d, { type: 'square', freq: 880.0, t: 0, at: 0.001, dec: 0.08, peak: 0.35, filter: { type: 'bandpass', freq: 1600, q: 4 } })
    tone(d, { type: 'square', freq: 1108.73, t: 0.07, at: 0.001, dec: 0.08, peak: 0.35, filter: { type: 'bandpass', freq: 2000, q: 4 } })
    tone(d, { type: 'square', freq: 1318.51, t: 0.14, at: 0.001, dec: 0.1, peak: 0.35, filter: { type: 'bandpass', freq: 2400, q: 4 } })
    tone(d, { type: 'sine', freq: 1760.0, t: 0.14, at: 0.01, dec: 0.35, peak: 0.15 })
  } catch { /* ignore */ }
}

// Low dissonant double-buzz: reads as "no" without being an alarm.
function denied() {
  try {
    if (!ensure('denied')) return
    const d = bus(0.5)
    const burst = (t) => {
      tone(d, { type: 'square', freq: 110.0, t, at: 0.003, dec: 0.08, peak: 0.3, filter: { type: 'lowpass', freq: 500 } })
      tone(d, { type: 'square', freq: 116.5, t, at: 0.003, dec: 0.08, peak: 0.3, filter: { type: 'lowpass', freq: 500 } })
    }
    burst(0); burst(0.13)
  } catch { /* ignore */ }
}

// Gear-hits-the-table clunk: sub thump + "chk" + metallic tick, then a seat-click.
function quotaAssigned() {
  try {
    if (!ensure('quotaAssigned')) return
    const d = bus(0.7)
    tone(d, { type: 'sine', freq: 120, freqEnd: 60, glide: 0.1, t: 0, at: 0.002, dec: 0.18, peak: 0.8 })
    noise(d, { t: 0, at: 0.001, dec: 0.07, peak: 0.5, filter: { type: 'bandpass', freq: 900, q: 1.2 } })
    tone(d, { type: 'triangle', freq: 1975.53, t: 0.03, at: 0.001, dec: 0.09, peak: 0.12 })
    tone(d, { type: 'sine', freq: 100, freqEnd: 55, glide: 0.08, t: 0.16, at: 0.002, dec: 0.12, peak: 0.4 })
    noise(d, { t: 0.16, at: 0.001, dec: 0.05, peak: 0.25, filter: { type: 'bandpass', freq: 900, q: 1.2 } })
  } catch { /* ignore */ }
}

// Whoosh + service-bell ding: the menu flies out the door.
function menuDelivered() {
  try {
    if (!ensure('menuDelivered')) return
    const d = bus(0.65)
    noise(d, { t: 0, at: 0.04, dec: 0.15, peak: 0.3, filter: { type: 'bandpass', freq: 400, freqEnd: 2600, glide: 0.18, q: 0.8 } })
    tone(d, { type: 'sine', freq: 1318.51, t: 0.16, at: 0.002, dec: 0.45, peak: 0.35 })
    tone(d, { type: 'sine', freq: 2637.02, t: 0.16, at: 0.002, dec: 0.25, peak: 0.08 })
  } catch { /* ignore */ }
}

// Bubble task pop: the project's own pop.wav through the master graph,
// ±6% pitch humanization for rapid popping.
async function loadPopBuffer() {
  try {
    const r = await fetch('pop.wav')
    popBuffer = await ctx.decodeAudioData(await r.arrayBuffer())
  } catch {
    popBuffer = null
  }
}

function pop() {
  try {
    if (!ensure('pop')) return
    if (!popBuffer) {
      const a = new Audio('pop.wav')
      a.volume = state.volume
      a.play().catch(() => {})
      return
    }
    const s = ctx.createBufferSource()
    s.buffer = popBuffer
    s.playbackRate.value = 0.94 + Math.random() * 0.12
    const g = bus(0.9)
    s.connect(g)
    s.start()
    trackVoice(s)
  } catch { /* ignore */ }
}

export const sfx = {
  uiClick, loginSuccess, levelUp, xpTick, clientSecured, rankUp, rankDown,
  mvpEarned, denied, quotaAssigned, menuDelivered, pop,
}

// Batch rule: when several events land at once, play only the highest-priority cue.
export const CUE_PRIORITY = ['rankUp', 'rankDown', 'mvpEarned', 'clientSecured', 'menuDelivered', 'quotaAssigned', 'xpTick']
export const EVENT_CUES = {
  rank_up: 'rankUp',
  rank_down: 'rankDown',
  client_secured: 'clientSecured',
  client_live: 'menuDelivered',
  quota_set: 'quotaAssigned',
  task_popped: null, // pop() is fired by the bubble itself
  lead_added: 'xpTick',
  commission_paid: 'mvpEarned',
  agent_joined: 'quotaAssigned',
}

export const _internal = { state, THROTTLE_MS, get activeVoices() { return activeVoices }, resetForTest() { ctx = null; master = null; limiter = null; noiseBuffer = null; popBuffer = null; activeVoices = 0; for (const k of Object.keys(lastFired)) delete lastFired[k]; armed = false } }

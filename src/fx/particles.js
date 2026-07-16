// Singleton canvas particle engine: confetti bursts + additive sparks.
// One fixed canvas, rAF runs only while particles are alive, hard cap 300.
import { Z } from '../motion/tokens.js'

let canvas = null, g = null, particles = [], rafId = null

function ensureCanvas() {
  if (canvas) return
  canvas = document.createElement('canvas')
  canvas.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${Z.fxCanvas}`
  document.body.appendChild(canvas)
  g = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
}

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.dataset.dpr = dpr
}

const rand = (a, b) => a + Math.random() * (b - a)

function spawn(opts, spark) {
  ensureCanvas()
  const {
    x, y, count = 80, palette = ['#E3B23C', '#F6D77E', '#FFFFFF'],
    angle = -Math.PI / 2, spread = Math.PI * 2,
    power = spark ? [600, 1100] : [420, 900],
    gravity = spark ? 400 : 1400, drag = 0.985,
    sizePx = spark ? [2, 3] : [4, 9], ttl = spark ? [300, 500] : [900, 1600],
  } = opts
  for (let i = 0; i < count; i++) {
    if (particles.length >= 300) particles.shift()
    const a = angle + rand(-spread / 2, spread / 2)
    const v = rand(power[0], power[1])
    particles.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      size: rand(sizePx[0], sizePx[1]),
      color: palette[Math.floor(Math.random() * palette.length)],
      ttl: rand(ttl[0], ttl[1]), age: 0,
      rect: !spark && Math.random() < 0.6,
      rot: rand(0, Math.PI * 2), rotV: rand(-Math.PI * 4, Math.PI * 4),
      seed: Math.random() * 10, gravity, drag, spark,
    })
  }
  if (!rafId) { last = performance.now(); rafId = requestAnimationFrame(frame) }
}

export function burst(opts) { spawn(opts, false) }
export function spark(opts) { spawn(opts, true) }

let last = 0
function frame(now) {
  const dt = Math.min(32, now - last) / 1000
  last = now
  const dpr = Number(canvas.dataset.dpr) || 1
  g.clearRect(0, 0, canvas.width, canvas.height)
  particles = particles.filter((p) => (p.age += dt * 1000) < p.ttl)
  for (const p of particles) {
    p.vy += p.gravity * dt
    p.vx *= p.drag
    p.vy *= p.drag
    p.x += p.vx * dt
    p.y += p.vy * dt
    if (p.rect) {
      p.rot += p.rotV * dt
      p.x += Math.sin((p.age / 1000) * 6 * Math.PI + p.seed) * 12 * dt
    }
    const lifeLeft = 1 - p.age / p.ttl
    g.globalAlpha = lifeLeft > 0.3 ? 1 : lifeLeft / 0.3
    g.globalCompositeOperation = p.spark ? 'lighter' : 'source-over'
    g.fillStyle = p.color
    g.save()
    g.translate(p.x * dpr, p.y * dpr)
    if (p.rect) {
      g.rotate(p.rot)
      g.fillRect((-p.size / 2) * dpr, (-p.size * 0.3) * dpr, p.size * dpr, p.size * 0.6 * dpr)
    } else {
      g.beginPath()
      g.arc(0, 0, (p.size / 2) * dpr, 0, Math.PI * 2)
      g.fill()
    }
    g.restore()
  }
  g.globalAlpha = 1
  g.globalCompositeOperation = 'source-over'
  if (particles.length) rafId = requestAnimationFrame(frame)
  else { rafId = null; g.clearRect(0, 0, canvas.width, canvas.height) }
}

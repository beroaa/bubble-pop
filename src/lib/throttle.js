// Client-side login rate limiting: a speed bump for a curious human at the
// keyboard, nothing more (DevTools can clear it — see docs/SECURITY.md).
import { THROTTLE } from '../engine/constants.js'

export const THROTTLE_KEY = 'clientos.v1.authThrottle'

function load() {
  try {
    const raw = localStorage.getItem(THROTTLE_KEY)
    const f = raw ? JSON.parse(raw) : null
    if (f && f.v === 1 && f.byUsername) return f
  } catch { /* fallthrough */ }
  return { v: 1, byUsername: {} }
}

function save(f) {
  try { localStorage.setItem(THROTTLE_KEY, JSON.stringify(f)) } catch { /* ignore */ }
}

export function checkThrottle(username, now = Date.now()) {
  const f = load()
  const e = f.byUsername[username]
  if (!e) return { locked: false, remainingMs: 0, attemptsLeft: THROTTLE.maxAttempts }
  if (e.lockedUntil > now) return { locked: true, remainingMs: e.lockedUntil - now, attemptsLeft: 0 }
  if (now - (e.lastFailedAt ?? e.firstFailedAt) > THROTTLE.resetAfterMs) {
    return { locked: false, remainingMs: 0, attemptsLeft: THROTTLE.maxAttempts }
  }
  return { locked: false, remainingMs: 0, attemptsLeft: Math.max(0, THROTTLE.maxAttempts - e.attempts) }
}

export function recordFailure(username, now = Date.now()) {
  const f = load()
  let e = f.byUsername[username]
  if (!e || now - (e.lastFailedAt ?? e.firstFailedAt) > THROTTLE.resetAfterMs) {
    e = { attempts: 0, firstFailedAt: now, lastFailedAt: now, lockedUntil: 0, locks: 0 }
  }
  e.attempts += 1
  e.lastFailedAt = now
  if (e.attempts >= THROTTLE.maxAttempts) {
    e.locks = (e.locks ?? 0) + 1
    const lockMs = Math.min(THROTTLE.capLockMs, THROTTLE.baseLockMs * 2 ** (e.locks - 1))
    e.lockedUntil = now + lockMs
    e.attempts = 0
  }
  f.byUsername[username] = e
  save(f)
}

export function clearThrottle(username) {
  const f = load()
  if (f.byUsername[username]) {
    delete f.byUsername[username]
    save(f)
  }
}

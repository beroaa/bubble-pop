import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from './localStorageStub.js'
import { checkThrottle, recordFailure, clearThrottle } from '../throttle.js'

const T0 = 1700000000000

beforeEach(() => { installLocalStorage() })

describe('login throttle', () => {
  it('locks after 5 failures for 30s', () => {
    for (let i = 0; i < 5; i++) recordFailure('bero', T0 + i)
    const c = checkThrottle('bero', T0 + 10)
    expect(c.locked).toBe(true)
    expect(c.remainingMs).toBeGreaterThan(29000)
    expect(checkThrottle('bero', T0 + 31000).locked).toBe(false)
  })

  it('doubles lock time per subsequent lock, capped at 15 min', () => {
    let t = T0
    for (let i = 0; i < 5; i++) recordFailure('bero', t)
    t += 31000 // 30s lock passes
    for (let i = 0; i < 5; i++) recordFailure('bero', t + i)
    let c = checkThrottle('bero', t + 10)
    expect(c.remainingMs).toBeGreaterThan(59000) // 60s second lock
    // hammer to the cap
    for (let round = 0; round < 10; round++) {
      t += 16 * 60 * 1000
      for (let i = 0; i < 5; i++) recordFailure('bero', t + i)
    }
    c = checkThrottle('bero', t + 10)
    expect(c.remainingMs).toBeLessThanOrEqual(15 * 60 * 1000)
  })

  it('resets the counter after 15 quiet minutes', () => {
    for (let i = 0; i < 4; i++) recordFailure('bero', T0)
    expect(checkThrottle('bero', T0 + 16 * 60 * 1000).attemptsLeft).toBe(5)
  })

  it('clears on successful login', () => {
    for (let i = 0; i < 3; i++) recordFailure('bero', T0)
    clearThrottle('bero')
    expect(checkThrottle('bero', T0).attemptsLeft).toBe(5)
  })

  it('throttles per-username', () => {
    for (let i = 0; i < 5; i++) recordFailure('bero', T0)
    expect(checkThrottle('rami', T0).locked).toBe(false)
  })
})

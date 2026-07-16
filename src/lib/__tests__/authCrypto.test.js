// Runs against Node's real WebCrypto — no mocks.
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, deriveHash, fromB64, toB64, timingSafeEqual, suggestPassword, randomToken, dummyDerive } from '../authCrypto.js'

// btoa/atob exist in Node >= 16 on globalThis

describe('password hashing', () => {
  it('hash → verify roundtrip', { timeout: 30000 }, async () => {
    const rec = await hashPassword('correct horse battery')
    expect(rec.algo).toBe('PBKDF2-SHA256')
    expect(rec.iterations).toBe(600000)
    expect(fromB64(rec.salt)).toHaveLength(16)
    expect(fromB64(rec.hash)).toHaveLength(32)
    await expect(verifyPassword('correct horse battery', rec)).resolves.toBe(true)
    await expect(verifyPassword('wrong horse', rec)).resolves.toBe(false)
  })

  it('generates a distinct salt per call', { timeout: 30000 }, async () => {
    const a = await hashPassword('same password')
    const b = await hashPassword('same password')
    expect(a.salt).not.toBe(b.salt)
    expect(a.hash).not.toBe(b.hash)
  })

  it('honors a stored (lower) iteration count', { timeout: 30000 }, async () => {
    const salt = fromB64((await hashPassword('x')).salt)
    const low = await deriveHash('pw', salt, 1000)
    const rec = { algo: 'PBKDF2-SHA256', iterations: 1000, salt: toB64(salt), hash: toB64(low) }
    await expect(verifyPassword('pw', rec)).resolves.toBe(true)
  })

  it('dummyDerive always returns false', { timeout: 30000 }, async () => {
    await expect(dummyDerive('anything')).resolves.toBe(false)
  })
})

describe('primitives', () => {
  it('base64 roundtrip', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 255])
    expect(fromB64(toB64(bytes))).toEqual(bytes)
  })
  it('timingSafeEqual', () => {
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true)
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false)
    expect(timingSafeEqual(new Uint8Array([1]), new Uint8Array([1, 2]))).toBe(false)
  })
  it('suggestPassword: 16 chars from the unambiguous set', () => {
    const pw = suggestPassword()
    expect(pw).toHaveLength(16)
    expect(/^[A-HJ-NP-Za-km-z2-9!@#$%]+$/.test(pw)).toBe(true)
  })
  it('randomToken is url-safe', () => {
    const t = randomToken()
    expect(/^[A-Za-z0-9_-]+$/.test(t)).toBe(true)
  })
})

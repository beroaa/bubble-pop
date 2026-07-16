// PBKDF2-SHA256 credential hashing via WebCrypto. Requires a secure context
// (localhost or HTTPS) — never serve ClientOS from file://.
import { PBKDF2 } from '../engine/constants.js'

export const PBKDF2_ITERATIONS = PBKDF2.iterations
export const SALT_BYTES = PBKDF2.saltBytes
export const HASH_BYTES = PBKDF2.hashBytes

export function toB64(bytes) {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s)
}

export function fromB64(s) {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

export function randomBytes(n) {
  const out = new Uint8Array(n)
  globalThis.crypto.getRandomValues(out)
  return out
}

export function randomToken(n = 32) {
  return toB64(randomBytes(n)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export async function deriveHash(password, salt, iterations) {
  const key = await globalThis.crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  )
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, HASH_BYTES * 8,
  )
  return new Uint8Array(bits)
}

export async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES)
  const hash = await deriveHash(password, salt, PBKDF2_ITERATIONS)
  return { algo: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, salt: toB64(salt), hash: toB64(hash) }
}

export async function verifyPassword(password, credentials) {
  // honor the record's own iteration count so future bumps don't break old accounts
  const derived = await deriveHash(password, fromB64(credentials.salt), credentials.iterations)
  return timingSafeEqual(derived, fromB64(credentials.hash))
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

// A fixed-salt derive used when the username doesn't exist, so login timing/UX
// is uniform and never confirms which usernames are real.
const DUMMY_SALT = new Uint8Array(SALT_BYTES).fill(7)
export async function dummyDerive(password) {
  await deriveHash(password || 'x', DUMMY_SALT, PBKDF2_ITERATIONS)
  return false
}

// 16 chars from an unambiguous set, crypto-driven — for operator-issued agent passwords.
const PW_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
export function suggestPassword(length = 16) {
  const bytes = randomBytes(length)
  let out = ''
  for (const b of bytes) out += PW_CHARS[b % PW_CHARS.length]
  return out
}

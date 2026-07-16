import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from './localStorageStub.js'
import { createSession, getSession, endSession, SESSION_KEY } from '../session.js'
import { SESSION_TTL_MS, REMEMBER_TTL_MS } from '../../engine/constants.js'

const T0 = 1700000000000
const account = { id: 'op1', role: 'operator', disabled: false, deletedAt: null }
const lookup = (id) => (id === 'op1' ? account : null)

beforeEach(() => { installLocalStorage() })

describe('sessions', () => {
  it('creates and reads back a session', () => {
    const s = createSession(account, false, T0)
    expect(s.expiresAt).toBe(T0 + SESSION_TTL_MS)
    expect(getSession(lookup, T0 + 1000)?.accountId).toBe('op1')
  })

  it('remember-me extends to 30 days', () => {
    const s = createSession(account, true, T0)
    expect(s.expiresAt).toBe(T0 + REMEMBER_TTL_MS)
    expect(getSession(lookup, T0 + SESSION_TTL_MS + 1)).not.toBeNull()
  })

  it('expiry deletes the key', () => {
    createSession(account, false, T0)
    expect(getSession(lookup, T0 + SESSION_TTL_MS + 1)).toBeNull()
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
  })

  it('disabled or missing accounts kill the session', () => {
    createSession(account, false, T0)
    expect(getSession(() => ({ ...account, disabled: true }), T0 + 1)).toBeNull()
    createSession(account, false, T0)
    expect(getSession(() => null, T0 + 1)).toBeNull()
  })

  it('corrupt session JSON is discarded', () => {
    localStorage.setItem(SESSION_KEY, '{nope')
    expect(getSession(lookup, T0)).toBeNull()
  })

  it('endSession removes the key', () => {
    createSession(account, false, T0)
    endSession()
    expect(getSession(lookup, T0 + 1)).toBeNull()
  })
})

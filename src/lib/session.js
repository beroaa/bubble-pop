// Session = a UX construct (who is signed in on this device), not a bearer credential.
import { SESSION_TTL_MS, REMEMBER_TTL_MS } from '../engine/constants.js'
import { randomToken } from './authCrypto.js'

export const SESSION_KEY = 'clientos.v1.session'

export function createSession(account, remember, now = Date.now()) {
  const session = {
    v: 1,
    token: randomToken(32),
    accountId: account.id,
    role: account.role,
    createdAt: now,
    expiresAt: now + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS),
    remember,
  }
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* memory-only mode */ }
  return session
}

// Returns the live session or null; deletes the key when expired/invalid.
// getAccount lets the caller re-check the account still exists and isn't disabled.
export function getSession(getAccount, now = Date.now()) {
  let raw
  try { raw = localStorage.getItem(SESSION_KEY) } catch { return null }
  if (!raw) return null
  let session
  try { session = JSON.parse(raw) } catch { endSession(); return null }
  if (!session || session.v !== 1 || typeof session.expiresAt !== 'number') { endSession(); return null }
  if (now >= session.expiresAt) { endSession(); return null }
  if (getAccount) {
    const account = getAccount(session.accountId)
    if (!account || account.disabled || account.deletedAt) { endSession(); return null }
  }
  return session
}

export function endSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

// Cross-tab kill: logout (or token change) in one tab resets auth in all tabs.
export function onSessionChange(handler) {
  const listener = (e) => {
    if (e.key === SESSION_KEY || e.key === null) handler()
  }
  window.addEventListener('storage', listener)
  return () => window.removeEventListener('storage', listener)
}

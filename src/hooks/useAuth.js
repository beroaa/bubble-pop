import { useMemo } from 'react'
import { useAppState, useDispatch, flushSave } from './useAppState.jsx'
import { hashPassword, verifyPassword, dummyDerive, suggestPassword } from '../lib/authCrypto.js'
import { createSession, endSession } from '../lib/session.js'
import { checkThrottle, recordFailure, clearThrottle } from '../lib/throttle.js'
import { makeAccount, normalizeUsername, validUsername } from '../engine/entities.js'
import { PASSWORD_MIN, PASSWORD_MAX } from '../engine/constants.js'
import { uid, cryptoRng } from '../engine/ids.js'
import * as A from '../engine/actions.js'
import { sfx } from '../lib/sounds.js'

export function useAuth() {
  const state = useAppState()
  const dispatch = useDispatch()

  return useMemo(() => ({
    async login(usernameInput, password, remember) {
      const username = normalizeUsername(usernameInput)
      const throttle = checkThrottle(username)
      if (throttle.locked) return { ok: false, code: 'LOCKED', lockRemainingMs: throttle.remainingMs }

      const account = Object.values(state.accounts).find((a) => a.username === username && !a.deletedAt)
      if (!account) {
        await dummyDerive(password) // uniform timing/UX: never confirm which usernames exist
        recordFailure(username)
        return { ok: false, code: 'BAD_CREDENTIALS', attemptsLeft: Math.max(0, checkThrottle(username).attemptsLeft) }
      }
      if (account.disabled) return { ok: false, code: 'DISABLED' }

      const valid = await verifyPassword(password, account.credentials)
      if (!valid) {
        recordFailure(username)
        const after = checkThrottle(username)
        return { ok: false, code: after.locked ? 'LOCKED' : 'BAD_CREDENTIALS', attemptsLeft: after.attemptsLeft, lockRemainingMs: after.remainingMs }
      }

      clearThrottle(username)
      const session = createSession(account, remember)
      dispatch(A.loginSuccess(account.id, session))
      flushSave()
      sfx.loginSuccess()
      return { ok: true, account, mustChangePassword: account.mustChangePassword }
    },

    logout() {
      endSession()
      dispatch(A.logout())
      flushSave()
    },

    sessionExpired() {
      endSession()
      dispatch(A.sessionExpired())
    },

    async createOperator({ username, displayName, password }) {
      const check = validateNewCredentials(username, password)
      if (!check.ok) return check
      const credentials = await hashPassword(password)
      const account = makeAccount({
        id: uid(cryptoRng), username, displayName, role: 'operator',
        credentials, mustChangePassword: false, now: Date.now(),
      })
      dispatch(A.firstRunCreateOperator(account))
      const session = createSession(account, true)
      dispatch(A.loginSuccess(account.id, session))
      flushSave()
      sfx.loginSuccess()
      return { ok: true, account }
    },

    async createAgent({ username, displayName, password }) {
      const check = validateNewCredentials(username, password)
      if (!check.ok) return check
      if (Object.values(state.accounts).some((a) => a.username === normalizeUsername(username))) {
        return { ok: false, code: 'TAKEN' }
      }
      const credentials = await hashPassword(password)
      const account = makeAccount({
        id: uid(cryptoRng), username, displayName, role: 'agent',
        credentials, mustChangePassword: true,
        createdBy: state.session?.accountId ?? null, now: Date.now(),
      })
      dispatch(A.accountCreate(account))
      flushSave()
      return { ok: true, account }
    },

    async changePassword(currentPassword, newPassword) {
      const me = state.session ? state.accounts[state.session.accountId] : null
      if (!me) return { ok: false, code: 'NO_SESSION' }
      const valid = await verifyPassword(currentPassword, me.credentials)
      if (!valid) return { ok: false, code: 'WRONG_CURRENT' }
      if (newPassword === currentPassword) return { ok: false, code: 'SAME_AS_CURRENT' }
      if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX || normalizeUsername(newPassword) === me.username) {
        return { ok: false, code: 'WEAK' }
      }
      const credentials = await hashPassword(newPassword)
      dispatch(A.accountSetCredentials(me.id, credentials, false))
      flushSave()
      return { ok: true }
    },

    async resetAgentPassword(agentId) {
      const password = suggestPassword()
      const credentials = await hashPassword(password)
      dispatch(A.accountSetCredentials(agentId, credentials, true))
      flushSave()
      return { ok: true, password }
    },

    suggestPassword,
  }), [state, dispatch])
}

function validateNewCredentials(username, password) {
  if (!validUsername(username)) return { ok: false, code: 'BAD_USERNAME' }
  if (!password || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return { ok: false, code: 'WEAK' }
  if (normalizeUsername(password) === normalizeUsername(username)) return { ok: false, code: 'WEAK' }
  return { ok: true }
}

// Forced first-login password change (also reused inside Settings).
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.js'
import { PASSWORD_MIN } from '../../engine/constants.js'

export function PasswordChangeForm({ onDone, submitLabel = 'Update password' }) {
  const auth = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const strength = next.length >= PASSWORD_MIN ? (/[A-Z]/.test(next) && /[0-9!@#$%^&*]/.test(next) ? 3 : 2) : next.length > 4 ? 1 : 0

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError(null)
    if (next !== confirm) { setError('New passwords do not match.'); return }
    setBusy(true)
    const result = await auth.changePassword(current, next)
    setBusy(false)
    if (result.ok) { onDone?.() } else {
      setError({
        WRONG_CURRENT: 'Current password is wrong.',
        SAME_AS_CURRENT: 'New password must be different from the current one.',
        WEAK: `New password needs at least ${PASSWORD_MIN} characters and can't be your username.`,
      }[result.code] ?? 'Could not change password.')
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <label className="field">
        <span className="overline">Current password</span>
        <input type="password" value={current} autoComplete="current-password" onChange={(e) => setCurrent(e.target.value)} />
      </label>
      <label className="field">
        <span className="overline">New password</span>
        <input type="password" value={next} autoComplete="new-password" onChange={(e) => setNext(e.target.value)} />
        <span className="strength" data-level={strength} aria-hidden="true"><i /><i /><i /></span>
      </label>
      <label className="field">
        <span className="overline">Confirm new password</span>
        <input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} />
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
      <motion.button type="submit" className="btn btn-primary btn-block" whileTap={{ scale: 0.97 }} disabled={busy || !current || !next || !confirm}>
        {busy ? 'Updating…' : submitLabel}
      </motion.button>
    </form>
  )
}

export default function ChangePasswordView() {
  const auth = useAuth()
  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <span className="auth-mark" aria-hidden="true">🎖</span>
        <h1 className="auth-title display">New password required</h1>
        <p className="small dim">Your starter password was a bootstrap credential.<br />Pick your real one before entering HQ.</p>
      </div>
      <div className="card auth-card">
        <PasswordChangeForm submitLabel="Set password & enter" />
      </div>
      <button type="button" className="btn btn-ghost" onClick={() => auth.logout()}>Log out</button>
    </div>
  )
}

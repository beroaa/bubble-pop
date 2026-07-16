import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.js'
import { PASSWORD_MIN } from '../../engine/constants.js'

export default function FirstRunView() {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setBusy(true)
    const result = await auth.createOperator({ username, displayName: displayName || username, password })
    setBusy(false)
    if (!result.ok) {
      setError(
        result.code === 'BAD_USERNAME'
          ? 'Username: 3–20 chars, lowercase letters, digits, . _ -'
          : `Password needs at least ${PASSWORD_MIN} characters and can't be your username.`,
      )
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <span className="auth-mark" aria-hidden="true">🎖</span>
        <p className="overline accent-text">Menu Sadah</p>
        <h1 className="auth-title display">Set up your HQ</h1>
        <p className="small dim">Create the operator account. You own everything here.</p>
      </div>

      <form className="card auth-card" onSubmit={submit}>
        <label className="field">
          <span className="overline">Operator username</span>
          <input type="text" value={username} autoComplete="username" autoCapitalize="none" spellCheck="false" onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="field">
          <span className="overline">Display name</span>
          <input type="text" value={displayName} placeholder={username || 'How the squad sees you'} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label className="field">
          <span className="overline">Password</span>
          <input type="password" value={password} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
          <span className="micro dim">At least {PASSWORD_MIN} characters. There is no reset email — keep it safe.</span>
        </label>
        <label className="field">
          <span className="overline">Confirm password</span>
          <input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {error && <p className="field-error" role="alert">{error}</p>}
        <motion.button type="submit" className="btn btn-primary btn-lg btn-block" whileTap={{ scale: 0.97 }} disabled={busy || !username || !password || !confirm}>
          {busy ? 'Securing…' : 'Create HQ'}
        </motion.button>
      </form>
    </div>
  )
}

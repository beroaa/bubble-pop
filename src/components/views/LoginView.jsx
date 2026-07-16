import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.js'
import Icon from '../Icon.jsx'

export default function LoginView() {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [lockMs, setLockMs] = useState(0)
  const [scope, animate] = useAnimate()
  const userRef = useRef(null)

  useEffect(() => { userRef.current?.focus() }, [])

  useEffect(() => {
    if (lockMs <= 0) return
    const t = setInterval(() => setLockMs((ms) => Math.max(0, ms - 1000)), 1000)
    return () => clearInterval(t)
  }, [lockMs > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e) {
    e.preventDefault()
    if (busy || lockMs > 0) return
    setBusy(true)
    setError(null)
    const result = await auth.login(username, password, remember)
    setBusy(false)
    if (result.ok) return // gate re-renders
    animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.32 })
    if (result.code === 'LOCKED') {
      setLockMs(result.lockRemainingMs ?? 30000)
      setError(null)
    } else if (result.code === 'DISABLED') {
      setError('This account has been benched. Talk to the operator.')
    } else {
      setError(
        `Wrong username or password.${result.attemptsLeft != null && result.attemptsLeft <= 2 ? ` ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} left before a timeout.` : ''}`,
      )
    }
  }

  const mmss = (ms) => {
    const s = Math.ceil(ms / 1000)
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <span className="auth-mark" aria-hidden="true">🎖</span>
        <p className="overline accent-text">Menu Sadah</p>
        <h1 className="auth-title display">ClientOS</h1>
        <p className="small dim">Operations HQ</p>
      </div>

      <motion.form ref={scope} className="card auth-card" onSubmit={submit}>
        <label className="field">
          <span className="overline">Username</span>
          <input
            ref={userRef} type="text" value={username} autoComplete="username"
            autoCapitalize="none" spellCheck="false" disabled={busy || lockMs > 0}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="overline">Password</span>
          <span className="pw-wrap">
            <input
              type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password"
              disabled={busy || lockMs > 0}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="pw-eye" aria-label={showPw ? 'Hide password' : 'Show password'} onClick={() => setShowPw(!showPw)}>
              <Icon name={showPw ? 'eye-off' : 'eye'} size={20} />
            </button>
          </span>
        </label>
        {error && <p className="field-error" role="alert">{error}</p>}
        {lockMs > 0 && <p className="field-error num" role="alert">Too many attempts. Try again in {mmss(lockMs)}.</p>}
        <label className="check-row">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me</span>
        </label>
        <motion.button type="submit" className="btn btn-primary btn-lg btn-block" whileTap={{ scale: 0.97 }} disabled={busy || lockMs > 0 || !username || !password}>
          {busy ? 'Checking…' : 'Sign in'}
        </motion.button>
      </motion.form>

      <p className="micro dim auth-footer">
        Local device sign-in · data stays on this machine.<br />
        Locked out? The operator can reset agent passwords.
      </p>
    </div>
  )
}

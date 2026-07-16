import { useEffect } from 'react'
import { useAppState } from './hooks/useAppState.jsx'
import { useAuth } from './hooks/useAuth.js'
import { selectHasOperator, selectCurrentAccount } from './engine/selectors.js'
import { getSession, onSessionChange } from './lib/session.js'
import { downloadText } from './lib/fileio.js'
import { DOC_KEY, loadRaw } from './lib/storage.js'
import FirstRunView from './components/views/FirstRunView.jsx'
import LoginView from './components/views/LoginView.jsx'
import ChangePasswordView from './components/views/ChangePasswordView.jsx'
import AppShell from './components/AppShell.jsx'

export default function App() {
  const state = useAppState()
  const auth = useAuth()
  const hasOperator = selectHasOperator(state)
  const me = selectCurrentAccount(state)
  const authed = Boolean(state.session && me && !me.disabled)

  // Login/FirstRun always render the clean HQ theme; the stored theme returns after auth.
  const theme = authed ? state.settings.theme : 'hq'
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Hard expiry + cross-tab logout: re-check whenever the tab comes back.
  useEffect(() => {
    if (!state.session) return
    const check = () => {
      const live = getSession((id) => state.accounts[id] ?? null)
      if (!live || live.token !== state.session.token) auth.sessionExpired()
    }
    const onVisible = () => { if (!document.hidden) check() }
    document.addEventListener('visibilitychange', onVisible)
    const offStorage = onSessionChange(check)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      offStorage()
    }
  }, [state.session, state.accounts, auth])

  if (state.ui.storageError === 'future') {
    return (
      <div className="boundary">
        <h1 className="display">Backup from a newer ClientOS</h1>
        <p className="dim">This device holds data written by a newer version of the app. Refusing to touch it — update the app, or export the raw data below.</p>
        <button type="button" className="btn btn-secondary" onClick={() => downloadText(`clientos-raw-${Date.now()}.json`, loadRaw(DOC_KEY) ?? '{}')}>
          Download raw data
        </button>
      </div>
    )
  }

  if (!hasOperator) return <FirstRunView />
  if (!authed) return <LoginView />
  if (me.mustChangePassword) return <ChangePasswordView />
  return <AppShell />
}

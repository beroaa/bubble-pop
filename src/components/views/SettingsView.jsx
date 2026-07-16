import { useState } from 'react'
import { useAppState, useDispatch, flushSave } from '../../hooks/useAppState.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useSound } from '../../hooks/useSound.js'
import { selectCurrentAccount, selectIsOperator } from '../../engine/selectors.js'
import { settingsUpdate, importDoc, factoryReset, uiToast } from '../../engine/actions.js'
import { docOf } from '../../engine/initialState.js'
import { validateDoc } from '../../engine/entities.js'
import { downloadText, pickTextFile } from '../../lib/fileio.js'
import { endSession } from '../../lib/session.js'
import Modal from '../Modal.jsx'
import Icon from '../Icon.jsx'
import { PasswordChangeForm } from './ChangePasswordView.jsx'

export default function SettingsView() {
  const state = useAppState()
  const dispatch = useDispatch()
  const auth = useAuth()
  const sfx = useSound()
  const isOperator = selectIsOperator(state)
  const me = selectCurrentAccount(state)
  const [changingPw, setChangingPw] = useState(false)
  const [importing, setImporting] = useState(null)
  const [resetting, setResetting] = useState(false)
  const [resetText, setResetText] = useState('')
  const theme = state.settings.theme

  async function startImport() {
    try {
      const text = await pickTextFile()
      const doc = JSON.parse(text)
      const problems = validateDoc(doc)
      if (problems.length) {
        dispatch(uiToast('error', 'That file is not a valid ClientOS backup.'))
        return
      }
      setImporting(doc)
    } catch {
      dispatch(uiToast('error', 'Could not read that file.'))
    }
  }

  return (
    <div className="view stack-6">
      <h1 className="display page-title">Settings</h1>

      {isOperator && (
        <section className="stack-2">
          <h2 className="overline dim">Appearance</h2>
          <div className="card stack">
            <div className="setting-row">
              <span>
                Theme
                <span className="micro dim block">Competitive mode transforms the whole HQ. Applies for the whole squad.</span>
              </span>
              <div className="seg-control theme-seg" role="tablist" aria-label="Theme">
                {[['hq', 'HQ'], ['tactical', 'Competitive']].map(([id, label]) => (
                  <button
                    key={id} type="button" role="tab" aria-selected={theme === id}
                    className={`seg ${theme === id ? 'seg-active' : ''}`}
                    onClick={() => { sfx.uiClick(); dispatch(settingsUpdate({ theme: id })) }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="stack-2">
        <h2 className="overline dim">Sound</h2>
        <div className="card stack">
          <label className="setting-row">
            <span>Sound effects</span>
            <input
              type="checkbox" className="switch" checked={state.settings.soundEnabled}
              onChange={(e) => { dispatch(settingsUpdate({ soundEnabled: e.target.checked })); if (e.target.checked) setTimeout(() => sfx.uiClick(), 50) }}
            />
          </label>
          <label className="setting-row">
            <span>Volume</span>
            <input
              type="range" min="0" max="100" className="slider"
              value={Math.round(state.settings.volume * 100)}
              disabled={!state.settings.soundEnabled}
              onChange={(e) => dispatch(settingsUpdate({ volume: Number(e.target.value) / 100 }))}
              onPointerUp={() => sfx.clientSecured()}
            />
          </label>
        </div>
      </section>

      <section className="stack-2">
        <h2 className="overline dim">Account</h2>
        <div className="card stack">
          <div className="setting-row">
            <span className="row gap-2 center-v">
              <span className="avatar">{me.displayName.slice(0, 2).toUpperCase()}</span>
              <span>
                {me.displayName}
                <span className="micro dim block num">@{me.username}</span>
              </span>
            </span>
            <span className={`chip ${isOperator ? 'chip-accent' : 'chip-info'}`}>{isOperator ? '🎖 Operator' : 'Agent'}</span>
          </div>
          <div className="row gap-3">
            <button type="button" className="btn btn-secondary grow" onClick={() => setChangingPw(true)}>Change password</button>
            <button type="button" className="btn btn-ghost" onClick={() => auth.logout()}>
              <Icon name="log-out" size={16} /> Log out
            </button>
          </div>
        </div>
      </section>

      <section className="stack-2">
        <h2 className="overline dim">Data</h2>
        <div className="card stack">
          <div className="row gap-3">
            <button
              type="button" className="btn btn-secondary grow"
              onClick={() => downloadText(`clientos-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(docOf(state), null, 2))}
            >
              <Icon name="download" size={16} /> Export data
            </button>
            {isOperator && (
              <button type="button" className="btn btn-secondary grow" onClick={startImport}>
                <Icon name="upload" size={16} /> Import data
              </button>
            )}
          </div>
          <p className="micro dim">
            Export = full backup of this device's HQ (accounts, clients, ranks, XP). Import overwrites everything —
            it's also the crude way to move HQ to another machine. Last saved: <span className="num">{state.meta.lastSavedAt ? new Date(state.meta.lastSavedAt).toLocaleTimeString() : '—'}</span>
          </p>
          {isOperator && (
            <button type="button" className="btn btn-ghost btn-danger-ghost" onClick={() => setResetting(true)}>Reset everything</button>
          )}
        </div>
      </section>

      <section className="stack-2">
        <h2 className="overline dim">About</h2>
        <div className="card">
          <p className="small dim">
            ClientOS v1 · MENU SADAH · ClientOS stores everything on this device. Passwords are hashed (PBKDF2),
            but anyone with full access to this computer's files can read business data. A server backend is on
            the roadmap — see docs/SECURITY.md in the repo for the honest threat model.
          </p>
        </div>
      </section>

      <Modal open={changingPw} title="Change password" onClose={() => setChangingPw(false)}>
        <PasswordChangeForm onDone={() => { setChangingPw(false); dispatch(uiToast('ok', 'Password updated.')) }} />
      </Modal>

      <Modal open={importing !== null} title="Import backup?" onClose={() => setImporting(null)}>
        <p className="small dim">
          This <b>overwrites everything</b> on this device with the backup — accounts, clients, ranks, XP, tasks.
          There is no merge and no undo.
        </p>
        <div className="row gap-3 sheet-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setImporting(null)}>Cancel</button>
          <button
            type="button" className="btn btn-danger grow"
            onClick={() => { dispatch(importDoc(importing)); flushSave(); setImporting(null) }}
          >
            Overwrite & import
          </button>
        </div>
      </Modal>

      <Modal open={resetting} title="Reset everything?" onClose={() => { setResetting(false); setResetText('') }}>
        <p className="small dim">Deletes all accounts, clients, ranks, XP and tasks on this device. Type <b>RESET</b> to confirm.</p>
        <input value={resetText} onChange={(e) => setResetText(e.target.value)} placeholder="RESET" autoCapitalize="characters" />
        <div className="row gap-3 sheet-footer">
          <button type="button" className="btn btn-ghost" onClick={() => { setResetting(false); setResetText('') }}>Cancel</button>
          <button
            type="button" className="btn btn-danger grow" disabled={resetText !== 'RESET'}
            onClick={() => { endSession(); dispatch(factoryReset()); flushSave() }}
          >
            Reset
          </button>
        </div>
      </Modal>
    </div>
  )
}

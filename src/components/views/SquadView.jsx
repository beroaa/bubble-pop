// Operator-only: recruit agents, set quotas, reset passwords, track commissions.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppState, useDispatch } from '../../hooks/useAppState.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useSound } from '../../hooks/useSound.js'
import {
  selectSquad, selectRank, selectQuotaUsage, selectCommissions, selectSecuredCount,
} from '../../engine/selectors.js'
import { quotaSet, accountSetDisabled } from '../../engine/actions.js'
import { QUOTA_LOW_AT } from '../../engine/constants.js'
import RankBadge from '../RankBadge.jsx'
import XPBar from '../XPBar.jsx'
import Modal from '../Modal.jsx'
import Icon from '../Icon.jsx'
import { money } from '../StatTile.jsx'

export default function SquadView() {
  const state = useAppState()
  const [recruiting, setRecruiting] = useState(false)
  const squad = selectSquad(state)

  return (
    <div className="view stack-4">
      <div className="section-head">
        <h1 className="display page-title">Squad</h1>
        <motion.button type="button" className="btn btn-primary btn-sm" whileTap={{ scale: 0.96 }} onClick={() => setRecruiting(true)}>
          <Icon name="plus" size={16} /> Recruit
        </motion.button>
      </div>

      {squad.map((account) => <AgentCard key={account.id} account={account} />)}

      <RecruitModal open={recruiting} onClose={() => setRecruiting(false)} />
    </div>
  )
}

function AgentCard({ account }) {
  const state = useAppState()
  const dispatch = useDispatch()
  const auth = useAuth()
  const sfx = useSound()
  const [editQuota, setEditQuota] = useState(null)
  const [resetPw, setResetPw] = useState(null)
  const [confirmBench, setConfirmBench] = useState(false)
  const isAgent = account.role === 'agent'
  const rank = selectRank(state, account.id)
  const quota = selectQuotaUsage(state, account.id)
  const commissions = selectCommissions(state, account.id)
  const secured = selectSecuredCount(state, account.id)
  const quotaPct = quota.allocated > 0 ? quota.used / quota.allocated : 1
  const lowAmmo = isAgent && quota.remaining <= QUOTA_LOW_AT

  return (
    <div className={`card agent-card hud-corners ${account.disabled ? 'agent-benched' : ''}`}>
      <div className="agent-head">
        <span className="avatar avatar-lg">{account.displayName.slice(0, 2).toUpperCase()}</span>
        <span className="agent-id">
          <span className="h3">
            {account.displayName}
            {account.role === 'operator' && <span className="chip chip-accent">🎖 Operator</span>}
            {account.disabled && <span className="chip chip-negative">Benched</span>}
          </span>
          <span className="micro dim num">@{account.username}</span>
        </span>
        <span className="agent-rank">
          <RankBadge rank={rank} size={32} />
          <span className="micro dim">{rank.code}</span>
        </span>
      </div>

      {isAgent && (
        <div className={`quota-block ${lowAmmo ? 'low-ammo' : ''}`}>
          <div className="bar-caption small">
            <span className="num">Menus given {quota.used} / {quota.allocated}</span>
            {lowAmmo && <span className="warning-text overline">Low ammo</span>}
          </div>
          <XPBar
            pct={Math.min(1, quotaPct)}
            showTicks={false}
            statusColor={quotaPct >= 1 ? 'var(--negative)' : quotaPct >= 0.8 ? 'var(--warning)' : 'var(--info)'}
          />
        </div>
      )}

      <div className="agent-stats">
        <span><span className="overline dim">Secured</span><b className="num">{secured}</b></span>
        <span><span className="overline dim">Commission owed</span><b className="num">{money(commissions.accrued)}</b></span>
        <span><span className="overline dim">Last active</span><b className="num">{account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleDateString() : '—'}</b></span>
      </div>
      {isAgent && commissions.awaitingPricing > 0 && (
        <p className="micro dim">{commissions.awaitingPricing} client{commissions.awaitingPricing > 1 ? 's' : ''} awaiting pricing · payouts via Stripe soon</p>
      )}

      {isAgent && (
        <div className="agent-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditQuota(quota.allocated)}>Edit quota</button>
          <button
            type="button" className="btn btn-ghost btn-sm"
            onClick={async () => { const r = await auth.resetAgentPassword(account.id); setResetPw(r.password) }}
          >
            Reset password
          </button>
          <button type="button" className="btn btn-ghost btn-sm btn-danger-ghost" onClick={() => setConfirmBench(true)}>
            {account.disabled ? 'Un-bench' : 'Bench'}
          </button>
        </div>
      )}

      <Modal open={editQuota !== null} title={`Quota — ${account.displayName}`} onClose={() => setEditQuota(null)}>
        <div className="stack">
          <p className="small dim">Menus this agent can give away. Used menus are never refunded — even on churn.</p>
          <div className="stepper">
            <button type="button" className="btn btn-secondary stepper-btn" onClick={() => setEditQuota(Math.max(0, editQuota - 5))}>−5</button>
            <input className="stepper-input num" type="number" min="0" value={editQuota ?? 0} onChange={(e) => setEditQuota(Math.max(0, Number(e.target.value) || 0))} />
            <button type="button" className="btn btn-secondary stepper-btn" onClick={() => setEditQuota(editQuota + 5)}>+5</button>
          </div>
          <button
            type="button" className="btn btn-primary btn-block"
            onClick={() => { dispatch(quotaSet(account.id, editQuota)); sfx.quotaAssigned(); setEditQuota(null) }}
          >
            Assign quota
          </button>
        </div>
      </Modal>

      <Modal open={resetPw !== null} title="New starter password" onClose={() => setResetPw(null)}>
        <ReadOncePanel password={resetPw} username={account.username} onDone={() => setResetPw(null)} />
      </Modal>

      <Modal open={confirmBench} title={account.disabled ? 'Un-bench agent?' : 'Bench agent?'} onClose={() => setConfirmBench(false)}>
        <p className="small dim">
          {account.disabled
            ? 'They will be able to sign in again.'
            : 'They can no longer sign in. Their clients, rank history and commissions stay on the books.'}
        </p>
        <div className="row gap-3 sheet-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmBench(false)}>Cancel</button>
          <button
            type="button" className={`btn grow ${account.disabled ? 'btn-primary' : 'btn-danger'}`}
            onClick={() => { dispatch(accountSetDisabled(account.id, !account.disabled)); setConfirmBench(false) }}
          >
            {account.disabled ? 'Un-bench' : 'Bench'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

function ReadOncePanel({ password, username, onDone }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="stack">
      <p className="small dim">
        Send this to them over WhatsApp or in person. <b>It will not be shown again.</b> They must change it on first login.
      </p>
      <div className="read-once num">
        <span className="dim">@{username}</span>
        <b>{password}</b>
      </div>
      <button
        type="button" className="btn btn-secondary btn-block"
        onClick={async () => {
          try { await navigator.clipboard.writeText(`ClientOS login — user: ${username} · pass: ${password}`); setCopied(true) } catch { /* manual copy */ }
        }}
      >
        <Icon name="clipboard" size={16} /> {copied ? 'Copied' : 'Copy login details'}
      </button>
      <button type="button" className="btn btn-primary btn-block" onClick={onDone}>Done — I sent it</button>
    </div>
  )
}

function RecruitModal({ open, onClose }) {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [created, setCreated] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError(null)
    setBusy(true)
    const result = await auth.createAgent({ username, displayName: displayName || username, password })
    setBusy(false)
    if (result.ok) {
      setCreated({ username: result.account.username, password })
    } else {
      setError({
        BAD_USERNAME: 'Username: 3–20 chars, lowercase letters, digits, . _ -',
        WEAK: 'Password needs at least 10 characters.',
        TAKEN: 'That username is taken.',
      }[result.code] ?? 'Could not create the account.')
    }
  }

  function close() {
    setUsername(''); setDisplayName(''); setPassword(''); setCreated(null); setError(null)
    onClose()
  }

  return (
    <Modal open={open} title={created ? 'Agent recruited' : 'Recruit agent'} onClose={close}>
      {created ? (
        <ReadOncePanel password={created.password} username={created.username} onDone={close} />
      ) : (
        <form className="stack" onSubmit={submit}>
          <label className="field">
            <span className="overline">Username</span>
            <input value={username} autoCapitalize="none" spellCheck="false" onChange={(e) => setUsername(e.target.value)} placeholder="rami" />
          </label>
          <label className="field">
            <span className="overline">Display name</span>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={username || 'Rami'} />
          </label>
          <label className="field">
            <span className="overline">Starter password</span>
            <span className="row gap-2">
              <input className="grow num" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="btn btn-secondary" onClick={() => setPassword(auth.suggestPassword())}>Generate</button>
            </span>
            <span className="micro dim">They'll be forced to change it on first login.</span>
          </label>
          {error && <p className="field-error" role="alert">{error}</p>}
          <motion.button type="submit" className="btn btn-primary btn-block" whileTap={{ scale: 0.97 }} disabled={busy || !username || !password}>
            {busy ? 'Recruiting…' : 'Create account'}
          </motion.button>
        </form>
      )}
    </Modal>
  )
}

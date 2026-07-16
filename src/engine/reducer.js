import { EVENT_CAP, CEREMONY_DEDUPE_MS, QUOTA_DEFAULT, RANKS } from './constants.js'
import { rankFor, rankById } from './ranks.js'
import { grantOnce, grantDaily, levelFor, XP_VALUES, emptyXp } from './xp.js'
import { quotaUsage } from './quotas.js'
import { makeEvent, makeTask, makeClient } from './entities.js'
import { emptyDoc } from './initialState.js'
import { validateDoc } from './entities.js'

// ---- internal helpers (all pure) ----

let toastSeq = 0
function pushToast(ui, kind, text, sfx) {
  return { ...ui, toastQueue: [...ui.toastQueue, { id: `t${++toastSeq}`, kind, text, sfx }] }
}

function appendEvent(events, meta, type, payload) {
  const ev = makeEvent({ id: meta.uid(), ts: meta.now, type, actorId: meta.actorId, deviceId: meta.deviceId, payload })
  const next = [...events, ev]
  return next.length > EVENT_CAP ? next.slice(next.length - EVENT_CAP) : next
}

function securedCount(clients, accountId) {
  let n = 0
  for (const c of Object.values(clients)) {
    if (c.agentId === accountId && !c.deletedAt && (c.status === 'secured' || c.status === 'live')) n++
  }
  return n
}

function actorRole(state, meta) {
  const a = meta.actorId ? state.accounts[meta.actorId] : null
  return a && !a.disabled ? a.role : null
}

function displayName(state, accountId) {
  return state.accounts[accountId]?.displayName ?? 'someone'
}

// Recompute rank for the affected accounts, append rank_up/rank_down events,
// queue a ceremony for the final rank (dedupe-gated). Returns a new state.
function recomputeRanks(state, meta, accountIds) {
  let { rankState, events, ui } = state
  for (const accountId of new Set(accountIds)) {
    if (!state.accounts[accountId]) continue
    const count = securedCount(state.clients, accountId)
    const newRank = rankFor(count)
    const prev = rankState[accountId] ?? { currentRankId: 's1', lastCelebrated: {} }
    const oldRank = rankById(prev.currentRankId) ?? rankFor(0)
    if (newRank.rankIndex === oldRank.rankIndex) continue
    const up = newRank.rankIndex > oldRank.rankIndex
    const step = up ? 1 : -1
    // one killfeed line per crossed threshold
    for (let i = oldRank.rankIndex + step; up ? i <= newRank.rankIndex : i >= newRank.rankIndex; i += step) {
      const r = rankById(rankIdAt(i))
      events = appendEvent(events, meta, up ? 'rank_up' : 'rank_down', {
        accountId, rankId: r.id, rankName: r.name, name: displayName(state, accountId),
      })
    }
    rankState = { ...rankState, [accountId]: { ...prev, currentRankId: newRank.id } }
    if (up) {
      const celebratedAt = prev.lastCelebrated?.[newRank.id]
      const fresh = !celebratedAt || meta.now - celebratedAt > CEREMONY_DEDUPE_MS
      if (fresh) {
        ui = { ...ui, ceremonyQueue: [...ui.ceremonyQueue, { accountId, fromRankId: oldRank.id, toRankId: newRank.id }] }
      }
    }
  }
  return { ...state, rankState, events, ui }
}

function rankIdAt(index) {
  return RANKS[index - 1].id
}

// Grant XP + surface level-ups as toasts. Returns new state.
function withXp(state, meta, accountId, fn) {
  const before = state.xp[accountId] ?? emptyXp()
  const after = fn(before)
  if (after === before) return state
  let ui = state.ui
  const lBefore = levelFor(before.total)
  const lAfter = levelFor(after.total)
  if (lAfter > lBefore && accountId === meta.actorId) {
    ui = pushToast(ui, 'level', `Level ${lAfter} reached`, 'levelUp')
  }
  return { ...state, xp: { ...state.xp, [accountId]: after }, ui }
}

function bumpRev(state) {
  return { ...state, rev: state.rev + 1 }
}

const OPERATOR_ONLY = new Set([
  'ACCOUNT_CREATE', 'ACCOUNT_SET_DISABLED', 'QUOTA_SET', 'COMMISSION_MARK_PAID', 'IMPORT_DOC', 'FACTORY_RESET',
])

// ---- the reducer ----

export function reducer(state, action) {
  const { type, payload } = action
  const meta = action.meta ?? { now: 0, deviceId: 'dev', actorId: null, uid: () => 'x' }
  const role = actorRole(state, meta)

  if (OPERATOR_ONLY.has(type) && role !== 'operator') {
    return { ...state, ui: pushToast(state.ui, 'error', 'Operator clearance required.', 'denied') }
  }

  switch (type) {
    case 'FIRST_RUN_CREATE_OPERATOR': {
      if (Object.values(state.accounts).some((a) => a.role === 'operator')) return state
      const { account } = payload
      const tasks = {}
      for (const [id, t] of Object.entries(state.tasks)) {
        tasks[id] = t.ownerId === '__unclaimed__' ? { ...t, ownerId: account.id, updatedAt: meta.now } : t
      }
      return bumpRev({ ...state, accounts: { [account.id]: account }, tasks })
    }

    case 'LOGIN_SUCCESS': {
      const { accountId, session } = payload
      const account = state.accounts[accountId]
      if (!account) return state
      let next = {
        ...state,
        session,
        accounts: { ...state.accounts, [accountId]: { ...account, lastLoginAt: meta.now, updatedAt: meta.now } },
        ui: { ...state.ui, view: 'hq' },
      }
      // Welcome-back ceremony: if this user's current rank was never celebrated, queue it.
      const rs = next.rankState[accountId]
      if (rs && rs.currentRankId !== 's1' && !rs.lastCelebrated?.[rs.currentRankId]) {
        next = { ...next, ui: { ...next.ui, ceremonyQueue: [...next.ui.ceremonyQueue, { accountId, fromRankId: null, toRankId: rs.currentRankId }] } }
      }
      return bumpRev(next)
    }

    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return { ...state, session: null, ui: { ...state.ui, view: 'hq', modal: null, ceremonyQueue: [] } }

    case 'ACCOUNT_CREATE': {
      const { account } = payload
      if (account.role !== 'agent') return { ...state, ui: pushToast(state.ui, 'error', 'Only agent accounts can be recruited.') }
      if (Object.values(state.accounts).some((a) => a.username === account.username)) {
        return { ...state, ui: pushToast(state.ui, 'error', 'That username is taken.') }
      }
      const quotas = { ...state.quotas, [account.id]: { agentId: account.id, allocated: QUOTA_DEFAULT, updatedAt: meta.now } }
      const events = appendEvent(state.events, meta, 'agent_joined', { accountId: account.id, name: account.displayName })
      return bumpRev({ ...state, accounts: { ...state.accounts, [account.id]: account }, quotas, events })
    }

    case 'ACCOUNT_UPDATE': {
      const { id, patch } = payload
      const account = state.accounts[id]
      if (!account) return state
      if (role !== 'operator' && meta.actorId !== id) return state
      const allowed = { displayName: patch.displayName }
      return bumpRev({ ...state, accounts: { ...state.accounts, [id]: { ...account, ...allowed, updatedAt: meta.now } } })
    }

    case 'ACCOUNT_SET_CREDENTIALS': {
      const { id, credentials, mustChangePassword } = payload
      const account = state.accounts[id]
      if (!account) return state
      if (role !== 'operator' && meta.actorId !== id) return state
      return bumpRev({
        ...state,
        accounts: { ...state.accounts, [id]: { ...account, credentials, mustChangePassword, updatedAt: meta.now } },
      })
    }

    case 'ACCOUNT_SET_DISABLED': {
      const { id, disabled } = payload
      const account = state.accounts[id]
      if (!account) return state
      if (account.role === 'operator') return { ...state, ui: pushToast(state.ui, 'error', 'The operator cannot be benched.') }
      return bumpRev({ ...state, accounts: { ...state.accounts, [id]: { ...account, disabled, updatedAt: meta.now } } })
    }

    case 'CLIENT_ADD': {
      const input = payload.client
      const agentId = role === 'operator' ? (input.agentId ?? meta.actorId) : meta.actorId
      if (!agentId || !state.accounts[agentId]) return state
      const client = makeClient({ ...input, id: input.id ?? meta.uid(), agentId, now: meta.now })
      let next = { ...state }
      let events = state.events
      if (input.status === 'secured' || input.status === 'live') {
        const gate = secureGate(state, agentId)
        if (!gate.ok) return { ...state, ui: pushToast(state.ui, 'error', gate.reason, 'denied') }
        client.status = input.status
        client.securedAt = meta.now
        client.commission = {
          rate: state.accounts[agentId].role === 'operator' ? 0 : state.settings.commissionRate,
          planValue: 0, status: 'pending', paidAt: null,
        }
        events = appendEvent(events, meta, 'client_secured', { clientId: client.id, clientName: client.name, agentId, name: displayName(state, agentId) })
        if (input.status === 'live') {
          events = appendEvent(events, meta, 'client_live', { clientId: client.id, clientName: client.name, agentId, name: displayName(state, agentId) })
        }
        next = { ...next, clients: { ...state.clients, [client.id]: client }, events }
        next = withXp(next, meta, agentId, (xp) => grantOnce(xp, `secured:${client.id}`, XP_VALUES.client_secured))
        if (input.status === 'live') next = withXp(next, meta, agentId, (xp) => grantOnce(xp, `live:${client.id}`, XP_VALUES.client_live))
        next = recomputeRanks(next, meta, [agentId])
      } else {
        events = appendEvent(events, meta, 'lead_added', { clientId: client.id, clientName: client.name, agentId, name: displayName(state, agentId) })
        next = { ...next, clients: { ...state.clients, [client.id]: client }, events }
        next = withXp(next, meta, agentId, (xp) => grantDaily(xp, 'leads', XP_VALUES.lead_added, meta.now))
      }
      return bumpRev(next)
    }

    case 'CLIENT_UPDATE': {
      const { id, patch } = payload
      const client = state.clients[id]
      if (!client || client.deletedAt) return state
      if (role !== 'operator' && client.agentId !== meta.actorId) return state
      const allowed = {}
      for (const k of ['name', 'contact', 'notes', 'menuUrl']) if (k in patch) allowed[k] = patch[k]
      let next = { ...state, clients: { ...state.clients, [id]: { ...client, ...allowed, updatedAt: meta.now } } }
      // plan value / reassignment are operator-level edits
      if (role === 'operator' && 'planValue' in patch) {
        const c = next.clients[id]
        next.clients[id] = { ...c, commission: { ...c.commission, planValue: Math.max(0, Number(patch.planValue) || 0) }, updatedAt: meta.now }
      }
      if (role === 'operator' && 'agentId' in patch && patch.agentId !== client.agentId && state.accounts[patch.agentId]) {
        const c = next.clients[id]
        next.clients[id] = { ...c, agentId: patch.agentId, updatedAt: meta.now }
        next = recomputeRanks(next, meta, [client.agentId, patch.agentId])
      }
      return bumpRev(next)
    }

    case 'CLIENT_SET_STATUS': {
      const { id, status } = payload
      const client = state.clients[id]
      if (!client || client.deletedAt || client.status === status) return state
      if (role !== 'operator' && client.agentId !== meta.actorId) return state
      let next = { ...state }
      let events = state.events
      const updated = { ...client, status, updatedAt: meta.now }
      const agentName = displayName(state, client.agentId)

      if ((status === 'secured' || status === 'live') && client.securedAt == null) {
        const gate = secureGate(state, client.agentId)
        if (!gate.ok) return { ...state, ui: pushToast(state.ui, 'error', gate.reason, 'denied') }
        updated.securedAt = meta.now
        updated.commission = {
          rate: state.accounts[client.agentId]?.role === 'operator' ? 0 : state.settings.commissionRate,
          planValue: client.commission.planValue ?? 0, status: 'pending', paidAt: null,
        }
        events = appendEvent(events, meta, 'client_secured', { clientId: id, clientName: client.name, agentId: client.agentId, name: agentName })
      }
      if (status === 'live') {
        events = appendEvent(events, meta, 'client_live', { clientId: id, clientName: client.name, agentId: client.agentId, name: agentName })
      }
      if (status === 'churned') {
        if (updated.commission.status === 'pending') updated.commission = { ...updated.commission, status: 'void' }
        events = appendEvent(events, meta, 'client_churned', { clientId: id, clientName: client.name, agentId: client.agentId, name: agentName })
      }
      next = { ...next, clients: { ...state.clients, [id]: updated }, events }
      if (updated.securedAt != null && client.securedAt == null) {
        next = withXp(next, meta, client.agentId, (xp) => grantOnce(xp, `secured:${id}`, XP_VALUES.client_secured))
      }
      if (status === 'live') {
        next = withXp(next, meta, client.agentId, (xp) => grantOnce(xp, `live:${id}`, XP_VALUES.client_live))
      }
      next = recomputeRanks(next, meta, [client.agentId])
      return bumpRev(next)
    }

    case 'CLIENT_DELETE': {
      const { id } = payload
      const client = state.clients[id]
      if (!client || client.deletedAt) return state
      if (role !== 'operator' && client.agentId !== meta.actorId) return state
      const events = appendEvent(state.events, meta, 'client_deleted', { clientId: id, clientName: client.name, agentId: client.agentId, name: displayName(state, client.agentId) })
      let next = { ...state, clients: { ...state.clients, [id]: { ...client, deletedAt: meta.now, updatedAt: meta.now } }, events }
      next = recomputeRanks(next, meta, [client.agentId])
      return bumpRev(next)
    }

    case 'COMMISSION_MARK_PAID': {
      const { clientId } = payload
      const client = state.clients[clientId]
      if (!client || client.commission.status !== 'pending' || client.securedAt == null) return state
      const commission = { ...client.commission, status: 'paid', paidAt: meta.now }
      const events = appendEvent(state.events, meta, 'commission_paid', {
        clientId, clientName: client.name, agentId: client.agentId,
        amount: commission.rate * commission.planValue, name: displayName(state, client.agentId),
      })
      return bumpRev({ ...state, clients: { ...state.clients, [clientId]: { ...client, commission, updatedAt: meta.now } }, events })
    }

    case 'QUOTA_SET': {
      const { agentId, allocated } = payload
      if (!state.accounts[agentId]) return state
      const n = Math.max(0, Math.floor(Number(allocated) || 0))
      const quotas = { ...state.quotas, [agentId]: { agentId, allocated: n, updatedAt: meta.now } }
      const events = appendEvent(state.events, meta, 'quota_set', { agentId, allocated: n, name: displayName(state, agentId) })
      return bumpRev({ ...state, quotas, events })
    }

    case 'TASK_ADD': {
      if (!meta.actorId) return state
      const task = makeTask({ id: meta.uid(), text: payload.text, ownerId: meta.actorId, now: meta.now })
      if (!task.text) return state
      return bumpRev({ ...state, tasks: { ...state.tasks, [task.id]: task } })
    }

    case 'TASK_POP': {
      const task = state.tasks[payload.id]
      if (!task || task.deletedAt || task.ownerId !== meta.actorId) return state
      const tasks = { ...state.tasks, [task.id]: { ...task, deletedAt: meta.now, poppedAt: meta.now, updatedAt: meta.now } }
      const events = appendEvent(state.events, meta, 'task_popped', { taskId: task.id, text: task.text, name: displayName(state, meta.actorId) })
      let next = { ...state, tasks, events }
      next = withXp(next, meta, meta.actorId, (xp) => grantDaily(xp, 'tasks', XP_VALUES.task_popped, meta.now))
      return bumpRev(next)
    }

    case 'TASK_DELETE': {
      const task = state.tasks[payload.id]
      if (!task || task.deletedAt || (role !== 'operator' && task.ownerId !== meta.actorId)) return state
      return bumpRev({ ...state, tasks: { ...state.tasks, [task.id]: { ...task, deletedAt: meta.now, updatedAt: meta.now } } })
    }

    case 'SETTINGS_UPDATE': {
      const { patch } = payload
      const allowed = {}
      for (const k of ['soundEnabled', 'volume']) if (k in patch) allowed[k] = patch[k]
      if (role === 'operator') {
        for (const k of ['theme', 'commissionRate', 'currency']) if (k in patch) allowed[k] = patch[k]
      } else if ('theme' in patch || 'commissionRate' in patch) {
        return { ...state, ui: pushToast(state.ui, 'error', 'Only the operator controls that.', 'denied') }
      }
      if (Object.keys(allowed).length === 0) return state
      return bumpRev({ ...state, settings: { ...state.settings, ...allowed } })
    }

    case 'IMPORT_DOC': {
      const { doc } = payload
      if (validateDoc(doc).length > 0) {
        return { ...state, ui: pushToast(state.ui, 'error', 'Import failed: file is not a valid ClientOS backup.') }
      }
      const sessionOk = state.session && doc.accounts[state.session.accountId] && !doc.accounts[state.session.accountId].disabled
      return bumpRev({
        ...state,
        ...doc,
        session: sessionOk ? state.session : null,
        ui: pushToast({ ...state.ui, ceremonyQueue: [] }, 'ok', 'Data imported.'),
      })
    }

    case 'FACTORY_RESET': {
      const doc = emptyDoc(meta.now)
      return bumpRev({ ...state, ...doc, session: null, ui: { ...state.ui, view: 'hq', modal: null, ceremonyQueue: [], toastQueue: [] } })
    }

    // ---- UI actions (never bump rev, except ceremony-done which persists rankState) ----
    case 'UI_NAVIGATE':
      return { ...state, ui: { ...state.ui, view: payload.view } }
    case 'UI_OPEN_MODAL':
      return { ...state, ui: { ...state.ui, modal: { kind: payload.kind, props: payload.props } } }
    case 'UI_CLOSE_MODAL':
      return { ...state, ui: { ...state.ui, modal: null } }
    case 'UI_DEQUEUE_CEREMONY':
      return { ...state, ui: { ...state.ui, ceremonyQueue: state.ui.ceremonyQueue.slice(1) } }
    case 'UI_CEREMONY_DONE': {
      const { accountId, rankId } = payload
      const prev = state.rankState[accountId] ?? { currentRankId: rankId, lastCelebrated: {} }
      const rankState = {
        ...state.rankState,
        [accountId]: { ...prev, lastCelebrated: { ...prev.lastCelebrated, [rankId]: meta.now } },
      }
      return bumpRev({ ...state, rankState })
    }
    case 'UI_TOAST':
      return { ...state, ui: pushToast(state.ui, payload.kind, payload.text, payload.sfx) }
    case 'UI_DISMISS_TOAST':
      return { ...state, ui: { ...state.ui, toastQueue: state.ui.toastQueue.filter((t) => t.id !== payload.id) } }
    case 'UI_STORAGE_ERROR':
      return { ...state, ui: { ...state.ui, storageError: payload.code } }

    default:
      return state
  }
}

// Agents burn quota when a client is FIRST secured; operator is unlimited.
function secureGate(state, agentId) {
  const account = state.accounts[agentId]
  if (!account) return { ok: false, reason: 'Unknown agent.' }
  if (account.role === 'operator') return { ok: true }
  const { remaining } = quotaUsage(state, agentId)
  if (remaining <= 0) return { ok: false, reason: 'Out of menus — ask the operator for more quota.' }
  return { ok: true }
}

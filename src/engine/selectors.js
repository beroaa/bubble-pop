import { rankFor, progress, rankById } from './ranks.js'
import { levelProgress } from './xp.js'
import { quotaUsage } from './quotas.js'
import { commissionSummary } from './commissions.js'

export const selectSession = (s) => s.session
export const selectCurrentAccount = (s) => (s.session ? s.accounts[s.session.accountId] ?? null : null)
export const selectIsOperator = (s) => selectCurrentAccount(s)?.role === 'operator'

export const selectOperator = (s) => Object.values(s.accounts).find((a) => a.role === 'operator') ?? null

export const selectAgents = (s) =>
  Object.values(s.accounts).filter((a) => a.role === 'agent' && !a.deletedAt)

export const selectSquad = (s) =>
  Object.values(s.accounts).filter((a) => !a.deletedAt)

// THE read-authorization choke point: operator sees all, agents see their own.
export function selectVisibleClients(s) {
  const me = selectCurrentAccount(s)
  if (!me) return []
  const all = Object.values(s.clients).filter((c) => !c.deletedAt)
  const visible = me.role === 'operator' ? all : all.filter((c) => c.agentId === me.id)
  return visible.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function selectSecuredCount(s, accountId) {
  let n = 0
  for (const c of Object.values(s.clients)) {
    if (c.deletedAt) continue
    if (accountId && c.agentId !== accountId) continue
    if (c.status === 'secured' || c.status === 'live') n++
  }
  return n
}

export function selectLiveCount(s, accountId) {
  let n = 0
  for (const c of Object.values(s.clients)) {
    if (c.deletedAt) continue
    if (accountId && c.agentId !== accountId) continue
    if (c.status === 'live') n++
  }
  return n
}

export const selectXpTotal = (s, accountId) => s.xp[accountId]?.total ?? 0
export const selectLevel = (s, accountId) => levelProgress(selectXpTotal(s, accountId))
export const selectRank = (s, accountId) => rankFor(selectSecuredCount(s, accountId))
export const selectRankProgress = (s, accountId) => progress(selectSecuredCount(s, accountId))
export const selectRankCached = (s, accountId) => rankById(s.rankState[accountId]?.currentRankId ?? 's1')

// All-time leaderboard: secured desc, tiebreak XP desc, then earliest createdAt.
export function selectLeaderboard(s) {
  return selectSquad(s)
    .map((account) => ({
      account,
      secured: selectSecuredCount(s, account.id),
      xp: selectXpTotal(s, account.id),
      rank: selectRank(s, account.id),
    }))
    .sort((a, b) => b.secured - a.secured || b.xp - a.xp || a.account.createdAt - b.account.createdAt)
}

export const selectQuotaUsage = (s, agentId) => quotaUsage(s, agentId)
export const selectCommissions = (s, agentId) => commissionSummary(s, agentId)

export function selectKillfeed(s, limit = 30) {
  const out = []
  for (let i = s.events.length - 1; i >= 0 && out.length < limit; i--) out.push(s.events[i])
  return out
}

export function selectTasks(s, ownerId) {
  return Object.values(s.tasks)
    .filter((t) => !t.deletedAt && t.ownerId === ownerId)
    .sort((a, b) => a.createdAt - b.createdAt)
}

export function selectPoppedToday(s, ownerId, todayStr) {
  let n = 0
  for (const t of Object.values(s.tasks)) {
    if (t.ownerId === ownerId && t.poppedAt && dayOf(t.poppedAt) === todayStr) n++
  }
  return n
}

function dayOf(ms) {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const selectHasOperator = (s) => Object.values(s.accounts).some((a) => a.role === 'operator' && !a.deletedAt)
export const selectStorageError = (s) => s.ui.storageError

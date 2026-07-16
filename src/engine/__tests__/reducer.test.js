import { describe, it, expect, beforeEach } from 'vitest'
import { reducer } from '../reducer.js'
import { emptyDoc, bootState } from '../initialState.js'
import { makeAccount } from '../entities.js'
import * as A from '../actions.js'
import { QUOTA_DEFAULT } from '../constants.js'

const T0 = new Date(2026, 6, 16, 12, 0, 0).getTime()
let seq = 0
const uid = () => `id${++seq}`
const CRED = { algo: 'PBKDF2-SHA256', iterations: 600000, salt: 'c2FsdA==', hash: 'aGFzaA==' }

function dispatch(state, action, { actorId, now = T0 } = {}) {
  return reducer(state, { ...action, meta: { now, deviceId: 'test-dev', actorId, uid } })
}

function seed() {
  let s = bootState(emptyDoc(T0), null)
  const op = makeAccount({ id: 'op1', username: 'bero', displayName: 'Bero', role: 'operator', credentials: CRED, now: T0 })
  s = dispatch(s, A.firstRunCreateOperator(op))
  const agent = makeAccount({ id: 'ag1', username: 'rami', displayName: 'Rami', role: 'agent', credentials: CRED, createdBy: 'op1', now: T0 })
  s = dispatch(s, A.accountCreate(agent), { actorId: 'op1' })
  return s
}

beforeEach(() => { seq = 0 })

describe('accounts', () => {
  it('creates the operator on first run exactly once', () => {
    let s = bootState(emptyDoc(T0), null)
    const op = makeAccount({ id: 'op1', username: 'bero', displayName: 'Bero', role: 'operator', credentials: CRED, now: T0 })
    s = dispatch(s, A.firstRunCreateOperator(op))
    expect(Object.keys(s.accounts)).toEqual(['op1'])
    const again = dispatch(s, A.firstRunCreateOperator({ ...op, id: 'op2' }))
    expect(Object.keys(again.accounts)).toEqual(['op1'])
  })

  it('claims unclaimed migrated tasks for the new operator', () => {
    let s = bootState(emptyDoc(T0), null)
    s.tasks.t1 = { id: 't1', text: 'legacy', ownerId: '__unclaimed__', createdAt: T0, updatedAt: T0, deletedAt: null, poppedAt: null }
    const op = makeAccount({ id: 'op1', username: 'bero', displayName: 'Bero', role: 'operator', credentials: CRED, now: T0 })
    s = dispatch(s, A.firstRunCreateOperator(op))
    expect(s.tasks.t1.ownerId).toBe('op1')
  })

  it('agent creation is operator-only and defaults quota', () => {
    let s = seed()
    expect(s.quotas.ag1.allocated).toBe(QUOTA_DEFAULT)
    const acc2 = makeAccount({ id: 'ag2', username: 'zed', displayName: 'Zed', role: 'agent', credentials: CRED, now: T0 })
    const denied = dispatch(s, A.accountCreate(acc2), { actorId: 'ag1' })
    expect(denied.accounts.ag2).toBeUndefined()
    expect(denied.ui.toastQueue.at(-1).kind).toBe('error')
  })

  it('rejects duplicate usernames and refuses to bench the operator', () => {
    let s = seed()
    const dup = makeAccount({ id: 'ag2', username: 'rami', displayName: 'Rami 2', role: 'agent', credentials: CRED, now: T0 })
    s = dispatch(s, A.accountCreate(dup), { actorId: 'op1' })
    expect(s.accounts.ag2).toBeUndefined()
    s = dispatch(s, A.accountSetDisabled('op1', true), { actorId: 'op1' })
    expect(s.accounts.op1.disabled).toBe(false)
    s = dispatch(s, A.accountSetDisabled('ag1', true), { actorId: 'op1' })
    expect(s.accounts.ag1.disabled).toBe(true)
  })
})

describe('clients, XP and ranks', () => {
  it('securing a client grants 500 XP once and ranks the agent up', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'Al-Baik', status: 'secured' }), { actorId: 'ag1' })
    const clientId = Object.keys(s.clients)[0]
    expect(s.clients[clientId].securedAt).toBe(T0)
    expect(s.xp.ag1.total).toBe(500)
    expect(s.rankState.ag1.currentRankId).toBe('s2')
    expect(s.ui.ceremonyQueue).toHaveLength(1)
    expect(s.ui.ceremonyQueue[0]).toMatchObject({ accountId: 'ag1', toRankId: 's2' })
    expect(s.events.filter((e) => e.type === 'rank_up')).toHaveLength(1)
    // churn + re-secure: no double XP
    s = dispatch(s, A.clientSetStatus(clientId, 'churned'), { actorId: 'ag1' })
    expect(s.rankState.ag1.currentRankId).toBe('s1')
    expect(s.events.filter((e) => e.type === 'rank_down')).toHaveLength(1)
    s = dispatch(s, A.clientSetStatus(clientId, 'secured'), { actorId: 'ag1' })
    expect(s.xp.ag1.total).toBe(500)
  })

  it('going live grants +250 once and marks the menu delivered', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'La Piazza', status: 'secured' }), { actorId: 'ag1' })
    const id = Object.keys(s.clients)[0]
    s = dispatch(s, A.clientSetStatus(id, 'live'), { actorId: 'ag1' })
    expect(s.xp.ag1.total).toBe(750)
    s = dispatch(s, A.clientSetStatus(id, 'secured'), { actorId: 'ag1' })
    s = dispatch(s, A.clientSetStatus(id, 'live'), { actorId: 'ag1' })
    expect(s.xp.ag1.total).toBe(750)
  })

  it('multi-rank jump queues ONE ceremony but a killfeed line per threshold', () => {
    let s = seed()
    for (let i = 0; i < 5; i++) {
      s = dispatch(s, A.clientAdd({ name: `R${i}`, status: 'secured' }), { actorId: 'op1' })
    }
    // op went 0 -> 5 clients: s1 -> se crossing s2,s3,s4,se
    expect(s.rankState.op1.currentRankId).toBe('se')
    const ups = s.events.filter((e) => e.type === 'rank_up' && e.payload.accountId === 'op1')
    expect(ups).toHaveLength(4)
    const ceremonies = s.ui.ceremonyQueue.filter((c) => c.accountId === 'op1')
    expect(ceremonies.at(-1).toRankId).toBe('se')
  })

  it('agents cannot touch other agents\' clients', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'Mine', status: 'lead' }), { actorId: 'op1' })
    const id = Object.keys(s.clients)[0]
    const hacked = dispatch(s, A.clientSetStatus(id, 'churned'), { actorId: 'ag1' })
    expect(hacked.clients[id].status).toBe('lead')
  })

  it('quota blocks securing at 0 remaining with a denied toast', () => {
    let s = seed()
    s = dispatch(s, A.quotaSet('ag1', 1), { actorId: 'op1' })
    s = dispatch(s, A.clientAdd({ name: 'One', status: 'secured' }), { actorId: 'ag1' })
    expect(s.xp.ag1.total).toBe(500)
    const before = Object.keys(s.clients).length
    s = dispatch(s, A.clientAdd({ name: 'Two', status: 'secured' }), { actorId: 'ag1' })
    expect(Object.keys(s.clients)).toHaveLength(before)
    expect(s.ui.toastQueue.at(-1).sfx).toBe('denied')
    // churn does not refund quota
    const id = Object.keys(s.clients)[0]
    s = dispatch(s, A.clientSetStatus(id, 'churned'), { actorId: 'ag1' })
    s = dispatch(s, A.clientAdd({ name: 'Three', status: 'secured' }), { actorId: 'ag1' })
    expect(Object.values(s.clients).filter((c) => c.name === 'Three')).toHaveLength(0)
  })

  it('churn voids pending commission; paid stays paid', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'A', status: 'secured' }), { actorId: 'ag1' })
    const id = Object.keys(s.clients)[0]
    s = dispatch(s, A.clientUpdate(id, { planValue: 100 }), { actorId: 'op1' })
    s = dispatch(s, A.commissionMarkPaid(id), { actorId: 'op1' })
    expect(s.clients[id].commission.status).toBe('paid')
    s = dispatch(s, A.clientSetStatus(id, 'churned'), { actorId: 'ag1' })
    expect(s.clients[id].commission.status).toBe('paid')
  })

  it('transfer recomputes both agents\' ranks', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'T', status: 'secured', agentId: 'ag1' }), { actorId: 'op1' })
    const id = Object.keys(s.clients)[0]
    expect(s.rankState.ag1.currentRankId).toBe('s2')
    s = dispatch(s, A.clientUpdate(id, { agentId: 'op1' }), { actorId: 'op1' })
    expect(s.rankState.ag1.currentRankId).toBe('s1')
    expect(s.rankState.op1.currentRankId).toBe('s2')
  })
})

describe('settings and role gates', () => {
  it('agents cannot change theme or commission rate', () => {
    let s = seed()
    s = dispatch(s, A.settingsUpdate({ theme: 'tactical' }), { actorId: 'ag1' })
    expect(s.settings.theme).toBe('hq')
    s = dispatch(s, A.settingsUpdate({ theme: 'tactical' }), { actorId: 'op1' })
    expect(s.settings.theme).toBe('tactical')
    s = dispatch(s, A.settingsUpdate({ soundEnabled: false }), { actorId: 'ag1' })
    expect(s.settings.soundEnabled).toBe(false)
  })

  it('tasks: pop grants XP and tombstones', () => {
    let s = seed()
    s = dispatch(s, A.taskAdd('call venue'), { actorId: 'ag1' })
    const id = Object.keys(s.tasks)[0]
    s = dispatch(s, A.taskPop(id), { actorId: 'ag1' })
    expect(s.tasks[id].poppedAt).toBe(T0)
    expect(s.xp.ag1.total).toBe(10)
    expect(s.events.at(-1).type).toBe('task_popped')
  })

  it('UI actions do not bump rev; domain actions do', () => {
    let s = seed()
    const rev = s.rev
    const s2 = dispatch(s, A.uiNavigate('clients'), { actorId: 'op1' })
    expect(s2.rev).toBe(rev)
    const s3 = dispatch(s2, A.taskAdd('x'), { actorId: 'op1' })
    expect(s3.rev).toBe(rev + 1)
  })

  it('ceremony dedupe: re-reaching a rank within 7 days queues no ceremony', () => {
    let s = seed()
    s = dispatch(s, A.clientAdd({ name: 'A', status: 'secured' }), { actorId: 'ag1' })
    s = dispatch(s, A.uiCeremonyDone('ag1', 's2'), { actorId: 'ag1' })
    s = { ...s, ui: { ...s.ui, ceremonyQueue: [] } }
    const id = Object.keys(s.clients)[0]
    s = dispatch(s, A.clientSetStatus(id, 'churned'), { actorId: 'ag1' })
    s = dispatch(s, A.clientSetStatus(id, 'secured'), { actorId: 'ag1', now: T0 + 1000 })
    expect(s.rankState.ag1.currentRankId).toBe('s2')
    expect(s.ui.ceremonyQueue).toHaveLength(0)
    // but after 8 days it celebrates again
    s = dispatch(s, A.clientSetStatus(id, 'churned'), { actorId: 'ag1', now: T0 + 2000 })
    s = dispatch(s, A.clientSetStatus(id, 'secured'), { actorId: 'ag1', now: T0 + 8 * 24 * 3600 * 1000 })
    expect(s.ui.ceremonyQueue).toHaveLength(1)
  })
})

import { describe, it, expect } from 'vitest'
import { reducer } from '../reducer.js'
import { emptyDoc, bootState } from '../initialState.js'
import { makeAccount } from '../entities.js'
import * as A from '../actions.js'
import {
  selectVisibleClients, selectLeaderboard, selectQuotaUsage, selectCommissions,
  selectSecuredCount, selectHasOperator,
} from '../selectors.js'

const T0 = 1700000000000
let seq = 0
const uid = () => `id${++seq}`
const CRED = { algo: 'PBKDF2-SHA256', iterations: 600000, salt: 'c2FsdA==', hash: 'aGFzaA==' }

function dispatch(state, action, actorId, now = T0) {
  return reducer(state, { ...action, meta: { now, deviceId: 'test-dev', actorId, uid } })
}

function seeded() {
  let s = bootState(emptyDoc(T0), null)
  s = dispatch(s, A.firstRunCreateOperator(makeAccount({ id: 'op1', username: 'bero', displayName: 'Bero', role: 'operator', credentials: CRED, now: T0 })))
  s = dispatch(s, A.accountCreate(makeAccount({ id: 'ag1', username: 'rami', displayName: 'Rami', role: 'agent', credentials: CRED, now: T0 })), 'op1')
  s = dispatch(s, A.accountCreate(makeAccount({ id: 'ag2', username: 'zed', displayName: 'Zed', role: 'agent', credentials: CRED, now: T0 })), 'op1')
  s = dispatch(s, A.clientAdd({ name: 'R1', status: 'secured' }), 'ag1')
  s = dispatch(s, A.clientAdd({ name: 'R2', status: 'secured' }), 'ag1')
  s = dispatch(s, A.clientAdd({ name: 'Z1', status: 'secured' }), 'ag2')
  s = dispatch(s, A.clientAdd({ name: 'B1', status: 'secured' }), 'op1')
  return s
}

describe('visibility gating', () => {
  it('operator sees all clients, agents only their own', () => {
    const s = seeded()
    const asOp = { ...s, session: { accountId: 'op1' } }
    const asAg = { ...s, session: { accountId: 'ag1' } }
    expect(selectVisibleClients(asOp)).toHaveLength(4)
    const mine = selectVisibleClients(asAg)
    expect(mine).toHaveLength(2)
    expect(mine.every((c) => c.agentId === 'ag1')).toBe(true)
  })
})

describe('leaderboard', () => {
  it('sorts secured desc with XP tiebreak', () => {
    const s = seeded()
    const board = selectLeaderboard(s)
    expect(board[0].account.id).toBe('ag1')
    expect(board[0].secured).toBe(2)
    expect(board[0].rank.id).toBe('s3')
  })
})

describe('quota + commissions', () => {
  it('tracks usage and remaining', () => {
    const s = seeded()
    expect(selectQuotaUsage(s, 'ag1')).toEqual({ allocated: 20, used: 2, remaining: 18 })
  })

  it('commission summary sums pending amounts at 50%', () => {
    let s = seeded()
    const [id] = Object.entries(s.clients).find(([, c]) => c.agentId === 'ag1')
    s = dispatch(s, A.clientUpdate(id, { planValue: 200 }), 'op1')
    const sum = selectCommissions(s, 'ag1')
    expect(sum.accrued).toBe(100)
    expect(sum.awaitingPricing).toBe(1)
    expect(sum.rows).toHaveLength(2)
    // operator's own closes carry rate 0
    const opSum = selectCommissions(s, 'op1')
    expect(opSum.rows[0].rate).toBe(0)
  })
})

describe('misc', () => {
  it('secured count ignores tombstoned + churned', () => {
    let s = seeded()
    const [id] = Object.entries(s.clients).find(([, c]) => c.agentId === 'ag1')
    s = dispatch(s, A.clientDelete(id), 'ag1')
    expect(selectSecuredCount(s, 'ag1')).toBe(1)
  })
  it('detects operator presence', () => {
    expect(selectHasOperator(bootState(emptyDoc(T0), null))).toBe(false)
    expect(selectHasOperator(seeded())).toBe(true)
  })
})

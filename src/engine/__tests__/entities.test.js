import { describe, it, expect } from 'vitest'
import { makeAccount, makeClient, validateDoc, validUsername, normalizeUsername } from '../entities.js'
import { emptyDoc } from '../initialState.js'

const CRED = { algo: 'PBKDF2-SHA256', iterations: 600000, salt: 'x', hash: 'y' }

describe('usernames', () => {
  it('normalizes and validates', () => {
    expect(normalizeUsername('  Bero ')).toBe('bero')
    expect(validUsername('Bero')).toBe(true)
    expect(validUsername('ab')).toBe(false)
    expect(validUsername('has space')).toBe(false)
    expect(validUsername('way.too.long.username.here')).toBe(false)
    expect(validUsername('ok_name-1.x')).toBe(true)
  })
})

describe('validateDoc', () => {
  it('accepts an empty doc', () => {
    expect(validateDoc(emptyDoc(0))).toEqual([])
  })

  it('rejects bad roles, statuses, unknown agents and duplicate operators', () => {
    const doc = emptyDoc(0)
    doc.accounts.a = makeAccount({ id: 'a', username: 'aaa', displayName: 'A', role: 'operator', credentials: CRED, now: 0 })
    doc.accounts.b = makeAccount({ id: 'b', username: 'bbb', displayName: 'B', role: 'operator', credentials: CRED, now: 0 })
    doc.clients.c = { ...makeClient({ id: 'c', name: 'C', agentId: 'ghost', now: 0 }), status: 'weird' }
    const problems = validateDoc(doc)
    expect(problems.some((p) => p.includes('operator'))).toBe(true)
    expect(problems.some((p) => p.includes('bad status'))).toBe(true)
    expect(problems.some((p) => p.includes('unknown agentId'))).toBe(true)
  })

  it('rejects non-objects', () => {
    expect(validateDoc(null).length).toBeGreaterThan(0)
    expect(validateDoc('nope').length).toBeGreaterThan(0)
  })
})

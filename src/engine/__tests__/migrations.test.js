import { describe, it, expect } from 'vitest'
import { migrateDoc } from '../migrations.js'
import { emptyDoc } from '../initialState.js'
import { SCHEMA_VERSION } from '../constants.js'

const meta = { now: 1700000000000, uid: (() => { let i = 0; return () => `m${++i}` })() }

describe('migrateDoc', () => {
  it('passes a valid v1 doc through untouched', () => {
    const doc = emptyDoc(meta.now)
    const r = migrateDoc(doc, { bubbleTasks: null }, meta)
    expect(r.doc).toBe(doc)
    expect(r.migratedFromLegacy).toBe(false)
  })

  it('rescues legacy bubble-tasks strings as unclaimed tasks', () => {
    const r = migrateDoc(null, { bubbleTasks: ['call venue', 'design menu', '', 42] }, meta)
    const tasks = Object.values(r.doc.tasks)
    expect(tasks).toHaveLength(2)
    expect(tasks.every((t) => t.ownerId === '__unclaimed__')).toBe(true)
    expect(r.migratedFromLegacy).toBe(true)
  })

  it('boots empty when nothing exists', () => {
    const r = migrateDoc(null, { bubbleTasks: null }, meta)
    expect(Object.keys(r.doc.accounts)).toHaveLength(0)
    expect(r.doc.meta.schemaVersion).toBe(SCHEMA_VERSION)
  })

  it('refuses docs from a newer build', () => {
    const future = emptyDoc(meta.now)
    future.meta.schemaVersion = SCHEMA_VERSION + 1
    const r = migrateDoc(future, { bubbleTasks: null }, meta)
    expect(r.doc).toBeNull()
    expect(r.futureVersion).toBe(SCHEMA_VERSION + 1)
  })

  it('reseeds structurally corrupt docs and flags them', () => {
    const r = migrateDoc({ meta: { schemaVersion: 1 } }, { bubbleTasks: null }, meta)
    expect(r.corrupt).toBe(true)
    expect(Object.keys(r.doc.accounts)).toHaveLength(0)
  })
})

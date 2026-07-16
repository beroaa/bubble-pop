import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from './localStorageStub.js'
import { saveDoc, loadJson, loadLegacyTasks, getDeviceId, DOC_KEY, LEGACY_TASKS_KEY } from '../storage.js'
import { emptyDoc } from '../../engine/initialState.js'
import { EVENT_COMPACT_TO } from '../../engine/constants.js'

const T0 = 1700000000000
let map

beforeEach(() => { map = installLocalStorage() })

describe('doc persistence', () => {
  it('save → load roundtrip with read-back verify', () => {
    const doc = emptyDoc(T0)
    expect(saveDoc(doc, T0).ok).toBe(true)
    const loaded = loadJson(DOC_KEY, T0)
    expect(loaded.meta.lastSavedAt).toBe(T0)
    expect(loaded.settings.theme).toBe('hq')
  })

  it('corrupt doc is backed up, removed, and returns null', () => {
    localStorage.setItem(DOC_KEY, '{broken json')
    expect(loadJson(DOC_KEY, T0)).toBeNull()
    expect(localStorage.getItem(DOC_KEY)).toBeNull()
    expect([...map.keys()].some((k) => k.startsWith(`clientos.corrupt.${DOC_KEY}`))).toBe(true)
  })

  it('quota error triggers compaction (events pruned to 500)', () => {
    const doc = emptyDoc(T0)
    for (let i = 0; i < 1000; i++) doc.events.push({ id: `e${i}`, ts: T0 + i, type: 'task_popped', actorId: 'x', deviceId: 'd', payload: {} })
    let failures = 1
    const realSet = localStorage.setItem
    localStorage.setItem = (k, v) => {
      if (k === DOC_KEY && failures > 0) { failures--; const err = new Error('quota'); err.name = 'QuotaExceededError'; throw err }
      return realSet(k, v)
    }
    expect(saveDoc(doc, T0).ok).toBe(true)
    const loaded = loadJson(DOC_KEY, T0)
    expect(loaded.events).toHaveLength(EVENT_COMPACT_TO)
    expect(loaded.events.at(-1).id).toBe('e999')
  })

  it('persistent quota failure reports code quota', () => {
    localStorage.setItem = () => { const err = new Error('quota'); err.name = 'QuotaExceededError'; throw err }
    expect(saveDoc(emptyDoc(T0), T0)).toEqual({ ok: false, code: 'quota' })
  })
})

describe('legacy + device', () => {
  it('reads legacy bubble-tasks and leaves unreadable ones alone', () => {
    localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(['a', 'b']))
    expect(loadLegacyTasks()).toEqual(['a', 'b'])
    localStorage.setItem(LEGACY_TASKS_KEY, 'not-json')
    expect(loadLegacyTasks()).toBeNull()
    expect(localStorage.getItem(LEGACY_TASKS_KEY)).toBe('not-json')
  })

  it('device id is stable across calls', () => {
    const a = getDeviceId(T0)
    const b = getDeviceId(T0 + 5000)
    expect(a).toBe(b)
    expect(a).toMatch(/^[0-9a-f]{16}$/)
  })
})

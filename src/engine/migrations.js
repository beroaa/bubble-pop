import { SCHEMA_VERSION } from './constants.js'
import { emptyDoc } from './initialState.js'
import { makeTask } from './entities.js'
import { validateDoc } from './entities.js'

// migrateDoc(rawDocOrNull, legacy, meta) -> { doc, migratedFromLegacy, futureVersion }
//   rawDocOrNull: parsed clientos.v1.doc value or null
//   legacy: { bubbleTasks: string[] | null } — the old `bubble-tasks` key
//   meta: { now, uid } — time + id factory injected by the caller
//
// v0 -> v1: rescue bubble-pop tasks as unclaimed tasks; FIRST_RUN_CREATE_OPERATOR
// reassigns `__unclaimed__` owners to the new operator.
export function migrateDoc(rawDocOrNull, legacy, meta) {
  if (rawDocOrNull && typeof rawDocOrNull === 'object') {
    const v = rawDocOrNull.meta?.schemaVersion
    if (typeof v === 'number' && v > SCHEMA_VERSION) {
      return { doc: null, migratedFromLegacy: false, futureVersion: v }
    }
    if (v === SCHEMA_VERSION && validateDoc(rawDocOrNull).length === 0) {
      return { doc: rawDocOrNull, migratedFromLegacy: false, futureVersion: null }
    }
    // structurally broken v1 doc: treat as corrupt (caller backs up raw string) and reseed
    return { doc: emptyDoc(meta.now), migratedFromLegacy: false, futureVersion: null, corrupt: true }
  }

  const doc = emptyDoc(meta.now)
  let migratedFromLegacy = false
  if (Array.isArray(legacy?.bubbleTasks)) {
    for (const text of legacy.bubbleTasks) {
      if (typeof text !== 'string' || !text.trim()) continue
      const task = makeTask({ id: meta.uid(), text, ownerId: '__unclaimed__', now: meta.now })
      doc.tasks[task.id] = task
      migratedFromLegacy = true
    }
  }
  return { doc, migratedFromLegacy, futureVersion: null }
}

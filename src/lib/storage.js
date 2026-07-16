// Persistence for the single ClientOS doc: debounced writes, read-back verify,
// corruption backup, quota-error compaction. All setItem/parse in try/catch —
// storage failure must never take the app down.
import { EVENT_COMPACT_TO, TOMBSTONE_TTL_DAYS } from '../engine/constants.js'

export const DOC_KEY = 'clientos.v1.doc'
export const DEVICE_KEY = 'clientos.v1.device'
export const LEGACY_TASKS_KEY = 'bubble-tasks'
const DEBOUNCE_MS = 300

export function loadRaw(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

// Parse a stored JSON value; on corruption, back the raw string up and return null.
export function loadJson(key, now = Date.now()) {
  const raw = loadRaw(key)
  if (raw == null) return null
  try {
    return JSON.parse(raw)
  } catch {
    backupCorrupt(key, raw, now)
    try { localStorage.removeItem(key) } catch { /* ignore */ }
    return null
  }
}

export function backupCorrupt(key, raw, now = Date.now()) {
  try { localStorage.setItem(`clientos.corrupt.${key}.${now}`, raw) } catch { /* best effort */ }
}

export function getDeviceId(now = Date.now()) {
  const existing = loadJson(DEVICE_KEY, now)
  if (existing?.deviceId) return existing.deviceId
  const array = new Uint8Array(8)
  globalThis.crypto.getRandomValues(array)
  const deviceId = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
  try { localStorage.setItem(DEVICE_KEY, JSON.stringify({ deviceId, createdAt: now })) } catch { /* memory-only */ }
  return deviceId
}

export function loadLegacyTasks() {
  const raw = loadRaw(LEGACY_TASKS_KEY)
  if (raw == null) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null // unreadable: leave the key alone, migrate nothing
  }
}

export function clearLegacyTasks() {
  try { localStorage.removeItem(LEGACY_TASKS_KEY) } catch { /* ignore */ }
}

function isQuotaError(e) {
  return e && (e.name === 'QuotaExceededError' || e.code === 22 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
}

function compact(doc, now) {
  const cutoff = now - TOMBSTONE_TTL_DAYS * 24 * 60 * 60 * 1000
  const next = { ...doc, events: doc.events.slice(-EVENT_COMPACT_TO), clients: { ...doc.clients }, tasks: { ...doc.tasks } }
  for (const [id, c] of Object.entries(next.clients)) if (c.deletedAt && c.deletedAt < cutoff) delete next.clients[id]
  for (const [id, t] of Object.entries(next.tasks)) if (t.deletedAt && t.deletedAt < cutoff && !t.poppedAt) delete next.tasks[id]
  return next
}

// Synchronous save with read-back verify. Returns { ok, code? }.
export function saveDoc(doc, now = Date.now()) {
  const stamped = { ...doc, meta: { ...doc.meta, lastSavedAt: now } }
  let payload = JSON.stringify(stamped)
  try {
    localStorage.setItem(DOC_KEY, payload)
  } catch (e) {
    if (!isQuotaError(e)) return { ok: false, code: 'unavailable' }
    const compacted = compact(stamped, now)
    payload = JSON.stringify(compacted)
    try {
      localStorage.setItem(DOC_KEY, payload)
    } catch {
      return { ok: false, code: 'quota' }
    }
  }
  const readBack = loadRaw(DOC_KEY)
  if (readBack == null || readBack.length !== payload.length) return { ok: false, code: 'unavailable' }
  return { ok: true }
}

let timer = null
let pending = null
let onResult = null

export function configureSaver(handler) {
  onResult = handler
}

export function scheduleSave(doc) {
  pending = doc
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { timer = null; flushSave() }, DEBOUNCE_MS)
}

export function flushSave() {
  if (timer) { clearTimeout(timer); timer = null }
  if (!pending) return
  const doc = pending
  pending = null
  const result = saveDoc(doc)
  if (onResult) onResult(result)
}

// Flush when the app-mode window closes or hides.
export function armFlushOnHide() {
  const flush = () => flushSave()
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush() })
}

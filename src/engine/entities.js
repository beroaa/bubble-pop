import { USERNAME_RE, COMMISSION_RATE_DEFAULT } from './constants.js'

export function normalizeUsername(s) {
  return String(s ?? '').trim().toLowerCase()
}

export function validUsername(s) {
  return USERNAME_RE.test(normalizeUsername(s))
}

export function makeAccount({ id, username, displayName, role, credentials, mustChangePassword = false, createdBy = null, now }) {
  return {
    id,
    username: normalizeUsername(username),
    displayName: String(displayName ?? '').trim().slice(0, 40) || normalizeUsername(username),
    role,
    credentials,
    mustChangePassword,
    disabled: false,
    createdAt: now,
    createdBy,
    lastLoginAt: null,
    updatedAt: now,
    deletedAt: null,
  }
}

export function makeClient({ id, name, contact = '', notes = '', menuUrl = '', status = 'lead', agentId, now }) {
  return {
    id,
    name: String(name ?? '').trim().slice(0, 80),
    contact,
    notes,
    menuUrl,
    status,
    agentId,
    securedAt: null,
    commission: { rate: COMMISSION_RATE_DEFAULT, planValue: 0, status: 'pending', paidAt: null },
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }
}

export function makeTask({ id, text, ownerId, now }) {
  return { id, text: String(text ?? '').trim().slice(0, 120), ownerId, createdAt: now, updatedAt: now, deletedAt: null, poppedAt: null }
}

export function makeEvent({ id, ts, type, actorId, deviceId, payload = {} }) {
  return { id, ts, type, actorId, deviceId, payload }
}

const CLIENT_STATUSES = ['lead', 'secured', 'live', 'churned']
const ROLES = ['operator', 'agent']

// Returns a list of human-readable problems; [] means the doc is structurally sound.
export function validateDoc(doc) {
  const problems = []
  if (!doc || typeof doc !== 'object') return ['doc is not an object']
  if (!doc.meta || typeof doc.meta.schemaVersion !== 'number') problems.push('meta.schemaVersion missing')
  for (const slice of ['accounts', 'clients', 'quotas', 'xp', 'rankState', 'tasks']) {
    if (!doc[slice] || typeof doc[slice] !== 'object') problems.push(`${slice} missing`)
  }
  if (!Array.isArray(doc.events)) problems.push('events not an array')
  if (!doc.settings || typeof doc.settings !== 'object') problems.push('settings missing')
  if (problems.length) return problems
  let operators = 0
  for (const a of Object.values(doc.accounts)) {
    if (!ROLES.includes(a.role)) problems.push(`account ${a.id}: bad role ${a.role}`)
    if (!validUsername(a.username)) problems.push(`account ${a.id}: bad username`)
    if (a.role === 'operator' && !a.deletedAt) operators++
  }
  if (operators > 1) problems.push(`expected at most 1 operator, found ${operators}`)
  for (const c of Object.values(doc.clients)) {
    if (!CLIENT_STATUSES.includes(c.status)) problems.push(`client ${c.id}: bad status ${c.status}`)
    if (c.agentId && !doc.accounts[c.agentId]) problems.push(`client ${c.id}: unknown agentId`)
  }
  return problems
}

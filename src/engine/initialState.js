import { SCHEMA_VERSION, COMMISSION_RATE_DEFAULT } from './constants.js'

export function emptyDoc(now) {
  return {
    meta: { schemaVersion: SCHEMA_VERSION, createdAt: now, lastSavedAt: 0 },
    accounts: {},
    clients: {},
    quotas: {},
    xp: {},
    rankState: {},
    events: [],
    tasks: {},
    settings: {
      theme: 'hq',
      soundEnabled: true,
      volume: 0.85,
      commissionRate: COMMISSION_RATE_DEFAULT,
      currency: 'USD',
    },
  }
}

export function bootState(doc, session) {
  return {
    rev: 0,
    ...doc,
    session,
    ui: {
      view: 'hq',
      modal: null,
      ceremonyQueue: [],
      toastQueue: [],
      storageError: null,
    },
  }
}

// The persisted slice of a runtime state (strip rev/session/ui).
export function docOf(state) {
  const { meta, accounts, clients, quotas, xp, rankState, events, tasks, settings } = state
  return { meta, accounts, clients, quotas, xp, rankState, events, tasks, settings }
}

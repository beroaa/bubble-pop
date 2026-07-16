import { QUOTA_DEFAULT } from './constants.js'

// used = count of the agent's clients that were EVER secured (securedAt set),
// including churned and tombstoned — churn never refunds a menu.
export function quotaUsage(state, agentId) {
  const q = state.quotas[agentId]
  const allocated = q ? q.allocated : QUOTA_DEFAULT
  let used = 0
  for (const c of Object.values(state.clients)) {
    if (c.agentId === agentId && c.securedAt != null) used++
  }
  return { allocated, used, remaining: Math.max(0, allocated - used) }
}

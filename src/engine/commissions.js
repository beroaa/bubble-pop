// Commission summary for one account (agentId) or the whole company (agentId=null).
// A client's commission amount = rate × planValue; planValue 0 = awaiting pricing.
export function commissionSummary(state, agentId) {
  const rows = []
  let accrued = 0
  let paid = 0
  let awaitingPricing = 0
  for (const c of Object.values(state.clients)) {
    if (c.deletedAt) continue
    if (agentId && c.agentId !== agentId) continue
    if (c.securedAt == null) continue
    const { rate, planValue, status, paidAt } = c.commission
    if (status === 'void') continue
    const amount = rate * planValue
    if (planValue === 0) awaitingPricing++
    if (status === 'paid') paid += amount
    else accrued += amount
    rows.push({ clientId: c.id, clientName: c.name, agentId: c.agentId, rate, planValue, amount, status, paidAt, securedAt: c.securedAt })
  }
  rows.sort((a, b) => b.securedAt - a.securedAt)
  return { accrued, paid, awaitingPricing, rows }
}

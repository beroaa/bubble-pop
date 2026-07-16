import { RANKS } from './constants.js'

// Highest rank whose threshold is met. count = secured client count.
export function rankFor(count) {
  let r = RANKS[0]
  for (const rank of RANKS) if (count >= rank.clientsRequired) r = rank
  return r
}

export function rankByIndex(i) {
  return RANKS[i - 1] ?? null
}

export function rankById(id) {
  return RANKS.find((r) => r.id === id) ?? null
}

// Progress toward the next rank. At Global Elite: next=null, pct=1, label 'MAX'.
export function progress(count) {
  const rank = rankFor(count)
  const next = RANKS[rank.rankIndex] ?? null
  if (!next) return { rank, next: null, pct: 1, label: 'MAX' }
  const span = next.clientsRequired - rank.clientsRequired
  const pct = span > 0 ? (count - rank.clientsRequired) / span : 0
  return { rank, next, pct: Math.min(1, Math.max(0, pct)), label: `${count} / ${next.clientsRequired} clients` }
}

import { XP_VALUES, XP_PER_LEVEL, LEVEL_CAP, DAILY_CAPS } from './constants.js'

export function levelFor(total) {
  return Math.min(LEVEL_CAP, Math.floor(total / XP_PER_LEVEL) + 1)
}

export function levelProgress(total) {
  const level = levelFor(total)
  if (level >= LEVEL_CAP) return { level, pct: 1, into: 0, span: XP_PER_LEVEL }
  const into = total - (level - 1) * XP_PER_LEVEL
  return { level, pct: into / XP_PER_LEVEL, into, span: XP_PER_LEVEL }
}

export function emptyXp() {
  return { total: 0, keys: [], counters: { date: '', leads: 0, tasks: 0 } }
}

// Local calendar day from an epoch-ms stamp (meta.now — engine never calls Date.now()).
export function localDay(now) {
  const d = new Date(now)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Grant XP guarded by a once-key (e.g. `secured:<clientId>`). Returns a new xp record.
export function grantOnce(xp, key, amount) {
  const rec = xp ?? emptyXp()
  if (rec.keys.includes(key)) return rec
  return { ...rec, total: rec.total + amount, keys: [...rec.keys, key] }
}

// Grant XP guarded by a daily counter ('leads' | 'tasks'). Clock rollbacks grant nothing.
export function grantDaily(xp, counter, amount, now) {
  const rec = xp ?? emptyXp()
  const today = localDay(now)
  let counters = rec.counters
  if (counters.date !== today) {
    if (counters.date > today) return rec // stored date is in the future: clock rolled back
    counters = { date: today, leads: 0, tasks: 0 }
  }
  if (counters[counter] >= DAILY_CAPS[counter]) return { ...rec, counters }
  return { ...rec, total: rec.total + amount, counters: { ...counters, [counter]: counters[counter] + 1 } }
}

export { XP_VALUES }

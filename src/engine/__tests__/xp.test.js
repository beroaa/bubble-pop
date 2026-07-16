import { describe, it, expect } from 'vitest'
import { grantOnce, grantDaily, levelFor, levelProgress, emptyXp, localDay } from '../xp.js'
import { DAILY_CAPS, XP_VALUES, LEVEL_CAP } from '../constants.js'

const NOON = new Date(2026, 6, 16, 12, 0, 0).getTime()

describe('xp once-keys', () => {
  it('grants once per key', () => {
    let xp = grantOnce(emptyXp(), 'secured:abc', XP_VALUES.client_secured)
    expect(xp.total).toBe(500)
    xp = grantOnce(xp, 'secured:abc', XP_VALUES.client_secured)
    expect(xp.total).toBe(500)
    xp = grantOnce(xp, 'live:abc', XP_VALUES.client_live)
    expect(xp.total).toBe(750)
  })
})

describe('xp daily caps', () => {
  it('caps leads at 5/day and tasks at 10/day', () => {
    let xp = emptyXp()
    for (let i = 0; i < 8; i++) xp = grantDaily(xp, 'leads', XP_VALUES.lead_added, NOON)
    expect(xp.total).toBe(DAILY_CAPS.leads * XP_VALUES.lead_added)
    for (let i = 0; i < 15; i++) xp = grantDaily(xp, 'tasks', XP_VALUES.task_popped, NOON)
    expect(xp.total).toBe(DAILY_CAPS.leads * XP_VALUES.lead_added + DAILY_CAPS.tasks * XP_VALUES.task_popped)
  })

  it('resets on a new day', () => {
    let xp = emptyXp()
    for (let i = 0; i < 5; i++) xp = grantDaily(xp, 'leads', 50, NOON)
    const tomorrow = NOON + 24 * 60 * 60 * 1000
    xp = grantDaily(xp, 'leads', 50, tomorrow)
    expect(xp.total).toBe(300)
    expect(xp.counters.date).toBe(localDay(tomorrow))
  })

  it('grants nothing when the clock rolls back', () => {
    let xp = grantDaily(emptyXp(), 'leads', 50, NOON)
    const yesterday = NOON - 24 * 60 * 60 * 1000
    const after = grantDaily(xp, 'leads', 50, yesterday)
    expect(after.total).toBe(50)
  })
})

describe('levels', () => {
  it('starts at level 1 and caps at 40', () => {
    expect(levelFor(0)).toBe(1)
    expect(levelFor(999)).toBe(1)
    expect(levelFor(1000)).toBe(2)
    expect(levelFor(39000)).toBe(40)
    expect(levelFor(10_000_000)).toBe(LEVEL_CAP)
  })
  it('reports level progress', () => {
    const p = levelProgress(1500)
    expect(p.level).toBe(2)
    expect(p.pct).toBeCloseTo(0.5)
  })
})

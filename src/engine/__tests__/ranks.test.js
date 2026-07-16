import { describe, it, expect } from 'vitest'
import { RANKS } from '../constants.js'
import { rankFor, progress, rankByIndex } from '../ranks.js'

describe('rank ladder', () => {
  it('has exactly 18 ranks with monotonically increasing thresholds', () => {
    expect(RANKS).toHaveLength(18)
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].clientsRequired).toBeGreaterThan(RANKS[i - 1].clientsRequired)
    }
  })

  it("hits the founder's anchors", () => {
    expect(rankFor(0).name).toBe('Silver I')
    expect(rankFor(1).name).toBe('Silver II')
    expect(rankFor(100).name).toBe('Supreme Master First Class')
    expect(rankFor(200).name).toBe('The Global Elite')
  })

  it('is stable between thresholds', () => {
    expect(rankFor(4).id).toBe('s4')
    expect(rankFor(6).id).toBe('se')
    expect(rankFor(99).id).toBe('lem')
    expect(rankFor(199).id).toBe('smfc')
  })

  it('reports progress within a rank', () => {
    const p = progress(11)
    expect(p.rank.id).toBe('gn1')
    expect(p.next.id).toBe('gn2')
    expect(p.pct).toBeCloseTo((11 - 10) / (13 - 10))
    expect(p.label).toBe('11 / 13 clients')
  })

  it('caps at The Global Elite with MAX label', () => {
    const p = progress(5000)
    expect(p.rank.id).toBe('ge')
    expect(p.next).toBeNull()
    expect(p.pct).toBe(1)
    expect(p.label).toBe('MAX')
  })

  it('rankByIndex is 1-based', () => {
    expect(rankByIndex(1).id).toBe('s1')
    expect(rankByIndex(18).id).toBe('ge')
    expect(rankByIndex(19)).toBeNull()
  })
})

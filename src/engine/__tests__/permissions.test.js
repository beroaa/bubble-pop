import { describe, it, expect } from 'vitest'
import { PERMISSIONS, can } from '../permissions.js'

describe('permission matrix', () => {
  it('matches the agreed matrix snapshot', () => {
    expect(PERMISSIONS).toMatchSnapshot()
  })

  it('operator can do everything listed', () => {
    for (const perm of Object.keys(PERMISSIONS)) expect(can('operator', perm)).toBe(true)
  })

  it('agents are fenced out of operator controls', () => {
    for (const perm of ['team.createAgent', 'team.disableAgent', 'quota.set', 'clients.viewAll', 'commissions.viewAll', 'theme.set', 'settings.view', 'eventlog.viewAll']) {
      expect(can('agent', perm)).toBe(false)
    }
    for (const perm of ['clients.viewOwn', 'clients.addOwn', 'commissions.viewOwn', 'leaderboard.view', 'ranks.viewOwn', 'tasks.use']) {
      expect(can('agent', perm)).toBe(true)
    }
  })

  it('unknown roles/permissions are denied', () => {
    expect(can('admin', 'quota.set')).toBe(false)
    expect(can('operator', 'nuke.launch')).toBe(false)
  })
})

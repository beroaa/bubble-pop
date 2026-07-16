// Role permission matrix. Roles are stored lowercase; matrix keys are stable and
// become server-side policies when a real backend arrives — don't rename casually.
export const PERMISSIONS = Object.freeze({
  'team.createAgent': ['operator'],
  'team.disableAgent': ['operator'],
  'team.resetAgentPassword': ['operator'],
  'team.viewAgentList': ['operator'],
  'quota.set': ['operator'],
  'clients.viewAll': ['operator'],
  'clients.viewOwn': ['operator', 'agent'],
  'clients.editAll': ['operator'],
  'clients.addOwn': ['operator', 'agent'],
  'commissions.viewAll': ['operator'],
  'commissions.viewOwn': ['operator', 'agent'],
  'commissions.adjust': ['operator'],
  'settings.view': ['operator'],
  'theme.set': ['operator'],
  'leaderboard.view': ['operator', 'agent'],
  'ranks.viewOwn': ['operator', 'agent'],
  'tasks.use': ['operator', 'agent'],
  'eventlog.viewAll': ['operator'],
  'eventlog.viewOwn': ['operator', 'agent'],
})

export function can(role, permission) {
  const allowed = PERMISSIONS[permission]
  return Boolean(allowed && allowed.includes(role))
}

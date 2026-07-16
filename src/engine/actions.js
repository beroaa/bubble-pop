// Action creators. The dispatch wrapper (hooks/useAppState) stamps
// action.meta = { now, deviceId, actorId, uid } — reducers read time/identity ONLY from meta.

export const firstRunCreateOperator = (account) => ({ type: 'FIRST_RUN_CREATE_OPERATOR', payload: { account } })
export const loginSuccess = (accountId, session) => ({ type: 'LOGIN_SUCCESS', payload: { accountId, session } })
export const logout = () => ({ type: 'LOGOUT', payload: {} })
export const sessionExpired = () => ({ type: 'SESSION_EXPIRED', payload: {} })

export const accountCreate = (account) => ({ type: 'ACCOUNT_CREATE', payload: { account } })
export const accountUpdate = (id, patch) => ({ type: 'ACCOUNT_UPDATE', payload: { id, patch } })
export const accountSetCredentials = (id, credentials, mustChangePassword = false) =>
  ({ type: 'ACCOUNT_SET_CREDENTIALS', payload: { id, credentials, mustChangePassword } })
export const accountSetDisabled = (id, disabled) => ({ type: 'ACCOUNT_SET_DISABLED', payload: { id, disabled } })

export const clientAdd = (client) => ({ type: 'CLIENT_ADD', payload: { client } })
export const clientUpdate = (id, patch) => ({ type: 'CLIENT_UPDATE', payload: { id, patch } })
export const clientSetStatus = (id, status) => ({ type: 'CLIENT_SET_STATUS', payload: { id, status } })
export const clientDelete = (id) => ({ type: 'CLIENT_DELETE', payload: { id } })
export const commissionMarkPaid = (clientId) => ({ type: 'COMMISSION_MARK_PAID', payload: { clientId } })

export const quotaSet = (agentId, allocated) => ({ type: 'QUOTA_SET', payload: { agentId, allocated } })

export const taskAdd = (text) => ({ type: 'TASK_ADD', payload: { text } })
export const taskPop = (id) => ({ type: 'TASK_POP', payload: { id } })
export const taskDelete = (id) => ({ type: 'TASK_DELETE', payload: { id } })

export const settingsUpdate = (patch) => ({ type: 'SETTINGS_UPDATE', payload: { patch } })
export const importDoc = (doc) => ({ type: 'IMPORT_DOC', payload: { doc } })
export const factoryReset = () => ({ type: 'FACTORY_RESET', payload: {} })

export const uiNavigate = (view) => ({ type: 'UI_NAVIGATE', payload: { view } })
export const uiOpenModal = (kind, props = {}) => ({ type: 'UI_OPEN_MODAL', payload: { kind, props } })
export const uiCloseModal = () => ({ type: 'UI_CLOSE_MODAL', payload: {} })
export const uiDequeueCeremony = () => ({ type: 'UI_DEQUEUE_CEREMONY', payload: {} })
export const uiCeremonyDone = (accountId, rankId) => ({ type: 'UI_CEREMONY_DONE', payload: { accountId, rankId } })
export const uiToast = (kind, text, sfx) => ({ type: 'UI_TOAST', payload: { kind, text, sfx } })
export const uiDismissToast = (id) => ({ type: 'UI_DISMISS_TOAST', payload: { id } })
export const uiStorageError = (code) => ({ type: 'UI_STORAGE_ERROR', payload: { code } })

/* eslint-disable react-refresh/only-export-components -- provider + hooks share one module by design */
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { reducer } from '../engine/reducer.js'
import { bootState, docOf } from '../engine/initialState.js'
import { migrateDoc } from '../engine/migrations.js'
import { uid, cryptoRng } from '../engine/ids.js'
import {
  DOC_KEY, loadJson, loadRaw, backupCorrupt, getDeviceId, loadLegacyTasks, clearLegacyTasks,
  scheduleSave, flushSave, configureSaver, armFlushOnHide,
} from '../lib/storage.js'
import { getSession } from '../lib/session.js'

const StateCtx = createContext(null)
const DispatchCtx = createContext(() => {})

export const useAppState = () => useContext(StateCtx)
export const useDispatch = () => useContext(DispatchCtx)

const newId = () => uid(cryptoRng)

function boot() {
  const now = Date.now()
  const deviceId = getDeviceId(now)
  const raw = loadJson(DOC_KEY, now)
  const legacy = { bubbleTasks: loadLegacyTasks() }
  const result = migrateDoc(raw, legacy, { now, uid: newId })

  if (result.futureVersion) {
    const state = bootState(migrateDoc(null, { bubbleTasks: null }, { now, uid: newId }).doc, null)
    state.ui.storageError = 'future'
    return { state, deviceId, legacyPending: false }
  }
  if (result.corrupt) {
    const rawStr = loadRaw(DOC_KEY)
    if (rawStr) backupCorrupt(DOC_KEY, rawStr, now)
  }
  const doc = result.doc
  const session = getSession((id) => doc.accounts[id] ?? null, now)
  return { state: bootState(doc, session), deviceId, legacyPending: result.migratedFromLegacy }
}

export function AppProvider({ children }) {
  /* eslint-disable react-hooks/refs -- latest-value ref pattern: boot once, mirror state for the dispatch wrapper */
  const bootRef = useRef(null)
  if (!bootRef.current) bootRef.current = boot()
  const { deviceId, legacyPending } = bootRef.current

  const [state, rawDispatch] = useReducer(reducer, bootRef.current.state)
  const stateRef = useRef(state)
  stateRef.current = state
  const legacyRef = useRef(legacyPending)
  /* eslint-enable react-hooks/refs */

  const dispatch = useMemo(() => (action) => {
    rawDispatch({
      ...action,
      meta: {
        now: Date.now(),
        deviceId,
        actorId: stateRef.current.session?.accountId ?? null,
        uid: newId,
      },
    })
  }, [deviceId])

  // Persistence: debounced save on every rev bump; delete the legacy
  // bubble-tasks key only after a read-back-verified save.
  useEffect(() => {
    configureSaver((result) => {
      if (result.ok && legacyRef.current) {
        clearLegacyTasks()
        legacyRef.current = false
      }
      const code = result.ok ? null : result.code
      if (stateRef.current.ui.storageError !== code && stateRef.current.ui.storageError !== 'future') {
        dispatch({ type: 'UI_STORAGE_ERROR', payload: { code } })
      }
    })
    armFlushOnHide()
  }, [dispatch])

  useEffect(() => {
    if (state.ui.storageError === 'future') return
    scheduleSave(docOf(state))
  }, [state.rev]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export { flushSave }

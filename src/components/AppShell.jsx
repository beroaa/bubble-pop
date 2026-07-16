import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShakeLayer from '../fx/ShakeLayer.jsx'
import NavBar from './NavBar.jsx'
import ToastHost from './Toast.jsx'
import KillfeedOverlay from './Killfeed.jsx'
import RankCeremonyHost from './RankCeremony.jsx'
import RankBadge from './RankBadge.jsx'
import Icon from './Icon.jsx'
import HQView from './views/HQView.jsx'
import ClientsView from './views/ClientsView.jsx'
import SquadView from './views/SquadView.jsx'
import BoardView from './views/BoardView.jsx'
import TasksView from './tasks/TasksView.jsx'
import SettingsView from './views/SettingsView.jsx'
import { useAppState, useDispatch } from '../hooks/useAppState.jsx'
import { useSound } from '../hooks/useSound.js'
import { useViewport } from '../hooks/useViewport.js'
import { selectCurrentAccount, selectIsOperator, selectRank } from '../engine/selectors.js'
import { uiNavigate, settingsUpdate, uiNavigate as nav } from '../engine/actions.js'
import { EASE } from '../motion/tokens.js'
import { downloadText } from '../lib/fileio.js'
import { DOC_KEY, loadRaw } from '../lib/storage.js'

const VIEWS = { hq: HQView, clients: ClientsView, squad: SquadView, board: BoardView, tasks: TasksView, settings: SettingsView }
const ORDER = ['hq', 'clients', 'squad', 'board', 'tasks', 'settings']

export default function AppShell() {
  const state = useAppState()
  const dispatch = useDispatch()
  const sfx = useSound()
  const { isCompact } = useViewport()
  const me = selectCurrentAccount(state)
  const isOperator = selectIsOperator(state)
  const rank = selectRank(state, me.id)
  const view = state.ui.view in VIEWS && (state.ui.view !== 'squad' || isOperator) ? state.ui.view : 'hq'
  const View = VIEWS[view]
  const prevView = useRef(view)
  /* eslint-disable-next-line react-hooks/refs -- previous-value pattern for direction-aware slides */
  const dir = Math.sign(ORDER.indexOf(view) - ORDER.indexOf(prevView.current)) || 1
  useEffect(() => { prevView.current = view }, [view])

  const muted = !state.settings.soundEnabled

  return (
    <div className="app-shell" id="app-root">
      <header className="app-header">
        <button type="button" className="brand" onClick={() => dispatch(uiNavigate('hq'))}>
          <span className="brand-mark" aria-hidden="true">🎖</span>
          <span className="brand-text">
            <span className="overline brand-overline">Menu Sadah</span>
            <span className="brand-name display">ClientOS</span>
          </span>
        </button>
        <div className="header-actions">
          <button type="button" className="icon-btn" aria-label="Your rank" onClick={() => dispatch(uiNavigate('board'))}>
            <RankBadge rank={rank} size={28} />
          </button>
          <button
            type="button" className="icon-btn" aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={() => { dispatch(settingsUpdate({ soundEnabled: muted })); if (muted) sfx.uiClick() }}
          >
            <Icon name={muted ? 'volume-x' : 'volume'} />
          </button>
          <button type="button" className="icon-btn" aria-label="Settings" onClick={() => { sfx.uiClick(); dispatch(nav('settings')) }}>
            <Icon name="gear" />
          </button>
        </div>
      </header>

      {state.ui.storageError && state.ui.storageError !== 'future' && (
        <div className="storage-banner" role="alert">
          <Icon name="alert-triangle" size={16} />
          <span>{state.ui.storageError === 'quota' ? 'Storage is full — changes may not persist.' : 'Storage unavailable — running from memory.'}</span>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => downloadText(`clientos-backup-${Date.now()}.json`, loadRaw(DOC_KEY) ?? '{}')}>
            Download backup
          </button>
        </div>
      )}

      <ShakeLayer>
        <main className="app-main">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={view}
              className="view-page"
              custom={dir}
              initial={{ x: 24 * dir, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.22, ease: EASE.out } }}
              exit={{ x: -24 * dir, opacity: 0, transition: { duration: 0.15, ease: EASE.in } }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </main>
      </ShakeLayer>

      <NavBar view={view} isOperator={isOperator} onNavigate={(v) => dispatch(uiNavigate(v))} />
      {!isCompact && <div className="rail-spacer" aria-hidden="true" />}
      <KillfeedOverlay />
      <ToastHost />
      <RankCeremonyHost />
    </div>
  )
}

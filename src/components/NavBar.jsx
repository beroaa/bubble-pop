import { motion } from 'framer-motion'
import Icon from './Icon.jsx'
import { useViewport } from '../hooks/useViewport.js'
import { useSound } from '../hooks/useSound.js'

const TABS = [
  { id: 'hq', label: 'HQ', icon: 'home' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'squad', label: 'Squad', icon: 'shield', operatorOnly: true },
  { id: 'board', label: 'Board', icon: 'trophy' },
  { id: 'tasks', label: 'Tasks', icon: 'check-circle' },
]

export default function NavBar({ view, isOperator, onNavigate }) {
  const { isCompact } = useViewport()
  const sfx = useSound()
  const tabs = TABS.filter((t) => !t.operatorOnly || isOperator)

  return (
    <nav className={isCompact ? 'navbar navbar-bottom' : 'navbar navbar-rail'} aria-label="Main">
      {tabs.map((t) => {
        const active = view === t.id
        return (
          <motion.button
            key={t.id}
            type="button"
            className={`nav-tab ${active ? 'nav-active' : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => { sfx.uiClick(); onNavigate(t.id) }}
            aria-current={active ? 'page' : undefined}
          >
            {active && <motion.span layoutId="tab-indicator" className="nav-indicator" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            <motion.span animate={active ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.2 }} className="nav-icon">
              <Icon name={t.icon} size={24} />
            </motion.span>
            <span className="nav-label">{t.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}

// Killfeed: one event source, two renderings — the transient top-right overlay
// (max 5, TTL 8/12s) and reusable rows for the Activity card / full log.
// The overlay effect also owns event-driven sounds/particles (reducer stays pure).
/* eslint-disable react-refresh/only-export-components -- row renderer + helpers live with the feed */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState } from '../hooks/useAppState.jsx'
import { useSound } from '../hooks/useSound.js'
import { useFX } from '../motion/useFX.js'
import Icon from './Icon.jsx'
import { rankById } from '../engine/ranks.js'
import { SPRING, EASE } from '../motion/tokens.js'

const BIG = new Set(['rank_up', 'rank_down', 'client_secured', 'commission_paid'])

export function eventParts(ev, accounts) {
  const name = ev.payload.name ?? accounts?.[ev.actorId]?.displayName ?? 'someone'
  switch (ev.type) {
    case 'client_secured': return { icon: 'crosshair', actor: name, verb: 'secured', object: ev.payload.clientName, accent: 'positive' }
    case 'client_live': return { icon: 'check-circle', actor: name, verb: 'delivered menu for', object: ev.payload.clientName, accent: 'info' }
    case 'client_churned': return { icon: 'alert-triangle', actor: name, verb: 'lost', object: ev.payload.clientName, accent: 'negative' }
    case 'client_deleted': return { icon: 'x', actor: name, verb: 'removed', object: ev.payload.clientName, accent: 'negative' }
    case 'lead_added': return { icon: 'plus', actor: name, verb: 'added lead', object: ev.payload.clientName, accent: 'info' }
    case 'rank_up': return { icon: 'star', actor: ev.payload.name, verb: 'RANKED UP', object: ev.payload.rankName, accent: 'accent', rankId: ev.payload.rankId }
    case 'rank_down': return { icon: 'star', actor: ev.payload.name, verb: 'deranked to', object: ev.payload.rankName, accent: 'negative', rankId: ev.payload.rankId }
    case 'quota_set': return { icon: 'shield', actor: 'Operator', verb: 'set quota for', object: `${ev.payload.name} → ${ev.payload.allocated}`, accent: 'warning' }
    case 'task_popped': return { icon: 'check-circle', actor: name, verb: 'popped', object: ev.payload.text, accent: 'info' }
    case 'commission_paid': return { icon: 'trophy', actor: 'Operator', verb: 'paid out', object: ev.payload.clientName, accent: 'accent' }
    case 'agent_joined': return { icon: 'users', actor: ev.payload.name, verb: 'joined the', object: 'squad', accent: 'accent' }
    default: return { icon: 'crosshair', actor: name, verb: ev.type, object: '', accent: 'info' }
  }
}

export function KillfeedRow({ ev, accounts, when }) {
  const p = eventParts(ev, accounts)
  const rankColor = p.rankId ? rankById(p.rankId)?.colors.glow : null
  return (
    <div className={`feed-row feed-${p.accent}`}>
      <Icon name={p.icon} size={16} className="feed-icon" />
      <span className="feed-body">
        <b className="feed-actor" style={rankColor ? { color: rankColor } : undefined}>{p.actor}</b>
        <span className="feed-verb"> {p.verb} </span>
        <b className="feed-object">{p.object}</b>
      </span>
      {when && <time className="feed-time num">{when}</time>}
    </div>
  )
}

export function relTime(ts, now = Date.now()) {
  const s = Math.max(0, Math.floor((now - ts) / 1000))
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

// Fixed overlay feed. Also the app's event->fx dispatcher.
export default function KillfeedOverlay() {
  const state = useAppState()
  const sfx = useSound()
  const { burst, shake } = useFX()
  const [entries, setEntries] = useState([])
  const seen = useRef(null)

  useEffect(() => {
    if (seen.current === null) {
      // first mount: don't replay history
      seen.current = new Set(state.events.map((e) => e.id))
      return
    }
    const fresh = state.events.filter((e) => !seen.current.has(e.id))
    if (!fresh.length) return
    for (const e of fresh) seen.current.add(e.id)

    // one cue per batch, highest priority wins
    const order = ['rank_up', 'rank_down', 'commission_paid', 'client_secured', 'client_live', 'quota_set', 'agent_joined', 'lead_added']
    const top = order.find((t) => fresh.some((e) => e.type === t))
    if (top === 'rank_up') { /* ceremony owns the fanfare */ }
    else if (top === 'rank_down') sfx.rankDown()
    else if (top === 'commission_paid') sfx.mvpEarned()
    else if (top === 'client_secured') sfx.clientSecured()
    else if (top === 'client_live') sfx.menuDelivered()
    else if (top === 'quota_set' || top === 'agent_joined') sfx.quotaAssigned()
    else if (top === 'lead_added') sfx.xpTick()

    // securing feels like a confirm on the actor's own screen
    const secured = fresh.find((e) => e.type === 'client_secured')
    if (secured && secured.actorId === state.session?.accountId) {
      shake('sm')
      burst({ x: window.innerWidth / 2, y: window.innerHeight * 0.35, count: 30, spread: 1.2, angle: -Math.PI / 2, power: [300, 650] })
    }

    const now = Date.now()
    setEntries((prev) => {
      const next = [
        ...fresh.filter((e) => e.type !== 'task_popped').map((e) => ({ ev: e, expiresAt: now + (BIG.has(e.type) ? 12000 : 8000) })).reverse(),
        ...prev,
      ]
      return next.slice(0, 5)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.events])

  useEffect(() => {
    if (!entries.length) return
    const timer = setInterval(() => {
      const now = Date.now()
      setEntries((prev) => prev.filter((x) => x.expiresAt > now))
    }, 1000)
    return () => clearInterval(timer)
  }, [entries.length])

  return (
    <div className="killfeed" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {entries.map(({ ev }) => (
          <motion.div
            key={ev.id}
            layout
            initial={{ x: 96, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: BIG.has(ev.type) ? [1, 1.03, 1] : 1 }}
            exit={{ x: 24, opacity: 0, transition: { duration: 0.18, ease: EASE.in } }}
            transition={{ x: SPRING.feed, opacity: { duration: 0.15 }, layout: SPRING.soft, scale: { duration: 0.3, times: [0, 0.4, 1] } }}
            className="killfeed-entry"
          >
            <motion.div
              className="killfeed-highlight"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 1.3, times: [0, 0.69, 1], ease: 'linear' }}
            />
            <KillfeedRow ev={ev} accounts={state.accounts} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

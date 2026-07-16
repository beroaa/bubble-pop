// The identity screen: rank hero, XP + level bars, stat grid, activity feed.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppState, useDispatch } from '../../hooks/useAppState.jsx'
import {
  selectCurrentAccount, selectIsOperator, selectRankProgress, selectLevel,
  selectSecuredCount, selectLiveCount, selectCommissions, selectQuotaUsage,
  selectAgents, selectKillfeed, selectXpTotal,
} from '../../engine/selectors.js'
import { uiNavigate, uiOpenModal } from '../../engine/actions.js'
import RankBadge from '../RankBadge.jsx'
import XPBar from '../XPBar.jsx'
import StatTile, { money } from '../StatTile.jsx'
import { KillfeedRow, relTime } from '../Killfeed.jsx'
import Modal from '../Modal.jsx'

export default function HQView() {
  const state = useAppState()
  const dispatch = useDispatch()
  const [showLog, setShowLog] = useState(false)
  const me = selectCurrentAccount(state)
  const isOperator = selectIsOperator(state)
  const rp = selectRankProgress(state, me.id)
  const level = selectLevel(state, me.id)
  const xpTotal = selectXpTotal(state, me.id)
  const secured = selectSecuredCount(state, me.id)
  const live = selectLiveCount(state, isOperator ? null : me.id)
  const commissions = selectCommissions(state, isOperator ? null : me.id)
  const feed = selectKillfeed(state, 6)
  const [now] = useState(() => Date.now())

  return (
    <div className="view stack-6">
      <section className="rank-hero">
        <p className="overline dim">Current rank</p>
        <motion.div
          className="rank-hero-badge"
          style={{ filter: `drop-shadow(0 0 18px ${rp.rank.colors.glow}55)` }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <RankBadge rank={rp.rank} size={128} />
        </motion.div>
        <h1 className="rank-name display">{rp.rank.name}</h1>
        <div className="rank-progress">
          <XPBar pct={rp.next ? rp.pct : 1} />
          <div className="bar-caption">
            <span className="num">{rp.label}</span>
            {rp.next && (
              <span className="dim row-inline">
                next: {rp.next.name}
                <span className="next-badge"><RankBadge rank={rp.next} size={20} /></span>
              </span>
            )}
          </div>
        </div>
        <div className="level-line">
          <XPBar pct={level.pct} showTicks={false} statusColor="var(--info)" />
          <div className="bar-caption micro">
            <span className="num">LVL {level.level}</span>
            <span className="dim num">{xpTotal.toLocaleString()} XP</span>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <StatTile label="Clients secured" value={secured} />
        <StatTile label="Live menus" value={live} />
        <StatTile label={isOperator ? 'Commission owed' : 'Commission earned'} value={commissions.accrued} format={(v) => money(v)} />
        {isOperator
          ? <StatTile label="Squad size" value={selectAgents(state).length} />
          : <StatTile label="Menus left" value={selectQuotaUsage(state, me.id).remaining} />}
      </section>

      <section className="card feed-card">
        <div className="section-head">
          <h2 className="display">Activity</h2>
          <button type="button" className="link" onClick={() => setShowLog(true)}>View all</button>
        </div>
        {feed.length === 0
          ? <p className="dim small empty-line">Quiet so far. Secure a client and make some noise.</p>
          : feed.map((ev) => <KillfeedRow key={ev.id} ev={ev} accounts={state.accounts} when={relTime(ev.ts, now)} />)}
      </section>

      <section className="row gap-3">
        <motion.button
          type="button" className="btn btn-primary btn-lg grow" whileTap={{ scale: 0.97 }}
          onClick={() => { dispatch(uiNavigate('clients')); dispatch(uiOpenModal('client-add')) }}
        >
          Add client
        </motion.button>
        <motion.button type="button" className="btn btn-secondary btn-lg grow" whileTap={{ scale: 0.97 }} onClick={() => dispatch(uiNavigate('tasks'))}>
          Add task
        </motion.button>
      </section>

      <Modal open={showLog} title="Event log" onClose={() => setShowLog(false)} wide>
        <div className="log-scroll">
          {selectKillfeed(state, 200).map((ev) => (
            <KillfeedRow key={ev.id} ev={ev} accounts={state.accounts} when={relTime(ev.ts, now)} />
          ))}
        </div>
      </Modal>
    </div>
  )
}

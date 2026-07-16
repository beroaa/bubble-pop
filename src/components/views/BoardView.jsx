// Leaderboard: podium + ranked rows + the 18-badge ladder strip.
import { motion } from 'framer-motion'
import { useAppState } from '../../hooks/useAppState.jsx'
import { selectLeaderboard, selectCurrentAccount } from '../../engine/selectors.js'
import { RANKS } from '../../engine/constants.js'
import RankBadge from '../RankBadge.jsx'
import { SPRING } from '../../motion/tokens.js'

export default function BoardView() {
  const state = useAppState()
  const me = selectCurrentAccount(state)
  const board = selectLeaderboard(state)
  const podium = board.slice(0, 3)
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean)

  return (
    <div className="view stack-6">
      <div className="section-head">
        <h1 className="display page-title">Leaderboard</h1>
        <span className="chip">All-time</span>
      </div>

      <div className="podium">
        {podiumOrder.map((row) => {
          const place = board.indexOf(row) + 1
          return (
            <motion.div
              key={row.account.id}
              className={`podium-col podium-${place}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING.soft, delay: place * 0.06 }}
            >
              <RankBadge rank={row.rank} size={place === 1 ? 88 : 64} className={place === 1 ? 'podium-glow' : ''} />
              <span className="small podium-name">{row.account.displayName}</span>
              <b className="h3 num">{row.secured}</b>
              <span className="micro dim">#{place}</span>
            </motion.div>
          )
        })}
      </div>

      <div className="card list-card">
        {board.map((row, i) => (
          <div key={row.account.id} className={`board-row ${row.account.id === me.id ? 'board-me' : ''} ${row.account.disabled ? 'agent-benched' : ''}`}>
            <span className="board-pos num dim">{i + 1}</span>
            <RankBadge rank={row.rank} size={36} />
            <span className="board-main">
              <span className="h3">{row.account.displayName}{row.account.id === me.id && <span className="micro dim"> (you)</span>}</span>
              <span className="micro dim">{row.rank.name}</span>
            </span>
            <span className="board-side">
              <b className="h3 num">{row.secured}</b>
              <span className="micro dim num">{row.xp.toLocaleString()} XP</span>
            </span>
          </div>
        ))}
      </div>

      <section className="stack-2">
        <h2 className="overline dim">The road to Global Elite</h2>
        <div className="ladder-strip">
          {RANKS.map((r) => {
            const meRow = board.find((b) => b.account.id === me.id)
            const current = meRow?.rank.id === r.id
            return (
              <div key={r.id} className={`ladder-item ${current ? 'ladder-current' : ''}`} title={`${r.name} — ${r.clientsRequired} clients`}>
                <RankBadge rank={r} size={current ? 44 : 32} />
                <span className="micro num dim">{r.clientsRequired}</span>
              </div>
            )
          })}
        </div>
        <p className="micro dim">Numbers are clients secured. 200 = The Global Elite. No pressure.</p>
      </section>
    </div>
  )
}

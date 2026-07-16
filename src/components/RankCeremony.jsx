// Rank-up ceremony: full-screen portal takeover driven by a timed stage
// machine (deterministic, skippable after 1.6s). Queued ceremonies play
// back-to-back with a 400ms gap and never overlap.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useAppState, useDispatch } from '../hooks/useAppState.jsx'
import { useSound } from '../hooks/useSound.js'
import { burst as rawBurst, spark as rawSpark } from '../fx/particles.js'
import { useShake } from '../fx/ShakeLayer.jsx'
import { uiDequeueCeremony, uiCeremonyDone } from '../engine/actions.js'
import { rankById } from '../engine/ranks.js'
import { selectRankProgress } from '../engine/selectors.js'
import RankBadge from './RankBadge.jsx'
import XPBar from './XPBar.jsx'
import { SPRING, EASE, Z } from '../motion/tokens.js'

const TIER_PALETTES = {
  silver: ['#C9CFD7', '#9AA3AE', '#EDF1F5', '#FFFFFF'],
  nova: ['#F5CF5A', '#D4A72C', '#FFF3D0', '#FFFFFF'],
  guardian: ['#5FA8E8', '#3D7BB8', '#EAF4FF', '#FFFFFF'],
  elite: ['#FFD75E', '#C438F0', '#7FB4FF', '#FFFFFF'],
}

export default function RankCeremonyHost() {
  const state = useAppState()
  const dispatch = useDispatch()
  const [gap, setGap] = useState(false)
  const head = state.ui.ceremonyQueue[0] ?? null
  const mine = head && head.accountId === state.session?.accountId

  // discard ceremonies that belong to someone else (killfeed already told the story)
  useEffect(() => {
    if (head && !mine) dispatch(uiDequeueCeremony())
  }, [head, mine, dispatch])

  if (!head || !mine || gap) return null
  return (
    <Ceremony
      key={`${head.accountId}:${head.toRankId}`}
      entry={head}
      state={state}
      onDone={() => {
        dispatch(uiCeremonyDone(head.accountId, head.toRankId))
        dispatch(uiDequeueCeremony())
        setGap(true)
        setTimeout(() => setGap(false), 400)
      }}
    />
  )
}

function Ceremony({ entry, state, onDone }) {
  const sfx = useSound()
  const shake = useShake()
  const reduced = useReducedMotion()
  const rank = rankById(entry.toRankId)
  const [stage, setStage] = useState('dim') // dim → slam → impact → reveal → refill → rest → exit
  const badgeRef = useRef(null)
  const doneRef = useRef(false)
  const rankProgress = selectRankProgress(state, entry.accountId)
  const refillPct = Math.round(rankProgress.pct * 100) / 100

  useEffect(() => {
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))
    if (reduced) {
      at(600, () => sfx.rankUp())
      at(700, () => setStage('reveal'))
      at(1000, () => setStage('refill'))
      at(1200, () => setStage('rest'))
      at(3000, () => setStage('exit'))
    } else {
      at(300, () => setStage('slam'))
      at(350, () => sfx.rankUp()) // internal chord at +270ms lands on the stamp
      at(620, () => {
        setStage('impact')
        shake('md')
        const el = badgeRef.current
        if (el) {
          const r = el.getBoundingClientRect()
          const palette = TIER_PALETTES[rank.badgeTier]
          rawBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 90, palette, power: [420, 900] })
          if (state.settings.theme === 'tactical') {
            rawSpark({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 24, palette, power: [600, 1100] })
          }
        }
      })
      at(780, () => setStage('reveal'))
      at(1400, () => setStage('refill'))
      at(1600, () => setStage('rest'))
      at(4200, () => setStage('exit'))
    }
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stage !== 'exit' || doneRef.current) return
    doneRef.current = true
    const t = setTimeout(onDone, 260)
    return () => clearTimeout(t)
  }, [stage, onDone])

  const dismissable = stage === 'rest'
  const stageIdx = ['dim', 'slam', 'impact', 'reveal', 'refill', 'rest', 'exit'].indexOf(stage)

  return createPortal(
    <AnimatePresence>
      {(
        <motion.div
          className="ceremony-overlay"
          style={{ zIndex: Z.ceremonyOverlay }}
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === 'exit' ? 0 : 1 }}
          transition={{ duration: stage === 'exit' ? 0.24 : 0.26, ease: stage === 'exit' ? EASE.in : EASE.out }}
          onPointerDown={() => { if (dismissable) setStage('exit') }}
          onKeyDown={(e) => { if (dismissable && e.key === 'Escape') setStage('exit') }}
        >
          <div className="ceremony-vignette" aria-hidden="true" />
          <div className="ceremony-content" style={{ zIndex: Z.ceremonyContent }}>
            <div className="ceremony-badge-wrap">
              <motion.div
                className="ceremony-glow"
                style={{ background: `radial-gradient(circle, ${rank.colors.glow}66 0%, transparent 70%)` }}
                initial={{ opacity: 0 }}
                animate={stageIdx >= 2 ? { opacity: [0, 1, 0.35] } : { opacity: 0 }}
                transition={{ duration: 0.5, times: [0, 0.2, 1], ease: EASE.out }}
              />
              <motion.div
                ref={badgeRef}
                className="ceremony-badge"
                initial={reduced ? { opacity: 0, scale: 1 } : { scale: 2.6, opacity: 0, rotate: -8, filter: 'blur(10px)' }}
                animate={
                  reduced
                    ? { opacity: 1, transition: { duration: 0.3, delay: 0.2 } }
                    : stageIdx >= 1
                      ? {
                          scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)',
                          transition: {
                            scale: SPRING.slam, rotate: SPRING.slam,
                            opacity: { duration: 0.18, ease: 'linear' },
                            filter: { duration: 0.25, ease: EASE.out },
                          },
                        }
                      : {}
                }
              >
                <RankBadge rank={rank} size={240} />
                {!reduced && (
                  <div className="ceremony-shine-mask" aria-hidden="true">
                    <motion.div
                      className="ceremony-shine"
                      initial={{ x: '-130%', opacity: 0 }}
                      animate={stageIdx >= 2 ? { x: '130%', opacity: [0, 1, 1, 0] } : {}}
                      transition={{ duration: 0.45, ease: EASE.sweep, times: [0, 0.15, 0.85, 1] }}
                    />
                  </div>
                )}
              </motion.div>
            </div>

            <motion.p
              className="ceremony-kicker overline"
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={stageIdx >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.22, ease: EASE.out }}
            >
              Rank up
            </motion.p>

            <h1 className="ceremony-name display" aria-label={rank.name}>
              {reduced ? (
                <motion.span initial={{ opacity: 0 }} animate={stageIdx >= 3 ? { opacity: 1 } : {}} transition={{ duration: 0.25 }}>
                  {rank.name}
                </motion.span>
              ) : (
                <motion.span
                  initial="hidden"
                  animate={stageIdx >= 3 ? 'show' : 'hidden'}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.028 } } }}
                >
                  {rank.name.split('').map((ch, i) => (
                    <motion.span
                      key={i}
                      className="ceremony-letter"
                      variants={{
                        hidden: { y: 18, opacity: 0, filter: 'blur(6px)' },
                        show: {
                          y: 0, opacity: 1, filter: 'blur(0px)',
                          transition: { y: { type: 'spring', stiffness: 600, damping: 34 }, opacity: { duration: 0.15 }, filter: { duration: 0.2, ease: EASE.out } },
                        },
                      }}
                    >
                      {ch === ' ' ? ' ' : ch}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </h1>

            <motion.div
              className="ceremony-xp"
              initial={{ opacity: 0 }}
              animate={stageIdx >= 4 ? { opacity: 1 } : {}}
              transition={{ duration: 0.2 }}
            >
              <XPBar pct={stageIdx >= 4 ? refillPct : 0} showTicks={false} />
              <span className="small dim num">{rankProgress.label}{rankProgress.next ? ` → ${rankProgress.next.code}` : ''}</span>
            </motion.div>
          </div>

          <motion.p
            className="ceremony-hint overline"
            style={{ zIndex: Z.ceremonyHint }}
            initial={{ opacity: 0 }}
            animate={dismissable ? { opacity: [0, 0.7, 0.4, 0.7] } : {}}
            transition={{ duration: 2.4, times: [0, 0.2, 0.6, 1], repeat: Infinity, repeatType: 'mirror' }}
          >
            Tap to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

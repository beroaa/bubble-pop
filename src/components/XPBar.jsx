// XP / progress bar: scaleX motion value (never width), never animates
// backwards — overflow = fill → flash → hard snap to 0 → refill.
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { SPRING, EASE } from '../motion/tokens.js'

export default function XPBar({ pct, statusColor, showTicks = true, onLevelCross }) {
  const progress = useMotionValue(pct)
  const prevPct = useRef(pct)
  const [flash, setFlash] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const from = prevPct.current
    prevPct.current = pct
    if (reduced) { progress.set(pct); return }
    if (pct >= from) {
      const controls = animate(progress, pct, { ...SPRING.bar, restDelta: 0.001 })
      return () => controls.stop()
    }
    // target below current fill = a level/rank boundary was crossed:
    // fill to full, flash, snap to 0, then refill to the carried-over pct.
    let cancelled = false
    const run = async () => {
      await animate(progress, 1, { duration: 0.26, ease: EASE.out }).finished
      if (cancelled) return
      setFlash((f) => f + 1)
      onLevelCross?.()
      progress.set(0)
      await new Promise((r) => setTimeout(r, 120))
      if (cancelled) return
      animate(progress, pct, { ...SPRING.bar, restDelta: 0.001 })
    }
    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct, reduced])

  return (
    <div className={`xpbar ${statusColor ? 'xpbar-status' : ''}`} style={statusColor ? { '--status-fill': statusColor } : undefined}>
      <motion.div className="xpbar-fill" style={{ scaleX: progress, transformOrigin: 'left center' }} />
      {showTicks && (
        <div className="xpbar-ticks" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ left: `${(i + 1) * 10}%` }} />)}
        </div>
      )}
      {flash > 0 && (
        <motion.div
          key={flash}
          className="xpbar-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.18, times: [0, 0.3, 1] }}
        />
      )}
    </div>
  )
}

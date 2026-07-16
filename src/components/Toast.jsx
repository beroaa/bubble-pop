import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState, useDispatch } from '../hooks/useAppState.jsx'
import { useSound } from '../hooks/useSound.js'
import { uiDismissToast } from '../engine/actions.js'
import { SPRING } from '../motion/tokens.js'

export default function ToastHost() {
  const state = useAppState()
  const dispatch = useDispatch()
  const sfx = useSound()
  const toasts = state.ui.toastQueue.slice(-3)

  useEffect(() => {
    const latest = state.ui.toastQueue.at(-1)
    if (!latest) return
    if (latest.sfx === 'denied') sfx.denied()
    if (latest.sfx === 'levelUp') sfx.levelUp()
    const timer = setTimeout(() => dispatch(uiDismissToast(latest.id)), 3500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ui.toastQueue.at(-1)?.id])

  return (
    <div className="toast-host" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast-${t.kind}`}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={SPRING.soft}
            onClick={() => dispatch(uiDismissToast(t.id))}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

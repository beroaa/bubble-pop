// Bottom sheet on portrait, centered 480px dialog on desktop.
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING, DUR, EASE } from '../motion/tokens.js'
import { useViewport } from '../hooks/useViewport.js'

export default function Modal({ open, title, onClose, children, wide = false }) {
  const { isCompact } = useViewport()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    panelRef.current?.querySelector('input, button, select, textarea')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: DUR.sm }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
        >
          <motion.div
            ref={panelRef}
            className={`modal-panel hud-corners ${wide ? 'modal-wide' : ''}`}
            role="dialog" aria-modal="true" aria-label={title}
            initial={isCompact ? { y: '100%' } : { scale: 0.96, opacity: 0 }}
            animate={isCompact ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isCompact ? { y: '100%', transition: { duration: DUR.sm, ease: EASE.in } } : { scale: 0.96, opacity: 0, transition: { duration: DUR.xs } }}
            transition={isCompact ? SPRING.soft : { duration: DUR.sm, ease: EASE.out }}
          >
            {isCompact && <div className="modal-handle" aria-hidden="true" />}
            {title && <h2 className="modal-title display">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

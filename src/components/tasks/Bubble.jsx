// The original Bubble Pop bubble, ported onto tokens — the founding feature lives on.
import { motion } from 'framer-motion'
import { EASE } from '../../motion/tokens.js'

export default function Bubble({ task, index, small, onPop }) {
  return (
    <motion.button
      type="button"
      className={`bubble ${small ? 'bubble-sm' : ''}`}
      onClick={(e) => onPop(task.id, e)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
      exit={{ scale: 1.4, opacity: 0, transition: { duration: 0.18, ease: EASE.out } }}
      transition={{
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.3 },
        y: { duration: 3 + (index % 3), repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {task.text}
    </motion.button>
  )
}

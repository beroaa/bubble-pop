// Number roll without React re-renders: motion value → span.textContent.
import { useEffect, useRef } from 'react'
import { animate, useMotionValue, useReducedMotion } from 'framer-motion'
import { EASE } from './tokens.js'

export function useCountUp(value, format = (v) => String(v)) {
  const ref = useRef(null)
  const mv = useMotionValue(value)
  const reduced = useReducedMotion()
  const first = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (first.current || reduced) {
      first.current = false
      mv.jump(value)
      el.textContent = format(Math.round(value))
      return
    }
    const delta = Math.abs(value - mv.get())
    const controls = animate(mv, value, {
      duration: Math.min(1.2, 0.35 + delta * 0.012),
      ease: EASE.out,
      onUpdate: (v) => { el.textContent = format(Math.round(v)) },
      onComplete: () => {
        el.textContent = format(Math.round(value))
        if (delta > 0) {
          el.classList.remove('count-pop')
          void el.offsetWidth
          el.classList.add('count-pop')
        }
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced])

  return ref
}

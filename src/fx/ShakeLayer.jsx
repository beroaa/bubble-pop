// Screen shake wrapper around app content (fixed overlays live OUTSIDE it).
// Translation only, 500ms cooldown, requests during cooldown are dropped.
/* eslint-disable react-refresh/only-export-components -- useShake hook lives with its provider */
import { createContext, useContext, useMemo, useRef } from 'react'
import { useAnimate } from 'framer-motion'

const ShakeCtx = createContext(() => {})
export const useShake = () => useContext(ShakeCtx)

const PATTERNS = {
  sm: { x: [0, -3, 2, -1, 0], y: [0, 2, -2, 1, 0], duration: 0.18 },
  md: { x: [0, -6, 5, -3, 2, 0], y: [0, 4, -4, 2, -1, 0], duration: 0.28 },
}

export default function ShakeLayer({ children, disabled }) {
  const [scope, animate] = useAnimate()
  const coolingRef = useRef(0)
  const shake = useMemo(() => (size = 'sm') => {
    if (disabled) return
    const now = performance.now()
    if (now - coolingRef.current < 500) return
    coolingRef.current = now
    const p = PATTERNS[size] ?? PATTERNS.sm
    animate(scope.current, { x: p.x, y: p.y }, { duration: p.duration, ease: 'linear' })
  }, [animate, scope, disabled])
  return (
    <ShakeCtx.Provider value={shake}>
      <div ref={scope} className="shake-layer">{children}</div>
    </ShakeCtx.Provider>
  )
}

// The single reduced-motion gate: no component calls particles/shake directly.
import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { burst as rawBurst, spark as rawSpark } from '../fx/particles.js'
import { useShake } from '../fx/ShakeLayer.jsx'

export function useFX() {
  const reduced = useReducedMotion()
  const shake = useShake()
  return useMemo(() => ({
    reduced,
    burst: reduced ? () => {} : rawBurst,
    spark: reduced ? () => {} : rawSpark,
    shake: reduced ? () => {} : shake,
    glowPulse(el) {
      if (!el) return
      el.classList.remove('glow-pulse')
      void el.offsetWidth
      el.classList.add('glow-pulse')
    },
  }), [reduced, shake])
}

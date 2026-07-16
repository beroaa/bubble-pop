import { useSyncExternalStore } from 'react'

const query = '(max-width: 767px)'

function subscribe(cb) {
  const mq = window.matchMedia(query)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useViewport() {
  const isCompact = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true)
  return { isCompact }
}

// sfx facade honoring settings.soundEnabled/volume (doc settings are the
// authority; the sounds module keeps only a runtime mirror).
import { useEffect } from 'react'
import { useAppState } from './useAppState.jsx'
import { sfx, setMuted, setVolume } from '../lib/sounds.js'

export function useSound() {
  const state = useAppState()
  const { soundEnabled, volume } = state.settings
  useEffect(() => {
    setMuted(!soundEnabled)
    setVolume(volume)
  }, [soundEnabled, volume])
  return sfx
}

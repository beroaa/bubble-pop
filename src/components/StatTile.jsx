/* eslint-disable react-refresh/only-export-components -- money() formatter lives with the tile */
import { useCountUp } from '../motion/useCountUp.js'

export default function StatTile({ label, value, format, suffix = '' }) {
  const ref = useCountUp(value, format)
  return (
    <div className="stat-tile hud-corners">
      <span className="overline">{label}</span>
      <b className="stat-value num"><span ref={ref} />{suffix}</b>
    </div>
  )
}

export function money(v) {
  return `$${Math.round(v).toLocaleString('en-US')}`
}

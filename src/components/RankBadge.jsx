// "Sadah Skill Groups" — 18 original geometric badges on a shared delta-shield
// plate, 4 tiers (silver / nova / guardian / elite). All geometry is original;
// badges do not change with theme and read on both grounds.
import { useId } from 'react'
import { RANKS } from '../engine/constants.js'

const TIERS = {
  silver:   { plate: '#23272E', line: '#9AA3AE', field: ['#C9CFD7', '#7E8894'], emblem: '#EDF1F5', pip: '#EDF1F5' },
  nova:     { plate: '#2A2114', line: '#B8860B', field: ['#F5CF5A', '#A87A1E'], emblem: '#FFF3D0', pip: '#FFE9A8' },
  guardian: { plate: '#101B2A', line: '#2F6FB2', field: ['#5FA8E8', '#2A5E9E'], emblem: '#EAF4FF', pip: '#BFE0FF' },
  elite:    { plate: '#1B1508', line: '#FFD75E', field: ['#3A3F52', '#14161F'], emblem: '#FFD75E', accent2: '#7FB4FF', pip: '#FFD75E' },
}

const PLATE = 'M32 4 L56 16 L56 38 L32 60 L8 38 L8 16 Z'
const TIER_START = { silver: 1, nova: 7, guardian: 11, elite: 15 }

// Four-point star: outer radius s, inner radius s/4 at the diagonals.
function starPath(cx, cy, s) {
  const q = s / 4
  return `M${cx} ${cy - s} L${cx + q} ${cy - q} L${cx + s} ${cy} L${cx + q} ${cy + q} L${cx} ${cy + s} L${cx - q} ${cy + q} L${cx - s} ${cy} L${cx - q} ${cy - q} Z`
}

function Chevrons({ count, color }) {
  const h = 8 + (count - 1) * 9
  const base = 34 + h / 2
  return (
    <g stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {Array.from({ length: count }, (_, i) => {
        const y = base - i * 9
        return <path key={i} d={`M20 ${y} L32 ${y - 8} L44 ${y}`} />
      })}
    </g>
  )
}

function Pips({ count, color }) {
  const startX = 32 - ((count - 1) * 8) / 2
  return (
    <g fill={color}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={startX + i * 8} cy="52" r="3" />
      ))}
    </g>
  )
}

function SilverEmblem({ pos, t }) {
  const chevrons = Math.min(pos, 4)
  return (
    <g>
      <Chevrons count={chevrons} color={t.emblem} />
      {pos === 6 && <path d={starPath(32, 12, 6)} fill={t.emblem} />}
    </g>
  )
}

function NovaEmblem({ pos, t }) {
  return (
    <g>
      {pos >= 2 && <path d="M15 32 A17 17 0 0 1 49 32" fill="none" stroke={t.emblem} strokeWidth="2" strokeDasharray="4 3" />}
      {pos >= 3 && <path d="M49 32 A17 17 0 0 1 15 32" fill="none" stroke={t.emblem} strokeWidth="2" strokeDasharray="4 3" />}
      {pos === 4 && <circle cx="32" cy="32" r="17" fill="none" stroke={t.emblem} strokeWidth="2" />}
      <path d="M32 14 L36 28 L50 32 L36 36 L32 50 L28 36 L14 32 L28 28 Z" fill={t.emblem} stroke={t.plate} strokeWidth="1" />
      {pos === 4 && (
        <path d="M32 23 L34 30 L41 32 L34 34 L32 41 L30 34 L23 32 L30 30 Z" fill="#A87A1E" transform="rotate(45 32 32)" />
      )}
    </g>
  )
}

function GuardianEmblem({ pos, t }) {
  return (
    <g stroke={t.emblem} strokeWidth="3" strokeLinecap="round" fill="none">
      <path d="M32 18 L44 24 L44 35 L32 46 L20 35 L20 24 Z" strokeLinejoin="miter" />
      <path d="M32 22 L32 42" />
      <path d="M26 27 L38 27" />
      {pos >= 2 && <><path d="M20 40 L14 30" /><path d="M44 40 L50 30" /></>}
      {pos >= 3 && <><path d="M15 42 L9 32" /><path d="M49 42 L55 32" /></>}
      {pos === 4 && <path d={starPath(32, 13, 5)} fill={t.emblem} stroke="none" />}
    </g>
  )
}

function EliteEmblem({ pos, t }) {
  const wingL = ['M20 26 L8 20', 'M20 32 L6 30', 'M20 38 L8 40']
  const wingR = ['M44 26 L56 20', 'M44 32 L58 30', 'M44 38 L56 40']
  if (pos >= 2) { wingL.push('M21 43 L10 48'); wingR.push('M43 43 L54 48') }
  return (
    <g>
      <g stroke={t.accent2} strokeWidth="3" strokeLinecap="round" fill="none">
        {wingL.map((d) => <path key={d} d={d} />)}
        {wingR.map((d) => <path key={d} d={d} />)}
      </g>
      {pos >= 3 && (
        <g stroke={t.emblem} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M13 40 Q16 54 32 58" />
          <path d="M51 40 Q48 54 32 58" />
        </g>
      )}
      {pos < 4 ? (
        <g>
          <path d="M32 18 L42 32 L32 46 L22 32 Z" fill={t.emblem} />
          {pos >= 2 && <path d="M32 25 L37 32 L32 39 L27 32 Z" fill={t.plate} />}
        </g>
      ) : (
        <g>
          <circle cx="32" cy="32" r="11" fill={t.emblem} />
          <g stroke="#1B1508" strokeWidth="1.5" fill="none">
            <ellipse cx="32" cy="32" rx="4.5" ry="11" />
            <ellipse cx="32" cy="32" rx="9" ry="11" />
            <path d="M32 21 L32 43" />
            <path d="M21 32 L43 32" />
          </g>
          <g fill={t.emblem}>
            <path d={starPath(26, 10, 3)} />
            <path d={starPath(32, 7, 3)} />
            <path d={starPath(38, 10, 3)} />
          </g>
        </g>
      )}
    </g>
  )
}

export default function RankBadge({ rank, size = 64, className = '' }) {
  const gid = useId()
  const r = typeof rank === 'number' ? RANKS[rank - 1] : rank
  const t = TIERS[r.badgeTier]
  const pos = r.rankIndex - TIER_START[r.badgeTier] + 1
  const plateStroke = r.id === 'se' || r.id === 'sem' ? '#EDF1F5' : t.line
  const showPips = (r.badgeTier === 'nova' || r.badgeTier === 'guardian') && pos > 1

  return (
    <svg
      className={`rank-badge ${r.id === 'ge' ? 'rank-badge-ge' : ''} ${className}`}
      width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={r.name}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.field[0]} />
          <stop offset="1" stopColor={t.field[1]} />
        </linearGradient>
      </defs>
      <path d={PLATE} fill={t.plate} stroke={plateStroke} strokeWidth="2" strokeLinejoin="miter" />
      <path d={PLATE} fill={`url(#${gid})`} transform="translate(32 32) scale(0.82) translate(-32 -32)" />
      {r.badgeTier === 'silver' && <SilverEmblem pos={pos} t={t} />}
      {r.badgeTier === 'nova' && <NovaEmblem pos={pos} t={t} />}
      {r.badgeTier === 'guardian' && <GuardianEmblem pos={pos} t={t} />}
      {r.badgeTier === 'elite' && <EliteEmblem pos={pos} t={t} />}
      {showPips && <Pips count={pos} color={t.pip} />}
      <polygon points="8,16 56,16 44,30 8,30" fill="#FFFFFF" opacity="0.07" className={r.id === 'ge' ? 'ge-sheen' : ''} />
    </svg>
  )
}

// Single source of truth for every tunable in ClientOS.
// engine/ is pure: no DOM, no localStorage, no Date.now(), no Math.random().

export const SCHEMA_VERSION = 1

// ---- Rank ladder ("Sadah Skill Groups") ----
// Rank is driven by secured client count (status secured|live, not deleted).
// XP is a separate prestige layer and can never rank you up.
export const RANKS = [
  { rankIndex: 1,  id: 's1',   name: 'Silver I',                      code: 'S1',   badgeTier: 'silver',   clientsRequired: 0,   colors: { base: '#545C66', accent: '#8A939E', glow: '#AEB9C5' } },
  { rankIndex: 2,  id: 's2',   name: 'Silver II',                     code: 'S2',   badgeTier: 'silver',   clientsRequired: 1,   colors: { base: '#5B646E', accent: '#929BA7', glow: '#B6C1CD' } },
  { rankIndex: 3,  id: 's3',   name: 'Silver III',                    code: 'S3',   badgeTier: 'silver',   clientsRequired: 2,   colors: { base: '#626B76', accent: '#99A3AF', glow: '#BEC9D5' } },
  { rankIndex: 4,  id: 's4',   name: 'Silver IV',                     code: 'S4',   badgeTier: 'silver',   clientsRequired: 3,   colors: { base: '#69737E', accent: '#A1ABB8', glow: '#C6D1DD' } },
  { rankIndex: 5,  id: 'se',   name: 'Silver Elite',                  code: 'SE',   badgeTier: 'silver',   clientsRequired: 5,   colors: { base: '#707B87', accent: '#A9B4C1', glow: '#CFDAE6' } },
  { rankIndex: 6,  id: 'sem',  name: 'Silver Elite Master',           code: 'SEM',  badgeTier: 'silver',   clientsRequired: 7,   colors: { base: '#78838F', accent: '#B2BDCA', glow: '#D8E3EF' } },
  { rankIndex: 7,  id: 'gn1',  name: 'Gold Nova I',                   code: 'GN1',  badgeTier: 'nova',     clientsRequired: 10,  colors: { base: '#8A6D1F', accent: '#D4A72C', glow: '#F2C94C' } },
  { rankIndex: 8,  id: 'gn2',  name: 'Gold Nova II',                  code: 'GN2',  badgeTier: 'nova',     clientsRequired: 13,  colors: { base: '#937517', accent: '#DFB02A', glow: '#F6D35C' } },
  { rankIndex: 9,  id: 'gn3',  name: 'Gold Nova III',                 code: 'GN3',  badgeTier: 'nova',     clientsRequired: 17,  colors: { base: '#9C7D10', accent: '#EABA28', glow: '#FADD6C' } },
  { rankIndex: 10, id: 'gnm',  name: 'Gold Nova Master',              code: 'GNM',  badgeTier: 'nova',     clientsRequired: 22,  colors: { base: '#A58608', accent: '#F5C426', glow: '#FFE77C' } },
  { rankIndex: 11, id: 'mg1',  name: 'Master Guardian I',             code: 'MG1',  badgeTier: 'guardian', clientsRequired: 28,  colors: { base: '#1F4E79', accent: '#3D7BB8', glow: '#6FB1E8' } },
  { rankIndex: 12, id: 'mg2',  name: 'Master Guardian II',            code: 'MG2',  badgeTier: 'guardian', clientsRequired: 35,  colors: { base: '#1C548A', accent: '#3A85C8', glow: '#6CBBF2' } },
  { rankIndex: 13, id: 'mge',  name: 'Master Guardian Elite',         code: 'MGE',  badgeTier: 'guardian', clientsRequired: 43,  colors: { base: '#195A9B', accent: '#378FD8', glow: '#69C5FC' } },
  { rankIndex: 14, id: 'dmg',  name: 'Distinguished Master Guardian', code: 'DMG',  badgeTier: 'guardian', clientsRequired: 52,  colors: { base: '#1660AC', accent: '#3499E8', glow: '#7ED0FF' } },
  { rankIndex: 15, id: 'le',   name: 'Legendary Eagle',               code: 'LE',   badgeTier: 'elite',    clientsRequired: 64,  colors: { base: '#5B2D8E', accent: '#8B4DD6', glow: '#B98CF5' } },
  { rankIndex: 16, id: 'lem',  name: 'Legendary Eagle Master',        code: 'LEM',  badgeTier: 'elite',    clientsRequired: 80,  colors: { base: '#64249B', accent: '#9A45E5', glow: '#C79CFA' } },
  { rankIndex: 17, id: 'smfc', name: 'Supreme Master First Class',    code: 'SMFC', badgeTier: 'elite',    clientsRequired: 100, colors: { base: '#7A1FA8', accent: '#C438F0', glow: '#E879FF' } },
  { rankIndex: 18, id: 'ge',   name: 'The Global Elite',              code: 'GE',   badgeTier: 'elite',    clientsRequired: 200, colors: { base: '#7A1622', accent: '#E63946', glow: '#FFC53D' } },
]

// ---- XP economy ----
export const XP_VALUES = {
  client_secured: 500, // once per clientId (key `secured:<id>`)
  client_live: 250,    // once per clientId (key `live:<id>`)
  lead_added: 50,      // first 5 per local day
  task_popped: 10,     // first 10 per local day
}
export const XP_PER_LEVEL = 1000
export const LEVEL_CAP = 40
export const DAILY_CAPS = { leads: 5, tasks: 10 }

// ---- Events / ceremonies ----
export const EVENT_CAP = 1000
export const EVENT_COMPACT_TO = 500
export const CEREMONY_DEDUPE_MS = 7 * 24 * 60 * 60 * 1000

// ---- Quotas / commissions ----
export const QUOTA_DEFAULT = 20
export const QUOTA_LOW_AT = 3
export const COMMISSION_RATE_DEFAULT = 0.5

// ---- Auth ----
export const PBKDF2 = { iterations: 600000, saltBytes: 16, hashBytes: 32 }
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const PASSWORD_MIN = 10
export const PASSWORD_MAX = 128
export const USERNAME_RE = /^[a-z0-9_.-]{3,20}$/
export const THROTTLE = { maxAttempts: 5, baseLockMs: 30000, capLockMs: 15 * 60 * 1000, resetAfterMs: 15 * 60 * 1000 }

export const TOMBSTONE_TTL_DAYS = 90

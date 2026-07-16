// Motion single source of truth — nothing hardcodes a spring inline.
export const SPRING = {
  slam:   { type: 'spring', stiffness: 520, damping: 24, mass: 1.1 }, // badge slam, heavy overshoot
  snappy: { type: 'spring', stiffness: 700, damping: 32, mass: 0.8 }, // taps, toggles
  soft:   { type: 'spring', stiffness: 260, damping: 26, mass: 1 },   // panels, layout reflow
  feed:   { type: 'spring', stiffness: 480, damping: 34, mass: 0.9 }, // killfeed slide-in
  bar:    { type: 'spring', stiffness: 120, damping: 22, mass: 1 },   // XP fill
  wobble: { type: 'spring', stiffness: 200, damping: 12, mass: 1 },   // star settle
}
export const EASE = {
  out:   [0.16, 1, 0.3, 1],
  in:    [0.55, 0, 1, 0.45],
  inOut: [0.65, 0, 0.35, 1],
  sweep: [0.4, 0, 0.2, 1],
}
export const DUR = { xs: 0.12, sm: 0.18, md: 0.28, lg: 0.45, xl: 0.8 }
export const Z = { chrome: 10, nav: 20, modal: 30, toast: 40, killfeed: 60, ceremonyOverlay: 80, ceremonyContent: 85, fxCanvas: 90, ceremonyHint: 95 }

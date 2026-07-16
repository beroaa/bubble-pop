// 12-char base36 id. rng is injectable so the engine stays pure;
// callers outside the engine pass a crypto-backed rng.
export function uid(rng) {
  let s = ''
  for (let i = 0; i < 12; i++) s += Math.floor(rng() * 36).toString(36)
  return s
}

// Default impure rng for call sites in hooks/lib (never used inside engine logic).
export function cryptoRng() {
  const buf = new Uint32Array(1)
  globalThis.crypto.getRandomValues(buf)
  return buf[0] / 2 ** 32
}

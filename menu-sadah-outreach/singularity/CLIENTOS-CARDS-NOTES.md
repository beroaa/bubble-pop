# CLIENTOS MENUS CARDS — redesign + grades + URL fix (done 2026-07-18, MacBook)

Executed on the real app `~/Desktop/ClientOS/index.html`. Three specs applied in
one pass (b10 LINK-RESCUE, b11 CARD-DOPAMINE, b12 MENU-DETECTORS), plus a dedupe.

## 1. Exact payload URLs (b10) — `singularity/clientos-cards.mjs`
- Old fusion built `-send`/`-mayfair` URLs (404s). Now every fused MENUS entry
  carries the EXACT `menuUrl`/`giftUrl` from `clientos-menus-payload.json`, plus
  `send: giftUrl`, so `sendFor()` no longer constructs. **0 cards** resolve to a
  constructed `-send`/`-mayfair` URL. IDs preserved (progress-safe: matched by slug).
- Deployed `dist/` (with `_redirects`, 2845 rules) — `menu-sadah.com/higanah-send`
  → 301 → `/higanah-welcome/` (200) as a safety net for any stragglers.

## 2. 3-per-row card redesign (b11) — CLIENTOS-CARDS-SPEC.md
- `.rdy-list` → responsive grid (1 <760px · 2 760–1180 · 3 ≥1180), breakout to a
  centred track up to 1160px (the app column is capped at 820, so the grid widens
  just for the menus list).
- New `mnCard`: 56px status-coloured bubble (flag chip, green pulse) · name block
  (EN Fraunces / AR Tajawal / area·type) · stage-dots strip · **one smart button**
  by stage (READY→🎁 Send the gift copies AR DM + opens giftUrl; SENT→↻ Nudge;
  REPLIED→🎙 Close it; SIGNED→👑 view menu) · icon row (📋AR 📋EN ▤menu 🎁gift ⋯).
- Motion (all behind `prefers-reduced-motion`): hover lift, button press spring,
  copy→✓ flip, entrance stagger, green pulse, SIGNED confetti + `sfx`. Reuses the
  app's native `awardXP` — no rival XP system.

## 3. Four grades (b12) — CLIENTOS-GRADES-SPEC.md — `singularity/clientos-grades.mjs`
- Global `MGRADE` (slug→grade) + `gradeFor(l)` — grade comes ONLY from payload
  `grade`, never computed. Works regardless of saved localStorage state.
- 💜 PURPLE ELITE (violet radial bubble + 3s breathe glow + ✦ ELITE badge, quiet),
  💚 GREEN READY, 🟠 ORANGE DEMO, 🔴 RED NOT READY.
- Sort purple→green→orange→red in every country group. Filter rail = 4 grade chips.
- Verified counts EXACTLY match payload: Elite 16 · Ready 61 · Demo 865 · Needs 6.

## 4. Dedupe
- 6 cafes were listed twice (curated lead + fused lead colliding by slug:
  salam-cafe, cherie, draft-cafe, black-stamp, las-cafe, breddy). `renderReady`
  now dedupes by menu slug (keeps the most-advanced copy). Live cards 1002 → 996.

## Safety
- Backup before edits: `~/Desktop/05 🎯 CLIENTOS HQ/ClientOS-backup-20260718-1458/`
- Screenshots: `~/Desktop/ClientOS-cards-screenshots/` (before / after / elite / mobile)
- Reproducible scripts committed: `clientos-cards.mjs`, `clientos-grades.mjs`
  (read the live file, assert exactly one match per patch).

## Design decision kept from before
- DM copy uses the app's own `menuReveal()` generator (localised name + live link).
  His design wins; the static payload `dm` is not force-injected over it.

## 5. Businessman DMs on the copy buttons (done 2026-07-18) — `clientos-dmswap.mjs`
- Global `MDM` (slug→{a:dm, e:dmEn}) embedded from payload + `MDMfor(l)`.
- `menuReveal()` now prefers the payload's `dm`/`dmEn` (Made-to-Stick businessman
  voice, signature dish + gift link baked in) for the 948 cafes. Covers 📋AR / 📋EN
  and the primary "Send the gift" button in one change at the source.
- Non-payload curated leads (no MDM) still fall back to the built-in generator.
- Sent-tab "Gift Package" uses its own full-package template (unchanged, exact URLs).

## 6. CROWN-50 masterpiece tier (done 2026-07-18) — `clientos-crown50.mjs`
- Payload now flags 50 campaign cafes `masterpiece:true` (all currently orange grade).
  Re-import was data-clean: URLs/DMs/grades already matched — only the flag is new.
- Global `MMASTER` (slug→1) + `masterFor(l)` + `srank(l)` (elite 0 · masterpiece 0.5 · grade).
- Crown treatment on masterpiece cards: gold-tipped violet bubble, "👑 MASTERPIECE"
  badge + grade chip, gold+purple glow border with a 3.2s breathe (reduced-motion safe).
- Sorted directly BELOW the 16 💜 elite, above green/orange/red. New "👑 50" filter chip.
- Verified: rail 16/50/61/865/6, sort [16 elite][50 crown][rest], filter = 50, no JS errors.
- Screenshots saved next to the app: MENUS-crown50-after.png / -filtered.png.

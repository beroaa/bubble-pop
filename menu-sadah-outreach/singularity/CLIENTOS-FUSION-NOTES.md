# CLIENTOS FUSION — 948 menus into the MENUS tab (done 2026-07-18, MacBook)

Executed `CLIENTOS-MISSION.md` on the real app at `~/Desktop/ClientOS`
(symlink → `~/Desktop/05 🎯 CLIENTOS HQ/ClientOS/index.html`).

## Result (verified in headless Chrome)
- MENUS tab now lists **1002 live brands** (was 63): 935 new payload cafes + existing book.
- All 948 payload cafes represented; 13 that already existed as leads were reused
  (their menu lit up) — **no duplicates**.
- Status bubbles per cafe (🟢 green / 🟠 orange / 🔴 red) using app palette.
- New in-language filters on the MENUS tab: **status rail**, **type rail** (8 types),
  and a **search box** (cafe / area / type). Country rail kept as-is.
- Per cafe: **↗ Open** (live menu), **🎁 Gift** (welcome page), **📋 AR / 📋 EN** DM copy.
- Stage advances reuse the app's existing XP (`awardXP`) — no rival XP system.

## How the app loads MENUS data (discovered)
- `renderReady()` renders `state.leads.filter(hasMenu)` as `mnCard`s, grouped by `ctryFor`.
- `state=load()` reads localStorage `clientOS.v1`; if present it **merges any SEED entry
  whose id isn't already saved** (and isn't in `removed`). So appending fresh-id entries
  to `SEED` surfaces them live even over Ibrahim's saved state.
- `menuFor(l)` = `MENUS[id] || MENUS_NM[name] || {brand:l.menuBrand}`; auto-adds a
  `-mayfair` "night" URL when `dark` is missing.

## Exactly what was changed in index.html (all reversible)
1. **Fusion IIFE** before `var state=load();` — pushes 935 lead objects into `SEED`
   and 948 `{brand,gift,autoDark:false}` entries into `MENUS`.
2. `menuFor`: auto-dark now guarded by `m.autoDark!==false` — **zero `-mayfair` night
   pages exist on the site**, so payload cafes must not show a broken Night button.
3. `mnCard`: added a **🎁 Gift** button (reuses `data-open` → +5 XP) and a **status
   bubble** in the tags row.
4. `menusLivePoll`: capped to the first 40 dots (948 parallel HEAD fetches = thundering herd).
5. `renderReady`: status/type/search filters applied to the list + filter rails injected.
6. Globals `MSTAT/MTYPE/MSEARCH` + `TYPELABEL()`, click handlers for `data-mstat`/`data-mtype`,
   and a small `<style id="clientos948">` block.

## DM copy note (design decision)
The AR/EN copy buttons use the app's own `menuReveal()` generator (localizes with the
cafe's Arabic name + live link) — **his design wins**, so the static `dm` field in the
payload was not force-injected over his generator.

## Safety
- Backup: `~/Desktop/05 🎯 CLIENTOS HQ/ClientOS-backup-20260718-1218/` (full dir, 7 MB).
- Upgraded zip: `~/Desktop/ClientOS-upgraded.zip` (1.8 MB).
- Screenshots: `~/Desktop/ClientOS-948-screenshots/` (before/after + filters + card).
- Reproducible build script: `singularity/fuse948.mjs` (reads a pristine BEFORE snapshot,
  re-applies all 11 patches idempotently; each patch asserts exactly one match).

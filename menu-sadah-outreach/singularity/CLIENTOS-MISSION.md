# 🎖 CLIENTOS MISSION — upgrade Ibrahim's REAL app (run on his MacBook)

The real ClientOS lives at `/Users/bero/Desktop/ClientOS/` (space-theme "G2" build
with ATLAS / TONIGHT / PIPELINE / MENUS / SENT / MONEY / LAB / OPS tabs).
That app is Ibrahim's MAIN WORKSTATION. This mission fuses all 948 menus into it.

## Payload (already in this repo)
- `singularity/clientos-menus-payload.json` — all 948 cafes, fully labeled:
  name AR/EN, country/flag, city, area, type, stage (READY/SENT/REPLIED/SIGNED),
  status green(74)/orange(868)/red(6) + statusLabel, menuUrl, giftUrl,
  signature dish, social handle, theme label, ready-to-send Arabic DM.
- Status meaning: green = ready 10/10 with real dish data · orange = built,
  missing real data/photos · red = chain-flagged / needs work.
- `singularity/gameos-template.html` + spec files in the session scratchpad were
  the standalone prototype — use only as reference for XP/quest/coach mechanics
  Ibrahim liked. HIS design wins on every conflict.

## Mission steps
1. BACK UP FIRST: `cp -r ~/Desktop/ClientOS ~/Desktop/ClientOS-backup-$(date +%Y%m%d-%H%M)`
2. Read the app source at ~/Desktop/ClientOS (check if it is editable source or a
   built bundle; find how the MENUS tab loads its data — localStorage store,
   embedded array, or JSON file).
3. Fuse the payload into the MENUS tab natively, matching the existing design
   language exactly (cards, flags, badges, LV/XP header). Requirements:
   - All 948 menus listed, grouped/filterable by country flag + city + area +
     type + status; Saudi 🇸🇦 Riyadh for all current entries.
   - Green/orange/red status bubbles per cafe (colors from the app's palette).
   - Per cafe: MENU LIVE link, gift link, copy-DM button (dm field in payload).
   - Wire stage advances into the app's existing XP/rank system (it already has
     LV/XP + SILVER ranks) — do NOT build a rival XP system.
4. Verify: open the app, screenshot the MENUS tab showing the 948 fused menus
   with filters working, before/after.
5. Zip the upgraded app and also commit the payload integration notes:
   `cd ~/Desktop && zip -r ClientOS-upgraded.zip ClientOS`
   Then in this repo: commit + push any files changed here, and report to Ibrahim.

## Iron rules
- His design > everything. No brown theme. No new pages — inside the MENUS tab.
- Never invent data — the payload is the single source of truth.
- If the app source is minified/unreadable, DO NOT hack it blindly: find its
  data/import layer (it has a backup import) and inject through that instead.

## MISSION: CROWN-50 (2026-07-18)
The 50 campaign cafes are now 👑 MASTERPIECE tier (live on menu-sadah.com).
`singularity/clientos-menus-payload.json` is updated: those 50 entries carry
`masterpiece: true` and `gradeLabel: "👑 MASTERPIECE · تحفة"`.

Do in /Users/bero/Desktop/ClientOS/ (back up index.html first):
1. Re-import the updated payload into the MENUS tab data (same fuse path as before).
2. Cards with `masterpiece: true` get a purple-gold crown treatment: 👑 badge,
   purple glow border (match the existing .card--elite conic-rim style but gold-tipped),
   and sort them ABOVE everything except the 16 💜 elite.
3. Add filter chip "👑 50" next to the grade filter buttons.
4. Keep all existing URLs untouched — they already point to the new live pages.
5. Screenshot MENUS tab after, save next to the app.

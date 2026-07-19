# THE GODZILLA BUILD — biggest quality pass, queued

Goal: lift the **50 masterpiece menus** (renderer: `lib/pages-masterpiece.mjs`, 1268
lines) to the exact craft bar of `rustic-grill.html` + `beyt-coffee/` + `beyt-coffee-
welcome/`. This spec is the phase-by-phase implementation plan. It names the concrete
gap between what the 50 render TODAY and what the masters do, and the exact renderer
change each phase needs. Read `MASTERS-STUDY-V2.md` first — it is the source of truth
for every property value below.

## Already running — DO NOT duplicate
`singularity/m50-state.js` phase = **"🎨 INK-CRAFT surgeon (legible dark text + logos)
+ 10 BRAND STUDIOS designing living backgrounds"**, last feed line: *"Honest fix: ugly
washed-out text -> Beyt-level ink + bespoke animated backgrounds."* So two workstreams
are LIVE and Godzilla must build ON them, not re-do them:
- **INK-CRAFT surgeon** = Phase 1 below (contrast/ink). Godzilla owns the spec + the QA
  gate that PROVES it; the surgeon owns the edit. Coordinate, don't fork.
- **BRAND-SOUL living backgrounds** (10 brand studios) = Phase 4. Godzilla defines the
  slot contract + fallback; studios fill per-cafe scenes. Don't hand-author backgrounds
  Godzilla-side.
Everything in Phases 2, 3, 5, 6 is NEW Godzilla scope.

---

## THE THREE HEADLINE GAPS (what the 50 lack vs the masters)
1. **Muddy low-contrast gold headings/prices** → masters read in ink `#382900`/bone
   `#F3ECE0`, accent only as spice.
2. **No animated brand mark** → the 50 render a STATIC letter medallion (`.medal`,
   `pages-masterpiece.mjs:749`); masters have a self-assembling SVG (cube / branding
   iron) echoed at top AND bottom.
3. **Generic / flat backgrounds** → masters have a per-brand living day→night world
   (sky layers, ink doodles, smoke). The 50 have a shared dotted/gradient `body::after`.

---

## PHASE 1 — INK-CRAFT: legible dark text (WITH the surgeon)
**Gap:** headings + prices lean on `--accent` gold; on pale scenes they wash out.
Current palette derivation (`pages-masterpiece.mjs:147–163`): light mode gives
`text1 = hslHex(h, 30–55, 12)` (good and dark) but room headings/prices are painted with
the bright accent `a`, and `SCENE_GOLD` (`#c79a3a/#e8c268/#8a6a1f`) is reused widely →
the "muddy same-gold" the board already flagged at line 147.
**Renderer changes:**
- Introduce a per-cafe **`--racc-ink`** exactly like Beyt: a DARKENED cousin of each
  section accent (target L≈20–35, S kept), and route ALL heading + price colour to it,
  never to the bright accent. Bright accent stays for rules/dots/underlines/glyphs only.
- Enforce a **contrast floor**: compute WCAG luminance of text-colour vs its background
  token; if ratio < 4.5 auto-darken (light mode) or lighten (night) until it passes.
  Bake this as a helper (`inkOn(bg)`), used everywhere text is emitted.
- Light-on-dark titles get the RUSTIC treatment:
  `-webkit-text-stroke:.6px rgba(0,0,0,.35); text-shadow:2px 3px 0 rgba(0,0,0,.4)`.
- **QA gate rule (new in `learnings.json`, formulaVersion bump):** fail the build if any
  `.room-h2`/`.price`/`.nm` computed colour is within ΔL<25 of its background, or equals
  a bright-accent hex. This is the proof the surgeon's work stuck.

## PHASE 2 — THE ANIMATED BRAND MARK (self-assembling, per cafe, top + bottom)
**Gap:** `pages-masterpiece.mjs:749` renders a static `.medal` initial; a real logo only
appears if `logo.svg/gif/png` lands from the MacBook (`cafeLogo`, lines 32–44). No cafe
currently gets a *generated* animated mark. Masters assemble a mark on load and REPLAY a
reversed version at the footer.
**Renderer changes:**
- Add a deterministic **`markSVG(cafe)`** generator keyed off `brand-theme.mjs` archetype
  → emits one of ~4 mark families, each self-assembling:
  - *cube/monogram* (Beyt-style): 3–4 coloured faces flying in (`arr-*` keyframes,
    `translate ± rotate → 0`, `1.25s cubic-bezier(.2,.8,.2,1)`, staggered `.15/.45/.7/1s`).
  - *ring-seal* (Rustic-style): `<circle pathLength=100>` self-drawing
    (`stroke-dashoffset:100→0`, `@keyframes draw`) + a popped glyph (`flamepop`/scale).
  - *bilingual medallion* upgrade: keep the AR/EN initial but draw the ring around it and
    pop the letter in (never a dead static circle).
- Echo the mark at the **footer** with the SAME faces arriving from the OPPOSITE
  directions (Beyt's `fin-*`: from `+90y/+110x-50y/-110x-50y/-90x-110y`), triggered by
  the existing reveal engine on scroll (`.finwrap.reveal.seen`). Windows/glyph wink at
  night (`fwink` steps).
- Keep the real-logo override: if `cafeLogo(slug)` exists it fills the mark (as today,
  `.medal.haslogo`); the generated animated mark is the FALLBACK, so it's great with zero
  photo work — and upgrades silently when a real logo lands.
- Reduced-motion/lite: snap assembled (`stroke-dashoffset:0;opacity:1;transform:none`).

## PHASE 3 — HAND-DRAWN INK CRAFT (confident imperfection)
**Gap:** cards are competent but too regular. Masters wobble everything.
**Renderer changes (CSS emitted per page):**
- Card radii → asymmetric Beyt form `20px 15px 22px 14px / 15px 22px 14px 20px`, flipped
  on `:nth-child(even)`, plus `transform:rotate(±.3–.35deg)`. Buttons
  `18px 14px 17px 15px` + hard offset shadow `3px 4px 0 var(--card-sh)` + press
  `translate(1px,1px)`.
- **Price drama** (pick per archetype): Beyt marker-circle (`price-ring` dashed
  `<ellipse stroke-dasharray="9 5" rotate(-3)>`), OR Rustic `.sear` self-drawing rounded
  `<rect rx=26 pathLength=100>` + scorch + 3 spark flicks (`spark`). Reuse the existing
  `ppop`/`pstamp` for entrance.
- Section separators: give each archetype a real device — Rustic hazard-tape
  `repeating-linear-gradient(45deg,#8E1A20 0 16px,#B4232A 16px 32px)` / diamond-plate
  tile; Beyt dotted rule + diamond dot. (The scene packs already start this around
  `pages-masterpiece.mjs:232–299`; extend, don't replace.)
- Rotated **stamp/tag/badge** on signature cards (`rotate(-2…5deg)`, dashed border,
  offset shadow) and a `.vlabel` vertical spine label per card.
- Torn-edge / punch-hole `::before/::after` for any "ticket/receipt" archetype (Rustic
  `#e6d6b4` scallop + `#0d0908` punch hole).

## PHASE 4 — PER-CAFE LIVING BACKGROUNDS (WITH the 10 brand studios)
**Gap:** shared `body::after` radial + dotted grid (`pages-masterpiece.mjs:217,234,253…`)
is the same mood for everyone. Masters have a bespoke day→night world.
**Renderer changes (Godzilla owns the CONTRACT; studios author the scenes):**
- Wire a **`data-phase` day→night engine** into every page: fixed crossfade sky layers
  (Beyt `#sky` p-noon `#FDF8EC` / p-dusk `#F5E5C6` / p-night `#20263A`; or Rustic char→
  ember), `#stars` twinkle at night, a header **dial/mark tap-target** that flips phase,
  and a clock-based greeting that types word-by-word. Opacity crossfade ONLY — never
  animate `body` background-color on scroll (compositor rule from both masters).
- Define a **living-decoration slot**: each brand studio supplies 1–3 looping ink/particle
  doodles (Beyt olive/cat/rakwe/arak; Rustic smoke/neon/sparks) as inline SVG + keyframes,
  keyed by archetype, with graceful absence. Godzilla provides the mount points
  (`#garden`-style `position:relative` anchors) + the reduced-motion kill-switch.
- Per-cafe palette + phase colours come from `brand-theme.mjs` (never flatten — brand-soul
  rule). Fallback: if a studio hasn't authored a scene, the current shared background
  still renders.

## PHASE 5 — THE GIFT / WELCOME PAGES (sales weapon parity)
**Gap:** gift landings exist (`pages-masterpiece.mjs:900` "Beyt-blueprint gift landing")
but must match `beyt-coffee-welcome` beat-for-beat.
**Renderer changes:** enforce the exact section order (hero+animated mark → letter →
FREE offer with struck-`$X`→`FREE` anchor + wobbling gift badge → 3 proof points →
no-catch line → **"We studied your house" 3 specific detail cards** → QR kit → trust
chips → reply block → footer). Voice = warm dialect, hand-fonts for salutations. Price
anchor: `.was` struck in the brand rose, `.big` FREE at `clamp(80px,26vw,140px)` scaling
in from 1.5×. Triple-hardened reveal system (two-rAF hide, IO + scroll sweep + interval,
`.done` transition-drop) copied from the welcome page for Instagram-webview safety.

## PHASE 6 — TRIPLE-CHECK & LOCK (per brand-soul rule)
Run the locked triple-check on the batch:
1. **Data pass** — QA gate (Phase-1 contrast rule + palette uniqueness + welcome→menu
   links + no private files in `dist/`), formulaVersion bumped, learning recorded.
2. **Browser pass** — Playwright error sweep + screenshots across all 8 archetypes in
   day AND night, AR AND EN, mark-assembly captured top + bottom.
3. **Regression pass** — regenerate payload/gameos/dms/hq and boot them; confirm the 50
   still build clean and photos still auto-upgrade when they land.
Every step logs a live one-liner to the build board (`btrack.mjs log`) and re-syncs the
artifact so Ibrahim sees ETA + bullets on his phone.

---

## Ordering & dependencies
- Phase 1 (ink) and Phase 4 (backgrounds) are the two live streams — land them first,
  coordinated with the surgeon + studios.
- Phase 2 (animated mark) and Phase 3 (ink craft) are pure renderer work, no external
  assets → highest ROI, can run in parallel once Phase 1's palette tokens exist.
- Phase 5 rides on Phases 1–3 (same tokens/marks).
- Phase 6 gates the release.

## Definition of done (the 10/10 bar)
A random one of the 50, opened cold in an Instagram webview, must: read in dark ink with
no washed-out gold; assemble its own brand mark on load and wave goodbye with it at the
bottom; wobble like it was drawn by hand; turn from day to night when tapped; breathe with
a living doodle; dramatise its prices; speak perfect bilingual dialect; and never hide a
price or freeze — i.e. be indistinguishable in craft from rustic-grill and beyt-coffee.

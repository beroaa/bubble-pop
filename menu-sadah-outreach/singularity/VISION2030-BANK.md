# 🇸🇦 SAUDI / VISION-2030 DESIGN BANK — tasteful local soul for the 50 Riyadh menus

Ideas we can steal from Saudi heritage design to give the 50 menus real local soul —
without ever looking like a government poster or a cheap flag. Each one is picked so it
respects our iron laws: INK-DARK legible text, confident ink craft, per-cafe palette,
mobile-cheap, and it plays nice with everything already built. Easy English, no jargon.

Each idea below: **what it is → where the look comes from → exactly how WE do it → where it goes → effort (S/M/L) → wow (1-5).**

---

## THE SURVIVORS (10 ideas that beat the dupes)

### 1. Furjat pierced-triangle frieze divider — wow 5, effort S — `divider`
- **What:** a thin row of little outlined triangles used as the line between menu sections.
- **Where it comes from:** *furjat* — the pierced triangle vents in old Najdi mud walls (merges the furjat/frieze dupes across najdi + v2030 + riyadh + luxury banks).
- **How WE do it:** inline-SVG row of small outlined triangles (2px brand-ink stroke, page-cream fill) as the section divider that replaces the plain `<hr>` under each room heading. `patternUnits="userSpaceOnUse"` so it tiles forever at any width; stroke recolors from `--ink` per cafe. Fully static, mobile-cheap.
- **Where:** divider.

### 2. Shurfat battlement parapet crown — wow 5, effort M — `hero`
- **What:** a stepped, notched "castle top" edge on the hero card and each room header.
- **Where it comes from:** *shurfat* — the battlement crown that lines the top of Najdi houses (merges all the shurfat / crenellation / zig-zag-footer dupes).
- **How WE do it:** `clip-path: polygon()` cutting a stepped up/down zigzag into the TOP edge of the hero card and each room-header, filled brand-ink, paired with our existing 3px hard offset shadow. One utility class. The notched skyline reads instantly Najdi — no fabric photo needed.
- **Where:** hero.

### 3. Sadu / Al-Qatt woven geometric band divider — wow 4, effort S — `divider`
- **What:** a short woven chevron-and-diamond strip between blocks.
- **Where it comes from:** *Sadu* Bedouin weaving + *Al-Qatt Al-Asiri* wall painting (merges sadu-band, v2030 weave, riyadh sadu-border, qatt-asiri).
- **How WE do it:** a ~10px `repeating-linear-gradient` at 60deg / -60deg in accent + ink to make a chevron/diamond weave strip; every colored shape is sealed by a hairline ink outline (the Qatt discipline = color lives in the shapes, never the words — honors our INK-DARK law). Recolors automatically from the brand-theme accent, so each cafe's band is its own.
- **Where:** divider.

### 4. Sadu-weave living background, center-safe — wow 5, effort M — `background`
- **What:** a soft woven texture behind the whole page that slowly drifts.
- **Where it comes from:** Sadu warp-and-weft weaving (merges warp-stripe texture + sadu-weave backdrop).
- **How WE do it:** full-bleed `repeating-linear-gradient(90deg, ink 0 1px, transparent 1px 5px)` plus a tiling SVG diamond band, opacity ~4-6%, with a `mask-image` radial-gradient that ramps to ~0 across the center third so brand-ink text stays fully legible. Slow `background-position` drift feeds our existing brandbg "living" pipeline; per-cafe tint via the accent var.
- **Where:** background.

### 5. Dallah animated brand mark — wow 5, effort M — `mark`
- **What:** the Arabic coffee pot that draws itself and "pours" into being.
- **Where it comes from:** the *dallah* — the icon of Saudi hospitality.
- **How WE do it:** a single-path dallah (bulbous body, spire finial, crescent-beak spout) in brand-ink + accent, drawn on via `stroke-dasharray` / `stroke-dashoffset` so the pot pours into existence, plus a 2-stroke slow steam wisp. A drop-in animated mark for any qahwa / heritage-world cafe. Pure SVG, no downloads.
- **Where:** mark.

### 6. Bilingual AR/EN dual-typography lockup per dish row — wow 5, effort M — `section`
- **What:** each dish shows a big Arabic name AND a smaller English name, side by side, as the design.
- **Where it comes from:** Saudi bilingual signage / our own medallion logic.
- **How WE do it:** dish-name row = large ink Arabic name, a 1px accent vertical rule (`border-inline-end`), then a smaller EN transliteration beside it in a flex row with a gap. The dual-script lockup itself is the aesthetic. Extends the existing medallion idea into every single row and respects RTL.
- **Where:** section.

### 7. Earthen base + single jewel accent palette variant — wow 4, effort S — `palette`
- **What:** a warm sand/gypsum background with ONE rich jewel color used only as tiny accents.
- **Where it comes from:** documented Sadu / Najdi color tones (merges all 5 palette ideas + the gold-hairline-only law).
- **How WE do it:** a `brand-theme.mjs` "heritage" variant (as documented inspiration only — NOT edited here): earthen/gypsum ground (#efe6d4 beige) + walnut-ink text kept near-black (#241a12) + ONE derived jewel accent (madder #9c2b1f or a copper sheen) used ONLY for 1px hairline rules, prices and dots — never body text. Generous whitespace. Inspiration only, no heritage/gov claim.
- **Where:** palette.

### 8. Quarter-fill finjan "stay as long as you like" welcome glyph — wow 4, effort S — `hero`
- **What:** a small coffee cup filled only a quarter, with a warm one-line caption.
- **Where it comes from:** the real Saudi coffee ritual — a quarter cup means "you're welcome to stay."
- **How WE do it:** a handleless-cup inline-SVG whose coffee fill is a rect clipped to a quarter height, gently rising on load, with the caption "a quarter cup = stay as long as you like." A genuine quotable ritual — perfect warm hero accent on the beyt-style gift / welcome sales-weapon page.
- **Where:** hero.

### 9. Tarma peephole medallion frame — wow 4, effort S — `mark`
- **What:** wrap our existing round medallion in a carved Najdi door frame.
- **Where it comes from:** *tarma* — the carved wooden screens/doors of old Najdi homes (merges najdi / v2030 / riyadh tarma dupes).
- **How WE do it:** re-shell the existing bilingual medallion in a Najdi carved-door frame: an inline-SVG stroked square rotated 45deg behind the circle with small triangular furjat notches at the corners, 2px ink. Reuses the per-cafe initial-medallion, zero new assets, and the notches hide on narrow screens.
- **Where:** mark.

### 10. Diamond-chain price leaders — wow 4, effort S — `section`
- **What:** the dotted line between a dish name and its price becomes a tiny woven diamond chain.
- **Where it comes from:** Sadu "unity / continuity" motif.
- **How WE do it:** swap the dotted flex-row leader for a tiny run of woven diamonds: `background: repeating-linear-gradient(90deg, transparent 0 6px, accent 6px 7px)` on the `flex:1` element, masked to the baseline. A quiet Sadu detail on every row; pure CSS, per-cafe accent.
- **Where:** section.

---

## APPLY SHORTLIST

Top 4 by wow-per-effort — the biggest local soul for the least work. Each is static, reduced-motion safe, needs no external assets, must NOT reduce text contrast, and must coexist with all current features (per-cafe palette, medallion, photos, animated marks, living backgrounds).

### A. Furjat pierced-triangle frieze divider (wow 5 / effort S)
1. One inline `<svg>` divider component: a `<pattern patternUnits="userSpaceOnUse">` of small triangles, 2px stroke `var(--ink)`, fill `var(--page-cream)`, replacing the `<hr>` under each room heading.
2. Static only — no animation, so reduced-motion is a non-issue; self-contained SVG, zero external assets.
3. Stroke uses the existing ink var so contrast is untouched; sits between sections and never overlaps body text, so it coexists cleanly with medallion, photos and backgrounds.

### B. Sadu / Al-Qatt woven band divider (wow 4 / effort S)
1. One CSS utility class: `repeating-linear-gradient` chevron/diamond at ±60deg in `var(--accent)` + `var(--ink)`, ~10px tall, with a hairline ink outline sealing every color block.
2. Pure CSS, static, no motion and no assets — reduced-motion safe by construction.
3. Color lives only inside the band (never in words) so INK-DARK legibility holds; it's a between-block strip, so it never fights the palette, medallion, or photo slots.

### C. Tarma peephole medallion frame (wow 4 / effort S)
1. Wrap the existing per-cafe medallion in an inline-SVG frame: a 2px ink stroked square rotated 45deg behind the circle, with small triangular corner notches.
2. Static SVG, no animation, no downloads — reduced-motion safe; reuses the current initial-medallion, adding zero assets.
3. It's a frame around an existing mark, so it changes nothing about text contrast and simply re-shells a feature we already ship; notches hide under a narrow-screen media query.

### D. Diamond-chain price leaders (wow 4 / effort S)
1. Restyle the existing dish→price leader element: `background: repeating-linear-gradient(90deg, transparent 0 6px, var(--accent) 6px 7px)`, masked to the baseline.
2. Pure CSS on an element that already exists, static, no assets — reduced-motion safe.
3. Accent-only tiny diamonds on the leader line (not on the name or price text) keep full contrast, and it drops straight into the current row layout with no structural change.

---

## RED LINE

**We use Saudi and Vision-2030 design ONLY as INSPIRATION.** We NEVER claim official affiliation, endorsement, sponsorship, or partnership with Vision 2030, the Saudi government, or any heritage authority. We invent NO facts — no fake stats, no fake quotes, no fake "official" badges. Motifs like sadu, furjat, shurfat, tarma, qatt and the dallah are shared cultural heritage we honor tastefully; they are never presented as a government seal or an endorsement. If a claim can't be sourced, it does not ship. This is respect and local soul, not a badge we're not allowed to wear.

---

Applies in a future Saudi-soul design pass, one surgeon at a time, after backgrounds land.

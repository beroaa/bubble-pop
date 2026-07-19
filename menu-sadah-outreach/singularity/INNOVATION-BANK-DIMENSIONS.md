# 🌌 THE MULTI-DIMENSIONAL HEIST — ideas stolen from outside the menu world

Brother, wave 2 left the cafe world completely. The scouts broke into 8 OTHER
universes — the motion masters (Linear, Apple, Stripe), video games, movie
title designers, luxury boutiques, museums, Arabic calligraphy craft,
editorial storytellers (The Pudding, NYT), and the haptics people — and
robbed only what fits a Riyadh cafe menu on a phone.

The red-team already killed the weak loot. **12 ideas survived.** Every one
below is honest and buildable: pure CSS + tiny JS, zero external assets,
dies politely under `prefers-reduced-motion`, and lives INSIDE what we
already have (brand souls, sky-dial, day-night, order chips, SFDA chips).
No fantasy, no library downloads, no network.

**How to read the scores:** effort S = one sitting, M = one focused day,
L = multi-day surgery. Wow = how high a cafe owner's eyebrows go (out of 5).

---

## 🗺️ THE 8 DIMENSIONS WE ROBBED

| Dimension | Who lives there |
|---|---|
| 🎞️ motion-masters | Linear, Apple, Stripe — the smoothest sites on earth |
| 🎮 game-feel | Video-game "juice" — buttons that feel alive |
| 🎬 cinema-titles | Movie title sequences — owning the first 3 seconds |
| 🔊 sound-haptics | Tiny vibrations — touch the guest can FEEL |
| 💎 luxury-desire | Boutiques + unboxing rituals — desire engineering |
| 🏛️ museums | Museum labels + wayfinding — quiet authority |
| 📰 editorial | The Pudding, NYT — data that tells a story |
| 🖋️ arabic-craft | Calligraphy, kashida, Sadu weaving — our own heritage |

---

## 💰 THE 12 SURVIVORS

### 1) 🧬 Brand motion DNA + press physics on every touchable
**Stolen from:** 🎞️ motion-masters + 🎮 game-feel + 🎬 cinema-titles + 🔊 sound-haptics · **Effort:** S · **Wow:** 5/5
**What it is:** every cafe gets its own way of MOVING (not just its own colors), and every button answers the finger like a game pad.
**Exactly ours:** brand-theme.mjs gains per-cafe motion tokens (one easing curve, one reveal direction) reused by intro, headers and taps; shared CSS gives every dish card, chip, toggle and order-chip a `:active` spring-squash (scale .96, overshoot release) plus feature-detected `vibrate(8)` detent on Android category snaps. Transforms only, ships to all menus in one formulaVersion bump.

### 2) 🎬 Cinema sting welcome + curtain threshold (unboxing fused with gift unwrap)
**Stolen from:** 🎬 cinema-titles + 💎 luxury-desire + 🎮 game-feel + 🔊 sound-haptics · **Effort:** M · **Wow:** 5/5
**What it is:** the gift page opens like a movie — seal, unwrap, letter — under 3 seconds, once per visit; then the guest walks through a curtain INTO the cafe.
**Exactly ours:** Gift/welcome pages become a 3-beat, sub-3s CSS ceremony: medallion stamps in as wax seal, brand wash parts like tissue, letter rises — sessionStorage plays it once, tap skips, double-tap haptic marks the landing frame. Welcome-to-menu click pulls an 800ms brand-color curtain so the guest "enters" the cafe. Upgrades the beyt-coffee-welcome sales weapon directly.

### 3) 🌊 Expo-out staggered entrance on first paint
**Stolen from:** 🎞️ motion-masters · **Effort:** S · **Wow:** 4/5
**What it is:** the first screen doesn't pop in — it RIPPLES in, exactly the way Linear does it. Costs nothing at runtime.
**Exactly ours:** Linear's documented recipe (600ms, `cubic-bezier(.16,1,.3,1)`, 80ms sibling stagger) as pure CSS keyframes with per-card delays computed at build time in pages-masterpiece.mjs. Header medallion, then room title, then cards ripple in — zero JS, zero runtime cost, killed by prefers-reduced-motion.

### 4) 📊 Scroll reveals with SFDA chip data-layer beat
**Stolen from:** 🎞️ motion-masters + 📰 editorial + 🏛️ museums · **Effort:** M · **Wow:** 4/5
**What it is:** cards rise as you scroll — and the SFDA chips arrive one beat AFTER. The law data stops being small print and becomes the show.
**Exactly ours:** `animation-timeline: view()` fades/rises cards off-main-thread where supported (`@supports`), falling back to the template's existing IntersectionObserver class-toggle everywhere else (iPhone-safe). Calorie/caffeine/allergen chips slide in one beat AFTER their card — the Pudding reveal-as-emphasis move turns mandatory SFDA data into the visible sales pitch.

### 5) 🛤️ Sticky chip-rail: gliding pill + scroll-spy + progress hairline + designed exit
**Stolen from:** 🎞️ motion-masters + 🏛️ museums + 📰 editorial · **Effort:** M · **Wow:** 5/5
**What it is:** the room chips get a gliding brand-color pill that always knows where you are, a hairline progress bar, and a designed exit back to the gift.
**Exactly ours:** Fuse into the existing sticky header/sky-dial: horizontal bilingual room chips with a brand-color pill that glides (transform, ~300ms) via IO scroll-spy, a thin scroll-progress hairline beneath, and a final "return to entrance" chip that surfaces the gift-link CTA as the last room. Mirrors correctly in RTL via logical properties.

### 6) 🏷️ Hero-to-header medallion shrink scrub
**Stolen from:** 🎞️ motion-masters + 📰 editorial · **Effort:** M · **Wow:** 4/5
**What it is:** the cafe's mark starts HUGE over the hero, then glides down into the header — the brand never leaves the screen.
**Exactly ours:** Medallion + bilingual cafe name start huge over the hero, then scrub down into the sticky rail using `position:sticky` + `scroll()` timeline where supported; static compact header fallback otherwise. Brand never leaves the screen, pairs with the chip-rail so the whole top of the menu is one choreographed unit.

### 7) 🖼️ Curator plaque + whispered price + new riyal glyph (U+20C1)
**Stolen from:** 🏛️ museums + 💎 luxury-desire + 🖋️ arabic-craft · **Effort:** M · **Wow:** 5/5
**What it is:** every dish card becomes a small museum label, the price whispers instead of shouting, and the Kingdom's NEW riyal symbol renders perfectly on every phone.
**Exactly ours:** Two-tier museum label grammar on every card: bold bilingual name, then a small-caps hairline plaque row for calories/caffeine/allergens; price becomes a muted bare numeral placed last (Cornell ~8% effect) beside a tiny inline-SVG riyal symbol tinted from the palette (guaranteed render, fonts are patchy). One DM line: "your menu already uses the Kingdom's new riyal mark" — same family as the SFDA pitch.

### 8) 🖋️ Arabic-first type scale + kashida as the page's one calligraphic gesture
**Stolen from:** 🖋️ arabic-craft · **Effort:** M · **Wow:** 4/5
**What it is:** Arabic stops being the shrunken translation. It gets its own bigger scale, and ONE kashida stretch becomes the page's calligraphic signature.
**Exactly ours:** Per-script tokens in the engine: AR gets font-size x1.12, line-height x1.15, letter-spacing 0, own display face — enforced by a new learnings.json QA-gate rule so shrunken Arabic can never ship. One tasteful tatweel stretch in AR room headers, and the same thin brand-color kashida stroke doubles as the dish-to-price leader line.

### 9) 🔁 Bi-script medallion lockup + shared-element AR/EN morph
**Stolen from:** 🖋️ arabic-craft + 🎞️ motion-masters + 🎮 game-feel · **Effort:** M · **Wow:** 5/5
**What it is:** the AR/EN switch stops being a boring repaint and becomes the menu's signature magic trick.
**Exactly ours:** Medallion becomes a true lockup — expressive AR name leading, quiet letter-spaced EN beneath — and the language toggle morphs instead of repainting: medallion initial crossfade-rotates with a spring, dish names slide through a masked crossfade in fixed-size containers. The bilingual switch becomes the menu's signature wow moment; toggle swaps which script leads.

### 10) 🚪 Room thresholds: salon title cards + Sadu band + room-voice line
**Stolen from:** 💎 luxury-desire + 🎬 cinema-titles + 🏛️ museums + 🖋️ arabic-craft · **Effort:** M · **Wow:** 4/5
**What it is:** every menu room opens with a doorway — big bilingual title, mood line, and a Sadu band woven from the cafe's own colors. Scrolling = walking a boutique.
**Exactly ours:** Each story room opens with a full-bleed threshold: brand wash, big bilingual serif room name, and the existing room-voice line as its mood caption; a deterministic inline-SVG Sadu/Najdi triangle band (generated from the palette seed in brand-theme.mjs) is the divider and welcome-page frame. Scrolling reads as walking a boutique's rooms, and it coexists with day-night since it's palette-driven.

### 11) 🏆 Signature tour: masterpiece card + cast credits + one-time spotlight
**Stolen from:** 🏛️ museums + 🎬 cinema-titles + 💎 luxury-desire + 🎮 game-feel · **Effort:** L · **Wow:** 4/5
**What it is:** the hero dish gets a museum vitrine, the top 3 bill in like movie credits, and the very first visit gets a 1.5s spotlight. Evidence-backed dishes ONLY — no invented stories.
**Exactly ours:** Evidence-backed signatures only: the hero dish gets a full-bleed vitrine/masterpiece card with layered reveal (photo, name, plaque, price last) and a "the ritual" details drawer when a sourced story exists; the top 3 bill in like cast credits under numbered tour stops that smooth-scroll to each card. First-ever visit dims the page 1.5s and spotlights stop 1 (localStorage flag), then never again.

### 12) 🪞 Full-mirror RTL audit + QA-gate grep for physical properties
**Stolen from:** 🖋️ arabic-craft · **Effort:** S · **Wow:** 3/5
**What it is:** make the Arabic mirror PERFECT — and make the robot FAIL any build where it isn't. Invisible when right, instantly cheap when wrong.
**Exactly ours:** Sweep pages-*.mjs to CSS logical properties (`margin-inline`, `border-inline`, `text-align:start`) so chevrons, accent borders, gradients and scroll hints genuinely mirror on toggle; add a QA-gate rule that greps built HTML for physical left/right props and fails the build. Invisible when right, instantly cheap-looking when wrong — this is the craft floor everything above stands on.

---

## 📊 THE SCOREBOARD (wow ÷ effort, S=1 M=2 L=3)

| # | Idea | Effort | Wow | Score |
|---|---|---|---|---|
| 1 | Brand motion DNA + press physics | S | 5 | **5.0** 👑 |
| 3 | Expo-out staggered entrance | S | 4 | **4.0** |
| 12 | Full-mirror RTL audit + QA grep | S | 3 | **3.0** |
| 2 | Cinema sting welcome + curtain | M | 5 | **2.5** |
| 5 | Sticky chip-rail | M | 5 | **2.5** |
| 7 | Curator plaque + riyal glyph | M | 5 | **2.5** |
| 9 | Bi-script AR/EN morph | M | 5 | **2.5** |
| 4 | Scroll reveals + SFDA beat | M | 4 | 2.0 |
| 6 | Medallion shrink scrub | M | 4 | 2.0 |
| 8 | Arabic-first type scale | M | 4 | 2.0 |
| 10 | Room thresholds + Sadu band | M | 4 | 2.0 |
| 11 | Signature tour | L | 4 | 1.3 |

---

## FUSION SHORTLIST

Top 4 by wow-per-effort. Four ideas tie at 2.5 — the cinema sting takes seat
4 because it upgrades the gift link, the weapon that actually closes deals
(chip-rail, curator plaque and AR/EN morph ride in the fused pass right
behind it). Every spec below obeys the three laws: reduced-motion safe, zero
external assets, coexists with every current feature.

### 🥇 1. Brand motion DNA + press physics — S, wow 5, score 5.0
- brand-theme.mjs derives `motion: { ease, revealDir }` from the palette seed; engine prints them as `--m-ease` / `--m-dir` CSS vars in every page head, reused by intro, headers and taps.
- One shared CSS block in the page template: `.touchable:active { transform: scale(.96) }` with overshoot release on the brand ease (transforms only), plus `navigator.vibrate?.(8)` behind a feature check on Android category snaps.
- Whole block wrapped in `@media (prefers-reduced-motion: no-preference)`; no assets, no layout shift; one formulaVersion bump ships it to the 50 and later all 948.

### 🥈 2. Expo-out staggered entrance — S, wow 4, score 4.0
- pages-masterpiece.mjs computes per-card `animation-delay: i × 80ms` at build time; one keyframe set: fade + 12px rise, 600ms, `cubic-bezier(.16,1,.3,1)` — medallion, then room title, then cards.
- Pure CSS on opacity/transform only — zero JS, zero runtime cost, no layout shift; below-the-fold cards excluded so the scroll-reveal system keeps owning them.
- Entire block lives inside `@media (prefers-reduced-motion: no-preference)`; with motion off, first paint is instant and complete.

### 🥉 3. Full-mirror RTL audit + QA-gate grep — S, wow 3, score 3.0
- Sweep all pages-*.mjs CSS to logical properties (`margin-inline`, `inset-inline`, `border-inline`, `text-align: start`) and make chevrons, accent borders, gradients and scroll hints direction-aware.
- Add a learnings.json QA-gate rule that greps built HTML for physical left/right props and FAILS the build on any hit — shrunken-mirror pages can never ship again.
- No motion, no assets, zero visual change in EN, true mirror in AR; this is the craft floor every other shortlist item stands on, so it lands first in the pass.

### 🎬 4. Cinema sting welcome + curtain threshold — M, wow 5, score 2.5 (tie-break: upgrades the sales weapon)
- Gift/welcome page plays 3 CSS beats under 3s on the existing DOM: medallion wax-stamps in, brand wash parts like tissue, letter rises; sessionStorage plays it once, any tap skips instantly.
- Welcome→menu click pulls an 800ms brand-color curtain overlay so the guest "enters" the cafe; optional `vibrate(10)` on the landing frame, feature-detected, silent elsewhere.
- Reduced-motion (and every replay) gets the instant static page; zero external assets; letter content, palette and medallion logic untouched — beyt-coffee-welcome only gains, never changes.

Merges with INNOVATION-BANK.md top-3 into ONE innovation pass — fires after photo art-direction, one surgeon at a time.

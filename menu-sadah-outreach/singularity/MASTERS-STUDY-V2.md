# MASTERS-STUDY-V2 — the definitive craft blueprint (forensic pass)

Extracted property:value from three hand-crafted master pages so an implementer can
hit 10/10. Sources read in full:

- `dist/rustic-grill.html` (grill-house menu, Ibrahim's favourite) — 1418 lines
- `dist/beyt-coffee/index.html` (reference menu) — 1494 lines
- `dist/beyt-coffee-welcome/index.html` (reference GIFT / welcome page) — 458 lines

The one sentence that explains all three: **dark ink on warm paper (or bone on
charcoal), one confident brand mark that ASSEMBLES ITSELF on load, hand-drawn
imperfection everywhere (wobbly radii, rotated stamps, dotted leaders), and a
day→night world that the reader can flip.** Nothing is flat, nothing is centred-generic,
and headings are always near-black or the paper colour — the accent is a spice, never
the body text.

---

# PART 1 — RUSTIC GRILL (the grill / fire / tickets world)

## 1A. TEXT & CONTRAST
- **Darkest inks:** on the dark shell, body text is **bone `#F3ECE0`** on **char
  `#1A1714`** / coal `#2A2522`. On the pale butcher-ticket cards it flips to **ink
  `#211b16`** (near-black warm brown) on paper `#ece0c5→#e0cfa9`.
- **The rule that keeps it legible:** big display type is ALWAYS `--bone #F3ECE0`
  (hero H1, station H2), never the ember. Accent `--ember #E4572E` is used only for:
  the emphasised word inside a heading (`h1 .en b`, `h2 .en em`), the kicker line,
  SVG strokes, borders, and glows. **Ink carries the words; ember decorates them.**
- Station H2 gets physical weight so it reads on any background:
  `-webkit-text-stroke:.6px rgba(0,0,0,.35)` + `text-shadow:2px 3px 0 rgba(0,0,0,.4)`
  (a hard offset "sticker" shadow, not a blur). At night it adds a faint ember bloom
  `0 0 22px rgba(228,87,46,.18)`.
- On the pale ticket, the price is the only red: `.price color:var(--red-deep) #8E1A20`,
  `font-variant-numeric:tabular-nums`, `direction:ltr;unicode-bidi:isolate` (so Arabic
  never reverses the number). Calories are quiet: `--concrete-dk #6E6A64`, `.66rem`.
- **Fonts:** display EN `Anton` (fat condensed poster), display AR `Rakkas`; body
  `Oswald` + `Tajawal` (AR). Sizes: hero H1 `clamp(3.1rem,15vw,5.4rem)` line-height
  `.92`; station H2 `clamp(2.5rem,10vw,3.9rem)` line-height `.94`; kicker `.7rem`
  `letter-spacing:.24em uppercase`; body `1rem` line-height `1.5–1.55`.

## 1B. THE MARK — animated branding-iron ring (the signature device)
Built as one inline SVG `viewBox="0 0 100 100"` (hero `.emblembtn`), three parts:
- `.iron-ring` — `<circle r=43 pathLength=100>`, `stroke-width:4`, `stroke-dasharray:100;
  stroke-dashoffset:100`, `animation:draw 1.5s cubic-bezier(.4,.9,.3,1) .2s forwards`.
  `@keyframes draw{to{stroke-dashoffset:0}}` → the ring draws itself like a hot iron
  scoring a circle.
- `.iron-txt` — a straight underline `<path d="M22 74 h56">`, same self-draw, delay `.7s`.
- `.iron-flame` — the flame glyph, `fill:var(--amber)`, starts `opacity:0`,
  `animation:flamepop 1s cubic-bezier(.2,1.5,.4,1) 1s forwards`
  (`flamepop`: y+8→0, scale .5→1.08→1) → the flame POPS in after the ring closes.
- Behind it, `.emblem-wrap::after` is a radial ember glow, `opacity:.35` by day →
  `opacity:1` at night. The mark is a real `<button>`: tap it and it flips the page to
  night (aria-label "stoke the coals"). `:active svg{transform:scale(.955)}`.
- The SAME mark recurs three times, re-choreographed: header `.mark` (34px, static),
  the footer `.finmark` (re-draws on scroll via `.finwrap.seen`), and a `.sig-bull`
  longhorn-skull SVG on the Signatures head.

## 1C. LAYOUT & CRAFT DEVICES
- **Butcher-ticket card** `.ticket`: `background:linear-gradient(180deg,#ece0c5,#e0cfa9)`,
  `border:1px solid var(--ticket-edge) #cbb587`, `border-radius:3px`, shadow
  `0 10px 22px rgba(0,0,0,.4),0 2px 0 rgba(0,0,0,.25)`.
  - **Perforated torn top edge:** `::before` a repeating radial-gradient
    `radial-gradient(circle at 7px 0, transparent 6px, #e6d6b4 6.5px) repeat-x;
    background-size:14px 12px` → scalloped tear.
  - **Punch hole:** `::after` 12px circle `radial-gradient(circle,#0d0908 60%,#3a2f1e)`
    with `inset 0 1px 2px rgba(0,0,0,.6)`.
  - **Rotated stamp** `.stamp`: red-outlined box `transform:rotate(4deg);opacity:.6`.
  - Dish rows: `.lead` is a dotted leader `border-bottom:2px dotted rgba(33,27,22,.32)`
    that fills the gap between name and price (classic menu leader dots).
- **The sear ring (signature pricing moment)** `.sear`: the price sits inside a
  self-drawing rounded `<rect rx=26 pathLength=100>`, ember stroke, that draws on
  reveal; a scorch radial `::before` fades in under it; and 3 `.sparks` paths
  (`spark` keyframe) flick once as the iron "lands". This is how RUSTIC dramatises a
  number.
- **Runner bands** between stations: 42px strips, `.runner.tape` =
  `repeating-linear-gradient(45deg,#8E1A20 0 16px,#B4232A 16px 32px)` (hazard tape);
  `.runner.plate` = an inline-SVG diamond-plate tile. Centre `.rmark` flame.
- Everything hand-confident: dashed tags `border:1.6px dashed var(--acc)` rotated
  `-1.5deg`, kicker with a 22px accent rule `::before`.

## 1D. COLOUR SYSTEM
- Full palette: red `#B4232A`, red-deep `#8E1A20`, ember `#E4572E`, amber `#F2A03D`,
  kraft `#C9A96A`, kraft-lt `#DBC4A0`, concrete `#A8A29A`, concrete-dk `#6E6A64`,
  char `#1A1714`, coal `#2A2522`, bone `#F3ECE0`, ink `#211b16`, ticket `#e7d8b8`.
- **Per-station accent rotation** (each `section.station` sets `--acc` + `--pipc`):
  signatures/griddle ember `#E4572E` · stacks amber `#F2A03D` · coals kraft `#C9A96A`
  · firepit red `#B4232A` · chopblock kraft-lt `#DBC4A0` · siderail concrete `#A8A29A`.
  So the nav pips, kickers, underlines and chips recolour section to section.
- **Day/night** is opacity-crossfade only (never animate body bg): `#pit .day` vs
  `#pit .night` fixed layers, `transition:opacity 1.3s`. Night adds an ember floor
  glow + soot grain. Toggled by `body[data-phase="night"]`.

## 1E. ANIMATION VOCABULARY (keyframe → what → trigger)
- `draw` — stroke-dashoffset 100→0 — self-drawing ring/underline/sear — load + scroll.
- `flamepop` / `spark` — flame + ember sparks pop — load / on reveal.
- `wisp` (×3 staggered 5.2s) — smoke rising above hero — ambient loop.
- `neonflick` (steps) — "Open late" neon strip flickers alive — at night.
- `rowin` (staggered `--i*65ms`) / `cardin` (`--ci*90ms`) — rows + tickets rise on
  scroll (`.station.reveal.seen`).
- `inkin` / `wordin` — EN letters / AR words land per-letter in H2s (`.type-on`).
- `sigin` — signature cards fan in after the cinematic.
- `wolPop` — testimonial "wall of love" cards pop.
- **THE CINEMATIC (`#signatures`):** a full-screen one-shot branding-iron drop —
  a metal rod (`.rod` gradient) descends over ~1350ms, IMPACTS (screen shake, white
  flash, canvas spark burst of 64 particles + steam), sears a glowing mark that cools
  `#fff→#ffd27a→#f2833d→#e4572e`, then fades and fans the 5 signature cards in. Driven
  by rAF on a capped-DPR `<canvas>`. **Synthesized Web Audio** (no files): `metalGroan`
  (saw+square swept lowpass), `subBoom` (sine 82→30Hz), `clang` (5 partials + noise),
  `hiss`, `sparkCrackle` — gesture-unlocked, mute persisted to localStorage, silent
  under reduced-motion/lite. `navigator.vibrate([0,30,25,45])` on impact.
- Greeting line `.pitgreet` types word-by-word (`.w` spans) by clock.

## 1F. RESILIENCE (why it never breaks)
`body.lite`/`body.rm` + `@media (prefers-reduced-motion:reduce)` snap every draw to
its final frame (`stroke-dashoffset:0`, `opacity:1`), kill the cinematic, and drop
smoke. All reveals are JS-armed so no-JS never hides a price.

---

# PART 2 — BEYT CAFE MENU (the house / rooms world)

## 2A. TEXT & CONTRAST
- **Darkest ink `--ink #382900`** (deep olive-brown) on **paper `#FFFDF6`** / body bg
  `#FAF0DB`. This near-black-green ink on cream is the whole legibility trick — the
  gold is NEVER the reading colour.
- Palette vars flip for night via one line:
  `body[data-phase="night"]{--pg:#F2E7CE; --sub:#CBBE9C; --card-sh:rgba(0,0,0,.35)}`.
  So all text lightens to cream on the dark-blue night sky without touching markup.
- Dish name `.nm` `font-weight:700 1.05rem` ink; description `.ds` `#63511f .92rem`;
  price `.price font-weight:800`, colour `var(--racc-ink)` (the room's DARK accent, not
  the bright one) + `tabular-nums;direction:ltr;unicode-bidi:isolate`.
- Headings use the room's **dark** accent ink `--racc-ink` (e.g. kitchen `#8F6B00`,
  salon `#B4494B`), i.e. a darkened cousin of the bright accent — legible, never muddy.
- **Fonts:** display EN `Patrick Hand` (friendly marker), display AR `Aref Ruqaa`
  (elegant naskh); body `Nunito` + `IBM Plex Sans Arabic`. Hero H1
  `clamp(2.8rem,13vw,4.6rem)`; room H2 `clamp(2.4rem,10vw,3.6rem)`; the small eyebrow
  inside H2 is `.9rem` `letter-spacing:.22em uppercase` with a 26px accent rule.

## 2B. THE MARK — the assembling cube-house (beyt's cube)
One inline SVG `viewBox="0 0 320 300"`, four coloured rhombus **faces** drawn as
`<path>` inside a group with a thick ink outline `stroke:#382900;stroke-width:11`:
- f-rose `#D46C6E` (top), f-gold `#C79503` (left), f-ochre `#967100` (right), f-sage
  `#C3C59A` (the small detached cube). Each face `transform-box:fill-box`.
- **Assembly on load:** the four faces FLY IN from four directions and snap together —
  `arr-rose` from `translate(0,-90px) rotate(-14deg)`, `arr-gold` from
  `(-110px,50px) rotate(12deg)`, `arr-ochre` from `(110px,50px)`, `arr-sage` from
  `(90px,110px) rotate(18deg)`; each `1.25s cubic-bezier(.2,.8,.2,1)` at staggered
  delays `.15/.45/.7/1s`. After landing the sage face `float`s gently forever
  (`float 6s`, translateY -6px + 2deg).
- Two window `<rect fill=#FFD98A>` and a `.slights` fairy-light string
  (`<path> + 5 <circle> bulbs`) fade in and TWINKLE (`tw` 2.6s) **only at night**.
- It's a `<button id="cubebtn">`: tapping the house flips day→night, `:active
  svg{transform:scale(.955)}`, focus ring dashed ochre. A `.cubehint` ("psst… tap the
  house / دقّوا عالبيت") appears only once JS arms `body.flip`, and its text swaps
  day/night.
- **THE FOOTER FINALE (this is the "cool animated logo at the bottom"):** the exact
  same cube is rebuilt in `<footer class="finwrap">` as `.finhouse` and RE-ASSEMBLES
  as a mirror of the hero — the four `.fface` faces fly in from the **opposite**
  directions (`fin-rose` from `translate(0,90px) rotate(14deg)`, `fin-gold` from
  `(110px,-50px)`, `fin-ochre` from `(-110px,-50px)`, `fin-sage` from `(-90px,-110px)`),
  staggered `.15/.45/.7/1s`, triggered on scroll-into-view (`.finwrap.reveal.seen`).
  At night, ~2.5s after it settles, the windows fade on and the near window WINKS
  (`fwink` 1.6s steps). Caption: "The same little house that opened the page, waving
  you goodbye / نفس البيت الصغير يلي فتح الصفحة، عم يودّعكن". This bookend — same mark,
  reversed choreography, at the very bottom — is the signature emotional beat.
  *(Note: the GIFT/welcome page's animated cube mark lives at the TOP hero, not the
  footer — see Part 3. The bottom-cube-re-assembly the user remembers is this beyt
  MENU footer; both are the beyt cube, differently staged.)*

## 2C. LAYOUT & CRAFT DEVICES
- **Hand-wobbled everything:** cards use asymmetric radii
  `border-radius:20px 15px 22px 14px / 15px 22px 14px 20px`, alternate radii on
  `:nth-child(even)`, and a tiny rotation (`.35deg` / `-.3deg`) so no two cards sit
  square. Buttons: `border-radius:18px 14px 17px 15px` + hard offset shadow
  `3px 4px 0 var(--card-sh)`, and on click `translate(1px,1px)` with the shadow
  shrinking (a physical press).
- Ink outline is the house style: `border:2.5px solid var(--ink)` on cards, nav chips,
  buttons, gallery frames — thick confident pen.
- Room nav chips `nav.rooms a`: diamond `.dot` (rotated square) coloured per room.
- `.dots` leader between name and price: `border-bottom:2px dotted rgba(56,41,0,.45)`.
- Vertical spine label `.vlabel` (writing-mode vertical, `.5` opacity) on each card.
- **House signature card** `.sig` / `.price-ring`: the price gets a hand-drawn dashed
  ELLIPSE circled around it (`<ellipse stroke-dasharray="9 5" transform="rotate(-3)">`)
  — the marker-circle-the-price move.
- **Ink marginalia ecosystem** (hand-drawn SVG doodles that live and breathe):
  `.ink-rakwe` (coffee pot + rising steam `wisp`), `.ink-olive` (an olive branch whose
  7 leaves pop in one by one `leafin`, then the branch `sway`s), `.ink-cat` (a sleeping
  cat that `purr`s — scale 1↔1.025/.965 — with floating `z` "Zzz"), `.ink-arak` (two
  arak glasses that `clink` and spark — **only at night**). These are the equivalent of
  RUSTIC's smoke: living hand-ink that proves a human drew this.

## 2D. COLOUR SYSTEM
- Palette: rose `#D46C6E`, rose-deep `#B4494B`, gold `#C79503`, ochre `#967100`,
  sage `#C3C59A`, ink `#382900`, paper `#FFFDF6`, glow `#FFD98A`.
- **Per-room accent pair** (`--racc` bright + `--racc-ink` dark, used for headings/
  prices so contrast is guaranteed): kitchen gold/`#8F6B00` · garden sage/`#6E7440` ·
  table `#B08300`/ochre · salon rose/`#B4494B` · balcony glow/`#B4494B` · gallery
  rose/`#B4494B`.
- **Three-phase day system:** `data-phase` = `noon | dusk | night` (plus `morning`
  start). `#sky` has three fixed layers (`p-noon #FDF8EC`, `p-dusk #F5E5C6`, `p-night
  #20263A`) that crossfade on opacity; `#stars` fade in and twinkle at night. The whole
  page literally becomes evening as you scroll or tap.

## 2E. ANIMATION VOCABULARY
- `arr-*` / `fin-*` — cube faces assemble (hero) / re-assemble reversed (footer).
- `float` — settled sage face drifts.
- `tw` — stars + fairy bulbs twinkle (night).
- `fwink` — footer window winks (night, post-settle).
- `inkin`/`wordin`/`rowink`/`namein` — per-letter title ink, per-word, row rise, name
  land — on scroll (`.type-on .reveal.seen`).
- `ppop` — price pops with a scale 1→1.22→1 and slight rotate when its row reveals.
- `dotpop` — the diamond dot beside a heading pops.
- `pstamp` — price "stamps" down.
- `dwob` — hover wobble on doodles.
- `leafin` / `sway` / `wisp` / `purr` / `zfloat` / `clinkL,clinkR` / `sparkpop` — the
  ink-doodle ecosystem.
- `hintpulse` — the tap-hint breathes.
- Greeting `#greet` types by clock; `.swipe` marker-underline behind a hero word.
- Same reduced-motion/lite discipline: one reveal engine (rAF scroll driver + 900ms
  heartbeat + IntersectionObserver), everything snaps to final frame when motion is off.

---

# PART 3 — BEYT WELCOME / GIFT PAGE (the sales weapon)

The whole document is 458 lines, RTL-first (`<html lang="ar" dir="rtl">`, opens in
Arabic, EN toggle). Palette + ink language mirror the menu (rose/gold/ochre/sage/ink
`#382900`/paper `#FFFDF6`). Two hero fonts: `Caveat`/`Patrick Hand` (EN hand) +
`Aref Ruqaa` (AR hand) for the "written by a human" salutations.

## 3A. EXACT SECTION ORDER (top → bottom)
1. **Sticky top bar** — small cube mark SVG + "BEYt / بيت · Mar Mikhael · Beirut" +
   a pulsing language pill (`hintme` = `hintPulse` wobble to invite the tap).
2. **HERO** — kicker "A gift from Menu Sadah / هدية من منيو سادة"; the **animated
   cube-house** (`.housebox`, see 3C — THIS is the gift page's animated logo, at the
   TOP); the `بـيـت` wordmark with the middle letter in rose; sub "BEYt means home";
   H1 "Welcome home, BEYt." with a wobbly sage **marker highlight** under the last word
   (`h1 .u::after`, an organic blob radius); a hand-written promise line; and the
   primary CTA "Open your menu" (gold pill, `box-shadow:3px 3px 0 var(--ink)`).
3. **Personal letter** (`.letter.inkframe`) — a hand-inked frame (see 3C), salutation
   in `Caveat`, a short warm paragraph, signed "Menu Sadah, with love from the studio".
4. **THE FREE OFFER card** (`.freecard`) — the money moment (see 3B).
5. **Three proof points** (`.points`) — numbered rose/gold/ochre badges: "A true gift /
   One free month / Then you decide".
6. **"No catch, no contract" why-line** with a marker-highlighted clause.
7. **"We studied your house"** (`.studied`) — 3 photo cards (hero/garden/dining), each
   with a rotated tag "Detail 01/02/03" and a body that proves they looked: "Your menu
   is drawn by hand, so is ours", "Brunch till 2, best in the garden", "Coffee by day,
   arak by night". **This section is the persuasion engine: specificity = we built this
   FOR YOU, not a template.**
8. Secondary CTA "See your menu live" (ink pill).
9. **"Everything is ready for you"** — a QR hero (printable code, download) + a 2-tile
   grid (Live menu / print B&W code).
10. **Chips row** — ticks: Arabic+English / One tap no app / Prices in dollars /
    Unlimited edits.
11. **Reply block** — hand line "The door of the house is open", "Love it? Reply to our
    message, and we switch on your free month", rose CTA "Open your menu again".
12. **Footer** — "Menu Sadah · beautiful digital menus for houses we admire".

## 3B. THE OFFER / PRICING PRESENTATION
- `.freecard` = a solid **ink `#382900` card**, reversed contrast, cream text, dashed
  inner border `::before`, soft radial colour wash `::after`.
- A rotated **gift badge** ("A gift from the heart / هدية من القلب") pinned at
  `top:-18px`, rose, `rotate(5deg)`, hard ink shadow, and it wobbles (`bwob`).
- **Price anchoring:** `.was` shows "$49 / mo" **struck through in rose**
  (`text-decoration-color:var(--rose);text-decoration-thickness:5px`), rotated `-2deg`,
  then `.big` = "FREE / ببلاش" in `Patrick Hand` at
  `clamp(80px,26vw,140px)` gold with a `text-shadow:0 3px 0 rgba(0,0,0,.4)`. Fine print
  clarifies the menu is kept free + one free support month ($49/mo normally).
- On reveal the was + FREE **scale in from 1.5×** (`.freecard.rv.in .big`) so the price
  lands like a stamp. This is the single loudest moment on the page.

## 3C. THE ANIMATED LOGO (gift page — top hero cube, ink line by ink line)
`.housebox svg viewBox="0 0 200 190"` — a house-cube built from THREE faces + details,
each face a filled shape PLUS an overlaid `fill:none;stroke:#382900` outline path that
**self-draws**:
- `.f-top` (sage roof `#C3C59A`), `.f-left` (paper wall with an always-open rose
  **arched door**), `.f-right` (a **round day/night window** `#C79503` with a cross
  mullion). Faces animate `faceTop` (from y-42), `faceLeft` (from -42x,+26y),
  `faceRight` (from +42x,+26y), each `1s cubic-bezier(.2,1.4,.4,1)` at `.15/.45/.75s`.
- The outline paths carry `.draws` = `stroke-dasharray:340;stroke-dashoffset:340;
  animation:inkdraw 1.1s ease 1.2s forwards` → after the faces fly in, the ink outline
  DRAWS ITSELF over them (the "hand-inked" reveal).
- Late details fade up: the door (`lateshow` 1.7s), the window + mullion (`lateshow2`
  2s), then coffee **steam** rises from the chimney forever (`steamFloat` 3.2s infinite).
- So the gift-page mark = a little house being **drawn to life** — faces assemble, ink
  traces them, door opens, window lights, chimney smokes. It reads as "we hand-drew a
  home for you", which is the entire pitch in one 3-second animation.

## 3D. THE LETTER VOICE
First-person studio, warm, specific, humble-but-confident: "We are a small studio that
builds flagship digital menus for cafes we fall for. We walked through your house in Mar
Mikhael… and we could not help ourselves. **So we built you a gift.**" Arabic is warm
Levantine dialect, not MSA ("تمشّينا ببيتكن… وما قدرنا نمسك حالنا"). Signatures are
hand-font. Every heading is a feeling, never a feature.

## 3E. PERSUASION DEVICES (the full inventory)
1. Price anchor (struck $49 → FREE at 140px). 2. Gift framing everywhere ("a gift from
the heart", "yours to keep, free, forever"). 3. Risk reversal ("No catch, no contract",
"cancel and keep the menu"). 4. Specific proof they studied the client (3 detail cards
tied to real features). 5. Scarcity-of-belief, not scarcity-of-time ("We build free for
houses we believe in, and yours is one of them"). 6. Everything-done-for-you (QR ready
to print, downloads, live link). 7. Trust ticks (bilingual, no app, unlimited edits).
8. Single clear next action repeated (reply → we switch on your free month). 9. Emotional
bookend (the house that welcomes you = the brand promise). 10. Motion that rewards
scrolling (marker swipes fill, badge wobbles, price stamps in) so the page feels alive
and generous.

## 3F. RESILIENCE
The reveal system is triple-hardened for webviews (Instagram in-app browser): hide-states
added only after two live rAF ticks (a frozen clock never hides anything), IntersectionObserver
+ passive scroll sweep + a 1.1s interval sweep, and a `.done` class dropped 1.25s after
`.in` that kills transitions so a frozen transition clock still snaps to the final frame.
Reduced-motion path renders everything static.

---

# PART 4 — WHAT RUSTIC DOES DIFFERENTLY FROM BEYT (personality contrast)

| Axis | BEYT (house) | RUSTIC (grill) |
|---|---|---|
| Shell | dark ink on warm **paper**, cards are pale | **bone on charcoal**, cards are the only pale (butcher tickets) |
| Mark | cube-house that **assembles** from 4 faces | branding-iron ring that **draws + flames** |
| Sections | **rooms** of a house (Kitchen/Garden/Salon/Balcony) | **stations** of a pit (Griddle/Stacks/Coals/Fire Pit) |
| Signature moment | marker circles the price; footer cube re-assembles | full-screen **cinematic iron drop** with canvas sparks + synth audio |
| Living decoration | ink ecosystem: olive, cat, rakwe, arak clink | smoke wisps, hazard-tape runners, sear sparks, neon flicker |
| Day/night | 3-phase sky noon→dusk→night, stars, fairy lights | 2-phase char→ember, soot grain, neon "open late" |
| Voice | tender Levantine, "come as you are, forget the clock" | swaggering Najdi late-night, "order it messy, that's the point" |
| Type | friendly marker `Patrick Hand` + naskh `Aref Ruqaa` | poster-fat `Anton` + `Rakkas` |
| Card craft | wobbly asymmetric radii, tilt, offset shadow | perforated torn edge, punch hole, rotated red stamp |
| Extra | — | "Pitmaster's log" diary tags + a "Wall of love" testimonial grid + sound |

RUSTIC is louder, hotter, has a genuine cinematic + audio set-piece and a testimonial
wall; BEYT is warmer, quieter, and leans on the ink-marginalia ecosystem and the
day-turns-to-evening story. Both share the SAME spine: dark ink type, one self-building
brand mark echoed at top and bottom, hand-drawn imperfection, a flippable day/night
world, bilingual per-letter reveals, and total reduced-motion/webview resilience.

---

# PART 5 — THE 10/10 CHECKLIST (what an implementer must reproduce)
1. **Ink-dark or paper-light body text** — never the accent for reading. Headings get a
   darkened cousin of the accent (`--racc-ink`) or bone/ink; add hard offset shadow +
   text-stroke on light-on-dark titles.
2. **One bespoke, self-assembling brand mark** per cafe, echoed as a small header mark
   AND a re-choreographed footer finale (assemble at top, reverse-assemble at bottom).
3. **Hand-drawn imperfection:** asymmetric wobbly radii, 0.3–5° rotations on cards/
   stamps/badges, dotted leaders, dashed inner frames, hard offset shadows (`Npx Npx 0`).
4. **Per-section accent rotation** (4+ hues), driving pips/kickers/underlines/prices.
5. **A living decoration layer** (ink doodles OR smoke/sparks) that loops subtly and
   reacts to day/night.
6. **A flippable day→night world** via `data-phase` + opacity-crossfade sky layers,
   plus a tap-target mark/dial and a persuasive greeting that types by clock.
7. **Self-drawing SVG strokes** (`stroke-dashoffset` 100→0) for underlines and price
   rings; per-letter EN ink-in + per-word AR reveals on scroll.
8. **Price drama:** stamp/pop/sear/marker-circle the number; struck-through anchor on
   the gift page.
9. **Bilingual to the bone** with `direction:ltr;unicode-bidi:isolate` on all numbers,
   RTL-mirrored draws, and dialect (not MSA) copy that sounds hand-written.
10. **Bulletproof:** JS-armed reveals (no-JS never hides content), reduced-motion + lite
    snap-to-final, webview-frozen-clock fallbacks, `prefers-reduced-motion` honoured.

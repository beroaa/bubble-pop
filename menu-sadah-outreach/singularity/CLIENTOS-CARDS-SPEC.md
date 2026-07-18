# 🫧 CLIENTOS MENUS CARDS — redesign spec (execute on the Mac, in-app)

Use ClientOS's existing tokens ONLY (bubble-fill gradient, gold accent, radii,
ease cubic-bezier(.16,1,.3,1)). His design language wins over everything here.

## Grid
- Desktop width (app window ≥1200px): **3 cards per row**, gap 16px.
  Between 720–1200px: 2 per row. Below 720: 1. CSS grid, `minmax(300px,1fr)`.
- Card: radius **24px** (bubbly, not boxy), padding 18px, subtle border,
  background one step lighter than page; soft shadow at rest.

## Card anatomy (top to bottom — breathing room, no cramming)
1. **Bubble avatar 56px** (bigger): the app's bubble-fill radial recolored by
   status — green glow pulse (2.4s) only on green/ready cafes. Flag chip 18px
   overlapping bottom-right of bubble.
2. **Name block**: EN name 17px/700; AR name 14px under it (not beside),
   text-2 color; area · type line 11.5px text-3. Max 2 lines total, ellipsis.
3. **Status strip**: stage progress dots (8 mini-pills like Higanah card has
   today) + stage label 10.5px mono uppercase. Keep — it's already good.
4. **THE ONE BUTTON** (see below) full-width, height 44px, radius 999px.
5. **Icon row** (secondary, 32px round icon buttons, centered, 8px gap):
   📋AR · 📋EN · ▤ menu · 🎁 gift-page · ⋯ overflow (edit, copy link, uno).

## Smart button system — ONE primary action, decided by stage
| Stage | Button label | What it does |
|---|---|---|
| NEW/READY | 🎁 Send the gift | copies AR DM + opens the giftUrl |
| CONTACTED/SENT | ↻ Nudge them | copies the Day-2 nudge text |
| day5 passed, no reply | 🕊 Last touch | copies the Day-5 goodbye |
| REPLIED | 🎙 Close it | opens deal cockpit / shows voice-note script |
| SIGNED | 👑 Signed — view menu | opens menuUrl, button gold, non-pulsing |
Primary = the app's gold accent EXCEPT SIGNED (gold w/ crown) and nudge
(outline style). Never show more than ONE big button. All URLs come ONLY from
clientos-menus-payload.json giftUrl/menuUrl — never constructed.

## Dopamine motion (each ≤400ms, all behind prefers-reduced-motion guard)
- **Hover**: card lifts translateY(-3px) + shadow deepens, 160ms ease-out.
- **Press**: button scale .95 spring back (cubic-bezier(.2,1.6,.4,1), 240ms).
- **Copy success**: button flips to green ✓ + "+XP" chip rises from tap point
  (reuse the app's native XP system — do NOT invent a second one).
- **Stage advance**: gold ring bursts outward from the bubble (scale 1→1.6,
  opacity fade, 350ms) + stage dot fills with a pop.
- **SIGNED**: 40-particle gold confetti from card center, 1.2s, once; card
  border turns gold permanently. Play the app's existing pop.wav.
- **Card entrance**: stagger fade-up 24px, 40ms delay per card, first paint only.

## Rules
- No layout shift on hover (transform only). 60fps: animate transform/opacity
  ONLY. Bigger tap targets ≥44px. AR text always dir=rtl.

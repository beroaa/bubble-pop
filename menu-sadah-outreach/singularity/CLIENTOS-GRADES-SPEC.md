# 💜 MENU GRADES — ClientOS widget spec (apply on the Mac, in-app)

Every cafe in clientos-menus-payload.json now has `grade`: purple|green|orange|red.
Replace the old 3-color status logic with these 4 grades on the MENUS cards.

## The four looks (use app tokens; purple values below are new additions)
- **💜 PURPLE — ELITE (16 cafes).** The flex tier. Card treatment:
  border 1px #a78bfa66, bubble recolored with a violet radial
  (#c4b5fd73 → #8b5cf68c 45% → #6d28d9d9), outer glow box-shadow
  0 0 18px #8b5cf655 with a slow 3s breathe, tiny 👑 or ✦ badge top-right,
  label "ELITE" 9px letterspaced in #c4b5fd. Expensive, quiet, no rainbow.
- **💚 GREEN — GOOD (61).** Current green bubble treatment, label "READY".
- **🟠 ORANGE — DEMO (865).** Current orange, label "DEMO" (honest: template
  menu with own brand palette, no real dishes yet).
- **🔴 RED — NOT READY (6).** Current red, label "NEEDS WORK", sorted last.

## Rules
- Sort default: purple → green → orange → red inside every country group.
- Filter chips get the 4 grades with counts (replace old 3-status chips).
- Purple glow must respect prefers-reduced-motion (static glow, no breathe).
- Grade comes ONLY from payload `grade` field — never computed in-app.

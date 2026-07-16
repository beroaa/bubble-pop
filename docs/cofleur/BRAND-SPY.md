# Maison de Cofleur — Brand Spy Findings (2026-07-15)

## Identity
- **Names:** EN `Maison de Cofleur` · AR `ميزون دو كوفلير` (their own spelling — دو, not دي)
- **Concept:** French-countryside garden café/bakery — "Cofleur" = coffee + fleur. Lush plants, dark walnut wood, sourdough display, floral accents.
- **Logo:** lotus/flower mark whose petals are **coffee beans** (center bean with S-crease), caramel on cream; wordmark in ultralight wide geometric sans with script "de".

## Palette (sampled from logo file)
| Token | Hex | Use |
|---|---|---|
| Cream | `#fff8f2` | Background |
| Caramel | `#a67b51` | Mark, accents, "de" |
| Olive gold | `#b1a37e` | Wordmark letters |
| Dark walnut | `#4b382b` | Wood tones (photos) |

## Fonts
- **Their materials:** ultralight geometric sans (Century Gothic / Futura class) in logo + promos.
- **Closest hosted matches used:** EN display `Jost` (300/400), EN text `Poppins` (300–600), AR `Almarai` (300–800). All self-hosted woff2 in `menus/cofleur/fonts/`.

## Links & facts
- Instagram **@mdcofleur** · TikTok **@cofleur.sa**
- WhatsApp/phone: **+966 55 184 2557**
- Address: Abi Bakr As Siddiq Rd, An Nada, Riyadh 13317 — maps: https://maps.app.goo.gl/vA77JDhSJoZ8gN4g9
- Reservations: https://mytable.sa/widget/reservation/?rid=2367&lang=en (myTable rid 2367)
- VAT no. `312441114900003`, prices VAT-inclusive
- Their current menu platform: `cofleur.yallaqrcodes.com` (Yalla QR / yallaplus), default language **ar**, restaurant id 6668
- Press: ArabNews "Where We Are Going Today" (Jan 2026) — praises Benedicts, shakshuka, French toast; TimeOut Riyadh feature.

## Data extraction (repeatable)
Their platform exposes public JSON (no auth):
- `https://cofleur.yallaqrcodes.com/api/info/` — identity, links, settings
- `https://cofleur.yallaqrcodes.com/api/categories/` — 26 categories (menu 1 = All Day, menu 2 = breakfast set)
- `https://cofleur.yallaqrcodes.com/api/items-light/` — all 136 items: name_en/ar, description_en/ar, price, calories, image URLs
- Item images: `<image_full>.150x150_q100_crop.webp` (only original + 150 crop exist; 300/400 variants 403)
- **Note:** browser-through-proxy fails in this environment (CONNECT reset); use `curl` for remote fetches, local Chromium for rendering checks.

## Menu snapshot (built into the page)
- 136 items / 26 categories / prices 9–93 SR, all integers; 100 items have photos.
- Groups used on the page: Breakfast (Benedict Eggs, Croissants, Sourdough, Omelette, Eggs, Sharing Dishes) · All Day (Soups → Desserts) · Drinks (Mojito → Water).

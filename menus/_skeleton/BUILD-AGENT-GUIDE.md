# Skeleton build guide (for humans and build agents)

One menu = one folder `menus/<slug>/` containing:

```
data/brand.json    data/menu.json    fonts/*.woff2 + fonts/fonts.css
assets/items/*.webp (optional)       assets/wordmark.png (optional)
```
Then: `node menus/_skeleton/build.mjs menus/<slug>` → emits `menus/<slug>/index.html`.

## brand.json
```jsonc
{
  "slug": "example", "name_en": "Example Cafe", "name_ar": "مثال",
  "city": "Manama", "country": "BH",
  "palette": { "cream": "#...", "card": "#...", "accent": "#...", "accentDeep": "#...",
               "muted": "#...", "mutedDeep": "#...", "ink": "#...", "inkSoft": "#...",
               "faint": "#...", "hairline": "rgba(...)" },
  "currency": { "label": "BD", "decimals": 3 },      // Bahrain. Saudi: {"label":"SR","decimals":0}
  "fontEN": "Poppins", "fontDisplay": "Jost", "fontAR": "Almarai",
  "preloadFonts": ["poppins-500-latin.woff2"],
  "links": { "whatsapp": "https://wa.me/973...", "maps": "...", "instagram": "...", "reserve": "" },
  "loc": { "en": "ADLIYA · BAHRAIN", "ar": "العدلية، البحرين" },
  "address": "...", "address_ar": "...",
  "vat_note": "Prices include VAT",                   // only if source shows it
  "wordmark": { "file": "assets/wordmark.png", "w": 900, "h": 140 },  // or omit → styled text wordmark
  "heroSVG": "<svg class=\"hero-anim\" ...>...</svg>",
  "markSVG": "<svg viewBox=\"...\">static mini mark</svg>",
  "groups": [ { "id": "drinks", "en": "Drinks", "ar": "المشروبات", "cats": [1,2] } ],
  "teaser": null                                       // or Tier B: {"en":"This is a taste of the menu — the full menu goes live within 24 hours of your yes 🌸","ar":"هذي عينة من المنيو، والمنيو الكامل يجهز خلال ٢٤ ساعة"}
}
```

## menu.json
Same shape as cofleur: `{ "categories": [ { "id", "name_en", "name_ar", "items": [ { "name_en", "name_ar", "desc_en", "desc_ar", "price", "calories", "local" } ] } ] }`
- `price` numeric, from a REAL source. Never invent. Bahrain prices look like 2.5 / 2.500.
- `local` = `items/<file>.webp` relative to `assets/`, or null.

## heroSVG conventions (the signature animation)
Root: `<svg class="hero-anim" width=".." viewBox="..">`, wrap everything in `<g class="breathe-root">`.
- Shape entrance: `<g class="el" style="--d:.25s;--a:-40deg;--ox:100px;--oy:120px">` — staggered `--d`, final rotation `--a`, per-element transform-origin.
- Line draw-on: `<path class="line" style="--len:340;--d:1.1s" stroke="..." fill="none">` (set `--len` ≥ path length).
- Simple fade: `class="fade"` + `--d`.
Reduced-motion fallback is automatic. Trace THEIR mark: bean, leaf, cup, letter, flame, wave — elegant and abstract, never childish. 3+ visual QC iterations against their real logo.

## Fonts recipe
`curl -A "Mozilla/5.0 ... Chrome/126" "https://fonts.googleapis.com/css2?family=<F>:wght@300;400;500;600&display=swap"` → download woff2 URLs → write `fonts/fonts.css` with `@font-face` + `unicode-range` per subset (latin for EN, arabic+latin for AR family).

## Tier rules
- **Tier A**: full real menu extracted (platform API / Talabat `__NEXT_DATA__` / their PDF). Fidelity audit DOM vs source required.
- **Tier B teaser**: 8–15 items verified from public sources (delivery listing, posted menu photos, tagged posts). MUST set `brand.teaser` so the page says it's a taste. Never present a teaser as complete.

## QC gates (every build)
1. `node menus/_skeleton/build.mjs menus/<slug>` runs clean.
2. Playwright at 375×812: no horizontal overflow, no console/page errors, no broken images, fonts loaded.
3. Screenshot hero + one category; hero mark must read as THEIR logo.
4. Numbers spot-check vs source (Tier A: scripted 1:1 audit).

## QR (only after slug is final)
`python3 menus/_skeleton/qr.py <slug> <accentHex> <creamHex>` → writes `menus/<slug>/qr/` (SVG + PNGs) and verifies decode. Print cards: copy `menus/cofleur/qr/print.html` pattern with the brand's mark + colors.

# 🛒 CART + WHATSAPP CHECKOUT — the business-tool layer (queued)

Expert call (locked 2026-07-19): the #1 feature that makes a Riyadh cafe owner pay.
In Saudi, WhatsApp IS commerce. A menu that sends orders to the cafe's WhatsApp =
"this runs my business," not just "pretty." Inspired by the WASM demo's cart engine
(Hult repo), rebuilt native in lib/pages-masterpiece.mjs. FIRES AFTER the Saudi-soul
background pass lands (one renderer-surgeon at a time).

## What to build (masterpieceMenuPage)
1. CART STATE: vanilla JS, localStorage['ms-cart-<slug>']. Each item: {id,nm{ar,en},qty,price}.
   The existing "اطلب / Order" chips become "+ add" — tap adds to cart with a pop + count badge.
2. FLOATING CART BAR: sticky bottom pill "🛒 سلتك · N أصناف · TOTAL ﷼" — tap opens a sheet.
3. CART SHEET: list items, qty +/- , remove, running total. Bilingual, RTL-correct (logical CSS — RTL QA gate).
4. WHATSAPP CHECKOUT: "أرسل الطلب واتساب" builds a prefilled wa.me/<cafe phone>?text=... with the
   full order (each item + qty + total, Arabic). If cafe has a real phone (queue.json `phone`) → live link.
   No phone (most) → demo tooltip "يتفعّل مع رقم واتساب المقهى · Activates with the cafe's WhatsApp"
   (honest — that line itself sells activation). NEVER invent a phone number.
5. Reduced-motion safe; must NOT reduce text contrast (legibility was hard-won); coexist with all
   current features (backgrounds, marks, order chips, print mode, sky-dial).

## Evidence law
- Prices come from the same vetted menu data. No invented dishes/prices.
- No fake phone numbers; demo state is honest and premium.

## Later (from the WASM build, ranked after cart)
- Priced customization sheets (extra shot +5, oat milk +3)
- owner sales-closer page (per cafe conversion weapon)
- PWA offline + install-to-homescreen
- Mine research/DOSSIER.md (167 insights) for menu-psychology upgrades

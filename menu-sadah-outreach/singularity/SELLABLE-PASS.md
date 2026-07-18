# 💰 SELLABLE PASS — 4 features that make owners BUY (queued behind limit-break)

Target: all 50 masterpiece menus (lib/pages-masterpiece.mjs). Evidence law holds.

1. TAP-TO-ORDER (WhatsApp)
   - Every .item gets a small "اطلب 🟢 / Order" chip.
   - If cafe has a real phone (queue.json field `phone`, few do): wa.me/<phone>?text=<prefilled Arabic order msg with item name>.
   - No phone (most): chip renders in demo state — soft outline, tap opens a tooltip
     "يتفعّل مع رقم واتساب المقهى ✦ Activates with the cafe's WhatsApp" — honest, sells activation.

2. TABLE-AWARE QR
   - JS reads ?t= param: menu greeting becomes "طاولة ٥ — حياكم" and a floating
     "🔔 نادِ النادل / Call the waiter" button appears (wa.me if phone, else demo tooltip).
   - QR kits later print per-table codes (?t=1..12) — mention in gift page ready-kit tile.

3. PRINT-PERFECT MODE
   - @media print stylesheet: white background, ink text, no animations/motes/orbs,
     rooms as clean sections with prices, footer QR note. A4-tight. One beautiful paper menu
     from the same URL (Cmd+P).

4. SFDA CALORIE LAYER
   - Every item price row gains a muted slot: "— سعرة · — كافيين" placeholder with
     one legend line under the demo-note: "خانات السعرات والكافيين جاهزة — تتفعّل ببياناتكم
     خلال دقائق (متوافق مع اشتراطات هيئة الغذاء والدواء)". NO invented numbers ever.

QA: rebuild 50, browser sweep incl. print emulation (page.emulateMedia print screenshot),
?t=4 param test, reduced-motion, then commit+push. Board: btrack card + m50 feed updates.

5. THE ROYAL OFFER (gift pages — masterpieceWelcomePage)
   - New section "العرض الملكي ✦ The Founding Offer" above the FREE card:
     * "أول ٢٠ مقهى مؤسس في الرياض" — founding-20 scarcity (REAL: Ibrahim commits to
       honoring the cap; no fake countdown timers ever).
     * Elite tier list (what the card eventually buys): شهر مجاني كامل → then 49$/mo:
       تعديلات بلا حدود · أزرار طلب واتساب · QR لكل طاولة · نسخة طباعة A4 ·
       خانات SFDA · تقرير زيارات شهري · أولوية دعم بنفس اليوم.
     * CTA: "فعّلوا تجربتكم الملكية — بنفس اليوم" → wa.me (CONTACT.whatsapp when real,
       demo tooltip otherwise).
   - Copy voice: Made-to-Stick, businessman, zero hype-lies. Payment links (Moyasar/Tap)
     get wired ONLY when Ibrahim's merchant account exists — until then WhatsApp closes the deal.

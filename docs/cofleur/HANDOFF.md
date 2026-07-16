# Maison de Cofleur — Handoff / كيف تستخدمون المنيو

**Live menu / رابط المنيو:** https://menu-sadah.com/cofleur

---

## للمقهى (Arabic — send this section to the owner)

### ١) الرابط
- هذا رابط منيوكم: **menu-sadah.com/cofleur**
- حطوه في: بايو انستقرام + ملفكم في قوقل ماب (Google Business) + رسائل الواتساب الترحيبية.

### ٢) بطاقات الطاولات (جاهزة للطباعة)
- الملف: **table-cards.pdf** — ورق A4، كل ورقة فيها ٤ بطاقات.
- اطبعوها على ورق سميك (٢٥٠–٣٠٠ جرام)، قصوا على الخطوط المتقطعة.
- مقاس البطاقة يناسب حوامل الأكريليك مقاس A6 الموجودة في المكتبات.
- امسحوا البطاقة بجوالكم قبل التوزيع للتأكد — تفتح المنيو مباشرة.

### ٣) تعديل الأصناف والأسعار
- أي تعديل (صنف جديد، سعر، صورة، إخفاء صنف): أرسلوه **واتساب** وينفّذ خلال **٢٤ ساعة** — هذي جزء من اشتراككم، بدون أي تكلفة إضافية.
- ما تحتاجون تطبعون شي من جديد — البطاقات نفسها تظل شغالة للأبد.

### ٤) ملاحظات
- المنيو يفتح بدون تطبيق وبدون تحميل، ويشتغل حتى على النت الضعيف.
- الأسعار المعروضة شاملة الضريبة (نفس منيوكم الحالي) ورقم الضريبة ظاهر أسفل الصفحة.

---

## For the seller (you)

### Files
| File | Use |
|---|---|
| `menus/cofleur/index.html` | The menu page (self-contained: fonts + images local) |
| `menus/cofleur/qr/table-cards.pdf` | Ready-to-print A4, 4 table cards per sheet |
| `menus/cofleur/qr/print.html` | Same cards, editable/re-printable from browser |
| `menus/cofleur/qr/cofleur-qr.svg` | Branded QR, vector — for print shops, stickers, signage |
| `menus/cofleur/qr/cofleur-qr-styled.png` | Branded QR raster (1230px) — for socials/WhatsApp |
| `menus/cofleur/qr/cofleur-qr.png` | Plain high-compat QR fallback |
| `docs/cofleur/OUTREACH.md` | DM scripts + price talk + objections |
| `docs/cofleur/BRAND-SPY.md` | Everything extracted about the brand |

### Deploy
Copy `menus/cofleur/` to the web root of menu-sadah.com as `/cofleur/` (so `menus/cofleur/index.html` → `menu-sadah.com/cofleur/`). All asset paths are relative — no config needed. (QR codes already point to `https://menu-sadah.com/cofleur`.)

### Updating their menu later (the SR199/mo work)
1. Edit `menus/cofleur/data/menu.json` (names/prices/desc/calories), or re-scrape their platform APIs (see BRAND-SPY.md) if they update their old system.
2. `node menus/cofleur/_build/build.mjs`
3. Redeploy `index.html`. Done — QR/cards never change.

// Generate the rest of the "all-included" pack for each menu:
// qr-<slug>.png (1200px ECC-H) + qr-<slug>.svg + table-card.html (A6 print) + handover.md
// Uses menus/_kit/tokens.json (palette) + menus/index.json (names/city).
// Usage: node menus/_kit/pack.mjs [slug ...]   (default: every menu missing a full pack)
import QRCode from 'qrcode';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ROOT = '/home/user/bubble-pop/menus';
const tokens = JSON.parse(readFileSync(`${ROOT}/_kit/tokens.json`, 'utf8'));
const cat = JSON.parse(readFileSync(`${ROOT}/index.json`, 'utf8'));
const bySlug = new Map(cat.menus.map(m => [m.slug, m]));

const arg = process.argv.slice(2);
const slugs = arg.length ? arg : cat.menus.filter(m => !m.pack_complete).map(m => m.slug);

const tableCard = (m, t, svg, url) => `<!DOCTYPE html>
<html lang="en" dir="ltr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${m.name} — Table Card (Print A6)</title>
<style>
  :root{--accent:${t.accent};--ink:#241A10;--dim:#6E5C44;--card:#FBF7F0}
  *{margin:0;padding:0;box-sizing:border-box}
  @page{size:105mm 148mm;margin:0}
  body{background:#3a2e20;display:flex;justify-content:center;padding:24px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  .card{width:105mm;height:148mm;background:var(--card);color:var(--ink);display:flex;flex-direction:column;align-items:center;text-align:center;padding:11mm 10mm 9mm;box-shadow:0 12px 40px rgba(0,0,0,.45)}
  @media print{body{background:none;padding:0;display:block}.card{box-shadow:none;page-break-after:always}}
  .mark{width:12mm;height:12mm;margin-bottom:4mm;border:1.4mm solid var(--accent);border-radius:50%;position:relative}
  .mark::after{content:"";position:absolute;inset:2.4mm;border-radius:50%;background:var(--accent);opacity:.9}
  .brand{font-weight:800;font-size:20pt;letter-spacing:.14em;line-height:1}
  .brand-ar{font-size:12pt;color:var(--dim);margin-top:2.5mm}
  .rule{width:14mm;height:.6mm;background:var(--accent);margin:5mm 0 6mm}
  .qrbox{width:52mm;height:52mm;padding:4mm;background:#fff;border:.5mm solid var(--accent);border-radius:3mm}
  .qrbox svg{width:100%;height:100%;display:block}
  .scan-en{margin-top:5.5mm;font-weight:700;font-size:11pt;letter-spacing:.04em}
  .scan-ar{font-size:10pt;color:var(--dim);margin-top:1.6mm}
  .url{margin-top:4mm;font-weight:600;font-size:8.5pt;letter-spacing:.10em;color:var(--accent)}
  .foot{margin-top:auto;font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
</style></head><body>
  <div class="card">
    <div class="mark"></div>
    <div class="brand">${m.name.toUpperCase()}</div>
    <div class="brand-ar">${m.name_ar}</div>
    <div class="rule"></div>
    <div class="qrbox">${svg}</div>
    <div class="scan-en">Scan to view the menu</div>
    <div class="scan-ar">امسح الرمز لتصفّح القائمة</div>
    <div class="url">${url.replace('https://', '')}</div>
    <div class="foot">${m.city} · menu-sadah.com</div>
  </div>
</body></html>`;

const handover = (m, t, url) => `# ${m.name} · ${m.name_ar} — Delivery Pack

**Live menu:** ${url}
**City:** ${m.city}

## What's in this folder
| File | What it is |
|---|---|
| \`index.html\` | The live bilingual menu page |
| \`gift.html\` | The gift doc — SR 499+199 → **free** reveal (send this to open the conversation) |
| \`qr-${m.slug}.png\` | Table QR, 1200 px, ECC-H → the live menu |
| \`qr-${m.slug}.svg\` | Same QR as vector, for print shops |
| \`table-card.html\` | Print-ready A6 table card (open → Print, 100% scale, A6) |
| \`handover.md\` | This file |

The QR points at the permanent link — it **never changes**, even when items or prices change.

## For the cafe — how to use · طريقة الاستخدام
**بالعربي:** اطبعوا \`table-card.html\` بمقاس A6 على ورق مطفي ٢٥٠–٣٠٠ غرام، كرت لكل طاولة + كرت عند الكاشير. حطوا الرابط \`${url.replace('https://', '')}\` في بايو الإنستقرام. أي تعديل (سعر/صنف)؟ رسالة واحدة ويتحدث نفس اليوم — نفس الرمز، نفس الرابط.

**English:** Print \`table-card.html\` at A6 on 250–300 gsm matte; one per table + one at the register. Put \`${url.replace('https://', '')}\` in your Instagram bio. Any change (price/item)? One message, same-day update — same code, same link.

## Internal — Menu Sadah (do not forward)
- **Offer:** free menu + 1 month free → then SR 199/month. Anchor build value framed as a gift.
- **Brand tokens:** bg \`${t.bg}\` · ink \`${t.ink}\` · accent \`${t.accent}\` · accent2 \`${t.accent2}\`.
- **Concept:** ${m.concept || '—'}
- **Outreach:** gift-first, lead with the gift doc, never "QR menu", voice-matched to the owner.
`;

let done = 0;
for (const slug of slugs) {
  const m = bySlug.get(slug), t = tokens[slug];
  if (!m || !t) { console.log('skip', slug, '(no catalog/token)'); continue; }
  if (!existsSync(`${ROOT}/${slug}/index.html`)) { console.log('skip', slug, '(no menu)'); continue; }
  const url = `https://menu-sadah.com/${slug}`;
  await QRCode.toFile(`${ROOT}/${slug}/qr-${slug}.png`, url, { errorCorrectionLevel: 'H', margin: 2, width: 1200, color: { dark: '#1A1512', light: '#FFFFFF' } });
  const svg = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 0, color: { dark: '#1A1512', light: '#0000' } });
  writeFileSync(`${ROOT}/${slug}/qr-${slug}.svg`, svg);
  writeFileSync(`${ROOT}/${slug}/table-card.html`, tableCard(m, t, svg, url));
  writeFileSync(`${ROOT}/${slug}/handover.md`, handover(m, t, url));
  done++;
  console.log('pack:', slug);
}
console.log(`\ngenerated full packs for ${done} menus`);

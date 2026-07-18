// Regenerates dms.html (PRIVATE DM cockpit — never upload with the menus).
// Ranks all cafes best-first and writes one personalized Arabic DM per cafe.
// Usage: node gen-dms.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dmAr, dmEn, nudgeAr, byeAr } from '../lib/messages.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const queue = JSON.parse(readFileSync(join(DIR, 'queue.json'), 'utf8'));
const SITE = 'https://menu-sadah.com';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const score = (c) => {
  let s = 0;
  if (c.signature && c.signature.length) s += 3;
  else if (c.sigMention) s += 2;
  if (c.social) s += 1;
  if (c.tier === 'luxe') s += 0.5;
  if (c.chainFlag) s -= 10;
  return s;
};
const stars = (c) => (c.signature && c.signature.length) ? '⭐⭐⭐' : c.sigMention ? '⭐⭐' : c.social ? '⭐' : '·';
const gradeEmoji = (c) => ({purple:'💜', green:'💚', orange:'🟠', red:'🔴'}[c.grade] || '');

const sorted = queue.slice().sort((a, b) => score(b) - score(a) || (a.name > b.name ? 1 : -1));
const rows = sorted.map((c, i) => {
  const dish = (c.signature && c.signature.length) ? c.signature[0][1] : c.sigMention ? c.sigMention[1] : null;
  return `<div class="row"><div class="top"><b>#${i + 1}</b> <span class="nm">${esc(c.name)}${c.tier === 'luxe' ? ' ✨' : ''}</span> <span class="ar">${esc(c.nameAr || '')}</span>
<span class="meta">${esc(c.area || 'Riyadh')} · ${esc((c.type || '').replace(/_/g, ' '))} · ${gradeEmoji(c)} ${stars(c)}${c.themeLabel ? ' · 🎨 ' + esc(c.themeLabel) : ''}${c.chainFlag ? ' · <span class="chain">⚠ chain — low priority</span>' : ''}</span></div>
<div class="soc">${c.social ? '📱 ' + esc(c.social) + ' &nbsp; ' : ''}🔗 <a href="${SITE}/${c.slug}-welcome">/${c.slug}-welcome</a>${dish ? ' &nbsp; 🍽 «' + esc(dish) + '»' : ''}</div>
<textarea readonly id="dmA${i}">${esc(dmAr(c))}</textarea>
<button onclick="copyDm('A${i}')">📋 نسخ الرسالة العربية</button>
<textarea readonly id="dmE${i}" dir="ltr" style="direction:ltr;margin-top:6px">${esc(dmEn(c))}</textarea>
<button onclick="copyDm('E${i}')">📋 Copy English DM</button>
<textarea readonly id="dmN${i}" style="display:none">${esc(nudgeAr(c))}</textarea>
<textarea readonly id="dmB${i}" style="display:none">${esc(byeAr(c))}</textarea>
<button class="mini" onclick="copyDm('N${i}')">↻ Day-2 nudge</button>
<button class="mini" onclick="copyDm('B${i}')">🕊 Day-5 goodbye</button></div>`;
}).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DM COCKPIT — MENU SADAH</title><style>
:root{--bg:#161210;--bg1:#1f1915;--b:#35291f;--t1:#f5efe6;--t2:#c6b9a6;--t3:#8b7d6a;--a:#e3b23c}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--t1);font:14px/1.5 -apple-system,"Segoe UI",Tahoma,Arial,sans-serif;padding:20px 14px 60px}
.wrap{max-width:680px;margin:0 auto}h1{font-size:18px;letter-spacing:.1em}h1 b{color:var(--a)}
.sub{color:var(--t3);font-size:12.5px;margin:6px 0 16px}
.row{background:var(--bg1);border:1px solid var(--b);border-radius:14px;padding:14px;margin-bottom:10px}
.nm{font-weight:700}.ar{color:var(--t3)}.meta{display:block;color:var(--t3);font-size:12px;margin-top:2px}
.chain{color:#e8883c;font-size:11px}
.soc{font-size:12.5px;color:var(--t2);margin:6px 0}.soc a{color:var(--a);text-decoration:none}
textarea{width:100%;min-height:96px;background:var(--bg);border:1px solid var(--b);border-radius:10px;color:var(--t2);padding:10px;font:12.5px/1.6 inherit;direction:rtl;resize:vertical}
button{margin-top:8px;background:var(--a);color:#1d1610;border:none;border-radius:999px;padding:7px 18px;font-weight:700;cursor:pointer}
.done button{background:#57b380}
button.mini{background:transparent;border:1px solid var(--b);color:var(--t2);font-weight:600;margin-inline-start:6px}
</style></head><body><div class="wrap">
<h1>💬 DM <b>COCKPIT</b> — MENU SADAH</h1>
<p class="sub">All ${sorted.length} cafes, best first: ⭐⭐⭐ real dishes+prices · ⭐⭐ real dish named in gift · ⭐ social known · ✨ luxe · 🎨 its own brand palette. PRIVATE — do not upload with the menus.</p>
${rows}
</div><script>
function copyDm(i){const t=document.getElementById('dm'+i);navigator.clipboard.writeText(t.value).then(()=>{const r=t.closest('.row');r.classList.add('done');t.nextElementSibling.textContent='✓ Copied — go send it';});}
</script></body></html>`;

writeFileSync(join(DIR, 'dms.html'), html);
const top = sorted.filter((c) => stars(c) === '⭐⭐⭐').length;
console.log(`dms.html regenerated: ${sorted.length} cafes, ${top} at ⭐⭐⭐`);

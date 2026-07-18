// PERSONAL-50 campaign cockpit (PRIVATE): the 50 target cafes + messages + strategy.
import { readFileSync, writeFileSync } from 'node:fs';
import { dmAr, dmEn, nudgeAr, byeAr } from '../lib/messages.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = dirname(fileURLToPath(import.meta.url));
const fifty = JSON.parse(readFileSync(join(DIR, 'purple50.json'), 'utf8'));
const queue = JSON.parse(readFileSync(join(DIR, 'queue.json'), 'utf8'));
let kits = {};
try { kits = JSON.parse(readFileSync(join(DIR, 'persuasion50.json'), 'utf8')); } catch { kits = {}; }
const cafes = fifty.map((s) => queue.find((c) => c.slug === s)).filter(Boolean);
const esc = (x) => String(x ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rows = cafes.map((c, i) => {
  const kit = kits[c.slug];
  const kitExtras = kit ? `
<textarea readonly id="s${i}" style="display:none">${esc(kit.storyReplyAr)}</textarea>
<button class="mini" onclick="cp('s${i}',this)">📖 قصة</button>
<textarea readonly id="v${i}" style="display:none">${esc(kit.voiceScriptAr)}</textarea>
<button class="mini" onclick="cp('v${i}',this)">🎤 صوتي</button>
<textarea readonly id="o${i}" style="display:none">${esc(kit.objectionAr)}</textarea>
<button class="mini" onclick="cp('o${i}',this)">💰 سعر؟</button>` : '';
  return `<div class="row"><div class="top"><b>#${i + 1}</b> <span class="nm">${esc(c.name)}</span> <span class="ar">${esc(c.nameAr || '')}</span>
<span class="meta">${esc(c.area || 'Riyadh')} · 📱 ${esc(c.social || '')} · 🎨 ${esc(c.themeLabel || '')}</span></div>
<div class="soc">🔗 <a href="https://menu-sadah.com/${c.slug}-welcome">/${c.slug}-welcome</a></div>
<textarea readonly id="a${i}">${esc(kit ? kit.dmAr : dmAr(c))}</textarea>
<button onclick="cp('a${i}',this)">📋 نسخ الرسالة</button>
<textarea readonly id="e${i}" dir="ltr" style="direction:ltr;margin-top:6px;display:none">${esc(dmEn(c))}</textarea>
<button class="mini" onclick="tg('e${i}')">EN</button>
<textarea readonly id="n${i}" style="display:none">${esc(kit ? kit.day2Ar : nudgeAr(c))}</textarea>
<button class="mini" onclick="cp('n${i}',this)">↻ Day-2</button>
<textarea readonly id="b${i}" style="display:none">${esc(kit ? kit.day5Ar : byeAr(c))}</textarea>
<button class="mini" onclick="cp('b${i}',this)">🕊 Day-5</button>${kitExtras}</div>`;
}).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PERSONAL-50 CAMPAIGN — MENU SADAH</title><style>
:root{--bg:#161210;--bg1:#1f1915;--b:#35291f;--t1:#f5efe6;--t2:#c6b9a6;--t3:#8b7d6a;--a:#e3b23c;--p:#a78bfa}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--t1);font:14px/1.5 -apple-system,"Segoe UI",Tahoma,Arial,sans-serif;padding:20px 14px 60px}
.wrap{max-width:680px;margin:0 auto}h1{font-size:18px;letter-spacing:.1em}h1 b{color:var(--p)}
.strategy{background:var(--bg1);border:1px solid #a78bfa44;border-radius:14px;padding:14px;margin:14px 0;font-size:13px;color:var(--t2)}
.strategy b{color:var(--p)}.strategy li{margin:6px 0 0 18px}
.row{background:var(--bg1);border:1px solid var(--b);border-radius:14px;padding:14px;margin-bottom:10px}
.nm{font-weight:700}.ar{color:var(--t3)}.meta{display:block;color:var(--t3);font-size:12px;margin-top:2px}
.soc{font-size:12.5px;color:var(--t2);margin:6px 0}.soc a{color:var(--a);text-decoration:none}
textarea{width:100%;min-height:90px;background:var(--bg);border:1px solid var(--b);border-radius:10px;color:var(--t2);padding:10px;font:12.5px/1.6 inherit;direction:rtl;resize:vertical}
button{margin-top:8px;background:var(--a);color:#1d1610;border:none;border-radius:999px;padding:7px 18px;font-weight:700;cursor:pointer}
button.mini{background:transparent;border:1px solid var(--b);color:var(--t2);font-weight:600;margin-inline-start:6px}
.done{background:#57b380!important}
</style></head><body><div class="wrap">
<h1>💜 PERSONAL-<b>50</b> — tonight's targets</h1>
<div class="strategy"><b>Made-to-Stick battle plan:</b>
<li><b>5 per night, 8–11 PM</b> — quality beats volume, accounts stay safe.</li>
<li>The message leads with the <b>Unexpected</b> (menu built before asking) and lands on the <b>Concrete</b> (their handle, SFDA dates, live link they can tap).</li>
<li>These 50 are young social-active owners — they check DMs at night and reply fast. <b>Answer within minutes, then switch to a 30s voice note</b> (script in OBJECTIONS.md).</li>
<li>Mark SENT in ClientOS after each send. Day-2 and Day-5 buttons loaded per cafe.</li>
<li>Every conversation ends with a DATE. Never price in DM.</li></div>
${rows}
</div><script>
function cp(id,btn){const t=document.getElementById(id);navigator.clipboard.writeText(t.value).then(()=>{btn.classList.add('done');btn.textContent='✓ Copied';});}
function tg(id){const t=document.getElementById(id);t.style.display=t.style.display==='none'?'block':'none';}
</script></body></html>`;
writeFileSync(join(DIR, 'campaign50.html'), html);
console.log('campaign50.html:', cafes.length, 'targets armed');

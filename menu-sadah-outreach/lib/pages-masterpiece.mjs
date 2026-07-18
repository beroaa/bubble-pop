// MENU SADAH — MASTERPIECE renderer (the Beyt/RUSTIC craft code, industrialized).
// One narrative engine × 8 page architectures × per-cafe personality briefs.
// Every page is a story-world: rooms instead of categories, diary notes,
// price stamps, motif particles, 4-accent rotation, ink/word/row animations.
// Evidence rule holds: briefs carry mood words only — dishes/prices come from
// the same vetted menu data as the luxe tier.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONTACT } from '../cafes.mjs';
import { ART, artFor } from './pages-luxe.mjs';
import { SCENES } from './scenes/index.mjs';

/* ---------- VISUALS-FIRST law: per-cafe photo mode ----------
   When dist/assets/photos/<slug>/ exists (photos land via MacBook PHOTO-MISSION),
   pages switch to the cafe's OWN shots; when the folder is absent the shared-art
   fallback renders exactly as before. meta.json format: [{file, shows, src}]. */
const PHOTOS_DIR = fileURLToPath(new URL('../dist/assets/photos', import.meta.url));
function cafePhotos(slug) {
  if (!slug) return [];
  const dir = PHOTOS_DIR + '/' + slug;
  try {
    if (!existsSync(dir)) return [];
    const metaFile = dir + '/meta.json';
    if (existsSync(metaFile)) {
      const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
      if (Array.isArray(meta)) return meta.filter((m) => m && m.file);
    }
    return readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort().map((file) => ({ file, shows: '', src: '' }));
  } catch { return []; }
}

/* shared gold trio handed to every scene pack */
const SCENE_GOLD = { gold: '#c79a3a', goldBright: '#e8c268', goldDeep: '#8a6a1f' };

const SAR = '﷼';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const seedOf = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };

/* ---------- color math (mirror of brand-theme formulas) ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function hslHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}
function hexHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h = Math.round(h * 60); if (h < 0) h += 360;
  }
  const l = (mx + mn) / 2;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  return [h, Math.round(s * 100), Math.round(l * 100)];
}

/* each archetype commits to a mood — palette re-derived in that mood from the
   cafe's own brand hue, so identity survives the architecture switch */
const MODE_BY_ARCH = {
  'storybook-light': 'light', 'garden-fresh': 'light', 'editorial-mag': 'light',
  'playful-hand': 'light', 'ticket-diner': 'light',
  'poster-dark': 'dark', 'neon-arcade': 'dark', 'majlis-heritage': 'dark',
};

function paletteFor(T, mode) {
  if (T.mode === mode) return T;
  const [h, s, l] = hexHsl(T.accentBright || T.accent);
  if (mode === 'light') return {
    ...T, mode,
    accent: hslHex(h, clamp(s + 10, 30, 90), 36), accentBright: hslHex(h, s, l),
    accent2: hslHex(h + 16, clamp(s + 4, 0, 90), 52), deep: hslHex(h, s, 24), ink: '#ffffff',
    bg0: hslHex(h, 32, 98), bg1: hslHex(h, 28, 96), bg2: hslHex(h, 22, 92),
    border1: hslHex(h, 22, 86), border2: hslHex(h, 26, 74),
    text1: hslHex(h, 38, 14), text2: hslHex(h, 20, 32), text3: hslHex(h, 12, 48),
    shadow: '0 6px 16px ' + hslHex(h, 40, 30) + '22, 0 16px 40px ' + hslHex(h, 40, 30) + '14',
  };
  return {
    ...T, mode,
    accent: hslHex(h, s, clamp(l < 50 ? l + 24 : l, 55, 72)), accentBright: hslHex(h, s, clamp(l < 50 ? l + 24 : l, 55, 72)),
    accent2: hslHex(h + 16, clamp(s + 8, 0, 90), clamp(l + 20, 55, 92)), deep: hslHex(h, clamp(s - 4, 0, 100), 33),
    ink: hslHex(h, clamp(s * 0.6, 0, 60), 9),
    bg0: hslHex(h, 18, 7), bg1: hslHex(h, 15, 11), bg2: hslHex(h, 12, 15),
    border1: hslHex(h, 20, 19), border2: hslHex(h, 24, 28),
    text1: hslHex(h, 18, 94), text2: hslHex(h, 13, 76), text3: hslHex(h, 9, 54),
    shadow: '0 6px 16px #00000080, 0 16px 40px #00000059',
  };
}

/* Beyt's secret: sections don't share one color — they walk through 4 accents */
function accentRotation(P) {
  const [h, s] = hexHsl(P.accentBright || P.accent);
  const L = P.mode === 'light' ? 38 : 64, S = clamp(s, 30, 78);
  return [
    P.mode === 'light' ? P.accent : P.accentBright,
    hslHex(h + 32, S, L),
    hslHex(h - 42, clamp(S - 8, 24, 70), L + (P.mode === 'light' ? 2 : -2)),
    hslHex(h + 152, clamp(S - 26, 18, 48), L),
  ];
}

/* ---------- motif particle languages (8) ---------- */
const MOTIFS = {
  steam: { chars: ['〜', '〜', '〜'], css: (a) => `.mote{color:${a};font-size:15px;animation:mrise 4.5s ease-in-out infinite}@keyframes mrise{0%{opacity:0;transform:translateY(10px) rotate(90deg)}45%{opacity:.55}100%{opacity:0;transform:translateY(-26px) rotate(90deg)}}` },
  stars: { chars: ['✦', '✧', '⋆', '☾'], css: (a) => `.mote{color:${a};animation:mtw 3.4s ease-in-out infinite}@keyframes mtw{0%,100%{opacity:.12;transform:scale(.7)}50%{opacity:.95;transform:scale(1.2)}}` },
  leaves: { chars: ['❧', '✿', '❀', '⚘'], css: (a) => `.mote{color:${a};animation:mdrift 6s ease-in-out infinite}@keyframes mdrift{0%,100%{opacity:.25;transform:rotate(-8deg)}50%{opacity:.8;transform:translateY(-9px) rotate(10deg)}}` },
  tiles: { chars: ['✤', '❖', '✣', '◈'], css: (a) => `.mote{color:${a};animation:mspin 7s ease-in-out infinite}@keyframes mspin{0%,100%{opacity:.2;transform:rotate(0)}50%{opacity:.75;transform:rotate(45deg)}}` },
  waves: { chars: ['≈', '∽', '≈'], css: (a) => `.mote{color:${a};font-size:16px;animation:msway 5s ease-in-out infinite}@keyframes msway{0%,100%{opacity:.25;transform:translateX(-6px)}50%{opacity:.7;transform:translateX(6px)}}` },
  sparks: { chars: ['✴', '✳', '·', '✦'], css: (a) => `.mote{color:${a};animation:mflick 1.6s steps(2) infinite}@keyframes mflick{0%,100%{opacity:.15}40%{opacity:.95}60%{opacity:.3}}` },
  clouds: { chars: ['☁', '☁', '☁'], css: (a) => `.mote{color:${a};filter:blur(.6px);animation:mfloat2 8s ease-in-out infinite}@keyframes mfloat2{0%,100%{opacity:.18;transform:translateX(-8px)}50%{opacity:.5;transform:translateX(10px)}}` },
  ink: { chars: ['✒', '·', '෴', '·'], css: (a) => `.mote{color:${a};animation:mink 4s ease-in-out infinite}@keyframes mink{0%{opacity:0}30%{opacity:.7}100%{opacity:.1}}` },
};
const motesHtml = (motif, sd) => {
  const M = MOTIFS[motif] || MOTIFS.stars;
  const pos = [[14, 10], [78, 16], [8, 46], [86, 52], [24, 74], [68, 80], [46, 8], [90, 30]];
  return pos.map(([x, y], i) => {
    const ch = M.chars[i % M.chars.length];
    return `<span class="mote" style="left:${x}%;top:${y}%;font-size:${9 + ((sd >> i) % 7)}px;animation-delay:${(i * 0.7) % 4}s">${ch}</span>`;
  }).join('');
};

/* ---------- section separators per architecture ---------- */
function sepHtml(arch, A) {
  switch (arch) {
    case 'ticket-diner': return `<div class="sep sep-ticket" aria-hidden="true"><span>✂</span></div>`;
    case 'majlis-heritage': return `<div class="sep sep-sadu" aria-hidden="true"></div>`;
    case 'neon-arcade': return `<div class="sep sep-neon" aria-hidden="true"></div>`;
    case 'garden-fresh': return `<div class="sep sep-leaf" aria-hidden="true">❧ ❀ ❧</div>`;
    case 'editorial-mag': return `<div class="sep sep-rule" aria-hidden="true"></div>`;
    case 'playful-hand': return `<div class="sep sep-squig" aria-hidden="true">〰〰〰</div>`;
    case 'poster-dark': return `<div class="sep sep-poster" aria-hidden="true"><span>◆</span></div>`;
    default: return `<div class="sep sep-story" aria-hidden="true">· · ✦ · ·</div>`;
  }
}

/* ---------- 8 architecture style packs ---------- */
const PACKS = {
  'storybook-light': (P, R) => `
  body{background-image:radial-gradient(${P.border1} 1px,transparent 1px);background-size:26px 26px}
  .items{border:1.5px dashed ${P.border2};border-radius:22px;background:${P.bg1}f2}
  .room-h2{font-size:24px}
  .sep-story{text-align:center;color:${R[1]};letter-spacing:.4em;margin:30px 0 -8px;font-size:12px}
  .diary{background:${P.bg1};border:1px solid ${P.border1}}
  .cat-art{border-radius:50% 44% 52% 46%/48% 52% 44% 54%}
  .sig{border-style:dashed}`,
  'poster-dark': (P, R) => `
  h1{font-size:42px;letter-spacing:.02em}
  h1 .en{text-transform:uppercase;letter-spacing:.1em}
  .room-h2{font-size:26px;letter-spacing:.03em}
  .room-h2 .en{text-transform:uppercase;letter-spacing:.12em;font-size:.82em}
  .items{border-radius:10px;border-width:1px}
  .sig-card,.cat-art{border-radius:10px}
  .sep-poster{display:flex;align-items:center;gap:12px;margin:32px 0 -8px;color:${R[1]}}
  .sep-poster::before,.sep-poster::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,${R[1]}66,transparent)}
  .heroline{font-size:21px}
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(900px 500px at 50% 110%,${R[0]}12,transparent 70%)}`,
  'ticket-diner': (P, R) => `
  .items{border-radius:6px;border:1.5px dashed ${P.border2};position:relative;background:${P.bg1}}
  .items::before,.items::after{content:"";position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:${P.bg0};border:1.5px dashed ${P.border2};transform:translateY(-50%)}
  .items::before{inset-inline-start:-10px}.items::after{inset-inline-end:-10px}
  .price{font-family:ui-monospace,Menlo,monospace;font-size:15px}
  .stamp{font-family:ui-monospace,Menlo,monospace}
  .sep-ticket{display:flex;align-items:center;gap:8px;margin:32px 0 -8px;color:${P.text3};font-size:13px}
  .sep-ticket::before,.sep-ticket::after{content:"";flex:1;border-top:2px dashed ${P.border2}}
  .room-h2{font-size:23px}
  .chip{border-radius:6px}
  .sig-card{border-radius:6px;border-style:dashed}`,
  'majlis-heritage': (P, R) => `
  .cat-art{border-radius:50% 50% 12px 12px/62% 62% 12px 12px}
  .medal{border-radius:50% 50% 46% 46%/58% 58% 42% 42%}
  .items{border-radius:18px 18px 26px 26px;background:linear-gradient(180deg,${P.bg1}f5,${P.bg1}e0)}
  .sep-sadu{height:10px;margin:34px 8px -6px;border-radius:3px;opacity:.75;
    background:repeating-linear-gradient(90deg,${R[0]} 0 10px,${P.bg2} 10px 14px,${R[1]} 14px 24px,${P.bg2} 24px 28px,${R[3]} 28px 38px,${P.bg2} 38px 42px)}
  .room-h2{font-size:24px}
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(420px 320px at 85% 20%,${R[1]}14,transparent 70%)}
  .hero .orb{animation:lantern 6s ease-in-out infinite}
  @keyframes lantern{50%{opacity:.75;transform:translateX(-50%) scale(1.06)}}`,
  'neon-arcade': (P, R) => `
  body{background-image:linear-gradient(${R[0]}08 1px,transparent 1px);background-size:100% 4px}
  .room-h2{text-shadow:0 0 12px ${R[0]}88,0 0 30px ${R[0]}44;animation:neonflick 5.5s infinite}
  @keyframes neonflick{0%,93%,97%,100%{opacity:1}94%,96%{opacity:.55}}
  .items{border:1px solid ${R[0]}55;box-shadow:0 0 18px ${R[0]}22,inset 0 0 24px ${R[0]}0d;border-radius:12px}
  .sig-card{border-color:${R[1]}66;box-shadow:0 0 16px ${R[1]}2a}
  .chip{border-color:${R[0]}55}
  .price{text-shadow:0 0 10px currentColor}
  .sep-neon{height:2px;margin:34px 20px -6px;border-radius:2px;background:linear-gradient(90deg,transparent,${R[0]},transparent);box-shadow:0 0 12px ${R[0]}88}
  .medal{box-shadow:0 0 0 7px ${R[0]}14,0 0 44px ${R[0]}66,inset 0 1px 0 #ffffff33}`,
  'garden-fresh': (P, R) => `
  .wrap{max-width:580px}
  .items{border-radius:26px;background:${P.bg1}ef}
  .sig-card{border-radius:22px}
  .cat-art{border-radius:24px}
  .room-h2{font-size:24px}
  .sep-leaf{text-align:center;color:${R[3]};margin:32px 0 -8px;letter-spacing:.5em;font-size:13px}
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(500px 300px at 12% 8%,${R[3]}12,transparent 70%)}
  .hero{padding-top:86px}`,
  'editorial-mag': (P, R) => `
  h1{letter-spacing:-.02em}
  h1 .en{font-style:italic}
  .room-eyebrow{font-family:ui-monospace,Menlo,monospace;font-size:10.5px}
  .room-h2 .en{font-style:italic}
  .items{border:none;border-block:1px solid ${P.text1};border-radius:0;background:transparent;box-shadow:none;padding:2px 6px}
  .item{border-bottom:1px solid ${P.border1}}
  .sig{border-radius:0;border-inline:none}
  .sig-card{border-radius:0;box-shadow:none}
  .cat-art{border-radius:0}
  .chip{border-radius:0;border:none;border-bottom:2px solid transparent}
  .chip:hover{border-bottom-color:var(--accent);box-shadow:none;transform:none}
  .sep-rule{display:flex;margin:36px 0 -6px}
  .sep-rule::before{content:"";width:52px;height:3px;background:${P.text1}}
  .dots{border-bottom-style:solid;border-bottom-width:.5px;opacity:.5}`,
  'playful-hand': (P, R) => `
  .items{border:2.5px solid ${P.border2};border-radius:22px 26px 20px 28px/26px 20px 28px 22px}
  .sig-card{border-width:2.5px;border-radius:20px 24px 18px 26px/24px 18px 26px 20px;}
  .cat-art{border-width:2.5px;border-radius:46% 54% 50% 50%/52% 48% 54% 46%}
  .room-h2 .ar,.room-h2 .en{background:linear-gradient(180deg,transparent 68%,${R[1]}44 68% 92%,transparent 92%)}
  .sep-squig{text-align:center;color:${R[1]};margin:30px 0 -8px;font-size:15px;letter-spacing:.2em}
  .chip{border-width:2px;border-radius:14px 18px 12px 16px}
  .medal{border-width:3px}
  .sig-art{animation:dwob 3.4s ease-in-out infinite}
  @keyframes dwob{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}`,
};

/* ---------- the masterpiece page ---------- */
export function masterpieceMenuPage(cafe, brief) {
  const arch = PACKS[brief.archetype] ? brief.archetype : 'storybook-light';
  const P = paletteFor(cafe.theme, MODE_BY_ARCH[arch] || cafe.theme.mode);
  const R = accentRotation(P);
  const SC = SCENES[arch] ? SCENES[arch](P, R, SCENE_GOLD) : null;
  const T = cafe.theme; // fonts + label live here
  const sd = seedOf(cafe.slug || cafe.name);
  const M = MOTIFS[brief.motif] || MOTIFS.stars;
  const a = P.accent, a2 = P.accent2;
  const shots = cafePhotos(cafe.slug); // per-cafe photo mode (VISUALS-FIRST law)
  const shotSrc = (i) => esc('../assets/photos/' + cafe.slug + '/' + shots[i % shots.length].file);

  const roomFor = (cat) => (brief.rooms || []).find((r) => r.catEn && r.catEn.toLowerCase() === String(cat.cat).toLowerCase());
  const sigCat = cafe.menu.find((c) => /signature|توقيع/i.test(c.cat + c.catAr));
  const cats = cafe.menu.filter((c) => c !== sigCat);
  const diary = (brief.diaryAr || []).slice(0, 2);

  const navChips = cafe.menu.map((c, i) => {
    const r = roomFor(c);
    return `<a class="chip" href="#cat-${i}"><span class="ar">${esc(r ? r.titleAr : c.catAr)}</span><span class="en">${esc(r ? r.titleEn : c.cat)}</span></a>`;
  }).join('');

  const sigHtml = sigCat ? `
  <section class="sig reveal" id="cat-${cafe.menu.indexOf(sigCat)}" style="--sa:${R[0]};--sa2:${R[1]}">
    <div class="sig-ribbon"><span class="ar">✦ توقيع البيت ✦</span><span class="en">✦ House Signatures ✦</span></div>
    <div class="sig-grid">
      ${sigCat.items.map(([en, ar, price]) => `
      <div class="sig-card">
        <div class="sig-art">${ART[artFor(en, ar)[0]](P)}</div>
        <div class="sig-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="stamp"><span>${price}</span><span class="sar">${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>` : '';

  const catHtml = cats.map((c, ci) => {
    const i = cafe.menu.indexOf(c);
    const r = roomFor(c);
    const [artKey, photoKey] = artFor(c.cat, c.catAr);
    const acc = R[ci % 4], acc2 = R[(ci + 1) % 4];
    const diaryNote = (ci === 1 && diary[0]) ? `
  <div class="diary reveal" dir="rtl"><span class="tape" style="background:${R[1]}33"></span>${esc(diary[0])}</div>` :
      (ci === 3 && diary[1]) ? `
  <div class="diary reveal" dir="rtl"><span class="tape" style="background:${R[3]}33"></span>${esc(diary[1])}</div>` : '';
    return `${ci > 0 ? (SC ? SC.sepHtml : sepHtml(arch, R)) : ''}
  <section class="cat reveal" id="cat-${i}" style="--sa:${acc};--sa2:${acc2}">
    <div class="cat-head">
      <div class="cat-art">
        <div class="cat-svg">${ART[artKey](P)}</div>
        <img src="${shots.length ? shotSrc(ci) : `../assets/photos/${photoKey}.jpg`}" alt="" onload="this.parentElement.classList.add('hasimg')">
      </div>
      <div class="cat-title">
        ${r ? `<div class="room-eyebrow"><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></div>` : ''}
        <h2 class="room-h2"><span class="ar">${esc(r ? r.titleAr : c.catAr)}</span><span class="en">${esc(r ? r.titleEn : c.cat)}</span></h2>
        <div class="inkline"></div>
      </div>
    </div>
    <div class="items">
      ${c.items.map(([en, ar, price]) => `
      <div class="item">
        <div class="item-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="dots"></div>
        <div class="price"><span class="pdot"></span>${price}<span class="sar"> ${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>${diaryNote}`;
  }).join('');

  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000' ? `https://wa.me/${CONTACT.whatsapp}` : null;
  const rgbOf = (x) => [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)];
  // Beyt's scroll magic: the sky changes as you walk through the house
  const nightHex = P.mode === 'light' ? hslHex(hexHsl(P.accent)[0], 30, 84) : hslHex(hexHsl(P.bg0)[0] + 18, 30, 3);

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${P.bg0}">
<title>${esc(cafe.name)} — Menu · MENU SADAH</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${T.fonts.q}&display=swap">
<style>
  :root{--bg-0:${P.bg0};--bg-1:${P.bg1};--bg-2:${P.bg2};--border-1:${P.border1};--border-2:${P.border2};
    --text-1:${P.text1};--text-2:${P.text2};--text-3:${P.text3};--accent:${a};--accent-2:${a2};--accent-soft:${a}22;
    --sa:${R[0]};--sa2:${R[1]};--radius:16px;--shadow:${P.shadow}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:${T.fonts.body},-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;
    background:var(--bg-0);color:var(--text-1);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100svh;overflow-x:hidden}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(620px 420px at 50% -120px,${a}17,transparent 70%)}
  .wrap{max-width:560px;margin:0 auto;padding:0 18px 110px;position:relative;z-index:1}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:30;background:${P.bg1}d9;backdrop-filter:blur(10px);
    border:1px solid var(--border-2);color:var(--text-1);border-radius:999px;padding:8px 16px;font-size:13.5px;cursor:pointer}

  /* ---- hero: the doorway into the world ---- */
  .hero{position:relative;text-align:center;padding:76px 0 26px;overflow:visible}
  .orb{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:340px;border-radius:50%;
    background:radial-gradient(circle,${a}30,transparent 65%);pointer-events:none}
  .mote{position:absolute;pointer-events:none;z-index:0}
  ${M.css(a2)}
  .greet{color:var(--accent);font-size:13px;letter-spacing:.14em;margin-bottom:10px;opacity:0;animation:up .7s .1s forwards}
  .medal{position:relative;width:104px;height:104px;margin:0 auto 16px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff2b,transparent 42%),radial-gradient(circle at 32% 28%,${a}42,${a}14 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 7px ${a}14,0 0 34px ${a}40,inset 0 1px 0 #ffffff33;
    animation:mfloat 5s ease-in-out infinite}
  .medal::after{content:"";position:absolute;inset:6px;border-radius:inherit;border:1px solid ${a}55}
  .medal span{font-size:44px;font-weight:700;color:var(--accent);text-shadow:0 2px 12px ${a}66}
  .medal span .ar{font-family:${T.fonts.ar}}
  .medal span .en{font-family:${T.fonts.en}}
  @keyframes mfloat{50%{transform:translateY(-6px)}}
  h1{font-size:36px;letter-spacing:-.01em;line-height:1.2}
  h1 .ar{font-family:${T.fonts.ar}}
  h1 .en{font-family:${T.fonts.en}}
  /* gradient-clip only AFTER word entrance — transformed child spans break background-clip:text in Chrome */
  h1.shimmer{background:linear-gradient(90deg,var(--text-1) 30%,${a} 48%,${a2} 52%,var(--text-1) 70%);background-size:240% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sh 5s .3s infinite}
  @keyframes sh{0%{background-position:130% 0}100%{background-position:-130% 0}}
  h1 .w{display:inline-block;opacity:0;animation:wordin .55s cubic-bezier(.2,1.2,.4,1) forwards}
  @keyframes wordin{0%{opacity:0;transform:translateY(14px) scale(.94)}100%{opacity:1;transform:none}}
  .world{margin-top:10px;color:var(--text-3);font-size:13px;letter-spacing:.08em;opacity:0;animation:up .7s .7s forwards}
  .world b{color:${R[1]};font-weight:600}
  .heroline{margin-top:8px;color:var(--text-2);font-size:19px;line-height:1.5;opacity:0;animation:up .8s 1s forwards}
  .heroline .ar{font-family:${T.fonts.ar}}
  .heroline .en{font-family:${T.fonts.en}}
  .meta{margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;opacity:0;animation:up .7s 1.25s forwards}
  .badge{background:var(--accent-soft);border:1px solid ${a}66;color:var(--accent);border-radius:999px;padding:4px 14px;font-size:12px;letter-spacing:.05em}
  @keyframes up{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}

  .chips{display:flex;gap:8px;overflow-x:auto;padding:14px 2px;position:sticky;top:0;z-index:20;
    background:linear-gradient(${P.bg0}f2 78%,transparent);backdrop-filter:blur(8px);scrollbar-width:none}
  .chips::-webkit-scrollbar{display:none}
  .chip{flex:0 0 auto;text-decoration:none;color:var(--text-2);background:${P.bg1}cc;border:1px solid var(--border-1);
    border-radius:999px;padding:9px 16px;font-size:13.5px;transition:all .2s,transform .18s}
  .chip:hover{color:var(--accent);border-color:var(--accent);box-shadow:0 0 14px ${a}33;transform:translateY(-2px)}

  /* ---- signatures with price STAMPS ---- */
  .sig{margin-top:26px;background:linear-gradient(180deg,${R[0]}14,transparent 90%);border:1px solid ${a}44;
    border-radius:22px;padding:20px 16px 18px;position:relative}
  .sig-ribbon{text-align:center;color:var(--sa);letter-spacing:.14em;font-size:13px;margin-bottom:16px;font-weight:700}
  .sig-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
  .sig-card{background:var(--bg-1);border:1px solid var(--border-2);border-radius:var(--radius);padding:14px 12px 16px;text-align:center;
    box-shadow:var(--shadow);animation:sfloat 4.6s ease-in-out infinite;position:relative}
  .sig-card:nth-child(2){animation-delay:1.1s}.sig-card:nth-child(3){animation-delay:2.2s}
  @keyframes sfloat{50%{transform:translateY(-5px)}}
  .sig-art{width:74px;height:74px;margin:0 auto 8px}
  .sig-art svg{width:100%;height:100%;filter:drop-shadow(0 6px 14px ${a}59)}
  .sig-name{font-size:14.5px;font-weight:600;line-height:1.35}
  .stamp{display:inline-flex;align-items:baseline;gap:3px;margin-top:8px;padding:3px 12px;border:1.7px solid var(--sa);
    border-radius:999px;color:var(--sa);font-weight:800;font-size:16px;transform:rotate(-4deg);
    box-shadow:0 0 0 3px ${a}0f}
  .reveal.in .stamp{animation:pstamp .5s cubic-bezier(.2,1.5,.4,1) both .35s}
  .sig-card::before,.sig-card::after{content:"";position:absolute;top:-8px;width:44px;height:16px;background:${R[1]}40;border-radius:2px;z-index:2}
  .sig-card::before{left:14px;transform:rotate(-8deg)}
  .sig-card::after{right:14px;transform:rotate(6deg)}
  @keyframes pstamp{0%{opacity:0;transform:rotate(-14deg) scale(1.6)}100%{opacity:1;transform:rotate(-4deg) scale(1)}}
  .sar{font-size:11px}

  /* ---- rooms ---- */
  .cat{margin-top:34px}
  .cat-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .cat-art{position:relative;width:76px;height:76px;flex:0 0 auto;border-radius:18px;overflow:hidden;
    border:1px solid var(--border-2);background:var(--bg-1);box-shadow:var(--shadow);transition:transform .25s}
  .cat-art:hover{transform:rotate(-3deg) scale(1.05)}
  .cat-art .cat-svg{position:absolute;inset:8px}
  .cat-art .cat-svg svg{filter:drop-shadow(0 5px 12px ${a}4d)}
  .cat-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}
  .cat-art.hasimg img{display:block}
  .cat-title{flex:1;min-width:0}
  .room-eyebrow{color:var(--text-3);font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:3px}
  .room-h2{color:var(--sa);font-size:22px;line-height:1.3}
  .room-h2 .ar{font-family:${T.fonts.ar}}
  .room-h2 .en{font-family:${T.fonts.en}}
  .inkline{height:2px;margin-top:7px;border-radius:2px;background:linear-gradient(90deg,var(--sa),var(--sa2),transparent);
    transform:scaleX(0);transform-origin:0 0;transition:transform .8s cubic-bezier(.2,.8,.2,1) .15s}
  [dir="rtl"] .inkline{transform-origin:100% 0}
  .reveal.in .inkline{transform:scaleX(1)}

  .items{background:${P.bg1}d9;border:1px solid var(--border-1);border-radius:20px;padding:6px 18px;box-shadow:var(--shadow)}
  .item{display:flex;align-items:baseline;gap:10px;padding:15px 0;border-bottom:1px solid ${P.bg2}99}
  .item:last-child{border-bottom:none}
  .item-name{font-size:16px}
  .dots{flex:1;border-bottom:1px dotted var(--border-2);transform:translateY(-4px)}
  .price{color:var(--sa);font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:6px}
  .pdot{width:6px;height:6px;border-radius:50%;background:var(--sa);opacity:0;transform:scale(0)}
  .reveal.in .pdot{animation:dotpop .45s cubic-bezier(.2,1.6,.4,1) forwards}
  @keyframes dotpop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.5)}100%{opacity:.9;transform:scale(1)}}
  .reveal{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}
  .reveal.in{opacity:1;transform:none}
  .reveal.in .item{opacity:0;animation:itemin .45s forwards}
  .reveal.in .item:nth-child(1){animation-delay:.05s}.reveal.in .item:nth-child(2){animation-delay:.12s}
  .reveal.in .item:nth-child(3){animation-delay:.19s}.reveal.in .item:nth-child(4){animation-delay:.26s}
  .reveal.in .item:nth-child(5){animation-delay:.33s}.reveal.in .item:nth-child(6){animation-delay:.4s}
  .reveal.in .item:nth-child(n+7){animation-delay:.47s}
  @keyframes itemin{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:none}}
  .reveal.in .pdot{animation-delay:.55s}

  /* ---- diary notes (the human hand) ---- */
  .diary{position:relative;margin:26px auto 0;max-width:420px;background:${P.bg1};border:1px solid var(--border-1);
    border-radius:4px;padding:16px 20px 14px;color:var(--text-2);font-size:15.5px;text-align:center;
    font-family:${T.fonts.ar};transform:rotate(-1.6deg);box-shadow:var(--shadow)}
  .diary:nth-of-type(odd){transform:rotate(1.4deg)}
  .diary .tape{position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(-2deg);width:88px;height:20px;
    border-radius:2px;backdrop-filter:blur(1px)}

  .demo-note{margin-top:34px;background:var(--accent-soft);border:1px dashed ${a}88;border-radius:14px;
    padding:13px 16px;font-size:13.5px;color:var(--text-2);text-align:center}
  .footer{margin-top:34px;text-align:center;color:var(--text-3);font-size:13px}
  .footer a{color:var(--accent);text-decoration:none}
  ${wa ? `.wa{position:fixed;bottom:18px;inset-inline-start:18px;z-index:30;background:#1faa53;color:#fff;border-radius:999px;
    padding:12px 20px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 8px 22px #1faa5366}` : ''}

  /* ---- big-screen stage (Beyt is designed wide — so are we) ---- */
  .bigmark{display:none;position:fixed;top:4vh;inset-inline-end:-3vw;z-index:0;font-size:48vh;line-height:1;
    color:var(--accent);opacity:.055;pointer-events:none;user-select:none}
  .bigmark .ar{font-family:${T.fonts.ar}}
  .bigmark .en{font-family:${T.fonts.en}}
  @media(min-width:900px){
    .bigmark{display:block}
    .wrap{max-width:780px}
    .hero{min-height:86vh;display:flex;flex-direction:column;justify-content:center;padding:60px 0 40px}
    .medal{width:136px;height:136px}
    .medal span{font-size:58px}
    h1{font-size:66px}
    .world{font-size:15px;margin-top:16px}
    .heroline{font-size:27px;margin-top:12px}
    .room-h2{font-size:34px}
    .inkline{height:3px}
    .cat-art{width:96px;height:96px}
    .items{padding:10px 30px}
    .item{padding:18px 0}
    .item-name{font-size:17.5px}
    .sig-art{width:96px;height:96px}
    .sig{padding:26px 22px 24px}
    .diary{max-width:480px;font-size:17px}
    .mote{font-size:22px!important}
    .chips{justify-content:center}
  }

  /* ---- architecture pack: ${arch} ---- */
  ${PACKS[arch](P, R)}

  /* ---- immersive scene pack: ${arch} ---- */
  ${SC ? SC.css : ''}
${shots.length ? `
  /* ---- brandshots: the cafe's OWN photos, pinned like polaroids ---- */
  .brandshots{display:flex;justify-content:center;align-items:flex-start;gap:14px;margin-top:22px;position:relative;z-index:1;
    opacity:0;animation:up .8s 1.15s forwards}
  .bshot{position:relative;width:96px;margin:0;background:${P.bg1};border:1px solid var(--border-2);padding:6px 6px 16px;
    box-shadow:4px 5px 0 ${P.deep}30}
  .bshot img{display:block;width:100%;height:84px;object-fit:cover}
  .bshot::before{content:"";position:absolute;top:-9px;left:50%;width:44px;height:16px;background:${R[1]}40;border-radius:2px;
    transform:translateX(-50%) rotate(-3deg);backdrop-filter:blur(1px);z-index:2}
  .bshot:nth-child(1){transform:rotate(-4deg)}
  .bshot:nth-child(2){transform:rotate(2.5deg) translateY(7px)}
  .bshot:nth-child(3){transform:rotate(-1.5deg) translateY(2px)}
  @media(min-width:900px){.bshot{width:132px}.bshot img{height:116px}}
  @media (prefers-reduced-motion: reduce){.brandshots{opacity:1!important;animation:none!important}}` : ''}

  @media (prefers-reduced-motion: reduce){
    *{animation:none!important;transition:none!important}
    .reveal,.reveal.in .item,.heroline,.world,.meta,.greet,h1 .w{opacity:1!important;transform:none!important}
    .pdot{opacity:.9!important;transform:scale(1)!important}
    .inkline{transform:scaleX(1)!important}
  }
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="bigmark" aria-hidden="true"><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></div>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    ${motesHtml(brief.motif, sd)}
    ${SC ? SC.heroHtml : ''}
    <div class="greet"><span class="ar">حيّاكم في عالمنا ✦</span><span class="en">Step into our world ✦</span></div>
    <div class="medal"><span><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></span></div>
    <h1><span class="ar">${esc(cafe.nameAr)}</span><span class="en">${esc(cafe.name)}</span></h1>
    <div class="world"><span class="ar">✦ <b>${esc(brief.world?.ar || '')}</b> ✦</span><span class="en">✦ <b>${esc(brief.world?.en || '')}</b> ✦</span></div>
    <div class="heroline"><span class="ar">${esc(brief.heroAr || cafe.taglineAr)}</span><span class="en">${esc(brief.heroEn || cafe.tagline)}</span></div>
    ${shots.length ? `<div class="brandshots" aria-hidden="true">${shots.slice(0, 3).map((s, i) => `<figure class="bshot"><img src="${shotSrc(i)}" alt="" loading="lazy" onerror="this.parentElement.remove()"></figure>`).join('')}</div>` : ''}
    <div class="meta">
      <span class="badge"><span class="ar">${esc(cafe.areaAr === 'الرياض' ? 'الرياض' : cafe.areaAr + ' · الرياض')}</span><span class="en">${esc(cafe.area === 'Riyadh' ? 'Riyadh' : cafe.area + ' · Riyadh')}</span></span>
      <span class="badge"><span class="ar">متوافق مع اشتراطات هيئة الغذاء والدواء</span><span class="en">SFDA-ready</span></span>
    </div>
  </header>
  <nav class="chips">${navChips}</nav>
  ${sigHtml}
  ${catHtml}
  <div class="demo-note">
    <span class="ar">هذه نسخة تجريبية أعدّها فريق منيو سادة خصيصاً لكم — الأصناف والأسعار والصور قابلة للتعديل خلال دقائق.</span>
    <span class="en">A demo lovingly prepared by MENU SADAH for you — items, prices & photos update in minutes.</span>
  </div>
  <div class="footer">
    ${cafe.social && /^@/.test(String(cafe.social)) ? `<div style="margin-bottom:6px;color:var(--text-2)"><span class="ar">تابعوا ${esc(cafe.nameAr)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span><span class="en">Follow ${esc(cafe.name)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span></div>` : ''}
    <span class="ar">تجربة من <a href="${CONTACT.site}">منيو سادة — MENU SADAH</a></span>
    <span class="en">Crafted by <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
${wa ? `<a class="wa" href="${wa}"><span class="ar">💬 اطلب منيو مثله</span><span class="en">💬 Get a menu like this</span></a>` : ''}
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // word-by-word hero entrance (word-level keeps Arabic letter joining intact)
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{
      const words=el.textContent.trim().split(/\\s+/);
      el.innerHTML=words.map((w,i)=>'<span class="w" style="animation-delay:'+(0.35+i*0.12)+'s">'+w+'</span>').join(' ');
    });
    setTimeout(()=>{
      document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{el.textContent=el.textContent;});
      document.querySelector('h1').classList.add('shimmer');
    },2400);
  }
  // day -> night: the page's sky shifts as you walk deeper into the house
  (function(){
    const A=${JSON.stringify(rgbOf(P.bg0))},B=${JSON.stringify(rgbOf(nightHex))};
    const lerp=()=>{const m=document.documentElement.scrollHeight-innerHeight;
      const f=m>60?Math.min(1,scrollY/m):0;
      document.body.style.backgroundColor='rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')+')';};
    addEventListener('scroll',lerp,{passive:true});lerp();
  })();
</script>
</body>
</html>`;
}

/* ---------- the masterpiece GIFT page (the theatrical envelope) ---------- */
const FLAVOR2 = {
  specialty_coffee: { ar: 'ذوقكم في القهوة المختصة واضح من أول نظرة', en: 'Your specialty-coffee taste shows from the first glance' },
  dessert_cafe: { ar: 'حلاكم صار حديث الناس — ويستاهل منيو بمستواه', en: 'Your desserts are the talk of the town — they deserve a menu at their level' },
  bakery_cafe: { ar: 'ريحة الفرن عندكم تحتاج منيو يليق فيها', en: 'Bakes like yours deserve a menu that does them justice' },
  matcha_bar: { ar: 'الماتشا عندكم فن — والمنيو لازم يكون بنفس الفن', en: 'Your matcha is an art — the menu should match it' },
  roastery: { ar: 'محاصيلكم تتغير كل أسبوع — منيو ورقي ما يلحق عليكم', en: 'Your origins rotate weekly — paper menus can never keep up' },
  family_cafe: { ar: 'مكانكم يجمع العائلة — والمنيو لازم يسهل عليهم الطلب', en: 'Your place brings families together — ordering should be effortless' },
  tea_house: { ar: 'شاهيكم له عشاق — وعشاقه يستاهلون منيو يليق', en: 'Your chai has devoted fans — they deserve a proper menu' },
  gaming_cafe: { ar: 'القيمرز عندكم ما يحبون يرفعون عيونهم عن الشاشة — منيو QR يحل المشكلة', en: 'Your gamers never look up from the screen — a QR menu fixes that' },
  grill_house: { ar: 'ناركم لها هيبة وبرجراتكم لها سمعة — والمنيو لازم يكون بنفس المستوى', en: 'Your fire commands respect and your burgers have a reputation — the menu should match' },
};

export function masterpieceWelcomePage(cafe, brief, extras = {}) {
  // Beyt-blueprint gift landing: paper + ink in the cafe's own hues.
  const P = paletteFor(cafe.theme, 'light');
  const [bh, bs] = hexHsl(P.accentBright || P.accent);
  const ink = hslHex(bh, clamp(bs, 40, 70), 15);
  const rose = P.accent, gold = hslHex(bh + 34, clamp(bs, 35, 75), 40), ochre = hslHex(bh - 38, clamp(bs - 10, 28, 62), 38), sage = hslHex(bh + 150, clamp(bs - 30, 16, 40), 62);
  const paper = hslHex(bh, 40, 98), paper2 = hslHex(bh, 34, 94), card = hslHex(bh, 45, 99);
  const T = cafe.theme, sd = seedOf(cafe.slug || cafe.name);
  const M = MOTIFS[brief.motif] || MOTIFS.stars;
  const SC = SCENES[brief.archetype] ? SCENES[brief.archetype](P, accentRotation(P), SCENE_GOLD) : null;
  const flavor = FLAVOR2[extras.type] || FLAVOR2.specialty_coffee;
  const sig = (extras.signature && extras.signature.length ? extras.signature[0] : null) || extras.sigMention || null;
  // per-cafe shots (VISUALS-FIRST law) always show; generic drink photos only fit coffee/tea-centric brands
  const shots = cafePhotos(cafe.slug);
  const usePhotos = shots.length > 0 || ['specialty_coffee', 'roastery', 'matcha_bar', 'tea_house'].includes(extras.type);
  const social = extras.social && /^@/.test(String(extras.social).trim()) ? String(extras.social).trim() : null;
  const rooms = (brief.rooms || []).slice(0, 3);
  const diary = (brief.diaryAr || [])[0];
  const waMsg = encodeURIComponent('مرحباً، معكم ' + cafe.name + ' — شفنا المنيو التجريبي وحابين نكمل');
  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000' ? `https://wa.me/${CONTACT.whatsapp}?text=${waMsg}` : null;
  const initAr = esc((cafe.nameAr || cafe.name).trim()[0]), initEn = esc(cafe.name.trim()[0].toUpperCase());
  const inkframe = `border:2px solid ${ink};border-radius:255px 18px 225px 18px/18px 225px 18px 255px;position:relative`;
  const B = (ar, en) => `<span class="ar">${ar}</span><span class="en">${en}</span>`;

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${paper}">
<title>🎁 ${esc(cafe.name)} × MENU SADAH</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${T.fonts.q}&family=Caveat:wght@600;700&family=Patrick+Hand&family=Aref+Ruqaa:wght@400;700&display=swap">
<style>
  :root{--ink:${ink};--rose:${rose};--gold:${gold};--ochre:${ochre};--sage:${sage};--paper:${paper};--paper2:${paper2};--card:${card}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:${T.fonts.body},"Work Sans",-apple-system,Tahoma,sans-serif;background:var(--paper);color:var(--ink);
    font-size:16.5px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(700px 500px at 80% -10%,${rose}0d,transparent 60%),
    repeating-linear-gradient(0deg,${ink}05 0 2px,transparent 2px 5px)}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .hand{font-family:Caveat,"Aref Ruqaa",cursive}
  .ar .hand,[data-lang="ar"] .hand{font-family:"Aref Ruqaa",Caveat,cursive}
  .wrap{max-width:640px;margin:0 auto;padding:0 20px 80px;position:relative;z-index:1}
  .top{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;
    background:${paper}ee;backdrop-filter:blur(8px);border-bottom:2px solid var(--ink);padding:10px 18px}
  .top .bx{display:flex;align-items:center;gap:10px}
  .top .medal-s{width:38px;height:38px;border-radius:50% 44% 52% 46%;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;
    background:var(--card);font-weight:800;color:var(--rose);font-size:19px;box-shadow:2px 2px 0 var(--ink)}
  .top .bn{font-weight:800;font-size:15px;letter-spacing:.02em;line-height:1.1}
  .top .loc{font-size:10.5px;letter-spacing:.14em;color:var(--ochre);text-transform:uppercase}
  .lang{border:2px solid var(--ink);background:var(--card);border-radius:999px;padding:7px 15px;font-size:13px;font-weight:700;
    cursor:pointer;box-shadow:2px 2px 0 var(--ink)}
  .kick{letter-spacing:.2em;font-size:11.5px;font-weight:700;color:var(--ochre);text-transform:uppercase}
  .hero{text-align:center;padding:52px 0 20px;position:relative}
  .mote{position:absolute;pointer-events:none;z-index:0}
  ${M.css(gold)}
  .medal{width:110px;height:110px;margin:20px auto 8px;border-radius:50% 46% 52% 48%/48% 52% 46% 54%;border:2.5px solid var(--ink);
    display:flex;align-items:center;justify-content:center;background:var(--card);box-shadow:4px 4px 0 var(--ink);
    opacity:0;animation:pop .8s .3s cubic-bezier(.2,1.4,.4,1) forwards}
  .medal span{font-size:50px;font-weight:800;color:var(--rose)}
  .medal span .ar{font-family:${T.fonts.ar}}.medal span .en{font-family:${T.fonts.en}}
  @keyframes pop{0%{opacity:0;transform:scale(.4) rotate(-8deg)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
  @keyframes up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
  h1{font-size:clamp(34px,9vw,54px);line-height:1.18;margin-top:8px;opacity:0;animation:up .8s .7s forwards}
  h1 b{color:var(--rose)}
  h1 .ar{font-family:${T.fonts.ar}}h1 .en{font-family:${T.fonts.en}}
  .world{margin-top:8px;color:var(--ochre);font-size:14px;letter-spacing:.06em;opacity:0;animation:up .8s .95s forwards}
  .heroline{font-size:24px;margin-top:6px;color:var(--rose);opacity:0;animation:up .8s 1.1s forwards}
  .heroline.hand{font-size:clamp(24px,6vw,32px);transform:rotate(-1.2deg)}
  .cta{display:inline-block;margin-top:20px;background:var(--rose);color:#fff;text-decoration:none;font-weight:800;font-size:18px;
    border:2px solid var(--ink);border-radius:16px 8px 16px 8px;padding:15px 34px;box-shadow:4px 4px 0 var(--ink);
    transition:transform .12s;opacity:0;animation:up .8s 1.3s forwards}
  .cta:active{transform:translate(2px,2px)}
  .cta.gold{background:var(--gold)}
  .rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
  .rv.in{opacity:1;transform:none}
  .sec{margin-top:44px}
  .h2{font-family:Patrick Hand,Caveat,cursive;font-size:clamp(30px,8vw,44px);text-align:center;transform:rotate(-1.5deg);line-height:1.15}
  [data-lang="ar"] .h2{font-family:"Aref Ruqaa",cursive}
  .h2 b{color:var(--rose)}
  .sub{text-align:center;color:var(--ink);opacity:.75;font-size:14.5px;margin-top:6px}
  .letter{${inkframe};background:var(--card);padding:28px 26px;margin-top:40px;box-shadow:5px 5px 0 ${ink}22}
  .letter::after{content:"";position:absolute;inset:5px;border:1.5px dashed ${ink}55;border-radius:inherit;pointer-events:none}
  .salut{font-size:26px;color:var(--rose);margin-bottom:8px;transform:rotate(-1deg)}
  .letter p{margin-bottom:12px;font-size:16px}
  .punch{color:var(--rose);font-weight:800}
  .sigline{font-size:24px;color:var(--ochre);margin-top:10px;transform:rotate(-1.5deg)}
  .freecard{position:relative;background:var(--ink);color:${paper};border-radius:26px 12px 26px 12px;padding:34px 24px 26px;margin-top:46px;
    text-align:center;box-shadow:6px 6px 0 ${ink}33}
  .giftbadge{position:absolute;top:-14px;inset-inline-end:22px;background:var(--rose);color:#fff;border:2px solid var(--ink);
    border-radius:999px;padding:6px 16px;font-size:13px;font-weight:800;transform:rotate(3deg);animation:bwob 4s ease-in-out infinite}
  @keyframes bwob{50%{transform:rotate(-2deg)}}
  .freecard .lbl{letter-spacing:.18em;font-size:11.5px;color:var(--sage);text-transform:uppercase}
  .was{display:inline-block;margin-top:12px;font-size:26px;color:var(--rose);text-decoration:line-through;text-decoration-thickness:5px;transform:rotate(-2deg);font-weight:800}
  .big{font-family:Patrick Hand,Caveat,cursive;font-size:clamp(72px,22vw,120px);line-height:1;color:var(--gold);transform:rotate(-1.5deg);text-shadow:0 3px 0 #00000055}
  [data-lang="ar"] .big{font-family:"Aref Ruqaa",cursive;font-size:clamp(56px,17vw,96px)}
  .fine{margin-top:12px;font-size:13px;color:${paper}bb}
  .pt{display:flex;gap:14px;align-items:flex-start;background:var(--card);border:2px solid var(--ink);
    border-radius:120px 16px 120px 16px/16px 120px 16px 120px;padding:16px 20px;margin-top:14px;box-shadow:3px 3px 0 var(--ink)}
  .pt .n{flex:0 0 auto;width:38px;height:38px;border-radius:50%;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;
    font-weight:800;color:#fff;transform:rotate(-5deg)}
  .pt:nth-child(1) .n{background:var(--rose)}.pt:nth-child(2) .n{background:var(--gold)}.pt:nth-child(3) .n{background:var(--ochre)}
  .pt b{display:block;font-size:16.5px}
  .pt span.d{font-size:14px;opacity:.8}
  .why{text-align:center;margin-top:30px;font-size:17px;font-weight:700}
  .hl{position:relative;white-space:nowrap}
  .hl::before{content:"";position:absolute;inset:-.1em -.3em;background:${sage}88;z-index:-1;
    border-radius:.35em .5em .4em .55em/.5em .4em .55em .35em;transform:rotate(-1.5deg)}
  .st{background:var(--card);border:2px solid var(--ink);border-radius:22px 10px 22px 10px;overflow:hidden;margin-top:16px;box-shadow:4px 4px 0 ${ink}22}
  .st .ph{position:relative;height:150px;background:linear-gradient(135deg,${rose}22,${gold}22);display:flex;align-items:center;justify-content:center}
  .st .ph img{width:100%;height:100%;object-fit:cover;filter:sepia(.12) saturate(1.05)}
  .st .ph .big-init{font-size:64px;font-weight:800;color:${ink}33}
  .st .tag{position:absolute;top:10px;inset-inline-start:12px;background:var(--card);border:2px solid var(--ink);border-radius:999px;
    padding:3px 12px;font-size:11px;font-weight:800;letter-spacing:.1em;transform:rotate(-3deg)}
  .st .bd{padding:16px 18px}
  .st .bd b{font-size:17px}
  .st .bd b i{color:var(--rose);font-style:italic}
  .st .bd p{font-size:14px;opacity:.8;margin-top:4px}
  .agrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
  .atile{background:var(--card);border:2px solid var(--ink);border-radius:14px 6px 14px 6px;padding:16px;box-shadow:3px 3px 0 var(--ink);text-decoration:none;color:var(--ink)}
  .atile .ic{width:34px;height:34px;border-radius:9px;background:var(--ink);color:${paper};display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:8px}
  .atile b{font-size:15px;display:block}
  .atile span.go{color:var(--ochre);font-size:13px;font-weight:700}
  .chips2{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:20px}
  .chip2{border:2px solid var(--ink);border-radius:999px;background:var(--card);padding:8px 16px;font-size:13.5px;font-weight:700;box-shadow:2px 2px 0 var(--ink)}
  .chip2::before{content:"✓ ";color:var(--rose);font-weight:800}
  .diary{position:relative;margin:34px auto 0;max-width:440px;background:var(--card);border:2px solid var(--ink);
    border-radius:4px;padding:18px 20px 14px;text-align:center;font-family:"Aref Ruqaa",cursive;font-size:17px;transform:rotate(-1.6deg);box-shadow:4px 4px 0 ${ink}22}
  .diary .tape{position:absolute;top:-10px;left:50%;transform:translateX(-50%) rotate(-2deg);width:92px;height:22px;background:${gold}44;border-radius:2px}
  .reply{text-align:center;margin-top:48px}
  .reply .hand{font-size:clamp(28px,7vw,38px);color:var(--rose);transform:rotate(-1deg)}
  .foot{margin-top:44px;text-align:center;font-size:12.5px;color:var(--ochre);letter-spacing:.08em}
  .foot a{color:var(--rose);text-decoration:none;font-weight:700}
  .bigmark{position:fixed;top:6vh;inset-inline-end:-4vw;z-index:0;font-size:44vh;line-height:1;color:var(--rose);opacity:.05;pointer-events:none}
  @media(min-width:900px){
    .wrap{max-width:720px}
    .hero{padding:76px 0 30px}
    .medal{width:132px;height:132px}.medal span{font-size:58px}
    .agrid{gap:16px}
    .mote{font-size:22px!important}
  }
  @media(max-width:520px){.agrid{grid-template-columns:1fr}}
  /* ---- immersive scene pack: ${brief.archetype || 'none'} ---- */
  ${SC ? SC.css : ''}
  @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}
    .medal,h1,.world,.heroline,.cta,.rv{opacity:1!important;transform:none!important}}
</style>
</head>
<body>
<div class="bigmark" aria-hidden="true"><span class="ar">${initAr}</span><span class="en">${initEn}</span></div>
<header class="top">
  <div class="bx"><div class="medal-s"><span class="ar">${initAr}</span><span class="en">${initEn}</span></div>
    <div><div class="bn">${B(esc(cafe.nameAr), esc(cafe.name))}</div><div class="loc">${B(esc(cafe.areaAr) + ' · الرياض', esc(cafe.area) + ' · Riyadh')}</div></div></div>
  <button class="lang" id="langToggle">English</button>
</header>
<div class="wrap">
  <section class="hero">
    ${SC ? SC.heroHtml : ''}
    ${motesHtml(brief.motif, sd)}
    <div class="kick">${B('🎁 هدية من منيو سادة · ليست إعلاناً', '🎁 A gift from Menu Sadah · not an ad')}</div>
    <div class="medal"><span><span class="ar">${initAr}</span><span class="en">${initEn}</span></span></div>
    <h1>${B('أهلاً ببيت <b>' + esc(cafe.nameAr) + '</b>', 'Welcome home, <b>' + esc(cafe.name) + '</b>.')}</h1>
    <div class="world">${B('✦ ' + esc(brief.world?.ar || '') + ' ✦', '✦ ' + esc(brief.world?.en || '') + ' ✦')}</div>
    <div class="heroline hand">${B(esc(brief.heroAr || ''), esc(brief.heroEn || ''))}</div>
    <div><a class="cta" href="../${cafe.slug}/">${B('افتحوا منيوكم ←', 'Open your menu →')}</a></div>
  </section>

  <div class="letter rv">
    <div class="salut hand">${B('مرحباً يا بيت ' + esc(cafe.nameAr) + '،', 'Hello, house of ' + esc(cafe.name) + ',')}</div>
    <p>${B('أنا إبراهيم من «منيو سادة». ' + (social ? 'تابعت <b>' + esc(social) + '</b> — و' : '') + esc(flavor.ar) + '. صراحةً، وقّفني. <span class="punch">فبنينا لكم هدية.</span>',
      "I'm Ibrahim from MENU SADAH. " + (social ? "I've been following <b>" + esc(social) + "</b> — and " : '') + esc(flavor.en) + '. Honestly, it stopped me. <span class="punch">So we built you a gift.</span>')}</p>
    <p>${B('منيو رقمي كامل بهويتكم، عربي وإنجليزي، مبني مثل عالمكم: <b>«' + esc(brief.world?.ar || '') + '»</b> — غرفة غرفة، وألوان الصفحة تتبدّل وأنتم تتجولون فيها.',
      'A complete digital menu in your identity, Arabic and English, shaped like your world: <b>"' + esc(brief.world?.en || '') + '"</b> — room by room, and the page shifts as you wander through it.')}</p>
    ${sig ? `<p>${B('وبلغنا أن «' + esc(sig[1]) + '» حديث الناس عندكم — جعلناه يفتتح المنيو.', 'And we hear your «' + esc(sig[0]) + '» is the one people talk about — it opens the menu.')}</p>` : ''}
    <div class="sigline hand">${B('إبراهيم — منيو سادة', 'Ibrahim — Menu Sadah')}</div>
  </div>

  <div class="freecard rv">
    <div class="giftbadge">${B('هدية من القلب', 'A gift from the heart')}</div>
    <div class="lbl">${B('المنيو + أول شهر دعم كامل', 'The menu + first month of support')}</div>
    <div><span class="was">${B('٤٩$ / شهر', '$49 / mo')}</span></div>
    <div class="big">${B('مجاناً', 'FREE')}</div>
    <div class="fine">${B('المنيو هدية تبقى لكم، وأول شهر دعم وتعديلات علينا — بعدها القرار قراركم.', 'The menu is yours to keep, and the first month of support and tweaks is on us — after that, the decision is yours.')}</div>
  </div>

  <div class="sec rv">
    <div class="pt"><div class="n">1</div><div><b>${B('هدية حقيقية', 'A true gift')}</b><span class="d">${B('المنيو لكم، مجاناً، للأبد.', 'The menu is yours to keep, free, forever.')}</span></div></div>
    <div class="pt"><div class="n">2</div><div><b>${B('شهر مجاني كامل', 'One free month')}</b><span class="d">${B('دعم وتعديلات بلا حدود، علينا.', 'Support and unlimited tweaks, on us.')}</span></div></div>
    <div class="pt"><div class="n">3</div><div><b>${B('بعدها أنتم تقررون', 'Then you decide')}</b><span class="d">${B('تكملون بـ٤٩$ شهرياً، أو تلغون وتحتفظون بالمنيو.', 'Continue at $49 a month, or cancel and keep the menu.')}</span></div></div>
    <div class="why">${B('بدون شروط، بدون عقد. نبني مجاناً للبيوت اللي نؤمن فيها — <span class="hl">وبيتكم واحد منها.</span>', 'No catch, no contract. We build free for houses we believe in — <span class="hl">and yours is one of them.</span>')}</div>
  </div>

  <div class="sec rv">
    <div class="h2">${B('درسنا بيتكم', 'We studied your house')}</div>
    <div class="sub">${B('كل تفصيلة في المنيو جاية منكم', 'Every detail in the menu comes from you')}</div>
    ${[
      sig ? { t: '01', bAr: 'توقيعكم يفتتح المنيو، <i>مثل ما يستاهل.</i>', bEn: 'Your signature opens the menu, <i>as it should.</i>', pAr: '«' + esc(sig[1]) + '» أول ما يشوفه الضيف — بختم سعر مرسوم باليد.', pEn: '«' + esc(sig[0]) + '» is the first thing a guest sees — with a hand-drawn price stamp.', img: 'espresso' } : { t: '01', bAr: 'منيو مبني غرفة غرفة، <i>مو قائمة وبس.</i>', bEn: 'A menu built room by room, <i>not just a list.</i>', pAr: 'كل قسم غرفة من عالمكم، بعنوان يحكي قصتكم.', pEn: 'Every section is a room of your world, titled with your story.', img: 'espresso' },
      { t: '02', bAr: 'عالمكم: <i>«' + esc(brief.world?.ar || '') + '»</i>', bEn: 'Your world: <i>"' + esc(brief.world?.en || '') + '"</i>', pAr: rooms.length ? 'غرف المنيو: ' + rooms.map((r) => '«' + esc(r.titleAr) + '»').join('، ') + ' — والبقية داخل.' : 'كل صفحة تتنفس هالعالم — ألوان وخطوط وحركة.', pEn: rooms.length ? 'The rooms: ' + rooms.map((r) => '"' + esc(r.titleEn) + '"').join(', ') + ' — the rest is inside.' : 'Every page breathes this world — color, type and motion.', img: 'latte' },
      { t: '03', bAr: 'الصفحة تعيش، <i>من الصبح لليل.</i>', bEn: 'The page is alive, <i>from morning to night.</i>', pAr: 'ألوانها بألوانكم، وتغمق مع الليل وأنتم تقلبون فيها — عربي وإنجليزي بضغطة.', pEn: 'It wears your colors and darkens into night as guests scroll — Arabic and English in one tap.', img: 'dessert' },
    ].map((d, di) => `
    <div class="st rv">
      <div class="ph"><span class="big-init">${initEn}</span>${usePhotos ? `<img src="${shots.length ? esc('../assets/photos/' + cafe.slug + '/' + shots[di % shots.length].file) : `../assets/photos/${d.img}.jpg`}" alt="" onerror="this.remove()" loading="lazy">` : ''}<span class="tag">${B('تفصيلة ' + d.t, 'Detail ' + d.t)}</span></div>
      <div class="bd"><b>${B(d.bAr, d.bEn)}</b><p>${B(d.pAr, d.pEn)}</p></div>
    </div>`).join('')}
    <div style="text-align:center;margin-top:22px"><a class="cta gold" href="../${cafe.slug}/">${B('شوفوا منيوكم حيّاً ←', 'See your menu live →')}</a></div>
  </div>

  <div class="sec rv">
    <div class="h2">${B('كل شيء <b>جاهز</b> لكم', 'Everything is <b>ready</b> for you')}</div>
    <div class="agrid">
      <a class="atile" href="../${cafe.slug}/"><div class="ic">📱</div><b>${B('المنيو الحي', 'Live menu')}</b><span class="go">${B('افتحوه ←', 'Open →')}</span></a>
      <div class="atile"><div class="ic">🖨</div><b>${B('كود QR للطاولات', 'Table QR code')}</b><span class="go">${B('نجهزه لكم يوم التفعيل', 'Printed & ready on activation')}</span></div>
    </div>
    <div class="chips2">
      <span class="chip2">${B('عربي + إنجليزي', 'Arabic + English')}</span>
      <span class="chip2">${B('ضغطة وحدة، بلا تطبيق', 'One tap, no app')}</span>
      <span class="chip2">${B('متوافق مع هيئة الغذاء والدواء', 'SFDA-ready')}</span>
      <span class="chip2">${B('تعديلات بلا حدود', 'Unlimited edits')}</span>
      <span class="chip2"><span class="ar">جاهز لعصر السعودية الرقمي</span><span class="en">Built for Saudi's digital era</span></span>
    </div>
  </div>

  ${diary ? `<div class="diary rv"><span class="tape"></span>${esc(diary)}</div>` : ''}

  <div class="reply rv">
    <div class="hand">${B('باب البيت مفتوح', 'The door of the house is open')}</div>
    <p style="margin-top:8px">${B('عجبكم؟ ردّوا على رسالتنا ونفعّله بنفس اليوم.', 'Love it? Reply to our message and it goes live the same day.')}</p>
    <div style="margin-top:14px"><a class="cta" href="${wa || '../' + cafe.slug + '/'}">${wa ? B('💬 نفعّله اليوم', '💬 Switch it on today') : B('🎁 افتحوا هديتكم', '🎁 Open your gift')}</a></div>
    <p style="margin-top:16px;font-size:13px">${B('شاهدوا عميلنا الحي: <a href="' + CONTACT.site + '/beyt-coffee" style="color:var(--rose);font-weight:700">بيت كوفي ↗</a>', 'See a live client: <a href="' + CONTACT.site + '/beyt-coffee" style="color:var(--rose);font-weight:700">Beyt Coffee ↗</a>')}</p>
  </div>
  <div class="foot">${B('منيو سادة · منيوهات جميلة لبيوت نحبها — <a href="' + CONTACT.site + '">menu-sadah.com</a>', 'MENU SADAH · beautiful menus for houses we admire — <a href="' + CONTACT.site + '">menu-sadah.com</a>')}</div>
</div>
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.06});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('.rv:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add('in');}),1400);
</script>
</body>
</html>`;
}

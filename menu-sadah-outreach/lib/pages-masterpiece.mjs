// MENU SADAH — MASTERPIECE renderer (the Beyt/RUSTIC craft code, industrialized).
// One narrative engine × 8 page architectures × per-cafe personality briefs.
// Every page is a story-world: rooms instead of categories, diary notes,
// price stamps, motif particles, 4-accent rotation, ink/word/row animations.
// Evidence rule holds: briefs carry mood words only — dishes/prices come from
// the same vetted menu data as the luxe tier.
import { CONTACT } from '../cafes.mjs';
import { ART, artFor } from './pages-luxe.mjs';

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
  const T = cafe.theme; // fonts + label live here
  const sd = seedOf(cafe.slug || cafe.name);
  const M = MOTIFS[brief.motif] || MOTIFS.stars;
  const a = P.accent, a2 = P.accent2;

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
    return `${ci > 0 ? sepHtml(arch, R) : ''}
  <section class="cat reveal" id="cat-${i}" style="--sa:${acc};--sa2:${acc2}">
    <div class="cat-head">
      <div class="cat-art">
        <div class="cat-svg">${ART[artKey](P)}</div>
        <img src="../assets/photos/${photoKey}.jpg" alt="" onload="this.parentElement.classList.add('hasimg')">
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

  /* ---- architecture pack: ${arch} ---- */
  ${PACKS[arch](P, R)}

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
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    ${motesHtml(brief.motif, sd)}
    <div class="greet"><span class="ar">حيّاكم في عالمنا ✦</span><span class="en">Step into our world ✦</span></div>
    <div class="medal"><span><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></span></div>
    <h1><span class="ar">${esc(cafe.nameAr)}</span><span class="en">${esc(cafe.name)}</span></h1>
    <div class="world"><span class="ar">✦ <b>${esc(brief.world?.ar || '')}</b> ✦</span><span class="en">✦ <b>${esc(brief.world?.en || '')}</b> ✦</span></div>
    <div class="heroline"><span class="ar">${esc(brief.heroAr || cafe.taglineAr)}</span><span class="en">${esc(brief.heroEn || cafe.tagline)}</span></div>
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
      const words=el.textContent.trim().split(/\s+/);
      el.innerHTML=words.map((w,i)=>'<span class="w" style="animation-delay:'+(0.35+i*0.12)+'s">'+w+'</span>').join(' ');
    });
    setTimeout(()=>{
      document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{el.textContent=el.textContent;});
      document.querySelector('h1').classList.add('shimmer');
    },2400);
  }
</script>
</body>
</html>`;
}

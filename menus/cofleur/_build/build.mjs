#!/usr/bin/env node
// Menu Sadah — Maison de Cofleur build
// Generates ../index.html from ../data/menu.json. Zero dependencies.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'menu.json'), 'utf8'));

/* ---------------- brand ---------------- */
const BRAND = {
  cream: '#fff8f2',
  card: '#fffdfa',
  caramel: '#a67b51',
  caramelDeep: '#8a6540',
  olive: '#b1a37e',
  oliveDeep: '#857748',
  ink: '#3f3227',
  inkSoft: '#6b5a49',
  faint: '#877663',
  hairline: 'rgba(166,123,81,.16)',
  walnut: '#4b382b',
};

const LINKS = {
  whatsapp: 'https://wa.me/966551842557',
  maps: 'https://maps.app.goo.gl/vA77JDhSJoZ8gN4g9',
  reserve: 'https://mytable.sa/widget/reservation/?rid=2367&lang=en',
  instagram: 'https://www.instagram.com/mdcofleur',
  tiktok: 'https://www.tiktok.com/@cofleur.sa',
};
const VAT_NO = '312441114900003';

/* ---------------- grouping ---------------- */
const GROUPS = [
  { id: 'breakfast', en: 'Breakfast', ar: 'الفطور', cats: [25, 24, 26, 27, 23, 30] },
  { id: 'allday', en: 'All Day', ar: 'طوال اليوم', cats: [31, 5, 6, 7, 8, 9, 10, 4, 3, 11] },
  { id: 'drinks', en: 'Drinks', ar: 'المشروبات', cats: [12, 20, 22, 13, 14, 15, 17, 16, 18, 19] },
];
const catById = Object.fromEntries(data.categories.map(c => [c.id, c]));

const SMALL_WORDS = new Set(['and', 'or', 'of', 'the', 'de', 'a', 'an', 'with']);
const titleCase = s => s.trim().split(/\s+/).map((w, i) =>
  i > 0 && SMALL_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)
).join(' ');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtPrice = p => Number.isInteger(p) ? String(p) : p.toFixed(1);
const fmtCal = c => (c == null || c === 0) ? null : String(Math.round(c));

/* ---------------- bloom SVG (parametric trace of their mark) ---------------- */
function petalPath(L, W, cy = 128, cx = 100) {
  const t = (fx, fy) => `${(cx + fx).toFixed(1)} ${(cy - fy).toFixed(1)}`;
  return [
    `M ${t(0, 0)}`,
    `C ${t(-W * 1.18, L * 0.16)}, ${t(-W * 1.10, L * 0.62)}, ${t(-W * 0.46, L * 0.93)}`,
    `C ${t(-W * 0.16, L * 1.01)}, ${t(W * 0.16, L * 1.01)}, ${t(W * 0.46, L * 0.93)}`,
    `C ${t(W * 1.10, L * 0.62)}, ${t(W * 1.18, L * 0.16)}, ${t(0, 0)} Z`,
  ].join(' ');
}
function beanCrease(L, cy = 128, cx = 100) {
  const t = (fx, fy) => `${(cx + fx).toFixed(1)} ${(cy - fy).toFixed(1)}`;
  return `M ${t(1.5, L * 0.965)} C ${t(-16, L * 0.72)}, ${t(16, L * 0.38)}, ${t(-2, L * 0.05)}`;
}
function sideCrease(L, side, cy = 128, cx = 100) {
  const s = side; // -1 left petal (crease bends toward center), +1 right
  const t = (fx, fy) => `${(cx + fx).toFixed(1)} ${(cy - fy).toFixed(1)}`;
  return `M ${t(s * 2, L * 0.06)} C ${t(s * 11, L * 0.38)}, ${t(s * 9, L * 0.68)}, ${t(s * -2, L * 0.93)}`;
}

const PETALS = [
  { a: -66, L: 68, W: 27, bx: -26, by: 7, crease: 'side', side: 1 },
  { a: 66, L: 68, W: 27, bx: 26, by: 7, crease: 'side', side: -1 },
  { a: -22, L: 98, W: 27, bx: -8, by: 0, crease: null },
  { a: 22, L: 98, W: 27, bx: 8, by: 0, crease: null },
  { a: -44, L: 84, W: 29, bx: -15, by: 3, crease: 'side', side: 1 },
  { a: 44, L: 84, W: 29, bx: 15, by: 3, crease: 'side', side: -1 },
  { a: 0, L: 110, W: 33, bx: 0, by: 0, crease: 'bean' },
];

function bloomSVG({ id = 'bloom', size = 168, animated = true }) {
  const petals = PETALS.map((p, i) => {
    const delay = (0.12 + i * 0.13).toFixed(2);
    const cx = 100 + (p.bx || 0), cy = 128 - (p.by || 0);
    const creasePath = p.crease === 'bean' ? beanCrease(p.L, cy, cx)
      : p.crease === 'side' ? sideCrease(p.L, p.side, cy, cx) : null;
    return `<g class="petal" style="--a:${p.a}deg;--d:${delay}s;--ox:${cx}px;--oy:${cy}px">`
      + `<path d="${petalPath(p.L, p.W, cy, cx)}" fill="${BRAND.caramel}" stroke="${BRAND.cream}" stroke-width="4.2" stroke-linejoin="round"/>`
      + (creasePath ? `<path class="crease" d="${creasePath}" fill="none" stroke="${BRAND.cream}" stroke-width="3" stroke-linecap="round"/>` : '')
      + `</g>`;
  }).join('\n      ');
  return `<svg id="${id}" class="bloom${animated ? ' animated' : ''}" width="${size}" height="${Math.round(size * 0.6)}" viewBox="0 14 200 114" role="img" aria-label="Maison de Cofleur bloom mark">
      <g class="bloom-all">
      ${petals}
      </g>
    </svg>`;
}

/* ---------------- menu markup ---------------- */
const normName = s => {
  const t = s.trim().replace(/\s+/g, ' ');
  return t === t.toUpperCase() && /[A-Z]/.test(t) ? titleCase(t.toLowerCase()) : t;
};

function itemRow(it, catId, idx) {
  const img = it.local
    ? `<img class="thumb" src="assets/${it.local}" alt="${esc(it.name_en)}" width="150" height="150" loading="lazy" decoding="async">`
    : '';
  const cal = fmtCal(it.calories);
  return `<li class="item${img ? '' : ' no-img'}">
        ${img}
        <div class="item-txt">
          <p class="i-en">${esc(normName(it.name_en))}</p>
          <p class="i-ar" lang="ar">${esc(it.name_ar)}</p>
          ${it.desc_en ? `<p class="i-den">${esc(it.desc_en)}</p>` : ''}
          ${it.desc_ar ? `<p class="i-dar" lang="ar">${esc(it.desc_ar)}</p>` : ''}
        </div>
        <div class="item-price">
          <p class="p-num">${fmtPrice(it.price)}</p>
          <p class="p-cur">SR</p>
          ${cal ? `<p class="p-cal">${cal} cal</p>` : ''}
        </div>
      </li>`;
}

function categorySection(cat) {
  const enName = titleCase(cat.name_en);
  const rows = cat.items.map((it, i) => itemRow(it, cat.id, i)).join('\n');
  return `<section class="cat rev" id="c-${cat.id}" aria-label="${esc(enName)}">
      <header class="cat-head">
        <h3 class="cat-en">${esc(enName)}</h3>
        <p class="cat-ar" lang="ar">${esc(cat.name_ar)}</p>
      </header>
      <ul class="items">
${rows}
      </ul>
    </section>`;
}

function groupBlock(g) {
  const cats = g.cats.map(id => catById[id]).filter(Boolean);
  return `<div class="group" id="g-${g.id}">
      <div class="group-banner rev">
        <span class="gb-rule" aria-hidden="true"></span>
        <div class="gb-txt">
          <p class="gb-en">${esc(g.en)}</p>
          <p class="gb-ar" lang="ar">${esc(g.ar)}</p>
        </div>
        <span class="gb-rule" aria-hidden="true"></span>
      </div>
${cats.map(categorySection).join('\n')}
    </div>`;
}

function chip(cat) {
  return `<a class="chip" href="#c-${cat.id}" data-cat="c-${cat.id}"><span class="ch-en">${esc(titleCase(cat.name_en))}</span><span class="ch-ar" lang="ar">${esc(cat.name_ar)}</span></a>`;
}
const chipsHTML = GROUPS.map(g =>
  `<span class="chip-g" aria-hidden="true">${esc(g.en)}</span>` + g.cats.map(id => chip(catById[id])).join('')
).join('');

/* ---------------- JSON-LD ---------------- */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Maison de Cofleur',
  alternateName: 'ميزون دو كوفلير',
  servesCuisine: ['French', 'Breakfast', 'Brunch', 'Café'],
  telephone: '+966551842557',
  address: { '@type': 'PostalAddress', streetAddress: 'Abi Bakr As Siddiq Rd, An Nada', addressLocality: 'Riyadh', postalCode: '13317', addressCountry: 'SA' },
  sameAs: [LINKS.instagram, LINKS.tiktok],
  hasMenu: {
    '@type': 'Menu',
    hasMenuSection: GROUPS.map(g => ({
      '@type': 'MenuSection', name: g.en,
      hasMenuSection: g.cats.map(id => ({ '@type': 'MenuSection', name: titleCase(catById[id].name_en) })),
    })),
  },
};

/* ---------------- fonts css ---------------- */
const fontsCSS = fs.readFileSync(path.join(ROOT, 'fonts', 'fonts.css'), 'utf8')
  .replace(/url\('fonts\//g, `url('fonts/`);

/* ---------------- page ---------------- */
const css = `
${fontsCSS}
:root{
  --cream:${BRAND.cream}; --card:${BRAND.card}; --caramel:${BRAND.caramel}; --caramel-deep:${BRAND.caramelDeep};
  --olive:${BRAND.olive}; --olive-deep:${BRAND.oliveDeep}; --ink:${BRAND.ink}; --ink-soft:${BRAND.inkSoft};
  --faint:${BRAND.faint}; --hairline:${BRAND.hairline}; --walnut:${BRAND.walnut};
  --en:'Poppins',-apple-system,'Segoe UI',sans-serif; --disp:'Jost','Poppins',sans-serif; --ar:'Almarai','Segoe UI',Tahoma,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--cream);color:var(--ink);font-family:var(--en);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-webkit-tap-highlight-color:transparent}
::selection{background:var(--caramel);color:var(--cream)}
a{color:inherit;text-decoration:none}
img{max-width:100%}
[lang=ar]{font-family:var(--ar);direction:rtl}

/* ---------- top bar ---------- */
.bar{position:fixed;inset:0 0 auto 0;z-index:40;display:flex;align-items:center;gap:10px;padding:10px 14px;
  background:rgba(255,248,242,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--hairline);transform:translateY(-110%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.bar.on{transform:translateY(0)}
.bar .b-mark{flex:0 0 auto;display:grid;place-items:center}
.bar .b-name{font-family:var(--disp);font-weight:400;font-size:12.5px;letter-spacing:.24em;color:var(--ink);white-space:nowrap}
.bar .b-name b{color:var(--caramel-deep);font-weight:400}
.bar .b-sp{flex:1}
.bar .b-act{width:34px;height:34px;border-radius:50%;border:1px solid var(--hairline);display:grid;place-items:center;color:var(--caramel-deep);background:var(--card)}

/* ---------- hero ---------- */
.hero{padding:54px 20px 10px;text-align:center;overflow:hidden}
.hero .wordmark{width:min(80vw,400px);height:auto;display:block;margin:14px auto 0}
.hero .loc{margin-top:15px;font-family:var(--disp);font-size:11px;letter-spacing:.34em;color:var(--olive-deep);text-transform:uppercase;text-indent:.34em}
.hero .loc-ar{font-family:var(--ar);font-size:11.5px;font-weight:400;color:var(--faint);margin-top:4px}
.acts{display:flex;justify-content:center;gap:8px;margin:20px auto 4px}
.act{flex:0 1 auto;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid var(--hairline);background:var(--card);
  border-radius:16px;padding:9px 14px 8px;min-width:96px;box-shadow:0 1px 2px rgba(75,56,43,.05)}
.act .a-en{display:inline-flex;align-items:center;gap:5px;font-family:var(--disp);font-size:10.5px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)}
.act svg{color:var(--caramel);width:13px;height:13px}
.act .a-ar{font-family:var(--ar);font-size:11.5px;font-weight:700;color:var(--faint)}

/* bloom */
.bloom{display:block;margin:0 auto}
.bloom .petal{transform-origin:var(--ox) var(--oy)}
.bloom:not(.animated) .petal{transform:rotate(var(--a))}
.bloom.animated .petal{opacity:0;transform:rotate(0deg) scale(.52);animation:bloom 1.15s cubic-bezier(.18,.8,.3,1.08) forwards;animation-delay:var(--d)}
.bloom.animated .crease{opacity:0;animation:fadein .8s ease forwards;animation-delay:calc(var(--d) + .75s)}
.bloom.animated .bloom-all{transform-origin:100px 128px;animation:breathe 7s ease-in-out 2.4s infinite alternate}
@keyframes bloom{0%{opacity:0;transform:rotate(0deg) scale(.52)}30%{opacity:1}100%{opacity:1;transform:rotate(var(--a)) scale(1)}}
@keyframes fadein{to{opacity:1}}
@keyframes breathe{from{transform:scale(1) rotate(0deg)}to{transform:scale(1.018) rotate(.35deg)}}
/* aroma line under logo */
.aroma{display:block;margin:6px auto 0}
.aroma path{stroke:var(--olive);opacity:.6;fill:none;stroke-width:1.1;stroke-linecap:round;
  stroke-dasharray:340;stroke-dashoffset:340;animation:draw 1.8s cubic-bezier(.3,.6,.3,1) 1.2s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){
  .bloom.animated .petal{animation:none;opacity:1;transform:rotate(var(--a))}
  .bloom.animated .crease{animation:none;opacity:1}
  .bloom.animated .bloom-all{animation:none}
  .aroma path{animation:none;stroke-dashoffset:0}
  html{scroll-behavior:auto}
}

/* ---------- chips nav ---------- */
.nav-wrap{position:sticky;top:0;z-index:30;background:linear-gradient(rgba(255,248,242,.94),rgba(255,248,242,.86));
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--hairline)}
.chips{display:flex;gap:7px;overflow-x:auto;padding:10px 16px;scrollbar-width:none;scroll-behavior:smooth}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:1px;border:1px solid var(--hairline);
  background:var(--card);border-radius:14px;padding:7px 13px 6px;transition:background .25s,border-color .25s}
.chip .ch-en{font-family:var(--disp);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);white-space:nowrap}
.chip .ch-ar{font-size:11.5px;font-weight:700;color:var(--faint);white-space:nowrap}
.chip.on{background:var(--caramel);border-color:var(--caramel)}
.chip.on .ch-en,.chip.on .ch-ar{color:var(--cream)}
.chip-g{flex:0 0 auto;align-self:center;font-family:var(--disp);font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--olive);padding:0 4px 0 10px;border-inline-start:1px solid var(--hairline)}
.chip-g:first-child{border-inline-start:0;padding-inline-start:2px}

/* ---------- groups & categories ---------- */
main{max-width:640px;margin:0 auto;padding:6px 16px 30px}
.group{padding-top:8px}
.group-banner{display:flex;align-items:center;gap:14px;margin:26px 2px 4px}
.gb-rule{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--olive) 45%,var(--olive) 55%,transparent);opacity:.5}
.gb-txt{text-align:center}
.gb-en{font-family:var(--disp);font-weight:300;font-size:21px;letter-spacing:.42em;text-transform:uppercase;color:var(--ink);text-indent:.42em}
.gb-ar{font-size:13px;font-weight:700;color:var(--caramel-deep);margin-top:1px}
.cat{background:var(--card);border:1px solid var(--hairline);border-radius:20px;margin-top:18px;padding:18px 16px 6px;
  box-shadow:0 1px 2px rgba(75,56,43,.04),0 10px 30px -22px rgba(75,56,43,.3);scroll-margin-top:76px}
.cat-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:0 2px 12px;border-bottom:1px solid var(--hairline)}
.cat-en{font-family:var(--disp);font-weight:400;font-size:19px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}
.cat-ar{font-size:14px;font-weight:700;color:var(--caramel-deep)}
.items{list-style:none}
.item{display:flex;gap:13px;padding:15px 2px;border-bottom:1px solid var(--hairline)}
.item:last-child{border-bottom:0}
.item.no-img{padding:13px 2px}
.thumb{flex:0 0 auto;width:64px;height:64px;border-radius:14px;object-fit:cover;background:#f3e7d9;box-shadow:inset 0 0 0 1px rgba(166,123,81,.12)}
.thumb-empty{display:grid;place-items:center}
.item-txt{flex:1;min-width:0}
.i-en{font-weight:500;font-size:15.5px;line-height:1.3;color:var(--ink)}
.i-ar{font-size:13.5px;font-weight:700;line-height:1.55;color:var(--ink-soft);direction:rtl;text-align:left}
.i-den{font-weight:300;font-size:12px;line-height:1.45;color:var(--faint);margin-top:4px}
.i-dar{font-weight:400;font-size:11.5px;line-height:1.6;color:var(--faint);direction:rtl;text-align:left}
.item-price{flex:0 0 auto;text-align:right;padding-top:1px}
.p-num{font-family:var(--disp);font-weight:400;font-size:19px;color:var(--caramel-deep);line-height:1}
.p-cur{font-size:8.5px;font-weight:600;letter-spacing:.2em;margin-right:-.2em;color:var(--olive-deep);margin-top:3px}
.p-cal{font-size:9.5px;font-weight:300;color:var(--faint);margin-top:8px;white-space:nowrap}

/* reveal */
.rev{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.rev.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none;transition:none}}

/* ---------- footer ---------- */
footer{border-top:1px solid var(--hairline);margin-top:26px;padding:30px 20px 34px;text-align:center;background:linear-gradient(#fff8f2,#fbf0e4)}
footer .f-word{font-family:var(--disp);font-size:13px;letter-spacing:.3em;color:var(--ink);text-transform:uppercase;margin-top:12px}
footer .f-word b{color:var(--caramel-deep);font-weight:400;text-transform:none}
footer .f-ar{font-size:12.5px;font-weight:700;color:var(--caramel-deep);margin-top:3px}
footer .f-addr{font-weight:300;font-size:11.5px;color:var(--faint);margin-top:14px;line-height:1.7}
footer .f-soc{display:flex;justify-content:center;gap:10px;margin-top:16px}
footer .f-soc a{width:38px;height:38px;border-radius:50%;border:1px solid var(--hairline);background:var(--card);display:grid;place-items:center;color:var(--caramel-deep)}
footer .f-vat{font-weight:300;font-size:10px;color:var(--faint);margin-top:20px;line-height:1.8}
footer .f-by{font-family:var(--disp);font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--olive);margin-top:14px}
footer .f-by a{border-bottom:1px solid rgba(177,163,126,.4);padding-bottom:1px}

@media (min-width:520px){
  .hero{padding-top:66px}
  .i-en{font-size:16.5px}.i-ar{font-size:14px}
  .thumb{width:76px;height:76px}
}
`;

const js = `
(function(){
  var bar=document.getElementById('bar');
  var hero=document.querySelector('.hero');
  new IntersectionObserver(function(e){bar.classList.toggle('on',!e[0].isIntersecting)},{rootMargin:'-70px 0px 0px 0px'}).observe(hero);

  var chips=[].slice.call(document.querySelectorAll('.chip'));
  var byId={};chips.forEach(function(c){byId[c.dataset.cat]=c});
  var current=null;
  var spy=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){setActive('c-'+en.target.id.slice(2))}});
  },{rootMargin:'-72px 0px -62% 0px',threshold:0});
  [].slice.call(document.querySelectorAll('.cat')).forEach(function(s){spy.observe(s)});
  function setActive(id){
    if(current===id)return;current=id;
    chips.forEach(function(c){c.classList.toggle('on',c.dataset.cat===id)});
    var c=byId[id];if(c){c.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})}
  }
  var rev=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');rev.unobserve(en.target)}});
  },{rootMargin:'0px 0px -6% 0px'});
  [].slice.call(document.querySelectorAll('.rev')).forEach(function(el){rev.observe(el)});
})();
`;

const waIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9.9 8.3L6 21l1.3-4.9A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 9.5c.4 2.5 3 5.1 5.5 5.5l1-1.5 2 1"/></svg>`;
const pinIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`;
const calIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 11h16"/></svg>`;
const igIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`;
const ttIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.3 1.9 3.9 4.4 4.1v3c-1.7 0-3.2-.5-4.4-1.4v6.4a6.1 6.1 0 1 1-6.1-6.1c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2.1 2.9V3h3Z"/></svg>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Maison de Cofleur — Menu · ميزون دو كوفلير — المنيو</title>
<meta name="description" content="Maison de Cofleur, An Nada, Riyadh — breakfast, brunch &amp; all-day menu. ميزون دو كوفلير — منيو الفطور وكل اليوم، حي الندى، الرياض.">
<meta name="theme-color" content="${BRAND.cream}">
<meta property="og:title" content="Maison de Cofleur — Menu · المنيو">
<meta property="og:description" content="Breakfast · Brunch · Coffee — An Nada, Riyadh · حي الندى، الرياض">
<meta property="og:image" content="assets/logo-og.jpg">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="apple-touch-icon" href="assets/icon-192.png">
${['poppins-500-latin', 'jost-400-latin', 'almarai-700-arabic', 'poppins-300-latin'].map(f => `<link rel="preload" href="fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join('\n')}
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>

<div class="bar" id="bar" aria-hidden="true">
  <span class="b-mark">${bloomSVG({ id: 'bloom-mini', size: 30, animated: false })}</span>
  <span class="b-name">MAISON <b>de</b> COFLEUR</span>
  <span class="b-sp"></span>
  <a class="b-act" href="${LINKS.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
  <a class="b-act" href="${LINKS.maps}" target="_blank" rel="noopener" aria-label="Directions">${pinIcon}</a>
</div>

<header class="hero">
  ${bloomSVG({ id: 'bloom-hero', size: 148, animated: true })}
  <img class="wordmark" src="assets/wordmark.png" alt="Maison de Cofleur" width="928" height="136" fetchpriority="high">
  <svg class="aroma" width="230" height="22" viewBox="0 0 230 22" aria-hidden="true">
    <path d="M28 13 C 70 5, 96 19, 115 11 C 134 3, 160 17, 202 9"/>
  </svg>
  <p class="loc">AN NADA · RIYADH</p>
  <p class="loc-ar" lang="ar">حي الندى، الرياض</p>
  <nav class="acts" aria-label="Contact">
    <a class="act" href="${LINKS.reserve}" target="_blank" rel="noopener"><span class="a-en">${calIcon} Reserve</span><span class="a-ar" lang="ar">احجز طاولة</span></a>
    <a class="act" href="${LINKS.whatsapp}" target="_blank" rel="noopener"><span class="a-en">${waIcon} WhatsApp</span><span class="a-ar" lang="ar">واتساب</span></a>
    <a class="act" href="${LINKS.maps}" target="_blank" rel="noopener"><span class="a-en">${pinIcon} Directions</span><span class="a-ar" lang="ar">الاتجاهات</span></a>
  </nav>
</header>

<div class="nav-wrap" id="nav">
  <nav class="chips" aria-label="Menu sections">
    ${chipsHTML}
  </nav>
</div>

<main>
${GROUPS.map(groupBlock).join('\n')}
</main>

<footer>
  ${bloomSVG({ id: 'bloom-foot', size: 56, animated: false })}
  <p class="f-word">MAISON <b>de</b> COFLEUR</p>
  <p class="f-ar" lang="ar">ميزون دو كوفلير</p>
  <p class="f-addr">Abi Bakr As Siddiq Rd, An Nada, Riyadh 13317<br><span lang="ar">طريق أبي بكر الصديق، حي الندى، الرياض</span></p>
  <div class="f-soc">
    <a href="${LINKS.instagram}" target="_blank" rel="noopener" aria-label="Instagram @mdcofleur">${igIcon}</a>
    <a href="${LINKS.tiktok}" target="_blank" rel="noopener" aria-label="TikTok @cofleur.sa">${ttIcon}</a>
    <a href="${LINKS.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>
    <a href="${LINKS.maps}" target="_blank" rel="noopener" aria-label="Directions">${pinIcon}</a>
  </div>
  <p class="f-vat"><span lang="ar">الأسعار شاملة ضريبة القيمة المضافة</span><br>Prices include VAT · VAT No. ${VAT_NO}</p>
  <p class="f-by"><a href="https://menu-sadah.com" target="_blank" rel="noopener">Menu Sadah</a></p>
</footer>

<script>${js}</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), html);
const items = data.categories.reduce((n, c) => n + c.items.length, 0);
console.log(`✓ index.html written — ${data.categories.length} categories, ${items} items, ${(html.length / 1024).toFixed(0)}KB html`);

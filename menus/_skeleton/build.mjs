#!/usr/bin/env node
// Menu Sadah — generic build skeleton.
// Usage: node build.mjs <menuDir>   (menuDir contains data/brand.json + data/menu.json, fonts/, assets/)
// Emits <menuDir>/index.html. Zero dependencies.
import fs from 'fs';
import path from 'path';

const DIR = path.resolve(process.argv[2] || '.');
const brand = JSON.parse(fs.readFileSync(path.join(DIR, 'data', 'brand.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(DIR, 'data', 'menu.json'), 'utf8'));

const B = Object.assign({
  cream: '#fff8f2', card: '#fffdfa', accent: '#a67b51', accentDeep: '#8a6540',
  muted: '#b1a37e', mutedDeep: '#857748', ink: '#3f3227', inkSoft: '#6b5a49',
  faint: '#877663', hairline: 'rgba(166,123,81,.16)',
}, brand.palette || {});

const CUR = Object.assign({ label: 'BD', decimals: 3 }, brand.currency || {});
const L = brand.links || {};
const GROUPS = brand.groups; // [{id,en,ar,cats:[ids]}]
const catById = Object.fromEntries(data.categories.map(c => [c.id, c]));

const SMALL = new Set(['and', 'or', 'of', 'the', 'de', 'a', 'an', 'with', 'in']);
const titleCase = s => s.trim().split(/\s+/).map((w, i) =>
  i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : (w[0] || '').toUpperCase() + w.slice(1)).join(' ');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const normName = s => { const t = String(s || '').trim().replace(/\s+/g, ' '); return t === t.toUpperCase() && /[A-Z]/.test(t) ? titleCase(t.toLowerCase()) : t; };
const fmtPrice = p => CUR.decimals ? Number(p).toFixed(CUR.decimals) : String(Math.round(Number(p)));
const fmtCal = c => (c == null || Number(c) === 0) ? null : String(Math.round(Number(c)));

/* hero/mark SVGs come from brand.json verbatim.
   Conventions the author must follow (documented in BUILD-AGENT-GUIDE.md):
   - heroSVG: root <svg class="hero-anim"> with child groups class="el" carrying
     style="--d:0.2s" (stagger delay) and optional --a (final rotate).
   - markSVG: small static version used in top bar + footer. */
const heroSVG = brand.heroSVG || '';
const markSVG = brand.markSVG || '';

function itemRow(it) {
  const img = it.local ? `<img class="thumb" src="assets/${it.local}" alt="${esc(it.name_en)}" width="150" height="150" loading="lazy" decoding="async">` : '';
  const cal = fmtCal(it.calories);
  return `<li class="item${img ? '' : ' no-img'}">
    ${img}
    <div class="item-txt">
      <p class="i-en">${esc(normName(it.name_en))}</p>
      ${it.name_ar ? `<p class="i-ar" lang="ar">${esc(it.name_ar)}</p>` : ''}
      ${it.desc_en ? `<p class="i-den">${esc(it.desc_en)}</p>` : ''}
      ${it.desc_ar ? `<p class="i-dar" lang="ar">${esc(it.desc_ar)}</p>` : ''}
    </div>
    <div class="item-price"><p class="p-num">${fmtPrice(it.price)}</p><p class="p-cur">${esc(CUR.label)}</p>${cal ? `<p class="p-cal">${cal} cal</p>` : ''}</div>
  </li>`;
}

const categorySection = c => `<section class="cat rev" id="c-${c.id}" aria-label="${esc(titleCase(c.name_en))}">
  <header class="cat-head"><h3 class="cat-en">${esc(titleCase(c.name_en))}</h3>${c.name_ar ? `<p class="cat-ar" lang="ar">${esc(c.name_ar)}</p>` : ''}</header>
  <ul class="items">
${c.items.map(itemRow).join('\n')}
  </ul></section>`;

const groupBlock = g => `<div class="group" id="g-${g.id}">
  <div class="group-banner rev"><span class="gb-rule"></span><div class="gb-txt"><p class="gb-en">${esc(g.en)}</p><p class="gb-ar" lang="ar">${esc(g.ar)}</p></div><span class="gb-rule"></span></div>
${g.cats.map(id => catById[id]).filter(Boolean).map(categorySection).join('\n')}</div>`;

const chipsHTML = GROUPS.map(g => `<span class="chip-g">${esc(g.en)}</span>` +
  g.cats.map(id => catById[id]).filter(Boolean).map(c =>
    `<a class="chip" href="#c-${c.id}" data-cat="c-${c.id}"><span class="ch-en">${esc(titleCase(c.name_en))}</span>${c.name_ar ? `<span class="ch-ar" lang="ar">${esc(c.name_ar)}</span>` : ''}</a>`).join('')).join('');

const fontsCSS = fs.existsSync(path.join(DIR, 'fonts', 'fonts.css')) ? fs.readFileSync(path.join(DIR, 'fonts', 'fonts.css'), 'utf8') : '';

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'Restaurant',
  name: brand.name_en, alternateName: brand.name_ar,
  servesCuisine: brand.cuisine || ['Café'], telephone: brand.phone || undefined,
  address: brand.address ? { '@type': 'PostalAddress', streetAddress: brand.address, addressLocality: brand.city || '', addressCountry: brand.country || '' } : undefined,
  sameAs: [L.instagram, L.tiktok].filter(Boolean),
  hasMenu: { '@type': 'Menu', hasMenuSection: GROUPS.map(g => ({ '@type': 'MenuSection', name: g.en })) },
};

const css = `
${fontsCSS}
:root{--cream:${B.cream};--card:${B.card};--accent:${B.accent};--accent-deep:${B.accentDeep};--muted:${B.muted};--muted-deep:${B.mutedDeep};--ink:${B.ink};--ink-soft:${B.inkSoft};--faint:${B.faint};--hairline:${B.hairline};
--en:'${brand.fontEN || 'Poppins'}',-apple-system,'Segoe UI',sans-serif;--disp:'${brand.fontDisplay || 'Jost'}','${brand.fontEN || 'Poppins'}',sans-serif;--ar:'${brand.fontAR || 'Almarai'}','Segoe UI',Tahoma,sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--cream);color:var(--ink);font-family:var(--en);-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
::selection{background:var(--accent);color:var(--cream)}
a{color:inherit;text-decoration:none}img{max-width:100%}
[lang=ar]{font-family:var(--ar);direction:rtl}
.bar{position:fixed;inset:0 0 auto 0;z-index:40;display:flex;align-items:center;gap:10px;padding:10px 14px;background:color-mix(in srgb,var(--cream) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--hairline);transform:translateY(-110%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.bar.on{transform:translateY(0)}
.bar .b-mark{flex:0 0 auto;display:grid;place-items:center}.bar .b-mark svg{width:26px;height:auto}
.bar .b-name{font-family:var(--disp);font-size:12.5px;letter-spacing:.22em;color:var(--ink);white-space:nowrap;text-transform:uppercase}
.bar .b-sp{flex:1}
.bar .b-act{width:34px;height:34px;border-radius:50%;border:1px solid var(--hairline);display:grid;place-items:center;color:var(--accent-deep);background:var(--card)}
.hero{padding:54px 20px 10px;text-align:center;overflow:hidden}
.hero .hero-anim{display:block;margin:0 auto}
.hero .wordmark{width:min(80vw,400px);height:auto;display:block;margin:14px auto 0}
.hero .wordmark-txt{font-family:var(--disp);font-weight:300;font-size:clamp(24px,7vw,34px);letter-spacing:.3em;text-transform:uppercase;color:var(--ink);margin-top:16px;text-indent:.3em}
.hero .wordmark-ar{font-family:var(--ar);font-weight:700;font-size:17px;color:var(--accent-deep);margin-top:6px}
.hero .loc{margin-top:15px;font-family:var(--disp);font-size:11px;letter-spacing:.34em;color:var(--muted-deep);text-transform:uppercase;text-indent:.34em}
.hero .loc-ar{font-family:var(--ar);font-size:11.5px;color:var(--faint);margin-top:4px}
.acts{display:flex;justify-content:center;gap:8px;margin:20px auto 4px}
.act{flex:0 1 auto;display:flex;flex-direction:column;align-items:center;gap:2px;border:1px solid var(--hairline);background:var(--card);border-radius:16px;padding:9px 14px 8px;min-width:96px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.act .a-en{display:inline-flex;align-items:center;gap:5px;font-family:var(--disp);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)}
.act svg{color:var(--accent);width:13px;height:13px}
.act .a-ar{font-family:var(--ar);font-size:11.5px;font-weight:700;color:var(--faint)}
/* hero animation conventions */
.hero-anim .el{transform-origin:var(--ox,50%) var(--oy,50%);opacity:0;transform:rotate(0deg) scale(.55);animation:msEnter 1.1s cubic-bezier(.18,.8,.3,1.08) forwards;animation-delay:var(--d,0s)}
.hero-anim .line{stroke-dasharray:var(--len,300);stroke-dashoffset:var(--len,300);opacity:1;animation:msDraw 1.6s cubic-bezier(.3,.6,.3,1) forwards;animation-delay:var(--d,0s)}
.hero-anim .fade{opacity:0;animation:msFade .9s ease forwards;animation-delay:var(--d,0s)}
.hero-anim .breathe-root{transform-origin:50% 60%;animation:msBreathe 7s ease-in-out 2.4s infinite alternate}
@keyframes msEnter{0%{opacity:0;transform:rotate(0deg) scale(.55)}30%{opacity:1}100%{opacity:1;transform:rotate(var(--a,0deg)) scale(1)}}
@keyframes msDraw{to{stroke-dashoffset:0}}
@keyframes msFade{to{opacity:1}}
@keyframes msBreathe{from{transform:scale(1) rotate(0)}to{transform:scale(1.018) rotate(.35deg)}}
@media (prefers-reduced-motion:reduce){.hero-anim .el{animation:none;opacity:1;transform:rotate(var(--a,0deg))}.hero-anim .line{animation:none;stroke-dashoffset:0}.hero-anim .fade{animation:none;opacity:1}.hero-anim .breathe-root{animation:none}html{scroll-behavior:auto}}
.nav-wrap{position:sticky;top:0;z-index:30;background:color-mix(in srgb,var(--cream) 90%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--hairline)}
.chips{display:flex;gap:7px;overflow-x:auto;padding:10px 16px;scrollbar-width:none;scroll-behavior:smooth}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:1px;border:1px solid var(--hairline);background:var(--card);border-radius:14px;padding:7px 13px 6px;transition:background .25s,border-color .25s}
.chip .ch-en{font-family:var(--disp);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);white-space:nowrap}
.chip .ch-ar{font-size:11.5px;font-weight:700;color:var(--faint);white-space:nowrap}
.chip.on{background:var(--accent);border-color:var(--accent)}
.chip.on .ch-en,.chip.on .ch-ar{color:var(--cream)}
.chip-g{flex:0 0 auto;align-self:center;font-family:var(--disp);font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);padding:0 4px 0 10px;border-inline-start:1px solid var(--hairline)}
.chip-g:first-child{border-inline-start:0;padding-inline-start:2px}
main{max-width:640px;margin:0 auto;padding:6px 16px 30px}
.group{padding-top:8px}
.group-banner{display:flex;align-items:center;gap:14px;margin:34px 2px 4px}
.gb-rule{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--muted) 45%,var(--muted) 55%,transparent);opacity:.5}
.gb-txt{text-align:center}
.gb-en{font-family:var(--disp);font-weight:300;font-size:21px;letter-spacing:.42em;text-transform:uppercase;color:var(--ink);text-indent:.42em}
.gb-ar{font-size:13px;font-weight:700;color:var(--accent-deep);margin-top:1px}
.cat{background:var(--card);border:1px solid var(--hairline);border-radius:20px;margin-top:18px;padding:18px 16px 6px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 10px 30px -22px rgba(0,0,0,.3);scroll-margin-top:76px}
.cat-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:0 2px 12px;border-bottom:1px solid var(--hairline)}
.cat-en{font-family:var(--disp);font-weight:400;font-size:19px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}
.cat-ar{font-size:14px;font-weight:700;color:var(--accent-deep)}
.items{list-style:none}
.item{display:flex;gap:13px;padding:15px 2px;border-bottom:1px solid var(--hairline)}
.item:last-child{border-bottom:0}.item.no-img{padding:13px 2px}
.thumb{flex:0 0 auto;width:64px;height:64px;border-radius:14px;object-fit:cover;background:rgba(0,0,0,.05);box-shadow:inset 0 0 0 1px var(--hairline)}
.item-txt{flex:1;min-width:0}
.i-en{font-weight:500;font-size:15.5px;line-height:1.3;color:var(--ink)}
.i-ar{font-size:13.5px;font-weight:700;line-height:1.55;color:var(--ink-soft);direction:rtl;text-align:left}
.i-den{font-weight:300;font-size:12px;line-height:1.45;color:var(--faint);margin-top:4px}
.i-dar{font-weight:400;font-size:11.5px;line-height:1.6;color:var(--faint);direction:rtl;text-align:left}
.item-price{flex:0 0 auto;text-align:right;padding-top:1px}
.p-num{font-family:var(--disp);font-weight:400;font-size:18px;color:var(--accent-deep);line-height:1}
.p-cur{font-size:8.5px;font-weight:600;letter-spacing:.2em;margin-right:-.2em;color:var(--muted-deep);margin-top:3px}
.p-cal{font-size:9.5px;font-weight:300;color:var(--faint);margin-top:8px;white-space:nowrap}
.rev{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.rev.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none;transition:none}}
footer{border-top:1px solid var(--hairline);margin-top:26px;padding:30px 20px 34px;text-align:center}
footer .f-mark svg{width:52px;height:auto}
footer .f-word{font-family:var(--disp);font-size:13px;letter-spacing:.3em;color:var(--ink);text-transform:uppercase;margin-top:12px}
footer .f-ar{font-size:12.5px;font-weight:700;color:var(--accent-deep);margin-top:3px;font-family:var(--ar)}
footer .f-addr{font-weight:300;font-size:11.5px;color:var(--faint);margin-top:14px;line-height:1.7}
footer .f-soc{display:flex;justify-content:center;gap:10px;margin-top:16px}
footer .f-soc a{width:38px;height:38px;border-radius:50%;border:1px solid var(--hairline);background:var(--card);display:grid;place-items:center;color:var(--accent-deep)}
footer .f-vat{font-weight:300;font-size:10px;color:var(--faint);margin-top:20px;line-height:1.8}
footer .f-by{font-family:var(--disp);font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted);margin-top:14px}
footer .f-by a{border-bottom:1px solid var(--hairline);padding-bottom:1px}
.teaser{max-width:640px;margin:8px auto 0;padding:0 16px}
.teaser-inner{background:var(--card);border:1px dashed var(--accent);border-radius:16px;padding:14px 16px;text-align:center;font-size:12.5px;color:var(--ink-soft)}
.teaser-inner [lang=ar]{display:block;font-weight:700;margin-top:3px}
@media (min-width:520px){.hero{padding-top:66px}.i-en{font-size:16.5px}.i-ar{font-size:14px}.thumb{width:76px;height:76px}}
`;

const js = `
(function(){
var bar=document.getElementById('bar');var hero=document.querySelector('.hero');
new IntersectionObserver(function(e){bar.classList.toggle('on',!e[0].isIntersecting)},{rootMargin:'-70px 0px 0px 0px'}).observe(hero);
var chips=[].slice.call(document.querySelectorAll('.chip'));var byId={};chips.forEach(function(c){byId[c.dataset.cat]=c});var current=null;
var spy=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){set('c-'+en.target.id.slice(2))}})},{rootMargin:'-72px 0px -62% 0px',threshold:0});
[].slice.call(document.querySelectorAll('.cat')).forEach(function(s){spy.observe(s)});
function set(id){if(current===id)return;current=id;chips.forEach(function(c){c.classList.toggle('on',c.dataset.cat===id)});var c=byId[id];if(c){c.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})}}
var rev=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');rev.unobserve(en.target)}})},{rootMargin:'0px 0px -6% 0px'});
[].slice.call(document.querySelectorAll('.rev')).forEach(function(el){rev.observe(el)});
})();
`;

const waIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9.9 8.3L6 21l1.3-4.9A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 9.5c.4 2.5 3 5.1 5.5 5.5l1-1.5 2 1"/></svg>`;
const pinIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`;
const igIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`;

const wordmarkHTML = brand.wordmark && brand.wordmark.file
  ? `<img class="wordmark" src="${brand.wordmark.file}" alt="${esc(brand.name_en)}" width="${brand.wordmark.w || ''}" height="${brand.wordmark.h || ''}" fetchpriority="high">`
  : `<h1 class="wordmark-txt">${esc(brand.name_en)}</h1><p class="wordmark-ar" lang="ar">${esc(brand.name_ar || '')}</p>`;

const acts = [
  L.reserve ? `<a class="act" href="${L.reserve}" target="_blank" rel="noopener"><span class="a-en">${pinIcon} Reserve</span><span class="a-ar" lang="ar">احجز طاولة</span></a>` : '',
  L.whatsapp ? `<a class="act" href="${L.whatsapp}" target="_blank" rel="noopener"><span class="a-en">${waIcon} WhatsApp</span><span class="a-ar" lang="ar">واتساب</span></a>` : '',
  L.maps ? `<a class="act" href="${L.maps}" target="_blank" rel="noopener"><span class="a-en">${pinIcon} Directions</span><span class="a-ar" lang="ar">الاتجاهات</span></a>` : '',
].filter(Boolean).join('\n    ');

const teaser = brand.teaser ? `<div class="teaser"><div class="teaser-inner">${esc(brand.teaser.en)}<span lang="ar">${esc(brand.teaser.ar)}</span></div></div>` : '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(brand.name_en)} — Menu · ${esc(brand.name_ar || '')} — المنيو</title>
<meta name="description" content="${esc(brand.name_en)} — ${esc(brand.city || '')} menu. ${esc(brand.name_ar || '')} — المنيو.">
<meta name="theme-color" content="${B.cream}">
<meta property="og:title" content="${esc(brand.name_en)} — Menu · المنيو">
<meta property="og:type" content="website">
${brand.og ? `<meta property="og:image" content="${brand.og}">` : ''}
${brand.favicon ? `<link rel="icon" type="image/png" href="${brand.favicon}">` : ''}
${(brand.preloadFonts || []).map(f => `<link rel="preload" href="fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<div class="bar" id="bar" aria-hidden="true">
  <span class="b-mark">${markSVG}</span>
  <span class="b-name">${esc(brand.name_en)}</span>
  <span class="b-sp"></span>
  ${L.whatsapp ? `<a class="b-act" href="${L.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>` : ''}
  ${L.maps ? `<a class="b-act" href="${L.maps}" target="_blank" rel="noopener" aria-label="Directions">${pinIcon}</a>` : ''}
</div>
<header class="hero">
  ${heroSVG}
  ${wordmarkHTML}
  ${brand.loc ? `<p class="loc">${esc(brand.loc.en)}</p><p class="loc-ar" lang="ar">${esc(brand.loc.ar)}</p>` : ''}
  <nav class="acts" aria-label="Contact">
    ${acts}
  </nav>
</header>
${teaser}
<div class="nav-wrap" id="nav"><nav class="chips" aria-label="Menu sections">${chipsHTML}</nav></div>
<main>
${GROUPS.map(groupBlock).join('\n')}
</main>
<footer>
  <div class="f-mark">${markSVG}</div>
  <p class="f-word">${esc(brand.name_en)}</p>
  ${brand.name_ar ? `<p class="f-ar" lang="ar">${esc(brand.name_ar)}</p>` : ''}
  ${brand.address ? `<p class="f-addr">${esc(brand.address)}${brand.address_ar ? `<br><span lang="ar">${esc(brand.address_ar)}</span>` : ''}</p>` : ''}
  <div class="f-soc">
    ${L.instagram ? `<a href="${L.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${igIcon}</a>` : ''}
    ${L.whatsapp ? `<a href="${L.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon}</a>` : ''}
    ${L.maps ? `<a href="${L.maps}" target="_blank" rel="noopener" aria-label="Directions">${pinIcon}</a>` : ''}
  </div>
  ${brand.vat_note ? `<p class="f-vat">${brand.vat_note}</p>` : ''}
  <p class="f-by"><a href="https://menu-sadah.com" target="_blank" rel="noopener">Menu Sadah</a></p>
</footer>
<script>${js}</script>
</body>
</html>
`;

fs.writeFileSync(path.join(DIR, 'index.html'), html);
const items = data.categories.reduce((n, c) => n + c.items.length, 0);
console.log(`✓ ${brand.slug || path.basename(DIR)}: ${data.categories.length} cats, ${items} items, ${(html.length / 1024).toFixed(0)}KB`);

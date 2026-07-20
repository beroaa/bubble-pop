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
    return readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !/^logo\./i.test(f)).sort().map((file) => ({ file, shows: '', src: '' }));
  } catch { return []; }
}

/* REAL animated-logo slot: dist/assets/photos/<slug>/logo.(svg|gif|png) — checked in that
   order (lands via MacBook PHOTO-MISSION) → rendered inside the medallion, replacing the
   bilingual initial; absent → the (great-on-its-own) initial stays. SVG/GIF animate freely. */
function cafeLogo(slug) {
  if (!slug) return null;
  try {
    for (const ext of ['svg', 'gif', 'png']) {
      if (existsSync(PHOTOS_DIR + '/' + slug + '/logo.' + ext)) return '../assets/photos/' + slug + '/logo.' + ext;
    }
  } catch { /* fs error → fall back to initial */ }
  return null;
}
const logoImg = (logo) => `<img class="logo" src="${esc(logo)}" alt="" onerror="this.parentElement.classList.remove('haslogo');this.remove()">`;

/* ---------- ANIMATED BRAND MARK (the "cool Beyt-cube logo" per cafe) ----------
   A designed, self-assembling inline-SVG mark rendered INSIDE the medallion when no
   real logo file exists (cafeLogo wins first; the plain initial is the last resort).
   ~10 templates chosen by cafe type / archetype / motif / world; each ≤2.5KB, drawn in
   the cafe's own brand vars (ink outline + accents), assembles on load then idles, and
   under prefers-reduced-motion snaps to its static assembled self (every hide-state and
   keyframe lives INSIDE the no-preference media query, so rest = fully assembled). */
function pickMarkKind(cafe, brief) {
  const t = String(cafe.type || '').toLowerCase();
  const arch = brief.archetype || '';
  const motif = brief.motif || '';
  const world = String((brief.world && (brief.world.en + ' ' + brief.world.ar)) || '').toLowerCase();
  const tw = t + ' ' + world;
  if (/bakery|bake|bread|oven|فرن|مخبز|خبز/.test(tw)) return 'loaf';
  if (/dessert|sweet|pastr|ice ?cream|gelato|cake|حلا|حلوى|كيك|بوظة/.test(tw)) return 'cake';
  if (/matcha|ماتشا/.test(tw)) return 'matcha';
  if (/tea|chai|شاي|قعدة الشاي/.test(t)) return 'pot';
  if (/gaming|game|arcade|esports|قيمنق|ألعاب|قيمرز/.test(t) || arch === 'neon-arcade') return 'arcade';
  if (/grill|burger|bbq|steak|fire|شواء|برجر|نار|مشاوي/.test(t)) return 'flame';
  if (/family|عائل/.test(t)) return 'house';
  if (/roast|specialty|coffee|espresso|قهوة|محمصة|روستري/.test(t)) return 'bean';
  // fall back to the WORLD / motif imagery
  if (/garden|flower|petal|leaf|bloom|rooftop|roof|sun|dawn|first light|بستان|حديقة|زهر|ورد|سطح|شمس|فجر|صباح/.test(world) || motif === 'leaves') return 'sun';
  if (/night|star|moon|flock|bird|sky|dark|ليل|نجوم|قمر|سماء|طير|سرب/.test(world) || motif === 'stars') return 'star';
  if (motif === 'steam') return 'pot';
  if (motif === 'sparks') return 'arcade';
  if (arch === 'garden-fresh') return 'sun';
  if (arch === 'poster-dark') return 'star';
  return 'bean'; // coffee is the safe default for a Riyadh cafe
}
/* colors passed as CSS-var strings so one template renders correctly in either page's palette */
function brandMark(cafe, brief, c, tag) {
  const kind = pickMarkKind(cafe, brief);
  const u = 'bm' + seedOf((cafe.slug || cafe.name) + kind).toString(36) + tag;
  const K = c.ink, A = c.accent, S = c.sa, S2 = c.sa2, A2 = c.accent2;
  const SW = 'stroke="' + K + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  let inner = '', anim = '';
  switch (kind) {
    case 'loaf':
      inner = `<path class="p1" d="M18 68 Q18 40 50 40 Q82 40 82 68 Q82 72 78 72 L22 72 Q18 72 18 68 Z" fill="${S}" ${SW}/>`
        + `<path class="p2" d="M34 50 l6 8 M50 47 l6 9 M66 50 l-6 8" ${SW.replace('5', '4')}/>`
        + `<path class="s1" d="M40 34 q4 -6 0 -12" stroke="${A}" stroke-width="4" stroke-linecap="round" opacity=".85"/>`
        + `<path class="s2" d="M60 34 q4 -6 0 -12" stroke="${A}" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
      anim = `@keyframes ${u}rise{0%{opacity:0;transform:translateY(30px) scale(.7)}70%{opacity:1;transform:translateY(-3px)}100%{transform:none}}`
        + `.${u} .p1{animation:${u}rise .9s cubic-bezier(.2,1.2,.3,1) both}`
        + `.${u} .p2{stroke-dasharray:60;stroke-dashoffset:60;animation:${u}dr .7s ease .7s forwards}@keyframes ${u}dr{to{stroke-dashoffset:0}}`
        + `.${u} .s1,.${u} .s2{opacity:0;animation:${u}stm 2.6s ease-in-out 1s infinite}.${u} .s2{animation-delay:1.4s}`
        + `@keyframes ${u}stm{0%{opacity:0;transform:translateY(4px)}40%{opacity:.9}100%{opacity:0;transform:translateY(-8px)}}`;
      break;
    case 'cake':
      inner = `<g class="p1"><rect x="22" y="54" width="56" height="24" rx="7" fill="${A}" ${SW}/></g>`
        + `<g class="p2"><rect x="32" y="34" width="36" height="22" rx="7" fill="${S}" ${SW}/></g>`
        + `<g class="p3"><circle cx="50" cy="26" r="6" fill="${A2}" ${SW.replace('5', '4')}/></g>`
        + `<path class="p4" d="M50 20 q3 -6 8 -7" ${SW.replace('5', '3.5')}/>`;
      anim = `@keyframes ${u}fl{0%{opacity:0;transform:translateX(-40px) rotate(-12deg)}100%{transform:none}}`
        + `@keyframes ${u}fr{0%{opacity:0;transform:translateX(40px) rotate(12deg)}100%{transform:none}}`
        + `@keyframes ${u}drop{0%{opacity:0;transform:translateY(-30px) scale(.4)}70%{transform:translateY(2px) scale(1.1)}100%{transform:none}}`
        + `.${u} .p1{animation:${u}fl .8s cubic-bezier(.2,1.2,.3,1) both}`
        + `.${u} .p2{animation:${u}fr .8s cubic-bezier(.2,1.2,.3,1) .2s both}`
        + `.${u} .p3{animation:${u}drop .7s cubic-bezier(.2,1.5,.3,1) .55s both}`
        + `.${u} .p4{opacity:0;animation:${u}fd .4s ease .95s forwards}@keyframes ${u}fd{to{opacity:1}}`;
      break;
    case 'matcha':
      inner = `<path class="p1" d="M24 52 Q50 84 76 52 Z" fill="${A}" ${SW}/>`
        + `<ellipse class="p2" cx="50" cy="52" rx="26" ry="7" fill="${S2}" ${SW}/>`
        + `<path class="p3" d="M50 52 L50 30 M50 34 l-8 -6 M50 34 l8 -6" ${SW.replace('5', '4')}/>`
        + `<path class="lf" d="M64 40 q10 -8 6 -20 q-12 4 -6 20 Z" fill="${S}" ${SW.replace('5', '3.5')}/>`;
      anim = `@keyframes ${u}cup{0%{opacity:0;transform:translateY(26px) scale(.7)}100%{transform:none}}`
        + `.${u} .p1,.${u} .p2{animation:${u}cup .85s cubic-bezier(.2,1.2,.3,1) both}.${u} .p2{animation-delay:.1s}`
        + `.${u} .p3{stroke-dasharray:50;stroke-dashoffset:50;animation:${u}dr .6s ease .7s forwards}@keyframes ${u}dr{to{stroke-dashoffset:0}}`
        + `.${u} .lf{opacity:0;animation:${u}leaf .7s cubic-bezier(.2,1.4,.3,1) .9s forwards}`
        + `@keyframes ${u}leaf{0%{opacity:0;transform:translateY(8px) scale(.4) rotate(-20deg)}100%{opacity:1;transform:none}}`;
      break;
    case 'pot':
      inner = `<path class="p1" d="M28 50 Q28 74 50 74 Q72 74 72 50 Z" fill="${A}" ${SW}/>`
        + `<path class="p2" d="M72 56 q12 -2 14 -12 q-1 -3 -4 -2 q-2 8 -12 8" fill="${A}" ${SW.replace('5', '4.5')}/>`
        + `<ellipse class="p3" cx="50" cy="50" rx="24" ry="6" fill="${S2}" ${SW}/>`
        + `<circle class="p4" cx="50" cy="42" r="4" fill="${S}" ${SW.replace('5', '4')}/>`
        + `<path class="s1" d="M44 34 q4 -6 0 -12" stroke="${A2}" stroke-width="4" stroke-linecap="round"/>`
        + `<path class="s2" d="M56 34 q4 -6 0 -12" stroke="${A2}" stroke-width="4" stroke-linecap="round"/>`;
      anim = `@keyframes ${u}rise{0%{opacity:0;transform:translateY(24px) scale(.75)}100%{transform:none}}`
        + `.${u} .p1,.${u} .p3{animation:${u}rise .85s cubic-bezier(.2,1.2,.3,1) both}.${u} .p3{animation-delay:.1s}`
        + `.${u} .p2{stroke-dasharray:70;stroke-dashoffset:70;animation:${u}dr .7s ease .6s forwards}@keyframes ${u}dr{to{stroke-dashoffset:0}}`
        + `.${u} .p4{opacity:0;animation:${u}pop .5s cubic-bezier(.2,1.5,.3,1) .8s forwards}@keyframes ${u}pop{0%{opacity:0;transform:translateY(-8px) scale(.4)}100%{opacity:1;transform:none}}`
        + `.${u} .s1,.${u} .s2{opacity:0;animation:${u}stm 2.8s ease-in-out 1s infinite}.${u} .s2{animation-delay:1.4s}`
        + `@keyframes ${u}stm{0%{opacity:0;transform:translateY(4px)}40%{opacity:.85}100%{opacity:0;transform:translateY(-9px)}}`;
      break;
    case 'house':
      inner = `<g class="p1"><path d="M26 48 L50 28 L74 48 Z" fill="${S}" ${SW}/></g>`
        + `<g class="p2"><rect x="30" y="48" width="40" height="30" rx="4" fill="${A}" ${SW}/></g>`
        + `<g class="p3"><path d="M44 78 L44 60 Q50 55 56 60 L56 78 Z" fill="${S2}" ${SW.replace('5', '4')}/></g>`;
      anim = `@keyframes ${u}top{0%{opacity:0;transform:translateY(-30px) rotate(-10deg)}100%{transform:none}}`
        + `@keyframes ${u}bot{0%{opacity:0;transform:translateY(30px)}100%{transform:none}}`
        + `@keyframes ${u}pop{0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:none}}`
        + `.${u} .p1{animation:${u}top .8s cubic-bezier(.2,1.3,.3,1) both}`
        + `.${u} .p2{animation:${u}bot .8s cubic-bezier(.2,1.2,.3,1) .2s both}`
        + `.${u} .p3{animation:${u}pop .5s ease .7s both}`;
      break;
    case 'arcade':
      inner = `<path class="p1" d="M50 26 L74 50 L50 74 L26 50 Z" fill="${A}" ${SW}/>`
        + `<g class="p2"><rect x="40" y="46" width="8" height="8" fill="${S}"/></g>`
        + `<g class="p3"><rect x="52" y="46" width="8" height="8" fill="${S2}"/></g>`
        + `<g class="p4"><rect x="46" y="34" width="8" height="8" fill="${A2}"/></g>`
        + `<g class="p5"><rect x="46" y="58" width="8" height="8" fill="${S}"/></g>`;
      anim = `@keyframes ${u}dia{0%{opacity:0;transform:rotate(-135deg) scale(.3)}100%{opacity:1;transform:none}}`
        + `.${u} .p1{animation:${u}dia .9s cubic-bezier(.2,1.3,.3,1) both}`
        + `@keyframes ${u}px{0%{opacity:0;transform:scale(0)}100%{opacity:1;transform:none}}`
        + `.${u} .p2{opacity:0;animation:${u}px .4s .55s forwards}.${u} .p3{opacity:0;animation:${u}px .4s .7s forwards}`
        + `.${u} .p4{opacity:0;animation:${u}px .4s .85s forwards}.${u} .p5{opacity:0;animation:${u}px .4s 1s forwards}`;
      break;
    case 'sun':
      inner = `<g class="p1"><circle cx="50" cy="50" r="16" fill="${A}" ${SW}/></g>`
        + `<g class="rays"><path d="M50 20 V8 M50 92 V80 M20 50 H8 M92 50 H80 M29 29 L21 21 M71 29 L79 21 M29 71 L21 79 M71 71 L79 79" stroke="${S}" stroke-width="5" stroke-linecap="round"/></g>`;
      anim = `@keyframes ${u}pop{0%{opacity:0;transform:scale(.2)}70%{transform:scale(1.12)}100%{opacity:1;transform:none}}`
        + `.${u} .p1{animation:${u}pop .8s cubic-bezier(.2,1.4,.3,1) both}`
        + `.${u} .rays{stroke-dasharray:150;stroke-dashoffset:150;animation:${u}dr 1s ease .5s forwards,${u}spin 22s linear 1.6s infinite}`
        + `@keyframes ${u}dr{to{stroke-dashoffset:0}}@keyframes ${u}spin{to{transform:rotate(360deg)}}`;
      break;
    case 'star':
      inner = `<path class="p1" d="M50 22 L58 42 L80 44 L63 58 L69 80 L50 67 L31 80 L37 58 L20 44 L42 42 Z" fill="${A}" ${SW}/>`
        + `<circle class="t1" cx="26" cy="26" r="3" fill="${S}"/>`
        + `<circle class="t2" cx="78" cy="28" r="2.5" fill="${S2}"/>`
        + `<circle class="t3" cx="72" cy="72" r="2.5" fill="${S}"/>`;
      anim = `@keyframes ${u}star{0%{opacity:0;transform:scale(.2) rotate(-40deg)}70%{transform:scale(1.08) rotate(4deg)}100%{opacity:1;transform:none}}`
        + `.${u} .p1{animation:${u}star .9s cubic-bezier(.2,1.4,.3,1) both}`
        + `.${u} .t1,.${u} .t2,.${u} .t3{animation:${u}tw 2.4s ease-in-out infinite}`
        + `.${u} .t1{animation-delay:.9s}.${u} .t2{animation-delay:1.3s}.${u} .t3{animation-delay:1.7s}`
        + `@keyframes ${u}tw{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.2)}}`;
      break;
    case 'flame':
      inner = `<path class="p1" d="M50 20 C64 40,58 46,54 52 C64 48,66 60,60 70 C74 62,72 84,50 84 C28 84,26 62,40 70 C34 60,36 48,46 52 C42 46,36 40,50 20 Z" fill="${A}" ${SW}/>`
        + `<path class="p2" d="M50 44 C57 54,52 60,50 66 C48 60,43 54,50 44 Z" fill="${S}" ${SW.replace('5', '3.5')}/>`;
      anim = `@keyframes ${u}fl{0%{opacity:0;transform:translateY(26px) scale(.6)}100%{transform:none}}`
        + `.${u} .p1{animation:${u}fl .85s cubic-bezier(.2,1.2,.3,1) both}`
        + `.${u} .p2{opacity:0;animation:${u}fd .5s ease .7s forwards,${u}flk 1.5s ease-in-out 1.3s infinite}`
        + `@keyframes ${u}fd{to{opacity:1}}@keyframes ${u}flk{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.15)}}`;
      break;
    default: // bean — specialty_coffee / roastery / safe default
      inner = `<g class="p1"><ellipse cx="50" cy="51" rx="25" ry="33" fill="${A}" ${SW} transform="rotate(-16 50 51)"/></g>`
        + `<path class="p2" d="M51 22 C42 37,60 64,49 80" ${SW}/>`;
      anim = `@keyframes ${u}p1{0%{opacity:0;transform:scale(.2) rotate(-70deg)}60%{opacity:1;transform:scale(1.08) rotate(6deg)}100%{transform:none}}`
        + `.${u} .p1{animation:${u}p1 .9s cubic-bezier(.2,1.3,.3,1) both}`
        + `.${u} .p2{stroke-dasharray:130;stroke-dashoffset:130;animation:${u}dr 1s ease .55s forwards}@keyframes ${u}dr{to{stroke-dashoffset:0}}`;
  }
  return `<svg class="mark ${u}" viewBox="0 0 100 100" fill="none" role="img" aria-label="${esc(cafe.name)}">`
    + `<style>.${u}{overflow:visible}.${u} *{transform-box:fill-box;transform-origin:center}`
    + `@media (prefers-reduced-motion:no-preference){`
    + `.${u} .mk{animation:${u}bob 5s ease-in-out 1.7s infinite}@keyframes ${u}bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}`
    + anim + `}</style><g class="mk">${inner}</g></svg>`;
}
/* CSS-var color kits so the same mark reads correctly in each page's palette */
const MENU_MARK_COLORS = { ink: 'var(--ink)', accent: 'var(--accent)', sa: 'var(--sa)', sa2: 'var(--sa2)', accent2: 'var(--accent-2)' };
const GIFT_MARK_COLORS = { ink: 'var(--ink)', accent: 'var(--rose)', sa: 'var(--gold)', sa2: 'var(--sage)', accent2: 'var(--ochre)' };

/* ---------- brandlogo50: per-cafe BESPOKE animated logo (Beyt-level, pre-vetted) ----------
   {slug:{concept,css,svg}} — a hand-designed self-assembling inline-SVG logo shown BIG at the
   hero and small at the footer (like Beyt's cube). The svg/css use the token UID (replaced with a
   per-cafe id at render) and colors ONLY via the logo vars --lk/--la/--ls/--ls2/--la2/--lp, so one
   design reads correctly in both the menu and gift palettes. Validated by merge-logos.mjs; a missing
   or malformed entry falls back to the generic animated brandMark — a broken logo never ships. */
const BRANDLOGO_FILE = fileURLToPath(new URL('../singularity/brandlogo50.json', import.meta.url));
const BRANDLOGO = (() => {
  try {
    if (existsSync(BRANDLOGO_FILE)) return JSON.parse(readFileSync(BRANDLOGO_FILE, 'utf8'));
  } catch { /* malformed file → no bespoke logos, menus still build with the generic mark */ }
  return {};
})();
function brandLogoEntry(slug) {
  const e = slug && BRANDLOGO[slug];
  if (!e || typeof e.svg !== 'string' || typeof e.css !== 'string') return null;
  if (e.svg.length > 5200 || e.css.length > 4600) return null; // size guard
  if (!/^<svg[\s>]/.test(e.svg.trim())) return null;
  return e;
}
/* render one bespoke-logo instance: UID → per-cafe id; css emitted once (withCss) then reused */
function brandLogoHtml(entry, slug, cls, withCss) {
  const id = 'L' + seedOf(slug + 'logo').toString(36);
  const svg = entry.svg.replace(/UID/g, id);
  const css = withCss ? `<style>${entry.css.replace(/UID/g, id)}</style>` : '';
  return `<div class="brandlogo ${cls}" aria-hidden="true">${css}${svg}</div>`;
}
/* shared wrapper CSS: the logo color-var contract + hero/footer sizing + reduced-motion safety.
   `vars` differs per page so the SAME svg inherits that page's palette. */
function brandLogoCss(vars) {
  return `.brandlogo{${vars};line-height:0}
  .brandlogo svg{display:block;overflow:visible;width:100%;height:auto}
  .brandlogo *{transform-box:fill-box;transform-origin:center}
  .brandlogo.big{width:min(196px,54vw);margin:2px auto 8px}
  .brandlogo.big svg{filter:drop-shadow(0 10px 22px var(--accent-soft,rgba(0,0,0,.14)))}
  .brandlogo.mini{width:60px;margin:0 auto 12px;opacity:.96}
  @media(min-width:900px){.brandlogo.big{width:236px}.brandlogo.mini{width:70px}}
  @media(prefers-reduced-motion:reduce){.brandlogo svg *{animation:none!important;opacity:1!important;stroke-dashoffset:0!important;filter:none!important;transform:none!important}}
  @media print{.brandlogo{display:none!important}}`;
}

/* ---------- BOLD BRAND TYPOGRAPHY: per-archetype type VOICE (size/weight/case/tracking) ----------
   Layered after the ink-craft finish, so it never touches heading COLOR (ink stays ink) — it only
   pushes scale, weight, case and letter-spacing so each brand's words feel designed, never timid.
   Transform-free where a reveal animation runs, except playful-hand whose tilt is intentional. */
const TYPE_PERSONA = {
  'editorial-mag': `.room-eyebrow{border-top:2px solid var(--ink);display:inline-block;padding-top:5px}
    .room-h2{font-weight:800;letter-spacing:-.022em}
    h1{letter-spacing:-.035em}
    .item-name{font-weight:600;letter-spacing:-.01em}`,
  'poster-dark': `.room-eyebrow{letter-spacing:.3em}
    .room-h2{text-transform:uppercase;letter-spacing:.03em;font-weight:800}
    h1{letter-spacing:-.015em}`,
  'neon-arcade': `.room-eyebrow{letter-spacing:.34em}
    .room-h2{text-transform:uppercase;letter-spacing:.05em;font-weight:800}
    .item-name{font-weight:600}
    .price{letter-spacing:.02em}`,
  'majlis-heritage': `.room-eyebrow{letter-spacing:.26em;font-weight:700}
    .room-h2{font-weight:700}
    [data-lang="ar"] .room-h2{font-size:1.07em}
    .item-name{font-weight:600}`,
  'garden-fresh': `.room-eyebrow{letter-spacing:.22em}
    .room-h2{font-weight:800;letter-spacing:-.01em}
    .item-name{font-weight:600}`,
  'storybook-light': `.room-eyebrow{letter-spacing:.2em}
    .room-h2{font-weight:800}
    .item-name{font-weight:600}`,
  'playful-hand': `.room-eyebrow{letter-spacing:.18em}
    .room-h2{font-weight:800;transform:rotate(-1.4deg)}
    .cat--flip .room-h2{transform:rotate(1.4deg)}
    .item-name{font-weight:600}`,
  'ticket-diner': `.room-eyebrow{letter-spacing:.26em}
    .room-h2{text-transform:uppercase;letter-spacing:.02em;font-weight:800}
    .price{font-family:ui-monospace,Menlo,monospace;letter-spacing:-.02em}
    .item-name{font-weight:600}`,
};
function typePersona(arch) {
  return `  /* ---- BOLD BRAND TYPOGRAPHY: confident scale + ${arch} voice + animated headers ---- */
  .room-eyebrow{font-weight:800}
  ${TYPE_PERSONA[arch] || '.room-h2{font-weight:800}.item-name{font-weight:600}'}
  @media (prefers-reduced-motion:no-preference){
    .reveal .room-h2,.reveal .room-eyebrow{opacity:0}
    .reveal.in .room-eyebrow{animation:rhk .5s ease .05s forwards}
    .reveal.in .room-h2{animation:rh2in .62s ease .12s forwards}
    @keyframes rh2in{0%{opacity:0;filter:blur(5px)}100%{opacity:1;filter:blur(0)}}
    @keyframes rhk{to{opacity:1}}
  }`;
}

/* shared gold trio handed to every scene pack */
const SCENE_GOLD = { gold: '#c79a3a', goldBright: '#e8c268', goldDeep: '#8a6a1f' };

/* ---------- polish50: per-cafe bespoke hero touches (pre-validated file, trusted verbatim) ---------- */
const POLISH_FILE = fileURLToPath(new URL('../singularity/polish50.json', import.meta.url));
const POLISH = (() => {
  try {
    if (existsSync(POLISH_FILE)) return JSON.parse(readFileSync(POLISH_FILE, 'utf8'));
  } catch { /* malformed file → no polish, menus still build */ }
  return {};
})();
function polishFor(slug) {
  const p = slug && POLISH[slug];
  if (!p || typeof p.css !== 'string' || typeof p.html !== 'string') return null;
  if (p.css.length > 2000 || p.html.length > 800) return null; // size guard
  return p;
}

/* ---------- roomvoice50: per-cafe spoken room asides + a third diary line (pre-vetted copy) ---------- */
const ROOMVOICE_FILE = fileURLToPath(new URL('../singularity/roomvoice50.json', import.meta.url));
const ROOMVOICE = (() => {
  try {
    if (existsSync(ROOMVOICE_FILE)) return JSON.parse(readFileSync(ROOMVOICE_FILE, 'utf8'));
  } catch { /* malformed file → no voices, menus still build */ }
  return {};
})();

/* ---------- photodirection50: per-cafe ART DIRECTION for the photo slots ----------
   {slug: {hero, strip:[...], rooms:[{file,hint}], exclude:[...], grade}} — pre-vetted.
   hero + strip drive the brandshots polaroids IN THAT ORDER; rooms drive the room
   cat-art images (cycled, hint → object-position); excluded files NEVER render
   anywhere (menu or gift detail cards). No entry → auto behavior stays untouched. */
const DIRECTION_FILE = fileURLToPath(new URL('../singularity/photodirection50.json', import.meta.url));
const DIRECTION = (() => {
  try {
    if (existsSync(DIRECTION_FILE)) return JSON.parse(readFileSync(DIRECTION_FILE, 'utf8'));
  } catch { /* malformed file → no direction, menus still build */ }
  return {};
})();
function directPhotos(slug, shots, giftMode = false) {
  const d = slug && DIRECTION[slug];
  if (!d || !d.hero || !shots.length) return { shots, rooms: null };
  const exclude = Array.isArray(d.exclude) ? d.exclude : [];
  const kept = shots.filter((s) => !exclude.includes(s.file)); // excluded files never render
  const have = (f) => kept.some((s) => s.file === f);
  const strip = Array.isArray(d.strip) ? d.strip : [];
  // gift detail cards lead with hero + FIRST strip file; menu polaroids take hero + full strip
  const lead = [d.hero, ...(giftMode ? strip.slice(0, 1) : strip)].filter((f, i, a) => have(f) && a.indexOf(f) === i);
  const ordered = [
    ...lead.map((f) => kept.find((s) => s.file === f)),
    ...kept.filter((s) => !lead.includes(s.file)),
  ];
  const rooms = (Array.isArray(d.rooms) ? d.rooms : []).filter((r) => r && r.file && have(r.file));
  return { shots: ordered, rooms: rooms.length ? rooms : null };
}

/* ---------- brandbg50: per-cafe LIVING ANIMATED BACKGROUND (pre-vetted file) ----------
   {slug:{emotion,rationale,css,html}} — a soft, on-brand animated backdrop injected as
   the FIRST child of <body> (behind everything: position:fixed;inset:0;z-index:0;
   pointer-events:none), so the .wrap (z-index:1) content — and every card — stays above
   it and text contrast is never touched. Size-guarded; physical left/right CSS inside an
   entry is converted to logical so the RTL QA gate stays green. */
const BRANDBG_FILE = fileURLToPath(new URL('../singularity/brandbg50.json', import.meta.url));
const BRANDBG = (() => {
  try {
    if (existsSync(BRANDBG_FILE)) return JSON.parse(readFileSync(BRANDBG_FILE, 'utf8'));
  } catch { /* malformed file → no living bg, menus still build */ }
  return {};
})();
/* RTL MIRROR LAW: keep injected bg CSS logical-only (the QA gate fails physical left/right).
   These decorative layers are pointer-events:none and behind all content, so a purely
   cosmetic RTL shift on a blurred backdrop is invisible — logical props keep the build green. */
function bbgLogical(css) {
  return String(css)
    .replace(/margin-left\s*:/g, 'margin-inline-start:')
    .replace(/margin-right\s*:/g, 'margin-inline-end:')
    .replace(/padding-left\s*:/g, 'padding-inline-start:')
    .replace(/padding-right\s*:/g, 'padding-inline-end:')
    .replace(/text-align\s*:\s*left/g, 'text-align:start')
    .replace(/text-align\s*:\s*right/g, 'text-align:end');
}
function brandbgFor(slug) {
  const b = slug && BRANDBG[slug];
  if (!b || typeof b.css !== 'string' || typeof b.html !== 'string') return null;
  if (b.css.length > 3000 || b.html.length > 1200) return null; // size guard
  return { css: bbgLogical(b.css), html: b.html };
}

/* ---------- SAUDI SOUL (INSPIRATION ONLY — never a claim of affiliation/endorsement) ----------
   Tarma peephole medallion frame (VISION2030-BANK shortlist C): re-shell the existing
   bilingual medallion in a Najdi carved-door frame — a 2px ink-stroked square rotated
   45deg BEHIND the circle with small triangular furjat corner notches. Static, no
   animation, no downloads (reduced-motion safe), reuses the per-cafe initial/mark/logo,
   adds zero assets, and changes nothing about contrast. Notches hide on narrow screens. */
function najdiFrame(ink) {
  return `<svg class="najdi" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">`
    + `<rect x="24" y="24" width="52" height="52" rx="2" transform="rotate(45 50 50)" fill="none" stroke="${ink}" stroke-width="2.4"/>`
    + `<g class="nch" fill="${ink}"><path d="M50 4 L45 13 L55 13 Z"/><path d="M96 50 L87 45 L87 55 Z"/><path d="M50 96 L45 87 L55 87 Z"/><path d="M4 50 L13 45 L13 55 Z"/></g>`
    + `</svg>`;
}
/* Tarma frame CSS: the frame sits at z-index:0 and the medallion's own content
   (initial / animated mark / real logo) is raised to z-index:1 so it always reads on top —
   contrast untouched. Furjat notches hide under ~400px via a width media query (no physical
   left/right — RTL-safe). Reuses the page's own --ink, so it recolors per palette, light + dark. */
const NAJDI_CSS = `
  .medal{position:relative}
  .medal .najdi{position:absolute;inset:-12px;width:calc(100% + 24px);height:calc(100% + 24px);z-index:0;pointer-events:none;overflow:visible;opacity:.5}
  .medal>span,.medal .mark,.medal .logo{position:relative;z-index:1}
  @media (max-width:399px){.medal .najdi .nch{display:none}}`;

/* Sadu / Al-Qatt woven band divider (VISION2030-BANK shortlist B): a ~10px chevron/diamond
   weave in accent + ink, sealed by a hairline ink outline. Color lives ONLY inside the band,
   never in the words (honors the INK-DARK law); recolors per-cafe from the palette; light +
   dark safe; sits between blocks so it never fights the medallion, photos, or body text. */
const saduBand = (accent, ink) => `
  .sadu-band{height:11px;margin:9px 0 3px;border:1px solid ${ink};border-radius:3px;opacity:.62;
    background:repeating-linear-gradient(60deg,${accent} 0 6px,transparent 6px 12px),
    repeating-linear-gradient(-60deg,${ink} 0 6px,transparent 6px 12px)}`;

/* ---------- BRAND TRUTH (locked): shared category photos are BANNED on masterpiece
   pages — they showed OTHER cafes' branded products. Only per-cafe folder photos
   (dist/assets/photos/<slug>/) ever render; absent folder → tinted SVG art. */

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
    // bolder brand accent (vivid, Beyt-confident) — no more muddy same-gold
    accent: hslHex(h, clamp(s + 16, 45, 88), 38), accentBright: hslHex(h, s, l),
    accent2: hslHex(h + 18, clamp(s + 10, 40, 90), 50), deep: hslHex(h, clamp(s + 6, 30, 90), 22), ink: '#ffffff',
    bg0: hslHex(h, 32, 98), bg1: hslHex(h, 28, 96), bg2: hslHex(h, 22, 92),
    border1: hslHex(h, 22, 86), border2: hslHex(h, 26, 74),
    // strong near-black warm INK (Beyt #382900) — headings + body read confident, not washed
    text1: hslHex(h, clamp(s, 30, 55), 12), text2: hslHex(h, 20, 30), text3: hslHex(h, 12, 46),
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
    return `<span class="mote" style="inset-inline-start:${x}%;top:${y}%;font-size:${9 + ((sd >> i) % 7)}px;animation-delay:${(i * 0.7) % 4}s">${ch}</span>`;
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
  // BRAND MOTION DNA: the palette seed also decides how this brand MOVES
  const MO = (cafe.theme && cafe.theme.motion) || { ease: 'cubic-bezier(.22,1,.36,1)', revealDir: 'up' };
  // reveal arrival by brand DNA — 'start' is logical (mirrors via --tx in RTL)
  const revealFrom = MO.revealDir === 'start' ? 'translateX(calc(-14px * var(--tx,1)))'
    : MO.revealDir === 'scale' ? 'scale(.97)' : 'translateY(16px)';
  const direction = directPhotos(cafe.slug, cafePhotos(cafe.slug)); // photodirection50: directed order + excludes
  const shots = direction.shots; // directed → hero first, then strip: the polaroids read in art-directed order
  const roomShots = direction.rooms; // directed room list (cycled, hint → object-position); null → auto cycle
  const logo = cafeLogo(cafe.slug); // real brand logo → medallion (fallback: bespoke logo, animated mark, then initial)
  const blogo = logo ? null : brandLogoEntry(cafe.slug); // BESPOKE Beyt-level animated logo (big hero + footer mini)
  // when a bespoke logo carries the hero, the medallion drops back to the plain bilingual initial
  const menuMark = (logo || blogo) ? '' : brandMark(cafe, brief, MENU_MARK_COLORS, 'm'); // designed self-assembling SVG mark
  const heroLogo = blogo ? brandLogoHtml(blogo, cafe.slug, 'big', true) : '';
  const footLogo = blogo ? brandLogoHtml(blogo, cafe.slug, 'mini', false) : '';
  const shotSrc = (i) => esc('../assets/photos/' + cafe.slug + '/' + shots[i % shots.length].file);
  const polish = polishFor(cafe.slug); // bespoke per-cafe touch (polish50)
  const voice = ROOMVOICE[cafe.slug] || null; // roomvoice50: spoken room asides + third diary
  const bbg = brandbgFor(cafe.slug); // brandbg50: per-cafe living animated background (behind everything)

  /* SELLABLE PASS 1 — TAP-TO-ORDER: real phone → wa.me deep link per item;
     no phone (the norm — CONTACT placeholder never counts) → premium demo chip
     whose tooltip honestly sells the activation. */
  const rawPhone = String(cafe.phone || '').replace(/\D/g, '');
  const cafePhone = rawPhone && rawPhone !== '966500000000' ? rawPhone : null;
  const orderChip = (en, ar) => cafePhone
    ? `<a class="order-chip touchable" href="https://wa.me/${cafePhone}?text=${encodeURIComponent('مرحباً ' + (cafe.nameAr || cafe.name) + '، أبغى أطلب: ' + ar)}" target="_blank" rel="noopener"><span class="ar">اطلب 🟢</span><span class="en">🟢 Order</span></a>`
    : `<button class="order-chip demo touchable" type="button" data-tip><span class="ar">اطلب 🟢</span><span class="en">🟢 Order</span></button>`;

  const roomFor = (cat) => (brief.rooms || []).find((r) => r.catEn && r.catEn.toLowerCase() === String(cat.cat).toLowerCase());
  const sigCat = cafe.menu.find((c) => /signature|توقيع/i.test(c.cat + c.catAr));
  const cats = cafe.menu.filter((c) => c !== sigCat);
  const diary = (brief.diaryAr || []).slice(0, 2);

  const navChips = cafe.menu.map((c, i) => {
    const r = roomFor(c);
    return `<a class="chip touchable" href="#cat-${i}"><span class="ar">${esc(r ? r.titleAr : c.catAr)}</span><span class="en">${esc(r ? r.titleEn : c.cat)}</span></a>`;
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

  // roomvoice50 third diary — woven in after the 5th room (or after the last room in shorter houses)
  const diary3 = voice && voice.diary3Ar ? `
  <div class="diary reveal" dir="rtl"><span class="tape" style="background:${R[2]}33"></span>${esc(voice.diary3Ar)}</div>` : '';
  const voiceFor = (cat) => voice
    ? (voice.rooms || []).find((v) => v.catEn && (String(v.catEn).toLowerCase() === String(cat.cat).toLowerCase() || v.catEn === cat.catAr))
    : null;

  const catHtml = cats.map((c, ci) => {
    const i = cafe.menu.indexOf(c);
    const r = roomFor(c);
    const v = voiceFor(c);
    const [artKey] = artFor(c.cat, c.catAr);
    const acc = R[ci % 4], acc2 = R[(ci + 1) % 4];
    const diaryNote = (ci === 1 && diary[0]) ? `
  <div class="diary reveal" dir="rtl"><span class="tape" style="background:${R[1]}33"></span>${esc(diary[0])}</div>` :
      (ci === 3 && diary[1]) ? `
  <div class="diary reveal" dir="rtl"><span class="tape" style="background:${R[3]}33"></span>${esc(diary[1])}</div>` :
      (ci === 4 && diary3) ? diary3 : '';
    // BRAND TRUTH: only the cafe's OWN shots ever render — shared category photos are
    // banned here (they show other cafes' branded products); no shots → tinted SVG art.
    const roomShot = roomShots ? roomShots[ci % roomShots.length] : null;
    const catImg = roomShot
      ? `<img src="${esc('../assets/photos/' + cafe.slug + '/' + roomShot.file)}"${roomShot.hint ? ` style="object-position:${esc(roomShot.hint)}"` : ''} alt="" onload="this.parentElement.classList.add('hasimg')">`
      : shots.length
        ? `<img src="${shotSrc(ci)}" alt="" onload="this.parentElement.classList.add('hasimg')">`
        : '';
    return `${ci > 0 ? (SC ? SC.sepHtml : sepHtml(arch, R)) : ''}
  <section class="cat reveal${ci % 2 === 0 ? ' cat--flip' : ''}" id="cat-${i}" style="--sa:${acc};--sa2:${acc2}">
    <div class="cat-head">
      <div class="cat-art">
        <div class="cat-svg">${ART[artKey](P)}</div>
        ${catImg}
      </div>
      <div class="cat-title">
        ${r ? `<div class="room-eyebrow"><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></div>` : ''}
        <h2 class="room-h2"><span class="ar">${esc(r ? r.titleAr : c.catAr)}</span><span class="en">${esc(r ? r.titleEn : c.cat)}</span></h2>
        <svg class="inkline" viewBox="0 0 120 9" preserveAspectRatio="none" aria-hidden="true"><path pathLength="100" d="M2 6 Q14 2.6 27 4.8 T52 4.2 T78 5.4 T104 4 T118 5.2" fill="none" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
        ${v ? `<p class="room-voice"><span class="ar">${esc(v.introAr)}</span><span class="en">${esc(v.introEn)}</span></p>` : ''}
      </div>
    </div>
    <div class="items">
      ${c.items.map(([en, ar, price, sfda]) => `
      <div class="item">
        <div class="item-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span>
          ${sfda && (sfda.kcal || sfda.caffeine) ? `<span class="sfda"><span class="ar">${sfda.kcal ? esc(String(sfda.kcal)) + ' سعرة' : ''}${sfda.kcal && sfda.caffeine ? ' · ' : ''}${sfda.caffeine ? esc(String(sfda.caffeine)) + ' كافيين' : ''}</span><span class="en">${sfda.kcal ? esc(String(sfda.kcal)) + ' kcal' : ''}${sfda.kcal && sfda.caffeine ? ' · ' : ''}${sfda.caffeine ? esc(String(sfda.caffeine)) + ' caffeine' : ''}</span></span>` : ''}</div>
        <div class="dots"></div>
        <div class="price"><span class="pdot"></span>${price}<span class="sar"> ${SAR}</span></div>
        ${orderChip(en, ar)}
      </div>`).join('')}
    </div>
  </section>${diaryNote}`;
  }).join('') + (cats.length <= 4 ? diary3 : ''); // short houses still get their third diary, after the last room

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
    --text-1:${P.text1};--text-2:${P.text2};--text-3:${P.text3};--ink:${P.text1};--accent:${a};--accent-2:${a2};--accent-soft:${a}22;
    --sa:${R[0]};--sa2:${R[1]};--radius:16px;--shadow:${P.shadow};
    --m-ease:${MO.ease};--m-dir:${MO.revealDir};--tx:1}
  /* RTL MIRROR LAW: --tx flips direction-signed decorative transforms in Arabic */
  [dir="rtl"]{--tx:-1}
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
  .greet{color:var(--accent);font-size:13.5px;font-weight:700;letter-spacing:.14em;margin-bottom:10px}
  .medal{position:relative;width:104px;height:104px;margin:0 auto 16px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff2b,transparent 42%),radial-gradient(circle at 32% 28%,${a}42,${a}14 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 7px ${a}14,0 0 34px ${a}40,inset 0 1px 0 #ffffff33;
    animation:mfloat 5s ease-in-out infinite}
  .medal::after{content:"";position:absolute;inset:6px;border-radius:inherit;border:1px solid ${a}55}
  .medal span{font-size:44px;font-weight:700;color:var(--accent);text-shadow:0 2px 12px ${a}66}
  .medal span .ar{font-family:${T.fonts.ar}}
  .medal span .en{font-family:${T.fonts.en}}
  /* real brand logo inside the medallion (logo.png in the cafe's photo folder) — border+glow stay */
  .medal .logo{width:84%;height:84%;object-fit:contain;border-radius:50%;position:relative;z-index:1}
  .medal.haslogo>span{display:none}
  @keyframes mfloat{50%{transform:translateY(-6px)}}
  h1{font-size:clamp(41px,11.5vw,54px);font-weight:800;letter-spacing:-.02em;line-height:1.08}
  h1 .ar{font-family:${T.fonts.ar}}
  h1 .en{font-family:${T.fonts.en}}
  /* gradient-clip only AFTER word entrance — transformed child spans break background-clip:text in Chrome */
  h1.shimmer{background:linear-gradient(90deg,var(--text-1) 30%,${a} 48%,${a2} 52%,var(--text-1) 70%);background-size:240% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sh 5s .3s infinite}
  @keyframes sh{0%{background-position:130% 0}100%{background-position:-130% 0}}
  h1 .w{display:inline-block;opacity:0;animation:wordin .55s cubic-bezier(.2,1.2,.4,1) forwards}
  @keyframes wordin{0%{opacity:0;transform:translateY(14px) scale(.94)}100%{opacity:1;transform:none}}
  /* EN letters land one by one like ink strokes (AR stays word-level for letter joining) */
  h1 .lw{white-space:nowrap;display:inline-block}
  h1 .lt{display:inline-block;opacity:0;animation:inkin .6s cubic-bezier(.2,1.5,.35,1) forwards}
  @keyframes inkin{0%{opacity:0;transform:translateY(16px) rotate(var(--r,0deg)) scale(.6)}
    60%{opacity:1;transform:translateY(-2px) rotate(calc(var(--r,0deg)*-.4)) scale(1.07)}
    100%{opacity:1;transform:none}}
  .world{margin-top:10px;color:var(--text-2);font-size:14px;font-weight:600;letter-spacing:.08em}
  .world b{color:${R[1]};font-weight:700}
  .heroline{margin-top:10px;color:var(--text-2);font-size:22px;font-weight:600;line-height:1.45}
  .heroline .ar{font-family:${T.fonts.ar}}
  .heroline .en{font-family:${T.fonts.en}}
  .meta{margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .badge{background:var(--accent-soft);border:1px solid ${a}66;color:var(--accent);border-radius:999px;padding:4px 14px;font-size:12px;letter-spacing:.05em}
  @keyframes up{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}

  /* ---- EXPO-OUT ENTRANCE: medallion → title → above-fold cards, 80ms apart ----
     one keyframe (fade + 12px rise), opacity/transform only, zero layout shift;
     below-the-fold cards stay owned by the scroll-reveal system */
  @media (prefers-reduced-motion: no-preference){
    @keyframes expo{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}
    ${['.greet', '.medal', 'h1', '.world', '.heroline', '.brandshots', '.meta', '.chips'].map((sel, i) =>
    `${sel}{animation:expo .6s cubic-bezier(.16,1,.3,1) ${i * 80}ms both${sel === '.medal' ? ',mfloat 5s ease-in-out .8s infinite' : ''}}`).join('\n    ')}
  }

  /* ---- BRAND MOTION DNA: press physics — scale .96 in, overshoot release ---- */
  @media (prefers-reduced-motion: no-preference){
    .touchable{transition:all .2s,transform .32s cubic-bezier(.34,1.56,.64,1)}
    .touchable:active{transform:scale(.96);transition:all .2s,transform .07s cubic-bezier(.2,.6,.4,1)}
  }

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
  .sig-name{font-size:16px;font-weight:700;line-height:1.32}
  .stamp{display:inline-flex;align-items:baseline;gap:3px;margin-top:8px;padding:3px 12px;border:1.7px solid var(--sa);
    border-radius:999px;color:var(--sa);font-weight:800;font-size:16px;transform:rotate(-4deg);
    box-shadow:0 0 0 3px ${a}0f}
  .reveal.in .stamp{animation:pstamp .5s cubic-bezier(.2,1.5,.4,1) both .35s}
  .sig-card::before,.sig-card::after{content:"";position:absolute;top:-8px;width:44px;height:16px;background:${R[1]}40;border-radius:2px;z-index:2}
  .sig-card::before{inset-inline-start:14px;transform:rotate(-8deg)}
  .sig-card::after{inset-inline-end:14px;transform:rotate(6deg)}
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
  .cat-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;filter:saturate(1.08) contrast(1.04)}
  .cat-art.hasimg img{display:block}
  /* designed photo treatment: brand-tint wash (multiply where supported, plain elsewhere) + 1px inner border */
  .cat-art.hasimg::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;
    background:linear-gradient(160deg,var(--sa,${a}),transparent 55%);opacity:.28;mix-blend-mode:multiply}
  /* RTL MIRROR LAW: the tint wash falls from the inline-start corner in both directions */
  [dir="rtl"] .cat-art.hasimg::before{background:linear-gradient(200deg,var(--sa,${a}),transparent 55%)}
  .cat-art.hasimg::after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;
    box-shadow:inset 0 0 0 1px ${a}55}
  .cat-title{flex:1;min-width:0}
  .room-eyebrow{color:var(--text-2);font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4px}
  .room-h2{color:var(--sa);font-size:28px;font-weight:800;line-height:1.14;letter-spacing:-.01em}
  .room-h2 .ar{font-family:${T.fonts.ar}}
  .room-h2 .en{font-family:${T.fonts.en}}
  /* self-drawing ink underline: a hand-wavy SVG stroke that draws itself on reveal */
  .inkline{display:block;width:min(150px,72%);height:9px;margin-top:7px;overflow:visible}
  [dir="rtl"] .inkline{transform:scaleX(-1)} /* the hand draws from the right in Arabic */
  .inkline path{stroke:var(--sa);stroke-dasharray:101;stroke-dashoffset:101;
    transition:stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1) .15s}
  .reveal.in .inkline path{stroke-dashoffset:0}
  /* room-voice: the room leans in and says one line (roomvoice50) — reveals with its section */
  .room-voice{margin-top:7px;font-size:15.5px;font-weight:500;color:var(--text-2);line-height:1.5;
    opacity:0;transform:translateY(6px) rotate(-.5deg);transition:opacity .6s ease .35s,transform .6s ease .35s}
  .reveal.in .room-voice{opacity:1;transform:rotate(-.5deg)}
  .room-voice .ar{font-family:${T.fonts.ar}}
  .room-voice .en{font-family:${T.fonts.en};font-style:italic}
  /* rhythm: even rooms flip their head — the eye zigzags down the house */
  .cat--flip .cat-head{flex-direction:row-reverse}
  /* sep idle drift: dividers breathe softly while the page rests (killed by reduced-motion) */
  .sep,.sep-scene{animation:sepidle 7s ease-in-out infinite}
  @keyframes sepidle{0%,100%{transform:translateX(0);opacity:.82}50%{transform:translateX(calc(6px * var(--tx,1)));opacity:1}}

  .items{position:relative;background:${P.bg1}d9;border:1px solid var(--border-1);border-radius:20px;padding:6px 18px;box-shadow:var(--shadow)}
  .item{display:flex;align-items:baseline;gap:10px;padding:16px 0;border-bottom:1px solid ${P.bg2}99}
  .item:last-child{border-bottom:none}
  .item-name{font-size:18.5px;font-weight:600;line-height:1.32;letter-spacing:-.004em}
  .dots{flex:1;border-bottom:1px dotted var(--border-2);transform:translateY(-4px)}
  .price{color:var(--sa);font-weight:800;font-size:18px;white-space:nowrap;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:6px}
  .pdot{width:6px;height:6px;border-radius:50%;background:var(--sa);opacity:0;transform:scale(0)}
  .reveal.in .pdot{animation:dotpop .45s cubic-bezier(.2,1.6,.4,1) forwards}
  @keyframes dotpop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.5)}100%{opacity:.9;transform:scale(1)}}
  /* scroll reveals arrive on the brand's own ease + direction (motion DNA: ${MO.revealDir}) */
  .reveal{opacity:0;transform:${revealFrom};transition:opacity .55s var(--m-ease),transform .55s var(--m-ease)}
  .reveal.in{opacity:1;transform:none}
  .reveal.in .item{opacity:0;animation:itemin .45s forwards}
  .reveal.in .item:nth-child(1){animation-delay:.05s}.reveal.in .item:nth-child(2){animation-delay:.12s}
  .reveal.in .item:nth-child(3){animation-delay:.19s}.reveal.in .item:nth-child(4){animation-delay:.26s}
  .reveal.in .item:nth-child(5){animation-delay:.33s}.reveal.in .item:nth-child(6){animation-delay:.4s}
  .reveal.in .item:nth-child(n+7){animation-delay:.47s}
  @keyframes itemin{0%{opacity:0;transform:translateX(calc(-8px * var(--tx,1)))}100%{opacity:1;transform:none}}
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

  /* ---- SELLABLE 1: tap-to-order chips (demo state is intentional & premium) ---- */
  .order-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:4px;margin-inline-start:2px;
    background:transparent;border:1.5px solid ${a}88;color:var(--sa);border-radius:999px;padding:3px 11px;
    font-size:11px;font-weight:700;font-family:inherit;line-height:1.4;cursor:pointer;text-decoration:none;
    white-space:nowrap;transition:transform .16s,box-shadow .16s}
  .order-chip:hover{transform:translateY(-1px);box-shadow:0 0 12px ${a}33}
  .order-chip.demo{border-style:dashed;opacity:.8}
  .acttip{position:fixed;z-index:60;max-width:min(330px,86vw);background:${P.bg1}f5;backdrop-filter:blur(10px);
    color:var(--text-1);border:1px solid var(--accent);border-radius:14px;padding:10px 16px;font-size:13px;
    line-height:1.5;text-align:center;box-shadow:0 0 0 4px ${a}14,0 12px 30px ${a}40;
    opacity:0;pointer-events:none;transform:translate(-50%,6px);transition:opacity .25s,transform .25s}
  .acttip.show{opacity:1;transform:translate(-50%,0)}

  /* ---- SELLABLE 2: table-aware QR — waiter bell (?t=N wakes it via JS) ---- */
  .waiter-btn{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:30;display:inline-flex;
    align-items:center;gap:7px;background:${P.bg1}e6;backdrop-filter:blur(10px);border:1.5px solid var(--accent);
    color:var(--accent);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:700;font-family:inherit;
    cursor:pointer;text-decoration:none;box-shadow:0 0 0 4px ${a}12,0 8px 22px ${a}40}
  .waiter-btn[hidden]{display:none}

  /* ---- SELLABLE 4: SFDA calorie layer — honest placeholders, zero invented numbers ---- */
  .sfda{display:block;margin-top:2px;font-size:10.5px;letter-spacing:.05em;color:var(--text-3);font-variant-numeric:tabular-nums}
  .sfda-legend{margin-top:10px;text-align:center;font-size:12px;color:var(--text-3);line-height:1.6}
  .print-note{display:none}
  ${wa ? `.wa{position:fixed;bottom:18px;inset-inline-start:18px;z-index:30;background:#1faa53;color:#fff;border-radius:999px;
    padding:12px 20px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 8px 22px #1faa5366}` : ''}

  /* sky-dial: a small sun/moon that lets the guest set the sky by hand */
  .skydial{position:fixed;bottom:18px;inset-inline-end:16px;z-index:30;width:40px;height:40px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;line-height:1;
    background:${P.bg1}d9;backdrop-filter:blur(10px);border:1px solid var(--border-2);color:var(--accent);
    box-shadow:0 0 0 4px ${a}12,0 6px 16px ${a}33;transition:transform .18s,box-shadow .18s}
  .skydial:hover{transform:translateY(-2px) rotate(12deg);box-shadow:0 0 0 5px ${a}1a,0 8px 20px ${a}44}
  .skydial[aria-pressed="true"]{color:var(--accent-2);border-color:var(--accent)}

  /* ---- big-screen stage (Beyt is designed wide — so are we) ---- */
  .bigmark{display:none;position:fixed;top:4vh;inset-inline-end:-3vw;z-index:0;font-size:48vh;line-height:1;
    color:var(--accent);opacity:.055;pointer-events:none;user-select:none}
  .bigmark .ar{font-family:${T.fonts.ar}}
  .bigmark .en{font-family:${T.fonts.en}}
  @media(min-width:900px){
    .bigmark{display:block}
    .wrap{max-width:780px}
    .hero{min-height:62vh;display:flex;flex-direction:column;justify-content:center;padding:40px 0 14px}
    .medal{width:136px;height:136px}
    .medal span{font-size:58px}
    h1{font-size:clamp(66px,8vw,84px)}
    .world{font-size:15px;margin-top:16px}
    .heroline{font-size:30px;margin-top:14px}
    .room-h2{font-size:42px}
    .room-voice{font-size:18px}
    .inkline{width:min(200px,72%)}
    .inkline path{stroke-width:2.6}
    .cat-art{width:96px;height:96px}
    .items{padding:10px 30px}
    .item{padding:20px 0}
    .item-name{font-size:20px}
    .price{font-size:20px}
    .sig-art{width:96px;height:96px}
    .sig{padding:26px 22px 24px}
    .diary{max-width:480px;font-size:17px}
    .mote{font-size:22px!important}
    .chips{justify-content:center;padding:10px 2px}
  }

  /* ---- architecture pack: ${arch} ---- */
  ${PACKS[arch](P, R)}

  /* ---- immersive scene pack: ${arch} ---- */
  ${SC ? SC.css : ''}
${polish ? `
  /* ---- polish50 bespoke touch: ${polish.name} ---- */
  ${polish.css}` : ''}
${bbg ? `
  /* ---- brandbg50 LIVING BACKGROUND (behind everything; .wrap sits at z-index:1) ---- */
  /* HARD CLIP: brandbg is position:fixed, so body overflow-x:hidden can't clip its bleed —
     the wrapper must clip its own decorative children or dark-mode pages scroll sideways. */
  .brandbg{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;z-index:0!important;pointer-events:none!important;overflow:hidden!important;contain:strict}
  .hero{overflow-x:clip}
  ${bbg.css}` : ''}

  /* ---- SAUDI SOUL (inspiration only): Tarma medallion frame + Sadu woven band ---- */
  ${NAJDI_CSS}
  ${saduBand('var(--accent)', 'var(--ink)')}

  /* ---- INK-CRAFT FINISH: confident brand-INK display type (never foil-transparent) ----
     GODZILLA law #1: ink carries the words; accent only decorates (underline/dots/prices/borders).
     Placed after the scene pack so the gold-foil background-clip:text on headings is neutralised. */
  h1,h1 .ar,h1 .en{background:none!important;background-image:none!important;-webkit-text-fill-color:${P.text1}!important;color:${P.text1}!important}
  h1.shimmer{background:none!important;animation:none!important}
  .heroline,.heroline .ar,.heroline .en{background:none!important;background-image:none!important;-webkit-text-fill-color:${P.mode === 'light' ? P.text1 : P.text2}!important;color:${P.mode === 'light' ? P.text1 : P.text2}!important;animation:none!important;filter:none!important;font-weight:600}
  /* the animated brand mark sits inside the medallion; the plain initial is hidden when it (or a real logo) is present */
  .medal .mark{display:block;width:82%;height:82%}
  .medal.hasmark>span{display:none}
${P.mode === 'light' ? `
  /* light mode only (dark archetypes stay poster-intact): room titles to INK, ink craft on chrome */
  .room-h2,.room-h2 .ar,.room-h2 .en{color:${P.text1};-webkit-text-fill-color:${P.text1}}
  .room-eyebrow{color:${P.text3}}
  .greet{color:${P.deep}!important}
  .world,.world b{color:${P.text2}!important}
  .chip{border:2px solid var(--ink);border-radius:16px 12px 15px 13px;box-shadow:3px 3px 0 var(--ink);color:${P.text1}}
  .chip:hover{color:var(--accent);border-color:var(--ink);box-shadow:4px 5px 0 var(--ink);transform:translateY(-2px)}
  .order-chip{border:2px solid var(--ink);box-shadow:2px 2px 0 var(--ink);color:${P.text1}}
  .order-chip.demo{border-style:dashed}
  .order-chip:hover{box-shadow:3px 3px 0 var(--ink);transform:translateY(-1px)}
  .medal{border:2.5px solid var(--ink);box-shadow:4px 4px 0 var(--ink),inset 0 1px 0 #ffffff55}
  .medal::after{border-color:${P.text1}}
  .items{border:2px solid var(--ink);border-radius:20px 16px 22px 15px;box-shadow:4px 4px 0 var(--ink)}
  .sig{border:2px solid var(--ink);box-shadow:5px 5px 0 var(--ink)}
  .sig-card{border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink)}
  .stamp{border-color:var(--sa);color:var(--sa)}` : ''}

${typePersona(arch)}
  ${brandLogoCss('--lk:var(--ink);--la:var(--accent);--ls:var(--sa);--ls2:var(--sa2);--la2:var(--accent-2);--lp:var(--bg-1)')}
${shots.length ? `
  /* ---- brandshots: the cafe's OWN photos, pinned like polaroids ---- */
  .brandshots{display:flex;justify-content:center;align-items:flex-start;gap:14px;margin-top:22px;position:relative;z-index:1}
  .bshot{position:relative;width:96px;margin:0;background:${P.bg1};border:1px solid var(--border-2);padding:6px 6px 16px;
    box-shadow:4px 5px 0 ${P.deep}30}
  .bshot img{display:block;width:100%;height:84px;object-fit:cover;filter:saturate(1.08) contrast(1.04)}
  /* designed photo treatment on the polaroids: tint wash + 1px inner border */
  .bshot::after{content:"";position:absolute;inset:6px 6px 16px;pointer-events:none;
    background:linear-gradient(160deg,${a}48,transparent 55%);mix-blend-mode:multiply;
    box-shadow:inset 0 0 0 1px ${a}55}
  [dir="rtl"] .bshot::after{background:linear-gradient(200deg,${a}48,transparent 55%)}
  .bshot::before{content:"";position:absolute;top:-9px;left:50%;width:44px;height:16px;background:${R[1]}40;border-radius:2px;
    transform:translateX(-50%) rotate(-3deg);backdrop-filter:blur(1px);z-index:2}
  .bshot:nth-child(1){transform:rotate(-4deg)}
  .bshot:nth-child(2){transform:rotate(2.5deg) translateY(7px)}
  .bshot:nth-child(3){transform:rotate(-1.5deg) translateY(2px)}
  @media(min-width:900px){.bshot{width:132px}.bshot img{height:116px}}` : ''}

  @media (prefers-reduced-motion: reduce){
    *{animation:none!important;transition:none!important}
    .reveal,.reveal.in .item,.heroline,.world,.meta,.greet,h1 .w,h1 .lt,.reveal .room-h2,.reveal .room-eyebrow{opacity:1!important;transform:none!important;filter:none!important}
    .room-voice{opacity:.85!important;transform:none!important}
    .sep,.sep-scene{animation:none!important;transform:none!important}
    .pdot{opacity:.9!important;transform:scale(1)!important}
    .inkline path{stroke-dashoffset:0!important}
    [dir="rtl"] .inkline{transform:scaleX(-1)!important}
    .skydial:hover{transform:none!important}
  }

  /* ---- SELLABLE 3: PRINT-PERFECT MODE — same URL, Cmd+P, one clean A4 paper menu ---- */
  @media print{
    @page{margin:12mm}
    *{animation:none!important;transition:none!important;box-shadow:none!important;text-shadow:none!important;
      backdrop-filter:none!important;filter:none!important}
    html,body{background:#fff!important;background-image:none!important;color:#000!important}
    body::before,body::after{display:none!important}
    .mote,.orb,.scenebg,.skydial,.order-chip,.waiter-btn,.lang-toggle,.wa,.bigmark,.chips,.acttip,.sep,
    .cat-art,.sig-art,.brandshots,.diary,.pdot,.brandbg,.sadu-band,.najdi{display:none!important}
    .wrap{max-width:100%;padding:0}
    .hero{min-height:0!important;padding:0 0 8px!important;display:block!important}
    .greet,.world,.heroline,.meta,h1 .w,h1 .lt,.reveal,.reveal .item,.reveal .room-h2,.reveal .room-eyebrow{opacity:1!important;transform:none!important;filter:none!important}
    h1{color:#000!important;background:none!important;-webkit-text-fill-color:#000!important;font-size:30px!important}
    .medal{width:70px!important;height:70px!important;margin-bottom:8px;border-color:#000!important;background:#fff!important}
    .medal .mark{display:none!important}
    .medal.hasmark>span{display:inline!important}
    .medal span{color:#000!important;font-size:32px!important}
    .medal::after{border-color:#00000055!important}
    .greet,.world,.world b,.heroline{color:#000!important}
    .badge{background:#fff!important;border-color:#000!important;color:#000!important}
    .sig,.items,.sig-card,.demo-note{background:#fff!important;border:1px solid #000!important;color:#000!important;border-radius:8px!important}
    .sig-card::before,.sig-card::after{display:none!important}
    .sig-ribbon,.room-h2,.room-eyebrow{color:#000!important}
    .room-voice{color:#000!important;opacity:1!important;transform:none!important}
    .cat--flip .cat-head{flex-direction:row!important}
    .stamp{border-color:#000!important;color:#000!important;transform:none!important}
    .item{padding:9px 0!important;border-bottom:1px solid #00000026!important}
    .item-name,.footer,.footer a,.sfda,.sfda-legend,.demo-note{color:#000!important}
    .dots{border-bottom-color:#00000080!important}
    .price{color:#000!important}
    .inkline path{stroke:#000!important;stroke-dashoffset:0!important}
    .cat,.sig{break-inside:avoid;margin-top:18px!important}
    .cat-head{margin-bottom:8px!important}
    .print-note{display:block!important;margin-top:16px;text-align:center;font-size:12px;color:#000!important;
      border-top:1px solid #000;padding-top:10px}
  }
</style>
</head>
<body>
${bbg ? bbg.html : ''}
<button class="lang-toggle touchable" id="langToggle">English</button>
<div class="bigmark" aria-hidden="true"><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></div>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    ${motesHtml(brief.motif, sd)}
    ${SC ? SC.heroHtml : ''}
    <div class="greet"><span class="ar">حيّاكم في عالمنا ✦</span><span class="en">Step into our world ✦</span></div>
    ${heroLogo}
    ${blogo ? '' : `<div class="medal${logo ? ' haslogo' : menuMark ? ' hasmark' : ''}">${najdiFrame('var(--ink)')}${logo ? logoImg(logo) : menuMark}<span><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></span></div>`}
    <h1><span class="ar">${esc(cafe.nameAr)}</span><span class="en">${esc(cafe.name)}</span></h1>
    <div class="world"><span class="ar">✦ <b>${esc(brief.world?.ar || '')}</b> ✦</span><span class="en">✦ <b>${esc(brief.world?.en || '')}</b> ✦</span></div>
    <div class="heroline"><span class="ar">${esc(brief.heroAr || cafe.taglineAr)}</span><span class="en">${esc(brief.heroEn || cafe.tagline)}</span></div>
    ${shots.length ? `<div class="brandshots" aria-hidden="true">${shots.slice(0, 3).map((s, i) => `<figure class="bshot"><img src="${shotSrc(i)}" alt="" loading="lazy" onerror="this.parentElement.remove()"></figure>`).join('')}</div>` : ''}
    <div class="meta">
      <span class="badge"><span class="ar">${esc(cafe.areaAr === 'الرياض' ? 'الرياض' : cafe.areaAr + ' · الرياض')}</span><span class="en">${esc(cafe.area === 'Riyadh' ? 'Riyadh' : cafe.area + ' · Riyadh')}</span></span>
      <span class="badge"><span class="ar">متوافق مع اشتراطات هيئة الغذاء والدواء</span><span class="en">SFDA-ready</span></span>
    </div>
    ${polish ? polish.html : ''}
  </header>
  <nav class="chips">${navChips}</nav>
  <div class="sadu-band" aria-hidden="true"></div>
  ${sigHtml}
  ${catHtml}
  <div class="demo-note">
    <span class="ar">هذه نسخة تجريبية أعدّها فريق منيو سادة خصيصاً لكم — الأصناف والأسعار والصور قابلة للتعديل خلال دقائق.</span>
    <span class="en">A demo lovingly prepared by MENU SADAH for you — items, prices & photos update in minutes.</span>
  </div>
  <div class="sfda-legend">
    <span class="ar">خانات السعرات والكافيين جاهزة — تتفعّل ببياناتكم خلال دقائق (متوافق مع اشتراطات هيئة الغذاء والدواء).</span>
    <span class="en">Calorie & caffeine slots are built in — they activate with your data in minutes (SFDA-compliant).</span>
  </div>
  <div class="print-note">
    <span class="ar">📱 النسخة الرقمية الحية: امسحوا كود QR على الطاولة — menu-sadah.com/${esc(cafe.slug)}</span>
    <span class="en">📱 Live digital menu: scan the table QR — menu-sadah.com/${esc(cafe.slug)}</span>
  </div>
  <div class="footer">
    ${footLogo}
    ${cafe.social && /^@/.test(String(cafe.social)) ? `<div style="margin-bottom:6px;color:var(--text-2)"><span class="ar">تابعوا ${esc(cafe.nameAr)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span><span class="en">Follow ${esc(cafe.name)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span></div>` : ''}
    <span class="ar">تجربة من <a href="${CONTACT.site}">منيو سادة — MENU SADAH</a></span>
    <span class="en">Crafted by <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
${wa ? `<a class="wa touchable" href="${wa}"><span class="ar">💬 اطلب منيو مثله</span><span class="en">💬 Get a menu like this</span></a>` : ''}
${cafePhone
    ? `<a class="waiter-btn touchable" id="waiterBtn" href="https://wa.me/${cafePhone}" target="_blank" rel="noopener" hidden>🔔 <span class="ar">نادِ النادل</span><span class="en">Call the waiter</span></a>`
    : `<button class="waiter-btn touchable" id="waiterBtn" type="button" data-tip hidden>🔔 <span class="ar">نادِ النادل</span><span class="en">Call the waiter</span></button>`}
<div class="acttip" id="actTip" role="status" aria-live="polite"><span class="ar">يتفعّل مع رقم واتساب المقهى ✦</span><span class="en">✦ Activates with the cafe's WhatsApp</span></div>
<button class="skydial touchable" id="skyDial" aria-label="تبديل السماء: نهار / ليل — Toggle sky: day / night" aria-pressed="false">☀</button>
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // motion DNA haptic: a soft 8ms tick when a chip snaps you to a room (feature-checked, motion-respecting)
  if(matchMedia('(prefers-reduced-motion: no-preference)').matches){
    document.querySelectorAll('.chips .chip').forEach(c=>c.addEventListener('click',()=>{navigator.vibrate?.(8);}));
  }
  // local-clock greeting: the doorway greets by the visitor's own hour (static text stays without JS)
  (function(){
    const h=new Date().getHours();
    const g=(h>=5&&h<=11)?['صباح الخير يا أهل الذوق','Good morning']
          :(h>=12&&h<=16)?['مساء النور','Good afternoon']
          :(h>=17&&h<=21)?['سهرة طيبة','Good evening']
          :['ليلكم عسل','Sweet night'];
    const el=document.querySelector('.greet');if(!el)return;
    const ar=el.querySelector('.ar'),en=el.querySelector('.en');
    if(ar)ar.textContent=g[0]+' ✦';if(en)en.textContent=g[1]+' ✦';
  })();
  // table-greet JS — TABLE-AWARE QR (?t=N): the doorway greets the table, the waiter bell wakes up
  (function(){
    const q=new URLSearchParams(location.search).get('t');
    const n=q&&/^\\d{1,3}$/.test(q)?parseInt(q,10):0;
    if(!n)return;
    const arN=String(n).replace(/\\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[+d]);
    const g=document.querySelector('.greet');
    if(g){g.classList.add('table-greet');
      const ar=g.querySelector('.ar'),en=g.querySelector('.en');
      if(ar)ar.textContent='طاولة '+arN+' — حياكم ✦';
      if(en)en.textContent='Table '+n+' — welcome ✦';}
    const w=document.getElementById('waiterBtn');
    if(w){w.hidden=false;${cafePhone ? `
      w.href='https://wa.me/${cafePhone}?text='+encodeURIComponent('🔔 طاولة '+n+' تحتاج النادل — '+${JSON.stringify(cafe.nameAr || cafe.name)});` : ''}}
    ${cafePhone ? `document.querySelectorAll('a.order-chip').forEach(c=>{c.href+=encodeURIComponent(' (طاولة '+n+')');});` : ''}
  })();
  // activation tooltip: demo order chips + demo waiter bell sell the WhatsApp activation, honestly
  (function(){
    const tip=document.getElementById('actTip');if(!tip)return;let tmr;
    document.addEventListener('click',(ev)=>{
      const b=ev.target.closest('[data-tip]');if(!b)return;
      const r=b.getBoundingClientRect();
      tip.classList.add('show');
      const half=(tip.offsetWidth/2)||150;
      tip.style.left=Math.min(Math.max(r.left+r.width/2,half+8),innerWidth-half-8)+'px';
      const above=r.top-tip.offsetHeight-10;
      tip.style.top=(above>8?above:r.bottom+10)+'px';
      clearTimeout(tmr);tmr=setTimeout(()=>tip.classList.remove('show'),2600);
    });
  })();
  // hero entrance: AR words glide in whole (letter joining stays intact),
  // EN letters land one by one with a tiny deterministic ink-tilt each
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('h1 .ar').forEach(el=>{
      const words=el.textContent.trim().split(/\\s+/);
      el.innerHTML=words.map((w,i)=>'<span class="w" style="animation-delay:'+(0.35+i*0.12)+'s">'+w+'</span>').join(' ');
    });
    document.querySelectorAll('h1 .en').forEach(el=>{
      let k=0;
      const words=el.textContent.trim().split(/\\s+/);
      el.innerHTML=words.map(w=>'<span class="lw">'+Array.from(w).map(ch=>{
        const r=((((k*13)%9)-4)*0.9).toFixed(1); // deterministic tiny tilt per letter
        const s='<span class="lt" style="--r:'+r+'deg;animation-delay:'+(0.35+k*0.045).toFixed(3)+'s">'+
          ch.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>';
        k++;return s;
      }).join('')+'</span>').join(' ');
    });
    setTimeout(()=>{
      document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{el.textContent=el.textContent;});
    },2400);
  }
  // day -> night: the sky shifts as you walk deeper — or by hand via the sky-dial
  (function(){
    const A=${JSON.stringify(rgbOf(P.bg0))},B=${JSON.stringify(rgbOf(nightHex))};
    let forcedNight=false; // sky-dial override: true = full night, false = scroll-driven
    const lerp=()=>{
      if(forcedNight){document.body.style.backgroundColor='rgb('+B.join(',')+')';return;}
      const m=document.documentElement.scrollHeight-innerHeight;
      const f=m>60?Math.min(1,scrollY/m):0;
      document.body.style.backgroundColor='rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')+')';};
    addEventListener('scroll',lerp,{passive:true});lerp();
    const dial=document.getElementById('skyDial');
    if(dial)dial.addEventListener('click',()=>{
      forcedNight=!forcedNight;
      dial.textContent=forcedNight?'☾':'☀';
      dial.setAttribute('aria-pressed',String(forcedNight));
      lerp();
    });
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
  // per-cafe shots (VISUALS-FIRST law) are the ONLY photos allowed — shared category photos are banned
  // photodirection50: detail cards lead with hero + first strip file; excluded files never render
  const shots = directPhotos(cafe.slug, cafePhotos(cafe.slug), true).shots;
  const logo = cafeLogo(cafe.slug); // real brand logo → medallions (fallback: bespoke logo, animated mark, then initial)
  const blogo = logo ? null : brandLogoEntry(cafe.slug); // BESPOKE Beyt-level animated logo, big above the letter
  const giftMark = (logo || blogo) ? '' : brandMark(cafe, brief, GIFT_MARK_COLORS, 'w'); // hero medallion mark
  const miniMark = logo ? '' : brandMark(cafe, brief, GIFT_MARK_COLORS, 's'); // sticky-bar mini medallion mark
  const giftHeroLogo = blogo ? brandLogoHtml(blogo, cafe.slug, 'big', true) : '';
  const social = extras.social && /^@/.test(String(extras.social).trim()) ? String(extras.social).trim() : null;
  const rooms = (brief.rooms || []).slice(0, 3);
  const diary = (brief.diaryAr || [])[0];
  const waMsg = encodeURIComponent('مرحباً، معكم ' + cafe.name + ' — شفنا المنيو التجريبي وحابين نكمل');
  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000' ? `https://wa.me/${CONTACT.whatsapp}?text=${waMsg}` : null;
  // SELLABLE 5 — THE ROYAL OFFER: wa.me when CONTACT.whatsapp is real, honest demo tooltip otherwise
  const waRoyal = wa ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('مرحباً، معكم ' + cafe.name + ' — نبغى نفعّل التجربة الملكية اليوم 👑')}` : null;
  const initAr = esc((cafe.nameAr || cafe.name).trim()[0]), initEn = esc(cafe.name.trim()[0].toUpperCase());
  // BRAND MOTION DNA: the gift moves on the cafe's own curve too
  const MO = (cafe.theme && cafe.theme.motion) || { ease: 'cubic-bezier(.22,1,.36,1)', revealDir: 'up' };
  const inkframe = `border:2px solid ${ink};border-radius:255px 18px 225px 18px/18px 225px 18px 255px;position:relative`;
  const B = (ar, en) => `<span class="ar">${ar}</span><span class="en">${en}</span>`;
  const bbg = brandbgFor(cafe.slug); // brandbg50: per-cafe living animated background (behind everything)
  // the gift palette uses gift-named vars (--rose/--gold/…); brandbg entries speak the menu's
  // var language (--accent/--sa/--bg-*), so we map them onto the .brandbg wrapper (cascades to
  // its children). No page var is overridden — the shim lives only on the background layer.
  const bbgShim = bbg ? `.brandbg{--accent:${rose};--accent-2:${ochre};--sa:${gold};--sa2:${sage};--bg-0:${paper};--bg-1:${paper2};--bg-2:${card}}` : '';

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${paper}">
<title>🎁 ${esc(cafe.name)} × MENU SADAH</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${T.fonts.q}&family=Caveat:wght@600;700&family=Patrick+Hand&family=Aref+Ruqaa:wght@400;700&display=swap">
<style>
  :root{--ink:${ink};--rose:${rose};--gold:${gold};--ochre:${ochre};--sage:${sage};--paper:${paper};--paper2:${paper2};--card:${card};
    --m-ease:${MO.ease};--m-dir:${MO.revealDir};--tx:1}
  /* RTL MIRROR LAW: --tx flips direction-signed decorative transforms in Arabic */
  [dir="rtl"]{--tx:-1}
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
  /* real brand logo inside the medallions (logo.png in the cafe's photo folder) — inked border stays */
  .medal .logo,.medal-s .logo{width:84%;height:84%;object-fit:contain;border-radius:50%}
  .medal.haslogo>span,.medal-s.haslogo>span{display:none}
  @keyframes pop{0%{opacity:0;transform:scale(.4) rotate(-8deg)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
  @keyframes up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
  h1{font-size:clamp(34px,9vw,54px);line-height:1.18;margin-top:8px;opacity:0;animation:up .8s .7s forwards}
  h1 b{color:var(--rose)}
  h1 .ar{font-family:${T.fonts.ar}}h1 .en{font-family:${T.fonts.en}}
  .world{margin-top:8px;color:var(--ochre);font-size:14px;letter-spacing:.06em;opacity:0;animation:up .8s .95s forwards}
  .heroline,.heroline .ar,.heroline .en{font-size:24px;margin-top:6px;color:var(--ink)!important;-webkit-text-fill-color:var(--ink)!important;background:none!important;opacity:0;animation:up .8s 1.1s forwards}
  .heroline.hand{font-size:clamp(24px,6vw,32px);transform:rotate(-1.2deg)}
  .world,.world b{color:var(--ochre)}
  .cta{display:inline-block;margin-top:20px;background:var(--ink);color:var(--paper);text-decoration:none;font-weight:800;font-size:18px;
    border:2px solid var(--ink);border-radius:16px 8px 16px 8px;padding:15px 34px;box-shadow:4px 4px 0 var(--rose);
    transition:transform .12s;opacity:0;animation:up .8s 1.3s forwards}
  .cta:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--rose)}
  .cta.gold{background:var(--gold);color:var(--ink);box-shadow:4px 4px 0 var(--ink)}
  .rv{opacity:0;transform:translateY(18px);transition:opacity .6s var(--m-ease),transform .6s var(--m-ease)}
  .rv.in{opacity:1;transform:none}
  .sec{margin-top:44px}
  .h2{font-family:Patrick Hand,Caveat,cursive;font-size:clamp(30px,8vw,44px);text-align:center;transform:rotate(-1.5deg);line-height:1.15}
  [data-lang="ar"] .h2{font-family:"Aref Ruqaa",cursive}
  .h2 b{color:var(--rose)}
  .sub{text-align:center;color:var(--ink);opacity:.75;font-size:14.5px;margin-top:6px}
  .letter{${inkframe};background:var(--card);padding:28px 26px;margin-top:40px;box-shadow:5px 5px 0 ${ink}22}
  .letter::after{content:"";position:absolute;inset:5px;border:1.5px dashed ${ink}55;border-radius:inherit;pointer-events:none}
  .salut{font-size:26px;color:var(--ink);margin-bottom:8px;transform:rotate(-1deg)}
  .letter p{margin-bottom:12px;font-size:16px;color:var(--ink)}
  .punch{color:var(--rose);font-weight:800}
  .sigline{font-size:24px;color:var(--ink);margin-top:10px;transform:rotate(-1.5deg)}
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
  .st .ph img{width:100%;height:100%;object-fit:cover;filter:sepia(.12) saturate(1.08) contrast(1.04)}
  /* designed photo treatment: brand-tint wash (multiply where supported, plain elsewhere) + 1px inner border */
  .st .ph.hasimg::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
    background:linear-gradient(160deg,${rose},transparent 55%);opacity:.28;mix-blend-mode:multiply}
  .st .ph.hasimg::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;box-shadow:inset 0 0 0 1px ${ink}40}
  .st .ph .big-init{font-size:64px;font-weight:800;color:${ink}33}
  .st .tag{position:absolute;top:10px;inset-inline-start:12px;background:var(--card);border:2px solid var(--ink);border-radius:999px;
    padding:3px 12px;font-size:11px;font-weight:800;letter-spacing:.1em;transform:rotate(-3deg);z-index:2}
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
  /* ---- royal offer section (founding-20 — a real cap Ibrahim honors, zero fake countdowns) ---- */
  .royal-offer{position:relative;background:var(--card);border:2.5px solid var(--ink);border-radius:26px 12px 26px 12px;
    padding:36px 24px 28px;box-shadow:6px 6px 0 ${gold}88}
  .royal-offer .rbadge{position:absolute;top:-15px;inset-inline-start:22px;background:var(--gold);color:#fff;
    border:2px solid var(--ink);border-radius:999px;padding:6px 16px;font-size:13px;font-weight:800;transform:rotate(-2deg)}
  .rlist{list-style:none;margin-top:18px;display:grid;gap:9px}
  .rlist li{position:relative;padding-inline-start:28px;font-size:15px;font-weight:600}
  .rlist li::before{content:"✦";position:absolute;inset-inline-start:4px;color:var(--gold);font-weight:800}
  .rlist li:first-child{font-weight:800}
  .rlist li:first-child::before{content:"👑";inset-inline-start:0}
  button.cta{font-family:inherit;cursor:pointer}
  .acttip{position:fixed;z-index:60;max-width:min(330px,86vw);background:var(--card);color:var(--ink);
    border:2px solid var(--ink);border-radius:14px 6px 14px 6px;padding:10px 16px;font-size:13.5px;font-weight:600;
    text-align:center;box-shadow:3px 3px 0 var(--ink);opacity:0;pointer-events:none;
    transform:translate(-50%,6px);transition:opacity .25s,transform .25s}
  .acttip.show{opacity:1;transform:translate(-50%,0)}
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
${bbg ? `
  /* ---- brandbg50 LIVING BACKGROUND (behind everything; .wrap sits at z-index:1) ---- */
  .brandbg{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;z-index:0!important;pointer-events:none!important;overflow:hidden!important;contain:strict}
  .hero{overflow-x:clip}
  ${bbgShim}
  ${bbg.css}` : ''}

  /* ---- SAUDI SOUL (inspiration only): Tarma medallion frame + Sadu woven band ---- */
  ${NAJDI_CSS}
  ${saduBand('var(--gold)', 'var(--ink)')}

  /* ---- INK-CRAFT FINISH (gift page): heroline never foil-transparent; medallion holds the mark ----
     the gift page is already ink-crafted (2px ink borders + hard offset shadows on every card/pill),
     so this only neutralises the scene's gold-foil background-clip:text on .heroline + sizes the mark. */
  .heroline,.heroline .ar,.heroline .en{background:none!important;background-image:none!important;-webkit-text-fill-color:var(--rose)!important;color:var(--rose)!important;animation:none!important;filter:none!important}
  .medal .mark,.medal-s .mark{display:block;width:82%;height:82%}
  .medal.hasmark>span,.medal-s.hasmark>span{display:none}

  /* ---- BRAND MOTION DNA: press physics — scale .96 in, overshoot release ---- */
  @media (prefers-reduced-motion: no-preference){
    .touchable{transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
    .touchable:active{transform:scale(.96);transition:transform .07s cubic-bezier(.2,.6,.4,1)}
  }

  /* ---- CINEMA STING: 3 beats under 3s — wax stamp → brand wash parts → letter rises ----
     plays once per session, any tap skips, reduced-motion gets the instant static page */
  .sting-wash{display:none}
  @media (prefers-reduced-motion: no-preference){
    .sting .medal{animation:waxstamp .85s cubic-bezier(.16,1,.3,1) .05s both}
    @keyframes waxstamp{0%{opacity:0;transform:scale(2.2) rotate(-10deg)}55%{opacity:1;transform:scale(.94) rotate(1.5deg)}
      78%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
    .sting .sting-wash{display:block;position:fixed;inset:0;z-index:80;pointer-events:none}
    .sting .sting-wash i{position:absolute;top:0;bottom:0;width:50.5%;background:linear-gradient(180deg,var(--rose),var(--gold));opacity:.97}
    .sting .sting-wash i:first-child{inset-inline-start:0;animation:stpart .95s cubic-bezier(.16,1,.3,1) .5s both}
    .sting .sting-wash i:last-child{inset-inline-end:0;animation:stpart2 .95s cubic-bezier(.16,1,.3,1) .5s both}
    @keyframes stpart{to{transform:translateX(calc(-103% * var(--tx,1)))}}
    @keyframes stpart2{to{transform:translateX(calc(103% * var(--tx,1)))}}
    .sting .letter.rv{opacity:1;transform:none;animation:letterrise .9s cubic-bezier(.16,1,.3,1) 1.7s both}
    @keyframes letterrise{0%{opacity:0;transform:translateY(26px)}100%{opacity:1;transform:none}}
    .sting-done .medal,.sting-done .letter.rv{opacity:1;transform:none;animation:none}
  }
  /* welcome→menu threshold: an 800ms brand-color curtain pulls before we enter the house */
  .curtain{position:fixed;inset:0;z-index:90;background:linear-gradient(160deg,var(--rose),var(--ochre));
    transform:translateY(102%);pointer-events:none}
  .curtain.pull{transition:transform .8s cubic-bezier(.16,1,.3,1);transform:translateY(0)}

  @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}
    .medal,h1,.world,.heroline,.cta,.rv{opacity:1!important;transform:none!important}
    .sting-wash{display:none!important}.curtain{display:none!important}}
  ${brandLogoCss('--lk:var(--ink);--la:var(--rose);--ls:var(--gold);--ls2:var(--sage);--la2:var(--ochre);--lp:var(--paper,#fffdf6)')}
  .brandlogo.big{width:min(210px,58vw);margin:6px auto 10px}
</style>
<script>
  // CINEMA STING gate — decided before first paint: once per session, never for reduced-motion
  try{if(!sessionStorage.getItem('ms-sting:${cafe.slug}')&&matchMedia('(prefers-reduced-motion: no-preference)').matches){
    document.documentElement.classList.add('sting');sessionStorage.setItem('ms-sting:${cafe.slug}','1');}}catch(e){}
</script>
</head>
<body>
${bbg ? bbg.html : ''}
<div class="sting-wash" aria-hidden="true"><i></i><i></i></div>
<div class="curtain" id="msCurtain" aria-hidden="true"></div>
<div class="bigmark" aria-hidden="true"><span class="ar">${initAr}</span><span class="en">${initEn}</span></div>
<header class="top">
  <div class="bx"><div class="medal-s${logo ? ' haslogo' : miniMark ? ' hasmark' : ''}">${logo ? logoImg(logo) : miniMark}<span><span class="ar">${initAr}</span><span class="en">${initEn}</span></span></div>
    <div><div class="bn">${B(esc(cafe.nameAr), esc(cafe.name))}</div><div class="loc">${B(esc(cafe.areaAr) + ' · الرياض', esc(cafe.area) + ' · Riyadh')}</div></div></div>
  <button class="lang touchable" id="langToggle">English</button>
</header>
<div class="wrap">
  <section class="hero">
    ${SC ? SC.heroHtml : ''}
    ${motesHtml(brief.motif, sd)}
    <div class="kick">${B('🎁 هدية من منيو سادة · ليست إعلاناً', '🎁 A gift from Menu Sadah · not an ad')}</div>
    ${giftHeroLogo}
    ${blogo ? '' : `<div class="medal${logo ? ' haslogo' : giftMark ? ' hasmark' : ''}">${najdiFrame('var(--ink)')}${logo ? logoImg(logo) : giftMark}<span><span class="ar">${initAr}</span><span class="en">${initEn}</span></span></div>`}
    <h1>${B('أهلاً ببيت <b>' + esc(cafe.nameAr) + '</b>', 'Welcome home, <b>' + esc(cafe.name) + '</b>.')}</h1>
    <div class="world">${B('✦ ' + esc(brief.world?.ar || '') + ' ✦', '✦ ' + esc(brief.world?.en || '') + ' ✦')}</div>
    <div class="heroline hand">${B(esc(brief.heroAr || ''), esc(brief.heroEn || ''))}</div>
    <div><a class="cta touchable" href="../${cafe.slug}/">${B('افتحوا منيوكم ←', 'Open your menu →')}</a></div>
    <div class="sadu-band" aria-hidden="true" style="max-width:280px;margin-inline:auto"></div>
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

  <!-- royal offer section — SELLABLE 5: founding-20 scarcity is REAL (Ibrahim honors the cap; no countdown timers, ever) -->
  <div class="sec royal-offer rv">
    <div class="rbadge">${B('👑 العرض الملكي', '👑 The Founding Offer')}</div>
    <div class="h2">${B('العرض <b>الملكي</b> ✦', 'The <b>Founding</b> Offer ✦')}</div>
    <div class="sub">${B('أول ٢٠ مقهى مؤسس في الرياض — والقائمة تقف عند ٢٠، كلمة من إبراهيم. بدون عدّادات، بدون استعجال مصطنع.', "The first 20 founding cafés of Riyadh — the list closes at 20, Ibrahim's word. No countdown clocks, no fake urgency.")}</div>
    <ul class="rlist">
      <li>${B('شهر مجاني كامل → بعدها ٤٩$ شهرياً', 'One full month free → then $49/mo')}</li>
      <li>${B('تعديلات بلا حدود', 'Unlimited edits')}</li>
      <li>${B('أزرار طلب واتساب', 'WhatsApp order buttons')}</li>
      <li>${B('QR لكل طاولة', 'A QR code for every table')}</li>
      <li>${B('نسخة طباعة A4', 'A4 print edition')}</li>
      <li>${B('خانات السعرات والكافيين (SFDA)', 'SFDA calorie & caffeine slots')}</li>
      <li>${B('تقرير زيارات شهري', 'Monthly visits report')}</li>
      <li>${B('أولوية دعم بنفس اليوم', 'Same-day priority support')}</li>
    </ul>
    <div style="text-align:center;margin-top:22px">${waRoyal
      ? `<a class="cta gold touchable" href="${waRoyal}">${B('فعّلوا تجربتكم الملكية — بنفس اليوم', 'Activate your royal experience — same day')}</a>`
      : `<button class="cta gold touchable" type="button" data-tip>${B('فعّلوا تجربتكم الملكية — بنفس اليوم', 'Activate your royal experience — same day')}</button>`}</div>
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
      sig ? { t: '01', bAr: 'توقيعكم يفتتح المنيو، <i>مثل ما يستاهل.</i>', bEn: 'Your signature opens the menu, <i>as it should.</i>', pAr: '«' + esc(sig[1]) + '» أول ما يشوفه الضيف — بختم سعر مرسوم باليد.', pEn: '«' + esc(sig[0]) + '» is the first thing a guest sees — with a hand-drawn price stamp.' } : { t: '01', bAr: 'منيو مبني غرفة غرفة، <i>مو قائمة وبس.</i>', bEn: 'A menu built room by room, <i>not just a list.</i>', pAr: 'كل قسم غرفة من عالمكم، بعنوان يحكي قصتكم.', pEn: 'Every section is a room of your world, titled with your story.' },
      { t: '02', bAr: 'عالمكم: <i>«' + esc(brief.world?.ar || '') + '»</i>', bEn: 'Your world: <i>"' + esc(brief.world?.en || '') + '"</i>', pAr: rooms.length ? 'غرف المنيو: ' + rooms.map((r) => '«' + esc(r.titleAr) + '»').join('، ') + ' — والبقية داخل.' : 'كل صفحة تتنفس هالعالم — ألوان وخطوط وحركة.', pEn: rooms.length ? 'The rooms: ' + rooms.map((r) => '"' + esc(r.titleEn) + '"').join(', ') + ' — the rest is inside.' : 'Every page breathes this world — color, type and motion.' },
      { t: '03', bAr: 'الصفحة تعيش، <i>من الصبح لليل.</i>', bEn: 'The page is alive, <i>from morning to night.</i>', pAr: 'ألوانها بألوانكم، وتغمق مع الليل وأنتم تقلبون فيها — عربي وإنجليزي بضغطة.', pEn: 'It wears your colors and darkens into night as guests scroll — Arabic and English in one tap.' },
    ].map((d, di) => `
    <div class="st rv">
      <div class="ph"><span class="big-init">${initEn}</span>${shots.length ? `<img src="${esc('../assets/photos/' + cafe.slug + '/' + shots[di % shots.length].file)}" alt="" onload="this.parentElement.classList.add('hasimg')" onerror="this.remove()" loading="lazy">` : ''}<span class="tag">${B('تفصيلة ' + d.t, 'Detail ' + d.t)}</span></div>
      <div class="bd"><b>${B(d.bAr, d.bEn)}</b><p>${B(d.pAr, d.pEn)}</p></div>
    </div>`).join('')}
    <div style="text-align:center;margin-top:22px"><a class="cta gold touchable" href="../${cafe.slug}/">${B('شوفوا منيوكم حيّاً ←', 'See your menu live →')}</a></div>
  </div>

  <div class="sec rv">
    <div class="h2">${B('كل شيء <b>جاهز</b> لكم', 'Everything is <b>ready</b> for you')}</div>
    <div class="agrid">
      <a class="atile touchable" href="../${cafe.slug}/"><div class="ic">📱</div><b>${B('المنيو الحي', 'Live menu')}</b><span class="go">${B('افتحوه ←', 'Open →')}</span></a>
      <div class="atile"><div class="ic">🖨</div><b>${B('كود QR للطاولات', 'Table QR codes')}</b><span class="go">${B('كود خاص لكل طاولة (١–١٢) والمنيو يرحّب بها باسمها — نطبعها يوم التفعيل', 'A personal code per table (1–12), the menu greets each by name — printed on activation')}</span></div>
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
    <div style="margin-top:14px"><a class="cta touchable" href="${wa || '../' + cafe.slug + '/'}">${wa ? B('💬 نفعّله اليوم', '💬 Switch it on today') : B('🎁 افتحوا هديتكم', '🎁 Open your gift')}</a></div>
    <p style="margin-top:16px;font-size:13px">${B('شاهدوا عميلنا الحي: <a href="' + CONTACT.site + '/beyt-coffee" style="color:var(--rose);font-weight:700">بيت كوفي ↗</a>', 'See a live client: <a href="' + CONTACT.site + '/beyt-coffee" style="color:var(--rose);font-weight:700">Beyt Coffee ↗</a>')}</p>
  </div>
  <div class="foot">${B('منيو سادة · منيوهات جميلة لبيوت نحبها — <a href="' + CONTACT.site + '">menu-sadah.com</a>', 'MENU SADAH · beautiful menus for houses we admire — <a href="' + CONTACT.site + '">menu-sadah.com</a>')}</div>
</div>
<div class="acttip" id="actTip" role="status" aria-live="polite"><span class="ar">يتفعّل مع رقم واتساب منيو سادة ✦ رد على رسالتنا ونمشي</span><span class="en">✦ Activates over MENU SADAH's WhatsApp — reply to our message and we roll</span></div>
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
  // activation tooltip — the royal CTA's demo state sells honestly instead of dead-linking
  (function(){
    const tip=document.getElementById('actTip');if(!tip)return;let tmr;
    document.addEventListener('click',(ev)=>{
      const b=ev.target.closest('[data-tip]');if(!b)return;
      const r=b.getBoundingClientRect();
      tip.classList.add('show');
      const half=(tip.offsetWidth/2)||150;
      tip.style.left=Math.min(Math.max(r.left+r.width/2,half+8),innerWidth-half-8)+'px';
      const above=r.top-tip.offsetHeight-10;
      tip.style.top=(above>8?above:r.bottom+10)+'px';
      clearTimeout(tmr);tmr=setTimeout(()=>tip.classList.remove('show'),2600);
    });
  })();
  // CINEMA STING control: any tap skips instantly; at 3s the page locks to its static self
  (function(){
    if(!root.classList.contains('sting'))return;
    const done=()=>{root.classList.remove('sting');root.classList.add('sting-done');};
    addEventListener('pointerdown',done,{once:true});
    setTimeout(done,3000);
  })();
  // welcome→menu threshold: 800ms brand-color curtain, then the guest enters the house
  (function(){
    const cur=document.getElementById('msCurtain');
    if(!cur||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let going=false;
    document.querySelectorAll('a[href="../${cafe.slug}/"]').forEach(a=>a.addEventListener('click',(e)=>{
      if(going)return;going=true;e.preventDefault();
      navigator.vibrate?.(10);
      cur.classList.add('pull');
      setTimeout(()=>{location.href=a.getAttribute('href');},800);
    }));
  })();
</script>
</body>
</html>`;
}

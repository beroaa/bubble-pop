// Generate a per-brand gift doc for every menu from gift-template.html.
// Usage: node menus/_kit/gen-gifts.mjs   (writes menus/<slug>/gift.html for all)
import { readFileSync, writeFileSync, existsSync } from 'fs';
const ROOT = '/home/user/bubble-pop/menus';
const tpl = readFileSync(`${ROOT}/_kit/gift-template.html`, 'utf8');

// Per-brand tokens: BG / INK / ACCENT / ACCENT2 tuned for gift-doc contrast.
const T = {
  'three-coffee':    { CAFE:'Three Coffee', CAFE_AR:'ثري كافيه', BG:'#171009', INK:'#F3EADC', ACCENT:'#C68A4B', ACCENT2:'#E2B47F' },
  'maqha-noon':      { CAFE:'Noon',      CAFE_AR:'نون',        BG:'#0E3B2E', INK:'#F2ECDF', ACCENT:'#C9A24B', ACCENT2:'#E0C079' },
  'blueprint-roasters':{ CAFE:'Blueprint', CAFE_AR:'بلوبرنت',  BG:'#0B1622', INK:'#EAF2F4', ACCENT:'#4FD1E0', ACCENT2:'#9BE7F0' },
  'terra-cafe':      { CAFE:'Terra',     CAFE_AR:'تيرا',       BG:'#F6EFE4', INK:'#23201B', ACCENT:'#D8542C', ACCENT2:'#2FA6A0' },
  'kuthban':         { CAFE:'Kuthban',   CAFE_AR:'كثبان',      BG:'#EDE0CC', INK:'#2E2115', ACCENT:'#A85E33', ACCENT2:'#7A5230' },
  'marsa':           { CAFE:'Marsa',     CAFE_AR:'مرسى',       BG:'#0E4B54', INK:'#EDE3CF', ACCENT:'#D9B15E', ACCENT2:'#E2C58A' },
  'layl':            { CAFE:'Layl',      CAFE_AR:'ليل',        BG:'#10182E', INK:'#C9D2E0', ACCENT:'#C6A0C8', ACCENT2:'#E0C8E2' },
  'hessa':           { CAFE:'Hessa',     CAFE_AR:'حصة',        BG:'#14110E', INK:'#F2ECDF', ACCENT:'#CBA24A', ACCENT2:'#3E9A72' },
  'sabah-cafe':      { CAFE:'Sabah',     CAFE_AR:'صباح',       BG:'#FBF3E8', INK:'#3A2E28', ACCENT:'#C56B3E', ACCENT2:'#4E96AC' },
  'mono-coffee':     { CAFE:'Mono',      CAFE_AR:'مونو',       BG:'#F4F4F1', INK:'#141414', ACCENT:'#E23A2E', ACCENT2:'#141414' },
  'attar':           { CAFE:'Attar',     CAFE_AR:'عطر',        BG:'#F6EEE6', INK:'#6E2233', ACCENT:'#B0566E', ACCENT2:'#C9A24B' },
  'barq':            { CAFE:'Barq',      CAFE_AR:'برق',        BG:'#17181A', INK:'#F4F4F4', ACCENT:'#B8E62E', ACCENT2:'#E4FF8A' },
  'obsidian-coffee': { CAFE:'Obsidian',  CAFE_AR:'أوبسيديان',  BG:'#0C0D10', INK:'#C3C8D0', ACCENT:'#6FA5B8', ACCENT2:'#B98FC4' },
  'hamdha':          { CAFE:'Hamdha',    CAFE_AR:'حمضة',       BG:'#FCFBF7', INK:'#2A2A24', ACCENT:'#E07A16', ACCENT2:'#3E8E5A' },
  'falak':           { CAFE:'Falak',     CAFE_AR:'فلك',        BG:'#141A3C', INK:'#E8E3F0', ACCENT:'#E2C067', ACCENT2:'#C58AC0' },
};

let n = 0;
for (const [slug, t] of Object.entries(T)) {
  if (!existsSync(`${ROOT}/${slug}/index.html`)) { console.log(`skip ${slug} (no menu)`); continue; }
  let html = tpl
    .replaceAll('{{CAFE_AR}}', t.CAFE_AR)   // must precede {{CAFE}}
    .replaceAll('{{CAFE}}', t.CAFE)
    .replaceAll('{{SLUG}}', slug)
    .replaceAll('{{ACCENT2}}', t.ACCENT2)   // must precede {{ACCENT}}
    .replaceAll('{{ACCENT}}', t.ACCENT)
    .replaceAll('{{INK}}', t.INK)
    .replaceAll('{{BG}}', t.BG);
  writeFileSync(`${ROOT}/${slug}/gift.html`, html);
  n++;
}
console.log(`generated ${n} gift docs`);

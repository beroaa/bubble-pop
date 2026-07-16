// Export the menu catalog as a ClientOS (Mac app) import payload.
// The Mac app is the user's primary workstation; this container can't write to
// it directly — this file IS the bridge. Regenerate on every delivery cycle:
//   node menus/_kit/export-clientos.mjs   ->  menus/clientos-import.json
import { readFileSync, writeFileSync, existsSync } from 'fs';
const ROOT = '/home/user/bubble-pop/menus';
const cat = JSON.parse(readFileSync(`${ROOT}/index.json`, 'utf8'));

const has = (s, f) => existsSync(`${ROOT}/${s}/${f}`);

const cafes = cat.menus.map(m => ({
  slug: m.slug,
  name: m.name,
  name_ar: m.name_ar,
  city: m.city,
  stage: m.slug === 'some-coffee' ? 'Replied' : 'To do',       // pipeline stage hint
  menu_built: has(m.slug, 'index.html'),
  menu_live: !!m.live,                                          // live at menu-sadah.com
  gift_ready: has(m.slug, 'gift.html'),
  pack_complete: !!m.pack_complete,
  links: {
    menu: `https://menu-sadah.com/${m.slug}`,
    gift: `https://menu-sadah.com/${m.slug}/gift.html`,
  },
  concept: m.concept || '',
  accent: m.accent || '',
  status_note: m.note || m.status || '',
  next_action: m.slug === 'some-coffee'
    ? 'REPLIED on IG — deploy rebuilt menu, then send reply.md text with menu + gift links'
    : (m.live ? 'Send gift DM' : 'Deploy pack to menu-sadah.com, then send gift DM'),
  source_files: `menus/${m.slug}/ (index.html, gift.html, qr, table-card, handover)`,
}));

const payload = {
  _type: 'clientos-import',
  _version: 1,
  _generated_by: 'Menu Sadah cloud build session',
  _import_instructions: [
    'For the ClientOS Mac app / its Claude session:',
    '1. For each cafe in `cafes`: upsert a card by `slug` (create if missing, update if exists).',
    '2. Map `stage` to the pipeline column (To do / DM sent / Replied / Meeting / Signed / Shelved) — NEVER move a card backwards (if the app already has it further along, keep the app stage).',
    '3. Show MENU LIVE badge only when `menu_live` is true; show gift badge when `gift_ready`.',
    '4. Wire the Deal Maker / "Send their menu" button to `links.gift` (gift first), with `links.menu` as the secondary link.',
    '5. Keep the app authoritative for scores/XP — this import never overwrites app-side scoring.',
    '6. `next_action` is a suggestion for the card checklist.',
  ],
  updated: cat.updated,
  count: cafes.length,
  cafes,
};

writeFileSync(`${ROOT}/clientos-import.json`, JSON.stringify(payload, null, 2) + '\n');
console.log(`clientos-import.json: ${cafes.length} cafes exported`);

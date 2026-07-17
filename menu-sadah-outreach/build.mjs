// MENU SADAH demo-page generator (batch #1).
// Usage: node build.mjs  ->  writes dist/<slug>/index.html, dist/<slug>-welcome/index.html, dist/index.html
// Page templates live in lib/pages.mjs (shared with singularity/engine.mjs).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CAFES } from './cafes.mjs';
import { menuPage, welcomePage, indexPage } from './lib/pages.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

mkdirSync(DIST, { recursive: true });
for (const cafe of CAFES) {
  mkdirSync(join(DIST, cafe.slug), { recursive: true });
  mkdirSync(join(DIST, `${cafe.slug}-welcome`), { recursive: true });
  writeFileSync(join(DIST, cafe.slug, 'index.html'), menuPage(cafe));
  writeFileSync(join(DIST, `${cafe.slug}-welcome`, 'index.html'), welcomePage(cafe));
}
writeFileSync(join(DIST, 'index.html'), indexPage(CAFES));
console.log(`Built ${CAFES.length} demo menus + ${CAFES.length} welcome pages + HQ index -> dist/`);

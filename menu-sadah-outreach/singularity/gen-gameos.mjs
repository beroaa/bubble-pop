// Builds gameos.html (the MENUS game module) from the template + queue.json.
// Usage: node gen-gameos.mjs [outPath]
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = dirname(fileURLToPath(import.meta.url));
const queue = JSON.parse(readFileSync(join(DIR, 'queue.json'), 'utf8'));
const slim = queue.map((c) => ({ slug: c.slug, name: c.name, nameAr: c.nameAr || '', area: c.area || 'Riyadh',
  type: c.type, stage: c.stage, tier: c.tier || 'standard',
  signature: c.signature && c.signature.length ? [[c.signature[0][0], c.signature[0][1]]] : undefined,
  sigMention: c.sigMention || undefined, social: c.social || undefined, chainFlag: c.chainFlag || undefined }));
const tpl = readFileSync(join(DIR, 'gameos-template.html'), 'utf8');
const out = process.argv[2] || join(DIR, 'gameos.html');
writeFileSync(out, tpl.replace('__DATA__', JSON.stringify(slim)));
console.log('gameos.html built:', slim.length, 'cafes,', Math.round(tpl.length / 1024) + 'KB template');

// Build compact per-cafe design briefs for the bespoke-logo swarm.
// Merges purple50 slugs + briefs50 identities + queue signature dishes.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const purple = JSON.parse(readFileSync(join(HERE, 'purple50.json'), 'utf8'));
const briefs = JSON.parse(readFileSync(join(HERE, 'briefs50.json'), 'utf8'));
const queue = JSON.parse(readFileSync(join(HERE, 'queue.json'), 'utf8'));
const qlist = Array.isArray(queue) ? queue : (queue.cafes || queue.queue || []);
const byslug = Object.fromEntries(qlist.map((c) => [c.slug, c]));

const out = {};
for (const slug of purple) {
  const b = briefs[slug] || {};
  const q = byslug[slug] || {};
  const sig = (q.signature || []).slice(0, 4).map((s) => (Array.isArray(s) ? s[0] : s)).filter(Boolean);
  out[slug] = {
    slug,
    name: q.name || slug,
    nameAr: q.nameAr || '',
    type: q.type || 'specialty_coffee',
    personality: b.personality || '',
    worldEn: (b.world && b.world.en) || '',
    worldAr: (b.world && b.world.ar) || '',
    heroEn: b.heroEn || q.tagline || '',
    archetype: b.archetype || '',
    motif: b.motif || '',
    signature: sig,
    themeLabel: q.themeLabel || '',
  };
}
writeFileSync(join(HERE, '..', 'scratchpad-logo-briefs.json'), JSON.stringify(out, null, 1));
console.log('wrote', Object.keys(out).length, 'artist briefs');
console.log(JSON.stringify(out[purple[0]], null, 1));

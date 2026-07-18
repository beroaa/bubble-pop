// Merge swarm field-agent results into queue.json. Evidence-only enforced here too:
// prices re-validated 5-300, unknown slugs rejected, nothing overwritten with weaker data.
// Usage: node merge-swarm.mjs <results1.json> [results2.json ...]
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const QUEUE = join(DIR, 'queue.json');
const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
const bySlug = new Map(queue.map((c) => [c.slug, c]));

let applied = 0, sigs = 0, mentions = 0, photos = 0, socials = 0, rejected = [];
for (const file of process.argv.slice(2)) {
  const results = JSON.parse(readFileSync(file, 'utf8'));
  for (const r of Array.isArray(results) ? results : results.results || []) {
    const c = bySlug.get(r.slug);
    if (!c) { rejected.push(`${r.slug}: unknown slug`); continue; }
    if (!r.found) continue;
    if (!r.source) { rejected.push(`${r.slug}: found=true but no source`); continue; }
    let touched = false;
    if (Array.isArray(r.signature) && r.signature.length && !(c.signature && c.signature.length)) {
      const clean = r.signature.filter((it) => Array.isArray(it) && it.length === 3
        && typeof it[0] === 'string' && it[0] && typeof it[1] === 'string' && it[1]
        && Number.isInteger(it[2]) && it[2] >= 5 && it[2] <= 300).slice(0, 4);
      if (clean.length) { c.signature = clean; c.sigSource = r.source; sigs++; touched = true; }
      else rejected.push(`${r.slug}: signature items failed validation`);
    }
    if (Array.isArray(r.sigMention) && r.sigMention.length >= 2 && !c.sigMention && !(c.signature && c.signature.length)) {
      c.sigMention = [String(r.sigMention[0]), String(r.sigMention[1])]; c.sigSource = c.sigSource || r.source; mentions++; touched = true;
    }
    if (Array.isArray(r.photoLeads) && r.photoLeads.length) {
      c.photoLeads = [...new Set([...(c.photoLeads || []), ...r.photoLeads.filter((u) => /^https?:\/\//.test(u))])].slice(0, 5);
      photos++; touched = true;
    }
    if (r.social && /^@[\w.]{2,}$/.test(r.social.trim()) && !c.social) { c.social = r.social.trim(); socials++; touched = true; }
    if (touched) { c.stage = 'BUILD'; applied++; }
  }
}
writeFileSync(QUEUE, JSON.stringify(queue, null, 1));
console.log(`applied to ${applied} cafes: +${sigs} priced signatures, +${mentions} mentions, +${photos} photo-lead sets, +${socials} socials`);
if (rejected.length) console.log('rejected:\n  ' + rejected.join('\n  '));

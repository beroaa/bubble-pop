// 🚑 MEDIC — health checks + backups for the SINGULARITY system.
//   node medic.mjs           full checkup + fresh backup
//   node medic.mjs check     checkup only
//   node medic.mjs backup    snapshot queue/learnings/state into backups/
//   node medic.mjs restore   restore the newest backup (asks nothing — files are small)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');
const BACKUPS = join(HERE, 'backups');
const VITALS = ['queue.json', 'learnings.json', 'tracker-state.js', 'state.js'];

function check() {
  const issues = [];
  let queue = [];
  try { queue = JSON.parse(readFileSync(join(HERE, 'queue.json'), 'utf8')); }
  catch (e) { issues.push('queue.json does not parse: ' + e.message); }
  const slugs = new Set();
  for (const c of queue) {
    if (slugs.has(c.slug)) issues.push('duplicate slug: ' + c.slug);
    slugs.add(c.slug);
    if (['READY', 'SENT', 'REPLIED', 'SIGNED'].includes(c.stage)) {
      if (!existsSync(join(DIST, c.slug, 'index.html'))) issues.push(c.slug + ' is ' + c.stage + ' but menu file missing');
      if (!existsSync(join(DIST, c.slug + '-welcome', 'index.html'))) issues.push(c.slug + ' welcome page missing');
    }
  }
  try {
    const L = JSON.parse(readFileSync(join(HERE, 'learnings.json'), 'utf8'));
    if (!Array.isArray(L.lessons)) issues.push('learnings.json malformed');
  } catch (e) { issues.push('learnings.json does not parse: ' + e.message); }
  const hq = readFileSync(join(HERE, 'hq.html'), 'utf8');
  const seedCount = (hq.match(/^\s{2}\[/gm) || []).length;
  if (Math.abs(seedCount - queue.length) > 2) issues.push(`hq.html seed (${seedCount}) out of sync with queue (${queue.length})`);
  const counts = {};
  for (const c of queue) counts[c.stage] = (counts[c.stage] || 0) + 1;
  console.log(`🚑 MEDIC checkup: ${queue.length} cafes ·`, JSON.stringify(counts));
  if (issues.length) { console.log('⚠️ ISSUES:'); issues.forEach((i) => console.log('  -', i)); }
  else console.log('✅ All vitals healthy.');
  return issues;
}

function backup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = join(BACKUPS, 'backup-' + stamp);
  mkdirSync(dir, { recursive: true });
  for (const f of VITALS) if (existsSync(join(HERE, f))) copyFileSync(join(HERE, f), join(dir, f));
  const all = readdirSync(BACKUPS).filter((d) => d.startsWith('backup-')).sort();
  while (all.length > 10) rmSync(join(BACKUPS, all.shift()), { recursive: true, force: true });
  console.log('💾 Backup saved:', dir, `(keeping last ${Math.min(all.length + 1, 10)})`);
  return dir;
}

function restore() {
  const all = existsSync(BACKUPS) ? readdirSync(BACKUPS).filter((d) => d.startsWith('backup-')).sort() : [];
  if (!all.length) { console.log('No backups found.'); return; }
  const dir = join(BACKUPS, all.at(-1));
  for (const f of VITALS) if (existsSync(join(dir, f))) copyFileSync(join(dir, f), join(HERE, f));
  console.log('♻️ Restored from', dir, '— run `node engine.mjs build` to regenerate pages.');
}

const cmd = process.argv[2];
if (cmd === 'check') check();
else if (cmd === 'backup') backup();
else if (cmd === 'restore') restore();
else { const issues = check(); backup(); if (issues.length) process.exitCode = 1; }

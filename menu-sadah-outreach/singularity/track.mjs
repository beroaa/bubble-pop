// Build-tracker updater. Easy mode:
//   node track.mjs list
//   node track.mjs set <id> <pct> [etaMinutes]   e.g. node track.mjs set research 80 4
//   node track.mjs done <id>
//   node track.mjs add "<name>" [etaMinutes]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = join(dirname(fileURLToPath(import.meta.url)), 'tracker-state.js');

function load() {
  if (!existsSync(FILE)) return { generatedAt: 0, tasks: [] };
  const txt = readFileSync(FILE, 'utf8');
  return JSON.parse(txt.slice(txt.indexOf('=') + 1).replace(/;\s*$/, ''));
}
function save(st) {
  st.generatedAt = Date.now();
  writeFileSync(FILE, 'window.TRACKER_STATE = ' + JSON.stringify(st, null, 1) + ';\n');
}

const [cmd, id, a, b] = process.argv.slice(2);
const st = load();
const find = () => {
  const t = st.tasks.find((t) => t.id === id);
  if (!t) throw new Error(`no task "${id}" — ids: ${st.tasks.map((t) => t.id).join(', ')}`);
  return t;
};

if (cmd === 'list') {
  for (const t of st.tasks) console.log(`${t.status === 'done' ? '✅' : '⚙️'} ${t.id.padEnd(12)} ${t.pct || 0}% ${t.name}`);
} else if (cmd === 'set') {
  const t = find();
  t.status = 'running';
  t.pct = Number(a) || 0;
  if (b != null) t.etaAt = Date.now() + Number(b) * 60000;
  save(st);
  console.log(`${id} → ${t.pct}%${b != null ? `, eta ${b}min` : ''}`);
} else if (cmd === 'done') {
  const t = find();
  t.status = 'done';
  t.pct = 100;
  t.etaAt = null;
  save(st);
  console.log(`${id} → DONE`);
} else if (cmd === 'add') {
  const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
  st.tasks.push({ id: slug, name: id, status: 'running', pct: 0, etaAt: a ? Date.now() + Number(a) * 60000 : null });
  save(st);
  console.log(`added "${id}" as ${slug}`);
} else {
  console.log('usage: list | set <id> <pct> [etaMin] | done <id> | add "<name>" [etaMin]');
}

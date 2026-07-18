// Per-build tracker. Usage:
//   node btrack.mjs new "<name>" [etaMinutes] [note]   -> prints build id
//   node btrack.mjs set <id> <pct> [etaMinutes] [note]
//   node btrack.mjs done <id> "<result>"
//   node btrack.mjs list
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const FILE = join(dirname(fileURLToPath(import.meta.url)), 'builds-state.js');
const load = () => existsSync(FILE)
  ? JSON.parse(readFileSync(FILE, 'utf8').replace(/^window\.BUILDS_STATE = /, '').replace(/;\s*$/, ''))
  : { generatedAt: 0, builds: [] };
const save = (st) => { st.generatedAt = Date.now(); writeFileSync(FILE, 'window.BUILDS_STATE = ' + JSON.stringify(st, null, 1) + ';\n'); };
const [cmd, a, b, c, d] = process.argv.slice(2);
const st = load();
if (cmd === 'new') {
  const id = 'b' + (st.builds.length + 1);
  st.builds.push({ id, name: a, status: 'running', pct: 0, etaAt: b ? Date.now() + Number(b) * 60000 : null, note: c || '', startedAt: Date.now() });
  save(st); console.log(id);
} else if (cmd === 'set') {
  const bl = st.builds.find(x => x.id === a); if (!bl) throw new Error('no build ' + a);
  bl.pct = Number(b) || 0; if (c != null) bl.etaAt = Date.now() + Number(c) * 60000; if (d) bl.note = d;
  bl.status = 'running'; save(st); console.log(a, '→', bl.pct + '%');
} else if (cmd === 'done') {
  const bl = st.builds.find(x => x.id === a); if (!bl) throw new Error('no build ' + a);
  bl.status = 'done'; bl.pct = 100; bl.etaAt = null; bl.result = b || 'complete'; save(st); console.log(a, 'DONE');
} else if (cmd === 'list') {
  st.builds.forEach(x => console.log(`${x.id} ${x.status.padEnd(8)} ${x.pct}% ${x.name}`));
} else console.log('usage: new|set|done|list');

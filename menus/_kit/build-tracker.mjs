// Regenerate the live tracker from menus/index.json (single source of truth).
// The tracker is DATA-driven: this only recomputes the DATA block and splices it
// into the template, so counts/cells always reflect reality. Self-updating.
// Usage: node menus/_kit/build-tracker.mjs [path-to-tracker.html]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';

const ROOT = '/home/user/bubble-pop/menus';
const TPL = process.argv[2] || '/tmp/claude-0/-home-user-bubble-pop/d2857db0-00b4-52f9-aafd-17d6fd81c80b/scratchpad/tracker.html';
const TARGET = 100;

const cat = JSON.parse(readFileSync(`${ROOT}/index.json`, 'utf8'));
const menus = cat.menus || [];
const bySlug = new Map(menus.map(m => [m.slug, m]));

const onDisk = readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '_kit' && existsSync(`${ROOT}/${d.name}/index.html`))
  .map(d => d.name);

const stateOf = s => {
  const m = bySlug.get(s);
  if (!m) return 'building';                                  // on disk, not catalogued yet
  if (m.live || m.status === 'delivered') return 'delivered';
  if (m.status === 'verified') return 'verified';
  return 'building';
};

const order = [...menus.map(m => m.slug), ...onDisk.filter(s => !bySlug.has(s))];
const status = {}, names = {};
order.forEach((s, i) => { status[i] = stateOf(s); names[i] = (bySlug.get(s) || {}).name || s; });

const verified = Object.values(status).filter(x => x === 'verified' || x === 'delivered').length;
const building = Object.values(status).filter(x => x === 'building').length;
const live = menus.filter(m => m.live).length;

const DATA = { verified, building, live, target: TARGET, updated: new Date().toISOString(), status, names };

const A = '// <<<DATA-START>>>', B = '// <<<DATA-END>>>';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const block = `${A}\nconst DATA=${JSON.stringify(DATA)};\n${B}`;
let html = readFileSync(TPL, 'utf8');
if (!html.includes(A)) { console.error('template missing DATA markers'); process.exit(1); }
html = html.replace(new RegExp(esc(A) + '[\\s\\S]*?' + esc(B)), block);
writeFileSync(TPL, html);

console.log(JSON.stringify({ verified, building, live, total: order.length }));

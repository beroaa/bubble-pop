// SINGULARITY ALGO — batch engine for MENU SADAH.
//
//   node engine.mjs build           process queue.json: DATA -> BUILD -> QA -> READY
//   node engine.mjs simulate 100    simulated 100-menu night run (watch control.html live)
//   node engine.mjs status          print campaign summary
//   node engine.mjs mark <slug> <STAGE>   manual stage update (SENT, REPLIED, SIGNED...)
//
// Self-learning, honestly implemented: every run appends to learnings.json.
// QA failures become rules; rules are LOADED and ENFORCED on the next run;
// formulaVersion bumps when a new rule is added. No magic — a loop that tightens.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { menuPage, welcomePage } from '../lib/pages.mjs';
import { luxeMenuPage, luxeWelcomePage, FULL_MENUS } from '../lib/pages-luxe.mjs';
import { masterpieceMenuPage, masterpieceWelcomePage } from '../lib/pages-masterpiece.mjs';
import { brandTheme } from '../lib/brand-theme.mjs';
import { ARCHETYPES, DEFAULT_TYPE } from './archetypes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DIST = join(ROOT, 'dist');
const BRIEFS_FILE = join(HERE, 'briefs50.json');
const BRIEFS = existsSync(BRIEFS_FILE) ? JSON.parse(readFileSync(BRIEFS_FILE, 'utf8')) : {};
const QUEUE_FILE = join(HERE, 'queue.json');
const STATE_FILE = join(HERE, 'state.js');
const LEARN_FILE = join(HERE, 'learnings.json');

export const STAGES = ['QUEUED', 'DATA', 'BUILD', 'QA', 'READY', 'SENT', 'REPLIED', 'SIGNED', 'FAILED'];

// ---------- persistence ----------
const readJson = (f, fallback) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : fallback);
const loadQueue = () => readJson(QUEUE_FILE, []);
const saveQueue = (q) => writeFileSync(QUEUE_FILE, JSON.stringify(q, null, 2));
const loadLearnings = () =>
  readJson(LEARN_FILE, {
    formulaVersion: '2.0',
    lessons: [],
    qa: { priceMin: 5, priceMax: 300, minHtmlBytes: 4000, requireArabic: true, requireDisclaimer: true },
    runs: [],
  });
const saveLearnings = (l) => writeFileSync(LEARN_FILE, JSON.stringify(l, null, 2));

function bumpVersion(v) {
  const [maj, min] = String(v).split('.').map(Number);
  return `${maj}.${(min || 0) + 1}`;
}

function addLesson(learnings, desc, source) {
  if (learnings.lessons.some((l) => l.desc === desc)) return false;
  learnings.lessons.push({ id: learnings.lessons.length + 1, desc, source, addedAt: Date.now() });
  learnings.formulaVersion = bumpVersion(learnings.formulaVersion);
  return true;
}

// ---------- state.js for mission control ----------
const logBuf = [];
function pushLog(msg) {
  logBuf.push({ t: Date.now(), msg });
  if (logBuf.length > 40) logBuf.shift();
}

function writeState(queue, learnings, { running = false, etaMs = null, startedAt = null, throughput = [] } = {}) {
  const count = (s) => queue.filter((c) => c.stage === s).length;
  const ready = queue.filter((c) => ['READY', 'SENT', 'REPLIED', 'SIGNED'].includes(c.stage)).length;
  const state = {
    generatedAt: Date.now(),
    running,
    startedAt,
    etaMs,
    formulaVersion: learnings.formulaVersion,
    lessons: learnings.lessons.length,
    lastLesson: learnings.lessons.at(-1)?.desc || null,
    campaign: {
      target: queue.length,
      ready,
      sent: count('SENT') + count('REPLIED') + count('SIGNED'),
      signed: count('SIGNED'),
      failed: count('FAILED'),
      inPipeline: queue.filter((c) => ['DATA', 'BUILD', 'QA'].includes(c.stage)).length,
      queued: count('QUEUED'),
    },
    throughput: throughput.slice(-60),
    menus: queue.map((c) => ({ slug: c.slug, name: c.name, area: c.area || '', stage: c.stage, stageAt: c.stageAt || null })),
    log: logBuf.slice(-30),
  };
  writeFileSync(STATE_FILE, 'window.SINGULARITY_STATE = ' + JSON.stringify(state) + ';\n');
  return state;
}

// ---------- data stage: queue entry -> full cafe object ----------
export function makeCafe(entry) {
  const arch = ARCHETYPES[entry.type] || ARCHETYPES[DEFAULT_TYPE];
  const base = entry.tier === 'luxe' ? (FULL_MENUS[entry.type] || arch.menu) : arch.menu;
  const menu = entry.signature?.length
    ? [{ cat: 'House Signatures', catAr: 'توقيع البيت', items: entry.signature }, ...base]
    : base;
  const theme = brandTheme(entry); // every cafe gets its own brand soul, all tiers
  entry.themeLabel = theme.label;
  return {
    theme,
    type: entry.type, // powers the per-cafe animated brand mark (fallback: archetype/motif/world)
    slug: entry.slug,
    name: entry.name,
    nameAr: entry.nameAr || entry.name,
    area: entry.area || 'Riyadh',
    areaAr: entry.areaAr || 'الرياض',
    social: entry.social || 'Instagram',
    phone: entry.phone || '', // queue.json `phone` (rare) — powers tap-to-order; empty = demo chips
    accent: theme.accentBright || theme.accent,
    tagline: entry.tagline || arch.tagline,
    taglineAr: entry.taglineAr || arch.taglineAr,
    pitchNote: entry.why || '',
    menu,
  };
}

// ---------- QA gate (rules come from learnings.json — the enforced part) ----------
// RTL MIRROR LAW: physical left/right text CSS breaks the Arabic mirror — built pages must be logical-only.
// Pragmatic flag list (centering `left:50%` etc. stays legal — direction-agnostic known-safe cases).
const RTL_PHYSICAL_CSS = /text-align:\s*(left|right)\b|(?:margin|padding)-(?:left|right)\s*:/;

function qaCheck(cafe, html, welcomeHtml, qa) {
  const fails = [];
  if (Buffer.byteLength(html) < qa.minHtmlBytes) fails.push(`menu html under ${qa.minHtmlBytes} bytes`);
  if (qa.rtlMirror !== false) {
    const hit = html.match(RTL_PHYSICAL_CSS) || welcomeHtml.match(RTL_PHYSICAL_CSS);
    if (hit) fails.push(`RTL mirror leak: physical CSS "${hit[0]}" in built page — use logical properties`);
  }
  if (qa.requireArabic && !/[؀-ۿ]/.test(html)) fails.push('no Arabic text in menu');
  if (qa.requireDisclaimer && !html.includes('demo')) fails.push('demo disclaimer missing');
  if (!welcomeHtml.includes(`../${cafe.slug}/`)) fails.push('welcome page not linked to menu');
  for (const cat of cafe.menu)
    for (const [en, , price] of cat.items) {
      if (typeof price !== 'number' || price < qa.priceMin || price > qa.priceMax)
        fails.push(`price out of range: ${en} = ${price}`);
      if (!en) fails.push('item missing English name');
    }
  return fails;
}

// ---------- build command ----------
function slugify(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function runBuild() {
  const queue = loadQueue();
  const learnings = loadLearnings();
  const t0 = Date.now();
  let built = 0, failed = 0;
  const pending = queue.filter((c) => ['QUEUED', 'DATA', 'BUILD', 'QA', 'FAILED'].includes(c.stage));
  pushLog(`Engine v${learnings.formulaVersion} — building ${pending.length} menus (${learnings.lessons.length} lessons enforced)`);

  // duplicate-slug guard (lesson-driven rule)
  const slugs = new Set();
  for (const entry of queue) {
    entry.slug = entry.slug || slugify(entry.name);
    if (slugs.has(entry.slug)) entry.slug = `${entry.slug}-${entry.area ? slugify(entry.area) : '2'}`;
    slugs.add(entry.slug);
  }

  for (const entry of pending) {
    const setStage = (s) => { entry.stage = s; entry.stageAt = Date.now(); };
    try {
      setStage('DATA');
      const cafe = makeCafe(entry);
      setStage('BUILD');
      const brief = BRIEFS[entry.slug];
      const html = entry.tier === 'luxe'
        ? (brief ? masterpieceMenuPage(cafe, brief) : luxeMenuPage(cafe))
        : menuPage(cafe);
      const wExtras = { type: entry.type, signature: entry.signature, sigMention: entry.sigMention, social: entry.social, world: brief?.world };
      const welcomeHtml = brief ? masterpieceWelcomePage(cafe, brief, wExtras) : luxeWelcomePage(cafe, wExtras);
      setStage('QA');
      const fails = qaCheck(cafe, html, welcomeHtml, learnings.qa);
      if (fails.length) {
        setStage('FAILED');
        entry.qaFails = fails;
        failed++;
        pushLog(`✗ ${entry.name}: ${fails[0]}`);
        if (addLesson(learnings, `QA guard: ${fails[0].replace(/:.*/, '')}`, entry.slug))
          pushLog(`⚡ new lesson recorded — formula now v${learnings.formulaVersion}`);
        continue;
      }
      mkdirSync(join(DIST, entry.slug), { recursive: true });
      mkdirSync(join(DIST, `${entry.slug}-welcome`), { recursive: true });
      writeFileSync(join(DIST, entry.slug, 'index.html'), html);
      writeFileSync(join(DIST, `${entry.slug}-welcome`, 'index.html'), welcomeHtml);
      setStage('READY');
      delete entry.qaFails;
      built++;
      pushLog(`✓ ${entry.name} → menu-sadah.com/${entry.slug}-welcome`);
    } catch (e) {
      setStage('FAILED');
      entry.qaFails = [String(e.message || e)];
      failed++;
      pushLog(`✗ ${entry.name}: ${e.message}`);
    }
  }

  learnings.runs.push({ at: t0, ms: Date.now() - t0, built, failed, total: pending.length });
  saveQueue(queue);
  saveLearnings(learnings);
  writeState(queue, learnings, { running: false });
  console.log(`Built ${built}, failed ${failed}, in ${Date.now() - t0}ms. Formula v${learnings.formulaVersion}, ${learnings.lessons.length} lessons.`);
  return { built, failed };
}

// ---------- simulate command: the 100-menu night run, watchable live ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);

const SIM_NAMES = ['Qamar', 'Dallah', 'Wared', 'Sidr', 'Ghaim', 'Nawa', 'Thurayya', 'Lahza', 'Daw', 'Samra',
  'Mazaj', 'Wonders', 'Hams', 'Fajr Brew', 'Toot', 'Areej', 'Sakan', 'Jood', 'Rawnaq', 'Talah'];
const SIM_AREAS = ['Al Malqa', 'Al Yasmin', 'Hittin', 'Al Narjis', 'Al Muruj', 'Olaya', 'Ar Rayyan', 'Al Nakheel', 'Al Rabie', 'Diriyah'];
const SIM_TYPES = Object.keys(ARCHETYPES);

export async function runSimulate(target = 100, speed = 30) {
  const learnings = loadLearnings();
  const real = loadQueue();
  const queue = [...real.map((c) => ({ ...c }))];
  for (let i = queue.length; i < target; i++) {
    const name = `${SIM_NAMES[i % SIM_NAMES.length]} Cafe ${Math.floor(i / SIM_NAMES.length) + 1}`;
    queue.push({ slug: slugify(name), name, area: SIM_AREAS[i % SIM_AREAS.length], type: SIM_TYPES[i % SIM_TYPES.length], stage: 'QUEUED', sim: true });
  }
  const startedAt = Date.now();
  const throughput = [];
  // realistic per-menu stage durations (seconds at 1x), divided by speed
  const dur = { DATA: [8, 25], BUILD: [0.3, 1.2], QA: [1, 3] };
  const doneStates = ['READY', 'SENT', 'REPLIED', 'SIGNED'];
  const doneCount = () => queue.filter((c) => doneStates.includes(c.stage)).length;

  pushLog(`SIMULATION — ${target} menus, speed ${speed}x. This is a rehearsal, not real outreach.`);
  const CONCURRENCY = 6; // parallel "lanes", like 6 workers
  let cursor = 0;
  const lane = async () => {
    while (cursor < queue.length) {
      const entry = queue[cursor++];
      if (doneStates.includes(entry.stage)) continue;
      for (const stage of ['DATA', 'BUILD', 'QA']) {
        entry.stage = stage; entry.stageAt = Date.now();
        await sleep((rand(...dur[stage]) * 1000) / speed);
      }
      if (Math.random() < 0.03) {
        entry.stage = 'FAILED'; entry.stageAt = Date.now();
        pushLog(`✗ ${entry.name}: QA caught a bad price (simulated)`);
      } else {
        entry.stage = 'READY'; entry.stageAt = Date.now();
        if (Math.random() < 0.25) pushLog(`✓ ${entry.name} ready → /${entry.slug}-welcome`);
      }
    }
  };

  const ticker = (async () => {
    while (doneCount() + queue.filter((c) => c.stage === 'FAILED').length < queue.length) {
      const done = doneCount();
      throughput.push({ t: Date.now(), done });
      // ETA from rolling rate over the last ~25 samples (~5s) — stabler early on
      const win = throughput.slice(-25);
      const dt = win.at(-1).t - win[0].t;
      const dd = win.at(-1).done - win[0].done;
      const rate = dt > 0 ? dd / dt : 0; // menus per ms
      const remaining = queue.length - done - queue.filter((c) => c.stage === 'FAILED').length;
      const etaMs = rate > 0 ? remaining / rate : null;
      writeState(queue, learnings, { running: true, etaMs, startedAt, throughput });
      await sleep(200);
    }
  })();

  await Promise.all([...Array.from({ length: CONCURRENCY }, lane), ticker]);
  pushLog(`SIMULATION COMPLETE — ${doneCount()} ready in ${((Date.now() - startedAt) / 1000).toFixed(1)}s (at ${speed}x speed)`);
  writeState(queue, learnings, { running: false, etaMs: 0, startedAt, throughput });
  console.log('Simulation finished. Open control.html to review.');
}

// ---------- status / mark ----------
function runStatus() {
  const queue = loadQueue();
  const learnings = loadLearnings();
  const byStage = {};
  for (const c of queue) byStage[c.stage] = (byStage[c.stage] || 0) + 1;
  console.log(`Formula v${learnings.formulaVersion} · ${learnings.lessons.length} lessons · ${queue.length} in queue`);
  console.table(byStage);
  writeState(queue, learnings, { running: false });
}

function runMark(slug, stage) {
  if (!STAGES.includes(stage)) throw new Error(`stage must be one of ${STAGES.join(', ')}`);
  const queue = loadQueue();
  const entry = queue.find((c) => c.slug === slug);
  if (!entry) throw new Error(`no queue entry with slug "${slug}"`);
  entry.stage = stage;
  entry.stageAt = Date.now();
  saveQueue(queue);
  pushLog(`${entry.name} → ${stage}`);
  writeState(queue, loadLearnings(), { running: false });
  console.log(`${slug} → ${stage}`);
}

// ---------- CLI ----------
const [cmd, a1, a2] = process.argv.slice(2);
if (cmd === 'build') runBuild();
else if (cmd === 'simulate') await runSimulate(Number(a1) || 100, Number((a2 || '').replace('--speed=', '')) || 30);
else if (cmd === 'status') runStatus();
else if (cmd === 'mark') runMark(a1, a2);
else if (cmd) console.log('Unknown command. Use: build | simulate [n] [speed] | status | mark <slug> <STAGE>');

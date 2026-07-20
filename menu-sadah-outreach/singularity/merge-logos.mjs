// Validate + merge the bespoke-logo swarm output into brandlogo50.json.
// Input: scratchpad raw file = array of {slug, concept, css, svg}.
// Only entries that pass EVERY guard survive; the rest fall back to the
// engine's generic animated mark, so a broken logo never ships.
//
// Contract the artists must honour:
//   * colors ONLY via the logo vars: var(--lk) var(--la) var(--ls) var(--ls2) var(--la2) var(--lp)
//   * every css selector scoped with the token UID (e.g. `.UID .roof{...}`, `@keyframes UID_fly{...}`)
//   * svg references those same UID classes; one <svg> root with a viewBox
//   * no raw hex, no url(), no <script>, no position:fixed, no global/element selectors
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = process.argv[2] || join(HERE, '..', 'scratchpad-logo-raw.json');
const OUT = join(HERE, 'brandlogo50.json');

const RTL_PHYSICAL = /text-align:\s*(left|right)\b|(?:margin|padding)-(?:left|right)\s*:/i;

function balanced(svg, tag) {
  const open = (svg.match(new RegExp('<' + tag + '(?=[\\s/>])', 'g')) || []).length;
  const close = (svg.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  const self = (svg.match(new RegExp('<' + tag + '\\b[^>]*/>', 'g')) || []).length;
  return open - self === close; // self-closing tags need no closer
}

function validCss(css) {
  if (css.length > 4200) return 'css too long';
  if (RTL_PHYSICAL.test(css)) return 'physical left/right css (breaks RTL gate)';
  if (/[#]|url\(|@import|<|javascript:|position\s*:\s*fixed|:root|expression\(/i.test(css)) return 'forbidden token (hex/url/tag/fixed)';
  // every rule selector must be scoped with UID (or be a keyframe step / at-rule)
  const chunks = css.split('}');
  for (const ch of chunks) {
    const head = ch.split('{')[0];
    if (!head || !head.trim()) continue;
    // drop keyframe step selectors like "0%","from","to","50%,100%"
    const sel = head.trim();
    if (/^@keyframes\s+UID/i.test(sel)) continue;
    if (/^@media/i.test(sel)) continue;
    if (/^(from|to|[\d.]+%)(\s*,\s*(from|to|[\d.]+%))*$/i.test(sel)) continue;
    if (!/UID/.test(sel)) return 'unscoped selector: ' + sel.slice(0, 40);
  }
  return null;
}

function validSvg(svg) {
  if (svg.length > 4600) return 'svg too long';
  if (!/^<svg[\s>]/.test(svg.trim())) return 'not an <svg> root';
  if ((svg.match(/<svg/g) || []).length !== 1) return 'must be exactly one svg';
  if (!/viewBox\s*=/.test(svg)) return 'no viewBox';
  if (/<script|url\(|javascript:|<foreignObject/i.test(svg)) return 'forbidden svg content';
  if (/[#][0-9a-fA-F]{3,8}\b/.test(svg)) return 'raw hex color (must use var(--l*))';
  if (!/var\(--l[a-z0-9]/.test(svg) && !/class=["'][^"']*UID/.test(svg)) return 'no UID class / logo var used';
  for (const t of ['g', 'style']) if (!balanced(svg, t)) return 'unbalanced <' + t + '>';
  if (/<style/i.test(svg)) return 'inline <style> not allowed (css goes in css field)';
  return null;
}

const defence = (s) => String(s || '').replace(/^\s*```[a-z]*\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

const raw = existsSync(RAW) ? JSON.parse(readFileSync(RAW, 'utf8')) : [];
const items = Array.isArray(raw) ? raw : Object.values(raw);
const merged = {};
const rejects = [];
for (const it of items) {
  if (!it || !it.slug || typeof it.css !== 'string' || typeof it.svg !== 'string') { rejects.push([it && it.slug, 'missing fields']); continue; }
  it.css = defence(it.css); it.svg = defence(it.svg);
  const ce = validCss(it.css); if (ce) { rejects.push([it.slug, ce]); continue; }
  const se = validSvg(it.svg); if (se) { rejects.push([it.slug, se]); continue; }
  merged[it.slug] = { concept: String(it.concept || '').slice(0, 160), css: it.css.trim(), svg: it.svg.trim() };
}

writeFileSync(OUT, JSON.stringify(merged, null, 1));
console.log('MERGED', Object.keys(merged).length, '/ ' + items.length + ' logos ->', OUT);
if (rejects.length) { console.log('REJECTED', rejects.length + ':'); rejects.forEach((r) => console.log('  -', r[0], '::', r[1])); }

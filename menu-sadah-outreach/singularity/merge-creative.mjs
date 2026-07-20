// Validate + merge the creative-director swarm output.
// Input: raw array [{slug, logo:{concept,css,svg}, bg:{emotion,rationale,css,html}}].
// Updates brandlogo50.json + brandbg50.json IN PLACE — a cafe keeps its previous logo/bg
// whenever the new part fails validation, so a bad redesign never regresses a good page.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = process.argv[2] || join(HERE, '..', 'scratchpad-creative-raw.json');
const LOGO_OUT = join(HERE, 'brandlogo50.json');
const BG_OUT = join(HERE, 'brandbg50.json');

const RTL_PHYSICAL = /text-align:\s*(left|right)\b|(?:margin|padding)-(?:left|right)\s*:/i;
const unescapeHtml = (s) => String(s || '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'").replace(/&apos;/g, "'").replace(/&#x2F;/gi, '/').replace(/&amp;/g, '&');
const defence = (s) => unescapeHtml(String(s || '').replace(/^\s*```[a-z]*\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim());
const balanced = (svg, tag) => {
  const open = (svg.match(new RegExp('<' + tag + '(?=[\\s/>])', 'g')) || []).length;
  const close = (svg.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  const self = (svg.match(new RegExp('<' + tag + '\\b[^>]*/>', 'g')) || []).length;
  return open - self === close;
};

function validLogo(logo) {
  if (!logo || typeof logo.css !== 'string' || typeof logo.svg !== 'string') return 'missing fields';
  const css = defence(logo.css), svg = defence(logo.svg);
  if (css.length > 4600) return 'css too long';
  if (RTL_PHYSICAL.test(css)) return 'physical left/right css';
  if (/[#]|url\(|@import|<|javascript:|position\s*:\s*fixed|:root|expression\(/i.test(css)) return 'forbidden css token';
  for (const ch of css.split('}')) {
    const sel = (ch.split('{')[0] || '').trim();
    if (!sel) continue;
    if (/^@keyframes\s+UID/i.test(sel) || /^@media/i.test(sel)) continue;
    if (/^(from|to|[\d.]+%)(\s*,\s*(from|to|[\d.]+%))*$/i.test(sel)) continue;
    if (!/UID/.test(sel)) return 'unscoped selector';
  }
  if (svg.length > 5000) return 'svg too long';
  if (!/^<svg[\s>]/.test(svg.trim())) return 'not svg root';
  if ((svg.match(/<svg/g) || []).length !== 1) return 'multiple svg';
  if (!/viewBox\s*=/.test(svg)) return 'no viewBox';
  if (/<script|url\(|javascript:|<foreignObject|<style/i.test(svg)) return 'forbidden svg content';
  if (/[#][0-9a-fA-F]{3,8}\b/.test(svg)) return 'raw hex in svg';
  if (!balanced(svg, 'g')) return 'unbalanced g';
  logo.css = css; logo.svg = svg;
  return null;
}

function validBg(bg) {
  if (!bg || typeof bg.css !== 'string' || typeof bg.html !== 'string') return 'missing fields';
  const css = defence(bg.css), html = defence(bg.html);
  if (css.length > 2900) return 'css too long';
  if (html.length > 1100) return 'html too long';
  if (/<script|javascript:|url\(\s*["']?https?:|@import|expression\(/i.test(css + html)) return 'forbidden token';
  if (!/\.brandbg/.test(css)) return 'no .brandbg selector';
  if (!/^<div\s[^>]*class=["'][^"']*brandbg/.test(html.trim()) && !/^<div\s+class=["']brandbg/.test(html.trim())) return 'html must be a .brandbg div';
  if (!balanced(html, 'div')) return 'unbalanced div';
  bg.css = css; bg.html = html;
  return null;
}

const raw = existsSync(RAW) ? JSON.parse(readFileSync(RAW, 'utf8')) : [];
const items = Array.isArray(raw) ? raw : Object.values(raw);
const logos = existsSync(LOGO_OUT) ? JSON.parse(readFileSync(LOGO_OUT, 'utf8')) : {};
const bgs = existsSync(BG_OUT) ? JSON.parse(readFileSync(BG_OUT, 'utf8')) : {};

let logoOk = 0, logoKeep = 0, bgOk = 0, bgKeep = 0;
const rej = [];
for (const it of items) {
  if (!it || !it.slug) continue;
  const le = validLogo(it.logo);
  if (!le) { logos[it.slug] = { concept: String(it.logo.concept || '').slice(0, 160), css: it.logo.css, svg: it.logo.svg }; logoOk++; }
  else { logoKeep++; rej.push([it.slug, 'logo', le]); }
  const be = validBg(it.bg);
  if (!be) { bgs[it.slug] = { emotion: String(it.bg.emotion || '').slice(0, 60), rationale: String(it.bg.rationale || '').slice(0, 200), css: it.bg.css, html: it.bg.html }; bgOk++; }
  else { bgKeep++; rej.push([it.slug, 'bg', be]); }
}

writeFileSync(LOGO_OUT, JSON.stringify(logos, null, 1));
writeFileSync(BG_OUT, JSON.stringify(bgs, null, 1));
console.log(`LOGOS: ${logoOk} new, ${logoKeep} kept-old | BACKGROUNDS: ${bgOk} new, ${bgKeep} kept-old (of ${items.length})`);
if (rej.length) { console.log('kept-old reasons:'); rej.forEach((r) => console.log('  -', r[0], r[1], '::', r[2])); }

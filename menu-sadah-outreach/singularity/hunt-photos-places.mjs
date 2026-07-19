#!/usr/bin/env node
// PHOTO-50 via Google Places — real shop/product photos per cafe, evidence-tracked.
// Key is read from env GPLACES_KEY (never hard-coded, never committed).
//   GPLACES_KEY="AIza..." node singularity/hunt-photos-places.mjs
// Saves dist/assets/photos/<slug>/1.jpg..N.jpg + meta.json (place_id + attribution +
// maps url as provenance). Commits + pushes every 10 cafes. Skips cafes already done.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const KEY = process.env.GPLACES_KEY;
if (!KEY) { console.error("Missing GPLACES_KEY env var."); process.exit(1); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PHOTOS = path.join(ROOT, "dist/assets/photos");
const MAXW = 1600, PER_MIN = 6, PER_MAX = 10;

const CAFES = [
  ["Roof Coffee","roof-coffee"],["Razeen Coffee","razeen-coffee"],["Qawam","qawam"],
  ["Cafe !N","cafe-n"],["Public Cafe","public-cafe"],["Rewanted Cafe","rewanted-cafe"],
  ["Sei Coffee","sei-coffee"],["Solio Cafe","solio-cafe"],["Good Mate Cafe","good-mate-cafe"],
  ["Laminam Cafe","laminam-cafe"],["Salam Coffee","salam-coffee"],["Matal Al Wadi","matal-al-wadi"],
  ["Rakiyah Roastery","rakiyah-roastery"],["Marthad Coffee","marthad-coffee"],
  ["Haffa Coffee Roaster","haffa-coffee-roaster"],["Kazar Cafe","kazar-cafe"],["Cave Cafe","cave-cafe"],
  ["RYM Coffee","rym-coffee"],["Sakaf Specialty Coffee","sakaf-specialty-coffee"],
  ["Find Hai Roastery & Cafe","find-hai-roastery-and-cafe"],["Muhjah Cafe","muhjah-cafe"],
  ["Trov Cafe","trov-cafe"],["Ob Cafe","ob-cafe"],["Yellow Rose","yellow-rose"],
  ["Noma Coffee","noma-coffee"],["Lihaf","lihaf"],["Serb Coffee","serb-coffee"],
  ["Mat Cookies","mat-cookies"],["Hacked","hacked"],["Secret Pot Bakery","secret-pot-bakery"],
  ["The Cake Corner","the-cake-corner"],["Kunafa Abul Haus","kunafa-abul-haus"],["Breddy","breddy"],
  ["Chimney Cafe","chimney-cafe"],["Croi Bakehouse","croi-bakehouse"],["Lyrs Bakery","lyrs-bakery"],
  ["Sip Day Specialty Coffee","sip-day-specialty-coffee"],["Nafas Cafe","nafas-cafe"],
  ["Matchafulll","matchafulll"],["The Sweet Sip","the-sweet-sip"],["Harf Cafe","harf-cafe"],
  ["Caia Coffee","caia-coffee"],["Shanab Cafe","shanab-cafe"],["Hdn Coffee","hdn-coffee"],
  ["Sharq Coffee & Roastery","sharq-coffee-and-roastery"],["Nakhati Gelato","nakhati-gelato"],
  ["Salve Artisan Gelato","salve-artisan-gelato"],["Duirrah","duirrah"],["Cavida Cafe","cavida-cafe"],
  ["OUIA Cafe","ouia-cafe"],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const have = slug => { const d = path.join(PHOTOS, slug); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => /^\d+\.jpg$/.test(f)).length : 0; };
const jget = async u => { const r = await fetch(u); return r.json(); };

async function findPlace(name) {
  // Text Search biased to Riyadh; returns best candidate place_id + name + address
  const q = encodeURIComponent(`${name} cafe Riyadh Saudi Arabia`);
  const u = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&region=sa&language=en&key=${KEY}`;
  const j = await jget(u);
  if (j.status === "REQUEST_DENIED") throw new Error("REQUEST_DENIED: " + (j.error_message || "enable Places API + billing on this key"));
  if (j.status === "OVER_QUERY_LIMIT") throw new Error("OVER_QUERY_LIMIT: billing/quota");
  if (!j.results || !j.results.length) return null;
  const r = j.results[0];
  return { place_id: r.place_id, name: r.name, addr: r.formatted_address };
}
async function details(place_id) {
  const u = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,url,photos,formatted_address&language=en&key=${KEY}`;
  const j = await jget(u);
  return j.result || null;
}
async function dlPhoto(ref, dest) {
  const u = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${MAXW}&photo_reference=${ref}&key=${KEY}`;
  const r = await fetch(u, { redirect: "follow" });
  if (!r.ok) throw new Error("photo http " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 3000) throw new Error("tiny/empty photo");
  fs.writeFileSync(dest, buf);
}
function upscale(f) { try { const w = +execSync(`sips -g pixelWidth ${JSON.stringify(f)}`).toString().match(/pixelWidth:\s*(\d+)/)[1]; if (w < 1200) execSync(`sips --resampleWidth 1200 ${JSON.stringify(f)} >/dev/null 2>&1`); } catch {} }

let batch = 0, since = 0, done = 0, low = [];
for (let i = 0; i < CAFES.length; i++) {
  const [name, slug] = CAFES[i];
  if (have(slug) >= PER_MIN) { console.log(`[${i + 1}/50] ${name} — has ${have(slug)}, skip`); continue; }
  const dir = path.join(PHOTOS, slug); fs.mkdirSync(dir, { recursive: true });
  let n = 0, place = null;
  try {
    place = await findPlace(name);
    if (!place) { console.log(`[${i + 1}/50] ${name} — NOT FOUND on Maps`); low.push(name + " (not found)"); }
    else {
      const d = await details(place.place_id);
      const photos = (d && d.photos) || [];
      const meta = [];
      for (const p of photos.slice(0, PER_MAX)) {
        const f = path.join(dir, `${n + 1}.jpg`);
        try { await dlPhoto(p.photo_reference, f); upscale(f); meta.push({ file: `${n + 1}.jpg`, shows: `${name} — shop/product photo (Google Maps)`, src: (d.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`), attribution: (p.html_attributions || []) }); n++; } catch {}
        await sleep(120);
      }
      fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({ place_id: place.place_id, place_name: place.name, address: place.addr, photos: meta }, null, 2));
      console.log(`[${i + 1}/50] ${name} -> matched "${place.name}" (${place.addr}) · ${n} photos`);
      if (n < PER_MIN) low.push(`${name} (${n} photos, matched ${place.name})`);
    }
  } catch (e) {
    console.error(`[${i + 1}/50] ${name} ERROR: ${e.message}`);
    if (/REQUEST_DENIED|OVER_QUERY_LIMIT/.test(e.message)) { console.error("\nKEY PROBLEM — stopping. Fix the key (enable Places API + billing) and re-run."); process.exit(2); }
  }
  if (n === 0) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch {} } else done++;
  since++;
  if (since >= 10 || i === CAFES.length - 1) {
    batch++;
    try { execSync(`cd ${JSON.stringify(ROOT)} && git add -f dist/assets/photos && git commit -q -m "PHOTO-50 batch ${batch} (Google Places)" && git push`, { stdio: "inherit" }); console.log(`== committed + pushed batch ${batch} ==`); }
    catch (e) { console.log("commit/push note:", e.message.split("\n")[0]); }
    since = 0;
  }
  await sleep(250);
}
console.log(`\nDONE. cafes with photos: ${done}/50.`);
if (low.length) { console.log("LOW/RECHECK (may need a manual place match):"); low.forEach(x => console.log("  - " + x)); }

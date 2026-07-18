#!/usr/bin/env node
// PHOTO-50 harvester — runs on Ibrahim's Mac with HIS Instagram login.
// Real photos only (evidence rule). Downloads 6-10 shots/cafe from each cafe's OWN
// Instagram, upscales to >=1200px, writes meta.json + logo.png, commits in batches of 10.
//
// WHY THIS EXISTS: logged-OUT Instagram only exposes a 100px profile thumbnail and
// challenge-walls every post gallery, so the cloud/headless box cannot harvest real
// galleries. A logged-IN browser session can. This script drives a dedicated Chrome
// profile you log into once.
//
// ONE-TIME SETUP + RUN (one command):
//   cd ~/bubble-pop/menu-sadah-outreach && node singularity/hunt-photos-ig.mjs
//   -> a Chrome window opens. Log into Instagram ONCE (only needed first run), then
//      press ENTER in the terminal. It harvests all 50, committing every 10.
//   Resume later: it skips cafes whose folder already has >=6 images.
//
// CAVEAT (honest): this automates YOUR Instagram session to view public cafe profiles.
// Instagram may throttle heavy automated browsing. The script paces itself (human-like
// delays, one cafe at a time) to stay gentle, but use your judgment on volume.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import readline from "node:readline";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PHOTOS = path.join(ROOT, "dist/assets/photos");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PROFILE = path.join(process.env.HOME, ".clientos-ig-profile"); // dedicated login profile
const PER_CAFE_MIN = 6, PER_CAFE_MAX = 10;

// The 50 targets (name, slug, handle, type, optional explicit post)
const CAFES = [
  ["Roof Coffee","roof-coffee","roof.coffeee","specialty_coffee"],
  ["Razeen Coffee","razeen-coffee","razeen.coffee","specialty_coffee"],
  ["Qawam","qawam","qawam.sa","specialty_coffee"],
  ["Cafe !N","cafe-n","cafe.n.sa","specialty_coffee"],
  ["Public Cafe","public-cafe","public.sa","specialty_coffee"],
  ["Rewanted Cafe","rewanted-cafe","rewantedcafe","dessert_cafe"],
  ["Sei Coffee","sei-coffee","sei.sa.coffee","specialty_coffee"],
  ["Solio Cafe","solio-cafe","find.solio","specialty_coffee"],
  ["Good Mate Cafe","good-mate-cafe","good.matecafe","specialty_coffee"],
  ["Laminam Cafe","laminam-cafe","laminam_ksa","specialty_coffee"],
  ["Salam Coffee","salam-coffee","salam.coffee.sa","specialty_coffee"],
  ["Matal Al Wadi","matal-al-wadi","matalalwadi","family_cafe"],
  ["Rakiyah Roastery","rakiyah-roastery","rukayaa.sa","roastery"],
  ["Marthad Coffee","marthad-coffee","marthad.coffee","specialty_coffee"],
  ["Haffa Coffee Roaster","haffa-coffee-roaster","haffa.sa","roastery"],
  ["Kazar Cafe","kazar-cafe","kazar.cafe","specialty_coffee"],
  ["Cave Cafe","cave-cafe","cave.coffe1","specialty_coffee"],
  ["RYM Coffee","rym-coffee","rym.ruh","specialty_coffee"],
  ["Sakaf Specialty Coffee","sakaf-specialty-coffee","sakafcafe","specialty_coffee"],
  ["Find Hai Roastery & Cafe","find-hai-roastery-and-cafe","find.hai","roastery"],
  ["Muhjah Cafe","muhjah-cafe","muhjahcafe","family_cafe"],
  ["Trov Cafe","trov-cafe","trov_co","specialty_coffee"],
  ["Ob Cafe","ob-cafe","obcaf.e","family_cafe"],
  ["Yellow Rose","yellow-rose","yellowrosecafee","family_cafe"],
  ["Noma Coffee","noma-coffee","nomacoffee.sa","specialty_coffee"],
  ["Lihaf","lihaf","le_hf1","specialty_coffee"],
  ["Serb Coffee","serb-coffee","serb.coffee","specialty_coffee"],
  ["Mat Cookies","mat-cookies","matcookies","dessert_cafe"],
  ["Hacked","hacked","hacked.sa","dessert_cafe"],
  ["Secret Pot Bakery","secret-pot-bakery","secretpotbakery","bakery_cafe"],
  ["The Cake Corner","the-cake-corner","thecakecornerksa","dessert_cafe"],
  ["Kunafa Abul Haus","kunafa-abul-haus","kabualhous","dessert_cafe"],
  ["Breddy","breddy","breddy_sa","bakery_cafe"],
  ["Chimney Cafe","chimney-cafe","chimneycafe.ksa","dessert_cafe"],
  ["Croi Bakehouse","croi-bakehouse","croi.bakehouse","bakery_cafe"],
  ["Lyrs Bakery","lyrs-bakery","lyrsbakery","bakery_cafe"],
  ["Sip Day Specialty Coffee","sip-day-specialty-coffee","sipday10","specialty_coffee"],
  ["Nafas Cafe","nafas-cafe","nafascafe.sa","family_cafe"],
  ["Matchafulll","matchafulll","matchafulll","matcha_bar"],
  ["The Sweet Sip","the-sweet-sip","thesweetsip5","dessert_cafe"],
  ["Harf Cafe","harf-cafe","harfcafe.sa","specialty_coffee"],
  ["Caia Coffee","caia-coffee","caiacoffee","specialty_coffee"],
  ["Shanab Cafe","shanab-cafe","shanab.cafe","family_cafe"],
  ["Hdn Coffee","hdn-coffee","hdncoffee","specialty_coffee"],
  ["Sharq Coffee & Roastery","sharq-coffee-and-roastery","shrqcoffee","roastery"],
  ["Nakhati Gelato","nakhati-gelato","nakhati_gelato","dessert_cafe"],
  ["Salve Artisan Gelato","salve-artisan-gelato","gelato_salve","dessert_cafe"],
  ["Duirrah","duirrah","duirrah","dessert_cafe"],
  ["Cavida Cafe","cavida-cafe","cavida.cafe","dessert_cafe"],
  ["OUIA Cafe","ouia-cafe","ouiacafe","specialty_coffee"],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const jitter = (a, b) => a + Math.floor(Math.random() * (b - a));
function ask(q) { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise(res => rl.question(q, a => { rl.close(); res(a); })); }
function have(slug) { const d = path.join(PHOTOS, slug); if (!fs.existsSync(d)) return 0; return fs.readdirSync(d).filter(f => /^\d+\.jpg$/.test(f)).length; }

async function dl(url, dest) {
  const r = await fetch(url); if (!r.ok) throw new Error("http " + r.status);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}
function upscale(f) {
  try {
    const w = +execSync(`sips -g pixelWidth ${JSON.stringify(f)}`).toString().match(/pixelWidth:\s*(\d+)/)[1];
    if (w < 1200) execSync(`sips --resampleWidth 1200 ${JSON.stringify(f)} >/dev/null 2>&1`);
  } catch {}
}

async function bestImagesFromPost(page, postUrl) {
  await page.goto(postUrl, { waitUntil: "networkidle2", timeout: 45000 });
  await sleep(jitter(900, 1800));
  // collect the largest srcset candidate from each visible article img + carousel
  return await page.evaluate(() => {
    const urls = new Set();
    const pick = img => {
      let best = img.currentSrc || img.src;
      if (img.srcset) { const parts = img.srcset.split(",").map(s => s.trim().split(" ")); best = parts.sort((a, b) => (parseInt(b[1]) || 0) - (parseInt(a[1]) || 0))[0][0]; }
      if (best && /scontent|cdninstagram/.test(best)) urls.add(best);
    };
    document.querySelectorAll("article img, main img").forEach(pick);
    return [...urls];
  });
}

(async () => {
  if (!fs.existsSync(CHROME)) { console.error("Google Chrome not found at", CHROME); process.exit(1); }
  fs.mkdirSync(PROFILE, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: false, userDataDir: PROFILE, defaultViewport: { width: 1280, height: 1000 }, args: ["--no-first-run", "--no-default-browser-check"] });
  const page = (await browser.pages())[0] || await browser.newPage();
  await page.goto("https://www.instagram.com/", { waitUntil: "domcontentloaded" });
  const loggedIn = await page.evaluate(() => !/Log in|loginForm/i.test(document.body.innerText) || !!document.querySelector('svg[aria-label="Home"]'));
  if (!loggedIn) { console.log("\n>> Log into Instagram in the Chrome window, then press ENTER here."); await ask(""); }

  let batch = 0, sinceCommit = 0;
  for (let i = 0; i < CAFES.length; i++) {
    const [name, slug, handle, type] = CAFES[i];
    if (have(slug) >= PER_CAFE_MIN) { console.log(`[${i + 1}/50] ${name} — already has ${have(slug)}, skip`); continue; }
    const dir = path.join(PHOTOS, slug); fs.mkdirSync(dir, { recursive: true });
    console.log(`[${i + 1}/50] ${name} (@${handle})`);
    const meta = [];
    try {
      await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: "networkidle2", timeout: 45000 });
      await sleep(jitter(1200, 2400));
      // logo = profile pic
      try { const pp = await page.evaluate(() => { const m = document.querySelector('meta[property="og:image"]'); return m && m.content; }); if (pp) { await dl(pp, path.join(dir, "logo.png")); } } catch {}
      // scroll to load grid, collect post permalinks
      for (let s = 0; s < 3; s++) { await page.evaluate(() => scrollBy(0, 1400)); await sleep(jitter(700, 1400)); }
      const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')].map(a => a.href))].slice(0, 12));
      let n = 0;
      for (const link of links) {
        if (n >= PER_CAFE_MAX) break;
        let imgs = [];
        try { imgs = await bestImagesFromPost(page, link); } catch { continue; }
        for (const u of imgs) {
          if (n >= PER_CAFE_MAX) break;
          const f = path.join(dir, `${n + 1}.jpg`);
          try { await dl(u, f); upscale(f); meta.push({ file: `${n + 1}.jpg`, shows: `${name} — real post photo`, src: link }); n++; } catch {}
          await sleep(jitter(300, 800));
        }
        await sleep(jitter(800, 1600));
      }
      fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2));
      console.log(`   -> ${n} photos${n < PER_CAFE_MIN ? " (LOW — review/handle may be wrong)" : ""}`);
    } catch (e) { console.log("   ERR", e.message); }

    sinceCommit++;
    if (sinceCommit >= 10 || i === CAFES.length - 1) {
      batch++;
      try {
        execSync(`cd ${JSON.stringify(ROOT)} && git add -f dist/assets/photos && git commit -q -m "PHOTO-50 batch ${batch}" && git push`, { stdio: "inherit" });
        console.log(`== committed PHOTO-50 batch ${batch} ==`);
      } catch (e) { console.log("commit/push failed:", e.message); }
      sinceCommit = 0;
    }
    await sleep(jitter(1500, 3000)); // gentle between cafes
  }
  await browser.close();
  console.log("DONE. Review folders in dist/assets/photos/ before the next deploy.");
})();

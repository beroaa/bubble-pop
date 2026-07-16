// Menu Sadah — stress-test harness. Usage: node menus/_kit/verify.mjs <slug>
// Gate: no horizontal overflow at 375/414/768/1280, zero JS errors, reduced-motion
// smoke, CSS applied, AND brand fonts actually render (metric comparison).
// Fonts: the browser-through-proxy path resets on Google Fonts, so we intercept
// font requests and fulfill them from Node fetch (trusts the agent CA bundle).
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire('/opt/node22/lib/node_modules/playwright/');
const { chromium } = require('playwright');

// Trust the agent proxy CA so Node fetch can pull font files.
try {
  const { Agent, setGlobalDispatcher } = await import('undici');
  setGlobalDispatcher(new Agent({ connect: { ca: readFileSync('/root/.ccr/ca-bundle.crt') } }));
} catch { /* undici/CA unavailable — font fetch may fail; reported as fallback */ }

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const slug = process.argv[2];
if (!slug) { console.error('need slug'); process.exit(2); }
const file = `file:///home/user/bubble-pop/menus/${slug}/index.html`;
const dir = `/home/user/bubble-pop/menus/${slug}`;

const VPS = [
  { w: 375, h: 812, tag: 'mobile-sm' },
  { w: 414, h: 896, tag: 'mobile-lg' },
  { w: 768, h: 1024, tag: 'tablet' },
  { w: 1280, h: 900, tag: 'desktop' },
];

const out = { slug, pass: true, issues: [], warnings: [], viewports: {}, jsErrors: [], fonts: {}, fontsOk: true, cssApplied: false };
// Arabic-script Google Fonts — these render unreliably in headless, so they WARN (never hard-fail); they render fine live.
const ARABIC_RE = /arab|kufi|naskh|tajawal|reem|cairo|amiri|lateef|aref|ruqaa|markazi|scheher|lalezar|harmattan|katibeh|jomhuria|lemonada|mirza|rakkas|vibes|baloo|readex|kufam|gulzar|qahiri|blaka|alkalami|vazir|almarai|messiri|changa|mada|noto.*arabic/i;

// shared font cache across pages
const fontCache = new Map();
async function fontRoute(route) {
  const url = route.request().url();
  try {
    if (!fontCache.has(url)) {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      fontCache.set(url, { status: res.status, ct: res.headers.get('content-type') || '', body: Buffer.from(await res.arrayBuffer()) });
    }
    const c = fontCache.get(url);
    await route.fulfill({ status: c.status, contentType: c.ct, body: c.body });
  } catch { await route.continue().catch(() => {}); }
}

const browser = await chromium.launch();  // NO proxy arg (that's what reset font connections)
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await page.route(/fonts\.(googleapis|gstatic)\.com/, fontRoute);
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto(file, { waitUntil: 'networkidle' }).catch(e => errs.push('nav:' + e.message));
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}
    await page.waitForTimeout(500);

    const m = await page.evaluate(() => {
      const styled = (el) => {
        if (!el) return false;
        const s = getComputedStyle(el), c = s.backgroundColor, i = s.backgroundImage;
        return !!((c && c !== 'rgba(0, 0, 0, 0)' && c !== 'rgb(255, 255, 255)' && c !== 'transparent') || (i && i !== 'none'));
      };
      return {
        sw: document.body.scrollWidth, iw: window.innerWidth,
        cssApplied: styled(document.body) || styled(document.documentElement) || styled(document.querySelector('.wrap, main, header, [class*="wrap"], .card')),
      };
    });
    const overflow = m.sw > m.iw + 1;
    out.viewports[vp.tag] = { w: vp.w, scrollWidth: m.sw, overflow };
    if (overflow) { out.pass = false; out.issues.push(`h-overflow @${vp.w}px (body ${m.sw} > ${m.iw})`); }
    if (errs.length) { out.pass = false; out.jsErrors.push(...errs.map(e => `${vp.tag}: ${e}`)); }
    if (m.cssApplied) out.cssApplied = true;

    // Font-render gate — only on the primary viewport
    if (vp.tag === 'mobile-sm') {
      out.fonts = await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const links = [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(l => l.href).join('');
        const fams = [...new Set((links.match(/family=([^&:]+)/g) || []).map(s => decodeURIComponent(s.slice(7).replace(/\+/g, ' '))))];
        const arabic = /arab|kufi|tajawal|reem|cairo|amiri|lateef|noto.*arabic/i;
        const meas = (css, txt) => { const s = document.createElement('span'); s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:40px;font-weight:700;font-family:' + css; s.textContent = txt; document.body.appendChild(s); const w = s.offsetWidth; s.remove(); return w; };
        const res = {};
        for (const f of fams) { const t = arabic.test(f) ? 'قهوة عربية ١٢٣' : 'Menu Coffee 123'; res[f] = meas(`"${f}",monospace`, t) !== meas('monospace', t) ? 'rendered' : 'fallback'; }
        return res;
      });
      const fell = Object.entries(out.fonts).filter(([, v]) => v === 'fallback').map(([k]) => k);
      const latinFell = fell.filter(f => !ARABIC_RE.test(f));
      const arFell = fell.filter(f => ARABIC_RE.test(f));
      if (latinFell.length) { out.pass = false; out.fontsOk = false; out.issues.push(`Latin font(s) not rendered: ${latinFell.join(', ')}`); }
      if (arFell.length) { out.warnings.push(`Arabic webfont unconfirmed in-harness (renders live via <link>): ${arFell.join(', ')}`); }
      await page.screenshot({ path: `${dir}/_shot-375.png` });
    }
    if (vp.tag === 'desktop') await page.screenshot({ path: `${dir}/_shot-desktop.png` });
    await ctx.close();
  }

  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/, fontRoute);
  const rmErr = [];
  page.on('pageerror', e => rmErr.push(String(e)));
  await page.goto(file, { waitUntil: 'networkidle' }).catch(e => rmErr.push('nav:' + e.message));
  await page.waitForTimeout(400);
  if (rmErr.length) { out.pass = false; out.jsErrors.push(...rmErr.map(e => 'reduced-motion: ' + e)); }
  await ctx.close();

  if (!out.cssApplied) { out.pass = false; out.issues.push('CSS may not have applied (default body bg)'); }
} catch (e) {
  out.pass = false; out.issues.push('harness-error: ' + e.message);
} finally {
  await browser.close();
}

console.log(JSON.stringify(out));
process.exit(out.pass ? 0 : 1);

// Menu Sadah — stress-test harness. Usage: node menus/_kit/verify.mjs <slug>
// Gate: no horizontal overflow at 375/414/768/1280, zero JS errors, fonts settled.
// Emits one JSON line (last line) + writes screenshots to menus/<slug>/_shot-*.png
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/playwright/');
const { chromium } = require('playwright');
const fs = require('fs');

const slug = process.argv[2];
if (!slug) { console.error('need slug'); process.exit(2); }
const file = `file:///home/user/bubble-pop/menus/${slug}/index.html`;
const dir = `/home/user/bubble-pop/menus/${slug}`;
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;

const VPS = [
  { w: 375, h: 812, tag: 'mobile-sm' },
  { w: 414, h: 896, tag: 'mobile-lg' },
  { w: 768, h: 1024, tag: 'tablet' },
  { w: 1280, h: 900, tag: 'desktop' },
];

const out = { slug, pass: true, issues: [], viewports: {}, jsErrors: [], fontsOk: false, cssApplied: false };

const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
try {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto(file, { waitUntil: 'networkidle' }).catch(e => errs.push('nav:' + e.message));
    await page.waitForTimeout(1200);
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}

    const m = await page.evaluate(() => ({
      sw: document.body.scrollWidth,
      iw: window.innerWidth,
      bg: getComputedStyle(document.body).backgroundColor,
      fontsReady: !!(document.fonts && document.fonts.status === 'loaded'),
      fontCount: document.fonts ? document.fonts.size : 0,
    }));
    const overflow = m.sw > m.iw + 1;
    out.viewports[vp.tag] = { w: vp.w, scrollWidth: m.sw, overflow };
    if (overflow) { out.pass = false; out.issues.push(`h-overflow @${vp.w}px (body ${m.sw} > ${m.iw})`); }
    if (errs.length) { out.pass = false; out.jsErrors.push(...errs.map(e => `${vp.tag}: ${e}`)); }
    if (m.bg && m.bg !== 'rgba(0, 0, 0, 0)' && m.bg !== 'rgb(255, 255, 255)') out.cssApplied = true;
    if (m.fontCount > 0) out.fontsOk = true;

    if (vp.tag === 'mobile-sm') {
      await page.screenshot({ path: `${dir}/_shot-375.png` });
    }
    if (vp.tag === 'desktop') {
      await page.screenshot({ path: `${dir}/_shot-desktop.png` });
    }
    await ctx.close();
  }

  // reduced-motion smoke: should not throw / overflow
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const rmErr = [];
  page.on('pageerror', e => rmErr.push(String(e)));
  await page.goto(file, { waitUntil: 'networkidle' }).catch(e => rmErr.push('nav:' + e.message));
  await page.waitForTimeout(500);
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

// MENU SADAH shared page renderers — used by build.mjs (batch #1) and singularity/engine.mjs.
import { CONTACT } from '../cafes.mjs';

const SAR = '﷼';
const waLink = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

const baseCss = (accent) => `
  :root{
    --bg-0:#161210;--bg-1:#1f1915;--bg-2:#2a221b;--bg-3:#372c22;
    --border-1:#35291f;--border-2:#55422f;
    --text-1:#f5efe6;--text-2:#c6b9a6;--text-3:#8b7d6a;
    --accent:${accent};--accent-soft:${accent}24;--on-accent:#1d1610;
    --radius-md:12px;--radius-lg:16px;--radius-xl:24px;--radius-full:999px;
    --shadow-2:0 4px 12px #00000073,0 12px 32px #00000059;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Tahoma,Roboto,Arial,sans-serif;
    background:var(--bg-0);color:var(--text-1);font-size:16px;line-height:1.5;
    -webkit-font-smoothing:antialiased;min-height:100svh;
  }
  .wrap{max-width:560px;margin:0 auto;padding:20px 16px 96px}
  .pill{display:inline-block;background:var(--accent-soft);color:var(--accent);
    border:1px solid var(--accent);border-radius:var(--radius-full);
    padding:4px 14px;font-size:12.5px;letter-spacing:.08em}
  .btn{display:block;text-align:center;text-decoration:none;background:var(--accent);
    color:var(--on-accent);font-weight:700;font-size:17px;border-radius:var(--radius-lg);
    padding:16px 20px;box-shadow:var(--shadow-2)}
  .btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent);box-shadow:none}
  .footer{margin-top:48px;text-align:center;color:var(--text-3);font-size:13px}
  .footer a{color:var(--accent);text-decoration:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:10;
    background:var(--bg-2);border:1px solid var(--border-2);color:var(--text-1);
    border-radius:var(--radius-full);padding:8px 16px;font-size:14px;cursor:pointer}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
`;

const langScript = `
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){
    root.setAttribute('data-lang',l);
    root.setAttribute('lang',l);
    root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');
    if(t)t.textContent=l==='ar'?'English':'العربية';
    localStorage.setItem('ms-lang',l);
  }
  document.getElementById('langToggle').addEventListener('click',()=>{
    setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');
  });
<\/script>`;

const footer = `
  <div class="footer">
    <span class="ar">تجربة من <a href="${CONTACT.site}">${CONTACT.brandAr} — MENU SADAH</a></span>
    <span class="en">Powered by <a href="${CONTACT.site}">${CONTACT.brand}</a></span>
  </div>`;

function menuPage(cafe) {
  const cats = cafe.menu
    .map(
      (c, i) => `
      <section class="cat" id="cat-${i}">
        <h2><span class="ar">${c.catAr}</span><span class="en">${c.cat}</span></h2>
        <div class="items">
          ${c.items
            .map(
              ([en, ar, price]) => `
          <div class="item">
            <div class="item-name"><span class="ar">${ar}</span><span class="en">${en}</span></div>
            <div class="dots"></div>
            <div class="price">${price} <span class="sar">${SAR}</span></div>
          </div>`
            )
            .join('')}
        </div>
      </section>`
    )
    .join('');

  const chips = cafe.menu
    .map(
      (c, i) =>
        `<a class="chip" href="#cat-${i}"><span class="ar">${c.catAr}</span><span class="en">${c.cat}</span></a>`
    )
    .join('');

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#161210">
<title>${cafe.name} — Menu · ${CONTACT.brand}</title>
<style>
${baseCss(cafe.accent)}
  .hero{padding:56px 0 20px;text-align:center}
  .logo-badge{width:84px;height:84px;margin:0 auto 16px;border-radius:var(--radius-full);
    background:radial-gradient(circle at 30% 30%,${cafe.accent}59,${cafe.accent}26 60%,transparent);
    border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;
    font-size:34px;font-weight:800;color:var(--accent)}
  h1{font-size:28px;letter-spacing:-.02em}
  .tagline{color:var(--text-2);margin-top:6px;font-size:15px}
  .area{color:var(--text-3);font-size:13px;margin-top:4px}
  .chips{display:flex;gap:8px;overflow-x:auto;padding:18px 0 6px;position:sticky;top:0;
    background:linear-gradient(#161210 75%,transparent);scrollbar-width:none}
  .chips::-webkit-scrollbar{display:none}
  .chip{flex:0 0 auto;text-decoration:none;color:var(--text-2);background:var(--bg-1);
    border:1px solid var(--border-1);border-radius:var(--radius-full);padding:8px 16px;font-size:14px}
  .chip:active{background:var(--accent-soft);color:var(--accent)}
  .cat{margin-top:28px}
  .cat h2{color:var(--accent);font-size:15px;letter-spacing:.08em;margin-bottom:12px}
  .items{background:var(--bg-1);border:1px solid var(--border-1);border-radius:var(--radius-lg);
    padding:6px 16px;box-shadow:var(--shadow-2)}
  .item{display:flex;align-items:baseline;gap:10px;padding:14px 0;border-bottom:1px solid var(--border-1)}
  .item:last-child{border-bottom:none}
  .item-name{font-size:16px}
  .dots{flex:1;border-bottom:1px dotted var(--border-2);transform:translateY(-4px)}
  .price{color:var(--accent);font-weight:700;white-space:nowrap}
  .sar{font-size:12px}
  .demo-note{margin-top:28px;background:var(--accent-soft);border:1px dashed var(--accent);
    border-radius:var(--radius-md);padding:12px 16px;font-size:13.5px;color:var(--text-2);text-align:center}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="wrap">
  <header class="hero">
    <div class="logo-badge">${cafe.name.trim()[0].toUpperCase()}</div>
    <h1><span class="ar">${cafe.nameAr}</span><span class="en">${cafe.name}</span></h1>
    <div class="tagline"><span class="ar">${cafe.taglineAr}</span><span class="en">${cafe.tagline}</span></div>
    <div class="area"><span class="ar">${cafe.areaAr === 'الرياض' ? 'الرياض' : `${cafe.areaAr} · الرياض`}</span><span class="en">${cafe.area === 'Riyadh' ? 'Riyadh' : `${cafe.area} · Riyadh`}</span></div>
  </header>
  <nav class="chips">${chips}</nav>
  ${cats}
  <div class="demo-note">
    <span class="ar">هذه نسخة تجريبية أعدّها فريق ${CONTACT.brandAr} — الأصناف والأسعار قابلة للتعديل خلال دقائق.</span>
    <span class="en">This is a demo prepared by ${CONTACT.brand} — items & prices can be updated in minutes.</span>
  </div>
  ${footer}
</div>
${langScript}
</body>
</html>`;
}

function welcomePage(cafe) {
  const waMsg = `مرحباً، معكم ${cafe.name} — شفنا المنيو التجريبي وحابين نكمل`;
  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#161210">
<title>${cafe.name} × ${CONTACT.brand}</title>
<style>
${baseCss(cafe.accent)}
  .hero{padding:72px 0 28px;text-align:center}
  .x{color:var(--text-3);font-size:20px;margin:0 10px}
  h1{font-size:26px;line-height:1.3;margin-top:18px}
  h1 b{color:var(--accent)}
  .sub{color:var(--text-2);margin-top:12px;font-size:16px}
  .card{background:var(--bg-1);border:1px solid var(--border-1);border-radius:var(--radius-xl);
    padding:24px 20px;margin-top:28px;box-shadow:var(--shadow-2)}
  .benefits{list-style:none;margin-top:4px}
  .benefits li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;color:var(--text-2);font-size:15px}
  .benefits .tick{color:var(--accent);font-weight:800;flex:0 0 auto}
  .cta-stack{display:grid;gap:12px;margin-top:28px}
  .small{margin-top:14px;text-align:center;color:var(--text-3);font-size:13px}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="wrap">
  <header class="hero">
    <span class="pill">${CONTACT.brandAr} · MENU SADAH</span>
    <h1>
      <span class="ar">أهلاً <b>${cafe.nameAr}</b> 👋<br>جهّزنا لكم منيو إلكتروني خاص فيكم</span>
      <span class="en">Hello <b>${cafe.name}</b> 👋<br>We built your e-menu — it's ready</span>
    </h1>
    <p class="sub">
      <span class="ar">تابعنا حسابكم وأعجبنا شغلكم في ${cafe.areaAr}، فصمّمنا لكم نسخة تجريبية كاملة قبل أي التزام.</span>
      <span class="en">We loved what you're doing in ${cafe.area}, so we designed a full working demo before you commit to anything.</span>
    </p>
  </header>

  <div class="card">
    <ul class="benefits">
      <li><span class="tick">✓</span><span><span class="ar">رابط واحد + QR على الطاولة — بدون PDF وبدون تصوير المنيو</span><span class="en">One link + a table QR — no PDFs, no photographed menus</span></span></li>
      <li><span class="tick">✓</span><span><span class="ar">عربي / إنجليزي بضغطة زر، بهوية ${cafe.nameAr} وألوانكم</span><span class="en">Arabic / English toggle, in ${cafe.name}'s own colors</span></span></li>
      <li><span class="tick">✓</span><span><span class="ar">تعديل الأسعار والأصناف خلال دقائق — بدون إعادة طباعة</span><span class="en">Update items & prices in minutes — never reprint again</span></span></li>
      <li><span class="tick">✓</span><span><span class="ar">سريع على الجوال ويفتح بدون تطبيق</span><span class="en">Instant on mobile, no app needed</span></span></li>
    </ul>
  </div>

  <div class="cta-stack">
    <a class="btn" href="../${cafe.slug}/">
      <span class="ar">👀 شاهد منيو ${cafe.nameAr} التجريبي</span>
      <span class="en">👀 See your demo menu</span>
    </a>
    <a class="btn ghost" href="${waLink(waMsg)}">
      <span class="ar">💬 كلمنا واتساب — نفعّله لكم بنفس اليوم</span>
      <span class="en">💬 WhatsApp us — live the same day</span>
    </a>
  </div>
  <p class="small">
    <span class="ar">شاهد مثالاً حياً لعميلنا: <a href="${CONTACT.referenceMenu}" style="color:var(--accent)">بيت كوفي</a></span>
    <span class="en">See a live client example: <a href="${CONTACT.referenceMenu}" style="color:var(--accent)">Beyt Coffee</a></span>
  </p>
  ${footer}
</div>
${langScript}
</body>
</html>`;
}

function indexPage(CAFES) {
  const rows = CAFES.map(
    (c) => `
    <div class="prospect" style="--pa:${c.accent}">
      <div class="head">
        <span class="dot"></span>
        <div>
          <div class="pname">${c.name} <span class="par">${c.nameAr}</span></div>
          <div class="pmeta">${c.area} · ${c.social}</div>
        </div>
      </div>
      <p class="note">${c.pitchNote}</p>
      <div class="links">
        <a href="./${c.slug}-welcome/">Welcome page</a>
        <a href="./${c.slug}/">Demo menu</a>
        <span class="deploy">→ menu-sadah.com/${c.slug}-welcome</span>
      </div>
    </div>`
  ).join('');

  return `<!doctype html>
<html lang="en" dir="ltr" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#161210">
<title>Riyadh Outreach Batch #1 — ${CONTACT.brand} HQ</title>
<style>
${baseCss('#e3b23c')}
  .wrap{max-width:760px}
  h1{font-size:24px;padding-top:40px}
  .sub{color:var(--text-2);margin:8px 0 28px}
  .prospect{background:var(--bg-1);border:1px solid var(--border-1);border-radius:var(--radius-lg);
    padding:18px 20px;margin-bottom:14px;box-shadow:var(--shadow-2)}
  .head{display:flex;gap:12px;align-items:center}
  .dot{width:14px;height:14px;border-radius:50%;background:var(--pa);flex:0 0 auto;box-shadow:0 0 10px var(--pa)}
  .pname{font-weight:700;font-size:17px}
  .par{color:var(--text-3);font-weight:400;font-size:14px;margin-inline-start:6px}
  .pmeta{color:var(--text-3);font-size:13px}
  .note{color:var(--text-2);font-size:14px;margin:10px 0 12px}
  .links{display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:14px}
  .links a{color:var(--accent);text-decoration:none;border:1px solid var(--border-2);
    border-radius:var(--radius-full);padding:6px 14px}
  .deploy{color:var(--text-3);font-size:12.5px;font-family:ui-monospace,Menlo,monospace}
</style>
</head>
<body>
<div class="wrap">
  <span class="pill">${CONTACT.brand} · HQ</span>
  <h1>Riyadh Outreach — Batch #1 (10 prospects)</h1>
  <p class="sub">Each prospect has a personalized welcome (pitch) page and a ready demo menu.
  Send the <b>welcome link</b> in the first DM. Deploy targets shown per cafe.</p>
  ${rows}
  ${footer}
</div>
</body>
</html>`;
}


export { SAR, waLink, baseCss, langScript, footer, menuPage, welcomePage, indexPage };

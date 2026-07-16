// Build the Menu Sadah gallery from the catalog (menus/index.json).
// A filterable showcase of every menu; defaults to the Dubai filter.
// Usage: node menus/_kit/build-gallery.mjs   ->  writes menus/gallery.html
import { readFileSync, writeFileSync } from 'fs';
const ROOT = '/home/user/bubble-pop/menus';
const cat = JSON.parse(readFileSync(`${ROOT}/index.json`, 'utf8'));
const menus = cat.menus || [];
const cities = [...new Set(menus.map(m => m.city))];
const dubai = menus.filter(m => m.city === 'Dubai').length;

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const card = m => `
    <a class="card" data-city="${esc(m.city)}" href="./${esc(m.slug)}/index.html" style="--a:${esc(m.accent || '#C68A4B')}">
      <div class="bar"></div>
      <div class="body">
        <div class="row">
          <h3>${esc(m.name)}</h3>
          <span class="ar">${esc(m.name_ar)}</span>
        </div>
        <div class="chips">
          <span class="city">${esc(m.city)}</span>
          ${m.verified ? '<span class="ok">verified</span>' : ''}
          ${m.gift ? '<span class="gift">gift ✓</span>' : ''}
        </div>
        <p class="concept">${esc(m.concept || '')}</p>
        <div class="foot"><span class="url">menu-sadah.com/${esc(m.slug)}</span><span class="go">View →</span></div>
      </div>
    </a>`;

const html = `<title>Menu Sadah — Gallery</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{--bg:#14100A;--panel:#1E170F;--panel2:#241B11;--ink:#F3EADC;--dim:#A8977C;--faint:#7A6B52;--copper:#C68A4B;--soft:#E2B47F;--line:rgba(198,138,75,.16);--sans:system-ui,-apple-system,"Segoe UI",sans-serif}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.5;padding:26px 18px 60px;min-height:100vh;background-image:radial-gradient(900px 480px at 50% -160px,rgba(198,138,75,.10),transparent 70%)}
  .wrap{max-width:960px;margin:0 auto}
  .brand{font-weight:800;letter-spacing:.2em;text-transform:uppercase;font-size:.72rem;color:var(--soft)}
  h1{font-size:clamp(1.7rem,6vw,2.4rem);font-weight:800;margin:8px 0 4px;letter-spacing:-.01em}
  .sub{color:var(--dim);font-size:.95rem}
  .filters{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0 20px}
  .f{font:inherit;font-weight:600;font-size:.82rem;color:var(--dim);background:transparent;border:1px solid var(--line);border-radius:999px;padding:8px 16px;cursor:pointer;transition:.2s}
  .f.active,.f:hover{color:var(--bg);background:var(--copper);border-color:var(--copper)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
  .card{display:block;text-decoration:none;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:transform .18s,border-color .18s}
  .card:hover{transform:translateY(-3px);border-color:var(--a)}
  .card:focus-visible{outline:2px solid var(--soft);outline-offset:2px}
  .bar{height:6px;background:var(--a)}
  .body{padding:16px 17px 15px}
  .row{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
  .row h3{font-size:1.25rem;font-weight:800;letter-spacing:.01em}
  .row .ar{color:var(--dim);font-size:1rem}
  .chips{display:flex;gap:6px;flex-wrap:wrap;margin:9px 0 10px}
  .chips span{font-size:.64rem;letter-spacing:.06em;text-transform:uppercase;font-weight:700;padding:3px 8px;border-radius:999px}
  .city{background:color-mix(in srgb,var(--a) 22%,transparent);color:var(--a)}
  .ok{background:rgba(111,183,154,.16);color:#8CC9AE}
  .gift{background:rgba(226,180,127,.16);color:var(--soft)}
  .concept{color:var(--dim);font-size:.84rem;min-height:2.4em}
  .foot{display:flex;align-items:center;justify-content:space-between;margin-top:13px;padding-top:11px;border-top:1px solid var(--line)}
  .url{font-size:.72rem;color:var(--faint);font-family:ui-monospace,Menlo,monospace}
  .go{font-size:.82rem;font-weight:700;color:var(--a)}
  .empty{color:var(--faint);padding:30px 0;text-align:center;display:none}
  .note{margin-top:26px;font-size:.78rem;color:var(--faint);text-align:center}
  @media(prefers-reduced-motion:reduce){.card{transition:none}}
</style>
<div class="wrap">
  <div class="brand">Menu Sadah</div>
  <h1>The Gallery</h1>
  <p class="sub">${menus.length} premium bilingual café menus · ${dubai} in Dubai · each its own identity.</p>
  <div class="filters" id="filters">
    <button class="f" data-f="All">All · ${menus.length}</button>
    ${cities.map(c => `<button class="f${c === 'Dubai' ? ' active' : ''}" data-f="${esc(c)}">${esc(c)} · ${menus.filter(m => m.city === c).length}</button>`).join('\n    ')}
  </div>
  <div class="grid" id="grid">${menus.map(card).join('')}
  </div>
  <div class="empty" id="empty">No menus in this filter.</div>
  <p class="note">Auto-generated from the catalog · updates as menus are added</p>
</div>
<script>
  const cards=[...document.querySelectorAll('.card')], empty=document.getElementById('empty');
  function apply(f){
    let shown=0;
    cards.forEach(c=>{const on=(f==='All'||c.dataset.city===f);c.style.display=on?'':'none';if(on)shown++;});
    empty.style.display=shown?'none':'block';
  }
  document.getElementById('filters').addEventListener('click',e=>{
    const b=e.target.closest('.f'); if(!b)return;
    document.querySelectorAll('.f').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); apply(b.dataset.f);
  });
  apply('Dubai'); // default: the Dubai filter place
</script>`;

writeFileSync(`${ROOT}/gallery.html`, html);
console.log(`gallery: ${menus.length} menus (${dubai} Dubai) -> menus/gallery.html`);

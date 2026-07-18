// Fuse all 948 menus into ClientOS MENUS tab. Reads pristine BEFORE copy, writes live index.html.
import fs from "node:fs";

const SCRATCH = "/private/tmp/claude-501/-Users-bero-bubble-pop-menu-sadah-outreach/b543cfdd-cb94-4111-b790-0dd3348b1caf/scratchpad";
const REAL = "/Users/bero/Desktop/05 🎯 CLIENTOS HQ/ClientOS/index.html";
const BEFORE = SCRATCH + "/index.before.html";
const PAYLOAD = "/Users/bero/bubble-pop/menu-sadah-outreach/singularity/clientos-menus-payload.json";

let s = fs.readFileSync(BEFORE, "utf8");
const pay = JSON.parse(fs.readFileSync(PAYLOAD, "utf8"));

// ---- parse existing SEED to map overlap names -> existing ids ----
const seedMatch = s.match(/var SEED=\/\*__SEED__\*\/(\[[\s\S]*?\]);/);
const SEED = JSON.parse(seedMatch[1]);
const norm = x => String(x || "").trim().toLowerCase().replace(/\s+/g, " ");
const nameToId = {};
SEED.forEach(l => { nameToId[norm(l.name)] = l.id; });

const typeLabel = {
  specialty_coffee: "☕ Specialty", family_cafe: "👪 Family", matcha_bar: "🍵 Matcha",
  dessert_cafe: "🍰 Dessert", roastery: "🔥 Roastery", bakery_cafe: "🥐 Bakery",
  tea_house: "🫖 Tea", gaming_cafe: "🎮 Gaming"
};

// ---- build fusion leads + menus ----
const fuseLeads = [];
const fuseMenus = {}; // id(string) -> {brand, gift, autoDark:false}
let overlap = 0, added = 0;
pay.forEach((p, i) => {
  const brand = (p.menuUrl || "").replace(/\/$/, "");
  const gift = (p.giftUrl || "").replace(/\/$/, "");
  const existId = nameToId[norm(p.name)];
  if (existId != null) {
    // overlap: reuse existing lead, just light up its menu (no duplicate lead)
    fuseMenus[String(existId)] = { brand, gift, autoDark: false };
    overlap++;
    return;
  }
  const id = 20000 + i;
  fuseLeads.push({
    id, name: p.name, name_ar: p.nameAr || "",
    area: p.area || p.city || "Riyadh",
    ig: p.social || "",
    stage: "To do",              // READY & not yet sent -> journeyStep()==2 ("Live, ready to send gift")
    mstatus: p.status,           // green/orange/red -> status bubble
    mstatusLabel: p.statusLabel || "",
    mtype: p.type || "",
    mtypeLabel: typeLabel[p.type] || (p.type || ""),
    dish: p.dish || "",
    mnx: true                    // marks payload-fused menu
  });
  fuseMenus[String(id)] = { brand, gift, autoDark: false };
  added++;
});
console.log(`payload=${pay.length} added_new_leads=${added} overlaps_reused=${overlap} menu_entries=${Object.keys(fuseMenus).length}`);

// ---- PATCH A: menuFor autoDark guard (suppress broken -mayfair night for payload) ----
s = replaceOnce(s,
  `if(m&&m.brand&&!m.dark)m.dark=m.brand+"-mayfair";`,
  `if(m&&m.brand&&!m.dark&&m.autoDark!==false)m.dark=m.brand+"-mayfair";`,
  "A:menuFor");

// ---- PATCH B: gift button in mnCard tray (reuses data-open handler => +5 XP) ----
s = replaceOnce(s,
  `+(m&&m.dark?'<button class="btn gh" data-open="'+m.dark+'">🌙 Night</button>':'')`,
  `+(m&&m.dark?'<button class="btn gh" data-open="'+m.dark+'">🌙 Night</button>':'')\n       +(m&&m.gift?'<button class="btn gh" data-open="'+m.gift+'">🎁 Gift</button>':'')`,
  "B:giftBtn");

// ---- PATCH C: status bubble in mnCard tags row ----
s = replaceOnce(s,
  `+rk.t+' · '+step+'/8</span></span>'`,
  `+rk.t+' · '+step+'/8</span>'+(l.mstatus?'<span class="mn-sb mn-sb-'+l.mstatus+'" title="'+esc(l.mstatusLabel||'')+'">●</span>':'')+'</span>'`,
  "C:statusBubble");

// ---- PATCH D: cap live-poll concurrency (948 parallel HEADs => thundering herd) ----
s = replaceOnce(s,
  `function menusLivePoll(){var dots=document.querySelectorAll('[data-livedot]');`,
  `function menusLivePoll(){var dots=[].slice.call(document.querySelectorAll('[data-livedot]'),0,40);`,
  "D:livePollCap");

// ---- PATCH E: filter globals + TYPELABEL (after MCTRY decl) ----
s = replaceOnce(s,
  `var MCTRY="ALL";try{var _mc0=localStorage.getItem("clientOS.ctry.v1");if(_mc0)MCTRY=_mc0;}catch(e){}`,
  `var MCTRY="ALL";try{var _mc0=localStorage.getItem("clientOS.ctry.v1");if(_mc0)MCTRY=_mc0;}catch(e){}\nvar MSTAT="ALL",MTYPE="ALL",MSEARCH="";\nfunction TYPELABEL(t){var M=${JSON.stringify(typeLabel)};return M[t]||t;}`,
  "E:globals");

// ---- PATCH F: apply filters in renderReady ----
s = replaceOnce(s,
`var ready=(cur==="ALL"?all.slice():all.filter(function(l){return ctryFor(l)===cur;}))
    .sort(function(a,b){return journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
`var ready=(cur==="ALL"?all.slice():all.filter(function(l){return ctryFor(l)===cur;}));
  if(MSTAT!=="ALL")ready=ready.filter(function(l){return (l.mstatus||"")===MSTAT;});
  if(MTYPE!=="ALL")ready=ready.filter(function(l){return (l.mtype||"")===MTYPE;});
  if(MSEARCH){var _q=MSEARCH.toLowerCase();ready=ready.filter(function(l){return (((l.name||"")+" "+(l.name_ar||"")+" "+(l.area||"")+" "+(l.mtypeLabel||"")).toLowerCase().indexOf(_q)>=0);});}
  ready=ready.sort(function(a,b){return journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
  "F:applyFilters");

// ---- PATCH G: inject status + type + search rails after the country rail ----
const railAnchor = `+order.map(function(c){return '<button class="mco'+(cur===c?" on":"")+'" data-mco="'+c+'"><em class="fl">'+(CTRY[c]||"🌍")+'</em> <b>'+cts[c]+'</b></button>';}).join("")+'</div>';`;
const railInject = railAnchor + `
  var _sc={green:0,orange:0,red:0};all.forEach(function(l){if(l.mstatus&&_sc[l.mstatus]!=null)_sc[l.mstatus]++;});
  if(_sc.green+_sc.orange+_sc.red>0){
    h+='<div class="mst-rail">'
      +'<button class="mst'+(MSTAT==="ALL"?" on":"")+'" data-mstat="ALL">All</button>'
      +'<button class="mst sbg'+(MSTAT==="green"?" on":"")+'" data-mstat="green">🟢 Ready <b>'+_sc.green+'</b></button>'
      +'<button class="mst sbo'+(MSTAT==="orange"?" on":"")+'" data-mstat="orange">🟠 Building <b>'+_sc.orange+'</b></button>'
      +'<button class="mst sbr'+(MSTAT==="red"?" on":"")+'" data-mstat="red">🔴 Needs work <b>'+_sc.red+'</b></button>'
      +'</div>';
    var _tc={};all.forEach(function(l){if(l.mtype)_tc[l.mtype]=(_tc[l.mtype]||0)+1;});
    var _tk=Object.keys(_tc).sort(function(a,b){return _tc[b]-_tc[a];});
    if(_tk.length){h+='<div class="mst-rail mty-rail"><button class="mst'+(MTYPE==="ALL"?" on":"")+'" data-mtype="ALL">All types</button>'+_tk.map(function(t){return '<button class="mst'+(MTYPE===t?" on":"")+'" data-mtype="'+t+'">'+esc(TYPELABEL(t))+' <b>'+_tc[t]+'</b></button>';}).join("")+'</div>';}
    h+='<div class="mn-search"><input id="mnSearch" placeholder="Search cafe, area, type…" value="'+esc(MSEARCH)+'" autocomplete="off"></div>';
  }`;
s = replaceOnce(s, railAnchor, railInject, "G:rails");

// ---- PATCH H: wire search input (after view innerHTML set in renderReady) ----
s = replaceOnce(s,
  `document.getElementById("view").innerHTML=h;\n  mwInit();\n  menusLivePoll();\n  fgTick();`,
  `document.getElementById("view").innerHTML=h;\n  var _si=document.getElementById("mnSearch");if(_si){_si.addEventListener("input",function(){MSEARCH=this.value;var _ss=this.selectionStart;renderReady();var _n=document.getElementById("mnSearch");if(_n){_n.focus();try{_n.setSelectionRange(_ss,_ss);}catch(e){}}});}\n  mwInit();\n  menusLivePoll();\n  fgTick();`,
  "H:searchWire");

// ---- PATCH I: click handlers for status/type filters (mirror data-mco) ----
s = replaceOnce(s,
  `var mc=e.target.closest("[data-mco]");if(mc){mctrySet(mc.getAttribute("data-mco"));window._mnStag=true;try{sTab();}catch(e8){}renderReady();e.stopPropagation();return;}`,
  `var mc=e.target.closest("[data-mco]");if(mc){mctrySet(mc.getAttribute("data-mco"));window._mnStag=true;try{sTab();}catch(e8){}renderReady();e.stopPropagation();return;}\n  var _ms=e.target.closest("[data-mstat]");if(_ms){MSTAT=_ms.getAttribute("data-mstat");window._mnStag=true;try{sTab();}catch(e){}renderReady();e.stopPropagation();return;}\n  var _mt=e.target.closest("[data-mtype]");if(_mt){MTYPE=_mt.getAttribute("data-mtype");window._mnStag=true;try{sTab();}catch(e){}renderReady();e.stopPropagation();return;}`,
  "I:filterHandlers");

// ---- PATCH J: CSS (before </head>) ----
const css = `<style id="clientos948">
.mn-sb{display:inline-block;width:9px;height:9px;line-height:9px;font-size:10px;border-radius:50%;vertical-align:middle;margin-left:2px;text-align:center}
.mn-sb-green{color:#12B894}.mn-sb-orange{color:#E0A030}.mn-sb-red{color:#D8574C}
.mst-rail{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px}
.mst{font:700 11px/1 inherit;color:var(--ink,#e8e2d6);background:rgba(255,255,255,.05);border:1px solid var(--hair,rgba(255,255,255,.12));border-radius:999px;padding:6px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
.mst b{opacity:.7;font-weight:800}
.mst.on{background:var(--gold,#E0A030);color:#1a1408;border-color:transparent}
.mst.sbg.on{background:#12B894;color:#04231b}.mst.sbo.on{background:#E0A030;color:#231804}.mst.sbr.on{background:#D8574C;color:#2a0d09}
.mty-rail{margin-top:4px}
.mn-search{margin:8px 0 10px}
.mn-search input{width:100%;box-sizing:border-box;font:600 13px/1.2 inherit;color:var(--ink,#e8e2d6);background:rgba(255,255,255,.05);border:1px solid var(--hair,rgba(255,255,255,.12));border-radius:12px;padding:10px 12px;outline:none}
.mn-search input:focus{border-color:var(--gold,#E0A030)}
</style>
</head>`;
s = replaceOnce(s, `</head>`, css, "J:css");

// ---- PATCH K: fusion IIFE (before var state=load();) ----
const iife = `/* __CLIENTOS_948_FUSION__ : ${added} new menu leads + ${Object.keys(fuseMenus).length} menu links */
(function(){try{
  var FUSE=${JSON.stringify(fuseLeads)};
  var FMENUS=${JSON.stringify(fuseMenus)};
  for(var i=0;i<FUSE.length;i++){SEED.push(FUSE[i]);}
  for(var k in FMENUS){if(FMENUS.hasOwnProperty(k))MENUS[k]=FMENUS[k];}
}catch(_e){try{console.error("948 fusion failed",_e);}catch(_x){}}})();
var state=load();`;
s = replaceOnce(s, `var state=load();`, iife, "K:iife");

fs.writeFileSync(REAL, s);
console.log("WROTE", REAL, "bytes:", s.length);

function replaceOnce(str, find, repl, tag) {
  const n = str.split(find).length - 1;
  if (n !== 1) { throw new Error(`[${tag}] expected exactly 1 match, found ${n}`); }
  console.log(`  ok ${tag}`);
  return str.replace(find, repl);
}

// Apply CLIENTOS-GRADES-SPEC: 4-grade system (purple ELITE) on MENUS cards, grade from payload.
import fs from "node:fs";
const REAL = "/Users/bero/Desktop/05 🎯 CLIENTOS HQ/ClientOS/index.html";
const PAYLOAD = "/Users/bero/bubble-pop/menu-sadah-outreach/singularity/clientos-menus-payload.json";
let s = fs.readFileSync(REAL, "utf8");
const pay = JSON.parse(fs.readFileSync(PAYLOAD, "utf8"));

function replaceOnce(str, find, repl, tag) {
  const n = str.split(find).length - 1;
  if (n !== 1) throw new Error(`[${tag}] expected 1 match, found ${n}`);
  console.log("  ok " + tag);
  return str.replace(find, repl);
}

// slug -> grade map
const MGRADE = {}; pay.forEach(p => { MGRADE[p.slug] = p.grade; });
console.log("MGRADE entries:", Object.keys(MGRADE).length);

// ---- 1. globals: MGRADE + GMETA + gradeFor + gord ----
s = replaceOnce(s,
  `var MSTAT="ALL",MTYPE="ALL",MSEARCH="";`,
  `var MSTAT="ALL",MTYPE="ALL",MSEARCH="";
var MGRADE=${JSON.stringify(MGRADE)};
var GMETA={purple:{c:"#8b5cf6",lab:"ELITE",ord:0},green:{c:"#12B894",lab:"READY",ord:1},orange:{c:"#E0A030",lab:"DEMO",ord:2},red:{c:"#E0574C",lab:"NEEDS WORK",ord:3}};
function gradeFor(l){var m=menuFor(l);if(!m||!m.brand)return "";var slug=String(m.brand).replace(/\\/+$/,"").split("/").pop();return MGRADE[slug]||"";}
function gord(l){var g=GMETA[gradeFor(l)];return g?g.ord:9;}`,
  "1:globals");

// ---- 2. sort: grade order first ----
s = replaceOnce(s,
  `ready=ready.sort(function(a,b){return journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
  `ready=ready.sort(function(a,b){return gord(a)-gord(b)||journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
  "2:sort");

// ---- 3. filter-apply: MSTAT now = grade ----
s = replaceOnce(s,
  `if(MSTAT!=="ALL")ready=ready.filter(function(l){return (l.mstatus||"")===MSTAT;});`,
  `if(MSTAT!=="ALL")ready=ready.filter(function(l){return gradeFor(l)===MSTAT;});`,
  "3:filter");

// ---- 4. rail: 4 grade chips ----
s = replaceOnce(s,
`var _sc={green:0,orange:0,red:0};all.forEach(function(l){if(l.mstatus&&_sc[l.mstatus]!=null)_sc[l.mstatus]++;});
  if(_sc.green+_sc.orange+_sc.red>0){
    h+='<div class="mst-rail">'
      +'<button class="mst'+(MSTAT==="ALL"?" on":"")+'" data-mstat="ALL">All</button>'
      +'<button class="mst sbg'+(MSTAT==="green"?" on":"")+'" data-mstat="green">🟢 Ready <b>'+_sc.green+'</b></button>'
      +'<button class="mst sbo'+(MSTAT==="orange"?" on":"")+'" data-mstat="orange">🟠 Building <b>'+_sc.orange+'</b></button>'
      +'<button class="mst sbr'+(MSTAT==="red"?" on":"")+'" data-mstat="red">🔴 Needs work <b>'+_sc.red+'</b></button>'
      +'</div>';`,
`var _gc={purple:0,green:0,orange:0,red:0};all.forEach(function(l){var _g=gradeFor(l);if(_gc[_g]!=null)_gc[_g]++;});
  if(_gc.purple+_gc.green+_gc.orange+_gc.red>0){
    h+='<div class="mst-rail">'
      +'<button class="mst'+(MSTAT==="ALL"?" on":"")+'" data-mstat="ALL">All</button>'
      +'<button class="mst gel'+(MSTAT==="purple"?" on":"")+'" data-mstat="purple">💜 Elite <b>'+_gc.purple+'</b></button>'
      +'<button class="mst gg'+(MSTAT==="green"?" on":"")+'" data-mstat="green">🟢 Ready <b>'+_gc.green+'</b></button>'
      +'<button class="mst go'+(MSTAT==="orange"?" on":"")+'" data-mstat="orange">🟠 Demo <b>'+_gc.orange+'</b></button>'
      +'<button class="mst gr'+(MSTAT==="red"?" on":"")+'" data-mstat="red">🔴 Needs work <b>'+_gc.red+'</b></button>'
      +'</div>';`,
  "4:rail");

// ---- 5. mnCard: grade-aware ----
function extractFn(name){const i=s.indexOf("function "+name+"(");let j=s.indexOf("{",i),d=0,k=j;for(;k<s.length;k++){if(s[k]==="{")d++;else if(s[k]==="}"){d--;if(d===0){k++;break;}}}return s.slice(i,k);}
const curCard = extractFn("mnCard");
const NEWCARD = `function mnCard(l,idx,stag){
    var m=menuFor(l)||{};var step=journeyStep(l);var rk=JRANK[step];
    var g=gradeFor(l);var gm=GMETA[g];var bcol=gm?gm.c:rk.c;
    var flag=CTRY[ctryFor(l)]||"🌍";var run=runFor(l);
    var P;
    if(step>=8)P={lab:"👑 Signed — view menu",cls:"signed",act:(m.brand?'data-open="'+m.brand+'"':'')};
    else if(step<=2)P={lab:"🎁 Send the gift",cls:"send",act:'data-sendgift="'+l.id+'"'};
    else if(step===3||step===4)P={lab:"↻ Nudge them",cls:"nudge",act:'data-copyfollow="'+l.id+'"'};
    else if(step===5)P={lab:"🎙 Close it",cls:"close",act:'data-reply="'+l.id+'"'};
    else P={lab:"👑 Sign them",cls:"sign",act:'data-jstep="'+l.id+'|7"'};
    var dots=JSTEPS.map(function(sx,i){return '<button class="mc-dot'+(i<step?" done":(i===step?" now":""))+'" data-jstep="'+l.id+'|'+i+'" style="--dc:'+JRANK[Math.min(i+1,8)].c+'" title="'+esc(sx.t)+'"></button>';}).join("");
    var meta=esc(l.area||"")+(l.mtypeLabel?' · '+esc(l.mtypeLabel):(l.ig?' · '+esc(l.ig):''));
    return '<div class="rdy-card mc2'+(g==="purple"?" elite":"")+(step>=8?" won":"")+(stag?" mc-in":"")+'" data-id="'+l.id+'" data-grade="'+g+'"'+(stag?' style="animation-delay:'+(Math.min(idx,14)*40)+'ms"':'')+'>'
     +(g==="purple"?'<span class="mc-elitebadge">✦ ELITE</span>':'')
     +'<div class="mc-top">'
      +'<span class="mc-bubble mn-ring'+(g?" gb-"+g:"")+'" style="--bc:'+bcol+'" data-livedot="'+(m.brand||"")+'"><b>'+flag+'</b>'+(step>=8?'<u>👑</u>':'')+'</span>'
      +'<span class="mc-names">'
       +'<span class="mc-en">'+esc(l.name)+'</span>'
       +(l.name_ar?'<span class="mc-ar" lang="ar" dir="rtl">'+esc(l.name_ar)+'</span>':'')
       +'<span class="mc-meta">'+meta+'</span>'
      +'</span>'
     +'</div>'
     +'<div class="mc-strip"><div class="mc-dots">'+dots+'</div>'+(gm?'<span class="mc-grade gd-'+g+'">'+gm.lab+'</span>':'')+'<span class="mc-stage">'+step+'/8</span>'+(run?'<span class="mc-bld"><i class="fg-ember"></i><b data-fgt="'+esc(run.slug)+'">'+fgLeft(run)+'</b></span>':'')+'</div>'
     +'<button class="mc-primary '+P.cls+'" '+P.act+'>'+P.lab+'</button>'
     +'<div class="mc-icons">'
      +'<button class="mc-ico mc-flash" data-mcopy="'+l.id+'|ar" title="Copy Arabic DM"><span>📋</span><em>ع</em></button>'
      +'<button class="mc-ico mc-flash" data-mcopy="'+l.id+'|en" title="Copy English DM"><span>📋</span><em>EN</em></button>'
      +(m.brand?'<button class="mc-ico" data-open="'+m.brand+'" title="Open live menu">▤</button>':'')
      +(m.gift?'<button class="mc-ico gift" data-open="'+m.gift+'" title="Open gift page">🎁</button>':'')
      +'<button class="mc-ico mc-morebtn" data-more="'+l.id+'" title="More">⋯</button>'
     +'</div>'
     +'<div class="mc-overflow">'
      +'<button class="mc-ico" data-chg="'+l.id+'" title="Edit">✏️</button>'
      +(m.brand?'<button class="mc-ico" data-share="'+m.brand+'" title="Copy link">🔗</button>':'')
      +(l.ig?'<button class="mc-ico" data-ig="'+l.id+'" title="Instagram">📸</button>':'')
      +'<button class="mc-ico" data-unorev="'+l.id+'" title="Uno reverse">🔄</button>'
     +'</div>'
    +'</div>';
}`;
s = replaceOnce(s, curCard, NEWCARD, "5:mnCard");

// ---- 6. grades CSS ----
const CSS = `<style id="clientos-grades">
.rdy-card.mc2{position:relative}
.mc-grade{font:800 9px/1 var(--sans);letter-spacing:.13em;text-transform:uppercase;padding:3px 6px;border-radius:6px}
.mc-grade.gd-purple{color:#7c3aed;background:rgba(139,92,246,.14)}
.mc-grade.gd-green{color:#0e9c7e;background:rgba(18,184,148,.14)}
.mc-grade.gd-orange{color:#b9791b;background:rgba(224,160,48,.16)}
.mc-grade.gd-red{color:#c33f34;background:rgba(224,87,76,.14)}
.mc-bubble.gb-green{--bc:#12B894}.mc-bubble.gb-orange{--bc:#E0A030}.mc-bubble.gb-red{--bc:#E0574C}
.mc-bubble.gb-purple{background:radial-gradient(120% 120% at 32% 26%,#c4b5fd 0%,#8b5cf6 45%,#6d28d9 100%);box-shadow:inset 0 2px 5px rgba(255,255,255,.5),inset 0 -6px 12px rgba(0,0,0,.16),0 0 16px rgba(139,92,246,.5)}
@media(prefers-reduced-motion:no-preference){.mc-bubble.gb-green{animation:mcPulse 2.4s var(--mc-ease) infinite}}
.rdy-card.elite{border:1px solid rgba(167,139,250,.4);box-shadow:0 0 18px rgba(139,92,246,.33),0 6px 18px rgba(70,55,30,.06)}
@media(prefers-reduced-motion:no-preference){.rdy-card.elite{animation:eliteBreathe 3s var(--mc-ease) infinite}.rdy-card.mc2.elite.mc-in{animation:mcIn .42s var(--mc-ease) both,eliteBreathe 3s var(--mc-ease) .42s infinite}}
@keyframes eliteBreathe{0%,100%{box-shadow:0 0 11px rgba(139,92,246,.2),0 6px 18px rgba(70,55,30,.06)}50%{box-shadow:0 0 24px rgba(139,92,246,.48),0 6px 18px rgba(70,55,30,.06)}}
.mc-elitebadge{position:absolute;top:13px;right:14px;z-index:2;font:800 8.5px/1 var(--sans);letter-spacing:.12em;color:#7c3aed;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.28);padding:4px 8px;border-radius:999px}
.mst.gel.on{background:#8b5cf6;color:#fff;border-color:transparent}
.mst.gg.on{background:#12B894;color:#04231b;border-color:transparent}
.mst.go.on{background:#E0A030;color:#231804;border-color:transparent}
.mst.gr.on{background:#E0574C;color:#2a0d09;border-color:transparent}
</style>
</head>`;
s = replaceOnce(s, `</head>`, CSS, "6:css");

fs.writeFileSync(REAL, s);
console.log("WROTE", REAL, "bytes:", s.length);

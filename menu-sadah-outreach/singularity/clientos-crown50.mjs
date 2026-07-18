// CROWN-50: masterpiece tier on MENUS cards (crown treatment, sort below elite, filter chip).
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
// slug -> 1 for masterpiece cafes
const MMASTER = {};
pay.forEach(p => { if (p.masterpiece === true) MMASTER[p.slug] = 1; });
console.log("MMASTER entries:", Object.keys(MMASTER).length);

// 1. globals: MMASTER + masterFor + srank (after MDMfor)
s = replaceOnce(s,
  `return MDM[slug]||null;}`,
  `return MDM[slug]||null;}
var MMASTER=${JSON.stringify(MMASTER)};
function masterFor(l){var m=menuFor(l);if(!m||!m.brand)return false;var slug=String(m.brand).replace(/\\/+$/,"").split("/").pop();return !!MMASTER[slug];}
function srank(l){var g=gradeFor(l);if(g==="purple")return 0;if(masterFor(l))return 0.5;return gord(l);}`,
  "1:globals");

// 2. sort: masterpieces just below elite
s = replaceOnce(s,
  `ready=ready.sort(function(a,b){return gord(a)-gord(b)||journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
  `ready=ready.sort(function(a,b){return srank(a)-srank(b)||journeyStep(b)-journeyStep(a)||(b.score||0)-(a.score||0);});`,
  "2:sort");

// 3. filter apply: MSTAT "master"
s = replaceOnce(s,
  `if(MSTAT!=="ALL")ready=ready.filter(function(l){return gradeFor(l)===MSTAT;});`,
  `if(MSTAT==="master")ready=ready.filter(function(l){return masterFor(l);});else if(MSTAT!=="ALL")ready=ready.filter(function(l){return gradeFor(l)===MSTAT;});`,
  "3:filter");

// 4. rail: count masters
s = replaceOnce(s,
  `var _gc={purple:0,green:0,orange:0,red:0};all.forEach(function(l){var _g=gradeFor(l);if(_gc[_g]!=null)_gc[_g]++;});`,
  `var _gc={purple:0,green:0,orange:0,red:0};all.forEach(function(l){var _g=gradeFor(l);if(_gc[_g]!=null)_gc[_g]++;});var _mcr=0;all.forEach(function(l){if(masterFor(l)&&gradeFor(l)!=="purple")_mcr++;});`,
  "4:count");

// 5. rail: crown chip after Elite chip
s = replaceOnce(s,
  `data-mstat="purple">💜 Elite <b>'+_gc.purple+'</b></button>'`,
  `data-mstat="purple">💜 Elite <b>'+_gc.purple+'</b></button>'
      +'<button class="mst gcrown'+(MSTAT==="master"?" on":"")+'" data-mstat="master">👑 <b>'+_mcr+'</b></button>'`,
  "5:crown-chip");

// 6. mnCard: crown-aware
const cur = fs.readFileSync("/private/tmp/claude-501/-Users-bero-bubble-pop-menu-sadah-outreach/b543cfdd-cb94-4111-b790-0dd3348b1caf/scratchpad/mncard_now.txt", "utf8");
const NEW = `function mnCard(l,idx,stag){
    var m=menuFor(l)||{};var step=journeyStep(l);var rk=JRANK[step];
    var g=gradeFor(l);var gm=GMETA[g];var bcol=gm?gm.c:rk.c;
    var crown=(typeof masterFor==="function")&&masterFor(l)&&g!=="purple";
    var flag=CTRY[ctryFor(l)]||"🌍";var run=runFor(l);
    var P;
    if(step>=8)P={lab:"👑 Signed — view menu",cls:"signed",act:(m.brand?'data-open="'+m.brand+'"':'')};
    else if(step<=2)P={lab:"🎁 Send the gift",cls:"send",act:'data-sendgift="'+l.id+'"'};
    else if(step===3||step===4)P={lab:"↻ Nudge them",cls:"nudge",act:'data-copyfollow="'+l.id+'"'};
    else if(step===5)P={lab:"🎙 Close it",cls:"close",act:'data-reply="'+l.id+'"'};
    else P={lab:"👑 Sign them",cls:"sign",act:'data-jstep="'+l.id+'|7"'};
    var dots=JSTEPS.map(function(sx,i){return '<button class="mc-dot'+(i<step?" done":(i===step?" now":""))+'" data-jstep="'+l.id+'|'+i+'" style="--dc:'+JRANK[Math.min(i+1,8)].c+'" title="'+esc(sx.t)+'"></button>';}).join("");
    var meta=esc(l.area||"")+(l.mtypeLabel?' · '+esc(l.mtypeLabel):(l.ig?' · '+esc(l.ig):''));
    return '<div class="rdy-card mc2'+(g==="purple"?" elite":(crown?" crown":""))+(step>=8?" won":"")+(stag?" mc-in":"")+'" data-id="'+l.id+'" data-grade="'+g+'"'+(crown?' data-master="1"':'')+(stag?' style="animation-delay:'+(Math.min(idx,14)*40)+'ms"':'')+'>'
     +(g==="purple"?'<span class="mc-elitebadge">✦ ELITE</span>':(crown?'<span class="mc-crownbadge">👑 MASTERPIECE</span>':''))
     +'<div class="mc-top">'
      +'<span class="mc-bubble mn-ring'+(crown?" gb-crown":(g?" gb-"+g:""))+'" style="--bc:'+bcol+'" data-livedot="'+(m.brand||"")+'"><b>'+flag+'</b>'+(step>=8?'<u>👑</u>':'')+'</span>'
      +'<span class="mc-names">'
       +'<span class="mc-en">'+esc(l.name)+'</span>'
       +(l.name_ar?'<span class="mc-ar" lang="ar" dir="rtl">'+esc(l.name_ar)+'</span>':'')
       +'<span class="mc-meta">'+meta+'</span>'
      +'</span>'
     +'</div>'
     +'<div class="mc-strip"><div class="mc-dots">'+dots+'</div>'+(crown?'<span class="mc-grade gd-crown">👑 MASTERPIECE</span>':(gm?'<span class="mc-grade gd-'+g+'">'+gm.lab+'</span>':''))+'<span class="mc-stage">'+step+'/8</span>'+(run?'<span class="mc-bld"><i class="fg-ember"></i><b data-fgt="'+esc(run.slug)+'">'+fgLeft(run)+'</b></span>':'')+'</div>'
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
s = replaceOnce(s, cur, NEW, "6:mnCard");

// 7. CSS
const CSS = `<style id="clientos-crown">
.rdy-card.crown{border:1px solid rgba(224,160,48,.55);box-shadow:0 0 0 1px rgba(224,160,48,.22),0 0 20px rgba(224,160,48,.3),0 0 26px rgba(139,92,246,.15),0 6px 18px rgba(70,55,30,.06)}
@media(prefers-reduced-motion:no-preference){.rdy-card.crown{animation:crownBreathe 3.2s var(--mc-ease) infinite}.rdy-card.mc2.crown.mc-in{animation:mcIn .42s var(--mc-ease) both,crownBreathe 3.2s var(--mc-ease) .42s infinite}}
@keyframes crownBreathe{0%,100%{box-shadow:0 0 0 1px rgba(224,160,48,.2),0 0 12px rgba(224,160,48,.2),0 0 16px rgba(139,92,246,.1),0 6px 18px rgba(70,55,30,.06)}50%{box-shadow:0 0 0 1px rgba(224,160,48,.42),0 0 26px rgba(224,160,48,.44),0 0 30px rgba(139,92,246,.22),0 6px 18px rgba(70,55,30,.06)}}
.mc-crownbadge{position:absolute;top:13px;right:14px;z-index:2;font:800 8.5px/1 var(--sans);letter-spacing:.1em;color:#7a4e0a;background:linear-gradient(100deg,rgba(224,160,48,.24),rgba(139,92,246,.2));border:1px solid rgba(224,160,48,.45);padding:4px 8px;border-radius:999px;white-space:nowrap}
.mc-bubble.gb-crown{background:radial-gradient(120% 120% at 32% 26%,#f7e6b8 0%,#e0a030 42%,#8b5cf6 108%);box-shadow:inset 0 2px 5px rgba(255,255,255,.55),inset 0 -6px 12px rgba(0,0,0,.16),0 0 16px rgba(224,160,48,.5)}
.mc-grade.gd-crown{color:#7a4e0a;background:linear-gradient(100deg,rgba(224,160,48,.22),rgba(139,92,246,.16));letter-spacing:.09em}
.mst.gcrown{border-color:rgba(224,160,48,.4)}
.mst.gcrown.on{background:linear-gradient(100deg,#e0a030,#8b5cf6);color:#fff;border-color:transparent}
</style>
</head>`;
s = replaceOnce(s, `</head>`, CSS, "7:css");

fs.writeFileSync(REAL, s);
console.log("WROTE", REAL, "bytes:", s.length);

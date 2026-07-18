// Apply CLIENTOS-CARDS-SPEC to the MENUS tab + fix gift/menu URLs to exact payload fields.
// Edits the LIVE index.html in place (keeps prior filter/status patches).
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

// ---------- JOB B: FMENUS exact URLs (matched by slug, IDs preserved) ----------
const bySlug = {}, byName = {};
const norm = x => String(x || "").trim().toLowerCase().replace(/\s+/g, " ");
pay.forEach(p => { bySlug[p.slug] = p; byName[norm(p.name)] = p; });
// id -> name from FUSE leads (for name fallback)
const fuseM = s.match(/var FUSE=(\[[\s\S]*?\]);\n  var FMENUS=/);
const FUSE = JSON.parse(fuseM[1]);
const idName = {}; FUSE.forEach(l => { idName[String(l.id)] = l.name; });
const fmM = s.match(/var FMENUS=(\{[\s\S]*?\});\n  for\(var i/);
const FMENUS = JSON.parse(fmM[1]);
let matched = 0, missed = [];
for (const id in FMENUS) {
  const cur = FMENUS[id];
  const slug = String(cur.brand || "").split("/").filter(Boolean).pop();
  let p = bySlug[slug] || byName[norm(idName[id] || "")];
  if (!p) { missed.push(id + ":" + slug); continue; }
  FMENUS[id] = { brand: p.menuUrl, gift: p.giftUrl, send: p.giftUrl, autoDark: false };
  matched++;
}
console.log(`FMENUS matched=${matched} missed=${missed.length}` + (missed.length ? " -> " + missed.slice(0, 8).join(",") : ""));
s = replaceOnce(s, fmM[0], "var FMENUS=" + JSON.stringify(FMENUS) + ";\n  for(var i", "B:FMENUS-exact");

// ---------- JOB A: new mnCard per spec ----------
const NEWCARD = `function mnCard(l,idx,stag){
    var m=menuFor(l)||{};var step=journeyStep(l);var rk=JRANK[step];
    var st=l.mstatus||(step>=8?"green":"");
    var bcol=l.mstatus?({green:"#12B894",orange:"#E0A030",red:"#E0574C"}[l.mstatus]||rk.c):rk.c;
    var flag=CTRY[ctryFor(l)]||"🌍";var run=runFor(l);
    var P;
    if(step>=8)P={lab:"👑 Signed — view menu",cls:"signed",act:(m.brand?'data-open="'+m.brand+'"':'')};
    else if(step<=2)P={lab:"🎁 Send the gift",cls:"send",act:'data-sendgift="'+l.id+'"'};
    else if(step===3||step===4)P={lab:"↻ Nudge them",cls:"nudge",act:'data-copyfollow="'+l.id+'"'};
    else if(step===5)P={lab:"🎙 Close it",cls:"close",act:'data-reply="'+l.id+'"'};
    else P={lab:"👑 Sign them",cls:"sign",act:'data-jstep="'+l.id+'|7"'};
    var dots=JSTEPS.map(function(sx,i){return '<button class="mc-dot'+(i<step?" done":(i===step?" now":""))+'" data-jstep="'+l.id+'|'+i+'" style="--dc:'+JRANK[Math.min(i+1,8)].c+'" title="'+esc(sx.t)+'"></button>';}).join("");
    var meta=esc(l.area||"")+(l.mtypeLabel?' · '+esc(l.mtypeLabel):(l.ig?' · '+esc(l.ig):''));
    return '<div class="rdy-card mc2'+(step>=8?" won":"")+(stag?" mc-in":"")+'" data-id="'+l.id+'"'+(stag?' style="animation-delay:'+(Math.min(idx,14)*40)+'ms"':'')+'>'
     +'<div class="mc-top">'
      +'<span class="mc-bubble mn-ring'+(st?" st-"+st:"")+'" style="--bc:'+bcol+'" data-livedot="'+(m.brand||"")+'"><b>'+flag+'</b>'+(step>=8?'<u>👑</u>':'')+'</span>'
      +'<span class="mc-names">'
       +'<span class="mc-en">'+esc(l.name)+'</span>'
       +(l.name_ar?'<span class="mc-ar" lang="ar" dir="rtl">'+esc(l.name_ar)+'</span>':'')
       +'<span class="mc-meta">'+meta+'</span>'
      +'</span>'
     +'</div>'
     +'<div class="mc-strip"><div class="mc-dots">'+dots+'</div><span class="mc-stage">'+esc(rk.t)+' · '+step+'/8</span>'+(run?'<span class="mc-bld"><i class="fg-ember"></i><b data-fgt="'+esc(run.slug)+'">'+fgLeft(run)+'</b></span>':'')+'</div>'
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
// replace whole mnCard function
const curCard = fs.readFileSync("/private/tmp/claude-501/-Users-bero-bubble-pop-menu-sadah-outreach/b543cfdd-cb94-4111-b790-0dd3348b1caf/scratchpad/current_mncard.txt", "utf8");
s = replaceOnce(s, curCard, NEWCARD, "A:mnCard");

// ---------- grid: .rdy-list -> responsive breakout grid ----------
s = replaceOnce(s,
  `.rdy-list{display:flex;flex-direction:column;gap:10px}`,
  `.rdy-list{--mw:min(1160px,calc(100vw - 34px));width:var(--mw);position:relative;left:50%;transform:translateX(-50%);display:grid;grid-template-columns:1fr;gap:16px;margin:12px 0 4px}
@media(min-width:760px){.rdy-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1180px){.rdy-list{grid-template-columns:repeat(3,minmax(0,1fr))}}`,
  "A:grid");

// ---------- confetti hook on stage-advance to signed ----------
s = replaceOnce(s,
  `var rg=re.querySelector(".mn-ring");if(rg)rg.classList.add("pop");`,
  `var rg=re.querySelector(".mn-ring");if(rg)rg.classList.add("pop");try{if(journeyStep(jl)>=8&&window.mcConfetti)mcConfetti(re);}catch(_c){}`,
  "A:confettiHook");

// ---------- CSS block ----------
const CSS = `<style id="clientos-cards">
:root{--mc-ease:cubic-bezier(.16,1,.3,1);--mc-spring:cubic-bezier(.2,1.6,.4,1)}
.rdy-card.mc2{background:var(--surf2);border:1px solid var(--hair);border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:13px;box-shadow:0 1px 2px rgba(70,55,30,.05),0 6px 18px rgba(70,55,30,.06);transition:transform .16s ease-out,box-shadow .16s ease-out,border-color .2s;will-change:transform}
@media(prefers-reduced-motion:no-preference){.rdy-card.mc2:hover{transform:translateY(-3px);box-shadow:0 3px 6px rgba(70,55,30,.07),0 14px 34px rgba(70,55,30,.12)}}
.rdy-card.mc2.won{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold),0 10px 28px rgba(224,160,48,.22)}
.mc-top{display:flex;align-items:center;gap:13px}
.mc-bubble{position:relative;flex:none;width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-size:24px;
  background:radial-gradient(120% 120% at 32% 26%,color-mix(in srgb,var(--bc) 42%,#fff) 0%,var(--bc) 62%,color-mix(in srgb,var(--bc) 72%,#000) 100%);
  box-shadow:inset 0 2px 5px rgba(255,255,255,.5),inset 0 -6px 12px rgba(0,0,0,.14),0 4px 12px color-mix(in srgb,var(--bc) 40%,transparent)}
.mc-bubble b{filter:drop-shadow(0 1px 1px rgba(0,0,0,.25));line-height:1}
.mc-bubble u{position:absolute;right:-2px;top:-4px;font-size:15px;text-decoration:none}
.mc-bubble::after{content:"";position:absolute;right:-3px;bottom:-3px;width:20px;height:20px;border-radius:50%;background:var(--surf2);box-shadow:0 1px 3px rgba(0,0,0,.18)}
.mc-bubble.st-green{--bc:#12B894}.mc-bubble.st-orange{--bc:#E0A030}.mc-bubble.st-red{--bc:#E0574C}
@media(prefers-reduced-motion:no-preference){.mc-bubble.st-green{animation:mcPulse 2.4s var(--mc-ease) infinite}}
@keyframes mcPulse{0%,100%{box-shadow:inset 0 2px 5px rgba(255,255,255,.5),inset 0 -6px 12px rgba(0,0,0,.14),0 0 0 0 rgba(18,184,148,.42)}50%{box-shadow:inset 0 2px 5px rgba(255,255,255,.5),inset 0 -6px 12px rgba(0,0,0,.14),0 0 0 9px rgba(18,184,148,0)}}
.mc-bubble.pop{animation:mcBurst .38s var(--mc-ease)}
@keyframes mcBurst{0%{box-shadow:0 0 0 0 rgba(224,160,48,.55)}100%{box-shadow:0 0 0 22px rgba(224,160,48,0)}}
.mc-names{min-width:0;display:flex;flex-direction:column;gap:1px}
.mc-en{font-family:var(--serif);font-weight:700;font-size:17px;line-height:1.15;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-ar{font-family:var(--ar);font-size:14px;line-height:1.2;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-meta{font-size:11.5px;color:var(--dim);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-strip{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mc-dots{display:flex;gap:4px}
.mc-dot{width:14px;height:6px;border-radius:99px;border:0;padding:0;background:var(--hair);cursor:pointer;transition:transform .18s var(--mc-spring),background .2s}
.mc-dot.done{background:var(--dc)}.mc-dot.now{background:var(--dc);box-shadow:0 0 0 2px color-mix(in srgb,var(--dc) 35%,transparent)}
.mc-dot:hover{transform:scaleY(1.5)}
.mc-stage{font:700 10.5px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.mc-bld{display:inline-flex;align-items:center;gap:4px;font:700 10px/1 var(--sans);color:var(--gold)}
.mc-primary{height:44px;border:0;border-radius:999px;font-family:var(--sans);font-weight:800;font-size:14.5px;cursor:pointer;color:#fff;background:linear-gradient(180deg,color-mix(in srgb,var(--gold) 86%,#fff),var(--gold));box-shadow:0 4px 12px rgba(224,160,48,.32);transition:transform .24s var(--mc-spring),box-shadow .2s,background .2s}
.mc-primary:active{transform:scale(.95)}
.mc-primary.nudge{background:transparent;color:var(--gold);border:1.5px solid var(--gold);box-shadow:none}
.mc-primary.close{background:linear-gradient(180deg,color-mix(in srgb,var(--sky) 86%,#fff),var(--sky));box-shadow:0 4px 12px rgba(76,144,230,.3)}
.mc-primary.signed{background:linear-gradient(180deg,#F3D27A,var(--gold));color:#3a2c07;box-shadow:0 4px 14px rgba(224,160,48,.4)}
.mc-primary.mc-ok{background:var(--mint)!important;box-shadow:0 4px 12px rgba(18,184,148,.34)!important}
.mc-icons,.mc-overflow{display:flex;justify-content:center;align-items:center;gap:8px}
.mc-overflow{max-height:0;overflow:hidden;opacity:0;transition:max-height .28s var(--mc-ease),opacity .2s,margin .28s}
.rdy-card.mc-open .mc-overflow{max-height:60px;opacity:1;margin-top:2px}
.mc-ico{position:relative;width:34px;height:34px;flex:none;border-radius:50%;border:1px solid var(--hair);background:var(--surf);color:var(--ink);font-size:15px;line-height:1;display:grid;place-items:center;cursor:pointer;transition:transform .2s var(--mc-spring),background .18s,color .18s,border-color .18s}
.mc-ico em{position:absolute;right:-2px;bottom:-3px;font-style:normal;font-size:8px;font-weight:800;background:var(--ink);color:var(--surf2);border-radius:6px;padding:1px 3px;letter-spacing:.02em}
.mc-ico:hover{background:var(--gold);color:#fff;border-color:transparent;transform:translateY(-1px)}
.mc-ico:active{transform:scale(.9)}
.mc-ico.gift:hover{background:var(--rose)}
.mc-ico.mc-ok{background:var(--mint);color:#fff;border-color:transparent}
.mc-ico.mc-ok::before{content:"✓";position:absolute;inset:0;display:grid;place-items:center;font-size:16px;background:var(--mint);border-radius:50%}
@media(prefers-reduced-motion:no-preference){.rdy-card.mc-in{animation:mcIn .42s var(--mc-ease) both}}
@keyframes mcIn{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:none}}
.mc-confetti{position:fixed;width:8px;height:12px;pointer-events:none;z-index:9999;border-radius:2px}
</style>
</head>`;
s = replaceOnce(s, `</head>`, CSS, "A:css");

// ---------- appended behaviour script (separate document listener) ----------
const SCRIPT = `<script>
(function(){
 function mcOk(btn){try{if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;}catch(_){}btn.classList.add("mc-ok");setTimeout(function(){btn.classList.remove("mc-ok");},900);}
 window.mcOk=mcOk;
 window.mcConfetti=function(card){try{if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;}catch(_){}
   var r=card.getBoundingClientRect();var cx=r.left+r.width/2,cy=r.top+r.height/2;var cols=["#E0A030","#F3D27A","#12B894","#4C90E6","#F26A8D"];
   for(var i=0;i<40;i++){(function(i){var d=document.createElement("div");d.className="mc-confetti";d.style.background=cols[i%cols.length];d.style.left=cx+"px";d.style.top=cy+"px";document.body.appendChild(d);
     var ang=(i/40)*Math.PI*2,vel=120+((i*53)%140),dx=Math.cos(ang)*vel,dy=Math.sin(ang)*vel-60;
     d.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:"translate("+dx+"px,"+(dy+220)+"px) rotate("+(360+i*20)+"deg)",opacity:0}],{duration:1200,easing:"cubic-bezier(.16,1,.3,1)"});
     setTimeout(function(){d.remove();},1250);})(i);}
   try{sfx("success");}catch(_){}};
 document.addEventListener("click",function(e){
   if(!e.target.closest)return;
   var sg=e.target.closest("[data-sendgift]");
   if(sg){var l=byId(sg.getAttribute("data-sendgift"));if(l){var mr=menuReveal(l);copy(mr.ar);var m=menuFor(l)||{};if(m.gift)window.open(m.gift,"_blank");if(l.stage==="To do")l.stage="DM sent";if(!l.menuXp){l.menuXp=1;try{awardXP(30,"gift sent");}catch(_){}}l.menuSent=Date.now();l.lastTouch=Date.now();save();try{sfx("success");}catch(_){}mcOk(sg);try{toast("Gift copied + opened · "+l.name);}catch(_){}}return;}
   var mo=e.target.closest("[data-more]");
   if(mo&&mo.classList.contains("mc-morebtn")){var card=mo.closest(".rdy-card");if(card)card.classList.toggle("mc-open");return;}
   var fl=e.target.closest(".mc-flash");
   if(fl)mcOk(fl);
 },false);
})();
</script>
</body>`;
s = replaceOnce(s, `</body>`, SCRIPT, "A:script");

fs.writeFileSync(REAL, s);
console.log("WROTE", REAL, "bytes:", s.length);

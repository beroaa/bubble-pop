// MENU SADAH — LUXE tier renderer (v4 "twin" template).
// Every cafe renders in its OWN brand palette (lib/brand-theme.mjs) with a
// cinematic glow treatment: layered light orbs, glossy medallion, soft colored
// shadows on the illustrated art. Photo-ready slots remain (drop real photos
// into dist/assets/photos/<key>.jpg on hosting and every luxe menu upgrades).
import { CONTACT } from '../cafes.mjs';
import { brandTheme } from './brand-theme.mjs';

const SAR = '﷼';

/* ---------- illustrated art (inline SVG, keyed, theme-tinted) ---------- */
export const ART = {
  espresso: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.accent}"/><stop offset="1" stop-color="${T.deep}"/></linearGradient></defs><path d="M30 55h52v28a14 14 0 0 1-14 14H44a14 14 0 0 1-14-14z" fill="url(#ge)"/><path d="M82 58h10a10 10 0 0 1 0 20h-8" fill="none" stroke="${T.accent}" stroke-width="5"/><ellipse cx="56" cy="55" rx="26" ry="5" fill="${T.accent2}"/><path d="M46 20c-4 8 4 10 0 18M60 16c-4 8 4 10 0 18M74 20c-4 8 4 10 0 18" stroke="${T.text2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="56" cy="104" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  latte: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5efe6"/><stop offset=".45" stop-color="${T.accent2}"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M38 24h44l-5 74a10 10 0 0 1-10 9H53a10 10 0 0 1-10-9z" fill="url(#gl)"/><path d="M38 24h44l-1.2 18H39.2z" fill="#fff" opacity=".85"/><path d="M52 42c4-6 12-6 16 0-6 4-10 4-16 0z" fill="${T.accent}" opacity=".7"/><ellipse cx="60" cy="24" rx="22" ry="4.5" fill="#fff"/><ellipse cx="60" cy="111" rx="26" ry="4" fill="#000" opacity=".3"/></svg>`,
  v60: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M28 30h64l-22 34h-20z" fill="none" stroke="${T.accent}" stroke-width="5"/><path d="M40 36h40l-15 23h-10z" fill="${T.accent}" opacity=".35"/><path d="M60 66v12" stroke="${T.text2}" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M36 84h48v6a16 16 0 0 1-16 16H52a16 16 0 0 1-16-16z" fill="${T.accent}"/><path d="M84 86h8a8 8 0 0 1 0 16h-6" fill="none" stroke="${T.accent}" stroke-width="4"/><ellipse cx="60" cy="108" rx="28" ry="4" fill="#000" opacity=".3"/></svg>`,
  cold: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.accent2}" stop-opacity=".5"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M40 22h40l-4 78a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8z" fill="url(#gc)" opacity=".9"/><rect x="46" y="34" width="13" height="13" rx="3" fill="#fff" opacity=".7" transform="rotate(12 52 40)"/><rect x="60" y="52" width="13" height="13" rx="3" fill="#fff" opacity=".55" transform="rotate(-14 66 58)"/><rect x="48" y="70" width="12" height="12" rx="3" fill="#fff" opacity=".45" transform="rotate(8 54 76)"/><path d="M74 14 60 46" stroke="${T.text2}" stroke-width="4" stroke-linecap="round"/><ellipse cx="60" cy="112" rx="24" ry="4" fill="#000" opacity=".3"/></svg>`,
  matcha: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gm" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#a8c88a"/><stop offset="1" stop-color="#5f7f43"/></radialGradient></defs><path d="M26 52h68a34 26 0 0 1-68 0z" fill="url(#gm)"/><ellipse cx="60" cy="52" rx="34" ry="8" fill="#c2dca4"/><path d="M50 48c3 2 17 2 20 0" stroke="#5f7f43" stroke-width="3" fill="none" opacity=".6"/><path d="M84 24c2 8-2 14-6 18M90 28c1 6-2 11-5 14M78 22c1 7-3 13-6 16" stroke="${T.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="94" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  croissant: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gcr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0cf8f"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M20 74c4-18 20-32 40-32s36 14 40 32c-6 8-16 8-22 2-4-10-12-16-18-16s-14 6-18 16c-6 6-16 6-22-2z" fill="url(#gcr)"/><path d="M45 46 38 70M60 42v26M75 46l7 24" stroke="${T.deep}" stroke-width="3" opacity=".5" stroke-linecap="round"/><ellipse cx="60" cy="88" rx="34" ry="4" fill="#000" opacity=".3"/></svg>`,
  cake: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2e0c8"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M34 50h52v38a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z" fill="url(#gk)"/><path d="M34 62h52M34 76h52" stroke="${T.deep}" stroke-width="5" opacity=".5"/><path d="M34 50c8-8 18-12 26-12s18 4 26 12c-8 5-17 7-26 7s-18-2-26-7z" fill="${T.accent2}"/><circle cx="60" cy="34" r="5" fill="#e25c5c"/><ellipse cx="60" cy="100" rx="32" ry="4" fill="#000" opacity=".3"/></svg>`,
  teapot: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M34 52h48a24 24 0 0 1-48 0z" fill="${T.accent}"/><path d="M34 52a24 24 0 0 0 48 0" fill="none" stroke="${T.deep}" stroke-width="2" opacity=".4"/><path d="M82 54c8-2 14 2 14 8s-6 10-12 8" fill="none" stroke="${T.accent}" stroke-width="5"/><path d="M34 56c-8-4-12-12-8-20l12 8" fill="${T.accent}"/><rect x="52" y="34" width="16" height="10" rx="4" fill="${T.accent}"/><circle cx="60" cy="30" r="5" fill="${T.accent2}"/><ellipse cx="60" cy="84" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  burger: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M28 52a32 22 0 0 1 64 0z" fill="#f0cf8f"/><circle cx="48" cy="42" r="2.4" fill="#fff"/><circle cx="62" cy="38" r="2.4" fill="#fff"/><circle cx="74" cy="44" r="2.4" fill="#fff"/><rect x="26" y="54" width="68" height="9" rx="4.5" fill="#7fa356"/><rect x="24" y="65" width="72" height="12" rx="6" fill="${T.accent}"/><rect x="28" y="79" width="64" height="13" rx="6.5" fill="#f0cf8f"/><ellipse cx="60" cy="98" rx="34" ry="4" fill="#000" opacity=".3"/></svg>`,
  beans: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M34 44h52l-6 56H40z" fill="${T.accent}" opacity=".85"/><path d="M34 44h52l-2 12H36z" fill="${T.deep}"/><path d="M46 30c0-8 28-8 28 0v14H46z" fill="none" stroke="${T.accent}" stroke-width="5"/><g fill="#5a3d1e"><ellipse cx="52" cy="74" rx="7" ry="10" transform="rotate(-20 52 74)"/><ellipse cx="68" cy="80" rx="7" ry="10" transform="rotate(15 68 80)"/></g><path d="M49 70c2 3 4 6 3 9M66 76c2 3 3 6 2 9" stroke="${T.accent2}" stroke-width="2" fill="none"/><ellipse cx="60" cy="104" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  saudi: (T) => `<svg class="dlh-svg" role="button" tabindex="0" aria-label="اسمع صوت صب القهوة · pour sound" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-linejoin="round" stroke-linecap="round"><defs><linearGradient id="dBody" x1=".28" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#f7e6ab"/><stop offset=".26" stop-color="#e6bd5c"/><stop offset=".58" stop-color="#c6902c"/><stop offset="1" stop-color="#785318"/></linearGradient><linearGradient id="dGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#faefc6"/><stop offset=".5" stop-color="#d9ad48"/><stop offset="1" stop-color="#87611e"/></linearGradient><radialGradient id="dSheen" cx=".36" cy=".26" r=".6"><stop offset="0" stop-color="#fff9e6" stop-opacity=".9"/><stop offset=".55" stop-color="#fff9e6" stop-opacity="0"/></radialGradient></defs><style>
.dlh *{transform-box:fill-box}
.dlh-pot{transform-origin:62px 96px;animation:dlhTilt 6.5s cubic-bezier(.4,0,.3,1) infinite}
.dlh-stream{opacity:0;animation:dlhPour 6.5s ease-in-out infinite}
.dlh-drop{opacity:0;animation:dlhDrop 6.5s ease-in-out infinite}
.dlh-steam{transform-origin:center;opacity:0;animation:dlhSteam 3.2s ease-in-out infinite}
.dlh-steam.s2{animation-delay:1.6s}
.dlh-cres{transform-origin:center;animation:dlhTw 2.6s ease-in-out infinite}
.dlh-band{animation:dlhBand 3.2s ease-in-out infinite}
@keyframes dlhTilt{0%,58%,100%{transform:rotate(0)}70%,86%{transform:rotate(-21deg)}}
@keyframes dlhPour{0%,63%,100%{opacity:0}72%{opacity:0}74%,84%{opacity:.95}88%{opacity:0}}
@keyframes dlhDrop{0%,70%,100%{opacity:0;transform:translateY(0)}76%{opacity:.9;transform:translateY(0)}90%{opacity:0;transform:translateY(16px)}}
@keyframes dlhSteam{0%{opacity:0;transform:translateY(3px) scaleX(1)}35%{opacity:.65}100%{opacity:0;transform:translateY(-15px) scaleX(1.7)}}
@keyframes dlhTw{0%,100%{opacity:.55;transform:scale(.88)}50%{opacity:1;transform:scale(1.18)}}
@keyframes dlhBand{0%,100%{opacity:.4}50%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.dlh-pot,.dlh-stream,.dlh-drop,.dlh-steam,.dlh-cres,.dlh-band{animation:none}.dlh-stream,.dlh-drop,.dlh-steam{opacity:0}}
</style><g class="dlh"><ellipse cx="60" cy="106" rx="22" ry="3.4" fill="#000" opacity=".2"/><path class="dlh-steam" d="M64 30 q6 -7 1 -14 q-4 -6 1 -12" stroke="#e8cf8e" stroke-width="2.4" opacity=".5"/><path class="dlh-steam s2" d="M56 30 q-6 -7 -1 -14 q4 -6 -1 -12" stroke="#e8cf8e" stroke-width="2.1" opacity=".42"/><g class="dlh-pot"><path d="M45 99 Q60 104 75 99 L71 93 L49 93 Z" fill="url(#dGold)" stroke="#3d2c10" stroke-width="1.4"/><path d="M49 93 Q41 80 42 63 Q43 50 60 47 Q77 50 78 63 Q79 80 71 93 Z" fill="url(#dBody)" stroke="#3d2c10" stroke-width="1.6"/><path d="M52 91 Q45 79 46 64 Q47 54 57 51 Q53 56 52 65 Q51 80 56 91 Z" fill="url(#dSheen)"/><path class="dlh-band" d="M45 73 Q60 79 75 73" stroke="#5c3d12" stroke-width="2" opacity=".5"/><path class="dlh-band" d="M45 71 Q60 77 75 71" stroke="#faefc6" stroke-width="1" opacity=".6"/><path d="M47 62 Q60 67 73 62" stroke="#5c3d12" stroke-width="1.5" opacity=".4"/><path d="M53 47 Q52 41 60 41 Q68 41 67 47" fill="url(#dGold)" stroke="#3d2c10" stroke-width="1.4"/><path d="M53 44 Q33 41 22 22 Q20.5 18.5 25 18 Q33 34 55 41 Z" fill="url(#dGold)" stroke="#3d2c10" stroke-width="1.4"/><path d="M50 42 Q34 38 26 24" stroke="#faefc6" stroke-width="1" opacity=".5"/><path d="M67 47 Q85 49 85 68 Q85 81 74 84" stroke="#3d2c10" stroke-width="4"/><path d="M67 47 Q85 49 85 68 Q85 81 74 84" stroke="url(#dGold)" stroke-width="2.4"/><path d="M69 49 Q83 51 83 66" stroke="#faefc6" stroke-width=".9" opacity=".5"/><path d="M50 41 Q60 27 70 41 Z" fill="url(#dGold)" stroke="#3d2c10" stroke-width="1.4"/><path d="M54 38 Q59 30 63 34" stroke="#faefc6" stroke-width="1" opacity=".55"/><path d="M60 28 L60 18" stroke="#3d2c10" stroke-width="2"/><path class="dlh-cres" d="M56 16 A5 5 0 1 0 62 12 A3.6 3.6 0 1 1 56 16 Z" fill="url(#dGold)" stroke="#3d2c10" stroke-width="1.4"/><path class="dlh-stream" d="M22 22 q-5 10 -4 22" stroke="#e8cf8e" stroke-width="3" stroke-linecap="round"/><ellipse class="dlh-drop" cx="18" cy="46" rx="2.6" ry="3.4" fill="#e8cf8e"/></g></g></svg>`,
};

/* ---------- dallah tap -> synthesized ASMR coffee pour (WebAudio, offline) ---------- */
export const pourCss = (a) => `
  .dlh-svg{cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s ease}
  .dlh-svg:hover{transform:scale(1.05)}.dlh-svg:active{transform:scale(.96)}
  .dlh-svg:focus-visible{outline:2px solid ${a};outline-offset:3px;border-radius:8px}`;
export const POUR_JS = `
  (function(){
    var pots=document.querySelectorAll('.dlh-svg'); if(!pots.length) return;
    // AUTO-UPGRADE: if a real recorded pour exists on hosting, play THAT; else synthesize.
    var real=null, realOk=false;
    try{
      real=new Audio('../assets/audio/pour.mp3'); real.preload='auto';
      real.addEventListener('canplaythrough',function(){realOk=true;},{once:true});
      real.load();
    }catch(e){}
    function playReal(){ try{ var a=real.cloneNode(); a.volume=0.9; a.play(); return true; }catch(e){ return false; } }
    var AC=window.AudioContext||window.webkitAudioContext;
    var ctx=null, busy=false;
    function pour(){
      if(realOk && playReal()) return;
      if(!AC) return;
      if(busy) return; busy=true;
      try{ ctx=ctx||new AC(); }catch(e){ busy=false; return; }
      if(ctx.state==='suspended') ctx.resume();
      var t0=ctx.currentTime, DUR=2.2;
      var n=ctx.sampleRate*DUR, buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0);
      for(var i=0;i<n;i++) d[i]=Math.random()*2-1;
      var src=ctx.createBufferSource(); src.buffer=buf;
      var bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=0.8;
      bp.frequency.setValueAtTime(680,t0); bp.frequency.exponentialRampToValueAtTime(1650,t0+DUR*0.9);
      var lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3200;
      var g=ctx.createGain();
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(0.22,t0+0.18);
      g.gain.setValueAtTime(0.22,t0+DUR-0.5);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+DUR);
      src.connect(bp); bp.connect(lp); lp.connect(g); g.connect(ctx.destination);
      src.start(t0); src.stop(t0+DUR);
      for(var k=0;k<7;k++){
        var gt=t0+0.25+k*0.26+Math.random()*0.05;
        var o=ctx.createOscillator(); o.type='sine';
        var f=150-k*9+Math.random()*30; o.frequency.setValueAtTime(f,gt); o.frequency.exponentialRampToValueAtTime(f*0.7,gt+0.09);
        var og=ctx.createGain(); og.gain.setValueAtTime(0.0001,gt); og.gain.exponentialRampToValueAtTime(0.08,gt+0.012); og.gain.exponentialRampToValueAtTime(0.0001,gt+0.11);
        o.connect(og); og.connect(ctx.destination); o.start(gt); o.stop(gt+0.13);
      }
      setTimeout(function(){busy=false;},DUR*1000);
    }
    pots.forEach(function(p){
      p.addEventListener('click',pour);
      p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pour();}});
    });
  })();`;

export function artFor(catEn, catAr) {
  const s = (catEn + ' ' + catAr).toLowerCase();
  if (/espresso|إسبريسو|حار/.test(s)) return ['espresso', 'espresso'];
  if (/filter|مقطر|v60|origins|محاصيل|brew bar|ترشيح/.test(s)) return ['v60', 'v60'];
  if (/cold|بارد|iced|مثلج/.test(s)) return ['cold', 'cold'];
  if (/matcha|ماتشا/.test(s)) return ['matcha', 'matcha'];
  if (/bakery|مخبوز|croissant|toast|فطائر|bites|لقيمات/.test(s)) return ['croissant', 'bakery'];
  if (/dessert|حلوي|sweet|cake|حلا/.test(s)) return ['cake', 'dessert'];
  if (/tea|شاي|كرك/.test(s)) return ['teapot', 'tea'];
  if (/fuel|burger|snack|وقود/.test(s)) return ['burger', 'snacks'];
  if (/beans|بن للبيت|روست/.test(s)) return ['beans', 'beans'];
  if (/سعود|saudi|دلة|قهوة عربية|majlis/.test(s)) return ['saudi', 'saudi'];
  return ['latte', 'latte'];
}

/* ---------- FULL menus per type (luxe tier) ---------- */
export const FULL_MENUS = {
  specialty_coffee: [
    { cat: 'Espresso Bar', catAr: 'البار الحار', items: [['Espresso', 'إسبريسو', 12], ['Macchiato', 'ماكياتو', 13], ['Cortado', 'كورتادو', 15], ['Flat White', 'فلات وايت', 17], ['Cappuccino', 'كابتشينو', 17], ['Latte', 'لاتيه', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Pistachio Latte', 'لاتيه فستق', 23]] },
    { cat: 'Filter & Slow Bar', catAr: 'بار الترشيح', items: [['V60 — Single Origin', 'في60 — محصول فردي', 24], ['Chemex', 'كيمكس', 24], ['Aeropress', 'إيروبرس', 22], ['Coffee of the Day', 'قهوة اليوم', 16], ['Iced Drip', 'مقطّرة باردة', 22]] },
    { cat: 'Cold Bar', catAr: 'البار البارد', items: [['Iced Latte', 'لاتيه بارد', 18], ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21], ['Cold Brew', 'كولد برو', 19], ['Cold Brew Tonic', 'كولد برو تونيك', 24], ['Iced Mocha', 'موكا باردة', 20]] },
    { cat: 'Saudi Corner', catAr: 'الركن السعودي', items: [['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25], ['Dates Plate', 'طبق تمر', 12]] },
    { cat: 'Bites & Sweets', catAr: 'اللقيمات والحلا', items: [['Butter Croissant', 'كرواسون زبدة', 12], ['Zaatar Croissant', 'كرواسون زعتر', 13], ['Chocolate Cookie', 'كوكيز شوكولاتة', 10], ['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26], ['Date Cake', 'كيكة التمر', 15]] },
  ],
  dessert_cafe: [
    { cat: 'House Desserts', catAr: 'حلا البيت', items: [['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26], ['Tiramisu', 'تيراميسو', 26], ['Chocolate Layer Cake', 'كيكة الشوكولاتة الطبقية', 25], ['Pistachio Bomb', 'قنبلة الفستق', 27], ['Mango Trifle', 'ترايفل مانجو', 24], ['Seasonal Dessert', 'حلا الموسم', 24]] },
    { cat: 'Warm & Gooey', catAr: 'دافي ولذيذ', items: [['Molten Chocolate Cake', 'كيكة الشوكولاتة الذائبة', 24], ['Kunafa Cup', 'كاسة كنافة', 19], ['Mini Pancakes', 'ميني بان كيك', 18]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Espresso', 'إسبريسو', 12], ['Cappuccino', 'كابتشينو', 17], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Drip Coffee', 'قهوة مقطّرة', 20]] },
    { cat: 'Cold Drinks', catAr: 'المشروبات الباردة', items: [['Iced Latte', 'لاتيه بارد', 18], ['Iced Chocolate', 'شوكولاتة باردة', 20], ['Milkshake', 'ميلك شيك', 22]] },
  ],
  bakery_cafe: [
    { cat: 'From the Oven', catAr: 'من الفرن', items: [['Cinnamon Bun', 'سينابون', 16], ['Almond Croissant', 'كرواسون لوز', 15], ['Butter Croissant', 'كرواسون زبدة', 12], ['Zaatar Croissant', 'كرواسون زعتر', 13], ['Pain au Chocolat', 'بان أو شوكولا', 14], ['Sourdough Loaf', 'رغيف ساوردو', 18]] },
    { cat: 'Toasts & Sandwiches', catAr: 'التوست والساندويتش', items: [['Avocado Sourdough Toast', 'توست أفوكادو', 24], ['Halloumi & Honey Toast', 'توست حلومي وعسل', 22], ['Turkey & Cheese Croissant', 'كرواسون تيركي وجبن', 21]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Flat White', 'فلات وايت', 17], ['Latte', 'لاتيه', 18], ['Iced Latte', 'لاتيه بارد', 18], ['V60', 'في60', 22]] },
    { cat: 'Fresh', catAr: 'المشروبات الطازجة', items: [['Orange Juice', 'عصير برتقال', 15], ['Lemon Mint', 'ليمون بالنعناع', 15]] },
  ],
  matcha_bar: [
    { cat: 'Matcha Bar', catAr: 'بار الماتشا', items: [['Hot Matcha', 'ماتشا حارة', 20], ['Iced Matcha', 'ماتشا باردة', 22], ['Strawberry Matcha', 'ماتشا فراولة', 25], ['Mango Matcha', 'ماتشا مانجو', 25], ['Matcha Affogato', 'ماتشا أفوغاتو', 26], ['Ceremonial Bowl', 'الطقس الياباني', 28]] },
    { cat: 'Coffee Too', catAr: 'وللقهوة عشّاقها', items: [['Espresso', 'إسبريسو', 12], ['Flat White', 'فلات وايت', 17], ['Iced Latte', 'لاتيه بارد', 18]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Matcha Cookie', 'كوكيز ماتشا', 12], ['Mochi (2 pcs)', 'موتشي (حبتين)', 14], ['Matcha Cheesecake', 'تشيز كيك ماتشا', 26]] },
  ],
  roastery: [
    { cat: "Today's Origins", catAr: 'محاصيل اليوم', items: [['V60 — Ethiopia', 'في60 — إثيوبيا', 24], ['V60 — Colombia', 'في60 — كولومبيا', 24], ['V60 — Panama Geisha', 'في60 — جيشا بنما', 38], ['Chemex', 'كيمكس', 24], ['Iced Filter', 'مقطّرة باردة', 22]] },
    { cat: 'Espresso', catAr: 'الإسبريسو', items: [['Single-Origin Espresso', 'إسبريسو محصول فردي', 14], ['Cortado', 'كورتادو', 15], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21]] },
    { cat: 'Beans To Go', catAr: 'بن للبيت', items: [['250g — Rotating Origin', '٢٥٠ جم — محصول متغيّر', 55], ['250g — Espresso Blend', '٢٥٠ جم — خلطة إسبريسو', 48], ['1kg — House Blend', 'كيلو — خلطة المحمصة', 160], ['Drip Bags (5)', 'أظرف تقطير (٥)', 35]] },
    { cat: 'Bites', catAr: 'اللقيمات', items: [['Brownie', 'براوني', 16], ['Date Maamoul', 'معمول تمر', 9]] },
  ],
  family_cafe: [
    { cat: 'Coffee & More', catAr: 'القهوة وأكثر', items: [['Cappuccino', 'كابتشينو', 17], ['Latte', 'لاتيه', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25], ['Karak', 'كرك', 8]] },
    { cat: 'Little Ones', catAr: 'لصغار البيت', items: [['Babyccino', 'بيبيتشينو', 8], ['Kids Hot Chocolate', 'هوت شوكلت أطفال', 12], ['Fresh Juice Box', 'عصير طازج', 10], ['Mini Pancakes', 'ميني بان كيك', 16]] },
    { cat: 'Family Bites', catAr: 'لقيمات العائلة', items: [['House Savoury Pastries', 'فطائر البيت المالحة', 14], ['Cheese Manakish', 'مناقيش جبن', 16], ['Club Sandwich', 'كلوب ساندويتش', 26], ['Fries', 'بطاطس', 14]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Date Cake', 'كيكة التمر', 15], ['Honey Cake', 'كيكة العسل', 18], ['Luqaimat', 'لقيمات', 14]] },
  ],
  tea_house: [
    { cat: 'Tea Bar', catAr: 'بار الشاي', items: [['Karak', 'كرك', 8], ['Karak Zaafran', 'كرك زعفران', 10], ['Moroccan Mint', 'أتاي مغربي', 14], ['Earl Grey Pot', 'إبريق إيرل جراي', 18], ['Hibiscus Iced Tea', 'كركديه بارد', 15], ['Iraqi Chai Pot', 'شاي عراقي', 16]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Espresso', 'إسبريسو', 12], ['Latte', 'لاتيه', 18], ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25]] },
    { cat: 'With Your Chai', catAr: 'مع الشاهي', items: [['Chapati Roll', 'جباتي رول', 12], ['Samosa (3)', 'سمبوسة (٣)', 9], ['Date Maamoul', 'معمول تمر', 9], ['Honey Cake', 'كيكة العسل', 18]] },
  ],
  gaming_cafe: [
    { cat: 'Drinks', catAr: 'المشروبات', items: [['Espresso', 'إسبريسو', 12], ['Iced Latte', 'لاتيه بارد', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Iced Tea', 'شاي مثلج', 14], ['Energy Mojito', 'موهيتو طاقة', 19]] },
    { cat: 'Game Fuel', catAr: 'وقود القيمرز', items: [['Smash Burger', 'سماش برجر', 28], ['Loaded Fries', 'بطاطس محمّلة', 19], ['Nachos', 'ناتشوز', 22], ['Hot Dog', 'هوت دوق', 16], ['Chicken Tenders', 'تندرز دجاج', 24]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Chocolate Cookie', 'كوكيز شوكولاتة', 10], ['Brownie', 'براوني', 16], ['Milkshake', 'ميلك شيك', 22]] },
  ],
};

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const seedOf = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };

/* four background motifs — picked per cafe, low-opacity, both moods */
const patternFor = (T, v) => {
  const c = '%23' + (T.accentBright || T.accent).slice(1), o = T.mode === 'light' ? '.10' : '.13';
  const shapes = [
    `%3Ccircle cx='24' cy='24' r='1.2' fill='${c}' fill-opacity='${o}'/%3E`,
    `%3Cpath d='M24 18l6 6-6 6-6-6z' fill='none' stroke='${c}' stroke-opacity='${o}'/%3E`,
    `%3Ccircle cx='24' cy='24' r='6' fill='none' stroke='${c}' stroke-opacity='${o}'/%3E`,
    `%3Cpath d='M24 19v10M19 24h10' stroke='${c}' stroke-opacity='${o}'/%3E`,
  ];
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E${shapes[v % 4]}%3C/svg%3E")`;
};

/* entrance flavors + hero greetings — variety per cafe, honest words only */
const REVEALS = [
  '.reveal{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}.reveal.in{opacity:1;transform:none}',
  '.reveal{opacity:0;transform:scale(.96);transition:opacity .5s ease,transform .5s cubic-bezier(.2,1.2,.4,1)}.reveal.in{opacity:1;transform:none}',
  '.reveal{opacity:0;transform:translateX(18px);transition:opacity .55s ease,transform .55s ease}.reveal.in{opacity:1;transform:none}',
];
const GREETS = [
  ['حيّاكم الله ✦', 'Welcome ✦'], ['أهلاً وسهلاً ✦', 'Ahlan wa sahlan ✦'],
  ['يسعدنا وجودكم ✦', 'So glad you are here ✦'], ['البيت بيتكم ✦', 'Make yourself at home ✦'],
];

const themeFor = (cafe) => cafe.theme || brandTheme(cafe);

/* ---------- the luxe menu page ---------- */
export function luxeMenuPage(cafe) {
  const T = themeFor(cafe);
  const a = T.accent, a2 = T.accent2;
  const sd = seedOf(cafe.slug || cafe.name);
  const greet = GREETS[(sd >>> 3) % GREETS.length];
  const sigCat = cafe.menu.find((c) => /signature|توقيع/i.test(c.cat + c.catAr));
  const cats = cafe.menu.filter((c) => c !== sigCat);

  const navChips = cafe.menu.map((c, i) =>
    `<a class="chip" href="#cat-${i}"><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></a>`).join('');

  const sigHtml = sigCat ? `
  <section class="sig reveal" id="cat-${cafe.menu.indexOf(sigCat)}">
    <div class="sig-ribbon"><span class="ar">✦ توقيع البيت ✦</span><span class="en">✦ House Signatures ✦</span></div>
    <div class="sig-grid">
      ${sigCat.items.map(([en, ar, price]) => `
      <div class="sig-card">
        <div class="sig-art">${ART[artFor(en, ar)[0]](T)}</div>
        <div class="sig-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="sig-price">${price} <span class="sar">${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>` : '';

  const catHtml = cats.map((c) => {
    const i = cafe.menu.indexOf(c);
    const [artKey, photoKey] = artFor(c.cat, c.catAr);
    return `
  <section class="cat reveal" id="cat-${i}">
    <div class="cat-head">
      <div class="cat-art">
        <div class="cat-svg">${ART[artKey](T)}</div>
        <img src="../assets/photos/${photoKey}.jpg" alt="" onload="this.parentElement.classList.add('hasimg')">
      </div>
      <div class="cat-title">
        <h2><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></h2>
        <div class="rule"><span>✦</span></div>
      </div>
    </div>
    <div class="items">
      ${c.items.map(([en, ar, price]) => `
      <div class="item">
        <div class="item-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="dots"></div>
        <div class="price">${price}<span class="sar"> ${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>`;
  }).join('');

  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000'
    ? `https://wa.me/${CONTACT.whatsapp}` : null;

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${T.bg0}">
<title>${esc(cafe.name)} — Menu · MENU SADAH</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${T.fonts.q}&display=swap">\n<style>
  :root{--bg-0:${T.bg0};--bg-1:${T.bg1};--bg-2:${T.bg2};--border-1:${T.border1};--border-2:${T.border2};
    --text-1:${T.text1};--text-2:${T.text2};--text-3:${T.text3};--accent:${a};--accent-2:${a2};--accent-soft:${a}22;
    --radius:16px;--shadow:${T.shadow}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:${T.fonts.body},-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;
    background:var(--bg-0) ${patternFor(T, sd)};color:var(--text-1);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100svh}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(620px 420px at 50% -120px,${a}17,transparent 70%)}
  .wrap{max-width:560px;margin:0 auto;padding:0 18px 110px;position:relative;z-index:1}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:30;background:${T.bg1}d9;backdrop-filter:blur(10px);
    border:1px solid var(--border-2);color:var(--text-1);border-radius:999px;padding:8px 16px;font-size:13.5px;cursor:pointer}

  .hero{position:relative;text-align:center;padding:76px 0 30px;overflow:hidden}
  .orb{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:340px;border-radius:50%;
    background:radial-gradient(circle,${a}30,transparent 65%);pointer-events:none}
  .orb2{position:absolute;top:30px;left:12%;width:180px;height:180px;border-radius:50%;
    background:radial-gradient(circle,${a2}1f,transparent 65%);pointer-events:none}
  .medal{position:relative;width:104px;height:104px;margin:0 auto 18px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff2b,transparent 42%),radial-gradient(circle at 32% 28%,${a}42,${a}14 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 7px ${a}14,0 0 34px ${a}40,inset 0 1px 0 #ffffff33}
  .medal::after{content:"";position:absolute;inset:6px;border-radius:50%;border:1px solid ${a}55}
  .medal span .ar{font-family:${T.fonts.ar}}
  .medal span .en{font-family:${T.fonts.en}}
  .medal span{font-size:44px;font-weight:700;color:var(--accent);text-shadow:0 2px 12px ${a}66}
  .medal{animation:mfloat 5s ease-in-out infinite}
  @keyframes mfloat{50%{transform:translateY(-6px)}}
  h1{font-size:34px;letter-spacing:-.01em;line-height:1.2}
  h1 .ar{font-family:${T.fonts.ar}}
  h1 .en{font-family:${T.fonts.en}}
  .tagline{color:var(--text-2);margin-top:8px;font-size:15.5px}
  .meta{margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .badge{background:var(--accent-soft);border:1px solid ${a}66;color:var(--accent);border-radius:999px;padding:4px 14px;font-size:12px;letter-spacing:.05em}
  .hrule{display:flex;align-items:center;gap:12px;margin:26px auto 0;max-width:280px;color:var(--accent)}
  .hrule::before,.hrule::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,${a}88)}
  .hrule::after{background:linear-gradient(90deg,${a}88,transparent)}

  .chips{display:flex;gap:8px;overflow-x:auto;padding:14px 2px;position:sticky;top:0;z-index:20;
    background:linear-gradient(${T.bg0}f2 78%,transparent);backdrop-filter:blur(8px);scrollbar-width:none}
  .chips::-webkit-scrollbar{display:none}
  .chip{flex:0 0 auto;text-decoration:none;color:var(--text-2);background:${T.bg1}cc;border:1px solid var(--border-1);
    border-radius:999px;padding:9px 18px;font-size:14px;transition:all .2s}
  .chip:hover{color:var(--accent);border-color:var(--accent);box-shadow:0 0 14px ${a}33}

  .sig{margin-top:26px;background:linear-gradient(180deg,${a}14,transparent 90%);border:1px solid ${a}44;
    border-radius:22px;padding:20px 16px 18px;position:relative}
  .sig-ribbon{text-align:center;color:var(--accent);letter-spacing:.14em;font-size:13px;margin-bottom:16px;font-weight:700}
  .sig-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
  .sig-card{background:var(--bg-1);border:1px solid var(--border-2);border-radius:var(--radius);padding:14px 12px;text-align:center;box-shadow:var(--shadow)}
  .sig-art{width:74px;height:74px;margin:0 auto 8px}
  ${pourCss(a)}
  .sig-art svg{width:100%;height:100%;filter:drop-shadow(0 6px 14px ${a}59)}
  .sig-name{font-size:14.5px;font-weight:600;line-height:1.35}
  .sig-price{margin-top:6px;color:var(--accent);font-weight:800;font-size:17px}
  .sar{font-size:11px}

  .cat{margin-top:34px}
  .cat-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .cat-art{position:relative;width:76px;height:76px;flex:0 0 auto;border-radius:18px;overflow:hidden;
    border:1px solid var(--border-2);background:var(--bg-1);box-shadow:var(--shadow)}
  .cat-art .cat-svg{position:absolute;inset:8px}
  .cat-art .cat-svg svg{filter:drop-shadow(0 5px 12px ${a}4d)}
  .cat-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}
  .cat-art.hasimg img{display:block}
  .cat-title{flex:1}
  .cat-title h2{color:var(--accent);font-size:19px;letter-spacing:.04em}
  .cat-title h2 .ar{font-family:${T.fonts.ar}}
  .cat-title h2 .en{font-family:${T.fonts.en}}
  .rule{display:flex;align-items:center;gap:10px;color:${a}88;font-size:10px;margin-top:6px}
  .rule::before{content:"";width:46px;height:1px;background:${a}66}
  .rule::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,${a}44,transparent)}

  .items{background:${T.bg1}d9;border:1px solid var(--border-1);border-radius:20px;padding:6px 18px;box-shadow:var(--shadow)}
  .item{display:flex;align-items:baseline;gap:10px;padding:15px 0;border-bottom:1px solid ${T.bg2}99}
  .item:last-child{border-bottom:none}
  .item-name{font-size:16px}
  .dots{flex:1;border-bottom:1px dotted var(--border-2);transform:translateY(-4px)}
  .price{color:var(--accent);font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums}

  .demo-note{margin-top:34px;background:var(--accent-soft);border:1px dashed ${a}88;border-radius:14px;
    padding:13px 16px;font-size:13.5px;color:var(--text-2);text-align:center}
  .footer{margin-top:34px;text-align:center;color:var(--text-3);font-size:13px}
  .footer a{color:var(--accent);text-decoration:none}
  ${wa ? `.wa{position:fixed;bottom:18px;inset-inline-start:18px;z-index:30;background:#1faa53;color:#fff;border-radius:999px;
    padding:12px 20px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 8px 22px #1faa5366}` : ''}

  ${REVEALS[(sd >>> 6) % REVEALS.length]}
  .greet{color:var(--accent);font-size:13px;letter-spacing:.14em;margin-bottom:10px;opacity:0;animation:up .7s .1s forwards}
  @keyframes up{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:none}}
  /* ALIVE pack: shimmer name, word-stagger, sparkles, floating sig cards, item pops
     gradient-clip only AFTER word entrance — transformed child spans break background-clip:text in Chrome */
  h1.shimmer{background:linear-gradient(90deg,var(--text-1) 30%,${a} 48%,${a2} 52%,var(--text-1) 70%);background-size:240% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sh 5s .3s infinite}
  @keyframes sh{0%{background-position:130% 0}100%{background-position:-130% 0}}
  h1 .w{display:inline-block;opacity:0;animation:wordin .55s cubic-bezier(.2,1.2,.4,1) forwards}
  @keyframes wordin{0%{opacity:0;transform:translateY(14px) scale(.94)}100%{opacity:1;transform:none}}
  .tagline{opacity:0;animation:up .7s .8s forwards}
  .spark{position:absolute;color:${a2};animation:tw 3.4s ease-in-out infinite;pointer-events:none;z-index:0}
  @keyframes tw{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:.9;transform:scale(1.15)}}
  .sig-card{animation:sfloat 4.6s ease-in-out infinite}
  .sig-card:nth-child(2){animation-delay:1.1s}.sig-card:nth-child(3){animation-delay:2.2s}
  @keyframes sfloat{50%{transform:translateY(-5px)}}
  .sig-price{animation:pricepulse 3s ease-in-out infinite}
  @keyframes pricepulse{50%{text-shadow:0 0 14px ${a}88}}
  .reveal.in .item{opacity:0;animation:itemin .45s forwards}
  .reveal.in .item:nth-child(1){animation-delay:.05s}.reveal.in .item:nth-child(2){animation-delay:.12s}
  .reveal.in .item:nth-child(3){animation-delay:.19s}.reveal.in .item:nth-child(4){animation-delay:.26s}
  .reveal.in .item:nth-child(5){animation-delay:.33s}.reveal.in .item:nth-child(6){animation-delay:.4s}
  .reveal.in .item:nth-child(n+7){animation-delay:.47s}
  @keyframes itemin{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:none}}
  .chip{transition:all .2s,transform .18s}.chip:hover{transform:translateY(-2px) scale(1.04)}
  .cat-art{transition:transform .25s}.cat-art:hover{transform:rotate(-3deg) scale(1.05)}
  @media(min-width:900px){
    .wrap{max-width:780px}
    .hero{min-height:80vh;display:flex;flex-direction:column;justify-content:center;padding:60px 0 30px}
    .medal{width:136px;height:136px}
    .medal span{font-size:58px}
    h1{font-size:62px}
    .tagline{font-size:22px}
    .cat-title h2{font-size:28px}
    .cat-art{width:96px;height:96px}
    .items{padding:10px 30px}
    .item{padding:18px 0}
    .item-name{font-size:17.5px}
    .sig-art{width:96px;height:96px}
    .chips{justify-content:center}
  }
  @media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none}.medal{animation:none}}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    <div class="orb2"></div>
    <span class="spark" style="top:18%;left:12%;font-size:11px">✦</span>
    <span class="spark" style="top:30%;right:10%;font-size:14px;animation-delay:1.1s">✦</span>
    <span class="spark" style="top:64%;left:8%;font-size:9px;animation-delay:2s">✦</span>
    <span class="spark" style="top:12%;right:24%;font-size:8px;animation-delay:.6s">✦</span>
    <span class="spark" style="top:70%;right:16%;font-size:12px;animation-delay:2.7s">✦</span>
    <div class="greet"><span class="ar">${greet[0]}</span><span class="en">${greet[1]}</span></div>
    <div class="medal"><span><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></span></div>
    <h1><span class="ar">${esc(cafe.nameAr)}</span><span class="en">${esc(cafe.name)}</span></h1>
    <div class="tagline"><span class="ar">${esc(cafe.taglineAr)}</span><span class="en">${esc(cafe.tagline)}</span></div>
    <div class="meta">
      <span class="badge"><span class="ar">${esc(cafe.areaAr === 'الرياض' ? 'الرياض' : cafe.areaAr + ' · الرياض')}</span><span class="en">${esc(cafe.area === 'Riyadh' ? 'Riyadh' : cafe.area + ' · Riyadh')}</span></span>
      <span class="badge"><span class="ar">متوافق مع اشتراطات هيئة الغذاء والدواء</span><span class="en">SFDA-ready</span></span>
    </div>
    <div class="hrule"><span>✦</span></div>
  </header>
  <nav class="chips">${navChips}</nav>
  ${sigHtml}
  ${catHtml}
  <div class="demo-note">
    <span class="ar">هذه نسخة تجريبية أعدّها فريق منيو سادة خصيصاً لكم — الأصناف والأسعار والصور قابلة للتعديل خلال دقائق.</span>
    <span class="en">A demo lovingly prepared by MENU SADAH for you — items, prices & photos update in minutes.</span>
  </div>
  <div class="footer">
    ${cafe.social && /^@/.test(String(cafe.social)) ? `<div style="margin-bottom:6px;color:var(--text-2)"><span class="ar">تابعوا ${esc(cafe.nameAr)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span><span class="en">Follow ${esc(cafe.name)}: <b style="color:var(--accent)">${esc(cafe.social)}</b></span></div>` : ''}
    <span class="ar">تجربة من <a href="${CONTACT.site}">منيو سادة — MENU SADAH</a></span>
    <span class="en">Crafted by <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
${wa ? `<a class="wa" href="${wa}"><span class="ar">💬 اطلب منيو مثله</span><span class="en">💬 Get a menu like this</span></a>` : ''}
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  // word-by-word hero entrance (word-level keeps Arabic letter joining intact)
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{
      const words=el.textContent.trim().split(/\\s+/);
      el.innerHTML=words.map((w,i)=>'<span class="w" style="animation-delay:'+(0.35+i*0.12)+'s">'+w+'</span>').join(' ');
    });
    setTimeout(()=>{
      document.querySelectorAll('h1 .ar, h1 .en').forEach(el=>{el.textContent=el.textContent;});
      document.querySelector('h1').classList.add('shimmer');
    },2400);
  }
  ${POUR_JS}
</script>
</body>
</html>`;
}

/* ---------- type-flavored personal compliment lines ---------- */
const FLAVOR = {
  specialty_coffee: { ar: 'ذوقكم في القهوة المختصة واضح من أول نظرة', en: 'Your specialty-coffee taste shows from the first glance' },
  dessert_cafe: { ar: 'حلاكم صار حديث الناس — ويستاهل منيو بمستواه', en: 'Your desserts are the talk of the town — they deserve a menu at their level' },
  bakery_cafe: { ar: 'ريحة الفرن عندكم تحتاج منيو يليق فيها', en: 'Bakes like yours deserve a menu that does them justice' },
  matcha_bar: { ar: 'الماتشا عندكم فن — والمنيو لازم يكون بنفس الفن', en: 'Your matcha is an art — the menu should match it' },
  roastery: { ar: 'محاصيلكم تتغير كل أسبوع — منيو ورقي ما يلحق عليكم', en: 'Your origins rotate weekly — paper menus can never keep up' },
  family_cafe: { ar: 'مكانكم يجمع العائلة — والمنيو لازم يسهل عليهم الطلب', en: 'Your place brings families together — ordering should be effortless' },
  tea_house: { ar: 'شاهيكم له عشاق — وعشاقه يستاهلون منيو يليق', en: 'Your chai has devoted fans — they deserve a proper menu' },
  gaming_cafe: { ar: 'القيمرز عندكم ما يحبون يرفعون عيونهم عن الشاشة — منيو QR يحل المشكلة', en: 'Your gamers never look up from the screen — a QR menu fixes that' },
};

/* ---------- the LUXE gift page (the deal-or-no-deal link) ---------- */
export function luxeWelcomePage(cafe, extras = {}) {
  const T = themeFor(cafe);
  const a = T.accent, a2 = T.accent2;
  const flavor = FLAVOR[extras.type] || FLAVOR.specialty_coffee;
  const sig = (extras.signature && extras.signature.length ? extras.signature[0] : null) || extras.sigMention || null;
  const social = extras.social && /^@/.test(String(extras.social).trim()) ? String(extras.social).trim() : null;
  const waMsg = encodeURIComponent('مرحباً، معكم ' + cafe.name + ' — شفنا المنيو التجريبي وحابين نكمل');
  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000' ? `https://wa.me/${CONTACT.whatsapp}?text=${waMsg}` : null;

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${T.bg0}">
<title>🎁 ${esc(cafe.name)} × MENU SADAH</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${T.fonts.q}&display=swap">\n<style>
  :root{--bg-0:${T.bg0};--bg-1:${T.bg1};--border-1:${T.border1};--border-2:${T.border2};
    --text-1:${T.text1};--text-2:${T.text2};--text-3:${T.text3};--accent:${a};--accent-soft:${a}22}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:${T.fonts.body},-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;
    background:var(--bg-0) ${patternFor(T, seedOf(cafe.slug || cafe.name))};color:var(--text-1);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;
    min-height:100svh;overflow-x:hidden}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(620px 460px at 50% -120px,${a}1c,transparent 70%)}
  .wrap{max-width:560px;margin:0 auto;padding:0 20px 90px;position:relative}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:40;background:${T.bg1}d9;backdrop-filter:blur(10px);
    border:1px solid var(--border-2);color:var(--text-1);border-radius:999px;padding:8px 16px;font-size:13.5px;cursor:pointer}

  .stars{position:fixed;inset:0;pointer-events:none;z-index:1}
  .stars span{position:absolute;color:${a};opacity:0;animation:tw 3.2s infinite}
  @keyframes tw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:.85;transform:scale(1.15)}}

  .hero{position:relative;text-align:center;padding:84px 0 20px;z-index:2}
  .orb{position:absolute;top:-70px;left:50%;transform:translateX(-50%);width:380px;height:380px;border-radius:50%;
    background:radial-gradient(circle,${a}38,transparent 64%);pointer-events:none;animation:breathe 5s ease-in-out infinite}
  .orb2{position:absolute;top:40px;left:8%;width:200px;height:200px;border-radius:50%;
    background:radial-gradient(circle,${a2}24,transparent 65%);pointer-events:none;animation:breathe2 6.5s 1s ease-in-out infinite}
  @keyframes breathe{50%{transform:translateX(-50%) scale(1.08)}}
  @keyframes breathe2{50%{transform:scale(1.1)}}
  .gift-tag{display:inline-block;background:var(--accent-soft);border:1px solid ${a}88;color:var(--accent);
    border-radius:999px;padding:6px 20px;font-size:13px;letter-spacing:.14em;
    opacity:0;animation:up .8s .15s forwards}
  .medal{position:relative;width:118px;height:118px;margin:22px auto 6px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff30,transparent 42%),radial-gradient(circle at 32% 28%,${a}48,${a}16 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 8px ${a}14,0 0 46px ${a}55,inset 0 1px 0 #ffffff33;
    opacity:0;animation:pop .9s .5s cubic-bezier(.2,1.4,.4,1) forwards}
  .medal::after{content:"";position:absolute;inset:7px;border-radius:50%;border:1px solid ${a}55}
  .medal span{font-family:${T.fonts.en};font-size:52px;font-weight:700;color:var(--accent);
    text-shadow:0 2px 14px ${a}73}
  @keyframes pop{0%{opacity:0;transform:scale(.4)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
  @keyframes up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
  h1{font-size:32px;line-height:1.25;margin-top:12px;opacity:0;animation:up .8s .9s forwards}
  h1 b{color:var(--accent)}
  h1 .ar{font-family:${T.fonts.ar}}
  h1 .en{font-family:${T.fonts.en}}
  .shimmer{background:linear-gradient(90deg,var(--text-1) 40%,${a} 50%,var(--text-1) 60%);background-size:220% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sh 3.4s 1.8s infinite}
  @keyframes sh{0%{background-position:120% 0}100%{background-position:-120% 0}}

  .letter{position:relative;z-index:2;margin-top:26px;background:linear-gradient(180deg,${T.bg1}f0,${T.bg1}d0);
    border:1px solid ${a}44;border-radius:24px;padding:24px 22px;box-shadow:0 10px 34px #00000080;
    opacity:0;animation:up .9s 1.25s forwards}
  .letter .to{color:var(--accent);font-size:13px;letter-spacing:.12em;margin-bottom:10px}
  .letter p{color:var(--text-2);font-size:15.5px;margin-bottom:12px}
  .letter p b{color:var(--text-1)}
  .letter .sigline{color:var(--accent);font-weight:700}
  .benefits{list-style:none;margin-top:6px}
  .benefits li{display:flex;gap:11px;align-items:flex-start;padding:8px 0;color:var(--text-2);font-size:14.5px}
  .benefits .tick{color:var(--accent);font-weight:800;flex:0 0 auto}

  .cta-stack{position:relative;z-index:2;display:grid;gap:12px;margin-top:26px;opacity:0;animation:up .9s 1.6s forwards}
  .btn{display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,${a},${a2});
    color:${T.ink};font-weight:800;font-size:18px;border-radius:18px;padding:18px 20px;
    box-shadow:0 10px 30px ${a}55;transition:transform .15s}
  .btn:active{transform:scale(.98)}
  .btn.pulse{animation:pl 2.2s 2.4s infinite}
  @keyframes pl{0%,100%{box-shadow:0 10px 30px ${a}55}50%{box-shadow:0 10px 44px ${a}90}}
  .btn.ghost{background:transparent;color:var(--accent);border:1px solid ${a}88;box-shadow:none;font-weight:600;font-size:15px}
  .small{margin-top:14px;text-align:center;color:var(--text-3);font-size:12.5px;position:relative;z-index:2}
  .small a{color:var(--accent);text-decoration:none}
  .footer{margin-top:30px;text-align:center;color:var(--text-3);font-size:12.5px;position:relative;z-index:2}
  .footer a{color:var(--accent);text-decoration:none}
  .fineline{font-size:12.5px!important;color:var(--text-3)!important;border-top:1px dashed var(--border-1);padding-top:11px;margin-top:4px;text-align:center}
  @media(min-width:900px){
    .wrap{max-width:720px}
    .hero{min-height:60vh;display:flex;flex-direction:column;justify-content:center;padding:60px 0 10px}
    .medal{width:140px;height:140px}
    .medal span{font-size:60px}
    h1{font-size:52px}
    .letter{padding:34px 36px;border-radius:28px}
    .letter p{font-size:17px}
    .btn{font-size:20px;padding:22px}
  }
  @media (prefers-reduced-motion: reduce){*{animation:none!important;opacity:1!important}}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="stars" id="stars"></div>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    <div class="orb2"></div>
    <span class="gift-tag"><span class="ar">🎁 هدية خاصة · ليست إعلاناً</span><span class="en">🎁 A personal gift · not an ad</span></span>
    <div class="medal"><span><span class="ar">${esc((cafe.nameAr || cafe.name).trim()[0])}</span><span class="en">${esc(cafe.name.trim()[0].toUpperCase())}</span></span></div>
    <h1>
      <span class="ar">إلى بيت <b class="shimmer">${esc(cafe.nameAr)}</b></span>
      <span class="en">To the house of <b class="shimmer">${esc(cafe.name)}</b></span>
    </h1>
    ${extras.world ? `<div style="margin-top:10px;color:var(--text-3);font-size:13px;letter-spacing:.06em;opacity:0;animation:up .8s 1.1s forwards"><span class="ar">✦ ${esc(extras.world.ar)} ✦</span><span class="en">✦ ${esc(extras.world.en)} ✦</span></div>` : ''}
  </header>

  <div class="letter">
    <div class="to"><span class="ar">🏡 مرحباً يا بيت ${esc(cafe.nameAr)}</span><span class="en">🏡 Hello, house of ${esc(cafe.name)}</span></div>
    <p>
      <span class="ar">أنا إبراهيم من «منيو سادة». ${social ? 'تابعت <b>' + esc(social) + '</b> — و' : ''}${esc(flavor.ar)}${cafe.areaAr && cafe.areaAr !== 'الرياض' ? '، وسط <b>' + esc(cafe.areaAr) + '</b>' : ''}. صراحةً، وقّفني.</span>
      <span class="en">I'm Ibrahim from MENU SADAH. ${social ? 'I\'ve been following <b>' + esc(social) + '</b> — and ' : ''}${esc(flavor.en)}. Honestly, it stopped me.</span>
    </p>
    <p>
      <span class="ar">بين فترة وفترة نختار مكاناً واحداً يستاهل شغلاً خاصاً — وهالمرة اخترناكم.</span>
      <span class="en">Every so often we pick one place that deserves special work — and this time we picked you.</span>
    </p>
    ${sig ? `<p class="sigline"><span class="ar">وبلغنا أن «${esc(sig[1])}» حديث الناس عندكم — جعلناه يفتتح المنيو.</span><span class="en">And we hear your «${esc(sig[0])}» is the one people talk about — it opens the menu.</span></p>` : ''}
    <p>
      <span class="ar">بنينا لكم منيو رقمياً بهويتكم وألوانكم، عربي وإنجليزي. <b>كله هدية. لكم. جاهز الآن.</b> إن نال إعجابكم فعّلناه بنفس اليوم — وإن لم يناسبكم يكفينا شرف اطلاعكم.</span>
      <span class="en">We built you a digital menu in your identity and colors, Arabic and English. <b>All of it is a gift. Yours. Ready now.</b> Love it? Live the same day — if not, we're honored you looked.</span>
    </p>
    <p class="fineline">
      <span class="ar">عربي/إنجليزي بضغطة · متوافق مع هيئة الغذاء والدواء (السعرات والكافيين) · تعديل الأسعار خلال دقائق</span>
      <span class="en">AR/EN toggle · SFDA-ready (calories & caffeine) · prices update in minutes</span>
    </p>
  </div>

  <div class="cta-stack">
    <a class="btn pulse" href="../${cafe.slug}/">
      <span class="ar">🎁 افتحوا هديتكم — منيو ${esc(cafe.nameAr)}</span>
      <span class="en">🎁 Open your gift — the ${esc(cafe.name)} menu</span>
    </a>
    ${wa ? `<a class="btn ghost" href="${wa}"><span class="ar">💬 عجبكم؟ نفعّله لكم بنفس اليوم</span><span class="en">💬 Love it? Live the same day</span></a>` : ''}
  </div>
  <p class="small">
    <span class="ar">شاهدوا عميلنا الحي: <a href="${CONTACT.site}/beyt-coffee">بيت كوفي ↗</a></span>
    <span class="en">See a live client: <a href="${CONTACT.site}/beyt-coffee">Beyt Coffee ↗</a></span>
  </p>
  <div class="footer">
    <span class="ar">صُنعت بحب في الرياض — <a href="${CONTACT.site}">منيو سادة MENU SADAH</a></span>
    <span class="en">Crafted with love in Riyadh — <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  // brand star field
  const stars=document.getElementById('stars');
  for(let i=0;i<26;i++){const s=document.createElement('span');s.textContent='✦';
    s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
    s.style.fontSize=(6+Math.random()*10)+'px';s.style.animationDelay=(Math.random()*3.2)+'s';stars.appendChild(s);}
</script>
</body>
</html>`;
}

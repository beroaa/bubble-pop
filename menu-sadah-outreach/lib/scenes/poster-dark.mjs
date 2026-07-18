// SCENE PACK: poster-dark — cinematic dark poster, big type, spotlight.
// Saudi-premium: dallah silhouette + palm-frond fan + sadu diamond band, generous gold.
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

const a = (h, al) => {
  const x = String(h).replace('#', '');
  const f = x.length === 3 ? x.split('').map((c) => c + c).join('') : x.slice(0, 6);
  const n = parseInt(f, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + al + ')';
};

export const scene = (P, R, G) => ({
  css: `
/* ===== poster-dark scene: vivid cinematic body wash ===== */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1100px 700px at 78% -8%, ${a(G.gold, 0.16)}, transparent 60%),
    radial-gradient(900px 640px at 6% 10%, ${a(P.accent, 0.3)}, transparent 62%),
    radial-gradient(1400px 900px at 50% 118%, ${a(P.deep, 0.55)}, transparent 72%),
    conic-gradient(from 210deg at 82% 16%, ${a(P.accent2, 0.1)}, transparent 30%, ${a(G.goldDeep, 0.13)} 52%, transparent 74%, ${a(R[0], 0.08)});
  background-attachment:fixed;
}

/* ===== big fixed scene canvas (SVG lives in heroHtml) ===== */
.scenebg{
  position:fixed; inset:0; width:100%; height:100%;
  z-index:0; pointer-events:none; display:block; opacity:.92;
}
.hero{ position:relative; isolation:isolate; }
.hero > *{ position:relative; z-index:1; }
.hero .scenebg{ z-index:0; }
.hero::before{
  content:""; position:absolute; inset:-8% -4% auto -4%; height:70%;
  background:radial-gradient(60% 80% at 50% 8%, ${a(G.goldBright, 0.12)}, transparent 70%);
  pointer-events:none; z-index:0;
}

/* ===== gold foil headline treatment (static base = reduced-motion fallback) ===== */
.room-h2 b, .heroline{
  background-image:linear-gradient(100deg,
    ${G.goldDeep} 0%, ${G.gold} 22%, ${G.goldBright} 38%, #fff3c9 50%,
    ${G.goldBright} 62%, ${G.gold} 78%, ${G.goldDeep} 100%);
  background-size:220% 100%; background-position:0% 0%;
  -webkit-background-clip:text; background-clip:text;
  color:transparent; -webkit-text-fill-color:transparent;
  text-shadow:none;
}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b, .heroline{
    background-image:none; color:${G.goldBright}; -webkit-text-fill-color:${G.goldBright};
  }
}

/* ===== sadu-inspired gold accent band ===== */
.gold-band{
  height:14px; width:100%;
  background:repeating-linear-gradient(90deg,
    ${a(G.gold, 0.92)} 0 8px, ${P.deep} 8px 10px,
    ${a(G.goldBright, 0.85)} 10px 14px, ${P.deep} 14px 16px,
    ${a(G.goldDeep, 0.92)} 16px 24px, ${P.deep} 24px 26px);
  border-top:1px solid ${a(G.goldBright, 0.55)};
  border-bottom:1px solid ${a(G.goldDeep, 0.7)};
  box-shadow:0 0 22px ${a(G.gold, 0.25)};
}

/* ===== section separator ===== */
.sep-scene{ display:block; max-width:720px; margin:42px auto; padding:0 18px; }
.sep-scene svg{ display:block; width:100%; height:auto; overflow:visible; }

/* ===== motion: gated, with explicit reduce override ===== */
@media (prefers-reduced-motion: no-preference){
  .pd-spot{ animation:pdBreathe 9s ease-in-out infinite alternate; }
  .pd-fan{ animation:pdGlow 14s ease-in-out infinite alternate; }
  .pd-star{ animation:pdTwinkle 4.5s ease-in-out infinite; }
  .pd-star2{ animation-delay:1.4s; }
  .pd-star3{ animation-delay:2.7s; }
  .room-h2 b, .heroline{ animation:pdFoil 7s linear infinite; }
  @keyframes pdBreathe{ from{opacity:.7} to{opacity:1} }
  @keyframes pdGlow{ from{opacity:.55} to{opacity:1} }
  @keyframes pdTwinkle{ 0%,100%{opacity:.25} 50%{opacity:.95} }
  @keyframes pdFoil{ from{background-position:0% 0%} to{background-position:220% 0%} }
}
@media (prefers-reduced-motion: reduce){
  .scenebg, .scenebg *{ animation:none !important; }
  .room-h2 b, .heroline{ animation:none !important; background-position:0% 0%; }
}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" role="presentation">
<defs>
<radialGradient id="pdSpot" cx="50%" cy="36%" r="62%">
<stop offset="0" stop-color="${a(G.goldBright, 0.26)}"/>
<stop offset=".38" stop-color="${a(G.gold, 0.13)}"/>
<stop offset=".72" stop-color="rgba(0,0,0,0)"/>
</radialGradient>
<linearGradient id="pdGold" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${G.goldBright}"/>
<stop offset=".5" stop-color="${G.gold}"/>
<stop offset="1" stop-color="${G.goldDeep}"/>
</linearGradient>
<pattern id="pdSadu" width="24" height="24" patternUnits="userSpaceOnUse">
<rect width="24" height="24" fill="${a(P.deep, 0.6)}"/>
<path d="M12 3 21 12 12 21 3 12Z" fill="${a(G.gold, 0.85)}"/>
<path d="M12 8 16 12 12 16 8 12Z" fill="${R[1]}"/>
</pattern>
<path id="pdFrond" d="M0 0C7 -34 5 -78 0 -112C-5 -78 -7 -34 0 0Z"/>
</defs>
<rect class="pd-spot" width="1440" height="810" fill="url(#pdSpot)"/>
<g class="pd-fan" transform="translate(215,330)" fill="${a(G.goldBright, 0.1)}">
<use href="#pdFrond" transform="rotate(-66)"/><use href="#pdFrond" transform="rotate(-44)"/>
<use href="#pdFrond" transform="rotate(-22)"/><use href="#pdFrond"/>
<use href="#pdFrond" transform="rotate(22)"/><use href="#pdFrond" transform="rotate(44)"/>
<use href="#pdFrond" transform="rotate(66)"/>
</g>
<g transform="translate(1030,290) scale(1.3)" fill="url(#pdGold)" opacity=".2">
<path d="M100 282C58 282 42 236 54 190C63 156 80 138 80 116L120 116C120 138 137 156 146 190C158 236 142 282 100 282Z"/>
<path d="M80 116 72 102 100 58 128 102 120 116Z"/>
<circle cx="100" cy="52" r="7"/>
<path d="M60 148C26 138 14 106 26 80L40 86C32 104 44 126 66 134Z"/>
<rect x="78" y="282" width="44" height="8" rx="3"/>
<path d="M140 128C172 140 174 182 146 200" fill="none" stroke="url(#pdGold)" stroke-width="7" stroke-linecap="round"/>
</g>
<g fill="${R[2]}">
<path class="pd-star" transform="translate(500,178) scale(.9)" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
<path class="pd-star pd-star2" transform="translate(930,138) scale(.7)" fill="${G.goldBright}" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
<path class="pd-star pd-star3" transform="translate(716,104) scale(.55)" fill="${R[3]}" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
</g>
<rect y="779" width="1440" height="2" fill="${a(G.goldBright, 0.5)}"/>
<rect y="783" width="1440" height="24" fill="url(#pdSadu)" opacity=".85"/>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><svg viewBox="0 0 720 36" focusable="false" role="presentation">
<defs>
<linearGradient id="pdSepA" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="rgba(0,0,0,0)"/>
<stop offset=".2" stop-color="${a(G.goldDeep, 0.9)}"/>
<stop offset=".5" stop-color="${G.goldBright}"/>
<stop offset=".8" stop-color="${a(G.goldDeep, 0.9)}"/>
<stop offset="1" stop-color="rgba(0,0,0,0)"/>
</linearGradient>
</defs>
<rect x="0" y="17" width="720" height="2" rx="1" fill="url(#pdSepA)"/>
<g transform="translate(360,18)">
<path d="M0 -11 11 0 0 11 -11 0Z" fill="${G.gold}" stroke="${G.goldBright}" stroke-width="1.5"/>
<path d="M0 -5 5 0 0 5 -5 0Z" fill="${P.deep}"/>
<path transform="translate(-34,0)" d="M0 -6 6 0 0 6 -6 0Z" fill="${R[2]}"/>
<path transform="translate(34,0)" d="M0 -6 6 0 0 6 -6 0Z" fill="${R[2]}"/>
<circle cx="-58" cy="0" r="2.5" fill="${a(R[3], 0.9)}"/>
<circle cx="58" cy="0" r="2.5" fill="${a(R[3], 0.9)}"/>
</g>
</svg></div>`,
});

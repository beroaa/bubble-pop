// SCENE PACK: editorial-mag — crisp editorial magazine: hairlines, italic, column air.
// Saudi-premium: sadu diamond band + palm-frond fan + Najdi arch folio, generous gold.
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

const a = (h, al) => {
  const x = String(h).replace('#', '');
  const f = x.length === 3 ? x.split('').map((c) => c + c).join('') : x.slice(0, 6);
  const n = parseInt(f, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + al + ')';
};

export const scene = (P, R, G) => ({
  css: `
/* ===== editorial-mag scene: vivid glossy-print body wash ===== */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1150px 680px at 84% -10%, ${a(G.gold, 0.15)}, transparent 60%),
    radial-gradient(880px 620px at 4% 6%, ${a(P.accent, 0.26)}, transparent 60%),
    radial-gradient(1300px 860px at 50% 116%, ${a(P.deep, 0.5)}, transparent 70%),
    conic-gradient(from 160deg at 14% 22%, ${a(P.accent2, 0.1)}, transparent 28%, ${a(G.goldDeep, 0.12)} 55%, transparent 76%, ${a(R[2], 0.07)}),
    linear-gradient(90deg, transparent 0 31.8%, ${a(G.gold, 0.05)} 31.8% calc(31.8% + 1px), transparent calc(31.8% + 1px) 68%, ${a(G.gold, 0.05)} 68% calc(68% + 1px), transparent calc(68% + 1px));
  background-attachment:fixed;
}

/* ===== big fixed scene canvas (SVG lives in heroHtml) ===== */
.scenebg{
  position:fixed; inset:0; width:100%; height:100%;
  z-index:0; pointer-events:none; display:block; opacity:.94;
}
.hero{ position:relative; isolation:isolate; }
.hero > *{ position:relative; z-index:1; }
.hero .scenebg{ z-index:0; }
/* masthead double hairline — classic magazine rule, gilded */
.hero::before{
  content:""; position:absolute; left:6%; right:6%; top:0; height:7px;
  border-top:2px solid ${a(G.gold, 0.85)};
  border-bottom:1px solid ${a(G.goldDeep, 0.65)};
  pointer-events:none; z-index:1;
}
.hero::after{
  content:""; position:absolute; left:6%; right:6%; bottom:0; height:1px;
  background:linear-gradient(90deg, transparent, ${a(G.goldBright, 0.7)} 18%, ${a(G.goldBright, 0.7)} 82%, transparent);
  pointer-events:none; z-index:1;
}

/* ===== gold foil headline treatment (static base = reduced-motion fallback) ===== */
.room-h2 b, .heroline{
  font-style:italic; letter-spacing:.01em;
  background-image:linear-gradient(104deg,
    ${G.goldDeep} 0%, ${G.gold} 24%, ${G.goldBright} 40%, #fff4cf 50%,
    ${G.goldBright} 60%, ${G.gold} 76%, ${G.goldDeep} 100%);
  background-size:230% 100%; background-position:0% 0%;
  -webkit-background-clip:text; background-clip:text;
  color:transparent; -webkit-text-fill-color:transparent;
  text-shadow:none;
}
@supports not ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b, .heroline{
    background-image:none; color:${G.goldBright}; -webkit-text-fill-color:${G.goldBright};
  }
}

/* ===== sadu-inspired gold accent band (never full-bleed heavy — 14px strip) ===== */
.gold-band{
  height:14px; width:100%;
  background:repeating-linear-gradient(90deg,
    ${a(G.gold, 0.9)} 0 8px, ${P.deep} 8px 10px,
    ${a(R[0], 0.85)} 10px 14px, ${P.deep} 14px 16px,
    ${a(G.goldDeep, 0.9)} 16px 24px, ${P.deep} 24px 26px);
  border-top:1px solid ${a(G.goldBright, 0.6)};
  border-bottom:1px solid ${a(G.goldDeep, 0.7)};
  box-shadow:0 0 20px ${a(G.gold, 0.22)};
}

/* ===== section separator: hairline + italic gold diamond folio ===== */
.sep-scene{ display:block; max-width:680px; margin:44px auto; padding:0 18px; }
.sep-scene svg{ display:block; width:100%; height:auto; overflow:visible; }

/* ===== motion: gated, with explicit reduce override ===== */
@media (prefers-reduced-motion: no-preference){
  .em-glow{ animation:emBreathe 10s ease-in-out infinite alternate; }
  .em-fan{ animation:emFan 15s ease-in-out infinite alternate; }
  .em-star{ animation:emTwinkle 5s ease-in-out infinite; }
  .em-star2{ animation-delay:1.6s; }
  .em-star3{ animation-delay:3.1s; }
  .room-h2 b, .heroline{ animation:emFoil 7.5s linear infinite; }
  @keyframes emBreathe{ from{opacity:.65} to{opacity:1} }
  @keyframes emFan{ from{opacity:.5} to{opacity:.95} }
  @keyframes emTwinkle{ 0%,100%{opacity:.2} 50%{opacity:.9} }
  @keyframes emFoil{ from{background-position:0% 0%} to{background-position:230% 0%} }
}
@media (prefers-reduced-motion: reduce){
  .scenebg, .scenebg *{ animation:none !important; }
  .room-h2 b, .heroline{ animation:none !important; background-position:0% 0%; }
}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" role="presentation">
<defs>
<linearGradient id="emGold" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${G.goldBright}"/>
<stop offset=".5" stop-color="${G.gold}"/>
<stop offset="1" stop-color="${G.goldDeep}"/>
</linearGradient>
<radialGradient id="emGlow" cx="50%" cy="30%" r="60%">
<stop offset="0" stop-color="${a(G.goldBright, 0.2)}"/>
<stop offset=".4" stop-color="${a(P.accentBright, 0.09)}"/>
<stop offset=".75" stop-color="rgba(0,0,0,0)"/>
</radialGradient>
<pattern id="emSadu" width="24" height="24" patternUnits="userSpaceOnUse">
<rect width="24" height="24" fill="${a(P.deep, 0.55)}"/>
<path d="M12 4 20 12 12 20 4 12Z" fill="${a(G.gold, 0.8)}"/>
<path d="M12 9 15 12 12 15 9 12Z" fill="${R[1]}"/>
</pattern>
<path id="emFrond" d="M0 0C6 -30 4 -70 0 -100C-4 -70 -6 -30 0 0Z"/>
<path id="emArch" d="M0 120V44C0 14 24 0 46 0C68 0 92 14 92 44V120" fill="none"/>
</defs>
<rect class="em-glow" width="1440" height="810" fill="url(#emGlow)"/>
<g stroke="${a(G.gold, 0.5)}" stroke-width="1">
<line x1="90" y1="64" x2="1350" y2="64"/>
<line x1="90" y1="70" x2="1350" y2="70" stroke="${a(G.goldBright, 0.75)}" stroke-width="2"/>
<line x1="458" y1="120" x2="458" y2="740" stroke="${a(G.gold, 0.14)}"/>
<line x1="982" y1="120" x2="982" y2="740" stroke="${a(G.gold, 0.14)}"/>
<line x1="90" y1="756" x2="1350" y2="756" stroke="${a(G.goldDeep, 0.5)}"/>
</g>
<g class="em-fan" transform="translate(180,320)" fill="${a(G.goldBright, 0.09)}">
<use href="#emFrond" transform="rotate(-63)"/><use href="#emFrond" transform="rotate(-42)"/>
<use href="#emFrond" transform="rotate(-21)"/><use href="#emFrond"/>
<use href="#emFrond" transform="rotate(21)"/><use href="#emFrond" transform="rotate(42)"/>
<use href="#emFrond" transform="rotate(63)"/>
</g>
<g transform="translate(1090,560) skewX(-6)" stroke="url(#emGold)" stroke-width="2" opacity=".5">
<use href="#emArch"/>
<use href="#emArch" transform="translate(112,0)" stroke="${a(P.accentBright, 0.8)}"/>
<use href="#emArch" transform="translate(56,-34) scale(.62)" stroke="${a(G.goldBright, 0.9)}"/>
</g>
<rect x="1090" y="688" width="256" height="14" fill="url(#emSadu)" opacity=".75" transform="skewX(-6) translate(72,0)"/>
<g fill="${a(G.goldBright, 0.85)}">
<path class="em-star" d="M340 170 344 180 354 184 344 188 340 198 336 188 326 184 336 180Z"/>
<path class="em-star em-star2" d="M1210 130 1213 138 1221 141 1213 144 1210 152 1207 144 1199 141 1207 138Z"/>
<path class="em-star em-star3" d="M760 96 763 103 770 106 763 109 760 116 757 109 750 106 757 103Z" fill="${a(P.accentBright, 0.8)}"/>
</g>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><svg viewBox="0 0 680 40" preserveAspectRatio="xMidYMid meet" focusable="false" role="presentation">
<defs>
<linearGradient id="emSepG" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${a(G.goldDeep, 0)}"/>
<stop offset=".2" stop-color="${G.goldDeep}"/>
<stop offset=".5" stop-color="${G.goldBright}"/>
<stop offset=".8" stop-color="${G.goldDeep}"/>
<stop offset="1" stop-color="${a(G.goldDeep, 0)}"/>
</linearGradient>
</defs>
<line x1="0" y1="17" x2="288" y2="17" stroke="url(#emSepG)" stroke-width="1"/>
<line x1="392" y1="17" x2="680" y2="17" stroke="url(#emSepG)" stroke-width="1"/>
<line x1="0" y1="22" x2="288" y2="22" stroke="${a(G.gold, 0.35)}" stroke-width="1"/>
<line x1="392" y1="22" x2="680" y2="22" stroke="${a(G.gold, 0.35)}" stroke-width="1"/>
<g transform="translate(340,20) skewX(-8)">
<path d="M-26 0 -14 -12 -2 0 -14 12Z" fill="${a(R[0], 0.9)}"/>
<path d="M-12 0 0 -12 12 0 0 12Z" fill="${G.gold}"/>
<path d="M2 0 14 -12 26 0 14 12Z" fill="${a(G.goldBright, 0.9)}"/>
</g>
</svg></div>`,
});

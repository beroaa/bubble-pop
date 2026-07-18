// SCENE PACK: majlis-heritage — Saudi majlis evening. The most Saudi one.
// Najdi arch wall with lit niches, hanging lanterns, sadu carpet band, crescent + stars.
// Saudi-premium: generous lantern gold over deep vivid brand color — never muddy.
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

const a = (h, al) => {
  const x = String(h).replace('#', '');
  const f = x.length === 3 ? x.split('').map((c) => c + c).join('') : x.slice(0, 6);
  const n = parseInt(f, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + al + ')';
};

export const scene = (P, R, G) => ({
  css: `
/* ===== majlis-heritage scene: vivid evening-majlis body wash ===== */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1150px 720px at 50% -12%, ${a(G.gold, 0.2)}, transparent 62%),
    radial-gradient(880px 620px at 8% 18%, ${a(P.accent, 0.3)}, transparent 60%),
    radial-gradient(900px 640px at 94% 30%, ${a(P.accent2, 0.18)}, transparent 62%),
    radial-gradient(1500px 940px at 50% 116%, ${a(P.deep, 0.6)}, transparent 74%),
    conic-gradient(from 140deg at 50% 4%, ${a(G.goldDeep, 0.14)}, transparent 26%, ${a(R[0], 0.09)} 48%, transparent 68%, ${a(G.gold, 0.1)});
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
.hero::before{
  content:""; position:absolute; inset:-6% -4% auto -4%; height:66%;
  background:radial-gradient(56% 78% at 50% 6%, ${a(G.goldBright, 0.14)}, transparent 70%);
  pointer-events:none; z-index:0;
}
.hero::after{
  content:""; position:absolute; inset:auto 0 0 0; height:34%;
  background:linear-gradient(0deg, ${a(P.deep, 0.34)}, transparent);
  pointer-events:none; z-index:0;
}

/* ===== lantern-gold foil headline (static base = reduced-motion fallback) ===== */
.room-h2 b, .heroline{
  background-image:linear-gradient(96deg,
    ${G.goldDeep} 0%, ${G.gold} 20%, ${G.goldBright} 37%, #fff4cf 50%,
    ${G.goldBright} 63%, ${G.gold} 80%, ${G.goldDeep} 100%);
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

/* ===== sadu weave accent band: stripes + 45deg diamond lattice ===== */
.gold-band{
  height:16px; width:100%;
  background-image:
    repeating-linear-gradient(45deg, ${a(P.deep, 0.55)} 0 6px, transparent 6px 12px),
    repeating-linear-gradient(-45deg, ${a(P.deep, 0.55)} 0 6px, transparent 6px 12px),
    repeating-linear-gradient(90deg,
      ${a(G.gold, 0.95)} 0 10px, ${P.deep} 10px 12px,
      ${a(R[1], 0.9)} 12px 16px, ${P.deep} 16px 18px,
      ${a(G.goldBright, 0.9)} 18px 24px, ${P.deep} 24px 26px,
      ${a(G.goldDeep, 0.95)} 26px 34px, ${P.deep} 34px 36px);
  border-top:1px solid ${a(G.goldBright, 0.6)};
  border-bottom:1px solid ${a(G.goldDeep, 0.75)};
  box-shadow:0 0 24px ${a(G.gold, 0.28)};
}

/* ===== section separator ===== */
.sep-scene{ display:block; max-width:720px; margin:44px auto; padding:0 18px; }
.sep-scene svg{ display:block; width:100%; height:auto; overflow:visible; }

/* ===== motion: gated + explicit reduce override ===== */
@media (prefers-reduced-motion: no-preference){
  .mh-glow{ animation:mhBreathe 8s ease-in-out infinite alternate; }
  .mh-lan{ transform-box:fill-box; transform-origin:50% 0%; animation:mhSway 7s ease-in-out infinite alternate; }
  .mh-lan2{ animation-duration:9s; animation-delay:1.2s; }
  .mh-lan3{ animation-duration:8s; animation-delay:2.3s; }
  .mh-flame{ animation:mhFlicker 3.8s ease-in-out infinite; }
  .mh-star{ animation:mhTwinkle 5s ease-in-out infinite; }
  .mh-star2{ animation-delay:1.6s; }
  .mh-star3{ animation-delay:3.1s; }
  .room-h2 b, .heroline{ animation:mhFoil 8s linear infinite; }
  @keyframes mhBreathe{ from{opacity:.72} to{opacity:1} }
  @keyframes mhSway{ from{transform:rotate(-2.2deg)} to{transform:rotate(2.2deg)} }
  @keyframes mhFlicker{ 0%,100%{opacity:.55} 42%{opacity:1} 58%{opacity:.8} }
  @keyframes mhTwinkle{ 0%,100%{opacity:.25} 50%{opacity:.95} }
  @keyframes mhFoil{ from{background-position:0% 0%} to{background-position:230% 0%} }
}
@media (prefers-reduced-motion: reduce){
  .scenebg, .scenebg *{ animation:none !important; }
  .room-h2 b, .heroline{ animation:none !important; background-position:0% 0%; }
}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" role="presentation">
<defs>
<radialGradient id="mhSky" cx="50%" cy="24%" r="66%">
<stop offset="0" stop-color="${a(G.goldBright, 0.2)}"/>
<stop offset=".4" stop-color="${a(P.accent, 0.1)}"/>
<stop offset=".75" stop-color="rgba(0,0,0,0)"/>
</radialGradient>
<linearGradient id="mhGold" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${G.goldBright}"/>
<stop offset=".5" stop-color="${G.gold}"/>
<stop offset="1" stop-color="${G.goldDeep}"/>
</linearGradient>
<linearGradient id="mhNiche" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${a(G.goldBright, 0.5)}"/>
<stop offset=".55" stop-color="${a(G.gold, 0.24)}"/>
<stop offset="1" stop-color="${a(P.deep, 0.1)}"/>
</linearGradient>
<radialGradient id="mhHalo" cx="50%" cy="50%" r="50%">
<stop offset="0" stop-color="${a(G.goldBright, 0.34)}"/>
<stop offset=".55" stop-color="${a(G.gold, 0.12)}"/>
<stop offset="1" stop-color="rgba(0,0,0,0)"/>
</radialGradient>
<pattern id="mhSadu" width="24" height="24" patternUnits="userSpaceOnUse">
<rect width="24" height="24" fill="${a(P.deep, 0.72)}"/>
<path d="M12 3 21 12 12 21 3 12Z" fill="${a(G.gold, 0.88)}"/>
<path d="M12 8 16 12 12 16 8 12Z" fill="${R[1]}"/>
</pattern>
<pattern id="mhCrest" width="48" height="26" patternUnits="userSpaceOnUse">
<path d="M0 26 24 2 48 26Z" fill="${a(P.deep, 0.85)}"/>
</pattern>
<path id="mhArch" d="M-36 150 L-36 44 Q-36 -4 0 -28 Q36 -4 36 44 L36 150 Z"/>
<g id="mhLan">
<rect x="-1" y="-420" width="2" height="416" fill="${a(G.gold, 0.55)}"/>
<circle cx="0" cy="0" r="4" fill="none" stroke="${G.gold}" stroke-width="2"/>
<path d="M-12 12 L12 12 L7 4 L-7 4 Z" fill="url(#mhGold)"/>
<path d="M-15 14 L15 14 L10 50 L0 58 L-10 50 Z" fill="${a(P.deep, 0.8)}" stroke="${G.gold}" stroke-width="1.6"/>
<path class="mh-flame" d="M-8 18 L8 18 L5 46 L-5 46 Z" fill="${a(G.goldBright, 0.85)}"/>
<circle cx="0" cy="62" r="3" fill="${G.goldDeep}"/>
</g>
</defs>
<rect class="mh-glow" width="1440" height="810" fill="url(#mhSky)"/>
<path d="M1074 96 A58 58 0 1 0 1130 168 A46 46 0 1 1 1074 96 Z" fill="url(#mhGold)" opacity=".5"/>
<g>
<path class="mh-star" transform="translate(268,150) scale(.95)" fill="${G.goldBright}" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
<path class="mh-star mh-star2" transform="translate(672,92) scale(.6)" fill="${R[2]}" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
<path class="mh-star mh-star3" transform="translate(1256,236) scale(.75)" fill="${R[3]}" d="M0 -9 2 -2 9 0 2 2 0 9 -2 2 -9 0 -2 -2Z"/>
</g>
<g class="mh-lan" transform="translate(300,168)"><circle r="76" fill="url(#mhHalo)"/><use href="#mhLan"/></g>
<g class="mh-lan mh-lan2" transform="translate(1148,224)"><circle r="88" fill="url(#mhHalo)"/><use href="#mhLan"/></g>
<g class="mh-lan mh-lan3" transform="translate(958,120) scale(.78)"><circle r="70" fill="url(#mhHalo)"/><use href="#mhLan"/></g>
<rect x="0" y="556" width="1440" height="26" fill="url(#mhCrest)"/>
<rect x="0" y="580" width="1440" height="230" fill="${a(P.deep, 0.82)}"/>
<rect x="0" y="580" width="1440" height="3" fill="${a(G.gold, 0.5)}"/>
<g fill="url(#mhNiche)" stroke="${a(G.gold, 0.45)}" stroke-width="2">
<use href="#mhArch" x="140" y="646"/><use href="#mhArch" x="430" y="646"/>
<use href="#mhArch" x="720" y="632"/>
<use href="#mhArch" x="1010" y="646"/><use href="#mhArch" x="1300" y="646"/>
</g>
<rect x="0" y="782" width="1440" height="28" fill="url(#mhSadu)" opacity=".92"/>
<rect x="0" y="779" width="1440" height="2" fill="${a(G.goldBright, 0.55)}"/>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><svg viewBox="0 0 720 44" focusable="false" role="presentation">
<defs>
<linearGradient id="mhSepL" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="rgba(0,0,0,0)"/>
<stop offset=".22" stop-color="${a(G.goldDeep, 0.9)}"/>
<stop offset=".5" stop-color="${G.goldBright}"/>
<stop offset=".78" stop-color="${a(G.goldDeep, 0.9)}"/>
<stop offset="1" stop-color="rgba(0,0,0,0)"/>
</linearGradient>
<linearGradient id="mhSepG" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${G.goldBright}"/>
<stop offset="1" stop-color="${G.goldDeep}"/>
</linearGradient>
</defs>
<rect x="0" y="21" width="720" height="2" rx="1" fill="url(#mhSepL)"/>
<g transform="translate(360,22)">
<path d="M-16 14 L-16 0 Q-16 -12 0 -18 Q16 -12 16 0 L16 14 Z" fill="${a(P.deep, 0.9)}" stroke="url(#mhSepG)" stroke-width="2"/>
<path d="M-9 14 L-9 2 Q-9 -6 0 -10 Q9 -6 9 2 L9 14 Z" fill="${a(G.goldBright, 0.55)}"/>
<path transform="translate(-42,0)" d="M0 -7 7 0 0 7 -7 0Z" fill="${G.gold}"/>
<path transform="translate(42,0)" d="M0 -7 7 0 0 7 -7 0Z" fill="${G.gold}"/>
<path transform="translate(-64,0)" d="M0 -4 4 0 0 4 -4 0Z" fill="${R[2]}"/>
<path transform="translate(64,0)" d="M0 -4 4 0 0 4 -4 0Z" fill="${R[2]}"/>
<circle cx="-86" cy="0" r="2.5" fill="${a(R[3], 0.9)}"/>
<circle cx="86" cy="0" r="2.5" fill="${a(R[3], 0.9)}"/>
</g>
</svg></div>`,
});

// Scene pack: "neon-arcade" — Saudi-premium neon night.
// Retro arcade grid + CRT scanlines fused with Najdi pointed arches,
// a gold-neon dallah sign, and sadu diamond bands. Gold = G tokens.
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

export const scene = (P, R, G) => ({
  css: `
/* ===== neon-arcade scene: vivid Saudi neon night ===== */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1100px 560px at 16% -8%, color-mix(in srgb, ${P.accent} 26%, transparent), transparent 62%),
    radial-gradient(900px 520px at 86% 2%, color-mix(in srgb, ${P.accent2} 22%, transparent), transparent 60%),
    radial-gradient(1200px 640px at 50% 112%, color-mix(in srgb, ${G.gold} 18%, transparent), transparent 66%),
    conic-gradient(from 210deg at 72% 18%, ${P.bg1}, ${P.bg0} 30%, color-mix(in srgb, ${P.deep} 55%, ${P.bg0}) 52%, ${P.bg0} 76%, ${P.bg1}),
    linear-gradient(180deg, ${P.bg0}, ${P.bg1} 58%, ${P.bg2});
  background-attachment:fixed;
}
/* CRT scanlines + soft vignette, above content but click-through */
body::after{
  content:""; position:fixed; inset:0; z-index:2; pointer-events:none;
  background:
    repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in srgb, ${P.ink} ${P.mode === 'dark' ? '30%' : '14%'}, transparent) 3px 4px),
    radial-gradient(130% 96% at 50% 38%, transparent 58%, color-mix(in srgb, ${P.ink} 42%, transparent));
  opacity:${P.mode === 'dark' ? '.32' : '.16'};
}
/* the big fixed scene (SVG lives in heroHtml) */
.scenebg{position:fixed; inset:0; width:100%; height:100%; z-index:-1; pointer-events:none; display:block;}
.nz-neon{filter:drop-shadow(0 0 5px color-mix(in srgb, ${P.accentBright} 85%, transparent)) drop-shadow(0 0 16px color-mix(in srgb, ${P.accent} 55%, transparent));}
.nz-goldneon{filter:drop-shadow(0 0 4px color-mix(in srgb, ${G.goldBright} 80%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, ${G.gold} 45%, transparent));}
/* gold-foil headline shine (static fallback = solid bright gold) */
.room-h2 b, .heroline{color:${G.goldBright}; text-shadow:0 0 18px color-mix(in srgb, ${G.gold} 45%, transparent);}
@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b, .heroline{
    background-image:linear-gradient(105deg, ${G.goldDeep} 0%, ${G.gold} 30%, ${G.goldBright} 46%, #fff4d0 52%, ${G.goldBright} 58%, ${G.gold} 72%, ${G.goldDeep} 100%);
    background-size:250% 100%; background-position:50% 0;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent; color:transparent; text-shadow:none;
  }
}
/* sadu-inspired gold accent band (triangle weave over brand warp threads) */
.gold-band{
  height:14px;
  border-top:1px solid color-mix(in srgb, ${G.goldDeep} 80%, transparent);
  border-bottom:1px solid color-mix(in srgb, ${G.goldDeep} 80%, transparent);
  background:
    conic-gradient(from 45deg at 50% 50%, color-mix(in srgb, ${G.goldBright} 92%, ${P.bg0}) 0 25%, transparent 0 50%, ${G.gold} 0 75%, transparent 0) 0 50%/14px 14px repeat,
    repeating-linear-gradient(90deg, color-mix(in srgb, ${P.accent} 80%, ${P.ink}) 0 10px, color-mix(in srgb, ${P.deep} 85%, ${P.ink}) 10px 14px);
  box-shadow:0 0 18px color-mix(in srgb, ${G.gold} 30%, transparent);
}
/* section separator: neon rails meeting sadu diamonds */
.sep-scene{display:flex; align-items:center; justify-content:center; gap:14px; margin:38px auto; padding:0 20px; max-width:640px;}
.sep-scene::before, .sep-scene::after{
  content:""; flex:1; height:2px; border-radius:2px;
  background:linear-gradient(90deg, transparent, color-mix(in srgb, ${R[2]} 65%, transparent) 55%, ${G.goldBright});
}
.sep-scene::after{transform:scaleX(-1);}
.sep-scene svg{display:block; flex:none; filter:drop-shadow(0 0 7px color-mix(in srgb, ${G.goldBright} 60%, transparent));}
/* motion only when the visitor allows it */
@media (prefers-reduced-motion: no-preference){
  @supports ((-webkit-background-clip:text) or (background-clip:text)){
    .room-h2 b, .heroline{animation:nzFoil 7s linear infinite;}
  }
  body::after{animation:nzScan 9s linear infinite;}
  .nz-pulse{animation:nzPulse 5.5s ease-in-out infinite;}
  .nz-flick{animation:nzFlick 6.4s steps(1,end) infinite;}
  .nz-stars{animation:nzTwinkle 4.8s ease-in-out infinite;}
}
@media (prefers-reduced-motion: reduce){
  body::after, .room-h2 b, .heroline, .nz-pulse, .nz-flick, .nz-stars{animation:none;}
}
@keyframes nzFoil{from{background-position:130% 0}to{background-position:-130% 0}}
@keyframes nzScan{from{background-position:0 0, 0 0}to{background-position:0 160px, 0 0}}
@keyframes nzPulse{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes nzFlick{0%,100%{opacity:1}7%{opacity:.35}9%{opacity:1}11%{opacity:.55}13%{opacity:1}54%{opacity:1}56%{opacity:.4}58%{opacity:1}}
@keyframes nzTwinkle{0%,100%{opacity:.9}50%{opacity:.45}}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="nzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.bg0}"/><stop offset=".58" stop-color="${P.deep}" stop-opacity=".5"/><stop offset="1" stop-color="${P.bg1}"/></linearGradient>
<radialGradient id="nzHal" cx=".5" cy=".63" r=".6"><stop offset="0" stop-color="${P.accentBright}" stop-opacity=".4"/><stop offset=".45" stop-color="${P.accent}" stop-opacity=".16"/><stop offset="1" stop-color="${P.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="nzAu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G.goldBright}"/><stop offset=".55" stop-color="${G.gold}"/><stop offset="1" stop-color="${G.goldDeep}"/></linearGradient>
<linearGradient id="nzSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G.goldBright}" stop-opacity=".8"/><stop offset="1" stop-color="${R[1]}" stop-opacity=".12"/></linearGradient>
</defs>
<rect width="1200" height="640" fill="url(#nzSky)"/>
<rect width="1200" height="640" fill="url(#nzHal)"/>
<g class="nz-stars" fill="${G.goldBright}"><circle cx="90" cy="70" r="1.6"/><circle cx="210" cy="128" r="1.2"/><circle cx="330" cy="52" r="1.5"/><circle cx="520" cy="120" r="1.2"/><circle cx="705" cy="60" r="1.6"/><circle cx="838" cy="140" r="1.2"/><circle cx="1080" cy="72" r="1.5"/><circle cx="1150" cy="200" r="1.2"/><path d="M600 66l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" opacity=".9"/><path d="M158 210l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" opacity=".7"/></g>
<path class="nz-pulse" d="M512 401a88 88 0 0 1 176 0z" fill="url(#nzSun)"/>
<g class="nz-neon" fill="none" stroke="${R[1]}" stroke-width="2.5" opacity=".85">
<path d="M120 401v-46c0-30 14-46 38-54 24 8 38 24 38 54v46"/>
<path class="nz-flick" d="M232 401v-64c0-40 18-60 48-70 30 10 48 30 48 70v64"/>
<path d="M364 401v-42c0-27 12-42 34-49 22 7 34 22 34 49v42"/>
</g>
<g class="nz-goldneon" fill="none" stroke="url(#nzAu)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M912 300c-16-28-12-56 10-74 10-9 12-20 6-32l-8-16 28 8 8-14h20l8 14 28-8-8 16c-6 12-4 23 6 32 22 18 26 46 10 74z"/>
<path d="M960 172l6-16 6 16"/>
<path d="M924 202q-28-8-36-36l16 2q6 20 24 26z"/>
<path d="M1010 200q30 8 28 36q-2 16-16 24"/>
<path d="M902 300h128"/>
</g>
<g fill="none" stroke="${R[0]}" stroke-width="1.4" opacity=".55"><path d="M600 402 -80 640M600 402 120 640M600 402 300 640M600 402 462 640M600 402 600 640M600 402 738 640M600 402 900 640M600 402 1080 640M600 402 1280 640"/></g>
<g fill="none" stroke="${P.accent2}" stroke-width="1.2" opacity=".5"><path d="M0 414h1200M0 430h1200M0 452h1200M0 482h1200M0 522h1200M0 574h1200M0 636h1200"/></g>
<path class="nz-neon" d="M0 401h1200" fill="none" stroke="${P.accentBright}" stroke-width="2.2"/>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><svg viewBox="0 0 132 26" width="132" height="26"><g fill="none" stroke-width="1.6"><path stroke="${G.gold}" opacity=".8" d="M16 13l11-8 11 8-11 8zM94 13l11-8 11 8-11 8z"/><path stroke="${G.goldBright}" stroke-width="2" d="M50 13 66 3l16 10-16 10z"/></g><path d="M60 13l6-4 6 4-6 4z" fill="${R[2]}"/><circle cx="6" cy="13" r="2" fill="${G.goldDeep}"/><circle cx="126" cy="13" r="2" fill="${G.goldDeep}"/></svg></div>`
});

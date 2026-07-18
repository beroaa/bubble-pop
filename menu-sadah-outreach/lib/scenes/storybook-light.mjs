// Scene pack: "storybook-light" — warm paper storybook, hand-inked, washi.
// Saudi premium layer: generous gold foil + deep vivid brand color, never muddy.
// Motifs used: Najdi arch skyline (hand-inked), palm frond fans, gold stars, sadu diamond band, dallah medallion (separator).
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

export const scene = (P, R, G) => ({
  css: `
/* ============ storybook-light scene: warm paper, inked arches, gold foil ============ */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1100px 720px at 82% -12%, color-mix(in srgb, ${P.accentBright} 20%, transparent), transparent 62%),
    radial-gradient(900px 640px at -8% 34%, color-mix(in srgb, ${P.accent2} 15%, transparent), transparent 60%),
    radial-gradient(820px 560px at 50% 110%, color-mix(in srgb, ${G.gold} 17%, transparent), transparent 66%),
    conic-gradient(from 205deg at 72% 16%, transparent 0 41%, color-mix(in srgb, ${G.goldBright} 8%, transparent) 47%, transparent 54%),
    repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in srgb, ${P.ink} 3%, transparent) 3px 4px);
  background-attachment:fixed;
}
/* big fixed inline-SVG scene (element supplied by heroHtml) */
.scenebg{
  position:fixed;inset:0;width:100vw;height:100vh;
  z-index:-1;pointer-events:none;display:block;
  opacity:${P.mode === 'dark' ? '.85' : '.7'};
}
.hero{position:relative;isolation:isolate}
/* ---- gold foil text: .room-h2 b / .heroline ---- */
.room-h2 b,.heroline{
  color:${G.goldBright};
  text-shadow:0 1px 0 color-mix(in srgb, ${G.goldDeep} 40%, transparent);
}
@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b,.heroline{
    background-image:linear-gradient(105deg,
      ${G.goldDeep} 0%, ${G.gold} 20%, ${G.goldBright} 37%,
      #fff3cd 50%, ${G.goldBright} 63%, ${G.gold} 80%, ${G.goldDeep} 100%);
    background-size:220% 100%;background-position:0% 0;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;text-shadow:none;
    filter:drop-shadow(0 2px 12px color-mix(in srgb, ${G.gold} 40%, transparent));
  }
}
/* ---- sadu-inspired accent band ---- */
.gold-band{
  height:16px;
  border-top:1px solid color-mix(in srgb, ${G.goldBright} 60%, transparent);
  border-bottom:1px solid color-mix(in srgb, ${G.goldDeep} 60%, transparent);
  background:
    conic-gradient(from 45deg,
      color-mix(in srgb, ${G.goldBright} 85%, transparent) 25%, transparent 0 50%,
      color-mix(in srgb, ${G.goldBright} 85%, transparent) 0 75%, transparent 0) 0 0/16px 16px,
    repeating-linear-gradient(90deg, ${P.deep} 0 10px, ${P.accent} 10px 20px, ${G.goldDeep} 20px 23px);
  box-shadow:0 1px 8px color-mix(in srgb, ${G.gold} 30%, transparent);
}
/* ---- section separator ---- */
.sep-scene{display:flex;align-items:center;gap:14px;width:min(520px,80%);margin:36px auto;opacity:.95}
.sep-scene .sep-ln{flex:1;height:2px;border-radius:2px;
  background:linear-gradient(90deg, transparent, ${G.gold} 35%, ${P.accentBright} 65%, transparent)}
.sep-scene svg{flex:0 0 auto;display:block;
  filter:drop-shadow(0 1px 6px color-mix(in srgb, ${G.gold} 35%, transparent))}
/* ---- motion (gated) ---- */
@media (prefers-reduced-motion:no-preference){
  .room-h2 b,.heroline{animation:sblFoil 8s linear infinite}
  .scenebg .sbl-tw{animation:sblTw 3.6s ease-in-out infinite}
  .scenebg .sbl-tw2{animation:sblTw 4.6s ease-in-out 1.2s infinite}
  .scenebg .sbl-tw3{animation:sblTw 5.4s ease-in-out 2.3s infinite}
  .scenebg .sbl-fan{animation:sblSway 14s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
  .sep-scene .sbl-steam{animation:sblSteam 4s ease-in-out infinite}
}
@keyframes sblFoil{from{background-position:0% 0}to{background-position:220% 0}}
@keyframes sblTw{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes sblSway{from{transform:rotate(-1.2deg)}to{transform:rotate(1.4deg)}}
@keyframes sblSteam{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:.8;transform:translateY(-2px)}}
@media (prefers-reduced-motion:reduce){
  .room-h2 b,.heroline,.scenebg *,.sep-scene *{animation:none !important}
}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
<radialGradient id="sblGlow" cx="50%" cy="36%" r="62%">
<stop offset="0" stop-color="${G.goldBright}" stop-opacity=".42"/>
<stop offset=".5" stop-color="${G.gold}" stop-opacity=".14"/>
<stop offset="1" stop-color="${G.gold}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="sblWash" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${P.accentBright}" stop-opacity=".2"/>
<stop offset=".55" stop-color="${P.accent}" stop-opacity=".06"/>
<stop offset="1" stop-color="${P.deep}" stop-opacity=".26"/>
</linearGradient>
<radialGradient id="sblVig" cx="50%" cy="32%" r="88%">
<stop offset=".62" stop-color="${P.deep}" stop-opacity="0"/>
<stop offset="1" stop-color="${P.deep}" stop-opacity=".3"/>
</radialGradient>
<pattern id="sblSadu" width="24" height="24" patternUnits="userSpaceOnUse">
<rect width="24" height="24" fill="${P.deep}"/>
<polygon points="12,3 21,12 12,21 3,12" fill="${G.gold}"/>
<polygon points="12,8 16,12 12,16 8,12" fill="${P.bg1}"/>
<polygon points="0,9 3,12 0,15" fill="${G.goldDeep}"/>
<polygon points="24,9 21,12 24,15" fill="${G.goldDeep}"/>
</pattern>
<path id="sblFrond" d="M0 0Q17-80 5-170Q-9-82 0 0Z"/>
<path id="sblStar" d="M0-8L2-2 8 0 2 2 0 8-2 2-8 0-2-2Z"/>
</defs>
<rect width="1440" height="900" fill="url(#sblWash)"/>
<circle cx="720" cy="320" r="440" fill="url(#sblGlow)"/>
<g class="sbl-fan"><g transform="translate(160 250)" fill="${R[0]}" opacity=".09">
<use href="#sblFrond" transform="rotate(-76)"/><use href="#sblFrond" transform="rotate(-50)"/><use href="#sblFrond" transform="rotate(-25)"/><use href="#sblFrond" transform="rotate(-2)"/><use href="#sblFrond" transform="rotate(22)"/><use href="#sblFrond" transform="rotate(47)"/><use href="#sblFrond" transform="rotate(72)"/>
</g></g>
<g class="sbl-fan"><g transform="translate(1280 230) scale(-1 1)" fill="${R[1]}" opacity=".08">
<use href="#sblFrond" transform="rotate(-70)"/><use href="#sblFrond" transform="rotate(-44)"/><use href="#sblFrond" transform="rotate(-18)"/><use href="#sblFrond" transform="rotate(8)"/><use href="#sblFrond" transform="rotate(34)"/><use href="#sblFrond" transform="rotate(60)"/>
</g></g>
<g fill="${G.goldBright}">
<use href="#sblStar" transform="translate(250 150) scale(.8)" class="sbl-tw"/>
<use href="#sblStar" transform="translate(480 90) scale(.55)" class="sbl-tw2"/>
<use href="#sblStar" transform="translate(950 120) scale(.7)" class="sbl-tw3"/>
<use href="#sblStar" transform="translate(1180 200) scale(.9)" class="sbl-tw"/>
<use href="#sblStar" transform="translate(720 70) scale(.6)" class="sbl-tw2"/>
<use href="#sblStar" transform="translate(1350 90) scale(.5)" class="sbl-tw3"/>
<use href="#sblStar" transform="translate(90 320) scale(.6)" class="sbl-tw3"/>
</g>
<path d="M0 828h130q32-96 96-96t96 96h200q42-128 116-128t116 128h190q32-84 84-84t84 84h328v72H0Z" fill="${R[2]}" opacity=".12"/>
<path d="M0 900V788h64q10-62 62-62t62 62h54v-92q0-24 22-37 22 13 22 37v52h64q9-50 50-50t50 50h74v-74q0-19 17-29 17 10 17 29v114h86q12-68 68-68t68 68h54v-62q0-21 19-32 19 11 19 32v22h72q10-54 54-54t54 54h64v-88q0-25 23-38 23 13 23 38v108h74H1440V900Z" fill="${P.deep}" fill-opacity=".34" stroke="${P.ink}" stroke-opacity=".45" stroke-width="2.5"/>
<rect y="871" width="1440" height="3" fill="${G.gold}" opacity=".8"/>
<rect y="874" width="1440" height="26" fill="url(#sblSadu)" opacity=".9"/>
<rect width="1440" height="900" fill="url(#sblVig)"/>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><span class="sep-ln"></span><svg width="46" height="46" viewBox="0 0 48 48" fill="none"><path class="sbl-steam" d="M22 7q3-3 0-6M27 8q3-3 0-6" stroke="${G.goldBright}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/><path d="M24 9l4 5h-8z" fill="${G.goldBright}"/><path d="M18 15q6-4 12 0l-1 3H19z" fill="${G.gold}"/><path d="M18 19h12c3 8 3 12-1 17q-5 4-10 0c-4-5-4-9-1-17z" fill="${G.gold}" stroke="${G.goldDeep}" stroke-width="1"/><path d="M17 21c-5-1-7-5-6-9l3 1c-.3 3 1 5 4 6z" fill="${G.goldDeep}"/><path d="M31 20q7 3 5 11" stroke="${G.goldDeep}" stroke-width="2" stroke-linecap="round"/><path d="M16 40h16" stroke="${P.accent}" stroke-width="2" stroke-linecap="round"/></svg><span class="sep-ln"></span></div>`
});

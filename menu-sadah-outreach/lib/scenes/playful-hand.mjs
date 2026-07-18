// Scene pack: "playful-hand" — wobbly hand-drawn playful, doodle energy, marker strokes.
// Saudi premium layer: generous gold foil + deep vivid brand color, never muddy.
// Motifs: doodled palm frond fans, hand-sketched star sparkles + petal confetti, wobbly Najdi arch skyline, sadu diamond band, doodle dallah (separator).
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }

export const scene = (P, R, G) => ({
  css: `
/* ============ playful-hand scene: wobbly doodles, marker ink, gold foil ============ */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1150px 760px at 88% -14%, color-mix(in srgb, ${P.accentBright} 22%, transparent), transparent 60%),
    radial-gradient(950px 660px at -10% 30%, color-mix(in srgb, ${P.accent2} 17%, transparent), transparent 58%),
    radial-gradient(860px 600px at 46% 112%, color-mix(in srgb, ${G.gold} 18%, transparent), transparent 64%),
    conic-gradient(from 160deg at 24% 12%, transparent 0 40%, color-mix(in srgb, ${G.goldBright} 9%, transparent) 46%, transparent 55%),
    radial-gradient(color-mix(in srgb, ${P.accent} ${P.mode === 'dark' ? '14%' : '9%'}, transparent) 1.6px, transparent 2.4px);
  background-size:auto,auto,auto,auto,30px 30px;
  background-attachment:fixed;
}
/* big fixed inline-SVG doodle scene (element supplied by heroHtml) */
.scenebg{
  position:fixed;inset:0;width:100vw;height:100vh;
  z-index:-1;pointer-events:none;display:block;
  opacity:${P.mode === 'dark' ? '.88' : '.74'};
}
.hero{position:relative;isolation:isolate}
/* ---- gold foil text: .room-h2 b / .heroline (fallback first) ---- */
.room-h2 b,.heroline{
  color:${G.goldBright};
  text-shadow:0 1px 0 color-mix(in srgb, ${G.goldDeep} 45%, transparent);
}
@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b,.heroline{
    background-image:linear-gradient(100deg,
      ${G.goldDeep} 0%, ${G.gold} 18%, ${G.goldBright} 36%,
      #fff4cf 50%, ${G.goldBright} 64%, ${G.gold} 82%, ${G.goldDeep} 100%);
    background-size:230% 100%;background-position:0% 0;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;text-shadow:none;
    filter:drop-shadow(0 2px 10px color-mix(in srgb, ${G.gold} 42%, transparent));
  }
}
/* ---- sadu-inspired accent band (playful zigzag weave) ---- */
.gold-band{
  height:16px;
  border-top:1px solid color-mix(in srgb, ${G.goldBright} 62%, transparent);
  border-bottom:1px solid color-mix(in srgb, ${G.goldDeep} 62%, transparent);
  background:
    conic-gradient(from 45deg,
      color-mix(in srgb, ${G.goldBright} 88%, transparent) 25%, transparent 0 50%,
      color-mix(in srgb, ${G.goldBright} 88%, transparent) 0 75%, transparent 0) 0 0/16px 16px,
    repeating-linear-gradient(90deg, ${P.deep} 0 9px, ${P.accent} 9px 18px, ${G.goldDeep} 18px 21px, ${P.accent2} 21px 30px);
  box-shadow:0 1px 9px color-mix(in srgb, ${G.gold} 32%, transparent);
}
/* ---- wobbly doodle separator ---- */
.sep-scene{display:flex;justify-content:center;width:min(560px,86%);margin:34px auto;opacity:.95}
.sep-scene svg{width:100%;height:auto;display:block;overflow:visible;
  filter:drop-shadow(0 1px 7px color-mix(in srgb, ${G.gold} 34%, transparent))}
.sep-scene .phd-wig{stroke-dasharray:7 6}
/* ---- motion (all gated) ---- */
@media (prefers-reduced-motion:no-preference){
  .room-h2 b,.heroline{animation:phdFoil 7.5s linear infinite}
  .scenebg .phd-tw{animation:phdTw 3.2s ease-in-out infinite}
  .scenebg .phd-tw2{animation:phdTw 4.4s ease-in-out 1.1s infinite}
  .scenebg .phd-tw3{animation:phdTw 5.2s ease-in-out 2.2s infinite}
  .scenebg .phd-fan{animation:phdSway 12s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
  .scenebg .phd-bob{animation:phdBob 6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 50%}
  .scenebg .phd-bob2{animation:phdBob 7.4s ease-in-out 1.4s infinite alternate;transform-box:fill-box;transform-origin:50% 50%}
  .scenebg .phd-loop{stroke-dasharray:10 8;animation:phdDash 22s linear infinite}
  .sep-scene .phd-wig{animation:phdDash 26s linear infinite}
  .sep-scene .phd-steam{animation:phdSteam 4s ease-in-out infinite}
}
@keyframes phdFoil{from{background-position:0% 0}to{background-position:230% 0}}
@keyframes phdTw{0%,100%{opacity:.18}50%{opacity:1}}
@keyframes phdSway{from{transform:rotate(-2deg)}to{transform:rotate(2.4deg)}}
@keyframes phdBob{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-9px) rotate(4deg)}}
@keyframes phdDash{from{stroke-dashoffset:0}to{stroke-dashoffset:-360}}
@keyframes phdSteam{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:.85;transform:translateY(-2.5px)}}
@media (prefers-reduced-motion:reduce){
  .room-h2 b,.heroline,.scenebg *,.sep-scene *{animation:none !important}
}
`,

  heroHtml: `<svg class="scenebg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<radialGradient id="phdGlow" cx="50%" cy="34%" r="60%"><stop offset="0" stop-color="${G.goldBright}" stop-opacity=".4"/><stop offset=".5" stop-color="${G.gold}" stop-opacity=".13"/><stop offset="1" stop-color="${G.gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="phdWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.accentBright}" stop-opacity=".22"/><stop offset=".55" stop-color="${P.accent}" stop-opacity=".07"/><stop offset="1" stop-color="${P.deep}" stop-opacity=".28"/></linearGradient>
<radialGradient id="phdVig" cx="50%" cy="32%" r="88%"><stop offset=".6" stop-color="${P.deep}" stop-opacity="0"/><stop offset="1" stop-color="${P.deep}" stop-opacity=".3"/></radialGradient>
<pattern id="phdSadu" width="26" height="24" patternUnits="userSpaceOnUse">
<rect width="26" height="24" fill="${P.deep}"/>
<path d="M13 3l9 9-9 9-9-9z" fill="${G.gold}"/>
<path d="M13 8l4.4 4-4.4 4-4-4z" fill="${P.bg1}"/>
<path d="M0 9l3.4 3L0 15zM26 9l-3.4 3 3.4 3z" fill="${G.goldDeep}"/>
</pattern>
<path id="phdFrond" d="M0 0q14-34 8-76 5 4 6 12 4-26-6-52 13 26 11 56 8-12 6-30 8 24-8 52 5 22-17 38z"/>
<path id="phdSpark" d="M0-11q2 8 3 9 1 1 8 2-7 2-8 3-1 1-3 9-2-8-3-9-1-1-8-3 7-1 8-2 1-1 3-9z"/>
<path id="phdPetal" d="M0 0q9-7 8-18-11 2-13 12-2 8 5 6z"/>
</defs>
<rect width="1440" height="900" fill="url(#phdWash)"/>
<circle cx="720" cy="310" r="430" fill="url(#phdGlow)"/>
<g class="phd-fan"><g transform="translate(150 300)" fill="none" stroke="${R[0]}" stroke-width="5" stroke-linecap="round" opacity=".16">
<use href="#phdFrond" transform="rotate(-64)"/><use href="#phdFrond" transform="rotate(-33)"/><use href="#phdFrond" transform="rotate(-4)"/><use href="#phdFrond" transform="rotate(26)"/><use href="#phdFrond" transform="rotate(58)"/>
</g></g>
<g class="phd-fan"><g transform="translate(1295 275) scale(-.9 .9)" fill="none" stroke="${R[1]}" stroke-width="5" stroke-linecap="round" opacity=".14">
<use href="#phdFrond" transform="rotate(-52)"/><use href="#phdFrond" transform="rotate(-16)"/><use href="#phdFrond" transform="rotate(24)"/>
</g></g>
<path class="phd-loop" d="M60 130q120-70 175 5t-58 74q-46-8 6-58 90-72 190-24" fill="none" stroke="${G.gold}" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>
<path class="phd-loop" d="M1390 480q-110 62-172-4t56-70" fill="none" stroke="${R[3]}" stroke-width="3.5" stroke-linecap="round" opacity=".33"/>
<g fill="${G.goldBright}">
<use href="#phdSpark" transform="translate(260 160) rotate(9)" class="phd-tw"/>
<use href="#phdSpark" transform="translate(500 84) scale(.6)" class="phd-tw2"/>
<use href="#phdSpark" transform="translate(958 120) scale(.8)" class="phd-tw3"/>
<use href="#phdSpark" transform="translate(1178 210) rotate(-8)" class="phd-tw"/>
<use href="#phdSpark" transform="translate(726 66) scale(.65)" class="phd-tw2"/>
<use href="#phdSpark" transform="translate(1352 96) scale(.5)" class="phd-tw3"/>
</g>
<g class="phd-bob"><g transform="translate(330 520)">
<use href="#phdPetal" fill="${R[2]}" opacity=".5" transform="scale(1.5)"/>
<use href="#phdPetal" fill="${R[0]}" opacity=".4" transform="translate(46 24) rotate(130) scale(1.2)"/>
</g></g>
<g class="phd-bob2"><g transform="translate(1120 560)">
<use href="#phdPetal" fill="${R[1]}" opacity=".45" transform="rotate(-40) scale(1.6)"/>
<use href="#phdPetal" fill="${G.gold}" opacity=".5" transform="translate(-38 28) rotate(200)"/>
</g></g>
<path d="M0 836q60-9 116-2 12-90 88-92t92 90q102-14 198-2 30-122 112-124t118 122q88-10 176-2 26-80 84-82t88 80q120-12 208 4 40-60 92-52 42 8 68 56v70H0z" fill="${P.deep}" fill-opacity=".36" stroke="${P.ink}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" stroke-dasharray="14 5"/>
<path d="M252 834q-4-52 26-56 28-3 30 54m330-6q-6-66 34-70 38-2 40 68m404 4q-3-46 24-50 26-3 28 48" fill="${P.bg1}" fill-opacity=".5" stroke="${G.gold}" stroke-width="3" opacity=".85"/>
<rect y="868" width="1440" height="3.5" fill="${G.gold}" opacity=".82"/>
<rect y="873" width="1440" height="27" fill="url(#phdSadu)" opacity=".92"/>
<rect width="1440" height="900" fill="url(#phdVig)"/>
</svg>`,

  sepHtml: `<div class="sep-scene" aria-hidden="true"><svg viewBox="0 0 560 64" fill="none" preserveAspectRatio="xMidYMid meet"><path class="phd-wig" d="M8 36q28-14 56 0t56 0 56-14 40 8" stroke="${P.accentBright}" stroke-width="3" stroke-linecap="round" opacity=".85"/><path class="phd-wig" d="M552 36q-28-14-56 0t-56 0-56-14-40 8" stroke="${G.gold}" stroke-width="3" stroke-linecap="round" opacity=".9"/><g transform="translate(256 6)"><path class="phd-steam" d="M20 10q3-4 0-8m8 9q3-4 0-8" stroke="${G.goldBright}" stroke-width="2" stroke-linecap="round" opacity=".6"/><path d="M24 12l5 6h-10z" fill="${G.goldBright}"/><path d="M17 20q7-4 14 0l-1 3H18z" fill="${G.gold}"/><path d="M17 24h14q4 9-1 16-6 5-12 0-5-7-1-16z" fill="${G.gold}" stroke="${G.goldDeep}" stroke-width="1.4" stroke-linecap="round"/><path d="M16 26q-6-1-6-9l3-1q0 6 4 7z" fill="${G.goldDeep}"/><path d="M32 25q7 3 4 11" stroke="${G.goldDeep}" stroke-width="2" stroke-linecap="round"/><path d="M14 46q10 4 20 0" stroke="${P.accent}" stroke-width="2.4" stroke-linecap="round"/></g><path d="M228 22q2 5 7 7-5 2-7 7-2-5-7-7 5-2 7-7z" fill="${R[0]}" opacity=".8"/><path d="M332 22q2 5 7 7-5 2-7 7-2-5-7-7 5-2 7-7z" fill="${G.goldBright}"/></svg></div>`
});

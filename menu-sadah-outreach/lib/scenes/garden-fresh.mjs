// garden-fresh — VIVID Saudi-premium scene pack
// Bright airy garden dawn: gold sunrise rays, drifting petals, palm-frond fans,
// arch-arcade silhouette on the horizon, sadu gold band. Motifs: palm fronds,
// Najdi arches, dawn stars (2-3 Saudi touches, tasteful, per premium brief).
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }. No JS, no external URLs.

export const scene = (P, R, G) => ({
  css: `
/* ============ garden-fresh :: vivid Saudi dawn-garden scene ============ */
.scenebg{position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block}
body{
  background-image:
    radial-gradient(1200px 560px at 50% -10%, color-mix(in srgb, ${G.goldBright} ${P.mode === 'dark' ? '17' : '26'}%, transparent), transparent 62%),
    radial-gradient(920px 640px at 10% 6%, color-mix(in srgb, ${P.accent2} ${P.mode === 'dark' ? '20' : '16'}%, transparent), transparent 64%),
    radial-gradient(1040px 720px at 90% 20%, color-mix(in srgb, ${P.accentBright} ${P.mode === 'dark' ? '16' : '13'}%, transparent), transparent 60%),
    radial-gradient(1400px 480px at 50% 104%, color-mix(in srgb, ${P.accent} ${P.mode === 'dark' ? '24' : '15'}%, transparent), transparent 72%),
    conic-gradient(from 168deg at 50% -14%, transparent 0deg, color-mix(in srgb, ${G.gold} 10%, transparent) 8deg, transparent 16deg, color-mix(in srgb, ${G.gold} 8%, transparent) 24deg, transparent 32deg, color-mix(in srgb, ${G.gold} 10%, transparent) 40deg, transparent 48deg),
    linear-gradient(180deg, ${P.bg1} 0%, ${P.bg0} 46%, ${P.bg0} 100%);
  background-attachment: fixed;
}
/* --- gold foil headline treatment (static gradient = built-in fallback) --- */
.room-h2 b,.heroline{
  background-image:linear-gradient(100deg, ${G.goldDeep} 0%, ${G.gold} 22%, ${G.goldBright} 42%, #fff6dc 50%, ${G.goldBright} 58%, ${G.gold} 78%, ${G.goldDeep} 100%);
  background-size:220% 100%;background-position:0% 0%;
  -webkit-background-clip:text;background-clip:text;
  color:${G.goldBright};-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 1px 14px color-mix(in srgb, ${G.gold} 30%, transparent));
}
@supports not (background-clip: text){
  .room-h2 b,.heroline{background-image:none;color:${G.goldBright};-webkit-text-fill-color:${G.goldBright};filter:none}
}
/* --- sadu-inspired gold accent band (usable anywhere) --- */
.gold-band{
  height:14px;margin:0;
  border-top:1px solid color-mix(in srgb, ${G.goldBright} 55%, transparent);
  border-bottom:1px solid color-mix(in srgb, ${G.goldDeep} 60%, transparent);
  background-image:
    repeating-linear-gradient(45deg, transparent 0 5px, color-mix(in srgb, ${G.goldBright} 60%, transparent) 5px 10px),
    repeating-linear-gradient(-45deg, transparent 0 5px, color-mix(in srgb, ${G.goldDeep} 50%, transparent) 5px 10px),
    linear-gradient(90deg, ${P.deep} 0%, ${P.accent} 30%, ${G.gold} 50%, ${P.accent} 70%, ${P.deep} 100%);
}
/* --- section separator --- */
.sep-scene{display:flex;align-items:center;gap:14px;max-width:560px;margin:38px auto;padding:0 18px}
.sep-scene .sl{flex:1;height:2px;border-radius:2px;background:linear-gradient(90deg, transparent, color-mix(in srgb, ${G.gold} 70%, transparent))}
.sep-scene .sl:last-child{background:linear-gradient(270deg, transparent, color-mix(in srgb, ${G.gold} 70%, transparent))}
.sep-scene svg{width:104px;height:30px;flex:none;display:block}
/* --- motion (only when the visitor allows it; scene is fully static otherwise) --- */
@media (prefers-reduced-motion: no-preference){
  .room-h2 b,.heroline{animation:gf-foil 8s linear infinite}
  .scenebg .gf-pf{animation:gf-drift 13s ease-in-out infinite}
  .scenebg .gf-pf2{animation:gf-drift 17s ease-in-out -6s infinite}
  .scenebg .gf-pf3{animation:gf-drift 21s ease-in-out -11s infinite}
  .scenebg .gf-tw{animation:gf-tw 5s ease-in-out infinite}
  .scenebg .gf-tw2{animation:gf-tw 5s ease-in-out -2.4s infinite}
  .scenebg .gf-fw{transform-box:fill-box;transform-origin:0 50%;animation:gf-sway 11s ease-in-out infinite alternate}
}
@media (prefers-reduced-motion: reduce){
  .room-h2 b,.heroline,.scenebg .gf-pf,.scenebg .gf-pf2,.scenebg .gf-pf3,.scenebg .gf-tw,.scenebg .gf-tw2,.scenebg .gf-fw{animation:none}
}
@keyframes gf-foil{0%{background-position:0% 0}100%{background-position:220% 0}}
@keyframes gf-drift{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(18px,26px) rotate(14deg)}}
@keyframes gf-tw{0%,100%{opacity:.2}50%{opacity:.9}}
@keyframes gf-sway{from{transform:rotate(-2deg)}to{transform:rotate(2.5deg)}}
`,

  heroHtml: `
<svg class="scenebg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
 <defs>
  <radialGradient id="gf-sun" cx="50%" cy="50%" r="50%">
   <stop offset="0%" stop-color="${G.goldBright}" stop-opacity=".5"/>
   <stop offset="45%" stop-color="${G.gold}" stop-opacity=".18"/>
   <stop offset="100%" stop-color="${G.gold}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gf-hor" cx="50%" cy="50%" r="50%">
   <stop offset="0%" stop-color="${P.accentBright}" stop-opacity=".26"/>
   <stop offset="100%" stop-color="${P.accentBright}" stop-opacity="0"/>
  </radialGradient>
  <path id="gf-l" d="M0 0C34 -16 78 -18 116 -4C76 6 34 8 0 0Z"/>
  <path id="gf-p" d="M0 0C7 2 9 9 4 16C0 11 -3 5 0 0Z"/>
  <path id="gf-s" d="M0 -7L1.8 -1.8L7 0L1.8 1.8L0 7L-1.8 1.8L-7 0L-1.8 -1.8Z"/>
  <path id="gf-a" d="M0 70V26Q0 8 20 0Q40 8 40 26V70"/>
  <g id="gf-fan">
   <use href="#gf-l" transform="rotate(-75)"/><use href="#gf-l" transform="rotate(-50)"/>
   <use href="#gf-l" transform="rotate(-25)"/><use href="#gf-l"/>
   <use href="#gf-l" transform="rotate(25)"/><use href="#gf-l" transform="rotate(50)"/>
   <use href="#gf-l" transform="rotate(75)"/>
  </g>
 </defs>
 <ellipse cx="720" cy="40" rx="640" ry="340" fill="url(#gf-sun)"/>
 <ellipse cx="720" cy="920" rx="900" ry="280" fill="url(#gf-hor)"/>
 <g transform="translate(28 214) rotate(15) scale(1.7)"><g class="gf-fw" fill="${P.accent}" opacity=".08"><use href="#gf-fan"/></g></g>
 <g transform="translate(1414 244) rotate(165) scale(1.8)"><g class="gf-fw" fill="${P.accent2}" opacity=".08"><use href="#gf-fan"/></g></g>
 <g stroke="${P.accent}" stroke-width="2.5" fill="none" opacity="${P.mode === 'dark' ? '.14' : '.1'}">
  <use href="#gf-a" transform="translate(500 740)"/><use href="#gf-a" transform="translate(555 740)"/>
  <use href="#gf-a" transform="translate(610 740)"/><use href="#gf-a" transform="translate(665 740)"/>
  <use href="#gf-a" transform="translate(720 740)"/><use href="#gf-a" transform="translate(775 740)"/>
  <use href="#gf-a" transform="translate(830 740)"/><use href="#gf-a" transform="translate(885 740)"/>
 </g>
 <g stroke="${G.gold}" stroke-width="2.5" fill="none" opacity=".16">
  <use href="#gf-a" transform="translate(130 726) scale(1.2)"/>
  <use href="#gf-a" transform="translate(1262 726) scale(1.2)"/>
 </g>
 <g fill="${G.goldBright}">
  <use href="#gf-s" class="gf-tw" opacity=".6" transform="translate(240 84)"/>
  <use href="#gf-s" class="gf-tw2" opacity=".5" transform="translate(424 142) scale(.8)"/>
  <use href="#gf-s" class="gf-tw" opacity=".55" transform="translate(1022 92) scale(1.15)"/>
  <use href="#gf-s" class="gf-tw2" opacity=".6" transform="translate(1242 152) scale(.9)"/>
  <use href="#gf-s" class="gf-tw2" opacity=".45" transform="translate(722 58) scale(.75)"/>
 </g>
 <g transform="translate(184 322) rotate(30) scale(1.7)"><use href="#gf-p" class="gf-pf" fill="${R[0]}" opacity=".5"/></g>
 <g transform="translate(262 182) rotate(-40) scale(1.3)"><use href="#gf-p" class="gf-pf2" fill="${R[1]}" opacity=".45"/></g>
 <g transform="translate(1178 302) rotate(120) scale(2)"><use href="#gf-p" class="gf-pf3" fill="${R[2]}" opacity=".5"/></g>
 <g transform="translate(1292 174) rotate(70) scale(1.4)"><use href="#gf-p" class="gf-pf" fill="${R[3]}" opacity=".45"/></g>
 <g transform="translate(642 122) rotate(-15) scale(1.2)"><use href="#gf-p" class="gf-pf2" fill="${G.goldBright}" opacity=".4"/></g>
 <g transform="translate(882 204) rotate(200) scale(1.6)"><use href="#gf-p" class="gf-pf3" fill="${R[0]}" opacity=".4"/></g>
 <g transform="translate(1062 424) rotate(95) scale(1.5)"><use href="#gf-p" class="gf-pf" fill="${R[1]}" opacity=".4"/></g>
 <g transform="translate(122 472) rotate(160) scale(1.9)"><use href="#gf-p" class="gf-pf2" fill="${R[2]}" opacity=".38"/></g>
</svg>
`,

  sepHtml: `
<div class="sep-scene" aria-hidden="true"><span class="sl"></span><svg viewBox="0 0 104 30" aria-hidden="true" focusable="false">
 <path d="M52 4L63 15L52 26L41 15Z" fill="none" stroke="${G.gold}" stroke-width="1.6"/>
 <path d="M52 9L58 15L52 21L46 15Z" fill="${G.goldBright}"/>
 <path d="M30 15h7M67 15h7" stroke="${G.goldDeep}" stroke-width="1.4"/>
 <path d="M22 15C18 11 14 10 10 12C13 15 17 17 22 15Z" fill="${P.accent}" opacity=".7"/>
 <path d="M82 15C86 11 90 10 94 12C91 15 87 17 82 15Z" fill="${P.accent2}" opacity=".7"/>
</svg><span class="sl"></span></div>
`
});

// scene pack: "ticket-diner" — kraft ticket diner, perforations, stamps
// Saudi-premium vivid layer: sadu diamond bands, dallah + steam, 8-point stamp star,
// gold-foil headings, layered radial/conic brand+gold gradients.
// Contract: export const scene = (P, R, G) => ({ css, heroHtml, sepHtml })

export const scene = (P, R, G) => ({
  css: `
/* ===== ticket-diner scene (Saudi premium) ===== */
body{
  background-color:${P.bg0};
  background-image:
    radial-gradient(1100px 640px at 84% -12%, color-mix(in srgb, ${P.accent} 26%, transparent), transparent 62%),
    radial-gradient(840px 540px at -8% 32%, color-mix(in srgb, ${G.gold} 18%, transparent), transparent 58%),
    radial-gradient(920px 720px at 50% 118%, color-mix(in srgb, ${P.deep} 52%, transparent), transparent 72%),
    conic-gradient(from 210deg at 50% 132%, ${P.bg0}, color-mix(in srgb, ${P.deep} 38%, ${P.bg0}), color-mix(in srgb, ${P.accent} 12%, ${P.bg0}), ${P.bg0});
  background-attachment:fixed;
}
/* big fixed scene canvas (SVG supplied by heroHtml) */
.scenebg{
  position:fixed;inset:0;width:100%;height:100%;
  z-index:-1;pointer-events:none;display:block;
  opacity:${P.mode === 'dark' ? '.55' : '.44'};
}
/* gold-foil text treatment — static gold fallback first, foil where supported */
.room-h2 b,.heroline{color:${G.goldBright};}
@supports ((-webkit-background-clip:text) or (background-clip:text)){
  .room-h2 b,.heroline{
    background-image:linear-gradient(105deg, ${G.goldDeep} 0%, ${G.gold} 24%, ${G.goldBright} 42%, #fff3cf 50%, ${G.goldBright} 58%, ${G.gold} 76%, ${G.goldDeep} 100%);
    background-size:240% 100%;background-position:50% 0;
    -webkit-background-clip:text;background-clip:text;
    -webkit-text-fill-color:transparent;color:transparent;
  }
}
/* sadu-inspired accent band (pure CSS diamond weave) */
.gold-band{
  height:16px;border-top:1px solid ${G.goldDeep};border-bottom:1px solid ${G.goldDeep};
  background-color:${P.deep};
  background-image:
    repeating-linear-gradient(45deg, ${G.gold} 0 25%, transparent 0 50%),
    repeating-linear-gradient(-45deg, color-mix(in srgb, ${R[1]} 70%, ${G.gold}) 0 25%, transparent 0 50%);
  background-size:18px 18px;
  box-shadow:0 1px 0 color-mix(in srgb, ${G.goldBright} 45%, transparent), 0 -1px 0 color-mix(in srgb, ${G.goldBright} 45%, transparent);
}
/* section separator */
.sep-scene{display:flex;justify-content:center;align-items:center;padding:20px 0;}
.sep-scene svg{width:min(440px,78vw);height:auto;display:block;opacity:.92;}
/* motion — only when the visitor allows it */
@media (prefers-reduced-motion:no-preference){
  .room-h2 b,.heroline{animation:td-foil 8s linear infinite;}
  .scenebg .td-sway{animation:td-sway 12s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
  .scenebg .td-stampp{animation:td-stamp 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
  .scenebg .td-steam{animation:td-steam 5.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%;}
  .scenebg .td-tw{animation:td-tw 4s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
  @keyframes td-foil{0%{background-position:120% 0}100%{background-position:-120% 0}}
  @keyframes td-sway{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-9px) rotate(.6deg)}}
  @keyframes td-stamp{0%,100%{transform:rotate(0deg) scale(1)}50%{transform:rotate(2.2deg) scale(1.035)}}
  @keyframes td-steam{0%{transform:translateY(5px);opacity:0}30%{opacity:.75}100%{transform:translateY(-15px);opacity:0}}
  @keyframes td-tw{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:.95;transform:scale(1.12)}}
}
@media (prefers-reduced-motion:reduce){
  .scenebg g,.scenebg path,.scenebg circle,.room-h2 b,.heroline{animation:none !important;}
}
`,

  heroHtml: `
<svg class="scenebg" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" role="presentation">
<defs>
<linearGradient id="tdG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${G.goldBright}"/><stop offset=".5" stop-color="${G.gold}"/><stop offset="1" stop-color="${G.goldDeep}"/></linearGradient>
<linearGradient id="tdK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.bg2}"/><stop offset="1" stop-color="${P.bg1}"/></linearGradient>
<radialGradient id="tdR" cx=".5" cy=".32" r=".8"><stop offset="0" stop-color="${P.accent}" stop-opacity=".5"/><stop offset="1" stop-color="${P.deep}" stop-opacity="0"/></radialGradient>
<pattern id="tdS" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="${P.deep}"/><polygon points="13,3 23,13 13,23 3,13" fill="${G.gold}" opacity=".6"/><polygon points="13,8 18,13 13,18 8,13" fill="${R[2]}" opacity=".8"/></pattern>
</defs>
<rect width="1200" height="640" fill="url(#tdR)" opacity=".65"/>
<g transform="rotate(-6 600 330)"><g class="td-sway">
<rect x="330" y="210" width="540" height="240" rx="18" fill="url(#tdK)" stroke="${P.border2}" stroke-width="2"/>
<rect x="330" y="210" width="540" height="240" rx="18" fill="${G.gold}" opacity=".1"/>
<circle cx="330" cy="330" r="16" fill="${P.bg0}"/><circle cx="870" cy="330" r="16" fill="${P.bg0}"/>
<line x1="742" y1="222" x2="742" y2="438" stroke="${P.border2}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>
<rect x="354" y="232" width="356" height="16" fill="url(#tdS)"/>
<rect x="354" y="288" width="300" height="7" rx="3.5" fill="url(#tdG)"/>
<rect x="354" y="316" width="252" height="5" rx="2.5" fill="${P.text3}" opacity=".55"/>
<rect x="354" y="336" width="212" height="5" rx="2.5" fill="${P.text3}" opacity=".4"/>
<rect x="354" y="386" width="140" height="30" rx="15" fill="none" stroke="${P.accentBright}" stroke-width="2.5" opacity=".85"/>
<rect x="366" y="398" width="116" height="6" rx="3" fill="${R[0]}" opacity=".8"/>
<path d="M792 258 L806 244 L820 258 L806 272 Z" fill="${G.gold}" opacity=".85"/>
<rect x="770" y="300" width="72" height="5" rx="2.5" fill="${P.text3}" opacity=".5"/>
<rect x="770" y="320" width="56" height="5" rx="2.5" fill="${P.text3}" opacity=".38"/>
<rect x="770" y="386" width="72" height="30" rx="6" fill="none" stroke="${G.goldDeep}" stroke-width="2" stroke-dasharray="5 5" opacity=".8"/>
</g></g>
<g transform="rotate(12 952 486)"><g class="td-stampp" opacity=".9">
<circle cx="952" cy="486" r="58" fill="none" stroke="${P.accentBright}" stroke-width="3" stroke-dasharray="4 7"/>
<circle cx="952" cy="486" r="44" fill="none" stroke="${P.accentBright}" stroke-width="2" opacity=".75"/>
<g fill="${G.gold}" opacity=".85"><rect x="932" y="466" width="40" height="40"/><rect x="932" y="466" width="40" height="40" transform="rotate(45 952 486)"/></g>
<circle cx="952" cy="486" r="9" fill="${P.deep}"/><circle cx="952" cy="486" r="4.5" fill="${G.goldBright}"/>
</g></g>
<g transform="translate(128 268) scale(1.35)" fill="${G.gold}" opacity=".8">
<circle cx="50" cy="6" r="5"/>
<path d="M38 34 L50 14 L62 34 L58 46 C78 56 84 92 72 120 L28 120 C16 92 22 56 42 46 Z"/>
<path d="M24 120 L76 120 L82 136 L18 136 Z"/>
<path d="M30 62 C12 56 4 40 12 24 L20 22 C14 38 22 50 36 55 Z"/>
<path d="M70 62 C92 66 92 96 72 104" fill="none" stroke="${G.gold}" stroke-width="6" stroke-linecap="round"/>
<path class="td-steam" d="M44 -6 C38 -16 50 -24 44 -34" fill="none" stroke="${G.goldBright}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
<path class="td-steam" d="M58 -10 C52 -20 64 -28 58 -38" fill="none" stroke="${G.goldBright}" stroke-width="3" stroke-linecap="round" opacity=".55" style="animation-delay:1.4s"/>
</g>
<g fill="${G.goldBright}">
<path class="td-tw" d="M210 96 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z"/>
<path class="td-tw" d="M1050 150 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" style="animation-delay:.9s" fill="${R[1]}"/>
<path class="td-tw" d="M620 92 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 Z" style="animation-delay:1.8s"/>
<path class="td-tw" d="M1104 336 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5 Z" style="animation-delay:2.6s" fill="${R[3]}"/>
<path class="td-tw" d="M96 520 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" style="animation-delay:.5s"/>
</g>
<rect y="602" width="1200" height="24" fill="${P.deep}" opacity=".9"/>
<rect y="606" width="1200" height="16" fill="url(#tdS)" opacity=".85"/>
</svg>
`,

  sepHtml: `
<div class="sep-scene" aria-hidden="true">
<svg viewBox="0 0 600 44" role="presentation" focusable="false">
<line x1="18" y1="22" x2="238" y2="22" stroke="${G.goldDeep}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round"/>
<line x1="362" y1="22" x2="582" y2="22" stroke="${G.goldDeep}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round"/>
<polygon points="262,22 272,12 282,22 272,32" fill="${P.accentBright}" opacity=".85"/>
<polygon points="318,22 328,12 338,22 328,32" fill="${P.accentBright}" opacity=".85"/>
<g><rect x="288" y="10" width="24" height="24" fill="${G.gold}"/><rect x="288" y="10" width="24" height="24" fill="${G.gold}" transform="rotate(45 300 22)"/><circle cx="300" cy="22" r="5" fill="${G.goldBright}" stroke="${G.goldDeep}" stroke-width="1.5"/></g>
</svg>
</div>
`
});

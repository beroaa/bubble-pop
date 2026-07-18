// Swap MENUS copy buttons to payload businessman DMs (dm/dmEn), via menuReveal.
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

// slug -> {a: dm(AR), e: dmEn(EN)}
const MDM = {};
pay.forEach(p => { if (p.dm || p.dmEn) MDM[p.slug] = { a: p.dm || "", e: p.dmEn || "" }; });
console.log("MDM entries:", Object.keys(MDM).length);

// 1. globals: MDM map + MDMfor (after gord)
s = replaceOnce(s,
  `function gord(l){var g=GMETA[gradeFor(l)];return g?g.ord:9;}`,
  `function gord(l){var g=GMETA[gradeFor(l)];return g?g.ord:9;}
var MDM=${JSON.stringify(MDM)};
function MDMfor(l){var m=menuFor(l);if(!m||!m.brand)return null;var slug=String(m.brand).replace(/\\/+$/,"").split("/").pop();return MDM[slug]||null;}`,
  "1:MDM-globals");

// 2. menuReveal: prefer payload DMs (unique anchor = the return with ar:a,en:e)
s = replaceOnce(s,
  `var rec=(opener(l)||{}).rec||"Arabic";\n  return {text:(rec==="English"?e:a),lang:(rec==="English"?"English":"Arabic"),ar:a,en:e};}`,
  `var _md=(typeof MDMfor==="function")?MDMfor(l):null;if(_md){if(_md.a)a=_md.a;if(_md.e)e=_md.e;}\n  var rec=(opener(l)||{}).rec||"Arabic";\n  return {text:(rec==="English"?e:a),lang:(rec==="English"?"English":"Arabic"),ar:a,en:e};}`,
  "2:menuReveal");

fs.writeFileSync(REAL, s);
console.log("WROTE", REAL, "bytes:", s.length);

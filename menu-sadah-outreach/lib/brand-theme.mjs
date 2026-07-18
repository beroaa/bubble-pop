// MENU SADAH — brand-DNA theme engine.
// Every cafe gets its OWN palette, derived only from real evidence:
// its name (English + Arabic), its slug, and its cafe type. No two alike.
// Deterministic: same cafe always renders the same identity (no Math.random).

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function hslHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

/* ---- name DNA: if the brand's own name carries a color world, honor it ---- */
const NAME_RULES = [
  [/rose|rosa|ورد/i, { h: 340, s: 52, label: 'rose' }],
  [/cherry|كرز/i, { h: 352, s: 58, label: 'cherry' }],
  [/strawberr|فراول/i, { h: 345, s: 55, label: 'strawberry' }],
  [/berry|توت/i, { h: 330, s: 50, label: 'berry' }],
  [/peach|خوخ|مشمش|apricot/i, { h: 20, s: 58, label: 'peach' }],
  [/sunset|غروب/i, { h: 14, s: 62, label: 'sunset' }],
  [/sun|شمس|صباح|morning|sabah/i, { h: 30, s: 62, label: 'sunrise' }],
  [/orange|برتقال/i, { h: 26, s: 62, label: 'orange' }],
  [/honey|عسل/i, { h: 40, s: 60, label: 'honey' }],
  [/gold|ذهب/i, { h: 44, s: 58, label: 'gold' }],
  [/saffron|زعفران/i, { h: 38, s: 64, label: 'saffron' }],
  [/lemon|ليمون/i, { h: 52, s: 56, label: 'lemon' }],
  [/olive|زيتون/i, { h: 74, s: 40, label: 'olive' }],
  [/pistachio|فستق/i, { h: 95, s: 42, label: 'pistachio' }],
  [/matcha|ماتشا/i, { h: 105, s: 44, label: 'matcha' }],
  [/mint|نعناع/i, { h: 152, s: 45, label: 'mint' }],
  [/palm|نخل/i, { h: 140, s: 40, label: 'palm' }],
  [/green|أخضر|خضرا/i, { h: 130, s: 44, label: 'green' }],
  [/tealium|teal|فيروز|turquoise/i, { h: 176, s: 48, label: 'turquoise' }],
  [/sea|بحر|موج|wave|ocean|marine/i, { h: 190, s: 50, label: 'sea' }],
  [/sky|سما|cloud|غيم|سحاب/i, { h: 204, s: 52, label: 'sky' }],
  [/blue|أزرق/i, { h: 215, s: 52, label: 'blue' }],
  [/night|ليل|moon|قمر|نجم|star/i, { h: 236, s: 40, label: 'midnight' }],
  [/lavender|بنفسج|violet|purple/i, { h: 268, s: 46, label: 'lavender' }],
  [/grape|عنب/i, { h: 278, s: 44, label: 'grape' }],
  [/fig|تين/i, { h: 288, s: 38, label: 'fig' }],
  [/chocolat|شوكولا|كاكاو|cocoa|coco/i, { h: 25, s: 48, label: 'cocoa' }],
  [/caramel|كراميل/i, { h: 34, s: 56, label: 'caramel' }],
  [/vanilla|فانيلا/i, { h: 46, s: 34, label: 'vanilla' }],
  [/cream|كريم|milk|حليب|لبن/i, { h: 42, s: 32, label: 'cream' }],
  [/sand|رمل|صحرا|desert|dune|دون/i, { h: 38, s: 38, label: 'desert sand' }],
  [/white|أبيض|بياض/i, { h: 46, s: 26, label: 'champagne' }],
  [/black|أسود|dark|دارك/i, { h: 45, s: 22, label: 'noir' }],
  [/smoke|دخان|ash|رماد/i, { h: 220, s: 12, label: 'smoke' }],
];

/* ---- type DNA: curated hue pools per cafe family (fallback) ---- */
const TYPE_POOLS = {
  specialty_coffee: { hues: [30, 38, 22, 44, 16], s: 55, label: 'roast amber' },
  roastery: { hues: [18, 26, 12, 32], s: 58, label: 'copper ember' },
  dessert_cafe: { hues: [335, 350, 320, 22], s: 52, label: 'berry cream' },
  bakery_cafe: { hues: [38, 44, 30, 50], s: 52, label: 'golden wheat' },
  matcha_bar: { hues: [105, 95, 130, 150], s: 44, label: 'garden matcha' },
  tea_house: { hues: [38, 82, 160, 28], s: 48, label: 'amber jade' },
  gaming_cafe: { hues: [265, 192, 318, 210], s: 68, label: 'arcade neon' },
  family_cafe: { hues: [20, 35, 130, 350], s: 48, label: 'warm hearth' },
};
const DEFAULT_POOL = TYPE_POOLS.specialty_coffee;

export function brandTheme(entry = {}) {
  const src = `${entry.name || ''} ${entry.nameAr || ''} ${entry.slug || ''}`.toLowerCase();
  const seed = hash(entry.slug || entry.name || 'sadah');

  let h, s, label;
  const rule = NAME_RULES.find(([re]) => re.test(src));
  if (rule) {
    ({ h, s, label } = rule[1]);
    label = `${label} (from the name)`;
  } else {
    const pool = TYPE_POOLS[entry.type] || DEFAULT_POOL;
    h = pool.hues[seed % pool.hues.length];
    s = pool.s;
    label = pool.label;
  }
  // per-cafe jitter: even same-family neighbours get their own shade
  h += (seed % 13) - 6;
  s = clamp(s + ((seed >> 4) % 11) - 5, 15, 90);
  const l = 62 + ((seed >> 8) % 7) - 3;

  const bgS = clamp(Math.round(s * 0.5), 12, 30);
  return {
    label,
    accent: hslHex(h, s, l),                // the brand color
    accent2: hslHex(h + 16, clamp(s + 8, 0, 90), clamp(l + 12, 0, 92)), // glow gradient partner
    deep: hslHex(h, clamp(s - 4, 0, 100), 33),        // dark of the same world
    ink: hslHex(h, clamp(s * 0.6, 0, 60), 9),         // button text on accent
    bg0: hslHex(h, bgS, 7),
    bg1: hslHex(h, clamp(bgS - 3, 10, 26), 11),
    bg2: hslHex(h, clamp(bgS - 6, 8, 22), 15),
    border1: hslHex(h, 20, 19),
    border2: hslHex(h, 24, 28),
    text1: hslHex(h, 18, 94),
    text2: hslHex(h, 13, 76),
    text3: hslHex(h, 9, 54),
  };
}

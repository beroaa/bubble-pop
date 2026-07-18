// MENU SADAH — LUXE tier renderer (v4 "twin" template).
// Every cafe renders in its OWN brand palette (lib/brand-theme.mjs) with a
// cinematic glow treatment: layered light orbs, glossy medallion, soft colored
// shadows on the illustrated art. Photo-ready slots remain (drop real photos
// into dist/assets/photos/<key>.jpg on hosting and every luxe menu upgrades).
import { CONTACT } from '../cafes.mjs';
import { brandTheme } from './brand-theme.mjs';

const SAR = '﷼';

/* ---------- illustrated art (inline SVG, keyed, theme-tinted) ---------- */
const ART = {
  espresso: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.accent}"/><stop offset="1" stop-color="${T.deep}"/></linearGradient></defs><path d="M30 55h52v28a14 14 0 0 1-14 14H44a14 14 0 0 1-14-14z" fill="url(#ge)"/><path d="M82 58h10a10 10 0 0 1 0 20h-8" fill="none" stroke="${T.accent}" stroke-width="5"/><ellipse cx="56" cy="55" rx="26" ry="5" fill="${T.accent2}"/><path d="M46 20c-4 8 4 10 0 18M60 16c-4 8 4 10 0 18M74 20c-4 8 4 10 0 18" stroke="${T.text2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="56" cy="104" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  latte: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5efe6"/><stop offset=".45" stop-color="${T.accent2}"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M38 24h44l-5 74a10 10 0 0 1-10 9H53a10 10 0 0 1-10-9z" fill="url(#gl)"/><path d="M38 24h44l-1.2 18H39.2z" fill="#fff" opacity=".85"/><path d="M52 42c4-6 12-6 16 0-6 4-10 4-16 0z" fill="${T.accent}" opacity=".7"/><ellipse cx="60" cy="24" rx="22" ry="4.5" fill="#fff"/><ellipse cx="60" cy="111" rx="26" ry="4" fill="#000" opacity=".3"/></svg>`,
  v60: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M28 30h64l-22 34h-20z" fill="none" stroke="${T.accent}" stroke-width="5"/><path d="M40 36h40l-15 23h-10z" fill="${T.accent}" opacity=".35"/><path d="M60 66v12" stroke="${T.text2}" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M36 84h48v6a16 16 0 0 1-16 16H52a16 16 0 0 1-16-16z" fill="${T.accent}"/><path d="M84 86h8a8 8 0 0 1 0 16h-6" fill="none" stroke="${T.accent}" stroke-width="4"/><ellipse cx="60" cy="108" rx="28" ry="4" fill="#000" opacity=".3"/></svg>`,
  cold: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.accent2}" stop-opacity=".5"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M40 22h40l-4 78a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8z" fill="url(#gc)" opacity=".9"/><rect x="46" y="34" width="13" height="13" rx="3" fill="#fff" opacity=".7" transform="rotate(12 52 40)"/><rect x="60" y="52" width="13" height="13" rx="3" fill="#fff" opacity=".55" transform="rotate(-14 66 58)"/><rect x="48" y="70" width="12" height="12" rx="3" fill="#fff" opacity=".45" transform="rotate(8 54 76)"/><path d="M74 14 60 46" stroke="${T.text2}" stroke-width="4" stroke-linecap="round"/><ellipse cx="60" cy="112" rx="24" ry="4" fill="#000" opacity=".3"/></svg>`,
  matcha: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gm" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#a8c88a"/><stop offset="1" stop-color="#5f7f43"/></radialGradient></defs><path d="M26 52h68a34 26 0 0 1-68 0z" fill="url(#gm)"/><ellipse cx="60" cy="52" rx="34" ry="8" fill="#c2dca4"/><path d="M50 48c3 2 17 2 20 0" stroke="#5f7f43" stroke-width="3" fill="none" opacity=".6"/><path d="M84 24c2 8-2 14-6 18M90 28c1 6-2 11-5 14M78 22c1 7-3 13-6 16" stroke="${T.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="94" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  croissant: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gcr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0cf8f"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M20 74c4-18 20-32 40-32s36 14 40 32c-6 8-16 8-22 2-4-10-12-16-18-16s-14 6-18 16c-6 6-16 6-22-2z" fill="url(#gcr)"/><path d="M45 46 38 70M60 42v26M75 46l7 24" stroke="${T.deep}" stroke-width="3" opacity=".5" stroke-linecap="round"/><ellipse cx="60" cy="88" rx="34" ry="4" fill="#000" opacity=".3"/></svg>`,
  cake: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2e0c8"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M34 50h52v38a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z" fill="url(#gk)"/><path d="M34 62h52M34 76h52" stroke="${T.deep}" stroke-width="5" opacity=".5"/><path d="M34 50c8-8 18-12 26-12s18 4 26 12c-8 5-17 7-26 7s-18-2-26-7z" fill="${T.accent2}"/><circle cx="60" cy="34" r="5" fill="#e25c5c"/><ellipse cx="60" cy="100" rx="32" ry="4" fill="#000" opacity=".3"/></svg>`,
  teapot: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M34 52h48a24 24 0 0 1-48 0z" fill="${T.accent}"/><path d="M34 52a24 24 0 0 0 48 0" fill="none" stroke="${T.deep}" stroke-width="2" opacity=".4"/><path d="M82 54c8-2 14 2 14 8s-6 10-12 8" fill="none" stroke="${T.accent}" stroke-width="5"/><path d="M34 56c-8-4-12-12-8-20l12 8" fill="${T.accent}"/><rect x="52" y="34" width="16" height="10" rx="4" fill="${T.accent}"/><circle cx="60" cy="30" r="5" fill="${T.accent2}"/><ellipse cx="60" cy="84" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  burger: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M28 52a32 22 0 0 1 64 0z" fill="#f0cf8f"/><circle cx="48" cy="42" r="2.4" fill="#fff"/><circle cx="62" cy="38" r="2.4" fill="#fff"/><circle cx="74" cy="44" r="2.4" fill="#fff"/><rect x="26" y="54" width="68" height="9" rx="4.5" fill="#7fa356"/><rect x="24" y="65" width="72" height="12" rx="6" fill="${T.accent}"/><rect x="28" y="79" width="64" height="13" rx="6.5" fill="#f0cf8f"/><ellipse cx="60" cy="98" rx="34" ry="4" fill="#000" opacity=".3"/></svg>`,
  beans: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M34 44h52l-6 56H40z" fill="${T.accent}" opacity=".85"/><path d="M34 44h52l-2 12H36z" fill="${T.deep}"/><path d="M46 30c0-8 28-8 28 0v14H46z" fill="none" stroke="${T.accent}" stroke-width="5"/><g fill="#5a3d1e"><ellipse cx="52" cy="74" rx="7" ry="10" transform="rotate(-20 52 74)"/><ellipse cx="68" cy="80" rx="7" ry="10" transform="rotate(15 68 80)"/></g><path d="M49 70c2 3 4 6 3 9M66 76c2 3 3 6 2 9" stroke="${T.accent2}" stroke-width="2" fill="none"/><ellipse cx="60" cy="104" rx="30" ry="4" fill="#000" opacity=".3"/></svg>`,
  saudi: (T) => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.accent2}"/><stop offset="1" stop-color="${T.accent}"/></linearGradient></defs><path d="M46 34h28l6 34a20 14 0 0 1-40 0z" fill="url(#gs)"/><path d="M50 30h20l3 6H47z" fill="${T.accent}"/><path d="M58 22h4v8h-4z" fill="${T.accent}"/><circle cx="60" cy="18" r="4" fill="${T.accent2}"/><path d="M46 40c-9 2-13 10-9 17 3 5 8 6 11 5" fill="none" stroke="${T.accent}" stroke-width="5" stroke-linecap="round"/><path d="M74 38l6-10 5 3-6 10" fill="${T.accent}"/><ellipse cx="60" cy="96" rx="28" ry="4" fill="#000" opacity=".3"/></svg>`,
};

function artFor(catEn, catAr) {
  const s = (catEn + ' ' + catAr).toLowerCase();
  if (/espresso|إسبريسو|حار/.test(s)) return ['espresso', 'espresso'];
  if (/filter|مقطر|v60|origins|محاصيل|brew bar|ترشيح/.test(s)) return ['v60', 'v60'];
  if (/cold|بارد|iced|مثلج/.test(s)) return ['cold', 'cold'];
  if (/matcha|ماتشا/.test(s)) return ['matcha', 'matcha'];
  if (/bakery|مخبوز|croissant|toast|فطائر|bites|لقيمات/.test(s)) return ['croissant', 'bakery'];
  if (/dessert|حلوي|sweet|cake|حلا/.test(s)) return ['cake', 'dessert'];
  if (/tea|شاي|كرك/.test(s)) return ['teapot', 'tea'];
  if (/fuel|burger|snack|وقود/.test(s)) return ['burger', 'snacks'];
  if (/beans|بن للبيت|روست/.test(s)) return ['beans', 'beans'];
  if (/سعود|saudi|دلة|قهوة عربية|majlis/.test(s)) return ['saudi', 'saudi'];
  return ['latte', 'latte'];
}

/* ---------- FULL menus per type (luxe tier) ---------- */
export const FULL_MENUS = {
  specialty_coffee: [
    { cat: 'Espresso Bar', catAr: 'البار الحار', items: [['Espresso', 'إسبريسو', 12], ['Macchiato', 'ماكياتو', 13], ['Cortado', 'كورتادو', 15], ['Flat White', 'فلات وايت', 17], ['Cappuccino', 'كابتشينو', 17], ['Latte', 'لاتيه', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Pistachio Latte', 'لاتيه فستق', 23]] },
    { cat: 'Filter & Slow Bar', catAr: 'بار الترشيح', items: [['V60 — Single Origin', 'في60 — محصول فردي', 24], ['Chemex', 'كيمكس', 24], ['Aeropress', 'إيروبرس', 22], ['Coffee of the Day', 'قهوة اليوم', 16], ['Iced Drip', 'مقطّرة باردة', 22]] },
    { cat: 'Cold Bar', catAr: 'البار البارد', items: [['Iced Latte', 'لاتيه بارد', 18], ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21], ['Cold Brew', 'كولد برو', 19], ['Cold Brew Tonic', 'كولد برو تونيك', 24], ['Iced Mocha', 'موكا باردة', 20]] },
    { cat: 'Saudi Corner', catAr: 'الركن السعودي', items: [['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25], ['Dates Plate', 'طبق تمر', 12]] },
    { cat: 'Bites & Sweets', catAr: 'اللقيمات والحلا', items: [['Butter Croissant', 'كرواسون زبدة', 12], ['Zaatar Croissant', 'كرواسون زعتر', 13], ['Chocolate Cookie', 'كوكيز شوكولاتة', 10], ['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26], ['Date Cake', 'كيكة التمر', 15]] },
  ],
  dessert_cafe: [
    { cat: 'House Desserts', catAr: 'حلا البيت', items: [['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26], ['Tiramisu', 'تيراميسو', 26], ['Chocolate Layer Cake', 'كيكة الشوكولاتة الطبقية', 25], ['Pistachio Bomb', 'قنبلة الفستق', 27], ['Mango Trifle', 'ترايفل مانجو', 24], ['Seasonal Dessert', 'حلا الموسم', 24]] },
    { cat: 'Warm & Gooey', catAr: 'دافي ولذيذ', items: [['Molten Chocolate Cake', 'كيكة الشوكولاتة الذائبة', 24], ['Kunafa Cup', 'كاسة كنافة', 19], ['Mini Pancakes', 'ميني بان كيك', 18]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Espresso', 'إسبريسو', 12], ['Cappuccino', 'كابتشينو', 17], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Drip Coffee', 'قهوة مقطّرة', 20]] },
    { cat: 'Cold Drinks', catAr: 'المشروبات الباردة', items: [['Iced Latte', 'لاتيه بارد', 18], ['Iced Chocolate', 'شوكولاتة باردة', 20], ['Milkshake', 'ميلك شيك', 22]] },
  ],
  bakery_cafe: [
    { cat: 'From the Oven', catAr: 'من الفرن', items: [['Cinnamon Bun', 'سينابون', 16], ['Almond Croissant', 'كرواسون لوز', 15], ['Butter Croissant', 'كرواسون زبدة', 12], ['Zaatar Croissant', 'كرواسون زعتر', 13], ['Pain au Chocolat', 'بان أو شوكولا', 14], ['Sourdough Loaf', 'رغيف ساوردو', 18]] },
    { cat: 'Toasts & Sandwiches', catAr: 'التوست والساندويتش', items: [['Avocado Sourdough Toast', 'توست أفوكادو', 24], ['Halloumi & Honey Toast', 'توست حلومي وعسل', 22], ['Turkey & Cheese Croissant', 'كرواسون تيركي وجبن', 21]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Flat White', 'فلات وايت', 17], ['Latte', 'لاتيه', 18], ['Iced Latte', 'لاتيه بارد', 18], ['V60', 'في60', 22]] },
    { cat: 'Fresh', catAr: 'المشروبات الطازجة', items: [['Orange Juice', 'عصير برتقال', 15], ['Lemon Mint', 'ليمون بالنعناع', 15]] },
  ],
  matcha_bar: [
    { cat: 'Matcha Bar', catAr: 'بار الماتشا', items: [['Hot Matcha', 'ماتشا حارة', 20], ['Iced Matcha', 'ماتشا باردة', 22], ['Strawberry Matcha', 'ماتشا فراولة', 25], ['Mango Matcha', 'ماتشا مانجو', 25], ['Matcha Affogato', 'ماتشا أفوغاتو', 26], ['Ceremonial Bowl', 'الطقس الياباني', 28]] },
    { cat: 'Coffee Too', catAr: 'وللقهوة عشّاقها', items: [['Espresso', 'إسبريسو', 12], ['Flat White', 'فلات وايت', 17], ['Iced Latte', 'لاتيه بارد', 18]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Matcha Cookie', 'كوكيز ماتشا', 12], ['Mochi (2 pcs)', 'موتشي (حبتين)', 14], ['Matcha Cheesecake', 'تشيز كيك ماتشا', 26]] },
  ],
  roastery: [
    { cat: "Today's Origins", catAr: 'محاصيل اليوم', items: [['V60 — Ethiopia', 'في60 — إثيوبيا', 24], ['V60 — Colombia', 'في60 — كولومبيا', 24], ['V60 — Panama Geisha', 'في60 — جيشا بنما', 38], ['Chemex', 'كيمكس', 24], ['Iced Filter', 'مقطّرة باردة', 22]] },
    { cat: 'Espresso', catAr: 'الإسبريسو', items: [['Single-Origin Espresso', 'إسبريسو محصول فردي', 14], ['Cortado', 'كورتادو', 15], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21]] },
    { cat: 'Beans To Go', catAr: 'بن للبيت', items: [['250g — Rotating Origin', '٢٥٠ جم — محصول متغيّر', 55], ['250g — Espresso Blend', '٢٥٠ جم — خلطة إسبريسو', 48], ['1kg — House Blend', 'كيلو — خلطة المحمصة', 160], ['Drip Bags (5)', 'أظرف تقطير (٥)', 35]] },
    { cat: 'Bites', catAr: 'اللقيمات', items: [['Brownie', 'براوني', 16], ['Date Maamoul', 'معمول تمر', 9]] },
  ],
  family_cafe: [
    { cat: 'Coffee & More', catAr: 'القهوة وأكثر', items: [['Cappuccino', 'كابتشينو', 17], ['Latte', 'لاتيه', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25], ['Karak', 'كرك', 8]] },
    { cat: 'Little Ones', catAr: 'لصغار البيت', items: [['Babyccino', 'بيبيتشينو', 8], ['Kids Hot Chocolate', 'هوت شوكلت أطفال', 12], ['Fresh Juice Box', 'عصير طازج', 10], ['Mini Pancakes', 'ميني بان كيك', 16]] },
    { cat: 'Family Bites', catAr: 'لقيمات العائلة', items: [['House Savoury Pastries', 'فطائر البيت المالحة', 14], ['Cheese Manakish', 'مناقيش جبن', 16], ['Club Sandwich', 'كلوب ساندويتش', 26], ['Fries', 'بطاطس', 14]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Date Cake', 'كيكة التمر', 15], ['Honey Cake', 'كيكة العسل', 18], ['Luqaimat', 'لقيمات', 14]] },
  ],
  tea_house: [
    { cat: 'Tea Bar', catAr: 'بار الشاي', items: [['Karak', 'كرك', 8], ['Karak Zaafran', 'كرك زعفران', 10], ['Moroccan Mint', 'أتاي مغربي', 14], ['Earl Grey Pot', 'إبريق إيرل جراي', 18], ['Hibiscus Iced Tea', 'كركديه بارد', 15], ['Iraqi Chai Pot', 'شاي عراقي', 16]] },
    { cat: 'Coffee', catAr: 'القهوة', items: [['Espresso', 'إسبريسو', 12], ['Latte', 'لاتيه', 18], ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25]] },
    { cat: 'With Your Chai', catAr: 'مع الشاهي', items: [['Chapati Roll', 'جباتي رول', 12], ['Samosa (3)', 'سمبوسة (٣)', 9], ['Date Maamoul', 'معمول تمر', 9], ['Honey Cake', 'كيكة العسل', 18]] },
  ],
  gaming_cafe: [
    { cat: 'Drinks', catAr: 'المشروبات', items: [['Espresso', 'إسبريسو', 12], ['Iced Latte', 'لاتيه بارد', 18], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Iced Tea', 'شاي مثلج', 14], ['Energy Mojito', 'موهيتو طاقة', 19]] },
    { cat: 'Game Fuel', catAr: 'وقود القيمرز', items: [['Smash Burger', 'سماش برجر', 28], ['Loaded Fries', 'بطاطس محمّلة', 19], ['Nachos', 'ناتشوز', 22], ['Hot Dog', 'هوت دوق', 16], ['Chicken Tenders', 'تندرز دجاج', 24]] },
    { cat: 'Sweets', catAr: 'الحلويات', items: [['Chocolate Cookie', 'كوكيز شوكولاتة', 10], ['Brownie', 'براوني', 16], ['Milkshake', 'ميلك شيك', 22]] },
  ],
};

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const patternFor = (T) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Ccircle cx='24' cy='24' r='1.2' fill='%23${T.accent.slice(1)}' fill-opacity='.13'/%3E%3C/svg%3E")`;

const themeFor = (cafe) => cafe.theme || brandTheme(cafe);

/* ---------- the luxe menu page ---------- */
export function luxeMenuPage(cafe) {
  const T = themeFor(cafe);
  const a = T.accent, a2 = T.accent2;
  const sigCat = cafe.menu.find((c) => /signature|توقيع/i.test(c.cat + c.catAr));
  const cats = cafe.menu.filter((c) => c !== sigCat);

  const navChips = cafe.menu.map((c, i) =>
    `<a class="chip" href="#cat-${i}"><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></a>`).join('');

  const sigHtml = sigCat ? `
  <section class="sig reveal" id="cat-${cafe.menu.indexOf(sigCat)}">
    <div class="sig-ribbon"><span class="ar">✦ توقيع البيت ✦</span><span class="en">✦ House Signatures ✦</span></div>
    <div class="sig-grid">
      ${sigCat.items.map(([en, ar, price]) => `
      <div class="sig-card">
        <div class="sig-art">${ART[artFor(en, ar)[0]](T)}</div>
        <div class="sig-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="sig-price">${price} <span class="sar">${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>` : '';

  const catHtml = cats.map((c) => {
    const i = cafe.menu.indexOf(c);
    const [artKey, photoKey] = artFor(c.cat, c.catAr);
    return `
  <section class="cat reveal" id="cat-${i}">
    <div class="cat-head">
      <div class="cat-art">
        <div class="cat-svg">${ART[artKey](T)}</div>
        <img src="../assets/photos/${photoKey}.jpg" alt="" loading="lazy" onload="this.parentElement.classList.add('hasimg')">
      </div>
      <div class="cat-title">
        <h2><span class="ar">${esc(c.catAr)}</span><span class="en">${esc(c.cat)}</span></h2>
        <div class="rule"><span>✦</span></div>
      </div>
    </div>
    <div class="items">
      ${c.items.map(([en, ar, price]) => `
      <div class="item">
        <div class="item-name"><span class="ar">${esc(ar)}</span><span class="en">${esc(en)}</span></div>
        <div class="dots"></div>
        <div class="price">${price}<span class="sar"> ${SAR}</span></div>
      </div>`).join('')}
    </div>
  </section>`;
  }).join('');

  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000'
    ? `https://wa.me/${CONTACT.whatsapp}` : null;

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${T.bg0}">
<title>${esc(cafe.name)} — Menu · MENU SADAH</title>
<style>
  :root{--bg-0:${T.bg0};--bg-1:${T.bg1};--bg-2:${T.bg2};--border-1:${T.border1};--border-2:${T.border2};
    --text-1:${T.text1};--text-2:${T.text2};--text-3:${T.text3};--accent:${a};--accent-2:${a2};--accent-soft:${a}22;
    --radius:16px;--shadow:0 6px 16px #00000080,0 16px 40px #00000059}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Tahoma,Roboto,Arial,sans-serif;
    background:var(--bg-0) ${patternFor(T)};color:var(--text-1);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100svh}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(620px 420px at 50% -120px,${a}17,transparent 70%)}
  .wrap{max-width:560px;margin:0 auto;padding:0 18px 110px;position:relative;z-index:1}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:30;background:${T.bg1}d9;backdrop-filter:blur(10px);
    border:1px solid var(--border-2);color:var(--text-1);border-radius:999px;padding:8px 16px;font-size:13.5px;cursor:pointer}

  .hero{position:relative;text-align:center;padding:76px 0 30px;overflow:hidden}
  .orb{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:340px;height:340px;border-radius:50%;
    background:radial-gradient(circle,${a}30,transparent 65%);pointer-events:none}
  .orb2{position:absolute;top:30px;left:12%;width:180px;height:180px;border-radius:50%;
    background:radial-gradient(circle,${a2}1f,transparent 65%);pointer-events:none}
  .medal{position:relative;width:104px;height:104px;margin:0 auto 18px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff2b,transparent 42%),radial-gradient(circle at 32% 28%,${a}42,${a}14 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 7px ${a}14,0 0 34px ${a}40,inset 0 1px 0 #ffffff33}
  .medal::after{content:"";position:absolute;inset:6px;border-radius:50%;border:1px solid ${a}55}
  .medal span{font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:700;color:var(--accent);
    text-shadow:0 2px 12px ${a}66}
  h1{font-size:34px;letter-spacing:-.01em;line-height:1.2}
  h1 .en{font-family:Georgia,'Times New Roman',serif}
  .tagline{color:var(--text-2);margin-top:8px;font-size:15.5px}
  .meta{margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .badge{background:var(--accent-soft);border:1px solid ${a}66;color:var(--accent);border-radius:999px;padding:4px 14px;font-size:12px;letter-spacing:.05em}
  .hrule{display:flex;align-items:center;gap:12px;margin:26px auto 0;max-width:280px;color:var(--accent)}
  .hrule::before,.hrule::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,${a}88)}
  .hrule::after{background:linear-gradient(90deg,${a}88,transparent)}

  .chips{display:flex;gap:8px;overflow-x:auto;padding:14px 2px;position:sticky;top:0;z-index:20;
    background:linear-gradient(${T.bg0}f2 78%,transparent);backdrop-filter:blur(8px);scrollbar-width:none}
  .chips::-webkit-scrollbar{display:none}
  .chip{flex:0 0 auto;text-decoration:none;color:var(--text-2);background:${T.bg1}cc;border:1px solid var(--border-1);
    border-radius:999px;padding:9px 18px;font-size:14px;transition:all .2s}
  .chip:hover{color:var(--accent);border-color:var(--accent);box-shadow:0 0 14px ${a}33}

  .sig{margin-top:26px;background:linear-gradient(180deg,${a}14,transparent 90%);border:1px solid ${a}44;
    border-radius:22px;padding:20px 16px 18px;position:relative}
  .sig-ribbon{text-align:center;color:var(--accent);letter-spacing:.14em;font-size:13px;margin-bottom:16px;font-weight:700}
  .sig-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
  .sig-card{background:var(--bg-1);border:1px solid var(--border-2);border-radius:var(--radius);padding:14px 12px;text-align:center;box-shadow:var(--shadow)}
  .sig-art{width:74px;height:74px;margin:0 auto 8px}
  .sig-art svg{width:100%;height:100%;filter:drop-shadow(0 6px 14px ${a}59)}
  .sig-name{font-size:14.5px;font-weight:600;line-height:1.35}
  .sig-price{margin-top:6px;color:var(--accent);font-weight:800;font-size:17px}
  .sar{font-size:11px}

  .cat{margin-top:34px}
  .cat-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .cat-art{position:relative;width:76px;height:76px;flex:0 0 auto;border-radius:18px;overflow:hidden;
    border:1px solid var(--border-2);background:var(--bg-1);box-shadow:var(--shadow)}
  .cat-art .cat-svg{position:absolute;inset:8px}
  .cat-art .cat-svg svg{filter:drop-shadow(0 5px 12px ${a}4d)}
  .cat-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}
  .cat-art.hasimg img{display:block}
  .cat-title{flex:1}
  .cat-title h2{color:var(--accent);font-size:19px;letter-spacing:.04em}
  .cat-title h2 .en{font-family:Georgia,'Times New Roman',serif}
  .rule{display:flex;align-items:center;gap:10px;color:${a}88;font-size:10px;margin-top:6px}
  .rule::before{content:"";width:46px;height:1px;background:${a}66}
  .rule::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,${a}44,transparent)}

  .items{background:${T.bg1}d9;border:1px solid var(--border-1);border-radius:20px;padding:6px 18px;box-shadow:var(--shadow)}
  .item{display:flex;align-items:baseline;gap:10px;padding:15px 0;border-bottom:1px solid ${T.bg2}99}
  .item:last-child{border-bottom:none}
  .item-name{font-size:16px}
  .dots{flex:1;border-bottom:1px dotted var(--border-2);transform:translateY(-4px)}
  .price{color:var(--accent);font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums}

  .demo-note{margin-top:34px;background:var(--accent-soft);border:1px dashed ${a}88;border-radius:14px;
    padding:13px 16px;font-size:13.5px;color:var(--text-2);text-align:center}
  .footer{margin-top:34px;text-align:center;color:var(--text-3);font-size:13px}
  .footer a{color:var(--accent);text-decoration:none}
  ${wa ? `.wa{position:fixed;bottom:18px;inset-inline-start:18px;z-index:30;background:#1faa53;color:#fff;border-radius:999px;
    padding:12px 20px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 8px 22px #1faa5366}` : ''}

  .reveal{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease}
  .reveal.in{opacity:1;transform:none}
  @media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none}}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    <div class="orb2"></div>
    <div class="medal"><span>${esc(cafe.name.trim()[0].toUpperCase())}</span></div>
    <h1><span class="ar">${esc(cafe.nameAr)}</span><span class="en">${esc(cafe.name)}</span></h1>
    <div class="tagline"><span class="ar">${esc(cafe.taglineAr)}</span><span class="en">${esc(cafe.tagline)}</span></div>
    <div class="meta">
      <span class="badge"><span class="ar">${esc(cafe.areaAr === 'الرياض' ? 'الرياض' : cafe.areaAr + ' · الرياض')}</span><span class="en">${esc(cafe.area === 'Riyadh' ? 'Riyadh' : cafe.area + ' · Riyadh')}</span></span>
      <span class="badge"><span class="ar">متوافق مع اشتراطات هيئة الغذاء والدواء</span><span class="en">SFDA-ready</span></span>
    </div>
    <div class="hrule"><span>✦</span></div>
  </header>
  <nav class="chips">${navChips}</nav>
  ${sigHtml}
  ${catHtml}
  <div class="demo-note">
    <span class="ar">هذه نسخة تجريبية أعدّها فريق منيو سادة خصيصاً لكم — الأصناف والأسعار والصور قابلة للتعديل خلال دقائق.</span>
    <span class="en">A demo lovingly prepared by MENU SADAH for you — items, prices & photos update in minutes.</span>
  </div>
  <div class="footer">
    <span class="ar">تجربة من <a href="${CONTACT.site}">منيو سادة — MENU SADAH</a></span>
    <span class="en">Crafted by <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
${wa ? `<a class="wa" href="${wa}"><span class="ar">💬 اطلب منيو مثله</span><span class="en">💬 Get a menu like this</span></a>` : ''}
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>
</body>
</html>`;
}

/* ---------- type-flavored personal compliment lines ---------- */
const FLAVOR = {
  specialty_coffee: { ar: 'ذوقكم في القهوة المختصة واضح من أول نظرة', en: 'Your specialty-coffee taste shows from the first glance' },
  dessert_cafe: { ar: 'حلاكم صار حديث الناس — ويستاهل منيو بمستواه', en: 'Your desserts are the talk of the town — they deserve a menu at their level' },
  bakery_cafe: { ar: 'ريحة الفرن عندكم تحتاج منيو يليق فيها', en: 'Bakes like yours deserve a menu that does them justice' },
  matcha_bar: { ar: 'الماتشا عندكم فن — والمنيو لازم يكون بنفس الفن', en: 'Your matcha is an art — the menu should match it' },
  roastery: { ar: 'محاصيلكم تتغير كل أسبوع — منيو ورقي ما يلحق عليكم', en: 'Your origins rotate weekly — paper menus can never keep up' },
  family_cafe: { ar: 'مكانكم يجمع العائلة — والمنيو لازم يسهل عليهم الطلب', en: 'Your place brings families together — ordering should be effortless' },
  tea_house: { ar: 'شاهيكم له عشاق — وعشاقه يستاهلون منيو يليق', en: 'Your chai has devoted fans — they deserve a proper menu' },
  gaming_cafe: { ar: 'القيمرز عندكم ما يحبون يرفعون عيونهم عن الشاشة — منيو QR يحل المشكلة', en: 'Your gamers never look up from the screen — a QR menu fixes that' },
};

/* ---------- the LUXE gift page (the deal-or-no-deal link) ---------- */
export function luxeWelcomePage(cafe, extras = {}) {
  const T = themeFor(cafe);
  const a = T.accent, a2 = T.accent2;
  const flavor = FLAVOR[extras.type] || FLAVOR.specialty_coffee;
  const sig = (extras.signature && extras.signature.length ? extras.signature[0] : null) || extras.sigMention || null;
  const social = extras.social && /^@/.test(String(extras.social).trim()) ? String(extras.social).trim() : null;
  const waMsg = encodeURIComponent('مرحباً، معكم ' + cafe.name + ' — شفنا المنيو التجريبي وحابين نكمل');
  const wa = CONTACT.whatsapp && CONTACT.whatsapp !== '966500000000' ? `https://wa.me/${CONTACT.whatsapp}?text=${waMsg}` : null;

  return `<!doctype html>
<html lang="ar" dir="rtl" data-lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="${T.bg0}">
<title>🎁 ${esc(cafe.name)} × MENU SADAH</title>
<style>
  :root{--bg-0:${T.bg0};--bg-1:${T.bg1};--border-1:${T.border1};--border-2:${T.border2};
    --text-1:${T.text1};--text-2:${T.text2};--text-3:${T.text3};--accent:${a};--accent-soft:${a}22}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Tahoma,Roboto,Arial,sans-serif;
    background:var(--bg-0) ${patternFor(T)};color:var(--text-1);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;
    min-height:100svh;overflow-x:hidden}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(620px 460px at 50% -120px,${a}1c,transparent 70%)}
  .wrap{max-width:560px;margin:0 auto;padding:0 20px 90px;position:relative}
  [data-lang="ar"] .en,[data-lang="en"] .ar{display:none}
  .lang-toggle{position:fixed;top:14px;inset-inline-end:14px;z-index:40;background:${T.bg1}d9;backdrop-filter:blur(10px);
    border:1px solid var(--border-2);color:var(--text-1);border-radius:999px;padding:8px 16px;font-size:13.5px;cursor:pointer}

  .stars{position:fixed;inset:0;pointer-events:none;z-index:1}
  .stars span{position:absolute;color:${a};opacity:0;animation:tw 3.2s infinite}
  @keyframes tw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:.85;transform:scale(1.15)}}

  .hero{position:relative;text-align:center;padding:84px 0 20px;z-index:2}
  .orb{position:absolute;top:-70px;left:50%;transform:translateX(-50%);width:380px;height:380px;border-radius:50%;
    background:radial-gradient(circle,${a}38,transparent 64%);pointer-events:none;animation:breathe 5s ease-in-out infinite}
  .orb2{position:absolute;top:40px;left:8%;width:200px;height:200px;border-radius:50%;
    background:radial-gradient(circle,${a2}24,transparent 65%);pointer-events:none;animation:breathe2 6.5s 1s ease-in-out infinite}
  @keyframes breathe{50%{transform:translateX(-50%) scale(1.08)}}
  @keyframes breathe2{50%{transform:scale(1.1)}}
  .gift-tag{display:inline-block;background:var(--accent-soft);border:1px solid ${a}88;color:var(--accent);
    border-radius:999px;padding:6px 20px;font-size:13px;letter-spacing:.14em;
    opacity:0;animation:up .8s .15s forwards}
  .medal{position:relative;width:118px;height:118px;margin:22px auto 6px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 32% 24%,#ffffff30,transparent 42%),radial-gradient(circle at 32% 28%,${a}48,${a}16 62%,transparent);
    border:2px solid var(--accent);box-shadow:0 0 0 8px ${a}14,0 0 46px ${a}55,inset 0 1px 0 #ffffff33;
    opacity:0;animation:pop .9s .5s cubic-bezier(.2,1.4,.4,1) forwards}
  .medal::after{content:"";position:absolute;inset:7px;border-radius:50%;border:1px solid ${a}55}
  .medal span{font-family:Georgia,'Times New Roman',serif;font-size:52px;font-weight:700;color:var(--accent);
    text-shadow:0 2px 14px ${a}73}
  @keyframes pop{0%{opacity:0;transform:scale(.4)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
  @keyframes up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
  h1{font-size:32px;line-height:1.25;margin-top:12px;opacity:0;animation:up .8s .9s forwards}
  h1 b{color:var(--accent)}
  h1 .en{font-family:Georgia,'Times New Roman',serif}
  .shimmer{background:linear-gradient(90deg,var(--text-1) 40%,${a} 50%,var(--text-1) 60%);background-size:220% 100%;
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:sh 3.4s 1.8s infinite}
  @keyframes sh{0%{background-position:120% 0}100%{background-position:-120% 0}}

  .letter{position:relative;z-index:2;margin-top:26px;background:linear-gradient(180deg,${T.bg1}f0,${T.bg1}d0);
    border:1px solid ${a}44;border-radius:24px;padding:24px 22px;box-shadow:0 10px 34px #00000080;
    opacity:0;animation:up .9s 1.25s forwards}
  .letter .to{color:var(--accent);font-size:13px;letter-spacing:.12em;margin-bottom:10px}
  .letter p{color:var(--text-2);font-size:15.5px;margin-bottom:12px}
  .letter p b{color:var(--text-1)}
  .letter .sigline{color:var(--accent);font-weight:700}
  .benefits{list-style:none;margin-top:6px}
  .benefits li{display:flex;gap:11px;align-items:flex-start;padding:8px 0;color:var(--text-2);font-size:14.5px}
  .benefits .tick{color:var(--accent);font-weight:800;flex:0 0 auto}

  .cta-stack{position:relative;z-index:2;display:grid;gap:12px;margin-top:26px;opacity:0;animation:up .9s 1.6s forwards}
  .btn{display:block;text-align:center;text-decoration:none;background:linear-gradient(135deg,${a},${a2});
    color:${T.ink};font-weight:800;font-size:18px;border-radius:18px;padding:18px 20px;
    box-shadow:0 10px 30px ${a}55;transition:transform .15s}
  .btn:active{transform:scale(.98)}
  .btn.pulse{animation:pl 2.2s 2.4s infinite}
  @keyframes pl{0%,100%{box-shadow:0 10px 30px ${a}55}50%{box-shadow:0 10px 44px ${a}90}}
  .btn.ghost{background:transparent;color:var(--accent);border:1px solid ${a}88;box-shadow:none;font-weight:600;font-size:15px}
  .small{margin-top:14px;text-align:center;color:var(--text-3);font-size:12.5px;position:relative;z-index:2}
  .small a{color:var(--accent);text-decoration:none}
  .footer{margin-top:30px;text-align:center;color:var(--text-3);font-size:12.5px;position:relative;z-index:2}
  .footer a{color:var(--accent);text-decoration:none}
  @media (prefers-reduced-motion: reduce){*{animation:none!important;opacity:1!important}}
</style>
</head>
<body>
<button class="lang-toggle" id="langToggle">English</button>
<div class="stars" id="stars"></div>
<div class="wrap">
  <header class="hero">
    <div class="orb"></div>
    <div class="orb2"></div>
    <span class="gift-tag"><span class="ar">🎁 هدية خاصة · ليست إعلاناً</span><span class="en">🎁 A personal gift · not an ad</span></span>
    <div class="medal"><span>${esc(cafe.name.trim()[0].toUpperCase())}</span></div>
    <h1>
      <span class="ar">إلى بيت <b class="shimmer">${esc(cafe.nameAr)}</b></span>
      <span class="en">To the house of <b class="shimmer">${esc(cafe.name)}</b></span>
    </h1>
  </header>

  <div class="letter">
    <div class="to"><span class="ar">رسالة من فريق منيو سادة ✦</span><span class="en">A note from MENU SADAH ✦</span></div>
    <p>
      <span class="ar">${social ? 'تابعنا <b>' + esc(social) + '</b> وأعجبنا ذوقكم. ' : ''}${esc(flavor.ar)}${cafe.areaAr && cafe.areaAr !== 'الرياض' ? '، وأهل <b>' + esc(cafe.areaAr) + '</b> يستاهلون يشوفونه كامل' : ''}.</span>
      <span class="en">${social ? 'We follow <b>' + esc(social) + '</b> and love your taste. ' : ''}${esc(flavor.en)}.</span>
    </p>
    ${sig ? `<p class="sigline"><span class="ar">وسمعنا إن «${esc(sig[1])}» عندكم أسطورة — حطيناها أول صفحة في المنيو 😉</span><span class="en">And we hear your «${esc(sig[0])}» is legendary — it opens your menu 😉</span></p>` : ''}
    <p>
      <span class="ar">فبنينا لكم <b>منيو إلكتروني كامل بهويتكم وألوانكم</b> — جاهز الآن، قبل أي التزام وبدون أي مقابل للتجربة.</span>
      <span class="en">So we built you a <b>complete e-menu in your identity & colors</b> — ready now, before any commitment.</span>
    </p>
    <ul class="benefits">
      <li><span class="tick">✦</span><span><span class="ar">عربي / إنجليزي بضغطة — ورابط واحد + QR للطاولة</span><span class="en">Arabic/English toggle — one link + table QR</span></span></li>
      <li><span class="tick">✦</span><span><span class="ar">متوافق مع اشتراطات هيئة الغذاء والدواء (السعرات والكافيين)</span><span class="en">SFDA-compliant (calories & caffeine ready)</span></span></li>
      <li><span class="tick">✦</span><span><span class="ar">تعديل الأسعار خلال دقائق — وداعاً لإعادة الطباعة</span><span class="en">Prices update in minutes — never reprint again</span></span></li>
    </ul>
  </div>

  <div class="cta-stack">
    <a class="btn pulse" href="../${cafe.slug}/">
      <span class="ar">🎁 افتحوا هديتكم — منيو ${esc(cafe.nameAr)}</span>
      <span class="en">🎁 Open your gift — the ${esc(cafe.name)} menu</span>
    </a>
    ${wa ? `<a class="btn ghost" href="${wa}"><span class="ar">💬 عجبكم؟ نفعّله لكم بنفس اليوم</span><span class="en">💬 Love it? Live the same day</span></a>` : ''}
  </div>
  <p class="small">
    <span class="ar">شاهدوا عميلنا الحي: <a href="${CONTACT.site}/beyt-coffee">بيت كوفي ↗</a></span>
    <span class="en">See a live client: <a href="${CONTACT.site}/beyt-coffee">Beyt Coffee ↗</a></span>
  </p>
  <div class="footer">
    <span class="ar">صُنعت بحب في الرياض — <a href="${CONTACT.site}">منيو سادة MENU SADAH</a></span>
    <span class="en">Crafted with love in Riyadh — <a href="${CONTACT.site}">MENU SADAH</a></span>
  </div>
</div>
<script>
  const root=document.documentElement;
  const saved=localStorage.getItem('ms-lang')||'ar';
  setLang(saved);
  function setLang(l){root.setAttribute('data-lang',l);root.setAttribute('lang',l);root.setAttribute('dir',l==='ar'?'rtl':'ltr');
    const t=document.getElementById('langToggle');if(t)t.textContent=l==='ar'?'English':'العربية';localStorage.setItem('ms-lang',l);}
  document.getElementById('langToggle').addEventListener('click',()=>{setLang(root.getAttribute('data-lang')==='ar'?'en':'ar');});
  // brand star field
  const stars=document.getElementById('stars');
  for(let i=0;i<26;i++){const s=document.createElement('span');s.textContent='✦';
    s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
    s.style.fontSize=(6+Math.random()*10)+'px';s.style.animationDelay=(Math.random()*3.2)+'s';stars.appendChild(s);}
</script>
</body>
</html>`;
}

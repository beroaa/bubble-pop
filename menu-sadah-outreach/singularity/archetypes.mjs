// Menu archetypes — a standard, realistic demo menu per cafe TYPE.
// The engine merges: archetype menu + optional per-cafe "signature" items.
// Tier-1 personalization (name, colors, typed menu) costs zero AI tokens;
// researched signatures upgrade a prospect to Tier-2 when we have them.

export const ARCHETYPES = {
  specialty_coffee: {
    accent: '#e3b23c',
    tagline: 'Specialty coffee, brewed with care',
    taglineAr: 'قهوة مختصة تُحضّر بعناية',
    menu: [
      { cat: 'Espresso Bar', catAr: 'البار الحار', items: [
        ['Espresso', 'إسبريسو', 12], ['Cortado', 'كورتادو', 15],
        ['Flat White', 'فلات وايت', 17], ['Spanish Latte', 'سبانيش لاتيه', 20] ] },
      { cat: 'Filter', catAr: 'المقطّرة', items: [
        ['V60 — Single Origin', 'في60 — محصول فردي', 24], ['Iced Drip', 'مقطّرة باردة', 22] ] },
      { cat: 'Cold Bar', catAr: 'البار البارد', items: [
        ['Iced Latte', 'لاتيه بارد', 18], ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21], ['Cold Brew', 'كولد برو', 19] ] },
      { cat: 'Bites', catAr: 'اللقيمات', items: [
        ['Butter Croissant', 'كرواسون زبدة', 12], ['Chocolate Cookie', 'كوكيز شوكولاتة', 10] ] },
    ],
  },
  dessert_cafe: {
    accent: '#d98cb3',
    tagline: 'Where dessert is the main character',
    taglineAr: 'حيث الحلا هو بطل القصة',
    menu: [
      { cat: 'Desserts', catAr: 'الحلويات', items: [
        ['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26], ['Tiramisu', 'تيراميسو', 26],
        ['Chocolate Layer Cake', 'كيكة الشوكولاتة الطبقية', 25], ['Seasonal Dessert', 'حلا الموسم', 24] ] },
      { cat: 'Coffee', catAr: 'القهوة', items: [
        ['Cappuccino', 'كابتشينو', 17], ['Spanish Latte', 'سبانيش لاتيه', 20], ['Drip Coffee', 'قهوة مقطّرة', 20] ] },
      { cat: 'Cold', catAr: 'البارد', items: [
        ['Iced Latte', 'لاتيه بارد', 18], ['Iced Chocolate', 'شوكولاتة باردة', 20] ] },
    ],
  },
  bakery_cafe: {
    accent: '#c98a4b',
    tagline: 'Fresh bakes & good coffee, all day',
    taglineAr: 'مخبوزات طازجة وقهوة تجمعنا طوال اليوم',
    menu: [
      { cat: 'Bakery', catAr: 'المخبوزات', items: [
        ['Cinnamon Bun', 'سينابون', 16], ['Almond Croissant', 'كرواسون لوز', 15],
        ['Zaatar Croissant', 'كرواسون زعتر', 13], ['Sourdough Toast', 'توست ساوردو', 22] ] },
      { cat: 'Coffee', catAr: 'القهوة', items: [
        ['Flat White', 'فلات وايت', 17], ['Latte', 'لاتيه', 18], ['Iced Latte', 'لاتيه بارد', 18] ] },
      { cat: 'Fresh', catAr: 'المشروبات الطازجة', items: [
        ['Orange Juice', 'عصير برتقال', 15], ['Lemon Mint', 'ليمون بالنعناع', 15] ] },
    ],
  },
  matcha_bar: {
    accent: '#7a9e5f',
    tagline: 'Matcha-first, whisked to order',
    taglineAr: 'الماتشا أولاً — تُخفق عند الطلب',
    menu: [
      { cat: 'Matcha', catAr: 'الماتشا', items: [
        ['Hot Matcha', 'ماتشا حارة', 20], ['Iced Matcha', 'ماتشا باردة', 22],
        ['Strawberry Matcha', 'ماتشا فراولة', 25], ['Matcha Affogato', 'ماتشا أفوغاتو', 26] ] },
      { cat: 'Coffee Too', catAr: 'وللقهوة عشّاقها', items: [
        ['Espresso', 'إسبريسو', 12], ['Iced Latte', 'لاتيه بارد', 18] ] },
      { cat: 'Sweets', catAr: 'الحلويات', items: [
        ['Matcha Cookie', 'كوكيز ماتشا', 12], ['Mochi (2 pcs)', 'موتشي (حبتين)', 14] ] },
    ],
  },
  roastery: {
    accent: '#b98ae0',
    tagline: 'Roasted in-house, rotating origins',
    taglineAr: 'محمصة داخلية ومحاصيل متغيّرة',
    menu: [
      { cat: "Today's Origins", catAr: 'محاصيل اليوم', items: [
        ['V60 — Ethiopia', 'في60 — إثيوبيا', 24], ['V60 — Colombia', 'في60 — كولومبيا', 24], ['Chemex', 'كيمكس', 24] ] },
      { cat: 'Espresso', catAr: 'الإسبريسو', items: [
        ['Single-Origin Espresso', 'إسبريسو محصول فردي', 14], ['Spanish Latte', 'سبانيش لاتيه', 20] ] },
      { cat: 'Beans To Go', catAr: 'بن للبيت', items: [
        ['250g Bag — Rotating Origin', 'كيس ٢٥٠ جم — محصول متغيّر', 55], ['1kg — House Blend', 'كيلو — خلطة المحمصة', 160] ] },
    ],
  },
  family_cafe: {
    accent: '#57b380',
    tagline: 'A place for the whole family',
    taglineAr: 'مكان يجمع كل العائلة',
    menu: [
      { cat: 'Coffee', catAr: 'القهوة', items: [
        ['Cappuccino', 'كابتشينو', 17], ['Latte', 'لاتيه', 18], ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25] ] },
      { cat: 'Little Ones', catAr: 'لصغار البيت', items: [
        ['Babyccino', 'بيبيتشينو', 8], ['Kids Hot Chocolate', 'هوت شوكلت أطفال', 12], ['Fresh Juice Box', 'عصير طازج', 10] ] },
      { cat: 'Bites', catAr: 'اللقيمات', items: [
        ['House Savoury Pastries', 'فطائر البيت المالحة', 14], ['Mini Pancakes', 'ميني بان كيك', 16], ['Date Cake', 'كيكة التمر', 15] ] },
    ],
  },
  gaming_cafe: {
    accent: '#5ca8e8',
    tagline: 'Coffee, snacks & good games',
    taglineAr: 'قهوة وسناكات وقيمنق يجمعنا',
    menu: [
      { cat: 'Drinks', catAr: 'المشروبات', items: [
        ['Espresso', 'إسبريسو', 12], ['Iced Latte', 'لاتيه بارد', 18],
        ['Spanish Latte', 'سبانيش لاتيه', 20], ['Iced Tea', 'شاي مثلج', 14] ] },
      { cat: 'Game Fuel', catAr: 'وقود القيمرز', items: [
        ['Smash Burger', 'سماش برجر', 28], ['Loaded Fries', 'بطاطس محمّلة', 19],
        ['Nachos', 'ناتشوز', 22], ['Hot Dog', 'هوت دوق', 16] ] },
      { cat: 'Sweets', catAr: 'الحلويات', items: [
        ['Chocolate Cookie', 'كوكيز شوكولاتة', 10], ['Brownie', 'براوني', 16] ] },
    ],
  },
  tea_house: {
    accent: '#5ca8e8',
    tagline: 'Teas from everywhere, steeped right',
    taglineAr: 'شاي من كل مكان — يُنقع كما يجب',
    menu: [
      { cat: 'Tea Bar', catAr: 'بار الشاي', items: [
        ['Karak', 'كرك', 8], ['Moroccan Mint', 'أتاي مغربي', 14],
        ['Earl Grey Pot', 'إبريق إيرل جراي', 18], ['Hibiscus Iced Tea', 'كركديه بارد', 15] ] },
      { cat: 'Coffee', catAr: 'القهوة', items: [
        ['Espresso', 'إسبريسو', 12], ['Latte', 'لاتيه', 18] ] },
      { cat: 'Sweets', catAr: 'الحلويات', items: [
        ['Date Maamoul', 'معمول تمر', 9], ['Honey Cake', 'كيكة العسل', 18] ] },
    ],
  },
};

export const DEFAULT_TYPE = 'specialty_coffee';

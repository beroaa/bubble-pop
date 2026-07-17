// MENU SADAH — Riyadh outreach batch #1 (July 2026)
// 10 real, small, social-first Riyadh cafes. Menus are DEMO content inferred
// from public reviews/press — replace with the cafe's real menu after they sign.
// Prices are realistic Riyadh specialty-coffee ranges (SAR), marked as demo.

export const CONTACT = {
  brand: 'MENU SADAH',
  brandAr: 'منيو سادة',
  site: 'https://menu-sadah.com',
  // TODO: put your real WhatsApp number here (digits only, e.g. 9665XXXXXXXX)
  whatsapp: '966500000000',
  referenceMenu: 'https://menu-sadah.com/beyt-coffee',
};

export const CAFES = [
  {
    slug: 'good-mate',
    name: 'Good Mate',
    nameAr: 'قود ميت',
    area: 'Riyadh',
    areaAr: 'الرياض',
    social: '@goodmatecafe (TikTok)',
    accent: '#e3b23c',
    tagline: 'Cosy specialty coffee & fresh cinnamon buns',
    taglineAr: 'قهوة مختصة بأجواء دافئة وسينابون طازج',
    pitchNote:
      'New opening, strong TikTok presence, no website found — menu lives in photos. Perfect first target.',
    menu: [
      {
        cat: 'Espresso Bar', catAr: 'البار الحار',
        items: [
          ['Espresso', 'إسبريسو', 12],
          ['Cortado', 'كورتادو', 15],
          ['Flat White', 'فلات وايت', 17],
          ['Spanish Latte', 'سبانيش لاتيه', 20],
          ['Pistachio Latte', 'لاتيه فستق', 23],
        ],
      },
      {
        cat: 'Cold Bar', catAr: 'البار البارد',
        items: [
          ['Iced Latte', 'لاتيه بارد', 18],
          ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21],
          ['Cold Brew', 'كولد برو', 19],
          ['Iced Matcha', 'ماتشا باردة', 22],
        ],
      },
      {
        cat: 'Bakery', catAr: 'المخبوزات',
        items: [
          ['Cinnamon Bun (signature)', 'سينابون (التوقيع)', 16],
          ['Butter Croissant', 'كرواسون زبدة', 12],
          ['Chocolate Cookie', 'كوكيز شوكولاتة', 10],
        ],
      },
    ],
  },
  {
    slug: '78-specialty',
    name: '78 Specialty Coffee',
    nameAr: '٧٨ للقهوة المختصة',
    area: 'Ar Rayyan',
    areaAr: 'حي الريان',
    social: '@78.riyadh (Instagram)',
    accent: '#c98a4b',
    tagline: 'Espresso paired with aged cheese — a Riyadh original',
    taglineAr: 'إسبريسو مع أجبان معتّقة — تجربة لا تتكرر',
    pitchNote:
      'Unique cheese-pairing concept that badly needs explaining — an e-menu with pairing notes sells itself. IG-only presence.',
    menu: [
      {
        cat: 'Espresso & Pairings', catAr: 'الإسبريسو والتوليفات',
        items: [
          ['Espresso + Aged Cheese Pairing', 'إسبريسو مع جبنة معتّقة', 28],
          ['Iced Orange Espresso', 'إسبريسو بالبرتقال بارد', 22],
          ['Cortado', 'كورتادو', 15],
          ['Cappuccino', 'كابتشينو', 17],
        ],
      },
      {
        cat: 'Filter', catAr: 'القهوة المقطّرة',
        items: [
          ['V60 — Single Origin', 'في60 — محصول فردي', 24],
          ['Iced Drip', 'مقطّرة باردة', 22],
        ],
      },
      {
        cat: 'Kitchen', catAr: 'المطبخ',
        items: [
          ['Gruyère & Pickles Sourdough', 'ساوردو جرويير ومخلل', 32],
          ['Cinnamon Bun', 'سينابون', 16],
        ],
      },
    ],
  },
  {
    slug: 'bearu',
    name: 'Béaru Cafés',
    nameAr: 'بيرو كافيه',
    area: 'Al Malqa',
    areaAr: 'حي الملقا',
    social: '@bearu.cafe (Instagram)',
    accent: '#57b380',
    tagline: 'Family café with play areas & kid-friendly cappuccinos',
    taglineAr: 'كافيه عائلي بمساحات لعب ومشروبات تناسب الأطفال',
    pitchNote:
      'Family concept = parents ordering one-handed. QR menu at the table is a killer pitch. Active IG, no site.',
    menu: [
      {
        cat: 'Coffee', catAr: 'القهوة',
        items: [
          ['Cappuccino', 'كابتشينو', 17],
          ['Latte', 'لاتيه', 18],
          ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21],
          ['Saudi Coffee (dallah)', 'قهوة سعودية (دلة)', 25],
        ],
      },
      {
        cat: 'Little Ones', catAr: 'لصغار البيت',
        items: [
          ['Babyccino', 'بيبيتشينو', 8],
          ['Hot Chocolate (kids)', 'هوت شوكلت أطفال', 12],
          ['Fresh Juice Box', 'عصير طازج', 10],
        ],
      },
      {
        cat: 'Bites', catAr: 'اللقيمات',
        items: [
          ['House Savoury Pastries', 'فطائر البيت المالحة', 14],
          ['Mini Pancakes', 'ميني بان كيك', 16],
          ['Date Cake', 'كيكة التمر', 15],
        ],
      },
    ],
  },
  {
    slug: 'little-henri',
    name: 'Little Henri',
    nameAr: 'ليتل هنري',
    area: 'Al Muruj',
    areaAr: 'حي المروج',
    social: 'Instagram / TikTok',
    accent: '#5ca8e8',
    tagline: 'Olaya-corridor newcomer — coffee, iced matcha & banana pudding',
    taglineAr: 'الوافد الجديد — قهوة، ماتشا باردة، وبودينق الموز الشهير',
    pitchNote:
      '2026 opening riding a TikTok wave. Viral banana pudding deserves a menu link people can share.',
    menu: [
      {
        cat: 'Hot', catAr: 'المشروبات الحارة',
        items: [
          ['Flat White', 'فلات وايت', 17],
          ['V60', 'في60', 22],
          ['Hot Matcha', 'ماتشا حارة', 20],
        ],
      },
      {
        cat: 'Iced', catAr: 'المشروبات الباردة',
        items: [
          ['Iced Latte', 'لاتيه بارد', 18],
          ['Iced Matcha', 'ماتشا باردة', 22],
          ['Iced Strawberry Matcha', 'ماتشا فراولة باردة', 25],
        ],
      },
      {
        cat: 'Sweets', catAr: 'الحلويات',
        items: [
          ['Banana Pudding (viral)', 'بودينق الموز (الأشهر)', 24],
          ['San Sebastián Cheesecake', 'تشيز كيك سان سباستيان', 26],
        ],
      },
    ],
  },
  {
    slug: 'hlo',
    name: 'HLO',
    nameAr: 'إتش إل أو',
    area: 'Olaya',
    areaAr: 'حي العليا',
    social: 'Instagram',
    accent: '#d98cb3',
    tagline: 'Where dessert is the main character',
    taglineAr: 'حيث الحلا هو بطل القصة',
    pitchNote:
      'Dessert-first spot — cinnamon lasagna, mango trifle, tiramisu. Menus with photos convert; they have none online.',
    menu: [
      {
        cat: 'Desserts', catAr: 'الحلويات',
        items: [
          ['Cinnamon Lasagna', 'لازانيا القرفة', 27],
          ['Chocolate Layer Cake', 'كيكة الشوكولاتة الطبقية', 25],
          ['Mango Trifle', 'ترايفل المانجو', 24],
          ['Tiramisu', 'تيراميسو', 26],
        ],
      },
      {
        cat: 'Coffee', catAr: 'القهوة',
        items: [
          ['Cappuccino', 'كابتشينو', 17],
          ['Drip Coffee', 'قهوة مقطّرة', 20],
          ['Spanish Latte', 'سبانيش لاتيه', 20],
        ],
      },
    ],
  },
  {
    slug: 'place-and-people',
    name: 'Place and People',
    nameAr: 'بليس آند بيبول',
    area: 'Riyadh',
    areaAr: 'الرياض',
    social: 'Instagram (soft opening)',
    accent: '#e8883c',
    tagline: 'A people-first corner for coffee & desserts',
    taglineAr: 'ركن يجمع الناس على قهوة وحلا',
    pitchNote:
      'Still in soft opening — the perfect moment to launch with a proper e-menu instead of a printed one.',
    menu: [
      {
        cat: 'Coffee', catAr: 'القهوة',
        items: [
          ['Espresso', 'إسبريسو', 12],
          ['Latte', 'لاتيه', 18],
          ['Iced Latte', 'لاتيه بارد', 18],
          ['Cold Brew', 'كولد برو', 19],
        ],
      },
      {
        cat: 'Desserts', catAr: 'الحلويات',
        items: [
          ['Cheesecake of the Day', 'تشيز كيك اليوم', 24],
          ['Brownie', 'براوني', 16],
          ['Seasonal Dessert', 'حلا الموسم', 22],
        ],
      },
    ],
  },
  {
    slug: 'salam-cafe',
    name: 'Salam Café',
    nameAr: 'سلام كافيه',
    area: 'Al Malqa',
    areaAr: 'حي الملقا',
    social: 'Instagram',
    accent: '#8fbf9f',
    tagline: 'A calm, bright corner for focused specialty coffee',
    taglineAr: 'زاوية هادئة ومضيئة لقهوة مختصة بتركيز',
    pitchNote:
      'Neighborhood regulars spot in Al Malqa. Calm brand = clean minimal menu page fits perfectly.',
    menu: [
      {
        cat: 'Brew Bar', catAr: 'بار الترشيح',
        items: [
          ['V60', 'في60', 22],
          ['Chemex', 'كيمكس', 24],
          ['Iced Drip', 'مقطّرة باردة', 22],
        ],
      },
      {
        cat: 'Espresso', catAr: 'الإسبريسو',
        items: [
          ['Espresso', 'إسبريسو', 12],
          ['Piccolo', 'بيكولو', 14],
          ['Flat White', 'فلات وايت', 17],
        ],
      },
      {
        cat: 'Sweets', catAr: 'الحلويات',
        items: [
          ['Almond Croissant', 'كرواسون لوز', 15],
          ['Date Maamoul', 'معمول تمر', 9],
        ],
      },
    ],
  },
  {
    slug: 'aim-coffee-bar',
    name: 'Aim Coffee Bar',
    nameAr: 'أيم كوفي بار',
    area: 'Al Malqa',
    areaAr: 'حي الملقا',
    social: 'Instagram',
    accent: '#e25c5c',
    tagline: 'Precision coffee, bar-style',
    taglineAr: 'قهوة بدقة الباريستا، على طريقة البار',
    pitchNote:
      'Precision/craft positioning — a menu listing origins, notes and ratios matches their identity and they don\'t have one.',
    menu: [
      {
        cat: 'Signature Bar', catAr: 'بار التوقيع',
        items: [
          ['Single-Origin Espresso', 'إسبريسو محصول فردي', 14],
          ['Cortado', 'كورتادو', 15],
          ['Magic (double ristretto flat white)', 'ماجيك', 18],
        ],
      },
      {
        cat: 'Filter', catAr: 'المقطّرة',
        items: [
          ['V60 — Ethiopia', 'في60 — إثيوبيا', 24],
          ['V60 — Colombia', 'في60 — كولومبيا', 24],
          ['Iced Filter', 'مقطّرة باردة', 22],
        ],
      },
      {
        cat: 'Cold', catAr: 'البارد',
        items: [
          ['Cold Brew Tonic', 'كولد برو تونيك', 24],
          ['Iced Latte', 'لاتيه بارد', 18],
        ],
      },
    ],
  },
  {
    slug: 'woods',
    name: 'Woods',
    nameAr: 'وودز',
    area: 'Al Yasmin',
    areaAr: 'حي الياسمين',
    social: 'Instagram',
    accent: '#7a9e5f',
    tagline: 'Espresso-focused menu in a leafy, tranquil courtyard',
    taglineAr: 'قهوة إسبريسو في فناء أخضر هادئ',
    pitchNote:
      'Courtyard seating = customers scanning QR at the table. Green-forward brand, easy visual identity to mirror.',
    menu: [
      {
        cat: 'Espresso', catAr: 'الإسبريسو',
        items: [
          ['Espresso', 'إسبريسو', 12],
          ['Macchiato', 'ماكياتو', 13],
          ['Cappuccino', 'كابتشينو', 17],
          ['Flat White', 'فلات وايت', 17],
        ],
      },
      {
        cat: 'Garden Cold', catAr: 'مشروبات الحديقة',
        items: [
          ['Iced Latte', 'لاتيه بارد', 18],
          ['Iced Mocha', 'موكا باردة', 20],
          ['Lemon Mint', 'ليمون بالنعناع', 15],
        ],
      },
      {
        cat: 'Bites', catAr: 'اللقيمات',
        items: [
          ['Zaatar Croissant', 'كرواسون زعتر', 13],
          ['Chocolate Cookie', 'كوكيز شوكولاتة', 10],
        ],
      },
    ],
  },
  {
    slug: 'breehant',
    name: 'Breehant',
    nameAr: 'بريهانت',
    area: 'Al Yasmin',
    areaAr: 'حي الياسمين',
    social: 'Instagram',
    accent: '#b98ae0',
    tagline: '24-hour roastery — Ethiopian, Colombian & Brazilian single origins',
    taglineAr: 'محمصة على مدار الساعة — محاصيل إثيوبيا وكولومبيا والبرازيل',
    pitchNote:
      '24/7 roastery with rotating origins — printed menus can\'t keep up with rotation; an instantly-editable e-menu is the exact fix.',
    menu: [
      {
        cat: 'Today\'s Origins', catAr: 'محاصيل اليوم',
        items: [
          ['V60 — Ethiopia Sidamo', 'في60 — إثيوبيا سيدامو', 24],
          ['V60 — Colombia Huila', 'في60 — كولومبيا هويلا', 24],
          ['V60 — Brazil Cerrado', 'في60 — البرازيل سيرادو', 22],
        ],
      },
      {
        cat: 'Espresso', catAr: 'الإسبريسو',
        items: [
          ['Espresso', 'إسبريسو', 12],
          ['Spanish Latte', 'سبانيش لاتيه', 20],
          ['Iced Spanish Latte', 'سبانيش لاتيه بارد', 21],
        ],
      },
      {
        cat: 'Beans To Go', catAr: 'بن للبيت',
        items: [
          ['250g Bag — Rotating Origin', 'كيس ٢٥٠ جم — محصول متغيّر', 55],
          ['1kg Bag — House Blend', 'كيس كيلو — خلطة المحمصة', 160],
        ],
      },
    ],
  },
];

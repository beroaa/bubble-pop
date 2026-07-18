// MENU SADAH — the master outreach messages (Made-to-Stick build).
// SUCCESs: Simple core (your menu is already built) · Unexpected (built BEFORE
// asking) · Concrete (their dish, SFDA dates, same-day activation) · Credible
// (testable live link + real regulation) · Emotional (pride in their craft) ·
// Story (we noticed you -> we built for you -> open it).
// Voice: mature Saudi businessman, co-founder, team presence — no fake headcount.

const SITE = 'https://menu-sadah.com';

export function dmAr(c) {
  const nm = c.nameAr || c.name;
  const dish = (c.signature && c.signature.length) ? c.signature[0][1] : (c.sigMention ? c.sigMention[1] : null);
  const noticed = c.social
    ? `تابعنا حساب ${nm} منذ فترة، وشدّنا اهتمامكم بالتفاصيل.`
    : `لفت انتباهنا ${nm} واهتمامكم الواضح بالتفاصيل.`;
  return `السلام عليكم ورحمة الله،

معكم إبراهيم، شريك مؤسس في «منيو سادة» — استوديو سعودي متخصص في المنيوهات الرقمية للكافيهات.

${noticed} فعملنا شيئاً غير معتاد: جهّز فريقنا منيو إلكترونياً كاملاً بهوية ${nm} — قبل أي التزام منكم، وعلى حسابنا.

المنيو عربي/إنجليزي بضغطة، يعمل برمز QR للطاولة، ومتوافق مع اشتراطات هيئة الغذاء والدواء (السعرات إلزامية منذ ٢٠١٩، والكافيين منذ يوليو ٢٠٢٥ — وتشمل المنيو الرقمي).${dish ? `

وبلغنا أن «${dish}» من أطباقكم المميزة — جعلناه في صدارة المنيو.` : ''}

معاينتكم الخاصة (ليست إعلاناً):
${SITE}/${c.slug}-welcome

إن نال إعجابكم، نفعّله لكم في نفس اليوم — وتعديل أي سعر يأخذ دقائق بدل إعادة الطباعة. وإن لم يناسبكم، يكفينا شرف اطلاعكم عليه.

مع خالص التقدير،
فريق منيو سادة · menu-sadah.com`;
}

export function dmEn(c) {
  const nm = c.name;
  const dish = (c.signature && c.signature.length) ? c.signature[0][0] : (c.sigMention ? c.sigMention[0] : null);
  const noticed = c.social
    ? `We've followed ${nm} for a while, and your attention to detail stands out.`
    : `${nm} caught our team's attention — the care in what you do is visible.`;
  return `Peace be upon you,

This is Ibrahim, co-founder of MENU SADAH — a Saudi studio specialized in digital menus for cafes.

${noticed} So we did something unusual: our team built ${nm}'s complete e-menu — before any commitment from you, at our expense.

It switches Arabic/English in one tap, runs on a table QR code, and is compliant with SFDA requirements (calories mandatory since 2019, caffeine since July 2025 — digital menus included).${dish ? `

We also hear your "${dish}" is a house favorite — it opens the menu.` : ''}

Your private preview (not an ad):
${SITE}/${c.slug}-welcome

If you like it, we take it live the same day — and any price update takes minutes instead of a reprint. If not, we're honored you took a look.

Warm regards,
The MENU SADAH team · menu-sadah.com`;
}

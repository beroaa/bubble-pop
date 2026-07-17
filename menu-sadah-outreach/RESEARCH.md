# MENU SADAH — Research Report: From 10 Menus to 100, With a System That Gets Smarter Every Batch

*Prepared for the founder. Plain language throughout. Every claim carries its source link. Numbers marked "unverified" are estimates — do not build financial plans on them.*

---

## 1) What "self-learning" actually means for us (the honest recipe)

"Self-learning" does not mean the AI magically gets smarter. It means we build a loop where every mistake becomes a rule, and every rule prevents that mistake forever. Here is the honest recipe, each part backed by real research:

**a. The AI never writes the final page.** Each cafe gets a small data file (dish names in Arabic and English, prices as numbers, categories). A fixed, "dumb" template — like mail-merge in Word — turns that data into the menu page. The AI's only job is preparing the data. This means a price can never be invented by the AI: it flows from the data file to the page untouched. Constraining generation to pre-tested templates bounds the error space — the model cannot hallucinate what it never generates ([arxiv.org/html/2604.05150v1](https://arxiv.org/html/2604.05150v1)). Forcing the AI to fill a strict data schema is also far more reliable than free-form output — one practitioner source reports loose output failing ~5–10% of the time versus under 0.1% with enforced schemas (unverified blog figures, but consistent with vendor claims: [eastondev.com](https://eastondev.com/blog/en/posts/ai/20260506-llm-structured-output/); see also [marutitech.com/structured-outputs-llms](https://marutitech.com/structured-outputs-llms/)).

**b. Automatic checks gate every menu, for free.** Before any menu counts as done, code (not AI) checks it: every item has both Arabic and English names; prices are numbers in a sane range; the Arabic page has right-to-left direction set; and the killer check — every price shown on the rendered page is diffed against the data file, any mismatch is an automatic fail. These checks run on all 100 menus in seconds. Off-the-shelf tools exist for the HTML side ([HTMLProofer](https://github.com/gjtorikian/html-proofer), [proof-html](https://github.com/anishathalye/proof-html)).

**c. An AI "critic" reviews only what code cannot judge** — translation quality, tone, descriptions — scored against a written checklist, not its own taste. This generate-critique-fix loop is a proven, cheap quality lever: the Self-Refine paper shows roughly 20% average improvement across 7 tasks with no extra training ([arxiv.org/abs/2303.17651](https://arxiv.org/abs/2303.17651)), and Anthropic's own guide describes exactly this "evaluator-optimizer" pattern, noting it works best when there are clear evaluation criteria — which a menu checklist is ([anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents)). Caution: AI critics have documented biases — they favor their own outputs, longer outputs, and certain positions — so the critic should run as a fresh session or different model, with a rubric, and it must never be the only gate on anything money-related ([arxiv.org/pdf/2506.02592](https://arxiv.org/pdf/2506.02592), [arxiv.org/pdf/2412.05579](https://arxiv.org/pdf/2412.05579)). Cap the fix loop at 2–3 rounds; the gains come early.

**d. The self-improving core: one LESSONS file.** After each batch, every failure and every human correction becomes one short rule appended to a lessons file that is read at the start of every future batch. This is the load-bearing idea, and it is now **CONFIRMED by peer-reviewed research**: the ACE paper (accepted at ICLR 2026) shows agents that keep an "evolving playbook" updated by small additions improve about +10.6% on agent benchmarks — and, critically, that *rewriting or summarizing* the playbook destroys it. In their case study, one rewrite shrank the playbook from 18,282 tokens to 122 and made the agent *worse than having no playbook at all* ([arxiv.org/abs/2510.04618](https://arxiv.org/abs/2510.04618), full paper [openreview.net/pdf?id=eC4ygDs02R](https://openreview.net/pdf?id=eC4ygDs02R), code [github.com/ace-agent/ace](https://github.com/ace-agent/ace)). The older Reflexion paper established the same principle: agents that store notes on their failures do better next time ([arxiv.org/abs/2303.11366](https://arxiv.org/abs/2303.11366)).

**Practical rules for the lessons file** (practitioner guidance, unverified but consistent with ACE): add a rule only when the same mistake appears *twice* — once is noise, twice is a pattern — and keep the file under ~200 lines ([redreamality.com](https://redreamality.com/blog/claude-md-agents-md-deep-dive/), [code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)). Give every lesson a promotion path: prompt rule → automatic code check → permanent template/schema fix. A lesson that becomes code can never regress and can be deleted from the file, keeping it short.

**e. A "golden set" protects you from breaking things.** Keep 10–20 real cafes with founder-approved outputs. Before any template or prompt change, regenerate them and diff the results; any unexpected change blocks the update ([qaskills.sh golden dataset guide](https://qaskills.sh/blog/golden-dataset-llm-evaluation-guide), [galtea.ai CI quality gate](https://galtea.ai/blog/automated-llm-evaluation-building-a-ci-cd-quality-gate-that-actually-runs)). This is what lets a non-technical founder change things without silently breaking 100 live menus.

**How you know it's working:** track one number — the *first-pass rate* (menus passing all checks with zero retries) per batch. If it climbs batch over batch, the system is learning. If not, the lessons file isn't capturing the right rules. You personally review only the exception queue — typically a handful of menus — never all 100.

---

## 2) The real capacity math

### What is CONFIRMED (official sources)

- Claude Max has two tiers: $100/month (5x Pro usage) and $200/month (20x Pro usage). Claude Code is included at no extra cost, and chat + Claude Code share the **same** allowance ([support.claude.com Max plan](https://support.claude.com/en/articles/11049741-what-is-the-max-plan), [Claude Code on Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)).
- Limits use a rolling 5-hour window starting at your first prompt ([support.claude.com usage limits](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)). Anthropic officially publishes only the multipliers (5x/20x), never exact message or token quotas.
- Weekly caps exist on top of the 5-hour window, announced July 28, 2025, effective August 28, 2025. Anthropic's own launch estimate for Max 20x: roughly 240–480 hours/week of Sonnet 4 and 24–40 hours/week of Opus 4 in Claude Code; said to affect under 5% of subscribers ([TechCrunch](https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/)). Note: those were the figures *at rollout*; today's exact values may differ.
- The pay-as-you-go API has no consumer-style 5-hour or weekly caps — only per-minute rate limits that grow with usage. Scaling by paying per token is explicitly how Anthropic wants high-volume users to scale ([platform.claude.com rate limits](https://platform.claude.com/docs/en/api/rate-limits)).
- The **Batch API** is the sanctioned bulk path: asynchronous jobs at 50% off standard token prices, results within 24 hours, and the discount stacks with prompt caching ([batch processing docs](https://platform.claude.com/docs/en/build-with-claude/batch-processing), [announcement](https://www.anthropic.com/news/message-batches-api), [pricing](https://platform.claude.com/docs/en/about-claude/pricing)).

### Unverified — treat as rough

- The "~900 short messages per 5 hours on Max 20x" figure circulates from third parties, not current official pages ([intuitionlabs.ai](https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits)).
- Reported 2026 changes — a May 6, 2026 doubling of Claude Code's 5-hour limits, and a restructured pair of weekly caps — come from third-party trackers only ([morphllm.com](https://www.morphllm.com/claude-code-usage-limits), [truefoundry.com](https://www.truefoundry.com/blog/claude-code-limits-explained)).
- The cost math for our pipeline: our real menu pages measure ~9KB (not the ~15KB assumed earlier), so having the AI write full HTML would cost an estimated ~2,500–3,200 output tokens per page versus ~250–400 tokens for a data record — roughly a 7–10x gap. **This verdict is UNCLEAR**: the decisive token-count test could not be run (no API access in the research environment), so treat all per-menu token and dollar figures as rough. The direction is solid either way — and in our architecture the AI never writes HTML at all, so the comparison only matters if someone proposes changing that. ([token counting docs](https://platform.claude.com/docs/en/build-with-claude/token-counting), [pricing](https://platform.claude.com/docs/en/about-claude/pricing)).

### The multi-account question — kindly, but plainly

You may be tempted to buy several Max accounts and rotate between them to multiply usage. **Please don't build the business on that.** Here is the truth, verified as carefully as we could:

- Anthropic's Consumer Terms contain this real, current language: users *"must not abuse, harm, interfere with, or disrupt the Services... or bypassing any of our systems or protective measures"* (verbatim from [anthropic.com/legal/consumer-terms](https://www.anthropic.com/legal/consumer-terms), confirmed via search snippet). Rate limits are protective measures.
- Multiple independent 2026 reports say Anthropic's enforcement targets *limit evasion* (rotating accounts to dodge limits), account sharing, reselling access, and extracting login tokens into third-party tools ([metricnexus.ai](https://metricnexus.ai/blog/anthropic-banning-multiple-claude-accounts), [dev.to](https://dev.to/vainamoinen/two-multi-account-claude-code-architectures-one-anthropic-accepts-one-they-ban-2om7), [Hacker News](https://news.ycombinator.com/item?id=47635157), [grandlinux.com](https://www.grandlinux.com/en/blogs/claude-account-ban-risk.html)).
- Simply *owning* more than one account has been informally described as allowed by a Claude Code team member — but that reassurance is one employee's comment, not written policy.

The kind way to say it: one banned account mid-batch, with client menus half-delivered, is far worse than a slower batch. And you likely don't need more capacity anyway — the pipeline below uses very little AI. If limits ever bind, the correct escalation is the API + Batch API (officially blessed, likely single-digit dollars per 100-menu batch — rough estimate), not a second subscription. Before any decision, open [anthropic.com/legal/consumer-terms](https://www.anthropic.com/legal/consumer-terms) and [anthropic.com/legal/aup](https://www.anthropic.com/legal/aup) in your own browser — our automated checker was blocked (403) from reading them directly.

---

## 3) The architecture that ships 100 menus in one go

This is the proven pattern big companies use: Zapier ranks for ~40,000 keywords from one template fed by data; Tripadvisor builds location pages the same way ([digitalapplied.com](https://www.digitalapplied.com/blog/programmatic-seo-scale-content-templates-2026), [discoveredlabs.com](https://discoveredlabs.com/blog/programmatic-seo-examples-10-real-world-templates-that-drive-organic-growth)).

**Step 1 — AI writes 100 small data cards.** One Batch API job, one request per cafe (each tagged with its own ID), each producing a strict-schema JSON record: AR/EN names, items, numeric prices, categories, contact info, SFDA fields (see Section 4). Results arrive within 24 hours at half price — design it as *submit at night, publish in the morning* ([batch docs](https://platform.claude.com/docs/en/build-with-claude/batch-processing)). Results come back in any order, so always match by ID, never by position, and re-queue only failed IDs.

**Step 2 — A dumb script renders all pages.** A deterministic script (or an off-the-shelf tool like Hugo/Eleventy) turns each record into the Arabic menu, English menu, and pitch page. This is computationally trivial — Hugo builds ~1,000 pages in ~2 seconds ([markaicode.com](https://markaicode.com/vs/11ty-vs-hugo/), [css-tricks.com](https://css-tricks.com/comparing-static-site-generator-build-times/)) — so full regeneration after every template fix is free, and one template fix instantly fixes all 100 pages.

**Step 3 — Five QA gates, in order, failing individual cafes (never the whole batch):**
1. *Schema check* — required fields present, prices are numbers, both languages non-empty, no placeholder text.
2. *Dedup* — canonical ID per cafe (phone number works well); reject duplicates. Also run a cheap script check: Arabic characters in an English field fails the record, and vice versa.
3. *Slug registry* — web addresses generated from cafe names can collide (two "Cafe Noor"s silently overwriting each other is a known failure mode of data-driven page generation: [bugwp.com](https://bugwp.com/community/resolving-wordpress-slug-conflicts-and-duplicate-suffixes-2-3/), [yiminyang.dev](https://www.yiminyang.dev/blog/solving-duplicate-url-slugs-for-repeated-talks)); check every new address against a registry and disambiguate with district or a suffix.
4. *Rendered-page checks* — HTML validity, no broken links/images ([html-proofer](https://github.com/gjtorikian/html-proofer), [proof-html](https://github.com/anishathalye/proof-html)), plus a bilingual lint: `lang="ar" dir="rtl"` on Arabic, `lang="en" dir="ltr"` on English, reciprocal hreflang tags, every item shows a price ([voorhoede.nl RTL guide](https://www.voorhoede.nl/en/blog/how-to-multilingual-website-rtl-html-css/), [freezil.com RTL checklist](https://freezil.com/blog/rtl-website-checklist.html)). And the price-diff check from Section 1.
5. *Human spot-check* — 5–10 random pages per 100. This stays permanently; the AI critic is never the only gate.

**Two iron rules:** all fixes go into the data or the template — never hand-patch a generated page (it gets silently reverted on the next rebuild, the classic mail-merge failure). And a failed cafe gets its *data* auto-fixed and retried at most twice; still failing means the human review queue.

**Google worry, answered:** Google penalizes templated pages with no unique value (sites hit in the March 2026 crackdown lost 50–80% of traffic), but pages carrying real, page-specific data — a cafe's actual menu and prices — are explicitly fine ([bulkbase.ai](https://bulkbase.ai/seo/understanding-googles-scaled-content-abuse-policy), [digitalapplied.com](https://www.digitalapplied.com/blog/scaled-content-abuse-google-march-update-ai-pages-decimated)). Our pipeline is safe by construction.

**Headroom:** this same design comfortably scales past 1,000 cafes (the Batch API accepts up to 100,000 requests per batch) with no re-architecting.

---

## 4) The market and how we win

### The legal tailwind (CONFIRMED, including SFDA's own announcement)

- Calorie display on menus of **all** food establishments — including cafes and coffee shops — has been mandatory in Saudi Arabia since January 1, 2019 ([foodlabelmaker.com](https://foodlabelmaker.com/blog/labeling-regulations/menu-calorie-labeling-saudi-arabia/), [Saudi Gazette](https://saudigazette.com.sa/article/551475)).
- From **July 1, 2025**, SFDA additionally requires — on physical AND digital menus, including online ordering platforms: caffeine content for beverages, a saltshaker icon on high-sodium items (over 5g salt / 2,000mg sodium), and estimated exercise time to burn each item's calories ([SFDA official announcement](https://www.sfda.gov.sa/en/news/3745904), [Saudi Press Agency](https://www.spa.gov.sa/en/N2342277), [Gulf News](https://gulfnews.com/world/gulf/saudi/saudi-arabia-enforces-new-menu-rules-to-flag-salt-caffeine-and-calorie-burn-1.500183654)). Allergen disclosure is also genuinely required, though it predates the July 2025 package ([nutrical.co](https://www.nutrical.co/blog/saudi-arabia-nutrition-labeling-requirements/)). Rollout was phased from November 2024 ([foodics.com](https://www.foodics.com/calorie-counts-on-menus-new-sfda-regulations-for-restaurants/), [thesaudifoodshow.com](https://www.thesaudifoodshow.com/articles/saudi-arabia-rolls-out-mandatory-nutritional-labelling-restaurants-boost-public-health)).

Every cafe with an old menu is now technically out of date. **Action: add SFDA fields to the data schema now** — calories, caffeine mg, high-sodium flag, allergens, burn-time. The template renders them automatically, making every MENU SADAH menu "SFDA-ready" — only TableQR visibly markets this today.

### The competition

- **High end:** Foodics sells QR menus only inside a full POS system, roughly 500–1,500 SAR/month mid-tier, up to ~3,399 SAR/month (third-party review figures — rough: [lkwjd.com](https://lkwjd.com/foodics-review), [foodics.com/pricing](https://www.foodics.com/pricing/)). FineDine runs ~$24–75/month in KSA ([finedinemenu.com](https://www.finedinemenu.com/en/pricing/), [trustangle.com](https://www.trustangle.com/blogs/solutions/finedine-menu-payment-solutions-for-restaurants-and-cafes)); iMenu360 ~$19.99/month but US-focused, not Arabic-first ([softwareadvice.com](https://www.softwareadvice.com/retail/imenu360-profile/)).
- **Budget local:** MenuSahl at 8 SAR/month, HalaOrder from 85 SAR/month (850+ restaurants, orders to branch WhatsApp), MenuBarcode from 100 SAR/year, plus qrmenu.sa, TableQR, WowMenu, Meniura, ViuMenu ([menusahl.com](https://menusahl.com/), [halaorder.com](https://halaorder.com/), [menubarcode.com](https://menubarcode.com/), [qrmenu.sa](https://qrmenu.sa/), [tableqr.co](https://tableqr.co/digital-menu/saudi-arabia/)).

**Position:** you cannot beat 8 SAR/month on price, so don't try. Win on **done-for-you**: the owner sends a WhatsApp photo of their paper menu; you send back a finished bilingual, SFDA-ready menu in 24–48 hours. Flat setup fee + modest yearly renewal, always 0% commission. What Saudi owners actually buy: WhatsApp order delivery (described as the number-one requirement in the region), genuine Arabic-first design, instant price edits with no reprinting, and now compliance ([dgmenus.com](https://dgmenus.com/en/blog/fastest-digital-menu-arab-world-2026), [weevi.com](https://www.weevi.com/sa-en/blog/47/5-reasons-to-switch-to-a-digital-menu-in-2025), [logix360.studio](https://logix360.studio/blog/digital-menu-saudi-arabia/)).

### Three first-DM lines

1. **Compliance hook:** «من ١ يوليو ٢٠٢٥ تلزم هيئة الغذاء والدواء كل المقاهي بعرض السعرات والكافيين وتنبيه الملح في المنيو — حتى الرقمي. أجهز لك منيو QR عربي/إنجليزي متوافق خلال ٤٨ ساعة، فقط أرسل صورة منيوك واتساب.» *(SFDA now requires calories, caffeine and salt warnings on every menu — I'll build your compliant AR/EN QR menu in 48h, just WhatsApp me a photo of your menu.)*
2. **WhatsApp + zero commission:** «منيو QR لمقهاك: العميل يمسح، يطلب، والطلب يوصل واتساب فرعك مباشرة. سعر ثابت، صفر عمولة، وتعديل الأسعار بثانية بدون إعادة طباعة.» *(Customer scans, orders, and it lands in your branch WhatsApp. Flat price, zero commission, edit prices in a second with no reprints.)*
3. **Demo-first (pairs perfectly with the 100-menu batch):** «سويت لكم نسخة تجريبية من منيو [اسم المقهى] بالعربي والإنجليزي مع السعرات — جربها من هذا الرابط. إذا عجبتك نفعّلها بنفس اليوم.» *(I already built a demo of YOUR cafe's bilingual menu with calories — try it here; like it and we go live same day.)* Generate the demo *before* the DM — that is exactly what the batch pipeline is for. Track which line converts, per batch.

---

## 5) Verified facts table

| Claim | Verdict | Source |
|---|---|---|
| ACE: an append-and-curate "lessons playbook" improves agents ~+10.6% (agents) / +8.6% (finance); rewriting/summarizing it collapses performance (18,282 → 122 tokens, accuracy 66.7 → 57.1, below the 63.7 no-playbook baseline). Peer-reviewed, ICLR 2026. | **CONFIRMED** | [arxiv.org/abs/2510.04618](https://arxiv.org/abs/2510.04618), [openreview.net/pdf?id=eC4ygDs02R](https://openreview.net/pdf?id=eC4ygDs02R) |
| Anthropic's Consumer Terms ban "bypassing any of our systems or protective measures" (verbatim, current); enforcement reportedly targets limit evasion, account sharing, reselling — while merely owning multiple accounts is tolerated only per an informal staff comment, not written policy. | **CONFIRMED** (with that caveat) | [anthropic.com/legal/consumer-terms](https://www.anthropic.com/legal/consumer-terms), [metricnexus.ai](https://metricnexus.ai/blog/anthropic-banning-multiple-claude-accounts), [dev.to](https://dev.to/vainamoinen/two-multi-account-claude-code-architectures-one-anthropic-accepts-one-they-ban-2om7), [news.ycombinator.com](https://news.ycombinator.com/item?id=47635157) |
| SFDA: calories mandatory on all cafe/restaurant menus since Jan 1, 2019; from Jul 1, 2025 menus (physical AND digital) must also show caffeine, salt icon, and calorie-burn time; allergens required but predate the 2025 package. | **CONFIRMED** | [sfda.gov.sa/en/news/3745904](https://www.sfda.gov.sa/en/news/3745904), [spa.gov.sa](https://www.spa.gov.sa/en/N2342277), [saudigazette.com.sa](https://saudigazette.com.sa/article/652801) |
| Full-HTML generation costs ~10x more output tokens than data records (~4,000–5,000 vs ~400 per menu). | **UNCLEAR** — real pages measure ~9KB, so likely ~2,500–3,200 tokens vs ~250–400 (a ~7–10x gap); the decisive count_tokens test could not be run. Direction holds; exact numbers are rough. | [platform.claude.com token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting), [pricing](https://platform.claude.com/docs/en/about-claude/pricing) |

*(Other facts cited throughout are sourced but were not put through the adversarial verification pass; treat their specific numbers as rough.)*

---

## 6) What we still don't know

1. **Exact current usage limits.** Anthropic deliberately publishes only multipliers. The ~900-messages figure and the reported 2026 changes (May 6 doubling, restructured weekly caps) are third-party. **Do this instead of guessing:** run the current 10-menu batch and check actual usage via Claude Code's `/status` before assuming you need more capacity.
2. **Official multi-account policy in your own eyes.** Our checker was blocked from anthropic.com (403). Open [consumer-terms](https://www.anthropic.com/legal/consumer-terms) and the [Usage Policy](https://www.anthropic.com/legal/aup) in a normal browser before any decision that assumes multi-account use is either safe or banned.
3. **Real per-menu token counts and batch cost.** Requires one API call (count_tokens) on a real rendered page and a real data record — five minutes with an API key. Until then, "single-digit dollars per 100-menu batch" is a rough estimate.
4. **SFDA enforcement on the ground.** The rules are confirmed, but how hard do municipal (baladiya) inspectors actually enforce them on small Riyadh cafes? Ask 2–3 cafe owners directly — actual enforcement pressure determines how hard the compliance DM lands.
5. **Which DM line converts.** Only real batches answer this. Log conversions per line, per batch — the same "learn every batch" loop that improves the menus should improve the sales pitch.
6. **Whether the lessons file actually works for us.** The research says it should; the proof is our own first-pass rate climbing batch over batch. If it doesn't climb within 3–4 batches, the reflection step is capturing the wrong lessons.

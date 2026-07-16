# Menu Sadah — Locked Build Standard

This repo hosts Menu Sadah client menus under `menus/<slug>/`. Every menu build MUST follow this standard and ship the full "all included" pack. Slug = kebab-case brand name; live URL = `menu-sadah.com/<slug>`.

## All-included delivery pack (every build, no exceptions)

Each `menus/<slug>/` folder ships:

1. `index.html` — the menu page, fully self-contained (inline CSS/JS; Google Fonts links allowed).
2. `gift.html` — **MANDATORY, every menu, no exceptions** — the brand-coloured animated gift doc (anchor price struck through → "SR 0 · on the house · هدية"). This is the deal-breaker outreach bridge. Every client ALWAYS gets **two links together: the menu link (`/​<slug>`) + the gift link (`/​<slug>/gift.html`)** — outreach leads with the gift link. Generate via `node menus/_kit/gen-gifts.mjs` (palettes in `menus/_kit/tokens.json`).
3. `qr-<slug>.png` — 1200 px QR → `https://menu-sadah.com/<slug>`, ECC level H.
4. `qr-<slug>.svg` — same QR as vector for print shops.
5. `table-card.html` — print-ready A6 (105×148 mm, `@page` CSS, 100% scale) table card: brand mark + wordmark, framed QR on white, "Scan to view the menu" EN over AR, plain-text URL fallback, location + IG footer.
6. `handover.md` — live link, file inventory, bilingual how-to-use for the owner (print specs: A6, 250–300 gsm matte; link-in-bio; "changes take one message, same-day update, QR never changes"), plus an **Internal — Menu Sadah** section: offer, outreach draft, brand tokens, price-anchor sources.

Batch generator for items 3–6: `node menus/_kit/pack.mjs [slug ...]` (defaults to every menu missing a full pack). A menu is NOT deliverable until all 6 files exist — the catalog tracks this as `pack_complete`.

## The 6-point locked standard

1. **Spy the brand first** — Instagram, signage, cups. Pull exact fonts (EN + AR), colours, own artwork if published. If sources are unreachable, build a premium plausible identity and note the assumption in handover.md.
2. **Signature hero animation** under the logo — elegant + abstract, tailored to the brand mark, never childish. Respect `prefers-reduced-motion`.
3. **Big bold typography** — English slightly bigger than its Arabic (e.g. EN 1.06rem / AR 0.9rem for items). Tabular numerals for prices.
4. **Outreach** — gift-first, never lead with price, never say "QR menu", voice-matched to the owner.
5. **Offer** — SR 499 build + SR 199/mo; founding option SR 999 with SR 500 deposit.
6. **Bulletproof** — 5x design pass; OCD on numbers + alignment; verify in a real browser at 375 px (Playwright: `createRequire('/opt/node22/lib/node_modules/playwright/')`, launch with `proxy: {server: process.env.HTTPS_PROXY}` + `ignoreHTTPSErrors: true` so Google Fonts load; assert `document.body.scrollWidth === 375`, verify fonts render via metric comparison, screenshot top/middle/footer + one desktop pass).

## House design language (default when brand assets unreachable)

- Dark premium: bg `#171009`, ink `#F3EADC`, copper `#C68A4B`/`#E2B47F`, hairlines `rgba(198,138,75,.18)`.
- Fonts: EN **Sora**, AR **IBM Plex Sans Arabic** (swap for exact brand fonts when found).
- Layout: max-width 520 px centered; sticky chip nav (opaque bg — headless Chromium doesn't render backdrop-blur); item rows = names (flex:0 1 auto) + dotted leader (flex:1 0 16px) + price; `.n-note` capped at 23ch.
- Sections: Hot Coffee / Cold Coffee / Filter & Brew / Beyond Coffee / Bakery & Sweets (bilingual headers, EN nowrap-clamped).

## Dubai expansion — kit, catalog & stress-test standard

Scaling to many client menus (target: Dubai cafés with weak menus, gift-first outreach). Rules that keep quality at scale:

- **Innovation mandate — never templated.** Every client menu gets its OWN visual identity (palette, type pairing, signature hero animation) tailored to that brand. NEVER reuse another client's look. The dark-copper "house design language" above is a *fallback for when brand assets are unreachable*, not a template to stamp out — vary it or replace it per client. Two menus should never look like recolours of each other.
- **Reusable stress-test harness:** `node menus/_kit/verify.mjs <slug>`. Gate = no horizontal overflow at 375/414/768/1280 px + zero JS errors + reduced-motion smoke + CSS-applied check. Writes `_shot-375.png` / `_shot-desktop.png` for visual sign-off. A menu is not "done" until it passes and the screenshots are eyeballed.
- **Gift doc per client:** copy `menus/_kit/gift-template.html`, fill `{{CAFE}} {{CAFE_AR}} {{SLUG}} {{ACCENT}} {{ACCENT2}} {{INK}} {{BG}}` in that brand's colours. Animated strike-through of SR 499 + 199/mo → "SR 0 · on the house". This is the outreach bridge — the doc that secures the client.
- **Catalog = memory ("the OS"):** every build is registered in `menus/index.json` (slug, name, city, status, accent). This is the machine-readable menu catalog; keep it in sync on every build. (Cannot touch the user's local Mac app from this container — this JSON is the portable equivalent.)
- **Parallel build:** design agents fan out (one distinct café each), each writes `menus/<slug>/index.html`; then the harness stress-tests every slug before it counts as delivered.
- **Post-build enhancement swarm:** after a build wave, run `menus/_kit/enhance-swarm.js` (`Workflow({scriptPath, args:[slugs]})`) — multi-dimensional audit (brand/visual/imagery · content/bilingual/type · robustness/a11y/weight) → adversarial verify → apply (deepen each brand's visual/imagery system so no section is bare text; inline SVG/CSS only — external images are CSP-blocked) → harness re-gate. Improvements only, never regress a passing menu.

## Self-tightening loop (the system that compounds — bounded, NOT infinite)

The pipeline gets better over time by feeding its own results back in. This is the real "self-improving" mechanism — not recursive intelligence growth (that isn't a thing), but institutional memory + auto-generation + convergent improvement:

- **Learn from mistakes → `menus/_kit/lessons.md`.** Every harness failure, regression, or review finding gets appended as a durable rule. Build/enhance agents and the harness consult it so the same defect never ships twice. Append, never forget.
- **Self-generating tracker → `node menus/_kit/build-tracker.mjs`.** The tracker is DATA-driven; the generator recomputes counts/cells from `menus/index.json` + disk and splices them in. Never hand-edit tracker numbers — regenerate, then publish the same artifact file path (keeps the same URL). Run it every MED cycle.
- **Convergence, not infinity.** Improvement loops are BOUNDED: iterate until no verified findings remain, or a diminishing-returns threshold. Trigger on events (new menu, failure), never "as often as possible." Unbounded loops drift, regress, and waste tokens — the stop condition is what makes the loop trustworthy.

## Autonomous build protocol — "MED" crew (hands-off; save to memory, default mode)

The user does not babysit. Errors self-heal. Only meaningful results surface. Every menu build runs this loop automatically:

- **Monitor** — after each design wave/agent completes, run `node menus/_kit/verify.mjs <slug>` on every new or changed menu.
- **Error-heal** — any menu that fails the gate (horizontal overflow · JS error · CSS not applied) is auto-fixed and re-verified, up to 3 attempts. If still failing, set it aside with a one-line reason and move on — NEVER block the rest of the batch, never page the user with raw errors.
- **Deliver** — passing menus are added to `menus/index.json`, committed, and (while push is blocked) delivered via SendUserFile. Redeploy the live tracker artifact to its SAME URL after each wave.
- **Push resilience** — keep a background auto-push retry (~15 min). A 403 is a permission-grant issue, never fatal; a granted access lands unattended.
- **Quiet by default** — surface a message only when menus are ready/delivered or a real decision is needed. Not for progress, retries, or self-healed errors.

## Repo / git rules

- Set `git config user.email noreply@anthropic.com && git config user.name Claude` **before committing** (stop-hook enforces committer email; no signing key exists here).
- Push only to the session's designated `claude/...` branch. If the git proxy returns 403 on push: reads still work — retry in a background loop (60 s interval); it's a write-permission grant issue on the GitHub app, not a network error. GitHub MCP `push_files`/`create_branch` will also 403 in that state.
- Deliver artifacts to the user directly (SendUserFile) when pushes are blocked, so delivery never waits on permissions.

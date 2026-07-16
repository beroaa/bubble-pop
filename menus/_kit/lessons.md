# Menu Sadah — Lessons Ledger (the system's memory)

Every mistake caught in a build becomes a permanent rule here. The harness, the
build agents, and the enhancement swarm consult this file so the *same* error is
never shipped twice. This is how the pipeline "learns" — append, never forget.

## Rendering / headless browser
- **backdrop-filter blur does NOT render in headless Chromium.** Sticky nav must use a SOLID/opaque background colour, never translucent-glass-only.
- **Google Fonts only load under Playwright** when launched with `proxy:{server: process.env.HTTPS_PROXY}` and context `ignoreHTTPSErrors:true`. Otherwise you silently get fallback fonts.
- **`document.fonts.size` can read 0 even when webfonts visibly render** — treat the harness `fontsOk` flag as a soft signal; confirm fonts via screenshot or metric comparison, not that flag alone.

## Layout / 375px overflow (most common failure)
- Item rows: name block = `flex:0 1 auto`, dotted leader = `flex:1 0 16px`, price = `white-space:nowrap`. Any other combo overflows at 375.
- Cap descriptive notes (`.n-note`) at ~23ch and keep them SHORT — long bilingual notes are the #1 cause of horizontal overflow.
- Long EN section headers (e.g. "Bakery & Sweets") wrap ugly next to Arabic — clamp font-size and use `white-space:nowrap`.
- Multi-word wordmarks/section titles: `clamp()` the font-size so they never blow past 375.

## Imagery
- **External images are CSP-blocked** (in artifacts and via fetch here). Never use external `<img>` URLs. Use inline SVG/CSS illustration, or embed real assets as data: URIs.

## Bilingual / Arabic
- English item name slightly BIGGER than its Arabic (EN ~1.06rem / AR ~0.9rem).
- Prices use `font-variant-numeric: tabular-nums`; keep the currency label (AED/SR) small.

## Git / delivery
- Push proxy can return **403 = write-permission grant issue** (not network); reads still work. Retry in background; deliver via SendUserFile meanwhile. Never treat as fatal.
- Commits show "Unverified" because **no GPG signing key exists in this env** — committer email is still correct. Expected; do not churn commits over it.

## Process
- Verify BEFORE counting a menu done: `node menus/_kit/verify.mjs <slug>` must exit 0.
- Improve loops are **bounded & convergent** — stop when no verified findings remain; never run an unbounded "as often as possible" loop (drift + regression + wasted tokens).

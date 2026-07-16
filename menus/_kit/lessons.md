# Menu Sadah — Lessons Ledger (the system's memory)

Every mistake caught in a build becomes a permanent rule here. The harness, the
build agents, and the enhancement swarm consult this file so the *same* error is
never shipped twice. This is how the pipeline "learns" — append, never forget.

## Rendering / headless browser
- **backdrop-filter blur does NOT render in headless Chromium.** Sticky nav must use a SOLID/opaque background colour, never translucent-glass-only.
- **CORRECTION (was wrong before) — Google Fonts do NOT load when Chromium launches with `proxy:{server}`.** The font connection resets (`net::ERR_CONNECTION_RESET`), silently yielding fallback fonts. An earlier note here claimed the proxy launch loads fonts — that was FALSE, proven by network capture. This silently shipped fallback-font screenshots as "verified".
- **The reliable fix:** launch WITHOUT a proxy arg; intercept `fonts.(googleapis|gstatic)\.com` via `page.route` and fulfill from Node `fetch()` using an undici `Agent` trusting `/root/.ccr/ca-bundle.crt` + a desktop Chrome UA (cache the bytes). Latin subsets load reliably; the Arabic subset is still unconfirmed in-harness (renders fine live via `<link>`) → gate Latin as FAIL, Arabic as WARN.
- **`document.fonts.check/ready/size` all LIE for `<link>`-loaded fonts** — returned "loaded"/size 0 both when fonts rendered and when they didn't. The ONLY trustworthy check is metric comparison: measure text in `"Family",monospace` vs `monospace`; equal width ⇒ the font fell back. (This is now the harness's font gate.)

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

## Harness self-corrections (the QA learning from itself)
- **`cssApplied` must accept `background-image`/gradients, not just `background-color`.** A body styled with `background:linear-gradient(...)` has a *transparent* computed `background-color`, which false-flagged kuthban as "CSS not applied". Fix: treat a page as styled if body/html/`.wrap`/`.card` has a non-default background COLOR **or** a `background-image !== none`. (Caught by kuthban — desert gradient.)

## Process
- Verify BEFORE counting a menu done: `node menus/_kit/verify.mjs <slug>` must exit 0.
- Improve loops are **bounded & convergent** — stop when no verified findings remain; never run an unbounded "as often as possible" loop (drift + regression + wasted tokens).

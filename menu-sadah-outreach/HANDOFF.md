# 🦖 MENU SADAH — SESSION HANDOFF (for a fresh Claude session)

**Read `CLAUDE.md` first — it holds all the standing orders (autopilot, Godzilla
standard, Gulf-Arabic voice, swarm survival, build-tracker law).** This file is
just the *current state* + the *ready next missions* so you can start in one paste.

Ibrahim (the founder) is switching to a fresh account. He wants zero ramp-up:
pick the top mission and run it on FULL AUTOPILOT, his standing style.

---

## ✅ WHAT'S ALREADY DONE + LIVE (do not redo)
- **Empire build shipped** (7 waves): award-menu layout, premium buttons, order
  cart + WhatsApp checkout, bold text/prices, per-cafe "wow" flourishes.
- **Gift sales page**: founder trust block (Ibrahim Sharbatly + LinkedIn + photo),
  mature Saudi Arabic voice, card-unlocks-30-day-trial → 199 SAR (live Stripe),
  1,199 SAR menu-build value anchor → FREE for founding cafes.
- **Golden animated dallah** replacing the old childish coffee motif, with a
  **tap-to-play pour sound** (auto-upgrades to a real recorded pour when present).
- **Real dallah photo (`saudi.jpg`) + real pour (`pour.mp3`)** hunted on the Mac,
  CC-BY credited, deployed. Slots are wired — drop-in upgrades need no rebuild.
- **Deployed to menu-sadah.com** (Netlify site "menusadah").

## 📊 CURRENT NUMBERS
- Queue: **973 cafes** — **132 luxe** (masterpiece/godzilla tier = the sales fleet)
  + 841 standard. `singularity/queue.json`.
- **22 new real Riyadh cafes** scouted, in queue, NOT yet built to godzilla tier —
  `singularity/new-cafes-candidates.json`.
- DM cockpit: `singularity/dms.html` (PRIVATE — never deploy with menus).
- Working branch here was `claude/riyadh-cafes-e-menu-vv298s` — your session may be
  assigned a different branch; follow your own branch orders, keep committing.

## 🧭 THE NORTH STARS (measure every page against these)
1. `dist/beyt-coffee/index.html` — reference MENU (10/10)
2. `dist/beyt-coffee-welcome/index.html` — reference GIFT page (10/10)
3. `dist/rustic-grill.html` — favorite grill menu
Blueprint: `singularity/MASTERS-STUDY-V2.md`. Godzilla plan: `singularity/GODZILLA-SPEC.md`.

## 🏭 THE FACTORY (how to build)
`queue.json` → `node singularity/engine.mjs build` → QA gate (`learnings.json`,
enforced) → `dist/`. To rebuild luxe: set those entries' `stage:'BUILD'`, run build.
Renderers: `lib/pages-masterpiece.mjs` (luxe, with brief) + `lib/pages-luxe.mjs`.
**One renderer-surgeon at a time — never two agents editing the same lib file.**

## 🖥 MACHINE CHECK (do this first)
- If you're on the **cloud box**: network-walled — CANNOT download images or deploy.
  Photo/audio/deploy = package a Mac mission file (see `singularity/*MISSION*.md`).
- If you're on the **MacBook**: network is open — do photos, fonts, deploy here.

---

## 🎯 READY MISSIONS (priority order — Ibrahim picks or says "do #1")

### #1 — REVENUE: make the 22 new cafes outreach-ready ⭐ (recommended)
> Read CLAUDE.md + HANDOFF.md. Take the 22 cafes in
> singularity/new-cafes-candidates.json. Ensure each is in queue.json as tier:'luxe'
> with a real evidenced signature menu (WebSearch each cafe; evidence law — no
> invented dishes/prices). Build each cafe's masterpiece menu + gift page to the
> Godzilla 10/10 standard, verify in a real browser against the 3 north stars,
> screenshot, commit, push. Then refresh singularity/dms.html so these 22 rank
> best-first with copy-paste mature-Saudi Arabic DMs + their menu & gift links.
> Full autopilot, live build tracker, easy-steps at the end.

### #2 — SCALE: promote the best standard cafes to godzilla tier
> Rank the 841 standard cafes by grade/area, pick the top ~50 real ones, promote
> to tier:'luxe', build masterpiece menu + gift page each, verify, commit, push.
> Same quality bar as the 3 north stars. Live tracker + easy steps.

### #3 — VISUALS: real photos for the fleet (Mac job)
> Read singularity/PHOTO-MISSION-50.md. Hunt real product/shop photos for each
> luxe cafe from its own Instagram/TikTok/Maps/delivery pages (evidence only),
> crop premium, drop into dist/assets/photos/<key>.jpg — menus auto-upgrade.

### #4 — SELL: sharpen the DM cockpit
> Rebuild singularity/dms.html: every cafe ranked best-first by fit, each with a
> ready mature-Saudi-businessman Arabic DM, the gift link, and why-them evidence.
> Keep it PRIVATE (never deploy). Make it a fast daily outreach cockpit.

### #5 — ClientOS (his main workstation — Mac only)
> Keep singularity/CLIENTOS-MISSION.md + clientos-menus-payload.json current so
> Mac-Claude can fuse new menus/features INTO the ClientOS app (never standalone).

---

## ⚖️ IRON RULES (never break)
1. Evidence only — every dish/price needs a source URL; unknown price = not shown.
2. Per-brand identity — each cafe keeps its own palette + bilingual medallion.
3. Gulf-Arabic voice — mature Riyadh businessman, never AI/MSA/street. Write Arabic
   first, fit English to it.
4. Commit trailers: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` +
   the Claude-Session line. No model IDs in commits/PRs/code.
5. Talk to Ibrahim in his lingo — fun, simple, "brother", always honest about
   what's real vs not. End action replies with numbered EASY STEPS.

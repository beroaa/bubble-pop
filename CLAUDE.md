# MENU SADAH — standing orders from Ibrahim (the founder)

These orders apply to EVERY Claude session in this repo — cloud or MacBook. Read them first, obey them always.

## Prime directive: FULL AUTOPILOT
- Ibrahim does NOT babysit. When he gives a goal ("build 500 full menus"), figure out every step yourself: research, build, verify, screenshot, commit, push, report. Never ask "should I?" — decide as the expert and go.
- Improve his rushed prompts to the max FIRST, then apply them. He expects this every time.
- Only stop for things physically impossible from the current machine — and even then, don't ask questions: package the blocked step as a ready-to-run mission file (like singularity/PHOTO-MISSION.md) and tell him the one command to run.
- Every build gets its own card on the build board (`node singularity/btrack.mjs`) with a live 0.1s ETA. Sync + push the board every time.
- **Live activity feed (Ibrahim's standing demand — EVERY build, always):** at every meaningful step of any build, post a short easy-English bullet via `node singularity/btrack.mjs log <id> "<what is happening right now>"` (e.g. "4 agents researching cafes", "building pages", "taking screenshots"). Keep bullets under 12 words, no jargon. Then re-sync the artifact board (inline builds-state into scratchpad build-board.html and republish the same artifact URL) so he sees big ETA + live bullets on his phone. Token-cheap one-liners, but never skip them.
- Always commit + push to the working branch when a chunk of work lands. Never leave work uncommitted.
- **Easy-steps mode (standing order):** every reply that needs action from Ibrahim ends with a short numbered EASY STEPS list — plain words, one action per step, what to paste and where. No walls of text for instructions.


## THE GODZILLA STANDARD — the 10/10 bar (locked 2026-07-19, Ibrahim's most repeated demand)
- Three pages are the eternal north stars. EVERY menu/gift page is measured against them, always:
  1. `dist/beyt-coffee/index.html` — the reference MENU (10/10)
  2. `dist/beyt-coffee-welcome/index.html` — the reference GIFT page / sales weapon (10/10)
  3. `dist/rustic-grill.html` — Ibrahim's favorite grill menu (its own fire/ticket personality)
- The blueprint of exactly how they achieve 10/10 lives in `singularity/MASTERS-STUDY-V2.md` (+ the older MASTERS-STUDY.md). Read it before ANY visual build.
- Non-negotiable quality laws these prove (past mistakes — never repeat):
  1. **INK-DARK LEGIBLE TEXT.** Headings/names/body are strong near-black brand-ink (Beyt ≈ #382900), NOT gold/accent. Accent color is for shapes/dots/underlines/borders/prices ONLY — never long text. Low-contrast gold-on-cream = the #1 thing that made the 50 look "AI/5-10". Never ship transparent/washed text (watch failed background-clip:text → rgba(0,0,0,0)).
  2. **CONFIDENT INK CRAFT.** Thick 2px dark borders + hard OFFSET shadows (`3px 3px 0 ink`, no blur), chunky radii, tape/stamps/doodles — the hand-drawn confident look.
  3. **ANIMATED BRAND MARK.** Each cafe needs its own designed animated SVG mark (like Beyt's assembling cube / the animated logo at the bottom of the Beyt gift page), derived from its world/type/motif — NOT just an initial. Real downloaded logos are a Mac job; designed animated marks are pure design we make here.
  4. **LIVING ON-BRAND BACKGROUND.** Per-cafe vibrant animated backdrop that expresses that brand's identity/emotion (see brandbg50.json pipeline) — subtle in the center third so text stays legible.
  5. Real brand photos (VISUALS-FIRST law) + per-cafe palette + bilingual medallion still hold.
- When Ibrahim says "Godzilla build" / "biggest build" / "make it 10/10 like beyt": run the plan in `singularity/GODZILLA-SPEC.md`, one renderer-surgeon at a time (never two agents editing lib/pages-masterpiece.mjs at once — file collisions), verify in a real browser against the three masters, screenshot, commit, push.

## ClientOS = THE main workstation (Ibrahim's standing order)
- ClientOS (the space-theme "G2" app: ATLAS/TONIGHT/PIPELINE/MENUS/SENT/MONEY/LAB/OPS tabs, LV/XP, SILVER ranks) is Ibrahim's MAIN WORKSTATION. Every new operator feature, menu list, or dashboard fuses INTO it — never a separate standalone page, never the old brown "hq" skin.
- The REAL app lives ONLY on his MacBook at `/Users/bero/Desktop/ClientOS/` — the .app zips he uploads contain just the launcher script, NOT the app. Upgrading ClientOS is therefore MacBook-session work: keep `singularity/CLIENTOS-MISSION.md` + `singularity/clientos-menus-payload.json` current, and hand him the one paste-line.
- His design language always wins. Cloud box prepares payloads + mission files; Mac-Claude performs the surgery on the app itself.

## The business (context)
- MENU SADAH (منيو سادة) — QR e-menu agency for Riyadh cafes. Site: menu-sadah.com. Reference pages he loves: /beyt-coffee and /beyt-coffee-welcome ("gift links" = the sales weapon).
- Goal: land first paying cafe clients. The DM cockpit (`singularity/dms.html` — PRIVATE, never upload with menus) ranks all cafes best-first with copy-paste Arabic DMs.
- Sales edge: SFDA law — calories mandatory on all KSA menus since 2019, caffeine/allergens since July 2025, explicitly including digital menus.

## Iron rules (never break)
1. **Evidence only.** Never invent a cafe, dish, price, or handle. Every dish needs a source URL. Price unknown → it does NOT appear on a menu (gift-letter mention only). Agents return found:false when starved — honesty beats coverage.
2. **The factory**: queue.json → engine.mjs build → QA gate (learnings.json rules, enforced) → dist/. Lessons learned get recorded via a formulaVersion bump. Read singularity/learnings.json before building; add a lesson when something new is learned.
3. **Per-brand identity**: lib/brand-theme.mjs derives each cafe's palette from its name/type (deterministic). Never flatten cafes back to one shared look.
4. **Photo slots**: menus auto-upgrade when photos land in dist/assets/photos/. Cloud box CANNOT download images (network-blocked, verified repeatedly — don't retry). Photo work happens on Ibrahim's MacBook via PHOTO-MISSION.md.
5. Commit trailers: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` + the Claude-Session line. NO model IDs in commits/PRs/code.
6. Talk to Ibrahim in his lingo: fun, simple, direct, "brother" — and ALWAYS honest about what's real vs not. He hates discovering gaps later more than he hates bad news.

## GULF ARABIC VOICE LAW (locked 2026-07-20 — Ibrahim's order)
- Ibrahim's Arabic is rusty (he lived in 7 countries; English is his first language) — but a Riyadh café owner must NEVER sense that. EVERY Arabic word a client sees (gift letters, offers, founder lines, DMs, menu copy) must read like a **mature Saudi/Gulf businessman wrote it himself** — warm, confident, respectful, personal.
- Register = *khaleeji mohtaram* (composed, grown man of business): natural Saudi touches — عشان، اللي، حبيت، خذوا، على حسابي، مثل ما يستاهل، ما قصّرتوا، تكفّون بعيد. NOT stiff formal MSA (kill: نحن نقدّم، يسعدنا أن، الرجاء، من خلال، نظراً لـ، نسعى جاهدين) and NOT heavy street slang either. Dignified, not hype-bot, not street.
- **Write the Arabic FIRST from a Saudi mindset, then fit the English to it — never translate English→Arabic.** Literal translation, passive voice, and robotic parallel structures are the tells that scream "AI/outsider."
- When shipping client-facing Arabic and authenticity is uncertain, run a native Saudi-voice editor pass (one agent, "mature Riyadh businessman" persona) before it goes live. His whole edge is that he's a real Saudi from a strong family — the language must back that up, always.

## Machine notes
- Cloud box: WebSearch works (budget ~200/session, resets each new session); direct fetches to delivery apps/Instagram/image hosts are blocked (403/000).
- Swarm research: use parallel Workflow squadrons with structured-output agents; merge via singularity/merge-swarm.mjs (re-validates everything).
- MacBook sessions: network is open — photos, fonts, and menu-sadah.com fetches happen THERE.

## SWARM SURVIVAL LAW (locked 2026-07-20 — Ibrahim's order after repeated silent deaths)
- **Why swarms "keep dying":** background Workflow swarms in the cloud box get SUSPENDED by the host the moment the main session goes idle between turns. The agent receives its prompt but the model reply never comes — the run journal shows `"type":"started"` with NO matching `"type":"result"`, and **NO completion/failure notification ever fires.** Proven: a dead agent's log was just `[user prompt][attachment][attachment]` then frozen ~49 min, only 2 of 50 agents ever started. It is NOT disk (checked: plenty free) and NOT an agent error — it is the process being starved while the box thinks nobody's home.
- **NEVER fire-and-forget a swarm.** Every `Workflow` launch is paired with a WATCHDOG loop:
  1. Immediately schedule a self check-in ~8 min out (`mcp send_later`, this session). The check-in itself KEEPS THE SESSION WARM, which is what keeps the workflow alive — this is the actual fix, not luck.
  2. On each wake: count `"type":"result"` lines in `<transcriptDir>/journal.jsonl`. If the count grew, re-arm another ~8-min check-in. If it did NOT grow (or agent-*.jsonl mtimes are idle >5 min), the run stalled → relaunch with `Workflow({scriptPath, resumeFromRunId})` — completed agents replay from cache, so zero work is lost — then re-arm.
  3. Keep re-arming until result count hits the target (e.g. 50/50), THEN merge → rebuild → verify → commit → push.
- **Keep runs short + resumable:** prefer batches ≤ ~20 agents (chunk big swarms) so a run finishes inside one warm window; always keep the `scriptPath` + `runId` so any stall resumes instead of restarting.
- **Embed inputs in the script** (a `const DATA = {...}` after `meta`), never pass giant blobs via `args` — the placeholder-args mistake wastes a whole run.

## VISUALS-FIRST LAW (Ibrahim's most important order — locked 2026-07-18)
- Real brand visuals are the #1 quality lever. For EVERY menu (starting with the 50): hunt ALL findable images of the cafe's products, shop, and existing menu (Instagram, TikTok, Google Maps, delivery apps), study them, and place them like a Mayfair design firm — hero shots, room headers, detail cards, texture crops. Upscale/clean before use (min ~1200px wide, tasteful crops).
- Division of labor is physics: cloud box CANNOT download images (network wall) — photo HUNTING always runs on the MacBook via the current PHOTO-MISSION file; cloud box builds the per-cafe photo slots, layout logic, and auto-upgrade wiring so menus improve the moment photos land in dist/assets/photos/<slug>/.
- Per-cafe folders: dist/assets/photos/<slug>/1.jpg..N.jpg + meta.json (what each shot shows). Engine prefers per-cafe photos over shared category photos, always with graceful fallback. Evidence rule holds: only images actually from that cafe's own accounts/pages.

## Brand-soul rule (locked 2026-07-18)
- EVERY gift link and menu — all tiers, all 948+ — must carry its cafe's own brand palette (lib/brand-theme.mjs) and the bilingual medallion mark (Arabic initial in AR mode, English initial in EN mode). Never ship a shared-gold generic page again.
- Real cafe logos can only be fetched on the MacBook (network wall) — when logo work is requested, extend PHOTO-MISSION.md rather than faking marks.
- Big rebuilds get a triple-check: (1) data pass — QA gate, palette uniqueness, welcome→menu links, no private files in dist; (2) browser pass — Playwright error sweep + screenshots across tiers; (3) regression pass — regenerate payload/gameos/dms/hq and boot them.

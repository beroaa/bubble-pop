# MENU SADAH — standing orders from Ibrahim (the founder)

These orders apply to EVERY Claude session in this repo — cloud or MacBook. Read them first, obey them always.

## Prime directive: FULL AUTOPILOT
- Ibrahim does NOT babysit. When he gives a goal ("build 500 full menus"), figure out every step yourself: research, build, verify, screenshot, commit, push, report. Never ask "should I?" — decide as the expert and go.
- Improve his rushed prompts to the max FIRST, then apply them. He expects this every time.
- Only stop for things physically impossible from the current machine — and even then, don't ask questions: package the blocked step as a ready-to-run mission file (like singularity/PHOTO-MISSION.md) and tell him the one command to run.
- Every build gets its own card on the build board (`node singularity/btrack.mjs`) with a live 0.1s ETA. Sync + push the board every time.
- **Live activity feed (Ibrahim's standing demand — EVERY build, always):** at every meaningful step of any build, post a short easy-English bullet via `node singularity/btrack.mjs log <id> "<what is happening right now>"` (e.g. "4 agents researching cafes", "building pages", "taking screenshots"). Keep bullets under 12 words, no jargon. Then re-sync the artifact board (inline builds-state into scratchpad build-board.html and republish the same artifact URL) so he sees big ETA + live bullets on his phone. Token-cheap one-liners, but never skip them.
- Always commit + push to the working branch when a chunk of work lands. Never leave work uncommitted.

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

## Machine notes
- Cloud box: WebSearch works (budget ~200/session, resets each new session); direct fetches to delivery apps/Instagram/image hosts are blocked (403/000).
- Swarm research: use parallel Workflow squadrons with structured-output agents; merge via singularity/merge-swarm.mjs (re-validates everything).
- MacBook sessions: network is open — photos, fonts, and menu-sadah.com fetches happen THERE.

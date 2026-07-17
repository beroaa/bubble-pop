# Menu Sadah — session memory

Owner: Ibrahim (he/him), brand **menu-sadah.com** — premium e-menus for Gulf
cafés/restaurants. Best reference menus: **RUSTIC** and **BEYT**. Internal tool
is **ClientOS** (Chrome `--app` window, 430×940 portrait, runs from `file://`).

## ⚠️ Where the real code lives

The real app code is on Ibrahim's Mac, NOT in this repo:

- ClientOS app: `/Users/bero/Desktop/ClientOS/` (index.html + assets)
- KFC formula / forge daemon: `/Users/bero/Desktop/04 🍽 MENU SADAH HQ/MENU-SADAH-MOVE/menu-sadah/.forge/forge-daemon.py`

The `ClientOS.app` zip he once uploaded is only a 1KB bash launcher — always
check an upload actually contains source before promising upgrades. To work on
the real thing, he must zip those two folders (minus node_modules) and upload,
or push them to a GitHub repo and ask to add it to the session.

## 🎖 Mission Control (he loves this — reuse it)

A live status board published as a private Artifact during big builds:
template at `clientos/mission-control-template.html`. Structure: LIVE eyebrow →
big gold monospace ETA countdown (JS-ticking, tabular-nums) + mission progress
bar → 3 stat tiles (agents / findings / critical+major) → "The squad" agent
list with status pills and plain-words descriptions → severity-striped
"Verified findings feed" → numbered "Mission pipeline". Favicon 🎖, label per
phase, **redeploy at every phase change** and keep numbers honest (extend ETA
publicly if scope grows, with the reason on the board).

Design tokens (dark): ground `#0F0D08`, panel `#1C1810`, ink `#F2EFE7`, muted
`#A89F8D`, gold `#D9AE56`, good `#64D695`, busy `#EFBE45`, bad `#E04B55`.
Light theme derives from the same brand (warm cream ground `#F6F1E6`, deep gold
`#8F6D1F`). Theme-aware via CSS custom properties (`prefers-color-scheme` +
`data-theme` overrides), `prefers-reduced-motion` respected, system font stack
with "Noto Sans Arabic" fallback. Status colors validated with the dataviz
palette validator; status is never color-alone (glyph + label: ● ◑ ▲ ✓).

## Build quality bar

Pattern that worked: build → real-browser e2e suite (playwright-core +
`/opt/pw-browsers` Chromium, from `file://`, 430×940) → Workflow with 5
adversarial hunt lenses (time/date, storage, DOM safety, interaction, logic)
→ one skeptic agent per finding tries to REFUTE it → fix survivors → re-test →
push. The e2e suite for the ETA tracker lives in the session scratchpad as
`test-eta.mjs`; recreate it from the repo file if needed.

## clientos/

- `eta-tracker.html` — single-file offline ETA board (localStorage key
  `menu-sadah.eta.v1`). Storage is source-of-truth: `syncFromStorage()` before
  every mutation; edit forms are preserved DOM nodes (`liveEdit`) so re-renders
  never wipe typing; deferred `pendingSync` reconciles cross-window writes.
- `mission-control-template.html` — the board template above.

## Business context (be the honest expert)

He wants to mass-produce personalized menus (1k→10k) with cold outreach +
Stripe trials (~$49/mo). When advising: give real conversion math (cold outreach
→ paid is usually 0.5–2%, not 5%+), flag copyright/ToS risk of scraping photos
from delivery apps/Instagram for unsolicited demos, and steer to compliant
outreach. Encourage the ambition, ground the numbers.

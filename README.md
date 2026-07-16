# ClientOS — MENU SADAH HQ 🎖

The ops HQ for the MENU SADAH e-menu studio: track restaurant clients, hand out
menu quotas to your agents, and climb an 18-rank competitive ladder from
**Silver I** to **The Global Elite** (1 client ≈ Silver II · 100 ≈ Supreme
Master First Class · 200 ≈ Global Elite).

Built with React 19 + Vite + framer-motion. No backend — everything lives in
this device's localStorage (see the threat model below).

## Quick start

```bash
npm install
npm run dev        # local dev (localhost is a secure context — required for login crypto)
npm run test       # engine + lib unit tests (vitest)
npm run lint
npm run build      # → dist/, deploy to any static host over HTTPS
npm run preview    # serve the production build locally
```

macOS app-mode window (the "desktop app"): `scripts/clientos-app.sh https://your-host` —
opens Chrome in a 430×940 portrait window with its own isolated profile.

## The team model

- **Operator** (you): created on first boot. Full admin — recruit/bench agents,
  set menu quotas, reassign clients, set plan values, mark commissions paid,
  control the theme.
- **Agents** (your closers): operator creates their accounts and hands them a
  generated starter password out-of-band; they're forced to change it on first
  login. Agents see their own clients, quota, commissions (50% of plan value,
  snapshotted at secure time) and the leaderboard.

## The ranking system

- **Rank = secured clients** (status secured/live). Churn deranks you; quota is
  never refunded. Rank-ups get a full ceremony with original synthesized sound.
- **XP = prestige layer**: secure +500 · menu live +250 · lead +50 (first 5/day)
  · task popped +10 (first 10/day). 1000 XP per level, capped at level 40.
- Two themes: **HQ** (client-safe premium) and **Competitive** (full tactical
  HUD transformation). Operator-only toggle in Settings.
- The original Bubble Pop task popper lives on in the Tasks tab and feeds XP.

## Data & security (the honest version)

Read `docs/SECURITY.md`. Summary: passwords are properly hashed (PBKDF2-SHA256,
600k iterations) and roles gate the UI, but with no server, client-side auth is
a **lock on a glass door** — anyone with DevTools on the device owns the data.
There is **no shared database**: each browser profile is its own world, so v1
is truthfully a single-device HQ. Settings → Export/Import moves a full backup
between machines. The Supabase upgrade path in SECURITY.md turns this into real
multi-device auth + sync in about a day, without touching the UI.

Forgot the operator password? There's no reset email: DevTools → Application →
Local Storage → delete `clientos.v1.doc` (this wipes the HQ — export backups
regularly).

# Menu Sadah — Manama Cafe Leads + ETA Tracker

## What's in this folder

| File | What it is |
|---|---|
| `manama-leads.json` | Full verified cafe lead list for Bahrain/Manama, best fit first — paste into ClientOS |
| `winners-top20.json` | The top-20 winners only, same format |
| `eta-tracker.html` | Live ETA tracker — big numbers, works 100% offline, saves locally |

## Installing the ETA tracker into ClientOS

Your `ClientOS.app` is a launcher that opens `~/Desktop/ClientOS/index.html` in a Chrome
app window. To add the tracker:

1. Copy `eta-tracker.html` into `~/Desktop/ClientOS/` on your Mac.
2. Open it directly (double-click, or add a link/button in your `index.html`):
   ```html
   <a href="eta-tracker.html">⏱ ETA Tracker</a>
   ```
3. That's it. No internet needed, ever.

### Why it won't bug out when you switch chats
- Every countdown is computed from the **wall clock** (`target − now`) on each tick,
  not by counting interval beats — so when Chrome throttles a backgrounded window,
  nothing drifts. The moment you switch back, a `visibilitychange` handler forces an
  immediate refresh.
- ETAs are saved to `localStorage` (`menusadah_eta_v1`) — they survive restarts,
  reboots, and offline use. ("locked to memory")
- Flip clock is [FlipDown.js](https://github.com/PButcher/flipdown) v0.3.2 (MIT,
  4k★, battle-tested), fully embedded inline — no CDN, no network.

## Lead list notes
- Every cafe was cross-checked against at least two live public sources
  (Instagram + Google Maps/TripAdvisor/Talabat/press). Nothing is invented.
- `followers_est` is an estimate from public snippets — treat ±20%.
- `name_ar` is only filled where the Arabic name was actually found published;
  `null` means "not found", not "doesn't exist".

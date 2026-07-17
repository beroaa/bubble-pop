# ClientOS · ETA Tracker

A single-file, fully offline ETA board for Menu Sadah client jobs. No server, no
internet, no dependencies — everything lives in one HTML file and saves to the
browser's local storage on your Mac.

## Install (10 seconds)

1. Copy `eta-tracker.html` into your ClientOS folder:
   `~/Desktop/ClientOS/eta-tracker.html`
2. Open it the same way ClientOS opens — Chrome app mode:

   ```bash
   open -na "Google Chrome" --args --app="file:///Users/bero/Desktop/ClientOS/eta-tracker.html" --window-size=430,940
   ```

   Or add a link to it from your ClientOS `index.html`:

   ```html
   <a href="eta-tracker.html">🎖 ETA board</a>
   ```

## What it does

- **Jobs with live countdowns** — add a client/menu job, pick a deadline
  (quick chips: +1h, +4h, tomorrow 9am, +3 days, +1 week).
- **Status at a glance** — ● On track / ◑ Due soon (<24h) / ▲ Overdue /
  ✓ Delivered, each with its own glyph so it reads even in grayscale.
- **Progress bar** per job from creation → deadline.
- **Stat tiles** — Active / Due <24h / Overdue counts, always current.
- **Edit, deliver, undo, two-step delete** (no accidental deletes).
- **Backup / Restore** — JSON export & merge-import, so the data survives
  browser resets. Back up before big changes.
- **Arabic-friendly** — names render RTL automatically (`dir=auto`).

## Notes

- Data is stored under the localStorage key `menu-sadah.eta.v1`, scoped to
  `file://` pages in Chrome. Clearing Chrome's site data wipes it — use
  **⬇ Backup** first.
- Works with two windows open at once (they sync via storage events).
- Verified with a 28-check Playwright end-to-end suite plus an adversarial
  multi-agent review (time math, storage integrity, DOM safety, interaction
  edge cases, logic).

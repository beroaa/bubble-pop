# Ibrahim Sharbatly — Champion Profile ◆ الشربتلي

A gamified, **League-of-Legends-style champion-profile dashboard** for the House of
Sharbatly — dark obsidian, molten gold and hextech cyan, ornate Gulf geometry, glowing
HUD widgets, and cinematic animation. One person's life's work, presented like the
splash screen of the game they'd main.

**It's one self-contained file.** `index.html` has no dependencies, no build step, no
external requests. Double-click it, host it anywhere (GitHub Pages, Netlify, any static
host), or run the dev server below.

## What's inside

| Section | What it shows |
|---|---|
| **Hero** | Ornate hexagonal portrait, level ring, rank chip, name in EN + Arabic |
| **Elite Ladder** | Iron → Challenger tier ladder with an animated rank emblem |
| **Attributes** | Animated radar chart + signature-trait meters + playstyle |
| **Empire Index** | A glowing composite "power" number with an editable net-worth breakdown |
| **Ventures** | Elite Town Real Estate · Menu Sadah · nafas.practice as champion cards |
| **Abilities** | Q / W / E / R skill kit with hover tooltips |
| **Dynasty Tree** | Four generations of the House of Sharbatly (ancestor nodes are yours to fill in) |
| **Lore / Trophies / Timeline** | Backstory, achievements, and the climb |
| **Connect** | LinkedIn, Elite Town, Menu Sadah, Instagram |

## Make it yours (no coding needed)

Open `index.html` and edit the **`CONFIG`** object near the bottom of the file. Everything
on the page is driven from it — name, level, rank, stats, ventures, family tree, trophies,
timeline, and links. Change a value, refresh, done.

- **Add your real 4K photo** → set `CONFIG.portrait` to an image URL or `data:` URI.
  Until then, an engraved "IS" crest fills the frame.
- **Set real figures** → the Empire Index and net-worth row are **self-set, illustrative
  game stats**, not verified financials. Put your own numbers in `CONFIG.empireIndex` and
  `CONFIG.empire`.
- **Fill in the lineage** → replace the placeholder ancestor nodes in `CONFIG.dynasty`
  with real names, roles, and years.

## Run locally (optional)

```bash
npm install     # only pulls in Vite (the dev server)
npm run dev      # open the printed localhost URL
```

Or skip all of that and just open `index.html` in a browser.

## Accessibility & craft

Respects `prefers-reduced-motion` (animations, count-ups and the ember field pause),
keyboard focus is visible throughout, and the interface sound is **off by default**
(toggle it with the speaker icon in the top-right).

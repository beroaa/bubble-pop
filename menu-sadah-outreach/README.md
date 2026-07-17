# MENU SADAH — Riyadh Outreach Batch #1

10 real, small, social-first Riyadh cafes — each with a **personalized welcome
(pitch) page** and a **ready demo e-menu**, in the MENU SADAH brand style
(dark coffee tones, gold accent), Arabic-first with an English toggle.

## The 10 prospects

| Cafe | Area | Why they need us |
|---|---|---|
| Good Mate | Riyadh | New opening, strong TikTok, no website — menu lives in photos |
| 78 Specialty Coffee | Ar Rayyan | Cheese-pairing concept that needs explaining; IG-only (@78.riyadh) |
| Béaru Cafés | Al Malqa | Family café — table QR menu is a killer pitch (@bearu.cafe) |
| Little Henri | Al Muruj | 2026 opening on a TikTok wave; viral banana pudding |
| HLO | Olaya | Dessert-first spot with zero menu online |
| Place and People | Riyadh | Soft opening — perfect launch moment |
| Salam Café | Al Malqa | Calm neighborhood brand, fits a clean minimal menu |
| Aim Coffee Bar | Al Malqa | Precision positioning — origins/notes menu matches identity |
| Woods | Al Yasmin | Courtyard seating = QR scanning at the table |
| Breehant | Al Yasmin | 24/7 roastery, rotating origins — print can't keep up |

## Files

- `cafes.mjs` — all cafe data (names AR/EN, areas, accent colors, demo menus, pitch notes). **Edit `CONTACT.whatsapp` at the top — it's a placeholder.**
- `build.mjs` — generator. Run `node build.mjs` to rebuild `dist/`.
- `dist/index.html` — your private HQ index: all 10 prospects with pitch notes and links.
- `dist/<slug>/index.html` — the demo menu (deploy → `menu-sadah.com/<slug>`).
- `dist/<slug>-welcome/index.html` — the pitch page (deploy → `menu-sadah.com/<slug>-welcome`).

## Deploy

Upload the folders inside `dist/` to menu-sadah.com hosting so each cafe gets
the same URL pattern as Beyt Coffee:

```
menu-sadah.com/good-mate-welcome   ← send THIS link in the first DM
menu-sadah.com/good-mate           ← the demo menu it links to
```

The welcome page links to the menu with a relative path (`../<slug>/`), so the
pair works on any static host as long as both folders sit side by side.

## Outreach playbook (first DM)

> السلام عليكم — تابعنا حسابكم وأعجبنا شغلكم 👌
> جهّزنا لكم منيو إلكتروني تجريبي خاص فيكم، جاهز الآن:
> menu-sadah.com/<slug>-welcome
> إذا عجبكم، نفعّله لكم بنفس اليوم.

## Notes

- Demo menus are **inferred from public reviews/press** (July 2026) with realistic
  Riyadh specialty-coffee prices in SAR — every page carries a visible
  "demo prepared by MENU SADAH" disclaimer. Replace with the cafe's real menu
  after they sign.
- Per-cafe accent colors are chosen to hint at each brand (family-green for
  Béaru, leafy green for Woods, dessert-pink for HLO, etc.). Swap in `cafes.mjs`.

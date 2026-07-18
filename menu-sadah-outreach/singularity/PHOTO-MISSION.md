# 📸 PHOTO MISSION — run this on your MacBook

The cloud box cannot download images (every image host is blocked). Your Mac can.
This mission fills the photo slots that every luxe menu already has wired in.

## What you have
- `singularity/photo-leads.json` — 53 cafes × 147 URLs where each cafe's REAL food
  photos live (their delivery-app pages, Instagram/TikTok posts, own sites).

## What to do (with Claude Code on your Mac)
1. Open Claude Code in this repo on your Mac and say:
   > Read singularity/photo-leads.json. For each cafe, visit its lead URLs,
   > download 2-4 of its best real food photos, crop square-ish, save as
   > dist/assets/photos/<category-key>.jpg per cafe folder or the shared keys
   > (espresso, latte, v60, cold, matcha, bakery, dessert, tea, snacks, beans, saudi).
2. Any photo dropped into `dist/assets/photos/` upgrades every luxe menu
   automatically — the SVG art yields to the real photo the moment it loads.
3. Re-upload `dist/` to hosting. Done — menus jump from illustrated to real.

## Rules
- Only photos of THAT cafe's actual products (from its own pages/posts).
- Keep the source URL noted next to each photo if you can — evidence habit.

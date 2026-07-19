# 📸 PHOTO-50 — the 7 cafes that need a manual place match

43 of 50 cafes now show REAL Google Maps photos on menu-sadah.com. These 7 did NOT get
a confident Riyadh match from Google Places Text Search — the top hit was a different
business or in the wrong city. Per the evidence rule, nothing was placed on them (they
keep their tinted SVG-art menus as fallback). Fix them by pasting the correct Google
Maps place into the harvester.

## The 7
| Slug | Cafe | What Places wrongly returned | Note |
|---|---|---|---|
| matal-al-wadi | Matal Al Wadi | "Wadi Restaurant" / "مطل وادي نمار" | family cafe — try exact IG name |
| the-cake-corner | The Cake Corner | "Cozy Corner Cafe"; also a Cake Corner in **Qatar** | needs the Riyadh branch |
| chimney-cafe | Chimney Cafe | "CHICHI" / "Cheminee" | Diriyah area |
| sip-day-specialty-coffee | Sip Day Specialty Coffee | "BEAN & BUN" / "Sip1" | Wadi As Sarh |
| matchafulll | Matchafulll | "House of Matcha" (different brand) | matcha bar |
| sharq-coffee-and-roastery | Sharq Coffee & Roastery | "Shrq Coffee Roasters" — all in **Dhahran/Dammam** | confirm a Riyadh branch exists |
| ob-cafe | Ob Cafe (@obcaf.e) | "Olba Bakehouse" / "قهوة أوبي" | uncertain — verify handle |

## How to fix one (easy)
1. Open Google Maps, search the cafe, confirm it's the right Riyadh shop, copy its **Place ID**
   (Maps → share → or use the place URL) OR just its exact name+neighborhood.
2. Run the recover snippet (same style as marthad/lihaf recovery) with that place, e.g.:
   ```
   GPLACES_KEY="$(cat /private/tmp/gplaces.key)" node singularity/recover-one.mjs <slug> "<exact query or place_id>"
   ```
   (If recover-one.mjs isn't present, ask Claude — it's a 20-line fetch of details+photos,
   writes dist/assets/photos/<slug>/ + meta.json, same as the main harvester.)
3. Rebuild + deploy: mark the slug QUEUED in queue.json, `node singularity/engine.mjs build`,
   then `netlify deploy --dir=dist --prod --no-build --site=menusadah`.

## Also still open (all 50)
- **Logos**: Google Places serves shop/product photos only, NOT brand logos. logo.png per
  cafe still has to come from Instagram/website on the MacBook (per PHOTO-MISSION-50 logo rule).

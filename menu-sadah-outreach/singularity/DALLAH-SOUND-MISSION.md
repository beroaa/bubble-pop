# ☕ DALLAH SOUND + PHOTO MISSION — run this on your MacBook

The cloud box can't download audio or images (network wall). Your Mac can.
Both slots are **already wired**: the menus auto-upgrade the second these two
files land — no rebuild needed, just re-upload `dist/`.

## The 2 files to drop in

### 1. Real ASMR coffee-pour sound  → `dist/assets/audio/pour.mp3`
- Right now tapping the gold dallah plays a *synthesized* pour (made by code).
- Drop a REAL recorded pour here and every menu plays that instead, automatically.
- Want: a clean ~2s Arabic-coffee / dallah pour, soft, no music, no talking.
  Trim it tight, keep it small (< ~150 KB), export as MP3.
- Sources: your own phone recording of a dallah pour is best (authentic + free of
  rights issues). Otherwise a royalty-free ASMR pour (Pixabay/Freesound CC0).

### 2. Real 4K dallah photo  → `dist/assets/photos/saudi.jpg`
- The Saudi / Arabic-coffee category header already has a photo slot keyed `saudi`.
- Drop a real, high-res dallah + finjan shot here; the illustrated dallah yields
  to the photo the moment it loads.
- Square-ish crop, min ~1200px wide, warm/premium look.

## Do it (Claude Code on your Mac)
Open Claude Code in this repo on your Mac and say:
> Find a clean ~2s royalty-free (CC0) Arabic-coffee dallah pour sound, trim it,
> save as dist/assets/audio/pour.mp3 (< 150KB). Also find one real high-res
> dallah + finjan photo and save as dist/assets/photos/saudi.jpg. Then re-upload dist/.

## Rules
- Sound: your own recording, or CC0/royalty-free only. Note the source.
- Photo: real dallah imagery, high-res, tasteful crop.
- Nothing else to change — the slots are live. Just add the 2 files + re-upload.

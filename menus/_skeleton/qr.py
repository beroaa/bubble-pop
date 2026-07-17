#!/usr/bin/env python3
"""Menu Sadah QR generator + verifier.
Usage: python3 qr.py <slug> [accentHex] [creamHex]
Writes menus/<slug>/qr/{<slug>-qr.svg, <slug>-qr.png} for https://menu-sadah.com/<slug>
Style: rounded-square modules + mildly rounded finders (verified scannable family).
Verifies decode with OpenCV across a size sweep; exits 1 on failure.
"""
import sys, os, subprocess

slug = sys.argv[1]
ACCENT = sys.argv[2] if len(sys.argv) > 2 else '#a67b51'
CREAM = sys.argv[3] if len(sys.argv) > 3 else '#fff8f2'
URL = f'https://menu-sadah.com/{slug}'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', slug, 'qr')
os.makedirs(OUT, exist_ok=True)

import qrcode, qrcode.constants
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0, box_size=1)
qr.add_data(URL); qr.make(fit=True)
m = qr.get_matrix(); n = len(m)
cell = 10; quiet = 4 * cell; size = n * cell + 2 * quiet

def in_finder(r, c):
    return (r < 7 and c < 7) or (r < 7 and c >= n - 7) or (r >= n - 7 and c < 7)

cells = []
for r in range(n):
    for c in range(n):
        if not m[r][c] or in_finder(r, c):
            continue
        x = quiet + c * cell; y = quiet + r * cell
        cells.append(f'<rect x="{x+0.25:.2f}" y="{y+0.25:.2f}" width="{cell-0.5}" height="{cell-0.5}" rx="{cell*0.26:.1f}"/>')

def finder(px, py):
    x = quiet + px * cell; y = quiet + py * cell; c = cell
    return (f'<rect x="{x}" y="{y}" width="{7*c}" height="{7*c}" rx="{0.75*c}" fill="{ACCENT}"/>'
            f'<rect x="{x+c}" y="{y+c}" width="{5*c}" height="{5*c}" rx="{0.55*c}" fill="{CREAM}"/>'
            f'<rect x="{x+2*c}" y="{y+2*c}" width="{3*c}" height="{3*c}" rx="{0.45*c}" fill="{ACCENT}"/>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
       f'<rect width="{size}" height="{size}" fill="{CREAM}"/>'
       f'<g fill="{ACCENT}">{"".join(cells)}</g>{finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}</svg>')
svg_path = os.path.join(OUT, f'{slug}-qr.svg')
open(svg_path, 'w').write(svg)

# render PNG via chromium
png_path = os.path.join(OUT, f'{slug}-qr.png')
render_js = f"""
import {{ chromium }} from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({{ viewport: {{ width: {size+90}, height: {size+90} }}, deviceScaleFactor: 3 }});
await p.goto('file://{svg_path}');
await p.waitForTimeout(150);
await p.screenshot({{ path: '{png_path}', clip: {{ x: 0, y: 0, width: {size}, height: {size} }} }});
await b.close();
"""
subprocess.run(['node', '--input-type=module', '-e', render_js], check=True)

import cv2
det = cv2.QRCodeDetector()
img = cv2.imread(png_path)
fails = []
for sz in range(300, 1240, 40):
    s = cv2.resize(img, (sz, sz))
    if det.detectAndDecode(s)[0] != URL:
        fails.append(sz)
if fails:
    print(f'✗ {slug}: QR FAILED decode at sizes {fails}'); sys.exit(1)
print(f'✓ {slug}: QR verified ({n} modules, sweep 300-1200px) → {URL}')

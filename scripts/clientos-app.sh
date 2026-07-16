#!/usr/bin/env bash
# ClientOS desktop wrapper: Chrome app-mode, phone-portrait window.
# Usage: scripts/clientos-app.sh [url]   (defaults to the prod URL below)
URL="${1:-https://clientos.pages.dev}"
exec open -na "Google Chrome" --args \
  --app="$URL" \
  --window-size=430,940 \
  --window-position=80,80 \
  --user-data-dir="$HOME/Library/Application Support/ClientOS-Chrome"

#!/bin/bash
# ClientOS — serves the bundled app on localhost (login crypto needs a secure
# context, so file:// won't work) and opens it in a Chrome app-mode window.
DIR="$(cd "$(dirname "$0")/../Resources/dist" && pwd)"
PORT=41913
URL="http://127.0.0.1:$PORT"

if ! curl -s -o /dev/null --max-time 1 "$URL"; then
  cd "$DIR"
  nohup python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
  for i in $(seq 1 20); do
    curl -s -o /dev/null --max-time 1 "$URL" && break
    sleep 0.2
  done
fi

if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --app="$URL" --window-size=430,940 --window-position=80,80 \
    --user-data-dir="$HOME/Library/Application Support/ClientOS-Chrome"
else
  open "$URL"
fi

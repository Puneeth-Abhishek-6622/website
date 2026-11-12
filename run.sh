#!/bin/sh
set -eu

SITE_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PORT=${PORT:-8000}

cd "$SITE_DIR"
printf 'Serving Radio Channel Simulation at http://localhost:%s\n' "$PORT"
exec python3 -m http.server "$PORT" --bind 127.0.0.1

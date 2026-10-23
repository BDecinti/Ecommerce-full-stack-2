#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Instala Node.js 24 o superior, o abre VER_TIENDA.html para ver la tienda."
  exit 1
fi
node -e 'if (Number(process.versions.node.split(".")[0]) < 24) { console.error("Se necesita Node.js 24 o superior."); process.exit(1); }'
if [ ! -f node_modules/.package-lock.json ]; then npm ci; fi
npm run dev -- --host 127.0.0.1 --open

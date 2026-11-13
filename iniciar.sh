#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
node -e 'if(Number(process.versions.node.split(".")[0])<24){console.error("Se necesita Node.js 24 o superior.");process.exit(1);}'
if [ ! -f node_modules/.package-lock.json ]; then npm ci; fi
npm run dev:full -- --open

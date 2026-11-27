#!/usr/bin/env sh
# =====================================================================
# iniciar.sh -> lo mismo que INICIAR_TIENDA.cmd, pero para Mac y Linux.
# Las lineas que empiezan con # son comentarios.
# =====================================================================

# -e: si un comando falla, el script se detiene. -u: usar una variable inexistente es error.
set -eu
# $0 es la ruta de este script; dirname saca su carpeta. Equivale al "cd /d %~dp0" del .cmd:
# te mueve a la raiz del proyecto, donde esta package.json.
cd "$(dirname "$0")"
# Comprueba que Node.js sea version 24 o mayor; si no, muestra el error y termina.
node -e 'if(Number(process.versions.node.split(".")[0])<24){console.error("Se necesita Node.js 24 o superior.");process.exit(1);}'
# Si todavia no se instalaron las dependencias, las instala con npm ci.
if [ ! -f node_modules/.package-lock.json ]; then npm ci; fi
# Ejecuta el script "dev:full" de package.json (node scripts/iniciar.mjs):
# enciende backend y frontend, y --open abre el navegador.
npm run dev:full -- --open

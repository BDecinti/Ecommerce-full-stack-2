@echo off
REM =====================================================================
REM INICIAR_TIENDA.cmd  ->  ES EL BOTON DE ENCENDIDO DE LA TIENDA (Windows)
REM Al hacerle doble clic se instala lo que falte y se ejecuta
REM "npm run dev:full", que levanta el backend y el frontend a la vez.
REM Cada linea que empieza con REM es un comentario: Windows la ignora.
REM =====================================================================

REM setlocal: las variables que se creen aqui no se quedan en tu Windows.
setlocal
REM cd = cambiar de carpeta. /d = cambia tambien de disco (C: a D:) si hace falta.
REM %~dp0 = la carpeta donde esta ESTE archivo (la raiz del proyecto).
REM Asi los comandos de abajo funcionan aunque lo abras desde otro lugar.
cd /d "%~dp0"
REM Pone el texto de la barra de titulo de la ventana negra.
title MiTienda - Full stack
REM Comprueba que Node.js este instalado. "where" busca el programa;
REM lo que sigue a ">nul" oculta los mensajes. Si no existe, errorlevel vale distinto de 0
REM y el bloque de abajo muestra el aviso, hace pause (espera una tecla) y sale.
where node >nul 2>&1
if errorlevel 1 (
  echo Instala Node.js 24 o superior desde https://nodejs.org/ y vuelve a abrir este archivo.
  pause
  exit /b 1
)
REM Comprueba que la version de Node sea 24 o mayor (package.json la exige en "engines").
REM Si es menor, muestra el error y termina con exit /b 1.
node -e "if(Number(process.versions.node.split('.')[0])<24){console.error('Se necesita Node.js 24 o superior.');process.exit(1);}"
if errorlevel 1 exit /b 1
REM Si la carpeta node_modules no existe (primera vez), instala las dependencias
REM (React, Vite, etc.) con "npm ci", que usa exactamente las versiones de package-lock.json.
REM Si falla, hace pause para que alcances a leer el error.
if not exist "node_modules\.package-lock.json" (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
REM LINEA CLAVE: ejecuta el script "dev:full" de package.json, que es "node scripts/iniciar.mjs".
REM Ese script compila y enciende el backend (puerto 8080), enciende Vite (puerto 5173)
REM y, por el argumento --open, abre el navegador en http://127.0.0.1:5173.
REM "call" es necesario porque npm es otro .cmd; sin call, este archivo terminaria ahi.
REM Los "--" separan las opciones de npm de las opciones que recibe nuestro script.
call npm run dev:full -- --open
REM Deja la ventana abierta al final (o si algo fallo) hasta que presiones una tecla.
REM Mientras la tienda funcione, esta ventana debe permanecer abierta.
pause

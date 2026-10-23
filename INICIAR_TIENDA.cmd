@echo off
setlocal
cd /d "%~dp0"
title MiTienda - Inicio local
where node >nul 2>&1
if errorlevel 1 (
  echo Primero instala Node.js 24 o superior desde https://nodejs.org/
  echo Si solo quieres ver la tienda, abre VER_TIENDA.html.
  pause
  exit /b 1
)
node -e "if (Number(process.versions.node.split('.')[0]) < 24) { console.error('Se necesita Node.js 24 o superior.'); process.exit(1); }"
if errorlevel 1 (
  pause
  exit /b 1
)
if not exist "node_modules\.package-lock.json" (
  echo Instalando dependencias. La primera vez necesita Internet.
  call npm ci
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias. Revisa la conexion.
    pause
    exit /b 1
  )
)
echo.
echo La tienda se abrira en tu navegador.
echo Mantener esta ventana abierta. Para detenerla, presionar Ctrl+C.
call npm run dev -- --host 127.0.0.1 --open
pause

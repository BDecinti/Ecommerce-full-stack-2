@echo off
setlocal
cd /d "%~dp0"
title MiTienda - Full stack
where node >nul 2>&1
if errorlevel 1 (
  echo Instala Node.js 24 o superior desde https://nodejs.org/ y vuelve a abrir este archivo.
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<24){console.error('Se necesita Node.js 24 o superior.');process.exit(1);}"
if errorlevel 1 exit /b 1
if not exist "node_modules\.package-lock.json" (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm run dev:full -- --open
pause

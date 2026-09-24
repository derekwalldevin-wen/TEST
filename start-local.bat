@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is required. Please install Node.js 22 or newer.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing local dependencies...
  call npm.cmd install
)
start "" "http://localhost:5173"
echo Starting the local 3D game at http://localhost:5173
call npm.cmd run dev
pause

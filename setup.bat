@echo off
echo ================================================
echo   Heba Brand Platform - Setup Script
echo ================================================
echo.

:: Fix SSL for Node v24
npm config set strict-ssl false
npm config set legacy-peer-deps true

echo [1/3] Installing dependencies...
npm install --legacy-peer-deps --no-audit

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Trying with --force flag...
  npm install --force --no-audit
)

echo.
echo [2/3] Setup complete!
echo.
echo [3/3] Starting development server...
echo.
echo  Open your browser at: http://localhost:3000
echo  Press Ctrl+C to stop the server
echo.
npm run dev

pause

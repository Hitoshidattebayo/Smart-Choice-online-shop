@echo off
cd /d "%~dp0studio-smart-choice"
echo Starting Sanity Studio...
echo.
echo Sanity Studio will be available at: http://localhost:3333
echo.
npm run dev
pause

@echo off
cd /d "%~dp0nextjs-smart-choice"
echo Cleaning cache...
if exist .next rmdir /s /q .next
echo Starting dev server...
npm run dev
pause

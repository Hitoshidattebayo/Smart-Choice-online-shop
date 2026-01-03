@echo off
echo ========================================
echo NextAuth.js Setup Script
echo ========================================
echo.

cd /d "%~dp0nextjs-smart-choice"

echo [1/4] Installing next-auth and bcryptjs...
call npm install next-auth@latest bcryptjs
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing TypeScript types...
call npm install --save-dev @types/bcryptjs
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dev dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [4/4] Updating database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to update database
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! NextAuth.js setup complete!
echo ========================================
echo.
echo NEXT STEP: Add to your .env file:
echo NEXTAUTH_SECRET="your-secret-key"
echo NEXTAUTH_URL="http://localhost:3000"
echo.
echo Then restart your dev server (npm run dev)
echo.
pause

@echo off
REM ===========================================
REM KKM Suku-Separuh Migration Runner
REM NutriSihat Database Migration
REM ===========================================

echo.
echo    ===========================================
echo    KKM SUKU-SEPARUH DATABASE MIGRATION
echo    NutriSihat Meal Planner
echo    ===========================================
echo.

REM Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo    [ERROR] Node.js is not installed!
    echo    Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo    [OK] Node.js detected
echo.

REM Check for .env.local
if not exist ..\.env.local (
    echo    [WARNING] .env.local not found!
    echo    Creating template...
    echo.
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co > ..\.env.local.template
    echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key >> ..\.env.local.template
    echo.
    echo    Please update .env.local.template with your credentials
    echo    and rename it to .env.local
    echo.
    pause
    exit /b 1
)

REM Display options
echo    Choose migration method:
echo    ========================
echo    1. Supabase Dashboard ^(Web interface - Easiest^)
echo    2. Node.js Script ^(Service Role Key - Fastest^)
echo    3. Playwright Automation ^(Browser automation^)
echo    4. Show manual SQL guide
echo.

set /p choice="    Enter your choice (1-4): "

if "%choice%"=="1" goto dashboard
if "%choice%"=="2" goto nodejs
if "%choice%"=="3" goto playwright
if "%choice%"=="4" goto manual
goto invalid

:dashboard
echo.
echo    ===========================================
echo    Opening Supabase Dashboard...
echo    ===========================================
echo.
echo    Instructions:
echo    1. Login to your account
echo    2. Click SQL Editor in sidebar
echo    3. Click New Query
echo    4. Copy SQL from: supabase\kkm_meal_planner_migration.sql
echo    5. Paste and click Run
echo.
echo    Opening browser...
echo.
start https://app.supabase.com/project/oasowmrkydwufexxxwjc/sql/new
goto end

:nodejs
echo.
echo    ===========================================
echo    Running Node.js Migration Script...
echo    ===========================================
echo.
cd ..
node scripts\kkm-migration.js
cd scripts
goto end

:playwright
echo.
echo    ===========================================
echo    Running Playwright Automation...
echo    ===========================================
echo.

REM Check if Playwright is installed
echo    Checking Playwright installation...
node -e "require('playwright')" > nul 2>&1
if errorlevel 1 (
    echo    [WARNING] Playwright not installed!
    echo    Installing Playwright...
    echo.
    cd ..
    npm install -D playwright
    npx playwright install chromium
    cd scripts
    echo.
)

cd ..
node scripts\playwright-supabase-automation.js
cd scripts
goto end

:manual
echo.
echo    ===========================================
echo    MANUAL MIGRATION GUIDE
echo    ===========================================
echo.
echo    SQL File Location:
echo    supabase\kkm_meal_planner_migration.sql
echo.
echo    Steps:
echo    ------
echo    1. Open the SQL file in VS Code
echo    2. Copy all content (Ctrl+A, Ctrl+C)
echo    3. Go to https://app.supabase.com
echo    4. Select your project
echo    5. SQL Editor ^> New Query
echo    6. Paste SQL
echo    7. Click Run (or Ctrl+Enter)
echo.
echo    Verification Query:
echo    ------------------
echo    SELECT category, COUNT(*) FROM foods GROUP BY category;
echo.
TYPE ..\supabase\kkm_meal_planner_migration.sql | more
goto end

:invalid
echo.
echo    [ERROR] Invalid choice! Please select 1-4.
echo.

:end
echo.
echo    ===========================================
echo    Migration runner complete
echo    ===========================================
echo.
pause

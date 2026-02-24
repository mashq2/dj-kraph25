@echo off
REM DJ Kraph M-Pesa Server - Quick Setup Script for Windows

echo.
echo ========================================
echo   DJ Kraph M-Pesa Server Setup
echo ========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Node.js detected: 
node -v
echo.

REM Check if npm is installed
npm -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo [2/4] npm detected: 
npm -v
echo.

REM Install dependencies
echo [3/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Check if .env exists
if not exist .env (
    echo [4/4] Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️ ATTENTION: Edit the .env file with your M-Pesa credentials!
    echo.
    echo Next steps:
    echo 1. Open .env in a text editor
    echo 2. Add your MPESA_CONSUMER_KEY from https://developer.safaricom.co.ke/
    echo 3. Add your MPESA_CONSUMER_SECRET
    echo 4. Save the file
    echo.
) else (
    echo [4/4] .env file already exists - keeping current config
    echo.
)

echo.
echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.
echo To start the server:
echo   npm run dev        (with auto-reload)
echo   npm start          (production mode)
echo.
echo The server will run on http://localhost:3001
echo.
pause

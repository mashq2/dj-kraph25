@echo off
REM DJ Kraph - Deploy to Netlify Script

REM Step 1: Initialize Git
echo.
echo ============================================
echo Step 1: Initializing Git Repository
echo ============================================
git init

REM Step 2: Configure Git
echo.
echo ============================================
echo Step 2: Configuring Git
echo ============================================
git config --global user.name "DJ Kraph Developer"
git config --global user.email "djkraph@music.local"

REM Step 3: Add all files
echo.
echo ============================================
echo Step 3: Adding all files to Git
echo ============================================
git add .

REM Step 4: Create initial commit
echo.
echo ============================================
echo Step 4: Creating initial commit
echo ============================================
git commit -m "Initial DJ Kraph commit: Music streaming platform with M-Pesa payments"

REM Step 5: Instructions for manual steps
echo.
echo ============================================
echo NEXT STEPS:
echo ============================================
echo.
echo 1. Go to https://github.com/new
echo 2. Create a repository named: dj-kraph
echo 3. Keep it PUBLIC
echo 4. Copy the HTTPS URL from GitHub
echo 5. Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 6. Then go to https://netlify.com and:
echo    - Sign up with GitHub
echo    - Import the dj-kraph repository
echo    - Add environment variables
echo.
echo ============================================
echo Your DJ Kraph site will be live in minutes!
echo ============================================
pause

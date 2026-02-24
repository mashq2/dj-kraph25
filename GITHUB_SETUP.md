# Push Your DJ Kraph Project to GitHub 📚

Follow these steps to get your code on GitHub so Railway can deploy it.

## Step 1: Install Git (if not already installed)

**Windows:**
```bash
# Download from: https://git-scm.com/download/win
# Or use choco:
choco install git
```

Verify installation:
```bash
git --version
```

## Step 2: Configure Git (One-time setup)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Create GitHub Account

1. Go to https://github.com/signup
2. Create account with email
3. Verify email
4. Done!

## Step 4: Create New Repository on GitHub

1. **Go to** https://github.com/new
2. **Repository name:** `dj-kraph`
3. **Description:** DJ Kraph - Music Streaming with M-Pesa Payments
4. **Visibility:** Public
5. **Skip** "Initialize with README" (we have files)
6. **Click** "Create repository"

You'll see instructions. Follow these instead:

## Step 5: Initialize Git in Your Project

Open terminal in `c:\Users\Bella\Downloads\dj`:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: DJ Kraph music platform with M-Pesa payments"
```

## Step 6: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**If it asks for password:**
- It will open browser for authentication
- Or use GitHub token (Settings → Developer Settings → Personal Access Tokens)

## Step 7: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/dj-kraph
2. You should see all your files uploaded ✅
3. Confirm you see:
   - ✅ HTML files
   - ✅ CSS files
   - ✅ JS files
   - ✅ server.js
   - ✅ package.json
   - ✅ .env.example
   - ⚠️ Should NOT see: node_modules, .env (covered by .gitignore)

## Step 8: Ready for Railway

Your GitHub repo is now connected to Railway. Just:
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your `dj-kraph` repo
5. Railway auto-deploys! 🚀

## Updating Your Code

After launch, whenever you make changes:

```bash
# Make your changes in the files

# Stage changes
git add .

# Commit
git commit -m "Update description"

# Push to GitHub
git push origin main
```

Railway will **automatically redeploy** your changes! ✨

## Troubleshooting

### Permission Denied
**Error:** `Permission denied (publickey)`

**Fix:**
```bash
# Generate SSH key (one-time)
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"

# Add to GitHub: Settings → SSH Keys → paste public key
```

### Repository already exists
**Error:** `fatal: remote origin already exists`

**Fix:**
```bash
# Remove existing remote
git remote remove origin

# Add correct one
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
git push -u origin main
```

### Can't push
**Error:** `failed to push some refs`

**Fix:**
```bash
# Pull latest changes first
git pull origin main

# Then push
git push origin main
```

### Files not showing on GitHub
**Check:**
1. Are they in .gitignore? (Remove if shouldn't be)
2. Did you run `git add .`?
3. Did you run `git commit -m "message"`?
4. Did you run `git push`?

## What Gets Uploaded to GitHub

**Will upload:**
- HTML files ✅
- CSS files ✅
- JavaScript files ✅
- JSON files ✅
- Markdown files ✅
- Images ✅
- Audio/Video ✅

**Won't upload (blocked by .gitignore):**
- node_modules/ ❌ (too large - Railway reinstalls)
- .env ❌ (secret credentials - Railway uses Variables)
- .DS_Store ❌ (Mac system files)
- Log files ❌
- Build artifacts ❌

## Total Size

Your uploaded code should be < 10 MB (GitHub has no real limit for public repos).

If too large:
- Compress large audio/video files
- Use external CDN for media
- Remove unnecessary dependencies

## You're All Set! 🎉

Your code is now:
- ✅ On GitHub
- ✅ Version controlled
- ✅ Ready for Railway deployment
- ✅ Shareable with team

Next: Deploy to Railway using DEPLOY_TO_RAILWAY.md

---

**Questions?**
- GitHub Docs: https://docs.github.com
- Git Cheat Sheet: https://github.com/joshnh/Git-Commands

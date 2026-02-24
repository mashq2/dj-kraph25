# 🚀 DJ Kraph Launch - Step by Step

**Goal:** Get your site live on Railway in 15 minutes

---

## Step 1: Install Git (If Needed)

**Copy & Paste This in PowerShell:**

```powershell
winget install Git.Git
```

Then close PowerShell and **reopen a new one** so Git is recognized.

Verify installation:
```powershell
git --version
```

You should see: `git version 2.x.x...`

---

## Step 2: Initialize Git in Your Project

**Open PowerShell in your project folder** (`C:\Users\Bella\Downloads\dj`)

**Run these commands one by one:**

### 2a - Initialize Git
```powershell
git init
```
**Expected output:** `Initialized empty Git repository in C:\Users\Bella\Downloads\dj\.git\`

### 2b - Configure Git (First Time Only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### 2c - Add All Files
```powershell
git add .
```

### 2d - Commit Files
```powershell
git commit -m "Initial commit: DJ Kraph music platform with M-Pesa payments"
```

**Expected output:**
```
[main (root-commit) ...] Initial commit: ...
 XX files changed, YYYY insertions(+)
```

---

## Step 3: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Fill in:**
   - **Repository name:** `dj-kraph`
   - **Description:** DJ Kraph - Music Streaming with M-Pesa Payments
   - **Visibility:** Public ✓
   - **Do NOT check** "Initialize with README"
3. **Click:** "Create repository"

**You'll see a page with commands. IGNORE IT.**

---

## Step 4: Connect to GitHub & Push

**Back in PowerShell, run these commands:**

### 4a - Set Remote URL
Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
```

### 4b - Rename Branch (if needed)
```powershell
git branch -M main
```

### 4c - Push to GitHub
```powershell
git push -u origin main
```

**It might ask you to login:**
- Click the link that appears
- Or enter your GitHub credentials
- Authenticate when prompted

**Expected output:**
```
Counting objects: ...
Compressing objects: ...
Writing objects: ...
[new branch] main -> main
```

---

## Step 5: Verify on GitHub

1. **Go to:** https://github.com/YOUR_USERNAME/dj-kraph
2. **You should see:**
   - ✅ All your HTML files
   - ✅ CSS folder
   - ✅ JS folder
   - ✅ server.js
   - ✅ package.json
   - ✅ .env.example

3. **Should NOT see:**
   - ❌ node_modules/
   - ❌ .env (raw file)

---

## Step 6: Deploy to Railway

1. **Go to:** https://railway.app
2. **Click:** "Sign up"
3. **Select:** "Continue with GitHub"
4. **Authorize** Railway to access your GitHub
5. **Click:** "New Project"
6. **Select:** "Deploy from GitHub repo"
7. **Choose:** `dj-kraph` repository
8. **Wait** for build to complete (2-3 minutes)

---

## Step 7: Set Environment Variables

Once deployed, Railway shows your project dashboard:

1. **Click:** "Variables" (or "Add Variable")
2. **Add each variable below:**

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MPESA_CONSUMER_KEY` | `iaswGJl5jFfQNPupmRMAhAghz0Lsr0hUtEeOk8vNXJ4v8wfE` |
| `MPESA_CONSUMER_SECRET` | `9paP8RF3Bku46LDAnZVOGqCrdKcJdzUTTifgZGjQ0DVx1M9igoPceAFPOlO0dCSE` |
| `MPESA_BUSINESS_SHORTCODE` | `174379` |
| `MPESA_PASSKEY` | `bfb279f9aa9bdbcf158e97dd1a6c6f88` |
| `FRONTEND_URL` | Get from Railway URL (see below) |
| `CALLBACK_URL` | Same as FRONTEND_URL + `/mpesa/callback` |

**How to get FRONTEND_URL:**
- In Railway dashboard, click "Deployments"
- Look for the "Public URL"
- Looks like: `https://dj-kraph-XXXX.up.railway.app`
- Use that for FRONTEND_URL

---

## Step 8: Your Site is LIVE! 🎉

Your site is now accessible at:

```
https://dj-kraph-XXXX.up.railway.app
```

**Share this URL with anyone!**

---

## Testing Your Live Site

### Quick Checks:
1. **Homepage loads?** ✅
2. **Navigation works?** ✅
3. **Mobile view responsive?** ✅
4. **Cart works?** ✅
5. **M-Pesa payment form appears?** ✅

### Test Payment (Sandbox):
1. Go to your site URL
2. Click "Explore Mixes" (or add a mix in admin)
3. Add to cart
4. Go to checkout
5. Select M-Pesa
6. Enter phone: `0708374149`
7. Enter amount: `100`
8. Click "Pay Now"
9. Should see STK push initiated ✅

---

## Update Your Code Later

Once live, anytime you make changes:

```powershell
cd C:\Users\Bella\Downloads\dj
git add .
git commit -m "Your update description"
git push origin main
```

**Railway auto-deploys** in 1-2 minutes! 🚀

---

## Troubleshooting

### "git command not found"
- **Fix:** Close PowerShell and reopen a new one after Git installation

### "fatal: remote origin already exists"
- **Fix:** 
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
```

### Build fails on Railway
- Check Railways Logs tab (Deployments → Logs)
- Usually means missing environment variable
- Add any missing variables

### Site shows 502 Error
- **Problem:** Server didn't start
- **Check:** Are all environment variables set?
- **Fix:** Restart deployment in Railway dashboard

### M-Pesa not working live
- **Check:** FRONTEND_URL in variables matches public URL
- **Check:** CALLBACK_URL is complete
- **Verify:** Credentials are correct

---

## Common Questions

**Q: Can I use custom domain?**
A: Yes! In Railway, go to Settings and add your custom domain

**Q: Is it really free?**
A: Yes! Railway free tier covers small apps. You get $5 credit monthly

**Q: How do I monitor my site?**
A: Railway dashboard shows logs, memory, CPU, performance

**Q: Can I add database?**
A: Yes! Railway has PostgreSQL, MongoDB plugins

**Q: Will my site go down?**
A: No, unless it runs out of free tier resources (unlikely for small usage)

---

## You're All Set! 🎵

Your DJ Kraph site is now:
- ✅ Version controlled on GitHub
- ✅ Live on Railway
- ✅ Accessible worldwide
- ✅ Accepting M-Pesa payments
- ✅ Auto-updating with git push

**Share your public URL and start getting users!** 🌍

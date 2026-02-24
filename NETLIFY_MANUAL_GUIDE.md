# DJ Kraph → Netlify Deployment - Complete Manual Guide

**Goal:** Deploy your DJ Kraph site to Netlify (free, fast, global)

---

## ⚠️ Important: You Need to Do These Steps Manually

Since Git needs to be installed, here's the complete walkthrough:

---

## STEP 1️⃣: Create GitHub Account (If You Don't Have One)

1. **Go to:** https://github.com/signup
2. **Enter:**
   - Email address
   - Password
   - Username (e.g., `djkraph-bella`)
3. **Verify** your email
4. **Done!** ✅

---

## STEP 2️⃣: Open PowerShell in Your Project Folder

1. **Open** File Explorer
2. **Navigate to:** `C:\Users\Bella\Downloads\dj`
3. **Right-click** in empty space
4. **Select:** "Open PowerShell window here"

You should see:
```
PS C:\Users\Bella\Downloads\dj>
```

---

## STEP 3️⃣: Install & Configure Git

**In PowerShell, run these commands one at a time:**

### 3a - Check if Git is installed
```powershell
git --version
```

**If it says version number, skip to STEP 4!**

If not, install using Chocolatey:

### 3b - Install Git via Chocolatey
```powershell
choco install git -y
```

Close and reopen PowerShell, then verify:
```powershell
git --version
```

You should see: `git version 2.x.x`

### 3c - Configure Git (First Time Only)
```powershell
git config --global user.name "Your Name Here"
git config --global user.email "your.email@gmail.com"
```

---

## STEP 4️⃣: Initialize Git Repository

**Still in PowerShell, run:**

```powershell
git init
```

**Expected output:**
```
Initialized empty Git repository in C:\Users\Bella\Downloads\dj\.git\
```

---

## STEP 5️⃣: Add All Files to Git

```powershell
git add .
```

**No output = success!** ✅

---

## STEP 6️⃣: Create First Commit

```powershell
git commit -m "Initial DJ Kraph commit: Music streaming platform with M-Pesa payments"
```

**Expected output:**
```
[main (root-commit) abc1234] Initial DJ Kraph commit...
 XX files changed, YYYY insertions(+)
```

---

## STEP 7️⃣: Create GitHub Repository

1. **Open browser** → https://github.com/new
2. **Fill in:**
   - **Repository name:** `dj-kraph`
   - **Description:** DJ Kraph - Music Streaming with M-Pesa Payments
   - **Visibility:** Select "Public" ✓
   - **Do NOT check:** "Initialize this repository with..."
3. **Click:** "Create repository"

You'll see a page with commands. **Scroll down** and look for:
```
…or push an existing repository from the command line
```

It should show:
```
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
git branch -M main
git push -u origin main
```

**Copy these commands** (or just follow below)

---

## STEP 8️⃣: Connect to GitHub & Push Code

**Back in PowerShell, run these commands:**

### 8a - Add Remote
Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
```

### 8b - Rename Branch (if needed)
```powershell
git branch -M main
```

### 8c - Push to GitHub
```powershell
git push -u origin main
```

**It will ask for authentication:**
- GitHub opens a browser window
- Click **"Authorize GitCredentialManager"**
- Or enter your GitHub username and password
- For password, use a **Personal Access Token** (GitHub → Settings → Developer Settings → Personal Access Tokens)

**Expected output:**
```
Counting objects: 100%, done.
Writing objects: 100%, done.
[new branch] main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## STEP 9️⃣: Verify on GitHub

1. **Go to:** https://github.com/YOUR_USERNAME/dj-kraph
2. **You should see:**
   - ✅ All HTML files (index.html, pay.html, cart.html, etc.)
   - ✅ CSS folder with style.css
   - ✅ JS folder with all JavaScript files
   - ✅ server.js
   - ✅ package.json
   - ✅ netlify.toml
   - ✅ netlify/functions folder

3. **Should NOT see:**
   - ❌ node_modules/ (too large)
   - ❌ Raw .env file (it's hidden)

**Perfect!** ✅

---

## STEP 🔟: Deploy to Netlify

### 10a - Sign Up
1. **Go to:** https://www.netlify.com
2. **Click:** "Sign up"
3. **Choose:** "Continue with GitHub"
4. **Authorize** Netlify to access your GitHub repositories

### 10b - Import Project
1. **Click:** "Import an existing project"
2. **Select:** "GitHub"
3. **Find** `dj-kraph` in the list
4. **Click** on it

### 10c - Configure Build Settings
Netlify shows:
- **Base directory:** Leave empty ✓
- **Build command:** `npm install` ✓
- **Publish directory:** `.` (current directory) ✓
- **Functions directory:** `netlify/functions` ✓

**Everything should be pre-filled!** Just verify and continue.

### 10d - Deploy
**Click:** "Deploy site"

**Wait 2-3 minutes** for the build to complete.

You'll see a screen like:
```
🎉 Your site is live!
Site URL: https://dj-kraph-abc123.netlify.app
```

---

## STEP 1️⃣1️⃣: Add Environment Variables

Once deployed:

1. **In Netlify dashboard**, go to:
   - **Site settings** → **Build & deploy** → **Environment**

2. **Click:** "Edit variables"

3. **Add each variable:**

| Variable Name | Value |
|---|---|
| `MPESA_CONSUMER_KEY` | `iaswGJl5jFfQNPupmRMAhAghz0Lsr0hUtEeOk8vNXJ4v8wfE` |
| `MPESA_CONSUMER_SECRET` | `9paP8RF3Bku46LDAnZVOGqCrdKcJdzUTTifgZGjQ0DVx1M9igoPceAFPOlO0dCSE` |
| `MPESA_BUSINESS_SHORTCODE` | `174379` |
| `MPESA_PASSKEY` | `bfb279f9aa9bdbcf158e97dd1a6c6f88` |
| `CALLBACK_URL` | `https://YOUR-SITE.netlify.app/netlify/functions/callback` |

**Note:** Replace `YOUR-SITE` with your actual Netlify site name (see Step 10d)

4. **Click:** "Save"

5. **Go to Deployments tab** and **trigger a redeploy** (so new variables take effect)

---

## STEP 1️⃣2️⃣: Update Frontend Code (IMPORTANT!)

Your frontend still has old API endpoints. Update them:

1. **Open:** `js/mpesaPaymentManager.js`
2. **Find these lines:**

```javascript
const stkPushUrl = `${FRONTEND_URL}/stkpush`;
const statusUrl = `${FRONTEND_URL}/stkpush/status`;
```

3. **Replace with:**

```javascript
const stkPushUrl = `/.netlify/functions/stkpush`;
const statusUrl = `/.netlify/functions/check-status`;
```

4. **Save the file**

5. **Push to GitHub:**

```powershell
cd C:\Users\Bella\Downloads\dj
git add js/mpesaPaymentManager.js
git commit -m "Update API endpoints for Netlify functions"
git push origin main
```

Netlify **auto-redeploys** in 1-2 minutes! 🚀

---

## 🎉 YOU'RE LIVE!

Your DJ Kraph site is now accessible at:

```
https://YOUR-SITE.netlify.app
```

**Share this URL with anyone!** 🌍

---

## Test Your Site

1. **Visit:** https://YOUR-SITE.netlify.app
2. **Check:**
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Search/filter works
   - ✅ Mobile view looks good
   - ✅ Add to cart works
   - ✅ Checkout page loads
   - ✅ M-Pesa payment form appears

---

## Update Your Code Later

Whenever you make changes:

```powershell
cd C:\Users\Bella\Downloads\dj
git add .
git commit -m "Your change description"
git push origin main
```

**Netlify auto-deploys!** ⚡

---

## Troubleshooting

### "git command not found"
- Make sure Git is installed and PowerShell is restarted

### "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
git push -u origin main
```

### Site shows blank page
- Check Netlify Deployments tab for build errors
- Clear browser cache (Ctrl+Shift+Delete)

### M-Pesa not working
- Verify environment variables are set in Netlify
- Check you updated mpesaPaymentManager.js
- Look at Netlify function logs for errors

### Build fails
- Check Netlify deploy logs
- Make sure package.json is correct
- Verify netlify.toml exists

---

## Questions?

Check these files in your project:
- **NETLIFY_DEPLOYMENT.md** - More details
- **netlify.toml** - Build configuration
- **netlify/functions/** - M-Pesa API functions

---

## Summary

✅ Code on GitHub  
✅ Deployed on Netlify  
✅ M-Pesa integrated  
✅ Environment variables set  
✅ Live on the internet  

**Your DJ Kraph site is now a real, live website!** 🎵🚀

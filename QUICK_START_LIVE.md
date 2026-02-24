# 🚀 DJ Kraph Go Live in 5 Minutes

Quick checklist to get your site public on Railway.

## ⚡ Super Quick Path (5 minutes)

### 1️⃣ GitHub (1 min)
```bash
cd c:\Users\Bella\Downloads\dj
git init
git add .
git commit -m "Initial"
# Then push to: https://github.com/YOUR_USERNAME/dj-kraph
```

### 2️⃣ Railway (2 mins)
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub → Select dj-kraph
4. Wait for build to complete

### 3️⃣ Set Variables (1 min)
In Railway dashboard, add these:
```
NODE_ENV=production
MPESA_CONSUMER_KEY=iaswGJl5jFfQNPupmRMAhAghz0Lsr0hUtEeOk8vNXJ4v8wfE
MPESA_CONSUMER_SECRET=9paP8RF3Bku46LDAnZVOGqCrdKcJdzUTTifgZGjQ0DVx1M9igoPceAFPOlO0dCSE
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a6c6f88
FRONTEND_URL=https://YOUR-PROJECT.up.railway.app
CALLBACK_URL=https://YOUR-PROJECT.up.railway.app/mpesa/callback
```

### 4️⃣ Go Live! (1 min)
- Click the public URL
- 🎉 You're live!

## Your Public URL
```
https://YOUR-PROJECT.up.railway.app
```

**Share this anywhere!**

---

## Need More Details?

- **GitHub Setup:** See GITHUB_SETUP.md
- **Railway Deployment:** See DEPLOY_TO_RAILWAY.md
- **Pre-Launch Checklist:** See LIVE_DEPLOYMENT_CHECKLIST.md

---

**That's it! Your site is now live for everyone to access worldwide.** 🌍🎵

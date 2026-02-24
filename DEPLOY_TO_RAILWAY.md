# Deploy DJ Kraph to Railway 🚀

Railway is a modern hosting platform that's free and perfect for full-stack applications. This guide will have you live in 5 minutes.

## Step 1: Create Git Repository (2 minutes)

Open terminal in your project directory:
```bash
git init
git add .
git commit -m "Initial DJ Kraph commit"
```

## Step 2: Sign Up & Connect Railway

1. **Go to** https://railway.app
2. **Sign up** with GitHub (easiest option)
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Authorize** Railway to access your GitHub
6. **Create new GitHub repo** or connect existing one

## Step 3: Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy on Railway

Railway will **automatically detect** your Node.js project and deploy it.

### Set Environment Variables in Railway Dashboard:

1. **Go to** your Railway project
2. **Click** "Variables"
3. **Add these variables:**

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://YOUR-PROJECT.up.railway.app
MPESA_CONSUMER_KEY=YOUR_KEY_HERE
MPESA_CONSUMER_SECRET=YOUR_SECRET_HERE
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a6c6f88
CALLBACK_URL=https://YOUR-PROJECT.up.railway.app/mpesa/callback
```

**Note:** Replace `YOUR-PROJECT` with your Railway project name and add your actual M-Pesa credentials.

## Step 5: Verify Deployment

1. **Go to** Deployments tab
2. **Wait** for build to complete (2-3 minutes)
3. **Click** the "Public URL" link
4. **Visit** your live site! 🎉

### Your Site Will Be Live At:
```
https://YOUR-PROJECT.up.railway.app
```

## Common Issues & Solutions

### Build Fails
- **Error:** "Cannot find module 'express'"
- **Fix:** Check that `package.json` has all dependencies listed
- **Verify:** Run `npm install` locally first

### M-Pesa Not Working
- **Problem:** "Invalid credentials"
- **Fix:** Double-check your credentials in Railway Variables
- **Test:** Use sandbox phone: `0708374149`, amount: `100`

### Port Binding Error
- **Problem:** "Address already in use"
- **Fix:** Railway automatically assigns PORT env variable - server.js must use `process.env.PORT`
- **Check:** Verify line in server.js: `const port = process.env.PORT || 3001;`

### CORS Issues on Live Site
- **Problem:** Frontend can't reach backend API
- **Fix:** Update `FRONTEND_URL` in Railway Variables to match your public URL
- **Also:** Update M-Pesa `CALLBACK_URL` to your public URL

### Database Errors
- **If you add MongoDB later:**
  - Create free cluster at https://www.mongodb.com/cloud/atlas
  - Get connection string
  - Add to Railway Variables as `MONGODB_URI`

## Scaling Up (When You Grow)

Railway's free tier includes:
- **5 GB RAM** (per month total)
- **Unlimited bandwidth**
- **$5 credit** monthly (covers small apps)

When you exceed free tier, pay-as-you-go starts at **$0.50/hour** active usage.

### Upgrade Options:
1. **Pro Plan:** Fixed monthly fee for better performance
2. **Add PostgreSQL/MongoDB:** From Railway plugins
3. **Custom Domain:** Point your domain to Railway URL

## Monitoring Your App

Railway Dashboard shows:
- **Logs:** Real-time server output
- **Deployments:** Version history
- **Metrics:** CPU, memory, response times
- **Analytics:** Traffic and usage stats

## Update Your Code

When you make changes locally:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Railway automatically redeploys on `git push`! 🚀

## Get Your Public URL

Once deployed, share this URL with everyone:
```
https://YOUR-PROJECT.up.railway.app
```

That's it! Your DJ Kraph site is now live for the world to access! 🎵

## Need Help?

- **Railway Docs:** https://docs.railway.app
- **Issues:** Check Railway Logs tab for errors
- **Discord:** Railway community at discord.gg/railway

---

**You're all set!** Your M-Pesa music store is now live and accessible worldwide. 🌍🎵

# Deploy DJ Kraph to Netlify 🚀

Netlify is perfect for your DJ Kraph site! It's free, fast, and has built-in serverless functions for M-Pesa.

## Step 1: Connect Your GitHub Repo

You need your code on GitHub first. If you haven't done this:

1. Go to https://github.com/new
2. Create repo named `dj-kraph`
3. Run in PowerShell:

```powershell
cd C:\Users\Bella\Downloads\dj
git init
git add .
git commit -m "Initial DJ Kraph commit"
git remote add origin https://github.com/YOUR_USERNAME/dj-kraph.git
git branch -M main
git push -u origin main
```

---

## Step 2: Sign Up on Netlify

1. Go to https://www.netlify.com
2. Click "Sign up"
3. Choose "GitHub"
4. Authorize Netlify to access your GitHub account

---

## Step 3: Create New Site

1. Click "Import an existing project"
2. Select GitHub
3. Look for `dj-kraph` repository
4. Click on it

---

## Step 4: Configure Build Settings

Netlify will auto-detect settings. Just verify:

- **Base directory:** (leave empty)
- **Build command:** `npm install`
- **Publish directory:** `.` (current directory - your HTML files)
- **Functions directory:** `netlify/functions`

**Click "Deploy site"** ✅

---

## Step 5: Set Environment Variables

While deploying, go to:
1. **Site settings** → **Build & deploy** → **Environment**
2. **Edit variables**
3. Add these:

| Variable | Value |
|----------|-------|
| `MPESA_CONSUMER_KEY` | Your key |
| `MPESA_CONSUMER_SECRET` | Your secret |
| `MPESA_BUSINESS_SHORTCODE` | `174379` |
| `MPESA_PASSKEY` | `bfb279f9aa9bdbcf158e97dd1a6c6f88` |
| `CALLBACK_URL` | `https://YOUR-SITE.netlify.app/netlify/functions/callback` |

---

## Step 6: Update Your Frontend Code

Update `js/mpesaPaymentManager.js` to use Netlify functions:

Change these API endpoints:

```javascript
// OLD (for Express server)
const stkPushUrl = `${FRONTEND_URL}/stkpush`;
const statusUrl = `${FRONTEND_URL}/stkpush/status`;

// NEW (for Netlify)
const stkPushUrl = `/.netlify/functions/stkpush`;
const statusUrl = `/.netlify/functions/check-status`;
```

---

## Step 7: Your Site is LIVE! 🎉

Your site will be at:
```
https://YOUR-SITE-NAME.netlify.app
```

Netlify will auto-generate a name or you can set custom domain.

---

## How It Works

```
Your HTML Files (Static)
        ↓
    Netlify CDN (Fast Global Delivery)
        ↓
    M-Pesa Serverless Functions
        ↓
    Safaricom M-Pesa API
        ↓
    Payment Complete ✅
```

---

## Advantages of Netlify

✅ **Free tier** - Generous limits  
✅ **Global CDN** - Your site loads fast everywhere  
✅ **Git auto-deploy** - Push to GitHub → Auto-deploys in 1 min  
✅ **Serverless functions** - No server to manage  
✅ **HTTPS by default** - Secure connection  
✅ **Environment variables** - Safe credential storage  

---

## Update Your Code

After deployment, whenever you make changes:

```powershell
cd C:\Users\Bella\Downloads\dj
git add .
git commit -m "Update description"
git push origin main
```

**Netlify auto-deploys** in 1-2 minutes! 🚀

---

## Custom Domain

To use custom domain (optional):

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Point your domain's DNS to Netlify
4. Get free SSL certificate automatically

---

## Monitoring

**Netlify Dashboard shows:**
- Build logs
- Deploy history
- Site performance
- Function invocations
- Errors and warnings

---

## Troubleshooting

### Site shows blank page
- Check "Deploys" tab for build errors
- Verify all files uploaded
- Clear browser cache (Ctrl+Shift+Del)

### M-Pesa function errors
- Check environment variables are set
- Look at function logs in Netlify
- Verify credentials are correct

### 404 errors on pages
- netlify.toml has redirect rules
- Should work automatically

### Slow performance
- Netlify CDN is fast
- Check if issue is on Safaricom side

---

## Files I Created for You

✅ `netlify.toml` - Configuration file  
✅ `netlify/functions/stkpush.js` - Payment initiation endpoint  
✅ `netlify/functions/check-status.js` - Payment status check  

These handle your M-Pesa integration as serverless functions!

---

**Your DJ Kraph site is now ready for Netlify deployment!** 🎵🚀

Need help? Let me know!

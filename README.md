# DJ Kraph 🎵

> Modern mixtapes hub — DJ mixes, M-Pesa STK Push payments, admin dashboard, resume page.

---

## 🚀 Get Your Live HTTPS URL (2 minutes)

Your site is configured for **Netlify** — the fastest zero-config option.

### Step 1 — Merge the PR
On GitHub, open the **Pull Request** for this branch and click **"Merge pull request"**.  
This puts the latest code on the `main` branch so Netlify auto-deploys it.

### Step 2 — Deploy to Netlify
1. Go to **[app.netlify.com](https://app.netlify.com)** and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → select **`mashq2/dj-kraph25`**
4. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm install`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Click **"Deploy site"** ✅

Netlify gives you an instant HTTPS URL like:  
**`https://dj-kraph25.netlify.app`** (or a random name you can rename)

---

## 🔐 Required Environment Variables

After deploying, go to **Site Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `MPESA_CONSUMER_KEY` | From [developer.safaricom.co.ke](https://developer.safaricom.co.ke) |
| `MPESA_CONSUMER_SECRET` | From Safaricom developer portal |
| `MPESA_BUSINESS_SHORTCODE` | Your M-Pesa business shortcode (sandbox: `174379`) |
| `MPESA_PASSKEY` | Your M-Pesa passkey |
| `CALLBACK_URL` | `https://YOUR-SITE.netlify.app/mpesa/callback` |
| `NODE_ENV` | `production` |

> **Then redeploy** (Deploys → Trigger deploy → Deploy site) so the new variables take effect.

---

## 🔑 Admin Access

The **admin account** that can add/delete mixes uses:

- **Email:** `admin@djkraph.com`
- **Password:** *(set by signing up with that email on your live site)*

Only this account sees the "+ Add Mix" button and can access `/admin.html`.

---

## 📄 Pages

| URL | Page |
|---|---|
| `/` | Home — mix grid, charts, reviews |
| `/resume.html` | DJ Kraph bio & resume |
| `/admin.html` | Admin dashboard (owner only) |
| `/cart.html` | Shopping cart |
| `/pay.html` | M-Pesa STK Push / PayBill / Stripe / PayPal checkout |
| `/confirmation.html` | Order confirmation |
| `/charts.html` | Trending charts |
| `/dashboard.html` | User dashboard |
| `/affiliate.html` | Affiliate programme |
| `/faq.html` | FAQ |
| `/login.html` | Login |
| `/signup.html` | Sign up |

---

## 🛠 Local Development

```bash
npm install
cp .env.example .env   # fill in your M-Pesa credentials
npm run dev            # starts server on http://localhost:3001
```

---

## 📱 M-Pesa STK Push Flow

1. Buyer clicks **Pay with M-Pesa STK** on `pay.html`
2. Enters Safaricom number (e.g. `0712345678`)
3. Receives STK prompt on phone → enters PIN
4. Server polls `/stkpush/status` → confirms → redirects to `confirmation.html`
5. M-Pesa sends callback to `CALLBACK_URL` for real-time confirmation

---

&copy; 2024 DJ Kraph. All rights reserved.

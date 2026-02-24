# DJ Kraph - Mix Upload & Cart System Guide

## ✅ FIXED ISSUES

### 1. **Unlimited Mix Uploads**
The system now supports **UNLIMITED** mix uploads! 🎉

**What Changed:**
- ❌ OLD: Stored entire audio files in browser (5-10MB limit)
- ✅ NEW: Stores only metadata + URL references (no storage limit!)

### 2. **Cart System**
Every mix now has a working "Add to Cart" button that customers can use to purchase mixes.

---

## 🎵 HOW TO UPLOAD MIXES

### Option 1: Using Audio URL (RECOMMENDED)
1. Upload your audio file to a cloud service:
   - **YouTube** (use link)
   - **SoundCloud** (use link)
   - **Google Drive** (get shareable link)
   - **Dropbox** (get public link)
   - **Any file hosting service**

2. Go to **Admin Dashboard** (`admin.html`)
3. Fill in mix details:
   - Mix Title
   - **Audio URL** (paste your cloud link here)
   - Price
   - Other details (optional)
4. Click "🚀 Upload Mix"
5. ✨ Done! Mix added with no storage limits!

### Option 2: Using File Upload
1. Go to **Admin Dashboard**
2. Upload audio file directly
3. **Important:** You'll need to later add the cloud URL
4. Click "Edit" button on the mix
5. Add the cloud storage URL

---

## 🛒 HOW THE CART WORKS

### For Customers:
1. Browse mixes on the homepage
2. Click "🛒 Add to Cart" on any mix
3. Go to Cart page to review
4. Proceed to checkout
5. Choose payment method:
   - **M-Pesa STK Push** (automatic)
   - **M-Pesa PayBill** (manual)
     - Business: 247247
     - Account: 0799986497
   - **Credit/Debit Card** (Stripe)
   - **PayPal**

### For You (Admin):
- All mixes automatically have "Add to Cart" buttons
- Track sales through dashboard
- Manage mixes from admin panel

---

## 📊 ADMIN DASHBOARD FEATURES

- **Upload Unlimited Mixes** - No storage restrictions!
- **Edit Mixes** - Update audio URLs and details
- **Delete Mixes** - Remove old or unwanted mixes
- **View Total Mix Count** - See how many mixes you have
- **Quick Fill** - Auto-fill default values
- **Advanced Fields** - Add detailed info (BPM, tracklist, etc.)

---

## 💡 BEST PRACTICES

### Storage Tips:
✅ **USE** audio URLs (YouTube, SoundCloud, Drive)
❌ **AVOID** uploading large files directly (old method)

### Pricing:
- Default: KSh 600
- Adjust based on mix length/quality
- Premium mixes: KSh 800-1000+

### Audio URLs:
**YouTube:**
- Upload to YouTube
- Use video URL: `https://youtube.com/watch?v=...`

**Google Drive:**
1. Upload file to Drive
2. Right-click → Get Link
3. Set to "Anyone with link can view"
4. Use that link

**SoundCloud:**
- Upload track
- Use track URL

---

## 🔄 MIGRATION GUIDE

If you have old mixes with stored files:
1. They will show "⚠ Needs Audio URL" status
2. Click "Edit" on each mix
3. Add cloud storage URL
4. Save

---

## 🎯 QUICK START

### Add Your First Mix:
1. Upload audio to YouTube/SoundCloud
2. Copy the URL
3. Go to Admin Dashboard
4. Fill in:
   ```
   Title: "My Awesome Mix"
   Audio URL: [paste URL]
   Price: 600
   ```
5. Click Upload
6. Check homepage - mix appears!
7. Test "Add to Cart" button
8. Done! ✅

---

## 🐛 TROUBLESHOOTING

**Problem:** Can't upload more mixes
**Solution:** Use Audio URL instead of file upload

**Problem:** "Add to Cart" not working
**Solution:** Refresh page, cart should work now

**Problem:** Mix doesn't play
**Solution:** Check if audio URL is valid and accessible

**Problem:** Cart count not updating
**Solution:** Click "Add to Cart" again or refresh page

---

## 📱 PAYMENT DETAILS

### M-Pesa PayBill:
- **Business Number:** 247247
- **Account Number:** 0799986497
- **Confirmation:** Send M-Pesa SMS to 0799986497

### Testing Payments:
- Use test mode for Stripe/PayPal
- M-Pesa demo mode shows simulation

---

## 🚀 NEXT STEPS

1. ✅ Upload your mixes using URLs
2. ✅ Test cart functionality
3. ✅ Share your site with customers
4. ✅ Start selling! 💰

Need help? Check FAQ page or contact support.

---

**Built with ❤️ for DJ Kraph**

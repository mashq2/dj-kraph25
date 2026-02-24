# M-Pesa Integration - Quick Reference Card

## 🚀 Setup (First Time)

```bash
# 1. Run setup script
setup.bat

# 2. Edit .env with M-Pesa credentials from https://developer.safaricom.co.ke/
MPESA_CONSUMER_KEY=xxx
MPESA_CONSUMER_SECRET=xxx

# 3. Start server
npm run dev
```

## 🎮 Run Commands

```bash
npm run dev      # Development (with auto-reload)
npm start        # Production
npm install      # Install dependencies
```

## 📍 Server URL
```
http://localhost:3001
```

## 🧪 Test Phone Number (Sandbox)
```
0708374149
```

## 📱 API Endpoints

### Initiate STK Push
```
POST /stkpush

{
  "phone": "0708374149",
  "amount": 100,
  "description": "DJ Kraph Checkout",
  "accountReference": "CART_12345"
}

Response:
{
  "success": true,
  "checkoutRequestId": "1741234567890"
}
```

### Check Payment Status
```
POST /stkpush/status

{
  "checkoutRequestId": "1741234567890"
}

Response:
{
  "success": true,
  "status": "completed",
  "transaction_id": "MpesaReceiptNumber"
}
```

### Health Check
```
GET /health

Response:
{
  "status": "ok",
  "service": "DJ Kraph M-Pesa Payment Server"
}
```

## 🔧 .env Configuration

```env
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# M-Pesa (from https://developer.safaricom.co.ke/)
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_BUSINESS_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a6c6f88

# Callback (for webhooks)
CALLBACK_URL=https://your-domain.com/mpesa/callback
```

## 📊 Payment Flow

```
User enters phone & amount
          ↓
POST /stkpush
          ↓
Server validates & calls M-Pesa API
          ↓
Returns checkoutRequestId
          ↓
Frontend receives prompt
          ↓
POST /stkpush/status (every 3 seconds)
          ↓
User enters PIN
          ↓
Status: "completed"
          ↓
Show confirmation page
```

## ✅ Frontend Files (Already Complete)

- `pay.html` - M-Pesa payment form
- `js/mpesaPaymentManager.js` - Payment logic
- `js/cartManager.js` - Cart integration
- `confirmation.html` - Receipt display

## 🔐 Credentials Sandbox/Dev

```
Business Code: 174379
PIN: 12345
Test Phone: 0708374149
Min Amount: 1 KES
Max Amount: 150,000 KES
```

## 📱 Phone Format

Both work:
- `0708374149` → Auto-converts to `254708374149`
- `254708374149` → Used as-is

## ⏱️ Timeouts & Limits

- Payment prompt appears: ~5 seconds
- Frontend polling timeout: 2 minutes
- OAuth token valid: 1 hour
- Transaction cache: 2 minutes

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Change `PORT` in .env |
| OAuth error | Check M-Pesa credentials |
| Phone rejected | Use format 254XXXXXXXXX |
| Amount invalid | Must be 1-150,000 |
| Module not found | Run `npm install` |
| STK not on phone | Try test number 0708374149 |

## 📚 Documentation

- `M-PESA_SERVER_SETUP.md` - Full setup guide
- `MPESA_INTEGRATION_GUIDE.md` - Backend specs
- `IMPLEMENTATION_COMPLETE.md` - Overview

## 🎯 Next Steps

1. Run `setup.bat`
2. Get M-Pesa credentials
3. Add to `.env`
4. Run `npm run dev`
5. Test on `http://localhost:3000/pay.html`

## 💡 Pro Tips

✅ Always check server logs for detailed error messages
✅ Test with amount = 100 KES first
✅ Use test phone 0708374149 for development
✅ OAuth token is cached - don't worry about rate limits
✅ Transaction data persists for 2 minutes in memory

---

**Server Status:** Ready to run
**Frontend Integration:** Complete
**Backend Implementation:** Complete
**Database:** Optional (Memory for dev, MongoDB for prod)

🚀 **You're ready to go live!**

# M-Pesa STK Push Integration Guide - DJ Kraph

This document explains how to integrate the M-Pesa STK Push payment system with your DJ Kraph checkout flow.

## Overview

The frontend is now fully configured to handle M-Pesa STK Push payments. Your backend needs to:

1. **Initiate STK Push** (`/stkpush` endpoint) - Send payment prompt to user's phone
2. **Check Payment Status** (`/stkpush/status` endpoint) - Poll for payment completion
3. **Handle Callbacks** (optional) - Receive real-time notifications from M-Pesa

## Frontend Integration Completed ✅

The following components have been set up:

### JavaScript Modules
- **`js/mpesaPaymentManager.js`** - Handles all M-Pesa interactions
  - `initiateSTKPush(phoneNumber, amount, metadata)` - Starts payment
  - `pollPaymentStatus(checkoutRequestId)` - Checks if payment is complete
  - `processPayment()` - Full payment flow
  - Phone validation and formatting (handles 254712345678 or 0712345678)

### Payment Flow
1. User enters M-Pesa phone number in cart checkout
2. Clicks "Pay with M-Pesa STK" button
3. Frontend calls `/stkpush` endpoint with:
   ```javascript
   {
     phone: "254712345678",         // Formatted international number
     amount: 15000,                 // Amount in KES
     description: "DJ Kraph - Cart Checkout",
     accountReference: "CART_1234567890",
     transactionType: "CustomerPayBillOnline",
     remark: "Payment for DJ Kraph premium mixes"
   }
   ```
4. User receives STK prompt on their phone
5. Frontend polls `/stkpush/status` every 3 seconds (40 attempts = 2 minutes timeout)
6. On success: Displays confirmation and redirects to `confirmation.html`
7. On failure: Shows error message and lets user retry

## Backend Implementation Required

### 1. STK Push Endpoint (`/stkpush`)

**Request:**
```json
{
  "phone": "254712345678",
  "amount": 15000,
  "description": "DJ Kraph - Cart Checkout",
  "accountReference": "CART_1234567890",
  "transactionType": "CustomerPayBillOnline",
  "remark": "Payment for DJ Kraph premium mixes"
}
```

**Response - Success:**
```json
{
  "success": true,
  "checkoutRequestId": "ws_CO_1234567890",
  "message": "STK push sent successfully"
}
```

**Response - Error:**
```json
{
  "success": false,
  "message": "Failed to initiate STK push"
}
```

### 2. Status Check Endpoint (`/stkpush/status`)

**Request:**
```json
{
  "checkoutRequestId": "ws_CO_1234567890"
}
```

**Response - Pending:**
```json
{
  "success": true,
  "status": "pending",
  "message": "Waiting for user to complete payment"
}
```

**Response - Completed:**
```json
{
  "success": true,
  "status": "completed",
  "transaction_id": "1234567890",
  "MpesaReceiptNumber": "LHH31TV4QV"
}
```

**Response - Failed:**
```json
{
  "success": false,
  "status": "failed",
  "message": "Payment was cancelled by user"
}
```

## Example Node.js/Express Implementation

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Configuration
const MPESA_CONFIG = {
  consumerKey: 'YOUR_CONSUMER_KEY',
  consumerSecret: 'YOUR_CONSUMER_SECRET',
  businessShortCode: '174379',
  partyA: '254708374149',  // Your M-Pesa Till/Business Number
  partyB: '254708374149',  // Same as partyA for C2B
  callbackURL: 'https://yourdomain.com/api/mpesa-callback',
  timestamp: null,
  password: null
};

// Get OAuth Token
async function getAccessToken() {
  try {
    const auth = Buffer.from(
      `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
}

// STK Push Endpoint
app.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, description, accountReference } = req.body;

    // Validate inputs
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Phone and amount are required'
      });
    }

    // Format phone (remove leading 0 if present)
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }

    const token = await getAccessToken();

    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);
    
    const password = Buffer.from(
      `${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.businessShortCode}${timestamp}`
    ).toString('base64');

    // M-Pesa API Request
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_CONFIG.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: req.body.transactionType || 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: MPESA_CONFIG.businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: MPESA_CONFIG.callbackURL,
        AccountReference: accountReference || 'DJKRAPH' + Date.now(),
        TransactionDesc: description || 'DJ Kraph Payment'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.ResponseCode === '0') {
      return res.json({
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        message: 'STK push sent successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.ResponseDescription || 'Failed to initiate STK push'
      });
    }
  } catch (error) {
    console.error('STK Push Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Status Check Endpoint
app.post('/stkpush/status', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Checkout request ID is required'
      });
    }

    const token = await getAccessToken();

    // Query M-Pesa for transaction status
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: MPESA_CONFIG.businessShortCode,
        Password: Buffer.from(
          `${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.businessShortCode}${new Date()
            .toISOString()
            .replace(/[^0-9]/g, '')
            .slice(0, -3)}`
        ).toString('base64'),
        Timestamp: new Date()
          .toISOString()
          .replace(/[^0-9]/g, '')
          .slice(0, -3),
        CheckoutRequestID: checkoutRequestId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = response.data;

    if (data.ResponseCode === '0') {
      return res.json({
        success: true,
        status: 'completed',
        transaction_id: data.MpesaReceiptNumber,
        MpesaReceiptNumber: data.MpesaReceiptNumber,
        amount: data.CallbackMetadata?.item_list?.[0]?.value || null
      });
    } else if (data.ResponseCode === '1032') {
      // Still pending
      return res.json({
        success: true,
        status: 'pending',
        message: 'Waiting for user to complete payment'
      });
    } else {
      return res.json({
        success: false,
        status: 'failed',
        message: data.ResponseDescription || 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Status Check Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Callback Handler (Optional - for webhook notifications)
app.post('/api/mpesa-callback', (req, res) => {
  try {
    const data = req.body.Body.stkCallback;

    if (data.ResultCode === 0) {
      // Payment successful
      const metadata = data.CallbackMetadata.Item;
      const result = {
        amount: metadata.find(x => x.Name === 'Amount')?.Value,
        mpesaCode: metadata.find(x => x.Name === 'MpesaReceiptNumber')?.Value,
        phone: metadata.find(x => x.Name === 'PhoneNumber')?.Value,
        date: metadata.find(x => x.Name === 'TransactionDate')?.Value
      };

      // Update order status in database
      console.log('Payment successful:', result);
    } else {
      // Payment failed or cancelled
      console.log('Payment failed:', data.ResultDesc);
    }

    res.json({
      ResultCode: 0,
      ResultDesc: 'Received successfully'
    });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Error processing callback'
    });
  }
});

app.listen(3000, () => {
  console.log('M-Pesa Integration Server running on port 3000');
});
```

## Production Setup

### Environment Variables
```bash
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa-callback
NODE_ENV=production
```

### Testing
1. Use M-Pesa sandbox credentials
2. Test with phone number: 254708374149
3. Wait for STK prompt (should appear within 5 seconds)
4. Use test PIN: 12345

### Going Live
1. Switch to production credentials
2. Update API endpoints (remove 'sandbox')
3. Add SSL/TLS certificate
4. Set up proper error logging
5. Implement database transaction recording
6. Enable webhook callbacks for real-time updates

## Frontend Configuration

### Cart Payment Flow
When user clicks "Proceed to Checkout":
```javascript
// Creates payment with cart data
{
  type: 'cart',
  trackName: '5 mixes - Love Songs + more',
  amount: 15000,  // Total KES amount
  items: [mix1, mix2, mix3, mix4, mix5]
}
```

### Phone Number Validation
The frontend automatically handles:
- `0712345678` → `254712345678`
- `+254712345678` → `254712345678`
- `254712345678` → `254712345678` (already correct)

## Security Considerations

1. **Validate all inputs** on backend
2. **Never log sensitive data** (phone, PIN)
3. **Use HTTPS** for all endpoints
4. **Verify M-Pesa signatures** in callbacks
5. **Rate limit** payment endpoints
6. **Store transactions** securely with hashing
7. **Implement idle timeout** for STK (2 minutes)

## Troubleshooting

### STK not appearing on phone
- Check phone number format (must be 254XXXXXXXXX)
- Verify phone has M-Pesa enabled
- Check M-Pesa balance requirements

### Payment marked as failed
- Check M-Pesa account balance
- Verify business shortcode
- Ensure callback URL is publicly accessible

### Timeout during payment
- Frontend times out after 2 minutes
- User can retry payment
- Transaction won't be duplicated (uses accountReference)

## Additional Resources

- [M-Pesa Developer Docs](https://developer.safaricom.co.ke/)
- [Sandbox Credentials](https://sandbox.safaricom.co.ke/)
- [Test Phone Numbers](https://developer.safaricom.co.ke/test-credentials)

## Support

For issues with the frontend integration, check:
1. Browser console for JavaScript errors
2. Network tab for API calls
3. M-Pesa sandbox dashboard for transaction logs

For issues with backend integration, verify:
1. API credentials are correct
2. Endpoints are properly formatted
3. CORS headers are set (if frontend is on different domain)
4. Callback URL is whitelisted in M-Pesa dashboard

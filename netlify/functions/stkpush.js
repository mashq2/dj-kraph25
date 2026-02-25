// Netlify Function: M-Pesa STK Push
const axios = require('axios');

// Cache for OAuth tokens
let cachedToken = {
  token: null,
  expiresAt: 0
};

// OAuth Token Generator
async function generateOAuthToken(consumerKey, consumerSecret) {
  const now = Date.now();
  
  if (cachedToken.token && now < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Basic ${auth}` },
      timeout: 10000
    });

    cachedToken.token = response.data.access_token;
    cachedToken.expiresAt = now + (response.data.expires_in * 1000 - 60000); // Refresh 1 min early

    return cachedToken.token;
  } catch (error) {
    console.error('❌ OAuth Token Error:', error.response?.data || error.message);
    throw new Error('Failed to generate M-Pesa token');
  }
}

// Format Phone Number
function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }

  if (!/^254[0-9]{9}$/.test(cleaned)) {
    throw new Error('Invalid phone number format. Use 0712345678 or 254712345678');
  }

  return cleaned;
}

// Generate M-Pesa Password
function generateMpesaPassword(businessShortcode, passkey, timestamp) {
  const crypto = require('crypto');
  const data = businessShortcode + passkey + timestamp;
  return Buffer.from(data).toString('base64');
}

// Main Handler
exports.handler = async (event) => {
  // CORS Headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { phone, amount } = JSON.parse(event.body || '{}');

    // Validation
    if (!phone) throw new Error('Phone number required');
    if (!amount) throw new Error('Amount required');

    const formattedPhone = formatPhoneNumber(phone);
    const amountInt = parseInt(amount);

    if (amountInt < 1 || amountInt > 150000) {
      throw new Error('Amount must be between 1 and 150,000 KES');
    }

    // Get credentials from environment
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const businessShortcode = process.env.MPESA_BUSINESS_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd1a6c6f88';
    const callbackUrl = process.env.CALLBACK_URL;

    if (!consumerKey || !consumerSecret) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'M-Pesa credentials not configured' })
      };
    }

    // Generate OAuth Token
    const token = await generateOAuthToken(consumerKey, consumerSecret);

    // Prepare STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = generateMpesaPassword(businessShortcode, passkey, timestamp);

    const stkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const stkPayload = {
      BusinessShortCode: businessShortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amountInt,
      PartyA: formattedPhone,
      PartyB: businessShortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'DJ-KRAPH-MIX',
      TransactionDesc: 'DJ Kraph Music Mix Purchase'
    };

    const response = await axios.post(stkPushUrl, stkPayload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const { CheckoutRequestID, ResponseCode } = response.data;

    if (ResponseCode === '0') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          checkoutRequestId: CheckoutRequestID,
          message: 'STK Push initiated. Check your phone for payment prompt.'
        })
      };
    } else {
      throw new Error(response.data.ResponseDescription || 'STK Push failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

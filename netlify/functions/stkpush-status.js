// Netlify Function: M-Pesa STK Push Status Query
const axios = require('axios');

let cachedToken = { token: null, expiresAt: 0 };

async function generateOAuthToken(consumerKey, consumerSecret) {
  const now = Date.now();
  if (cachedToken.token && now < cachedToken.expiresAt) return cachedToken.token;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const response = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 10000
  });

  cachedToken.token = response.data.access_token;
  cachedToken.expiresAt = now + (response.data.expires_in * 1000 - 60000);
  return cachedToken.token;
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };

  try {
    const { checkoutRequestId } = JSON.parse(event.body || '{}');
    if (!checkoutRequestId) throw new Error('checkoutRequestId required');

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const businessShortcode = process.env.MPESA_BUSINESS_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd1a6c6f88';

    if (!consumerKey || !consumerSecret) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'M-Pesa credentials not configured' }) };
    }

    const token = await generateOAuthToken(consumerKey, consumerSecret);
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
    const password = Buffer.from(businessShortcode + passkey + timestamp).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      { BusinessShortCode: businessShortcode, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 15000 }
    );

    const data = response.data;
    if (String(data.ResultCode) === '0') {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, status: 'completed', transaction_id: data.MpesaReceiptNumber, MpesaReceiptNumber: data.MpesaReceiptNumber })
      };
    } else if (data.ResultCode) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: false, status: 'failed', message: data.ResultDesc || 'Payment not completed' })
      };
    } else {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, status: 'pending', message: 'Waiting for payment' })
      };
    }
  } catch (error) {
    return {
      statusCode: 400, headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

// Netlify Function: M-Pesa Payment Status
const axios = require('axios');

// Get cached token (would be shared between functions in production)
async function generateOAuthToken(consumerKey, consumerSecret) {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Basic ${auth}` },
      timeout: 10000
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to generate M-Pesa token');
  }
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { checkoutRequestId } = JSON.parse(event.body || '{}');

    if (!checkoutRequestId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'CheckoutRequestID required' })
      };
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const businessShortcode = process.env.MPESA_BUSINESS_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd1a6c6f88';

    // Get Token
    const token = await generateOAuthToken(consumerKey, consumerSecret);

    // Query Status
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(businessShortcode + passkey + timestamp).toString('base64');

    const statusUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';
    const statusPayload = {
      BusinessShortCode: businessShortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const response = await axios.post(statusUrl, statusPayload, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 15000
    });

    const { ResultCode, ResultDesc } = response.data;
    const isSuccess = ResultCode === '0';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: isSuccess,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        message: isSuccess ? 'Payment successful!' : 'Payment pending or failed'
      })
    };

  } catch (error) {
    console.error('Status Check Error:', error.message);
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

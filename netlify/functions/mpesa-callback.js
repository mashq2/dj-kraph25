// Netlify Function: M-Pesa Callback Handler
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };

  try {
    const callbackData = JSON.parse(event.body || '{}');
    console.log('M-Pesa Callback:', JSON.stringify(callbackData));

    // Acknowledge receipt to Safaricom immediately
    const stkCallback = callbackData.Body?.stkCallback;
    if (stkCallback) {
      const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;
      if (String(ResultCode) === '0') {
        const items = CallbackMetadata?.Item || [];
        const receipt = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
        console.log(`Payment SUCCESS — ID: ${CheckoutRequestID}, Receipt: ${receipt}`);
      } else {
        console.log(`Payment FAILED — ID: ${CheckoutRequestID}, Code: ${ResultCode}`);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
    };
  } catch (error) {
    console.error('Callback error:', error.message);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
    };
  }
};

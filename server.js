/**
 * DJ Kraph - M-Pesa Payment Integration Server
 * Production-ready Express server with M-Pesa STK Push integration
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serve frontend files

// ==================== CONFIGURATION ====================

const MPESA_CONFIG = {
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
  BUSINESS_SHORTCODE: process.env.MPESA_BUSINESS_SHORTCODE || '174379',
  PASSKEY: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd1a6c6f88',
  OAUTH_URL: 'https://sandbox.safaricom.co.ke/oauth/v1/generate',
  STK_PUSH_URL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  QUERY_URL: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
  CALLBACK_URL: process.env.CALLBACK_URL || 'http://your-domain.com/mpesa/callback'
};

// In-memory cache for tokens and transactions (use Redis in production)
const tokenCache = {
  token: null,
  expiresAt: 0
};

const transactionStore = new Map(); // Production: use MongoDB

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate OAuth token for Safaricom M-Pesa
 * @returns {Promise<string>} Access token
 */
async function generateOAuthToken() {
  try {
    // Check if token is still valid
    if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
      return tokenCache.token;
    }

    const auth = Buffer.from(
      `${MPESA_CONFIG.CONSUMER_KEY}:${MPESA_CONFIG.CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(MPESA_CONFIG.OAUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    // Cache token for 55 minutes (expires in 60 minutes)
    tokenCache.token = response.data.access_token;
    tokenCache.expiresAt = Date.now() + (55 * 60 * 1000);

    console.log('✅ OAuth token generated successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ OAuth Token Generation Error:', error.message);
    throw new Error(`OAuth failed: ${error.message}`);
  }
}

/**
 * Format phone number to M-Pesa international format
 * @param {string} phone - Phone number (254712... or 0712...)
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, ''); // Remove non-digits
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
}

/**
 * Generate M-Pesa password (shortcode + passkey + timestamp)
 * @param {string} timestamp - Timestamp in format YYYYMMDDHHMMSS
 * @returns {string} Base64 encoded password
 */
function generateMpesaPassword(timestamp) {
  const str = MPESA_CONFIG.BUSINESS_SHORTCODE + MPESA_CONFIG.PASSKEY + timestamp;
  return Buffer.from(str).toString('base64');
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhoneNumber(phone) {
  const formatted = formatPhoneNumber(phone);
  return /^254[0-9]{9}$/.test(formatted);
}

/**
 * Validate amount
 * @param {number} amount - Amount in KES
 * @returns {boolean} True if valid
 */
function validateAmount(amount) {
  return amount >= 1 && amount <= 150000 && Number.isInteger(amount);
}

// ==================== ROUTES ====================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'DJ Kraph M-Pesa Payment Server'
  });
});

/**
 * Initiate M-Pesa STK Push
 * POST /stkpush
 */
app.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, description, accountReference, transactionType, remark } = req.body;

    // ========== VALIDATION ==========
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: '❌ Phone and amount are required'
      });
    }

    // Validate and format phone
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: '❌ Invalid phone number format. Use 254712345678 or 0712345678'
      });
    }

    // Validate amount
    if (!validateAmount(amount)) {
      return res.status(400).json({
        success: false,
        message: '❌ Amount must be between 1 and 150,000 KES'
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
    const checkoutRequestId = `${MPESA_CONFIG.BUSINESS_SHORTCODE}${timestamp}${uuidv4().substring(0, 8)}`;

    console.log(`\n📱 STK Push Request:`);
    console.log(`   Phone: ${formattedPhone}`);
    console.log(`   Amount: ${amount} KES`);
    console.log(`   Reference: ${accountReference}`);

    // ========== GENERATE OAUTH TOKEN ==========
    let accessToken;
    try {
      accessToken = await generateOAuthToken();
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: `❌ Could not authenticate with M-Pesa: ${error.message}`
      });
    }

    // ========== PREPARE STK PUSH PAYLOAD ==========
    const payload = {
      BusinessShortCode: MPESA_CONFIG.BUSINESS_SHORTCODE,
      Password: generateMpesaPassword(timestamp),
      Timestamp: timestamp,
      TransactionType: transactionType || 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.BUSINESS_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.CALLBACK_URL,
      AccountReference: accountReference || `DJKRAPH_${timestamp}`,
      TransactionDesc: description || 'DJ Kraph Music Purchase'
    };

    console.log(`\n📤 Sending to M-Pesa API...`);

    // ========== CALL M-PESA API ==========
    const stkResponse = await axios.post(MPESA_CONFIG.STK_PUSH_URL, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log(`✅ STK Push Response:`, stkResponse.data);

    // ========== STORE TRANSACTION ==========
    const transaction = {
      checkoutRequestId,
      phone: formattedPhone,
      amount,
      accountReference: payload.AccountReference,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minute timeout
      mpesaResponse: stkResponse.data,
      metadata: {
        description,
        remark,
        userAgent: req.get('user-agent')
      }
    };

    transactionStore.set(checkoutRequestId, transaction);

    // ========== RETURN SUCCESS ==========
    res.status(200).json({
      success: true,
      checkoutRequestId,
      message: 'STK push sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ STK Push Error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: '❌ M-Pesa authentication failed. Check credentials.'
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: `❌ STK Push failed: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Check M-Pesa STK Push Payment Status
 * POST /stkpush/status
 */
app.post('/stkpush/status', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Checkout request ID is required'
      });
    }

    // ========== CHECK LOCAL CACHE FIRST ==========
    const transaction = transactionStore.get(checkoutRequestId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // ========== CHECK IF EXPIRED ==========
    if (Date.now() > transaction.expiresAt) {
      transaction.status = 'expired';
      return res.status(400).json({
        success: false,
        status: 'expired',
        message: 'Payment timeout - please try again'
      });
    }

    // ========== IF ALREADY COMPLETED, RETURN CACHED RESULT ==========
    if (transaction.status === 'completed') {
      return res.status(200).json({
        success: true,
        status: 'completed',
        transaction_id: transaction.mpesaReceiptNumber,
        MpesaReceiptNumber: transaction.mpesaReceiptNumber,
        timestamp: transaction.completedAt
      });
    }

    // ========== GENERATE OAUTH TOKEN ==========
    let accessToken;
    try {
      accessToken = await generateOAuthToken();
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: 'Could not authenticate with M-Pesa'
      });
    }

    // ========== QUERY M-PESA API ==========
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);

    const queryPayload = {
      BusinessShortCode: MPESA_CONFIG.BUSINESS_SHORTCODE,
      Password: generateMpesaPassword(timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    console.log(`\n🔍 Querying payment status for: ${checkoutRequestId}`);

    const queryResponse = await axios.post(MPESA_CONFIG.QUERY_URL, queryPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log(`✅ Status Response:`, queryResponse.data);

    const responseData = queryResponse.data;

    // ========== HANDLE RESPONSE CODES ==========
    if (String(responseData.ResultCode) === '0') {
      // Success - Payment completed
      transaction.status = 'completed';
      transaction.mpesaReceiptNumber = responseData.MpesaReceiptNumber;
      transaction.completedAt = new Date();

      console.log(`✅ Payment Successful - Receipt: ${responseData.MpesaReceiptNumber}`);

      return res.status(200).json({
        success: true,
        status: 'completed',
        transaction_id: responseData.MpesaReceiptNumber,
        MpesaReceiptNumber: responseData.MpesaReceiptNumber,
        amount: responseData.Amount,
        timestamp: new Date().toISOString()
      });
    } else if (String(responseData.ResultCode) === '1050') {
      // Request failed (user cancelled, etc.)
      transaction.status = 'failed';
      transaction.failureReason = responseData.ResultDesc;

      console.log(`❌ Payment Failed: ${responseData.ResultDesc}`);

      return res.status(400).json({
        success: false,
        status: 'failed',
        message: responseData.ResultDesc || 'Payment was not completed'
      });
    } else {
      // Still pending
      return res.status(200).json({
        success: true,
        status: 'pending',
        message: 'Waiting for user to complete payment'
      });
    }

  } catch (error) {
    console.error('❌ Status Check Error:', error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: `Status check failed: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * M-Pesa Callback Handler (Optional - for real-time notifications)
 * POST /mpesa/callback
 */
app.post('/mpesa/callback', (req, res) => {
  try {
    const callbackData = req.body;
    console.log('\n📬 M-Pesa Callback Received:');
    console.log(JSON.stringify(callbackData, null, 2));

    // Acknowledge receipt immediately
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback received'
    });

    // Process callback asynchronously
    if (callbackData.Body?.stkCallback) {
      const { CheckoutRequestID, ResultCode, CallbackMetadata } = callbackData.Body.stkCallback;

      if (ResultCode === 0) {
        // Payment successful
        const transaction = transactionStore.get(CheckoutRequestID);
        if (transaction) {
          const metadata = CallbackMetadata?.Item || [];
          const receiptNo = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
          
          transaction.status = 'completed';
          transaction.mpesaReceiptNumber = receiptNo;
          transaction.completedAt = new Date();
          
          console.log(`✅ Callback: Payment Success - Receipt: ${receiptNo}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Callback Error:', error.message);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Error processed' });
  }
});

/**
 * Get Transaction Details (For admin/debugging)
 * GET /transaction/:id
 */
app.get('/transaction/:id', (req, res) => {
  try {
    const transaction = transactionStore.get(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Don't expose sensitive data
    const safe = {
      checkoutRequestId: transaction.checkoutRequestId,
      phone: `${transaction.phone.substring(0, 6)}***${transaction.phone.substring(9)}`,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt
    };

    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🎵 DJ Kraph M-Pesa Server Running`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`✅ Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`💰 M-Pesa Business Code: ${MPESA_CONFIG.BUSINESS_SHORTCODE}`);
  console.log(`🔐 Mode: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;

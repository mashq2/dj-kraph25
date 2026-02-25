/**
 * M-Pesa Payment Manager
 * Handles STK Push integration for DJ Kraph payments
 */

class MPesaPaymentManager {
  constructor() {
    this.baseUrl = process.env.MPESA_BASE_URL || 'http://localhost:3000';
    this.pollTimeout = 0;
  }

  /**
   * Format phone number to international format (254XXXXXXXXX)
   */
  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    let formatted = phone.replace(/\D/g, '');
    
    // Handle various formats
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  }

  /**
   * Validate M-Pesa phone number
   */
  validatePhoneNumber(phone) {
    const formatted = this.formatPhoneNumber(phone);
    const phoneRegex = /^254[0-9]{9}$/;
    return phoneRegex.test(formatted);
  }

  /**
   * Initiate STK Push payment
   */
  async initiateSTKPush(phoneNumber, amount, metadata = {}) {
    try {
      // Validate inputs
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number. Please use format: 0712345678 or 254712345678');
      }

      if (amount <= 0 || !Number.isInteger(amount)) {
        throw new Error('Amount must be a positive whole number');
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Prepare payload
      const payload = {
        phone: formattedPhone,
        amount: amount,
        description: metadata.description || 'DJ Kraph Payment',
        accountReference: metadata.accountReference || 'DJKRAPH' + Date.now(),
        transactionType: metadata.transactionType || 'CustomerPayBillOnline',
        remark: metadata.remark || 'Payment for DJ Kraph premium mixes'
      };

      console.log('Initiating M-Pesa STK Push:', payload);

      // Call your M-Pesa backend endpoint
      const response = await fetch('/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      // Handle successful STK initiation
      if (result.success || result.ResponseCode === '0') {
        return {
          success: true,
          checkoutRequestId: result.checkoutRequestId || result.CheckoutRequestID,
          message: result.message || 'STK push sent successfully',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(result.message || result.ResponseDescription || 'Failed to initiate STK push');
      }
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Poll for payment status
   * In production, you'd use M-Pesa callback webhooks
   * This is for demo/development purposes
   */
  async pollPaymentStatus(checkoutRequestId, maxAttempts = 10, intervalMs = 3000) {
    return new Promise((resolve) => {
      let attempts = 0;

      const poll = async () => {
        attempts++;

        try {
          const response = await fetch('/stkpush/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              checkoutRequestId: checkoutRequestId
            })
          });

          const result = await response.json();

          // Check if payment is completed
          if (result.success && result.status === 'completed') {
            resolve({
              success: true,
              status: 'completed',
              transactionId: result.transaction_id || result.MpesaReceiptNumber
            });
          } else if (result.success && result.status === 'pending') {
            // Still waiting for user action
            if (attempts < maxAttempts) {
              setTimeout(poll, intervalMs);
            } else {
              resolve({
                success: false,
                status: 'timeout',
                message: 'Payment timeout. Please try again.'
              });
            }
          } else {
            // Payment failed
            resolve({
              success: false,
              status: 'failed',
              message: result.message || 'Payment failed'
            });
          }
        } catch (error) {
          console.error('Status check error:', error);
          
          // On error, retry or timeout
          if (attempts < maxAttempts) {
            setTimeout(poll, intervalMs);
          } else {
            resolve({
              success: false,
              status: 'error',
              message: 'Unable to verify payment status'
            });
          }
        }
      };

      // Start polling
      poll();
    });
  }

  /**
   * Complete STK Push payment flow
   */
  async processPayment(phoneNumber, amount, metadata = {}) {
    try {
      // Step 1: Initiate STK Push
      const stkResult = await this.initiateSTKPush(phoneNumber, amount, metadata);
      
      if (!stkResult.success) {
        return {
          success: false,
          stage: 'initiation',
          error: stkResult.error
        };
      }

      // Step 2: Poll for payment status (wait for user to complete M-Pesa prompt)
      const statusResult = await this.pollPaymentStatus(stkResult.checkoutRequestId);

      return {
        success: statusResult.success,
        stage: 'completion',
        status: statusResult.status,
        transactionId: statusResult.transactionId,
        message: statusResult.message,
        checkoutRequestId: stkResult.checkoutRequestId
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        stage: 'unknown',
        error: error.message
      };
    }
  }

  /**
   * Format amount for display (KES)
   */
  formatAmount(amount) {
    return `KES ${amount.toLocaleString()}`;
  }

  /**
   * Convert USD to KES
   */
  convertToKES(usdAmount, rate = 150) {
    return Math.round(usdAmount * rate);
  }

  /**
   * Handle payment callback (for webhook integration)
   */
  handlePaymentCallback(callbackData) {
    // This would be called from your backend when M-Pesa sends a callback
    return {
      success: callbackData.ResultCode === '0',
      transactionId: callbackData.TransactionId,
      amount: callbackData.TransactionAmount,
      phone: callbackData.Msisdn,
      timestamp: callbackData.TransactionDate
    };
  }
}

// Initialize and export
const mpesaPaymentManager = new MPesaPaymentManager();

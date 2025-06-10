const QRCode = require('qrcode');

/**
 * Payment Service - Handles payment processing and QR code generation
 */

// Payment configuration
const PAYMENT_CONFIG = {
    // VietQR Bank info (example with VietcomBank)
    bankCode: 'VCB',
    accountNumber: '1234567890', // Replace with actual account
    accountName: 'HE THONG TUYEN SINH DAI HOC',
    
    // Payment amounts (VND)
    applicationFee: 25000, // 25,000 VND application fee
    
    // QR Code settings
    qrSize: 300,
    qrErrorLevel: 'M'
};

/**
 * Generate payment QR code using VietQR standard
 * @param {string} applicationId - Application ID for reference
 * @param {number} amount - Payment amount (optional, defaults to application fee)
 * @param {string} description - Payment description
 * @returns {Object} QR code data and payment info
 */
const generatePaymentQR = async (applicationId, amount = null, description = null) => {
    try {
        const paymentAmount = amount || PAYMENT_CONFIG.applicationFee;
        const paymentDescription = description || `Phi ho so ung tuyen ${applicationId}`;
        
        // VietQR format: https://vietqr.net/
        // Format: bank_code|account_number|amount|description|account_name
        const vietQRString = [
            PAYMENT_CONFIG.bankCode,
            PAYMENT_CONFIG.accountNumber,
            paymentAmount,
            paymentDescription.replace(/\s+/g, '+'), // Replace spaces with +
            PAYMENT_CONFIG.accountName.replace(/\s+/g, '+')
        ].join('|');
        
        // Generate QR code as base64 data URL
        const qrCodeDataURL = await QRCode.toDataURL(vietQRString, {
            width: PAYMENT_CONFIG.qrSize,
            errorCorrectionLevel: PAYMENT_CONFIG.qrErrorLevel,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        console.log('PAYMENT_SERVICE: QR code generated for application:', applicationId);
        
        return {
            success: true,
            qrCode: qrCodeDataURL,
            paymentInfo: {
                bankCode: PAYMENT_CONFIG.bankCode,
                bankName: 'Vietcombank',
                accountNumber: PAYMENT_CONFIG.accountNumber,
                accountName: PAYMENT_CONFIG.accountName,
                amount: paymentAmount,
                description: paymentDescription,
                applicationId: applicationId,
                currency: 'VND'
            }
        };
        
    } catch (error) {
        console.error('PAYMENT_SERVICE: Error generating QR code:', error);
        return {
            success: false,
            error: error.message,
            message: 'Không thể tạo mã QR thanh toán'
        };
    }
};

/**
 * Verify payment status (placeholder for future integration)
 * @param {string} applicationId - Application ID
 * @returns {Object} Payment status
 */
const verifyPaymentStatus = async (applicationId) => {
    // TODO: Integrate with bank API to verify payment
    console.log('PAYMENT_SERVICE: Checking payment status for:', applicationId);
    
    return {
        success: true,
        status: 'pending', // pending | paid | failed
        message: 'Chưa có thông tin thanh toán'
    };
};

/**
 * Format amount for display
 * @param {number} amount - Amount in VND
 * @returns {string} Formatted amount
 */
const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

module.exports = {
    generatePaymentQR,
    verifyPaymentStatus,
    formatAmount,
    PAYMENT_CONFIG
};
const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure, // true for 465, false for other ports
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
    },
    // tls: { rejectUnauthorized: false } // Bỏ comment nếu gặp lỗi SSL với self-signed certs (không khuyến khích cho production)
});

/**
 * Gửi email
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} subject - Chủ đề email
 * @param {string} text - Nội dung email dạng text (tùy chọn)
 * @param {string} html - Nội dung email dạng HTML
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: config.email.from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        // Không ném lỗi ra ngoài để không làm dừng tiến trình chính, chỉ log lỗi
        // Hoặc có thể throw error nếu việc gửi email là critical
    }
};

module.exports = sendEmail;
// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// fix: Enhanced emailService functionality


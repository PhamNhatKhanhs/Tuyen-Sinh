require('dotenv').config(); 

const config = {
    port: process.env.PORT || 5001,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tuyensinh_dh_default',
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    nodeEnv: process.env.NODE_ENV || 'development',
    uploadDir: process.env.UPLOAD_DIR || 'uploads/documents',
    // Email config
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        from: process.env.EMAIL_FROM || '"Tuyển Sinh ĐH" <no-reply@example.com>',
    }
};
module.exports = config;
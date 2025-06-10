const config = require('../config');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log lỗi ra console cho dev
    if (config.nodeEnv === 'development') {
        console.error('💥 ERROR 💥', err);
    }

    // Lỗi Mongoose Bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        const message = `Không tìm thấy tài nguyên với ID ${err.value}. ID không hợp lệ.`;
        error = { statusCode: 404, message, success: false };
    }

    // Lỗi Mongoose Duplicate Key (ví dụ: email đã tồn tại)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Trường '${field}' với giá trị '${value}' đã tồn tại. Vui lòng sử dụng giá trị khác.`;
        error = { statusCode: 400, message, success: false };
    }

    // Lỗi Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = `Dữ liệu nhập không hợp lệ: ${messages.join('. ')}`;
        error = { statusCode: 400, message, success: false };
    }
    
    // Lỗi JWT
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token không hợp lệ. Vui lòng đăng nhập lại.';
        error = { statusCode: 401, message, success: false };
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token đã hết hạn. Vui lòng đăng nhập lại.';
        error = { statusCode: 401, message, success: false };
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Lỗi Máy Chủ Nội Bộ'
    });
};

module.exports = errorHandler;
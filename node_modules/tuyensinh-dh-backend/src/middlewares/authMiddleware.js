const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Bảo vệ routes, kiểm tra token
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.jwt) { // Hoặc lấy token từ cookie nếu dùng cookie-based auth
    //     token = req.cookies.jwt;
    // }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Kiểm tra user có còn tồn tại không
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'Người dùng của token này không còn tồn tại.' });
        }
        
        if (!currentUser.isActive) {
            return res.status(403).json({ success: false, message: 'Tài khoản này đã bị vô hiệu hóa.' });
        }

        // Gắn thông tin user vào request để các handler sau có thể sử dụng
        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
        }
        return res.status(401).json({ success: false, message: 'Lỗi xác thực. Vui lòng đăng nhập lại.' });
    }
};

// Kiểm tra vai trò người dùng
exports.authorize = (...roles) => { // ...roles là một mảng các vai trò được phép, ví dụ: authorize('admin', 'lead-guide')
    return (req, res, next) => {
        // roles là một mảng ['admin']. req.user.role là 'user' hoặc 'admin'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện hành động này.' });
        }
        next();
    };
};

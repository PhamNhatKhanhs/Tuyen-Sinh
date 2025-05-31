const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelpers'); // Tạo file này nếu cần
const config = require('../config');

// Đăng ký
exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName, role } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng.' });
        }

        // Tạo user mới
        const newUser = await User.create({
            email,
            password,
            fullName: fullName || email.split('@')[0], // Tạm thời lấy tên từ email nếu không có fullName
            role: role || 'candidate' // Mặc định là candidate nếu không cung cấp
        });

        // Tạo token
        const token = generateToken(newUser._id, newUser.role);

        // Không trả về mật khẩu
        newUser.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            token,
            user: newUser
        });
    } catch (error) {
        console.error('Register Error:', error);
        // Chuyển lỗi cho errorMiddleware xử lý
        next(error); 
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email và password có được cung cấp không
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        // Tìm user theo email và lấy cả trường password
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác.' });
        }
        
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị vô hiệu hóa.' });
        }

        // Tạo token
        const token = generateToken(user._id, user.role);
        
        // Không trả về mật khẩu
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user
        });
    } catch (error) {
        console.error('Login Error:', error);
        next(error);
    }
};

// Lấy thông tin người dùng hiện tại (ví dụ)
exports.getMe = async (req, res, next) => {
    try {
        // req.user được gán từ authMiddleware
        const user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.'});
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// feature: Enhanced authController functionality


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Vui lòng cung cấp email của bạn'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Vui lòng cung cấp một email hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Vui lòng cung cấp mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false // Không tự động trả về trường password khi query
    },
    role: {
        type: String,
        enum: ['candidate', 'admin'],
        default: 'candidate'
    },
    fullName: { // Có thể được cập nhật sau hoặc khi admin tạo user
        type: String,
        trim: true,
    },
    // candidateProfile: { // Tham chiếu đến hồ sơ chi tiết của thí sinh
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'CandidateProfile'
    // },
    isActive: { // Admin có thể vô hiệu hóa tài khoản
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    // Thêm các trường khác nếu cần: passwordChangedAt, passwordResetToken, ...
});

// Middleware: Băm mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
    // Chỉ chạy hàm này nếu mật khẩu đã được thay đổi (hoặc mới)
    if (!this.isModified('password')) return next();

    // Băm mật khẩu với cost factor là 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Middleware: Cập nhật updatedAt
userSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});


// Instance method: Kiểm tra mật khẩu có khớp không
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

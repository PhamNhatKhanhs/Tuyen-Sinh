const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên trường không được để trống'],
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: [true, 'Mã trường không được để trống'],
        trim: true,
        uppercase: true,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    logoUrl: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: { // Admin có thể ẩn trường này khỏi danh sách public
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin đã tạo
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin cập nhật lần cuối
    }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

const University = mongoose.model('University', universitySchema);
module.exports = University;

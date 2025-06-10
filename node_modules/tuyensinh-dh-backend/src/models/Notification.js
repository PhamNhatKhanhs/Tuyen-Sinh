const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { // Người nhận thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Tiêu đề thông báo không được để trống'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Nội dung thông báo không được để trống'],
        trim: true,
    },
    type: { // Loại thông báo, ví dụ: 'application_submitted', 'status_changed', 'result_announced', 'general'
        type: String,
        trim: true,
    },
    link: { // Đường dẫn liên quan, ví dụ đến hồ sơ /candidate/applications/some_id
        type: String,
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    relatedApplication: { // ID của hồ sơ liên quan (nếu có)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 }); // Index để query thông báo cho user hiệu quả

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
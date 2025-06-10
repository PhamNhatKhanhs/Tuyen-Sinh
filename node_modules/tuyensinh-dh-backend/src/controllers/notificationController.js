const Notification = require('../models/Notification');

// Lấy thông báo cho user đang đăng nhập (có phân trang)
exports.getMyNotifications = async (req, res, next) => {
    try {
        // SỬA LỖI Ở ĐÂY: Bỏ `as string`
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 5;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Notification.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            pagination: { page, limit, totalPages: Math.ceil(total / limit) },
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// Đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo hoặc bạn không có quyền.' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllNotificationsAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: 'Tất cả thông báo chưa đọc đã được đánh dấu là đã đọc.' });
    } catch (error) {
        next(error);
    }
};
const Notification = require('../models/Notification');

/**
 * Hàm tiện ích để tạo thông báo mới
 * @param {string} userId - ID của người nhận
 * @param {string} title - Tiêu đề
 * @param {string} message - Nội dung
 * @param {string} [type] - Loại thông báo
 * @param {string} [link] - Đường dẫn liên quan
 * @param {string} [relatedApplicationId] - ID hồ sơ liên quan
 */
const createNotification = async (userId, title, message, type, link, relatedApplicationId) => {
    try {
        await Notification.create({
            user: userId,
            title,
            message,
            type,
            link,
            relatedApplication: relatedApplicationId
        });
        // console.log(`Notification created for user ${userId}: ${title}`);
    } catch (error) {
        console.error(`Error creating notification for user ${userId}:`, error);
    }
};
module.exports = createNotification;
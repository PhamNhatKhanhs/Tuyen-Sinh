const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Tất cả route trong đây yêu cầu đăng nhập

router.route('/')
    .get(notificationController.getMyNotifications);

router.route('/mark-all-read')
    .patch(notificationController.markAllNotificationsAsRead); // Dùng PATCH hoặc PUT

router.route('/:id/mark-read')
    .patch(notificationController.markNotificationAsRead);

module.exports = router;
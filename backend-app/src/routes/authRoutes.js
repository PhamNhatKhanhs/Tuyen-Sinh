const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Sẽ tạo sau

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe); // Ví dụ route cần bảo vệ

module.exports = router;
// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// feature: Enhanced authRoutes functionality


// Update by Pháº¡m Nháº­t KhÃ¡nh - 2025-06-11 02:34
// update: Enhanced authRoutes functionality


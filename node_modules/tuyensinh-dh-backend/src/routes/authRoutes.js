const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Sẽ tạo sau

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe); // Ví dụ route cần bảo vệ

module.exports = router;
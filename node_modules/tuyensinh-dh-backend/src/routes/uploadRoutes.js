const express = require('express');
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Thí sinh upload một file minh chứng
// POST /api/uploads/document
// Body cần có: file (dữ liệu file), documentType (string)
router.post(
    '/document',
    protect, // Yêu cầu đăng nhập
    authorize('candidate'), // Chỉ thí sinh mới được upload
    uploadMiddleware.single('documentFile'), // 'documentFile' là tên field trong form-data
    uploadController.uploadDocument
);

module.exports = router;
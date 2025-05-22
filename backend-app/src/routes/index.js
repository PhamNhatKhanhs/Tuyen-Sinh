const express = require('express');
const authRoutes = require('./authRoutes');
const universityRoutes = require('./universityRoutes');
const majorRoutes = require('./majorRoutes');
const admissionMethodRoutes = require('./admissionMethodRoutes');
const subjectGroupRoutes = require('./subjectGroupRoutes');
const masgPublicRoutes = require('./majorAdmissionSubjectGroupRoutes');
const uploadRoutes = require('./uploadRoutes');
const candidateRoutes = require('./candidateRoutes'); 
const notificationRoutes = require('./notificationRoutes');

const adminRoutes = require('./admin'); 
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
const API_PREFIX = '/api';

// Public Routes & Auth
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/universities`, universityRoutes);
router.use(`${API_PREFIX}/majors`, majorRoutes);
router.use(`${API_PREFIX}/admission-methods`, admissionMethodRoutes);
router.use(`${API_PREFIX}/subject-groups`, subjectGroupRoutes);
router.use(`${API_PREFIX}/admission-links`, masgPublicRoutes);

// Authenticated User Routes (candidate or admin)
router.use(`${API_PREFIX}/notifications`, notificationRoutes);

// Candidate specific routes
router.use(`${API_PREFIX}/candidate`, candidateRoutes);

// Upload routes
router.use(`${API_PREFIX}/uploads`, uploadRoutes);

// Admin Routes
router.use(`${API_PREFIX}/admin`, protect, authorize('admin'), adminRoutes);

router.get(`${API_PREFIX}/health`, (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

module.exports = router;
const express = require('express');
const candidateProfileController = require('../controllers/candidateProfileController');
const applicationController = require('../controllers/applicationController'); // Đảm bảo tên file và biến khớp
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('candidate'));

router.route('/profile')
    .get(candidateProfileController.getMyProfile)
    .post(candidateProfileController.upsertMyProfile) 
    .put(candidateProfileController.upsertMyProfile);

router.route('/applications')
    .post(applicationController.submitApplication) 
    .get(applicationController.getMyApplications);

router.route('/applications/:id')
    .get(applicationController.getMyApplicationById);

module.exports = router;
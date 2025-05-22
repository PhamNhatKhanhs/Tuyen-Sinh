const express = require('express');
const masgController = require('../controllers/majorAdmissionSubjectGroupController');
const router = express.Router();

// GET links (public: chỉ lấy active)
// /api/major-admission-subject-groups?majorId=...&admissionMethodId=...&year=...&universityId=...
router.get('/', masgController.getLinks);
router.get('/:id', masgController.getLinkById); // Public: chỉ lấy active

module.exports = router;
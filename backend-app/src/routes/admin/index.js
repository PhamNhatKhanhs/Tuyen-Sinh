const express = require('express');
const universityAdminRoutes = require('./universityAdminRoutes');
const majorAdminRoutes = require('./majorAdminRoutes');
const admissionMethodAdminRoutes = require('./admissionMethodAdminRoutes');
const subjectGroupAdminRoutes = require('./subjectGroupAdminRoutes');
const masgAdminRoutes = require('./masgAdminRoutes');
const applicationAdminRoutes = require('./applicationAdminRoutes');
const statsAdminRoutes = require('./statsAdminRoutes'); // THÊM MỚI
const userAdminRoutes = require('./userAdminRoutes');   // THÊM MỚI

const router = express.Router();

router.use('/universities', universityAdminRoutes);
router.use('/majors', majorAdminRoutes);
router.use('/admission-methods', admissionMethodAdminRoutes);
router.use('/subject-groups', subjectGroupAdminRoutes);
router.use('/major-admission-subject-groups', masgAdminRoutes);
router.use('/applications', applicationAdminRoutes);
router.use('/stats', statsAdminRoutes); // THÊM MỚI
router.use('/users', userAdminRoutes);   // THÊM MỚI

module.exports = router;
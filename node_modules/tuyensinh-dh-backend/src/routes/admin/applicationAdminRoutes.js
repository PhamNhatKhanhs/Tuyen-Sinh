const express = require('express');
const applicationController = require('../../controllers/applicationController');
// Middleware protect và authorize đã được áp dụng ở router cha (/api/admin)

const router = express.Router();

router.route('/')
    .get(applicationController.getAllApplicationsAdmin);

router.route('/:id')
    .get(applicationController.getApplicationByIdAdmin);

router.route('/:id/status')
    .put(applicationController.updateApplicationStatusAdmin);

module.exports = router;

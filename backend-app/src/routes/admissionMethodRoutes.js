const express = require('express');
const admissionMethodController = require('../controllers/admissionMethodController');
const router = express.Router();

// Public: GET all active methods
router.get('/', admissionMethodController.getAllAdmissionMethods);
router.get('/:id', admissionMethodController.getAdmissionMethodById); // Public: chỉ lấy active

module.exports = router;
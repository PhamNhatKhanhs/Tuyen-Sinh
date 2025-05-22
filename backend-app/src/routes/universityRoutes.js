const express = require('express');
const universityController = require('../controllers/universityController');

const router = express.Router();

router.route('/')
    .get(universityController.getAllUniversities); // Public: chỉ lấy active

router.route('/:id')
    .get(universityController.getUniversityById); // Public: chỉ lấy active

module.exports = router;
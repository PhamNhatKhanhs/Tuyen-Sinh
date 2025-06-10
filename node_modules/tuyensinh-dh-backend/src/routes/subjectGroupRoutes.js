const express = require('express');
const subjectGroupController = require('../controllers/subjectGroupController');
const router = express.Router();

// Public: GET all active groups
router.get('/', subjectGroupController.getAllSubjectGroups);
router.get('/:id', subjectGroupController.getSubjectGroupById); // Public: chỉ lấy active

module.exports = router;
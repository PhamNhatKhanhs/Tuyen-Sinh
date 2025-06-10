const express = require('express');
const majorController = require('../controllers/majorController');

const router = express.Router();

// GET /api/majors?universityId=... (Lấy ngành active của một trường)
// GET /api/majors (Lấy tất cả ngành active - có thể không cần thiết cho public)
router.route('/')
    .get(majorController.getAllMajors);

router.route('/:id')
    .get(majorController.getMajorById);

module.exports = router;
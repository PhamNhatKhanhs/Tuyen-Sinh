const express = require('express');
const majorController = require('../../controllers/majorController');
const router = express.Router();

router.route('/')
    .post(majorController.createMajor) // Body cần universityId
    .get(majorController.getAllMajors); // Admin xem tất cả, có thể filter theo universityId

router.route('/:id')
    .get(majorController.getMajorById)
    .put(majorController.updateMajor)
    .delete(majorController.deleteMajor);

module.exports = router;
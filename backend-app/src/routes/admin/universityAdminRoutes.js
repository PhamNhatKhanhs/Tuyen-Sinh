const express = require('express');
const universityController = require('../../controllers/universityController');
// Middleware protect và authorize đã được áp dụng ở router cha (/api/admin)
// nên không cần gọi lại ở đây, trừ khi có phân quyền chi tiết hơn nữa.

const router = express.Router();

router.route('/')
    .post(universityController.createUniversity)
    .get(universityController.getAllUniversities); // Admin có thể xem tất cả, kể cả inactive

router.route('/:id')
    .get(universityController.getUniversityById) // Admin có thể xem chi tiết, kể cả inactive
    .put(universityController.updateUniversity)
    .delete(universityController.deleteUniversity);

module.exports = router;
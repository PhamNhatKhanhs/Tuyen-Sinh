const express = require('express');
const userAdminController = require('../../controllers/userAdminController');
const router = express.Router();

router.get('/', userAdminController.getAllUsersAdmin);
router.patch('/:userId/status', userAdminController.updateUserStatusAdmin); // Dùng PATCH để cập nhật một phần

module.exports = router;
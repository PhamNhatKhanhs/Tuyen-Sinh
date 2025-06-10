const express = require('express');
const userAdminController = require('../../controllers/userAdminController');
const router = express.Router();

router.get('/', userAdminController.getAllUsersAdmin);
router.patch('/:userId/status', userAdminController.updateUserStatusAdmin); // Dùng PATCH để cập nhật một phần
router.patch('/:userId/role', userAdminController.updateUserRoleAdmin); // Thay đổi quyền
router.delete('/:userId', userAdminController.deleteUserAdmin); // Xóa người dùng

module.exports = router;
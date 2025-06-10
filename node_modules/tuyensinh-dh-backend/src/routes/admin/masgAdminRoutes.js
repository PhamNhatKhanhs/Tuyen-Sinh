const express = require('express');
const masgController = require('../../controllers/majorAdmissionSubjectGroupController');
const router = express.Router();

router.route('/')
    .post(masgController.linkMajorMethodGroup)
    .get(masgController.getLinks); // Admin có thể xem tất cả links, filter

router.route('/:id')
    .get(masgController.getLinkById)
    .put(masgController.updateLink)
    .delete(masgController.deleteLink);

module.exports = router;
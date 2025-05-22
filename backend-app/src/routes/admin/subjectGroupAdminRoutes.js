const express = require('express');
const subjectGroupController = require('../../controllers/subjectGroupController');
const router = express.Router();

router.route('/')
    .post(subjectGroupController.createSubjectGroup)
    .get(subjectGroupController.getAllSubjectGroups);

router.route('/:id')
    .get(subjectGroupController.getSubjectGroupById)
    .put(subjectGroupController.updateSubjectGroup)
    .delete(subjectGroupController.deleteSubjectGroup);

module.exports = router;
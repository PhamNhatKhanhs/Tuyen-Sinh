const express = require('express');
const admissionMethodController = require('../../controllers/admissionMethodController');
const router = express.Router();

router.route('/')
    .post(admissionMethodController.createAdmissionMethod)
    .get(admissionMethodController.getAllAdmissionMethods);

router.route('/:id')
    .get(admissionMethodController.getAdmissionMethodById)
    .put(admissionMethodController.updateAdmissionMethod)
    .delete(admissionMethodController.deleteAdmissionMethod);

module.exports = router;
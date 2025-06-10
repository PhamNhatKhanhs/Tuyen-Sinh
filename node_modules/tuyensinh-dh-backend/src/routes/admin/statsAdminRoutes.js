const express = require('express');
const statsController = require('../../controllers/statsController');
const router = express.Router();

router.get('/applications/overview', statsController.getApplicationOverviewStats);
router.get('/applications/by-university', statsController.getApplicationsByUniversityStats);
router.get('/applications/by-major', statsController.getApplicationsByMajorStats);
// router.get('/applications/by-major', statsController.getApplicationsByMajorStats); // TODO

module.exports = router;
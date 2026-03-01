const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

router.post('/compare', performanceController.comparePerformance);

module.exports = router;

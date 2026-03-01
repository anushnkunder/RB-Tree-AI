const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/experiment', analyticsController.runExperiment);
router.get('/experiments', analyticsController.getExperimentHistory);

module.exports = router;

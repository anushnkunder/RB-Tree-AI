const ExperimentRunner = require('../analytics/ExperimentRunner');
const Experiment = require('../models/Experiment');
const { validatePattern, validateExperimentParams } = require('../utils/validator');
const { handleError } = require('../utils/errorHandler');

// Run analytics experiment
const runExperiment = async (req, res) => {
  try {
    const { pattern, trials, maxNodes } = req.body;

    const validPattern = validatePattern(pattern);
    const validParams = validateExperimentParams(
      parseInt(trials),
      parseInt(maxNodes)
    );

    const runner = new ExperimentRunner();
    const result = await runner.runExperiment(
      validPattern,
      validParams.trials,
      validParams.maxNodes
    );

    // Save experiment to database
    await Experiment.create({
      pattern: validPattern,
      trials: validParams.trials,
      maxNodes: validParams.maxNodes,
      results: [{
        trialNumber: 1,
        dataPoints: result.dataPoints
      }],
      regression: result.regression
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get experiment history
const getExperimentHistory = async (req, res) => {
  try {
    const { pattern, limit = 10 } = req.query;

    const query = pattern ? { pattern } : {};
    const experiments = await Experiment.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      experiments
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  runExperiment,
  getExperimentHistory
};

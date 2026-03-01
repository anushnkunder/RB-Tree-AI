const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema({
  pattern: {
    type: String,
    required: true,
    enum: ['random', 'sorted', 'reverse', 'alternating']
  },
  trials: {
    type: Number,
    required: true
  },
  maxNodes: {
    type: Number,
    required: true
  },
  results: [{
    trialNumber: Number,
    dataPoints: [{
      nodes: Number,
      height: Number,
      rotations: Number,
      recolors: Number
    }]
  }],
  regression: {
    slope: Number,
    intercept: Number,
    rSquared: Number,
    equation: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Experiment', experimentSchema);

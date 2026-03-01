const mongoose = require('mongoose');

const operationLogSchema = new mongoose.Schema({
  treeType: {
    type: String,
    required: true,
    enum: ['RB', 'AVL', 'BST']
  },
  operation: {
    type: String,
    required: true,
    enum: ['insert', 'delete', 'search']
  },
  value: {
    type: Number,
    required: true
  },
  rotations: {
    type: Number,
    default: 0
  },
  recolors: {
    type: Number,
    default: 0
  },
  heightAfterOperation: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  executionTime: {
    type: Number,
    default: 0
  },
  metadata: {
    caseTriggered: {
      type: String,
      enum: ['case1', 'case2', 'case3', null],
      default: null
    },
    balancingSteps: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('OperationLog', operationLogSchema);

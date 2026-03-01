const RBTree = require('../trees/RBTree');
const AVLTree = require('../trees/AVLTree');
const BST = require('../trees/BST');
const OperationLog = require('../models/OperationLog');
const { validateInteger, validateTreeType } = require('../utils/validator');
const { handleError } = require('../utils/errorHandler');

// Store tree instances (in-memory for simplicity)
const trees = {
  RB: new RBTree(),
  AVL: new AVLTree(),
  BST: new BST()
};

// Insert value into tree
const insertValue = async (req, res) => {
  try {
    const { treeType, value } = req.body;
    
    const validTreeType = validateTreeType(treeType);
    const validValue = validateInteger(value);

    const startTime = Date.now();
    const result = trees[validTreeType].insert(validValue);
    const executionTime = Date.now() - startTime;

    // Log operation to database
    await OperationLog.create({
      treeType: validTreeType,
      operation: 'insert',
      value: validValue,
      rotations: result.metrics.rotations || 0,
      recolors: result.metrics.recolors || 0,
      heightAfterOperation: result.metrics.height,
      executionTime,
      metadata: {
        balancingSteps: result.steps.length
      }
    });

    res.json({
      success: true,
      tree: result.tree,
      steps: result.steps,
      metrics: result.metrics
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete value from tree
const deleteValue = async (req, res) => {
  try {
    const { treeType, value } = req.body;
    
    const validTreeType = validateTreeType(treeType);
    const validValue = validateInteger(value);

    const startTime = Date.now();
    const result = trees[validTreeType].delete(validValue);
    const executionTime = Date.now() - startTime;

    // Log operation to database
    await OperationLog.create({
      treeType: validTreeType,
      operation: 'delete',
      value: validValue,
      rotations: result.metrics.rotations || 0,
      recolors: result.metrics.recolors || 0,
      heightAfterOperation: result.metrics.height,
      executionTime,
      metadata: {
        balancingSteps: result.steps.length
      }
    });

    res.json({
      success: true,
      tree: result.tree,
      steps: result.steps,
      metrics: result.metrics
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Search for value in tree
const searchValue = async (req, res) => {
  try {
    const { treeType, value } = req.body;
    
    const validTreeType = validateTreeType(treeType);
    const validValue = validateInteger(value);

    const startTime = Date.now();
    const result = trees[validTreeType].search(validValue);
    const executionTime = Date.now() - startTime;

    // Log operation to database
    await OperationLog.create({
      treeType: validTreeType,
      operation: 'search',
      value: validValue,
      rotations: 0,
      recolors: 0,
      heightAfterOperation: trees[validTreeType].getMetrics().height,
      executionTime
    });

    res.json({
      success: true,
      found: result.found,
      path: result.path
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get current tree state
const getTree = async (req, res) => {
  try {
    const { treeType } = req.params;
    
    const validTreeType = validateTreeType(treeType);
    const tree = trees[validTreeType];

    res.json({
      success: true,
      tree: tree.toJSON(),
      metrics: tree.getMetrics()
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Reset tree
const resetTree = async (req, res) => {
  try {
    const { treeType } = req.body;
    
    const validTreeType = validateTreeType(treeType);

    // Create new tree instance
    if (validTreeType === 'RB') {
      trees.RB = new RBTree();
    } else if (validTreeType === 'AVL') {
      trees.AVL = new AVLTree();
    } else {
      trees.BST = new BST();
    }

    res.json({
      success: true,
      message: `${validTreeType} tree reset successfully`
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Export tree operations
const exportTree = async (req, res) => {
  try {
    const { treeType } = req.body;
    
    const validTreeType = validateTreeType(treeType);

    // Get operation logs from database
    const logs = await OperationLog.find({ treeType: validTreeType })
      .sort({ timestamp: 1 })
      .select('operation value -_id');

    const operations = logs.map(log => ({
      type: log.operation,
      value: log.value
    }));

    const exportData = {
      version: '1.0',
      treeType: validTreeType,
      operations,
      metadata: {
        exportDate: new Date(),
        totalOperations: operations.length,
        finalHeight: trees[validTreeType].getMetrics().height
      }
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Import tree operations
const importTree = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !data.treeType || !data.operations) {
      throw new Error('IMPORT_VALIDATION_FAILED');
    }

    const validTreeType = validateTreeType(data.treeType);

    // Reset tree
    if (validTreeType === 'RB') {
      trees.RB = new RBTree();
    } else if (validTreeType === 'AVL') {
      trees.AVL = new AVLTree();
    } else {
      trees.BST = new BST();
    }

    // Replay operations
    const tree = trees[validTreeType];
    for (const op of data.operations) {
      if (op.type === 'insert') {
        tree.insert(op.value);
      } else if (op.type === 'delete') {
        tree.delete(op.value);
      }
    }

    res.json({
      success: true,
      tree: tree.toJSON(),
      metrics: tree.getMetrics(),
      message: `Imported ${data.operations.length} operations successfully`
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  insertValue,
  deleteValue,
  searchValue,
  getTree,
  resetTree,
  exportTree,
  importTree
};

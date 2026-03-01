const RBTree = require('../trees/RBTree');
const AVLTree = require('../trees/AVLTree');
const BST = require('../trees/BST');
const PatternGenerator = require('../analytics/PatternGenerator');
const { validateSequence } = require('../utils/validator');
const { handleError } = require('../utils/errorHandler');

// Compare performance across tree types
const comparePerformance = async (req, res) => {
  try {
    const { sequence, generateRandom, nodeCount } = req.body;

    let validSequence;

    if (generateRandom && nodeCount) {
      // Generate random sequence
      const generator = new PatternGenerator();
      validSequence = generator.generateRandom(parseInt(nodeCount));
    } else if (sequence) {
      // Use provided sequence
      validSequence = validateSequence(sequence);
    } else {
      throw new Error('Either sequence or generateRandom with nodeCount must be provided');
    }

    // Create fresh tree instances
    const rbTree = new RBTree();
    const avlTree = new AVLTree();
    const bstTree = new BST();

    // Measure RB Tree performance
    const rbStart = Date.now();
    let rbRotations = 0;
    let rbRecolors = 0;
    
    for (const value of validSequence) {
      try {
        const result = rbTree.insert(value);
        rbRotations += result.metrics.rotations || 0;
        rbRecolors += result.metrics.recolors || 0;
      } catch (error) {
        // Skip duplicates or errors
      }
    }
    const rbTime = Date.now() - rbStart;

    // Measure AVL Tree performance
    const avlStart = Date.now();
    let avlRotations = 0;
    
    for (const value of validSequence) {
      try {
        const result = avlTree.insert(value);
        avlRotations += result.metrics.rotations || 0;
      } catch (error) {
        // Skip duplicates or errors
      }
    }
    const avlTime = Date.now() - avlStart;

    // Measure BST performance
    const bstStart = Date.now();
    
    for (const value of validSequence) {
      try {
        bstTree.insert(value);
      } catch (error) {
        // Skip duplicates or errors
      }
    }
    const bstTime = Date.now() - bstStart;

    // Collect metrics
    const comparison = {
      sequence: validSequence,
      rb: {
        height: rbTree.getHeight(),
        rotations: rbRotations,
        recolors: rbRecolors,
        executionTime: rbTime,
        size: rbTree.size,
        tree: rbTree.toJSON()
      },
      avl: {
        height: avlTree.getHeight(),
        rotations: avlRotations,
        executionTime: avlTime,
        size: avlTree.size,
        tree: avlTree.toJSON()
      },
      bst: {
        height: bstTree.getHeight(),
        rotations: 0,
        executionTime: bstTime,
        size: bstTree.size,
        tree: bstTree.toJSON()
      }
    };

    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  comparePerformance
};

// Input validation utilities

const validateInteger = (value) => {
  const num = parseInt(value);
  if (isNaN(num)) {
    throw new Error('INVALID_INPUT');
  }
  if (num < -10000 || num > 10000) {
    throw new Error('INVALID_INPUT');
  }
  return num;
};

const validateTreeType = (treeType) => {
  const validTypes = ['RB', 'AVL', 'BST'];
  if (!validTypes.includes(treeType)) {
    throw new Error('INVALID_TREE_TYPE');
  }
  return treeType;
};

const validatePattern = (pattern) => {
  const validPatterns = ['random', 'sorted', 'reverse', 'alternating'];
  if (!validPatterns.includes(pattern)) {
    throw new Error('Invalid pattern type');
  }
  return pattern;
};

const validateSequence = (sequence) => {
  if (!Array.isArray(sequence) || sequence.length === 0) {
    throw new Error('Invalid sequence');
  }
  return sequence.map(val => validateInteger(val));
};

const validateExperimentParams = (trials, maxNodes) => {
  if (trials < 1 || trials > 100) {
    throw new Error('Trials must be between 1 and 100');
  }
  if (maxNodes < 10 || maxNodes > 1000) {
    throw new Error('Max nodes must be between 10 and 1000');
  }
  return { trials, maxNodes };
};

module.exports = {
  validateInteger,
  validateTreeType,
  validatePattern,
  validateSequence,
  validateExperimentParams
};

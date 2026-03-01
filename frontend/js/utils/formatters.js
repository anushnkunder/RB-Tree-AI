// Utility functions for formatting data

const formatters = {
  // Format timestamp
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  },

  // Format date
  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  },

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format decimal to fixed places
  formatDecimal(num, places = 2) {
    return Number(num).toFixed(places);
  },

  // Format milliseconds
  formatMs(ms) {
    return `${ms}ms`;
  },

  // Parse sequence string to array
  parseSequence(str) {
    return str
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s))
      .filter(n => !isNaN(n));
  },

  // Format operation type
  formatOperation(op) {
    const operations = {
      insert: 'Insert',
      delete: 'Delete',
      search: 'Search'
    };
    return operations[op] || op;
  },

  // Format case type
  formatCase(caseType) {
    const cases = {
      case1: 'Case 1: Uncle Red',
      case2: 'Case 2: Triangle',
      case3: 'Case 3: Line'
    };
    return cases[caseType] || caseType;
  },

  // Format tree type
  formatTreeType(type) {
    const types = {
      RB: 'Red-Black Tree',
      AVL: 'AVL Tree',
      BST: 'Binary Search Tree'
    };
    return types[type] || type;
  }
};

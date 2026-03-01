const { BSTNode } = require('./Node');

class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  // Insert a value
  insert(value) {
    // Check for duplicate
    if (this.search(value).found) {
      throw new Error('DUPLICATE_VALUE');
    }

    // Check size limit
    if (this.size >= 1000) {
      throw new Error('SIZE_LIMIT');
    }

    this.root = this.insertNode(this.root, value);
    this.size++;

    return {
      tree: this.toJSON(),
      steps: [{ stepType: 'insert', description: `Inserted ${value}`, affectedNodes: [value] }],
      metrics: this.getMetrics()
    };
  }

  insertNode(node, value) {
    if (!node) {
      return new BSTNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  // Search for a value
  search(value) {
    const path = [];
    let current = this.root;

    while (current) {
      path.push(current.value);
      if (value === current.value) {
        return { found: true, path };
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found: false, path };
  }

  // Delete a value
  delete(value) {
    const searchResult = this.search(value);
    if (!searchResult.found) {
      throw new Error('NOT_FOUND');
    }

    this.root = this.deleteNode(this.root, value);
    this.size--;

    return {
      tree: this.toJSON(),
      steps: [{ stepType: 'delete', description: `Deleted ${value}`, affectedNodes: [value] }],
      metrics: this.getMetrics()
    };
  }

  deleteNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node found
      if (!node.left && !node.right) {
        return null;
      } else if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      } else {
        // Two children - find successor
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }
        node.value = successor.value;
        node.right = this.deleteNode(node.right, successor.value);
      }
    }

    return node;
  }

  // Get tree height
  getHeight(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // Get metrics
  getMetrics() {
    return {
      height: this.getHeight(),
      size: this.size,
      rotations: 0 // BST doesn't rotate
    };
  }

  // Convert tree to JSON
  toJSON() {
    return this.root ? this.root.toJSON() : null;
  }
}

module.exports = BST;

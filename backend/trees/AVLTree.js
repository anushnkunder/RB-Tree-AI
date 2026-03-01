const { AVLNode } = require('./Node');

class AVLTree {
  constructor() {
    this.root = null;
    this.size = 0;
    this.rotationCount = 0;
  }

  // Get height of a node
  getNodeHeight(node) {
    return node ? node.height : 0;
  }

  // Get balance factor
  getBalanceFactor(node) {
    if (!node) return 0;
    return this.getNodeHeight(node.left) - this.getNodeHeight(node.right);
  }

  // Update height of a node
  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(
        this.getNodeHeight(node.left),
        this.getNodeHeight(node.right)
      );
    }
  }

  // Left rotation
  rotateLeft(node) {
    const rightChild = node.right;
    node.right = rightChild.left;
    rightChild.left = node;

    this.updateHeight(node);
    this.updateHeight(rightChild);
    this.rotationCount++;

    return rightChild;
  }

  // Right rotation
  rotateRight(node) {
    const leftChild = node.left;
    node.left = leftChild.right;
    leftChild.right = node;

    this.updateHeight(node);
    this.updateHeight(leftChild);
    this.rotationCount++;

    return leftChild;
  }

  // Balance the node
  balance(node) {
    if (!node) return null;

    this.updateHeight(node);
    const balanceFactor = this.getBalanceFactor(node);

    // Left heavy
    if (balanceFactor > 1) {
      // Left-Right case
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left);
      }
      // Left-Left case
      return this.rotateRight(node);
    }

    // Right heavy
    if (balanceFactor < -1) {
      // Right-Left case
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right);
      }
      // Right-Right case
      return this.rotateLeft(node);
    }

    return node;
  }

  // Insert a value
  insert(value) {
    this.rotationCount = 0;

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
    // Standard BST insertion
    if (!node) {
      return new AVLNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else {
      node.right = this.insertNode(node.right, value);
    }

    // Balance the node
    return this.balance(node);
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
    this.rotationCount = 0;

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
      if (!node.left || !node.right) {
        node = node.left || node.right;
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

    // Balance the node
    return this.balance(node);
  }

  // Get tree height
  getHeight() {
    return this.getNodeHeight(this.root);
  }

  // Get metrics
  getMetrics() {
    return {
      height: this.getHeight(),
      size: this.size,
      rotations: this.rotationCount
    };
  }

  // Convert tree to JSON
  toJSON() {
    return this.root ? this.root.toJSON() : null;
  }
}

module.exports = AVLTree;

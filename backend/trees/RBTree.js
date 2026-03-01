const { RBNode } = require('./Node');

class RBTree {
  constructor() {
    this.root = null;
    this.size = 0;
    this.rotationCount = 0;
    this.recolorCount = 0;
  }

  // Insert a value and return steps for animation
  insert(value) {
    const steps = [];
    this.rotationCount = 0;
    this.recolorCount = 0;

    // Check for duplicate
    if (this.search(value).found) {
      throw new Error('DUPLICATE_VALUE');
    }

    // Check size limit
    if (this.size >= 1000) {
      throw new Error('SIZE_LIMIT');
    }

    const newNode = new RBNode(value, 'RED');

    if (!this.root) {
      this.root = newNode;
      this.root.color = 'BLACK';
      this.size++;
      
      steps.push({
        stepType: 'insert',
        description: `Insert value ${value} as root node`,
        affectedNodes: [value],
        beforeState: null,
        afterState: null
      });
      
      steps.push({
        stepType: 'recolor',
        description: `Root node ${value} recolored to BLACK`,
        affectedNodes: [value],
        beforeState: null,
        afterState: this.toJSON()
      });
      
      return {
        tree: this.toJSON(),
        steps,
        metrics: this.getMetrics()
      };
    }

    // Standard BST insertion
    let current = this.root;
    let parent = null;

    while (current) {
      parent = current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;
    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.size++;

    // Add initial state after BST insertion, before balancing
    steps.push({
      stepType: 'insert',
      description: `Inserted ${value} as RED node (before balancing)`,
      affectedNodes: [value],
      beforeState: null,
      afterState: this.toJSON()
    });

    // Fix Red-Black Tree properties
    this.fixInsert(newNode, steps);

    steps[steps.length - 1].afterState = this.toJSON();

    return {
      tree: this.toJSON(),
      steps,
      metrics: this.getMetrics()
    };
  }

  // Fix Red-Black Tree properties after insertion
  fixInsert(node, steps) {
    while (node.parent && node.parent.color === 'RED') {
      const parent = node.parent;
      const grandparent = parent.parent;

      if (!grandparent) break;

      if (parent === grandparent.left) {
        const uncle = grandparent.right;

        // Case 1: Uncle is RED
        if (uncle && uncle.color === 'RED') {
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandparent.color = 'RED';
          this.recolorCount += 3;

          steps.push({
            stepType: 'case_trigger',
            caseType: 'case1',
            description: `Case 1: Uncle (${uncle.value}) is RED - Recolor parent, uncle, and grandparent`,
            affectedNodes: [parent.value, uncle.value, grandparent.value],
            beforeState: null,
            afterState: this.toJSON()
          });

          node = grandparent;
        } else {
          // Case 2: Uncle is BLACK, Triangle configuration
          if (node === parent.right) {
            node = parent;
            this.rotateLeft(node);
            this.rotationCount++;

            steps.push({
              stepType: 'case_trigger',
              caseType: 'case2',
              description: `Case 2: Triangle configuration - Rotate left at ${parent.value}`,
              affectedNodes: [node.value, parent.value],
              beforeState: null,
              afterState: this.toJSON()
            });
          }

          // Case 3: Uncle is BLACK, Line configuration
          node.parent.color = 'BLACK';
          grandparent.color = 'RED';
          this.recolorCount += 2;
          this.rotateRight(grandparent);
          this.rotationCount++;

          steps.push({
            stepType: 'case_trigger',
            caseType: 'case3',
            description: `Case 3: Line configuration - Recolor and rotate right at ${grandparent.value}`,
            affectedNodes: [node.parent.value, grandparent.value],
            beforeState: null,
            afterState: this.toJSON()
          });
        }
      } else {
        // Mirror cases (parent is right child)
        const uncle = grandparent.left;

        // Case 1: Uncle is RED
        if (uncle && uncle.color === 'RED') {
          parent.color = 'BLACK';
          uncle.color = 'BLACK';
          grandparent.color = 'RED';
          this.recolorCount += 3;

          steps.push({
            stepType: 'case_trigger',
            caseType: 'case1',
            description: `Case 1: Uncle (${uncle.value}) is RED - Recolor parent, uncle, and grandparent`,
            affectedNodes: [parent.value, uncle.value, grandparent.value],
            beforeState: null,
            afterState: this.toJSON()
          });

          node = grandparent;
        } else {
          // Case 2: Uncle is BLACK, Triangle configuration
          if (node === parent.left) {
            node = parent;
            this.rotateRight(node);
            this.rotationCount++;

            steps.push({
              stepType: 'case_trigger',
              caseType: 'case2',
              description: `Case 2: Triangle configuration - Rotate right at ${parent.value}`,
              affectedNodes: [node.value, parent.value],
              beforeState: null,
              afterState: this.toJSON()
            });
          }

          // Case 3: Uncle is BLACK, Line configuration
          node.parent.color = 'BLACK';
          grandparent.color = 'RED';
          this.recolorCount += 2;
          this.rotateLeft(grandparent);
          this.rotationCount++;

          steps.push({
            stepType: 'case_trigger',
            caseType: 'case3',
            description: `Case 3: Line configuration - Recolor and rotate left at ${grandparent.value}`,
            affectedNodes: [node.parent.value, grandparent.value],
            beforeState: null,
            afterState: this.toJSON()
          });
        }
      }
    }

    // Ensure root is black
    if (this.root.color === 'RED') {
      this.root.color = 'BLACK';
      this.recolorCount++;
      
      steps.push({
        stepType: 'recolor',
        description: `Root recolored to BLACK`,
        affectedNodes: [this.root.value],
        beforeState: null,
        afterState: this.toJSON()
      });
    }
  }

  // Left rotation
  rotateLeft(node) {
    const rightChild = node.right;
    node.right = rightChild.left;

    if (rightChild.left) {
      rightChild.left.parent = node;
    }

    rightChild.parent = node.parent;

    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;
  }

  // Right rotation
  rotateRight(node) {
    const leftChild = node.left;
    node.left = leftChild.right;

    if (leftChild.right) {
      leftChild.right.parent = node;
    }

    leftChild.parent = node.parent;

    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;
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
    const steps = [];
    this.rotationCount = 0;
    this.recolorCount = 0;

    const searchResult = this.search(value);
    if (!searchResult.found) {
      throw new Error('NOT_FOUND');
    }

    steps.push({
      stepType: 'delete',
      description: `Delete value ${value}`,
      affectedNodes: [value],
      beforeState: this.toJSON(),
      afterState: null
    });

    // Find node to delete
    let nodeToDelete = this.root;
    while (nodeToDelete && nodeToDelete.value !== value) {
      if (value < nodeToDelete.value) {
        nodeToDelete = nodeToDelete.left;
      } else {
        nodeToDelete = nodeToDelete.right;
      }
    }

    this.deleteNode(nodeToDelete, steps);
    this.size--;

    steps[steps.length - 1].afterState = this.toJSON();

    return {
      tree: this.toJSON(),
      steps,
      metrics: this.getMetrics()
    };
  }

  // Helper method to delete a node
  deleteNode(node, steps) {
    // Implementation simplified for initial version
    // Full RB delete with fixup would be added here
    // For now, we'll implement basic BST delete
    
    if (!node.left && !node.right) {
      // Leaf node
      if (node === this.root) {
        this.root = null;
      } else if (node === node.parent.left) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
    } else if (!node.left || !node.right) {
      // One child
      const child = node.left || node.right;
      if (node === this.root) {
        this.root = child;
        child.parent = null;
      } else if (node === node.parent.left) {
        node.parent.left = child;
        child.parent = node.parent;
      } else {
        node.parent.right = child;
        child.parent = node.parent;
      }
    } else {
      // Two children - find successor
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }
      node.value = successor.value;
      this.deleteNode(successor, steps);
    }
  }

  // Get tree height
  getHeight(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  // Get black height
  getBlackHeight(node = this.root) {
    if (!node) return 0;
    const leftHeight = this.getBlackHeight(node.left);
    return leftHeight + (node.color === 'BLACK' ? 1 : 0);
  }

  // Get metrics
  getMetrics() {
    return {
      height: this.getHeight(),
      blackHeight: this.getBlackHeight(),
      size: this.size,
      rotations: this.rotationCount,
      recolors: this.recolorCount
    };
  }

  // Convert tree to JSON
  toJSON() {
    return this.root ? this.root.toJSON() : null;
  }

  // Validate Red-Black Tree properties
  validateInvariants() {
    // Root must be black
    if (this.root && this.root.color !== 'BLACK') return false;
    
    // Check properties recursively
    return this.validateNode(this.root).valid;
  }

  validateNode(node) {
    if (!node) return { valid: true, blackHeight: 1 };

    // Red nodes must have black children
    if (node.color === 'RED') {
      if ((node.left && node.left.color === 'RED') || 
          (node.right && node.right.color === 'RED')) {
        return { valid: false, blackHeight: 0 };
      }
    }

    const left = this.validateNode(node.left);
    const right = this.validateNode(node.right);

    if (!left.valid || !right.valid) {
      return { valid: false, blackHeight: 0 };
    }

    // Black heights must match
    if (left.blackHeight !== right.blackHeight) {
      return { valid: false, blackHeight: 0 };
    }

    const blackHeight = left.blackHeight + (node.color === 'BLACK' ? 1 : 0);
    return { valid: true, blackHeight };
  }
}

module.exports = RBTree;

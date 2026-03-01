// Node classes for different tree types

class RBNode {
  constructor(value, color = 'RED') {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }

  toJSON() {
    return {
      value: this.value,
      color: this.color,
      left: this.left ? this.left.toJSON() : null,
      right: this.right ? this.right.toJSON() : null
    };
  }
}

class AVLNode {
  constructor(value) {
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
  }

  toJSON() {
    return {
      value: this.value,
      height: this.height,
      left: this.left ? this.left.toJSON() : null,
      right: this.right ? this.right.toJSON() : null
    };
  }
}

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  toJSON() {
    return {
      value: this.value,
      left: this.left ? this.left.toJSON() : null,
      right: this.right ? this.right.toJSON() : null
    };
  }
}

module.exports = { RBNode, AVLNode, BSTNode };

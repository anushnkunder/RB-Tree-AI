class PatternGenerator {
  // Generate random insertion sequence
  generateRandom(count) {
    const values = [];
    const used = new Set();

    while (values.length < count) {
      const value = Math.floor(Math.random() * count * 10);
      if (!used.has(value)) {
        values.push(value);
        used.add(value);
      }
    }

    return values;
  }

  // Generate sorted sequence (worst case for BST)
  generateSorted(count) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // Generate reverse sorted sequence
  generateReverseSorted(count) {
    return Array.from({ length: count }, (_, i) => count - i);
  }

  // Generate alternating high-low sequence
  generateAlternating(count) {
    const values = [];
    let low = 1;
    let high = count;

    while (low <= high) {
      values.push(high--);
      if (low <= high) values.push(low++);
    }

    return values;
  }

  // Generate pattern by type
  generate(pattern, count) {
    switch (pattern) {
      case 'random':
        return this.generateRandom(count);
      case 'sorted':
        return this.generateSorted(count);
      case 'reverse':
        return this.generateReverseSorted(count);
      case 'alternating':
        return this.generateAlternating(count);
      default:
        throw new Error('Invalid pattern type');
    }
  }
}

module.exports = PatternGenerator;

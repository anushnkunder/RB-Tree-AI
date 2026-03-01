const RBTree = require('../../../backend/trees/RBTree');

describe('RBTree - Basic Operations', () => {
  let tree;

  beforeEach(() => {
    tree = new RBTree();
  });

  describe('Test 1.1: Basic Insert - Enter value: 10', () => {
    test('should insert value 10 into empty tree', () => {
      const result = tree.insert(10);

      // Verify tree structure
      expect(result.tree).toBeDefined();
      expect(result.tree.value).toBe(10);
      expect(result.tree.color).toBe('BLACK');
      expect(result.tree.left).toBeNull();
      expect(result.tree.right).toBeNull();
    });

    test('should return correct metrics after inserting 10', () => {
      const result = tree.insert(10);

      // Verify metrics: Height=1, Size=1
      expect(result.metrics).toBeDefined();
      expect(result.metrics.height).toBe(1);
      expect(result.metrics.size).toBe(1);
      expect(result.metrics.blackHeight).toBe(1);
    });

    test('should have root as black node after inserting 10', () => {
      tree.insert(10);

      // Verify: Tree displays with single black node
      expect(tree.root).toBeDefined();
      expect(tree.root.value).toBe(10);
      expect(tree.root.color).toBe('BLACK');
    });

    test('should return proper step sequence for inserting 10', () => {
      const result = tree.insert(10);

      // Verify steps are recorded
      expect(result.steps).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
      
      // First step should be insert
      expect(result.steps[0].stepType).toBe('insert');
      expect(result.steps[0].affectedNodes).toContain(10);
    });

    test('should maintain Red-Black Tree invariants after inserting 10', () => {
      tree.insert(10);

      // Verify all RB Tree properties
      const isValid = tree.validateInvariants();
      expect(isValid).toBe(true);

      // Root is black
      expect(tree.root.color).toBe('BLACK');
    });
  });

  describe('Test 1.2: Multiple Inserts - Red-Black Tree Cases', () => {
    test('Case 3 (Line Configuration): Insert 10, 20, 30', () => {
      tree.insert(10);
      tree.insert(20);
      const result = tree.insert(30);

      // Verify Case 3 triggered
      const case3Step = result.steps.find(step => 
        step.caseType === 'case3' || 
        step.description.includes('Case 3')
      );
      expect(case3Step).toBeDefined();

      // Verify rotation occurs
      expect(result.metrics.rotations).toBeGreaterThan(0);

      // Verify tree is balanced
      expect(tree.validateInvariants()).toBe(true);
      
      // After rotation, root should be 20
      expect(tree.root.value).toBe(20);
      expect(tree.root.color).toBe('BLACK');
    });

    test('should maintain tree balance after Case 3', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);

      const height = tree.getHeight();
      const size = tree.size;

      // Height should be logarithmic
      expect(height).toBeLessThanOrEqual(Math.ceil(2 * Math.log2(size + 1)));
    });
  });

  describe('Test 1.3: Search Operation', () => {
    beforeEach(() => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(5);
    });

    test('should find existing value 20', () => {
      const result = tree.search(20);

      expect(result.found).toBe(true);
      expect(result.path).toBeDefined();
      expect(result.path.length).toBeGreaterThan(0);
    });

    test('should not find non-existing value 99', () => {
      const result = tree.search(99);

      expect(result.found).toBe(false);
    });
  });

  describe('Test 1.6: Error Handling', () => {
    test('should reject duplicate value', () => {
      tree.insert(10);

      expect(() => {
        tree.insert(10);
      }).toThrow('DUPLICATE_VALUE');
    });

    test('should enforce size limit of 1000 nodes', () => {
      // Insert 1000 nodes
      for (let i = 0; i < 1000; i++) {
        tree.insert(i);
      }

      // 1001st insert should fail
      expect(() => {
        tree.insert(1001);
      }).toThrow('SIZE_LIMIT');
    });
  });

  describe('Tree Invariant Validation', () => {
    test('root should always be black after operations', () => {
      tree.insert(10);
      expect(tree.root.color).toBe('BLACK');

      tree.insert(20);
      expect(tree.root.color).toBe('BLACK');

      tree.insert(30);
      expect(tree.root.color).toBe('BLACK');
    });

    test('should maintain all RB Tree properties after multiple inserts', () => {
      const values = [10, 20, 30, 15, 5, 25, 35, 12, 18];
      
      values.forEach(value => {
        tree.insert(value);
        expect(tree.validateInvariants()).toBe(true);
      });
    });
  });
});

# Testing Guide

## Pre-Testing Setup

1. Ensure MongoDB is running
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open browser: `http://localhost:3000`

## Test Suite 1: Visualization Mode

### Test 1.1: Basic Insert
- [x] Enter value: 10
- [x] Click Insert
- [ ] Verify: Tree displays with single black node
- [ ] Verify: Metrics show Height=1, Size=1

### Test 1.2: Red-Black Tree Cases
**Case 3 (Line Configuration)**
- [ ] Insert: 10, 20, 30
- [ ] Verify: Case 3 triggered in history
- [ ] Verify: Rotation occurs
- [ ] Verify: Tree is balanced

**Case 1 (Uncle Red)**
- [ ] Continue with: 15
- [ ] Verify: Case 1 triggered
- [ ] Verify: Recoloring occurs

**Case 2 (Triangle)**
- [ ] Continue with: 5, 25, 27
- [ ] Verify: Case 2 triggered
- [ ] Verify: Double rotation

### Test 1.3: Search Operation
- [ ] Enter existing value: 20
- [ ] Click Search
- [ ] Verify: Path highlighted
- [ ] Verify: "Found" in history

- [ ] Enter non-existing value: 99
- [ ] Click Search
- [ ] Verify: "Not found" in history

### Test 1.4: Delete Operation
- [ ] Enter existing value: 15
- [ ] Click Delete
- [ ] Verify: Node removed
- [ ] Verify: Tree rebalanced

### Test 1.5: Manual Step Mode
- [ ] Enable "Manual Step Mode"
- [ ] Insert value: 40
- [ ] Verify: Animation controls appear
- [ ] Click "Next Step"
- [ ] Verify: Steps advance one at a time
- [ ] Click "Play"
- [ ] Verify: Auto-play resumes

### Test 1.6: Error Handling
- [ ] Insert duplicate value
- [ ] Verify: Error message displayed
- [ ] Enter invalid input (text)
- [ ] Verify: Error message displayed

### Test 1.7: Reset
- [ ] Click Reset
- [ ] Confirm dialog
- [ ] Verify: Tree cleared
- [ ] Verify: Metrics reset to 0

## Test Suite 2: Performance Mode

### Test 2.1: User-Defined Sequence
- [ ] Enter: `10,20,30,15,5,25,35,12,18`
- [ ] Click "Compare Trees"
- [ ] Verify: Comparison table displays
- [ ] Verify: All three trees show metrics
- [ ] Verify: Graph renders correctly

### Test 2.2: Random Sequence
- [ ] Enter node count: 50
- [ ] Click "Generate Random"
- [ ] Verify: Sequence generated
- [ ] Verify: Comparison completes
- [ ] Verify: Results displayed

### Test 2.3: Side-by-Side View
- [ ] Enable "Show Side-by-Side Trees"
- [ ] Verify: Three trees render side-by-side
- [ ] Verify: Visual differences clear

### Test 2.4: Sorted Sequence (Worst Case)
- [ ] Enter: `1,2,3,4,5,6,7,8,9,10`
- [ ] Click "Compare Trees"
- [ ] Verify: BST height significantly higher
- [ ] Verify: RB and AVL heights similar
- [ ] Verify: Best/worst values highlighted

### Test 2.5: Performance Metrics
- [ ] Verify: RB Tree shows rotations and recolors
- [ ] Verify: AVL Tree shows rotations
- [ ] Verify: BST shows 0 rotations
- [ ] Verify: Execution times displayed

## Test Suite 3: AI Analytics Mode

### Test 3.1: Random Pattern
- [ ] Select pattern: Random
- [ ] Set trials: 10
- [ ] Set max nodes: 100
- [ ] Click "Run Experiment"
- [ ] Verify: Loading indicator shows
- [ ] Verify: Results display after completion

### Test 3.2: Sorted Pattern
- [ ] Select pattern: Sorted
- [ ] Set trials: 5
- [ ] Set max nodes: 200
- [ ] Click "Run Experiment"
- [ ] Verify: Experiment completes
- [ ] Verify: Height growth pattern visible

### Test 3.3: Reverse Sorted Pattern
- [ ] Select pattern: Reverse Sorted
- [ ] Run experiment
- [ ] Verify: Similar to sorted pattern

### Test 3.4: Alternating Pattern
- [ ] Select pattern: Alternating
- [ ] Run experiment
- [ ] Verify: Unique pattern in plots

### Test 3.5: Regression Analysis
- [ ] After any experiment
- [ ] Verify: Regression equation displayed
- [ ] Verify: R² value shown
- [ ] Verify: Slope and intercept displayed

### Test 3.6: Plots
- [ ] Verify: Nodes vs Height plot renders
- [ ] Verify: Actual data points visible
- [ ] Verify: Regression line (dashed)
- [ ] Verify: Theoretical O(log n) curve (dashed)
- [ ] Verify: Nodes vs Rotations plot
- [ ] Verify: Nodes vs Recolors plot

### Test 3.7: Export Results
- [ ] Click "Export Results"
- [ ] Verify: JSON file downloads
- [ ] Open file
- [ ] Verify: Contains all experiment data

### Test 3.8: Parameter Validation
- [ ] Set trials: 0
- [ ] Verify: Error message
- [ ] Set trials: 101
- [ ] Verify: Error message
- [ ] Set max nodes: 5
- [ ] Verify: Error message
- [ ] Set max nodes: 1001
- [ ] Verify: Error message

## Test Suite 4: Edge Cases

### Test 4.1: Size Limit
- [ ] Insert 1000 nodes
- [ ] Try to insert 1001st node
- [ ] Verify: Error message about size limit

### Test 4.2: Duplicate Values
- [ ] Insert: 50
- [ ] Try to insert: 50 again
- [ ] Verify: Error message about duplicates

### Test 4.3: Empty Tree Operations
- [ ] Reset tree
- [ ] Try to delete value
- [ ] Verify: Error message
- [ ] Try to search value
- [ ] Verify: "Not found"

### Test 4.4: Large Values
- [ ] Insert: 9999
- [ ] Insert: -9999
- [ ] Verify: Both work correctly

### Test 4.5: Rapid Operations
- [ ] Quickly insert 10 values
- [ ] Verify: All operations complete
- [ ] Verify: Tree remains valid

## Test Suite 5: UI/UX

### Test 5.1: Tab Navigation
- [ ] Click each tab
- [ ] Verify: Smooth transitions
- [ ] Verify: State preserved when switching back

### Test 5.2: Responsive Design
- [ ] Resize browser window
- [ ] Verify: Layout adapts
- [ ] Test on mobile viewport
- [ ] Verify: Usable on small screens

### Test 5.3: Animations
- [ ] Insert multiple values
- [ ] Verify: Smooth node animations
- [ ] Verify: Color transitions smooth
- [ ] Verify: Rotation animations clear

### Test 5.4: Error Messages
- [ ] Trigger various errors
- [ ] Verify: Messages clear and helpful
- [ ] Verify: Auto-hide after 5 seconds

### Test 5.5: Loading States
- [ ] Run large experiment
- [ ] Verify: Loading indicator shows
- [ ] Verify: UI doesn't freeze

## Test Suite 6: API & Backend

### Test 6.1: API Endpoints
- [ ] Open browser console
- [ ] Check network tab during operations
- [ ] Verify: Correct endpoints called
- [ ] Verify: Proper HTTP methods used
- [ ] Verify: Response format correct

### Test 6.2: Database Persistence
- [ ] Perform several operations
- [ ] Check MongoDB:
  ```bash
  mongosh
  use rbtree_visualizer
  db.operationlogs.find().limit(5)
  ```
- [ ] Verify: Operations logged

### Test 6.3: Error Responses
- [ ] Send invalid API request
- [ ] Verify: Proper error response
- [ ] Verify: Error code and message

## Test Suite 7: Performance

### Test 7.1: Large Tree Performance
- [ ] Insert 500 nodes
- [ ] Verify: Operations remain fast
- [ ] Verify: Rendering smooth

### Test 7.2: Multiple Experiments
- [ ] Run 3 experiments back-to-back
- [ ] Verify: No memory leaks
- [ ] Verify: Performance consistent

### Test 7.3: Animation Performance
- [ ] Enable manual mode
- [ ] Step through 20+ steps
- [ ] Verify: No lag or stuttering

## Test Suite 8: Data Integrity

### Test 8.1: Tree Invariants
After any operation:
- [ ] Root is black
- [ ] Red nodes have black children
- [ ] All paths have equal black-height
- [ ] BST ordering maintained

### Test 8.2: Metrics Accuracy
- [ ] Compare displayed metrics with actual tree
- [ ] Verify: Height correct
- [ ] Verify: Size correct
- [ ] Verify: Rotation count accurate

### Test 8.3: Export/Import
- [ ] Perform operations
- [ ] Export tree
- [ ] Reset tree
- [ ] Import saved tree
- [ ] Verify: Tree restored correctly

## Regression Testing

After any code changes, run:
- [ ] All Test Suite 1 tests
- [ ] Test 2.1, 2.4
- [ ] Test 3.1, 3.5
- [ ] All edge cases (Suite 4)

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Performance Benchmarks

Expected performance:
- Insert operation: < 50ms
- Delete operation: < 50ms
- Search operation: < 10ms
- Tree rendering: < 200ms
- Experiment (100 nodes): < 5s

## Bug Report Template

If you find a bug:
```
**Description**: 
**Steps to Reproduce**:
1. 
2. 
3. 
**Expected Behavior**:
**Actual Behavior**:
**Browser**: 
**Console Errors**: 
```

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Smooth animations
✅ Accurate calculations
✅ Proper error handling
✅ Good performance

---

**Testing Status**: Ready for comprehensive testing
**Last Updated**: Project completion

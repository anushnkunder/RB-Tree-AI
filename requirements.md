# Requirements Document

## Introduction

The Red-Black Tree Visualizer is a full-stack web application that provides interactive visualization and performance analysis of Red-Black Tree data structures. The system enables users to visualize tree operations with animated balancing steps, compare performance across different tree implementations (Red-Black, AVL, BST), and analyze height growth patterns through automated experiments with linear regression analysis.

## Glossary

- **RB_Tree**: Red-Black Tree implementation with self-balancing properties
- **AVL_Tree**: AVL Tree implementation with strict height-balancing properties
- **BST**: Basic Binary Search Tree without self-balancing
- **Visualization_Engine**: D3.js-based rendering system for tree animations
- **Backend_API**: Express.js REST API handling tree operations and data persistence
- **Operation_Log**: MongoDB collection storing operation history and metrics
- **Analytics_Engine**: JavaScript-based system for generating experiments and computing regression analysis
- **Animation_Controller**: Frontend component managing animation playback and step control
- **Performance_Comparator**: System component comparing metrics across tree types
- **Pattern_Generator**: Component generating insertion sequences with specific patterns

## Requirements

### Requirement 1: Red-Black Tree Operations

**User Story:** As a user, I want to perform insert, delete, and search operations on a Red-Black Tree, so that I can understand how the tree maintains balance through these operations.

#### Acceptance Criteria

1. WHEN a user submits an insert operation with a valid integer value, THE Backend_API SHALL insert the value into the RB_Tree and return the complete balancing step sequence
2. WHEN a user attempts to insert a duplicate value, THE Backend_API SHALL reject the operation and return an error message
3. WHEN a user submits a delete operation with an existing value, THE Backend_API SHALL remove the value from the RB_Tree and return the balancing step sequence
4. WHEN a user submits a search operation, THE Backend_API SHALL return whether the value exists and highlight the search path
5. WHEN the RB_Tree exceeds 1000 nodes, THE Backend_API SHALL reject further insert operations and return a size limit error
6. THE RB_Tree SHALL maintain all Red-Black Tree properties after every operation: root is black, red nodes have black children, all paths have equal black-height, and all nodes satisfy BST ordering

### Requirement 2: Animated Visualization

**User Story:** As a user, I want to see smooth animated visualizations of tree operations, so that I can understand the step-by-step balancing process.

#### Acceptance Criteria

1. WHEN the Backend_API returns a balancing step sequence, THE Visualization_Engine SHALL render each step with smooth animations between states
2. WHEN a rotation occurs, THE Visualization_Engine SHALL animate nodes moving to their new positions with smooth transitions
3. WHEN a recolor occurs, THE Visualization_Engine SHALL animate the color transition from red to black or black to red
4. WHEN edges are updated during rotations, THE Visualization_Engine SHALL animate edge removal and creation smoothly
5. THE Visualization_Engine SHALL display current metrics during animation: node colors, rotation counter, tree height, and black-height
6. WHEN an operation completes, THE Visualization_Engine SHALL display the final balanced tree state

### Requirement 3: Animation Control Modes

**User Story:** As a user, I want to control animation playback, so that I can study balancing steps at my own pace.

#### Acceptance Criteria

1. THE Animation_Controller SHALL provide Auto-Play Mode as the default animation mode
2. WHERE Manual Step Mode is enabled, THE Animation_Controller SHALL provide Next Step, Previous Step, Play, and Pause controls
3. WHEN a user clicks Next Step in Manual Step Mode, THE Animation_Controller SHALL advance to the next balancing step and pause
4. WHEN a user clicks Previous Step in Manual Step Mode, THE Animation_Controller SHALL return to the previous balancing step
5. WHEN a user clicks Play in Manual Step Mode, THE Animation_Controller SHALL resume automatic step progression
6. WHEN a user clicks Pause during playback, THE Animation_Controller SHALL stop at the current step

### Requirement 4: Balancing Case Identification

**User Story:** As a user, I want to see which balancing cases are triggered during operations, so that I can learn Red-Black Tree balancing algorithms.

#### Acceptance Criteria

1. WHEN Case 1 (Uncle Red) is triggered during insertion, THE Backend_API SHALL include case identification in the step sequence and THE Visualization_Engine SHALL highlight the affected nodes
2. WHEN Case 2 (Uncle Black, Triangle Configuration) is triggered, THE Backend_API SHALL include case identification and THE Visualization_Engine SHALL highlight the rotation
3. WHEN Case 3 (Uncle Black, Line Configuration) is triggered, THE Backend_API SHALL include case identification and THE Visualization_Engine SHALL highlight the rotation and recolor
4. THE Visualization_Engine SHALL display case names prominently during animation: "Case 1: Uncle Red", "Case 2: Triangle", "Case 3: Line"

### Requirement 5: Operation History Panel

**User Story:** As a user, I want to see a live log of all operations and balancing steps, so that I can review the sequence of actions taken.

#### Acceptance Criteria

1. WHEN any operation is performed, THE Operation_History_Panel SHALL append a new entry with operation type and value
2. WHEN a balancing case is triggered, THE Operation_History_Panel SHALL append the case name and affected nodes
3. WHEN a recolor occurs, THE Operation_History_Panel SHALL append the recolor action with node value and color change
4. WHEN a rotation occurs, THE Operation_History_Panel SHALL append the rotation type (left or right) and pivot node
5. THE Operation_History_Panel SHALL display entries in chronological order with the most recent at the bottom
6. THE Operation_History_Panel SHALL auto-scroll to show the latest entry

### Requirement 6: Performance Comparison Mode

**User Story:** As a user, I want to compare performance metrics across Red-Black Trees, AVL Trees, and BSTs, so that I can understand the trade-offs between different tree implementations.

#### Acceptance Criteria

1. WHEN a user enters Performance Mode, THE Performance_Comparator SHALL accept an insertion sequence and apply it to all three tree types
2. WHEN operations complete on all three trees, THE Performance_Comparator SHALL display metrics in table format: tree height, rotation count, execution time, and recolor count (RB only)
3. WHEN the user requests graph format, THE Performance_Comparator SHALL render a height vs nodes graph for all three tree types
4. WHEN the user enables Side-by-Side View, THE Visualization_Engine SHALL render all three tree structures simultaneously with visual alignment
5. THE Performance_Comparator SHALL ensure the same insertion sequence is applied to all three trees for fair comparison
6. THE Performance_Comparator SHALL highlight performance differences: lowest height, fewest rotations, fastest execution

### Requirement 7: AI Analytics and Pattern Analysis

**User Story:** As a user, I want to run automated experiments with different insertion patterns, so that I can analyze height growth trends and validate theoretical complexity.

#### Acceptance Criteria

1. WHEN a user selects a pattern type (Random, Sorted, Reverse Sorted, Alternating High-Low), THE Pattern_Generator SHALL generate an insertion sequence matching that pattern
2. WHEN a user initiates an experiment, THE Analytics_Engine SHALL execute multiple trials with the selected pattern and collect height metrics
3. WHEN experiment data is collected, THE Analytics_Engine SHALL compute linear regression manually using JavaScript without external ML libraries
4. WHEN regression is complete, THE Analytics_Engine SHALL display plots: Nodes vs Height, Rotations vs Nodes, Recolors vs Nodes
5. THE Analytics_Engine SHALL overlay the theoretical O(log n) curve on the Nodes vs Height plot for comparison
6. THE Analytics_Engine SHALL display regression statistics: slope, intercept, R-squared value

### Requirement 8: Data Persistence and History

**User Story:** As a developer, I want to persist operation logs to MongoDB, so that I can analyze historical patterns and retrieve past experiments.

#### Acceptance Criteria

1. WHEN any tree operation completes, THE Backend_API SHALL store an operation log entry in the Operation_Log with: treeType, operation, value, rotations, recolors, heightAfterOperation, and timestamp
2. THE Operation_Log SHALL maintain indexes on treeType and timestamp fields for query performance
3. WHEN a user requests operation history, THE Backend_API SHALL retrieve logs from the Operation_Log filtered by tree type and time range
4. THE Backend_API SHALL validate all operation log entries before insertion to ensure schema compliance

### Requirement 9: Export and Import Functionality

**User Story:** As a user, I want to export and import operation sequences as JSON, so that I can save interesting tree configurations and share them with others.

#### Acceptance Criteria

1. WHEN a user clicks Export, THE Backend_API SHALL generate a JSON file containing the complete operation sequence with metadata: tree type, operations array, timestamp
2. WHEN a user uploads a JSON file, THE Backend_API SHALL validate the file format and operation sequence
3. WHEN a valid JSON file is imported, THE Backend_API SHALL replay the operation sequence and return the final tree state with all intermediate steps
4. IF an imported JSON file contains invalid operations or format errors, THEN THE Backend_API SHALL return a descriptive error message and reject the import

### Requirement 10: User Interface and Navigation

**User Story:** As a user, I want a clean, intuitive interface with tab-based navigation, so that I can easily switch between visualization, performance, and analytics modes.

#### Acceptance Criteria

1. THE Frontend SHALL provide three navigation tabs: Visualization, Performance, and AI Analysis
2. WHEN a user clicks a tab, THE Frontend SHALL switch to that mode and preserve the state of other tabs
3. THE Frontend SHALL use a dark theme with high contrast for tree visualization
4. THE Frontend SHALL provide responsive layout that adapts to different screen sizes
5. WHEN any operation fails, THE Frontend SHALL display error messages clearly without disrupting the interface

### Requirement 11: API Endpoints and Backend Structure

**User Story:** As a developer, I want well-defined REST API endpoints, so that the frontend can communicate with the backend reliably.

#### Acceptance Criteria

1. THE Backend_API SHALL provide POST /insert endpoint accepting treeType and value, returning step sequence and updated tree state
2. THE Backend_API SHALL provide POST /delete endpoint accepting treeType and value, returning step sequence and updated tree state
3. THE Backend_API SHALL provide GET /tree endpoint accepting treeType, returning current tree structure
4. THE Backend_API SHALL provide GET /performance endpoint accepting operation sequence, returning comparison metrics for all three tree types
5. THE Backend_API SHALL provide GET /history endpoint accepting treeType and optional time range, returning operation logs
6. THE Backend_API SHALL validate all request parameters and return appropriate HTTP status codes: 200 for success, 400 for validation errors, 500 for server errors

### Requirement 12: Tree Implementation Correctness

**User Story:** As a developer, I want correct implementations of Red-Black Trees, AVL Trees, and BSTs, so that the visualizations and comparisons are accurate.

#### Acceptance Criteria

1. THE RB_Tree SHALL maintain the red-black property: every path from root to leaf contains the same number of black nodes
2. THE RB_Tree SHALL maintain the red-node property: red nodes have only black children
3. THE RB_Tree SHALL maintain the root property: the root node is always black
4. THE AVL_Tree SHALL maintain the AVL property: for every node, the height difference between left and right subtrees is at most 1
5. THE BST SHALL maintain the BST property: for every node, all left descendants are smaller and all right descendants are larger
6. WHEN any tree operation completes, THE tree SHALL maintain its respective invariant properties

### Requirement 13: Project Setup and Deployment

**User Story:** As a developer, I want clear setup instructions and a working development environment, so that I can run the application immediately after cloning.

#### Acceptance Criteria

1. THE project SHALL include a README with setup instructions: npm install, MongoDB connection setup, and npm start command
2. WHEN a developer runs npm install, THE project SHALL install all required dependencies without errors
3. WHEN a developer runs npm start, THE Backend_API SHALL start on a configurable port (default 3000) and THE Frontend SHALL be accessible
4. THE project SHALL include a .env.example file with required environment variables: MONGODB_URI, PORT
5. THE project SHALL organize code into the specified structure: backend/ with models, routes, controllers, trees subdirectories, and frontend/ with js, css subdirectories

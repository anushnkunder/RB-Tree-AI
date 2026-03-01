# Red-Black Tree Visualizer

An interactive full-stack web application for visualizing Red-Black Tree operations, comparing performance across different tree implementations, and analyzing height growth patterns with automated experiments.

## Features

### 🎨 Visualization Mode
- Interactive insert, delete, and search operations
- Step-by-step animated balancing with D3.js
- Case highlighting (Case 1, 2, 3)
- Auto-play and manual step-through modes
- Real-time operation history panel

### 📊 Performance Mode
- Side-by-side comparison of RB Tree, AVL Tree, and BST
- Metrics: height, rotations, recolors, execution time
- Table and graph visualizations
- User-defined or random insertion sequences

### 🤖 AI Analytics Mode
- Automated experiments with pattern generation
- Patterns: Random, Sorted, Reverse Sorted, Alternating
- Manual linear regression implementation
- Theoretical O(log n) curve comparison
- Multiple trial analysis

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript, D3.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Analytics**: Pure JavaScript (no external ML libraries)

## Prerequisites

- Node.js v18 or higher
- MongoDB v6 or higher
- npm v8 or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd red-black-tree-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure MongoDB URI in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/rbtree_visualizer
```

5. Start MongoDB service:
```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Or use MongoDB Compass/Atlas
```

6. Start the application:
```bash
npm start
```

7. Open your browser:
```
http://localhost:3000
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Project Structure

```
red-black-tree-visualizer/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── trees/            # Tree implementations
│   ├── analytics/        # Pattern generation & regression
│   ├── utils/            # Utilities
│   ├── config/           # Configuration
│   └── server.js         # Entry point
├── frontend/
│   ├── js/               # JavaScript modules
│   ├── css/              # Stylesheets
│   └── index.html        # Main HTML
└── README.md
```

## API Endpoints

### Tree Operations
- `POST /api/insert` - Insert value into tree
- `POST /api/delete` - Delete value from tree
- `GET /api/tree/:treeType` - Get current tree state
- `POST /api/search` - Search for value

### Performance
- `POST /api/performance` - Compare tree performance

### Analytics
- `POST /api/analytics/experiment` - Run experiment

### History
- `GET /api/history` - Get operation logs

### Export/Import
- `POST /api/export` - Export tree state
- `POST /api/import` - Import tree state

## Usage

### Visualization Mode
1. Enter a value in the input field
2. Click Insert/Delete/Search
3. Watch the animated balancing process
4. Toggle Manual Mode for step-by-step control

### Performance Mode
1. Enter a comma-separated sequence (e.g., 10,20,30,15,5)
2. Click "Compare Trees"
3. View metrics table and graphs
4. Enable side-by-side view

### Analytics Mode
1. Select a pattern type
2. Set number of trials and max nodes
3. Click "Run Experiment"
4. View plots and regression statistics

## Features in Detail

### Red-Black Tree Properties
- Root is always black
- Red nodes have black children
- All paths have equal black-height
- BST ordering maintained

### Balancing Cases
- **Case 1**: Uncle is Red → Recolor
- **Case 2**: Uncle is Black, Triangle → Rotate to Case 3
- **Case 3**: Uncle is Black, Line → Rotate and recolor

### Pattern Generators
- **Random**: Random insertion order
- **Sorted**: Ascending order (worst case for BST)
- **Reverse Sorted**: Descending order
- **Alternating**: High-low alternating pattern

## Limitations

- Maximum tree size: 1000 nodes
- No duplicate values allowed
- Single user session (no multi-user support)

## Contributing

Contributions are welcome! Please follow the existing code structure and style.

## License

MIT License

## Acknowledgments

Built as an educational tool for understanding Red-Black Tree balancing techniques and performance characteristics.

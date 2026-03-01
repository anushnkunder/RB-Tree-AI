# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ MongoDB v6+ installed and running
- ✅ npm v8+ installed

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Make sure MongoDB is running:

```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 3. Configure Environment

The `.env` file is already created with default settings:
- Port: 3000
- MongoDB URI: mongodb://localhost:27017/rbtree_visualizer

If you need to change these, edit the `.env` file.

### 4. Start the Application

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 5. Open in Browser

Navigate to: `http://localhost:3000`

## First Steps

### Tab 1: Visualization Mode
1. Enter a value (e.g., 10)
2. Click "Insert"
3. Watch the animated balancing!
4. Try inserting: 20, 30, 15, 5
5. Toggle "Manual Step Mode" for step-by-step control

### Tab 2: Performance Mode
1. Enter sequence: `10,20,30,15,5,25,35,12,18`
2. Click "Compare Trees"
3. View the comparison table and graph
4. Enable "Show Side-by-Side Trees" to see all three trees

### Tab 3: AI Analytics Mode
1. Select pattern: "Random"
2. Set trials: 10
3. Set max nodes: 100
4. Click "Run Experiment"
5. View the regression analysis and plots

## Testing the Features

### Test Case 1: Red-Black Tree Balancing Cases

Insert these values in order to see different cases:
```
10 → 20 → 30 (Case 3: Line configuration)
15 (Case 1: Uncle Red)
5 (Case 2: Triangle configuration)
```

### Test Case 2: Performance Comparison

Sorted sequence (worst for BST):
```
1,2,3,4,5,6,7,8,9,10
```

Random sequence:
```
45,23,67,12,89,34,56,78,90,11
```

### Test Case 3: Analytics Patterns

- **Random**: Normal distribution
- **Sorted**: Worst case for BST, best for RB/AVL
- **Reverse**: Similar to sorted
- **Alternating**: Interesting pattern analysis

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: Make sure MongoDB is running and the URI in `.env` is correct.

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Change PORT in `.env` file or stop the process using port 3000.

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` again.

## Project Structure Overview

```
red-black-tree-visualizer/
├── backend/              # Node.js + Express backend
│   ├── trees/           # RB, AVL, BST implementations
│   ├── analytics/       # Pattern generation & regression
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   └── models/          # MongoDB schemas
├── frontend/            # Vanilla JS + D3.js frontend
│   ├── js/             # JavaScript modules
│   └── css/            # Stylesheets
└── README.md           # Full documentation
```

## API Endpoints

- `POST /api/insert` - Insert value
- `POST /api/delete` - Delete value
- `POST /api/search` - Search value
- `GET /api/tree/:type` - Get tree state
- `POST /api/performance/compare` - Compare trees
- `POST /api/analytics/experiment` - Run experiment
- `GET /api/history` - Get operation logs

## Next Steps

1. ✅ Explore all three modes
2. ✅ Try different insertion patterns
3. ✅ Compare tree performance
4. ✅ Run analytics experiments
5. ✅ Export/import tree states

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the design.md for architecture details
3. Check the requirements.md for feature specifications

Happy visualizing! 🌳

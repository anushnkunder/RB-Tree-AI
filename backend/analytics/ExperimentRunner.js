const RBTree = require('../trees/RBTree');
const PatternGenerator = require('./PatternGenerator');
const LinearRegression = require('./LinearRegression');

class ExperimentRunner {
  constructor() {
    this.patternGenerator = new PatternGenerator();
  }

  // Run experiment with specified pattern
  async runExperiment(pattern, trials, maxNodes) {
    const allDataPoints = [];

    for (let trial = 0; trial < trials; trial++) {
      const tree = new RBTree();
      const sequence = this.patternGenerator.generate(pattern, maxNodes);

      // Collect data at intervals
      const interval = Math.max(1, Math.floor(maxNodes / 50)); // Collect ~50 data points

      for (let i = 0; i < sequence.length; i++) {
        try {
          tree.insert(sequence[i]);

          // Collect metrics at intervals
          if ((i + 1) % interval === 0 || i === sequence.length - 1) {
            const metrics = tree.getMetrics();
            allDataPoints.push({
              nodes: tree.size,
              height: metrics.height,
              rotations: metrics.rotations,
              recolors: metrics.recolors
            });
          }
        } catch (error) {
          // Skip if error occurs
          continue;
        }
      }
    }

    // Average data points across trials
    const aggregatedData = this.aggregateDataPoints(allDataPoints);

    // Compute linear regression
    const xValues = aggregatedData.map(d => d.nodes);
    const yValues = aggregatedData.map(d => d.height);

    const regression = new LinearRegression();
    const regressionStats = regression.fit(xValues, yValues);

    // Generate theoretical O(log n) curve
    const theoretical = this.generateTheoreticalCurve(maxNodes);

    return {
      pattern,
      trials,
      dataPoints: aggregatedData,
      regression: {
        ...regressionStats,
        equation: regression.getEquation()
      },
      theoretical
    };
  }

  // Aggregate data points by averaging
  aggregateDataPoints(dataPoints) {
    const grouped = {};

    dataPoints.forEach(point => {
      if (!grouped[point.nodes]) {
        grouped[point.nodes] = {
          nodes: point.nodes,
          heights: [],
          rotations: [],
          recolors: []
        };
      }
      grouped[point.nodes].heights.push(point.height);
      grouped[point.nodes].rotations.push(point.rotations);
      grouped[point.nodes].recolors.push(point.recolors);
    });

    return Object.values(grouped).map(group => ({
      nodes: group.nodes,
      height: this.average(group.heights),
      rotations: this.average(group.rotations),
      recolors: this.average(group.recolors)
    })).sort((a, b) => a.nodes - b.nodes);
  }

  // Calculate average
  average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // Generate theoretical O(log n) curve
  generateTheoreticalCurve(maxNodes) {
    const points = [];
    const step = Math.max(1, Math.floor(maxNodes / 50));

    for (let n = 1; n <= maxNodes; n += step) {
      // Theoretical RB Tree height: 2 * log₂(n + 1)
      const height = 2 * Math.log2(n + 1);
      points.push({ nodes: n, height: Math.round(height * 100) / 100 });
    }

    return points;
  }

  // Collect metrics for a tree
  collectMetrics(tree, operations) {
    const metrics = {
      heights: [],
      rotations: [],
      recolors: []
    };

    operations.forEach(op => {
      try {
        if (op.type === 'insert') {
          tree.insert(op.value);
        } else if (op.type === 'delete') {
          tree.delete(op.value);
        }

        const treeMetrics = tree.getMetrics();
        metrics.heights.push(treeMetrics.height);
        metrics.rotations.push(treeMetrics.rotations);
        metrics.recolors.push(treeMetrics.recolors || 0);
      } catch (error) {
        // Skip on error
      }
    });

    return metrics;
  }
}

module.exports = ExperimentRunner;

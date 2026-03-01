// Main application entry point

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌳 Red-Black Tree Visualizer initialized');

  // Initialize tab manager
  const tabManager = new TabManager();

  // Initialize controllers
  const visualizationController = new VisualizationController();
  const performanceController = new PerformanceController();
  const analyticsController = new AnalyticsController();

  console.log('✅ All controllers initialized');
  console.log('📊 Ready to visualize Red-Black Trees!');
});

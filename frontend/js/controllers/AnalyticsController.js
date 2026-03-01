// Analytics Mode Controller

class AnalyticsController {
  constructor() {
    this.errorDisplay = new ErrorDisplay('analytics-error');
    this.currentResults = null;
    this.initControls();
  }

  initControls() {
    document.getElementById('run-experiment-btn').addEventListener('click', () => this.handleRunExperiment());
    document.getElementById('export-results-btn').addEventListener('click', () => this.handleExportResults());
  }

  async handleRunExperiment() {
    const pattern = document.getElementById('pattern-select').value;
    const trials = parseInt(document.getElementById('trials-input').value);
    const maxNodes = parseInt(document.getElementById('max-nodes-input').value);

    if (isNaN(trials) || trials < 1 || trials > 100) {
      this.errorDisplay.show('Trials must be between 1 and 100');
      return;
    }

    if (isNaN(maxNodes) || maxNodes < 10 || maxNodes > 1000) {
      this.errorDisplay.show('Max nodes must be between 10 and 1000');
      return;
    }

    this.errorDisplay.clear();

    // Show loading indicator
    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('analytics-results').style.display = 'none';

    try {
      const result = await api.runExperiment(pattern, trials, maxNodes);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        document.getElementById('loading-indicator').style.display = 'none';
        return;
      }

      this.currentResults = result.data;

      // Hide loading, show results
      document.getElementById('loading-indicator').style.display = 'none';
      document.getElementById('analytics-results').style.display = 'block';
      document.getElementById('export-results-btn').style.display = 'inline-block';

      // Render results
      this.renderStatistics(result.data);
      this.renderHeightPlot(result.data);
      this.renderRotationsPlot(result.data);
      this.renderRecolorsPlot(result.data);
    } catch (error) {
      this.errorDisplay.show('Failed to run experiment');
      document.getElementById('loading-indicator').style.display = 'none';
      console.error(error);
    }
  }

  renderStatistics(data) {
    const statsDiv = document.getElementById('regression-stats');
    statsDiv.innerHTML = '';

    const stats = [
      { label: 'Pattern', value: data.pattern.charAt(0).toUpperCase() + data.pattern.slice(1) },
      { label: 'Trials', value: data.trials },
      { label: 'Regression Equation', value: data.regression.equation },
      { label: 'R² Value', value: formatters.formatDecimal(data.regression.rSquared, 4) },
      { label: 'Slope', value: formatters.formatDecimal(data.regression.slope, 4) },
      { label: 'Intercept', value: formatters.formatDecimal(data.regression.intercept, 4) }
    ];

    stats.forEach(stat => {
      const item = document.createElement('div');
      item.className = 'stat-item';
      item.innerHTML = `
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      `;
      statsDiv.appendChild(item);
    });
  }

  renderHeightPlot(data) {
    const svg = d3.select('#height-plot');
    chartHelpers.clearSVG(svg);

    const svgNode = svg.node();
    const width = svgNode ? (svgNode.clientWidth || 800) : 800;
    const height = svgNode ? (svgNode.clientHeight || 350) : 350;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    console.log('Rendering height plot...');
    console.log('SVG dimensions:', width, height);
    console.log('Data points:', data.dataPoints.length);

    // Prepare data
    const actualData = data.dataPoints.map(d => ({ x: d.nodes, y: d.height }));
    const theoreticalData = data.theoretical.map(d => ({ x: d.nodes, y: d.height }));

    console.log('Actual data:', actualData.slice(0, 3));
    console.log('Theoretical data:', theoreticalData.slice(0, 3));

    // Create regression line data
    const regressionData = actualData.map(d => ({
      x: d.x,
      y: data.regression.slope * d.x + data.regression.intercept
    }));

    console.log('Regression data:', regressionData.slice(0, 3));

    // Create scales
    const allData = [...actualData, ...theoreticalData];
    const xExtent = d3.extent(allData, d => d.x);
    const yExtent = d3.extent(allData, d => d.y);

    const xScale = d3.scaleLinear()
      .domain([0, xExtent[1]])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] * 1.1])
      .range([height - margin.bottom, margin.top]);

    // Add grid lines
    chartHelpers.addGridLines(svg, xScale, yScale, width, height, margin);

    // Draw theoretical line (first, so it's in back)
    chartHelpers.drawLine(svg, theoreticalData, xScale, yScale, 'theoretical');

    // Draw regression line (middle layer)
    chartHelpers.drawLine(svg, regressionData, xScale, yScale, 'regression');

    // Draw actual data line (last, so it's on top)
    chartHelpers.drawLine(svg, actualData, xScale, yScale, 'actual');

    // Draw actual data points (on top of everything)
    chartHelpers.drawDots(svg, actualData, xScale, yScale, 'actual');

    // Add axes
    chartHelpers.createAxes(svg, xScale, yScale, width, height, margin, 'Number of Nodes', 'Tree Height');

    // Add legend
    this.addLegend(svg, width, margin);
  }

  renderRotationsPlot(data) {
    const svg = d3.select('#rotations-plot');
    chartHelpers.clearSVG(svg);

    const svgNode = svg.node();
    const width = svgNode ? (svgNode.clientWidth || 800) : 800;
    const height = svgNode ? (svgNode.clientHeight || 300) : 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    const plotData = data.dataPoints.map(d => ({ x: d.nodes, y: d.rotations }));

    const xExtent = d3.extent(plotData, d => d.x);
    const yExtent = d3.extent(plotData, d => d.y);

    const xScale = d3.scaleLinear()
      .domain([0, xExtent[1]])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] * 1.1])
      .range([height - margin.bottom, margin.top]);

    chartHelpers.addGridLines(svg, xScale, yScale, width, height, margin);
    chartHelpers.drawLine(svg, plotData, xScale, yScale, 'actual');
    chartHelpers.drawDots(svg, plotData, xScale, yScale, 'actual');
    chartHelpers.createAxes(svg, xScale, yScale, width, height, margin, 'Number of Nodes', 'Rotations');
  }

  renderRecolorsPlot(data) {
    const svg = d3.select('#recolors-plot');
    chartHelpers.clearSVG(svg);

    const svgNode = svg.node();
    const width = svgNode ? (svgNode.clientWidth || 800) : 800;
    const height = svgNode ? (svgNode.clientHeight || 300) : 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

    const plotData = data.dataPoints.map(d => ({ x: d.nodes, y: d.recolors }));

    const xExtent = d3.extent(plotData, d => d.x);
    const yExtent = d3.extent(plotData, d => d.y);

    const xScale = d3.scaleLinear()
      .domain([0, xExtent[1]])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] * 1.1])
      .range([height - margin.bottom, margin.top]);

    chartHelpers.addGridLines(svg, xScale, yScale, width, height, margin);
    chartHelpers.drawLine(svg, plotData, xScale, yScale, 'actual');
    chartHelpers.drawDots(svg, plotData, xScale, yScale, 'actual');
    chartHelpers.createAxes(svg, xScale, yScale, width, height, margin, 'Number of Nodes', 'Recolors');
  }

  addLegend(svg, width, margin) {
    const legendData = [
      { label: 'Actual Data', class: 'actual' },
      { label: 'Linear Regression', class: 'regression' },
      { label: 'Theoretical O(log n)', class: 'theoretical' }
    ];

    const legend = svg.append('g')
      .attr('class', 'plot-legend')
      .attr('transform', `translate(${width / 2 - 200}, 10)`);

    legendData.forEach((item, i) => {
      const g = legend.append('g')
        .attr('transform', `translate(${i * 150}, 0)`);

      // Draw line sample
      g.append('line')
        .attr('class', `plot-line ${item.class}`)
        .attr('x1', 0)
        .attr('x2', 40)
        .attr('y1', 0)
        .attr('y2', 0);

      // Add dot for actual data
      if (item.class === 'actual') {
        g.append('circle')
          .attr('class', 'plot-dot')
          .attr('cx', 20)
          .attr('cy', 0)
          .attr('r', 5);
      }

      // Add label
      g.append('text')
        .attr('x', 45)
        .attr('y', 4)
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '12px')
        .text(item.label);
    });
  }

  handleExportResults() {
    if (!this.currentResults) return;

    const dataStr = JSON.stringify(this.currentResults, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-${this.currentResults.pattern}-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

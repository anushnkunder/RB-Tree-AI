// Performance Mode Controller

class PerformanceController {
  constructor() {
    this.errorDisplay = new ErrorDisplay('performance-error');
    this.lastComparison = null;
    this.initControls();
  }

  initControls() {
    document.getElementById('compare-btn').addEventListener('click', () => this.handleCompare());
    document.getElementById('generate-random-btn').addEventListener('click', () => this.handleGenerateRandom());
    document.getElementById('show-side-by-side').addEventListener('change', (e) => {
      const container = document.getElementById('side-by-side-container');
      if (e.target.checked) {
        container.style.display = 'grid';
        // Re-render if we have comparison data
        if (this.lastComparison) {
          this.renderSideBySide(this.lastComparison);
        }
      } else {
        container.style.display = 'none';
      }
    });
  }

  async handleCompare() {
    const input = document.getElementById('sequence-input');
    const sequenceStr = input.value.trim();

    if (!sequenceStr) {
      this.errorDisplay.show('Please enter a sequence');
      return;
    }

    const sequence = formatters.parseSequence(sequenceStr);

    if (sequence.length === 0) {
      this.errorDisplay.show('Invalid sequence format');
      return;
    }

    this.errorDisplay.clear();

    try {
      const result = await api.comparePerformance(sequence);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        return;
      }

      this.renderComparisonTable(result.comparison);
      this.renderComparisonChart(result.comparison);

      // Save comparison data
      this.lastComparison = result.comparison;

      // Render side-by-side if enabled
      if (document.getElementById('show-side-by-side').checked) {
        document.getElementById('side-by-side-container').style.display = 'grid';
        this.renderSideBySide(result.comparison);
      }
    } catch (error) {
      this.errorDisplay.show('Failed to compare performance');
      console.error(error);
    }
  }

  async handleGenerateRandom() {
    const nodeCount = parseInt(document.getElementById('random-count').value);

    if (isNaN(nodeCount) || nodeCount < 1 || nodeCount > 500) {
      this.errorDisplay.show('Node count must be between 1 and 500');
      return;
    }

    this.errorDisplay.clear();

    try {
      const result = await api.comparePerformance(null, true, nodeCount);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        return;
      }

      // Update sequence input with generated sequence
      document.getElementById('sequence-input').value = result.comparison.sequence.join(', ');

      this.renderComparisonTable(result.comparison);
      this.renderComparisonChart(result.comparison);

      // Save comparison data
      this.lastComparison = result.comparison;

      // Render side-by-side if enabled
      if (document.getElementById('show-side-by-side').checked) {
        document.getElementById('side-by-side-container').style.display = 'grid';
        this.renderSideBySide(result.comparison);
      }
    } catch (error) {
      this.errorDisplay.show('Failed to generate random sequence');
      console.error(error);
    }
  }

  renderComparisonTable(comparison) {
    const tbody = document.getElementById('comparison-tbody');
    tbody.innerHTML = '';

    const trees = ['rb', 'avl', 'bst'];
    const labels = ['RB Tree', 'AVL Tree', 'BST'];

    // Find best values
    const heights = trees.map(t => comparison[t].height);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);

    trees.forEach((tree, index) => {
      const data = comparison[tree];
      const row = tbody.insertRow();

      row.insertCell().textContent = labels[index];
      
      const heightCell = row.insertCell();
      heightCell.textContent = data.height;
      if (data.height === minHeight) heightCell.classList.add('best-value');
      if (data.height === maxHeight && minHeight !== maxHeight) heightCell.classList.add('worst-value');

      row.insertCell().textContent = data.rotations || 0;
      row.insertCell().textContent = data.recolors || '-';
      row.insertCell().textContent = data.executionTime;
      row.insertCell().textContent = data.size;
    });
  }

  renderComparisonChart(comparison) {
    const svg = d3.select('#comparison-chart');
    chartHelpers.clearSVG(svg);

    const width = parseInt(svg.style('width'));
    const height = parseInt(svg.style('height'));
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Prepare data
    const data = [
      { tree: 'RB Tree', height: comparison.rb.height, class: 'rb' },
      { tree: 'AVL Tree', height: comparison.avl.height, class: 'avl' },
      { tree: 'BST', height: comparison.bst.height, class: 'bst' }
    ];

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.tree))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.height) * 1.2])
      .range([height - margin.bottom, margin.top]);

    // Draw bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', d => `bar ${d.class}`)
      .attr('x', d => xScale(d.tree))
      .attr('y', d => yScale(d.height))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.height))
      .attr('fill', d => {
        if (d.class === 'rb') return 'var(--accent-primary)';
        if (d.class === 'avl') return 'var(--info)';
        return 'var(--warning)';
      });

    // Add value labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.tree) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.height) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .text(d => d.height);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .text('Tree Height');
  }

  renderSideBySide(comparison) {
    // Show container first, then wait for layout
    const container = document.getElementById('side-by-side-container');
    container.style.display = 'grid';
    
    setTimeout(() => {
      console.log('Rendering side-by-side trees...');
      
      // Render RB Tree
      const rbRenderer = new TreeRenderer('rb-tree-svg');
      console.log('RB dimensions:', rbRenderer.width, rbRenderer.height);
      rbRenderer.renderTree(comparison.rb.tree);

      // Render AVL Tree
      const avlRenderer = new TreeRenderer('avl-tree-svg');
      console.log('AVL dimensions:', avlRenderer.width, avlRenderer.height);
      avlRenderer.renderTree(comparison.avl.tree);

      // Render BST
      const bstRenderer = new TreeRenderer('bst-tree-svg');
      console.log('BST dimensions:', bstRenderer.width, bstRenderer.height);
      bstRenderer.renderTree(comparison.bst.tree);
    }, 200);
  }
}

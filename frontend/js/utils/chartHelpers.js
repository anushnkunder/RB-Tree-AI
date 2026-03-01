// D3.js chart helper functions

const chartHelpers = {
  // Create scales for charts
  createScales(data, width, height, margin) {
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);

    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, yExtent[1] * 1.1])
      .range([height - margin.bottom, margin.top]);

    return { xScale, yScale };
  },

  // Create axes
  createAxes(svg, xScale, yScale, width, height, margin, xLabel, yLabel) {
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

    // X-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .text(xLabel);

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .text(yLabel);
  },

  // Draw line
  drawLine(svg, data, xScale, yScale, className) {
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('class', `plot-line ${className}`)
      .attr('d', line);
  },

  // Draw dots
  drawDots(svg, data, xScale, yScale, className) {
    svg.selectAll(`.plot-dot.${className}`)
      .data(data)
      .enter()
      .append('circle')
      .attr('class', `plot-dot ${className}`)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5);
  },

  // Add grid lines
  addGridLines(svg, xScale, yScale, width, height, margin) {
    // Horizontal grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat('')
      )
      .selectAll('line')
      .attr('class', 'grid-line');

    // Vertical grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat('')
      )
      .selectAll('line')
      .attr('class', 'grid-line');
  },

  // Clear SVG
  clearSVG(svg) {
    svg.selectAll('*').remove();
  }
};

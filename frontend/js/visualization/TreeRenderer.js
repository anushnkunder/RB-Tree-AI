// D3.js Tree Renderer

class TreeRenderer {
  constructor(svgId) {
    this.svg = d3.select(`#${svgId}`);
    this.width = 0;
    this.height = 0;
    this.nodeRadius = 25;
    this.updateDimensions();
    this.init();
  }

  updateDimensions() {
    const svgNode = this.svg.node();
    if (svgNode) {
      const rect = svgNode.getBoundingClientRect();
      this.width = rect.width > 0 ? rect.width : (svgNode.clientWidth || 400);
      this.height = rect.height > 0 ? rect.height : (svgNode.clientHeight || 400);
      
      // Fallback if still 0
      if (this.width === 0) this.width = 400;
      if (this.height === 0) this.height = 400;
    }
  }

  init() {
    this.svg.selectAll('*').remove();
    this.g = this.svg.append('g')
      .attr('transform', `translate(0, 30)`);
  }

  renderTree(treeData) {
    if (!treeData) {
      this.clear();
      return;
    }

    this.updateDimensions();

    // Create hierarchy
    const root = d3.hierarchy(this.convertToHierarchy(treeData));
    
    // Create tree layout
    const treeLayout = d3.tree()
      .size([this.width - 100, this.height - 150])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    treeLayout(root);

    const nodes = root.descendants();
    const links = root.links();

    // Draw links first (so they appear behind nodes)
    const linkSelection = this.g.selectAll('.link')
      .data(links, d => `${d.source.data.value}-${d.target.data.value}`);

    // Remove old links
    linkSelection.exit().remove();

    // Add new links
    linkSelection.enter()
      .append('path')
      .attr('class', 'link')
      .merge(linkSelection)
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
      );

    // Draw nodes
    const nodeSelection = this.g.selectAll('.node')
      .data(nodes, d => d.data.value);

    // Remove old nodes
    nodeSelection.exit().remove();

    // Add new nodes
    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', d => `node ${d.data.color ? d.data.color.toLowerCase() : 'black'}`);

    nodeEnter.append('circle')
      .attr('r', this.nodeRadius);

    nodeEnter.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.value);

    // Update all nodes (new + existing)
    nodeEnter.merge(nodeSelection)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('class', d => `node ${d.data.color ? d.data.color.toLowerCase() : 'black'}`);
  }

  convertToHierarchy(node) {
    if (!node) return null;

    const result = {
      value: node.value,
      color: node.color || 'BLACK'
    };

    const children = [];
    if (node.left) children.push(this.convertToHierarchy(node.left));
    if (node.right) children.push(this.convertToHierarchy(node.right));

    if (children.length > 0) {
      result.children = children;
    }

    return result;
  }

  highlightNodes(nodeValues, color = '#f1c40f') {
    this.g.selectAll('.node')
      .classed('highlighted', d => nodeValues.includes(d.data.value));
  }

  clearHighlights() {
    this.g.selectAll('.node')
      .classed('highlighted', false);
  }

  highlightPath(path) {
    // Highlight nodes in search path
    this.g.selectAll('.node')
      .classed('highlighted', d => path.includes(d.data.value));
  }

  clear() {
    this.g.selectAll('*').remove();
  }

  animateInsertion(value) {
    this.g.selectAll('.node')
      .filter(d => d.data.value === value)
      .classed('inserting', true)
      .transition()
      .duration(500)
      .on('end', function() {
        d3.select(this).classed('inserting', false);
      });
  }

  animateRecolor(value) {
    this.g.selectAll('.node')
      .filter(d => d.data.value === value)
      .classed('recoloring', true)
      .transition()
      .duration(800)
      .on('end', function() {
        d3.select(this).classed('recoloring', false);
      });
  }

  animateRotation(value) {
    this.g.selectAll('.node')
      .filter(d => d.data.value === value)
      .classed('rotating', true)
      .transition()
      .duration(600)
      .on('end', function() {
        d3.select(this).classed('rotating', false);
      });
  }
}

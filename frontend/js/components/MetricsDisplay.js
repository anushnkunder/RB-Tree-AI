// Metrics display component

class MetricsDisplay {
  constructor() {
    this.heightEl = document.getElementById('height-value');
    this.blackHeightEl = document.getElementById('black-height-value');
    this.rotationsEl = document.getElementById('rotations-value');
    this.recolorsEl = document.getElementById('recolors-value');
    this.sizeEl = document.getElementById('size-value');
  }

  update(metrics) {
    if (metrics.height !== undefined) {
      this.heightEl.textContent = metrics.height;
    }
    if (metrics.blackHeight !== undefined) {
      this.blackHeightEl.textContent = metrics.blackHeight;
    }
    if (metrics.rotations !== undefined) {
      this.rotationsEl.textContent = metrics.rotations;
    }
    if (metrics.recolors !== undefined) {
      this.recolorsEl.textContent = metrics.recolors;
    }
    if (metrics.size !== undefined) {
      this.sizeEl.textContent = metrics.size;
    }
  }

  reset() {
    this.heightEl.textContent = '0';
    this.blackHeightEl.textContent = '0';
    this.rotationsEl.textContent = '0';
    this.recolorsEl.textContent = '0';
    this.sizeEl.textContent = '0';
  }
}

// Visualization Mode Controller

class VisualizationController {
  constructor() {
    this.treeType = 'RB';
    this.renderer = new TreeRenderer('tree-svg');
    this.historyPanel = new HistoryPanel('history-log');
    this.metricsDisplay = new MetricsDisplay();
    this.errorDisplay = new ErrorDisplay('error-display');
    this.animationController = new AnimationController(this.renderer, this.historyPanel);
    
    this.manualMode = false;
    
    // Track insertion history for time travel
    this.insertionHistory = [];
    this.currentHistoryIndex = -1;
    
    this.initControls();
  }

  initControls() {
    document.getElementById('insert-btn').addEventListener('click', () => this.handleInsert());
    document.getElementById('delete-btn').addEventListener('click', () => this.handleDelete());
    document.getElementById('search-btn').addEventListener('click', () => this.handleSearch());
    document.getElementById('reset-btn').addEventListener('click', () => this.handleReset());
    
    document.getElementById('manual-mode-toggle').addEventListener('change', (e) => {
      this.manualMode = e.target.checked;
      document.getElementById('animation-controls').style.display = 
        this.manualMode ? 'flex' : 'none';
    });

    // History navigation
    document.getElementById('prev-insertion-btn').addEventListener('click', () => this.goToPreviousInsertion());
    document.getElementById('next-insertion-btn').addEventListener('click', () => this.goToNextInsertion());

    // Enter key support
    document.getElementById('value-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleInsert();
      }
    });
    
    this.updateHistoryNavigation();
  }

  updateHistoryNavigation() {
    const prevBtn = document.getElementById('prev-insertion-btn');
    const nextBtn = document.getElementById('next-insertion-btn');
    const counter = document.getElementById('insertion-counter');

    prevBtn.disabled = this.currentHistoryIndex <= 0;
    nextBtn.disabled = this.currentHistoryIndex >= this.insertionHistory.length - 1;

    if (this.insertionHistory.length === 0) {
      counter.textContent = 'No insertions yet';
    } else if (this.currentHistoryIndex === this.insertionHistory.length - 1) {
      counter.textContent = `Current state (${this.insertionHistory.length} insertions)`;
    } else {
      counter.textContent = `Viewing after insertion ${this.currentHistoryIndex + 1} of ${this.insertionHistory.length}`;
    }
  }

  goToPreviousInsertion() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.restoreHistoryState(this.currentHistoryIndex);
    }
  }

  goToNextInsertion() {
    if (this.currentHistoryIndex < this.insertionHistory.length - 1) {
      this.currentHistoryIndex++;
      this.restoreHistoryState(this.currentHistoryIndex);
    }
  }

  restoreHistoryState(index) {
    const state = this.insertionHistory[index];
    this.renderer.renderTree(state.tree);
    this.metricsDisplay.update(state.metrics);
    this.updateHistoryNavigation();
  }

  async handleInsert() {
    const input = document.getElementById('value-input');
    const value = parseInt(input.value);

    if (isNaN(value)) {
      this.errorDisplay.show('Please enter a valid integer value');
      return;
    }

    this.errorDisplay.clear();

    try {
      const result = await api.insert(this.treeType, value);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        return;
      }

      // Save to insertion history
      this.insertionHistory.push({
        tree: result.tree,
        metrics: result.metrics,
        value: value,
        timestamp: new Date()
      });
      this.currentHistoryIndex = this.insertionHistory.length - 1;
      this.updateHistoryNavigation();

      // Update metrics
      this.metricsDisplay.update(result.metrics);

      // Add to history
      this.historyPanel.addEntry('insert', value, '', 'insert');

      if (this.manualMode) {
        // Manual step mode
        this.animationController.loadSteps(result.steps, result.tree);
        await this.animationController.executeStep(0);
      } else {
        // Auto-play mode
        this.animationController.loadSteps(result.steps, result.tree);
        await this.animationController.playSteps();
        this.renderer.renderTree(result.tree);
      }

      input.value = '';
    } catch (error) {
      this.errorDisplay.show('Failed to insert value');
      console.error(error);
    }
  }

  async handleDelete() {
    const input = document.getElementById('value-input');
    const value = parseInt(input.value);

    if (isNaN(value)) {
      this.errorDisplay.show('Please enter a valid integer value');
      return;
    }

    this.errorDisplay.clear();

    try {
      const result = await api.delete(this.treeType, value);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        return;
      }

      // Update metrics
      this.metricsDisplay.update(result.metrics);

      // Add to history
      this.historyPanel.addEntry('delete', value, '', 'delete');

      if (this.manualMode) {
        // Manual step mode
        this.animationController.loadSteps(result.steps, result.tree);
        await this.animationController.executeStep(0);
      } else {
        // Auto-play mode
        this.animationController.loadSteps(result.steps, result.tree);
        await this.animationController.playSteps();
        this.renderer.renderTree(result.tree);
      }

      input.value = '';
    } catch (error) {
      this.errorDisplay.show('Failed to delete value');
      console.error(error);
    }
  }

  async handleSearch() {
    const input = document.getElementById('value-input');
    const value = parseInt(input.value);

    if (isNaN(value)) {
      this.errorDisplay.show('Please enter a valid integer value');
      return;
    }

    this.errorDisplay.clear();

    try {
      const result = await api.search(this.treeType, value);

      if (!result.success) {
        this.errorDisplay.show(result.error.message);
        return;
      }

      // Add to history
      const message = result.found ? 'Found' : 'Not found';
      this.historyPanel.addEntry('search', value, message, 'search');

      // Highlight search path
      if (result.path && result.path.length > 0) {
        this.renderer.highlightPath(result.path);
        
        setTimeout(() => {
          this.renderer.clearHighlights();
        }, 2000);
      }

      input.value = '';
    } catch (error) {
      this.errorDisplay.show('Failed to search value');
      console.error(error);
    }
  }

  async handleReset() {
    if (!confirm('Are you sure you want to reset the tree?')) {
      return;
    }

    try {
      await api.resetTree(this.treeType);
      
      this.renderer.clear();
      this.historyPanel.clear();
      this.metricsDisplay.reset();
      this.animationController.reset();
      this.errorDisplay.clear();

      // Clear insertion history
      this.insertionHistory = [];
      this.currentHistoryIndex = -1;
      this.updateHistoryNavigation();

      this.historyPanel.addEntry('reset', '', 'Tree reset', 'delete');
    } catch (error) {
      this.errorDisplay.show('Failed to reset tree');
      console.error(error);
    }
  }
}

// Animation Controller for step-by-step playback

class AnimationController {
  constructor(renderer, historyPanel) {
    this.renderer = renderer;
    this.historyPanel = historyPanel;
    this.steps = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.delay = 1000; // 1 second between steps

    this.initControls();
  }

  initControls() {
    this.prevBtn = document.getElementById('prev-step-btn');
    this.nextBtn = document.getElementById('next-step-btn');
    this.playPauseBtn = document.getElementById('play-pause-btn');
    this.stepCounter = document.getElementById('step-counter');

    this.prevBtn.addEventListener('click', () => this.previousStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
  }

  loadSteps(steps, finalTree) {
    this.steps = steps;
    this.finalTree = finalTree;
    this.currentStep = 0;
    this.updateStepCounter();
  }

  async playSteps() {
    for (let i = 0; i < this.steps.length; i++) {
      await this.executeStep(i);
      await this.wait(this.delay);
    }
  }

  async executeStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;

    const step = this.steps[stepIndex];
    this.currentStep = stepIndex;
    this.updateStepCounter();

    // Add to history
    this.historyPanel.addStepEntry(step.description);

    // Highlight affected nodes
    if (step.affectedNodes && step.affectedNodes.length > 0) {
      this.renderer.highlightNodes(step.affectedNodes);
    }

    // Render tree state
    if (step.afterState) {
      this.renderer.renderTree(step.afterState);
    }

    // Apply animations based on step type
    switch (step.stepType) {
      case 'insert':
        if (step.affectedNodes && step.affectedNodes[0]) {
          this.renderer.animateInsertion(step.affectedNodes[0]);
        }
        break;
      case 'recolor':
        if (step.affectedNodes) {
          step.affectedNodes.forEach(node => {
            this.renderer.animateRecolor(node);
          });
        }
        break;
      case 'rotate_left':
      case 'rotate_right':
        if (step.affectedNodes && step.affectedNodes[0]) {
          this.renderer.animateRotation(step.affectedNodes[0]);
        }
        break;
      case 'case_trigger':
        if (step.caseType) {
          this.historyPanel.addCaseEntry(step.caseType, step.description);
        }
        break;
    }

    await this.wait(500);
    this.renderer.clearHighlights();
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.executeStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.executeStep(this.currentStep - 1);
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  async play() {
    this.isPlaying = true;
    this.playPauseBtn.textContent = '⏸ Pause';

    while (this.isPlaying && this.currentStep < this.steps.length - 1) {
      await this.executeStep(this.currentStep + 1);
      await this.wait(this.delay);
    }

    if (this.currentStep >= this.steps.length - 1) {
      this.pause();
    }
  }

  pause() {
    this.isPlaying = false;
    this.playPauseBtn.textContent = '▶ Play';
  }

  reset() {
    this.pause();
    this.currentStep = 0;
    this.steps = [];
    this.updateStepCounter();
  }

  updateStepCounter() {
    this.stepCounter.textContent = `Step ${this.currentStep + 1} of ${this.steps.length}`;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

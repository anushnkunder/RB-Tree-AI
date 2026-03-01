// Error display component

class ErrorDisplay {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
  }

  show(message) {
    this.element.textContent = `⚠ Error: ${message}`;
    this.element.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => this.hide(), 5000);
  }

  hide() {
    this.element.classList.remove('show');
  }

  clear() {
    this.hide();
  }
}

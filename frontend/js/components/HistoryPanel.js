// Operation history panel component

class HistoryPanel {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
  }

  addEntry(operation, value, description = '', type = 'insert') {
    const entry = document.createElement('div');
    entry.className = `history-entry ${type}`;

    const timestamp = formatters.formatTime(new Date());
    
    entry.innerHTML = `
      <div><strong>${formatters.formatOperation(operation)}</strong> ${value}</div>
      ${description ? `<div>${description}</div>` : ''}
      <div class="timestamp">${timestamp}</div>
    `;

    this.element.appendChild(entry);
    this.scrollToBottom();
  }

  addCaseEntry(caseType, description) {
    const entry = document.createElement('div');
    entry.className = 'history-entry case';

    const timestamp = formatters.formatTime(new Date());
    
    entry.innerHTML = `
      <div><strong>${formatters.formatCase(caseType)}</strong></div>
      <div>${description}</div>
      <div class="timestamp">${timestamp}</div>
    `;

    this.element.appendChild(entry);
    this.scrollToBottom();
  }

  addStepEntry(description) {
    const entry = document.createElement('div');
    entry.className = 'history-entry';

    entry.innerHTML = `<div>${description}</div>`;

    this.element.appendChild(entry);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }

  clear() {
    this.element.innerHTML = '';
  }
}

// Tab navigation manager

class TabManager {
  constructor() {
    this.tabs = document.querySelectorAll('.tab-btn');
    this.contents = document.querySelectorAll('.tab-content');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    this.tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update tab contents
    this.contents.forEach(content => {
      if (content.id === `${tabName}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
}

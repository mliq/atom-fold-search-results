'use babel';

class ToggleSearchResults {
  constructor() {
    this.resultsObserver = null;
    this.folded = false;
    this.observeResultsPane();
    this.resultsContainer = null;
  }

  observeResultsPane() {
    atom.workspace.onDidChangeActivePaneItem((item) => {
      if (item && item.constructor.name === 'ResultsPaneView') {
        this.resultsContainer = item.element.querySelector('.results-view');
        this.watchResults();
      }
      else {
        this.unwatchResults();
      }
    });

    atom.workspace.onDidDestroyPaneItem((event) => {
      if (event.item.constructor.name === 'ResultsPaneView') {
        this.unwatchResults();
        this.folded = false;
        this.resultsContainer = null;
      }
    })
  }

  watchResults() {
    this.resultsObserver = new MutationObserver((mutations) => {
      if (mutations.length > 0 && this.folded) {
        this.fold();
      }
    });

    this.resultsObserver.observe(this.resultsContainer, {childList: true});
  }

  unwatchResults() {
    if (this.resultsObserver) {
      this.resultsObserver.disconnect();
    }
  }

  fold() {
    const items = this.resultsContainer.querySelectorAll('.results-view li:not(.collapsed)');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('collapsed');
    }
  }

  unfold() {
    const items = this.resultsContainer.querySelectorAll('.results-view li.collapsed');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('collapsed');
    }
  }

  toggle() {
    this.folded ? this.unfold() : this.fold();
    this.folded = !this.folded;
  }
}

export default ToggleSearchResults;

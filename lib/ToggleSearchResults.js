'use babel';

class ToggleSearchResults {
  constructor() {
    this.resultsObserver = null;
    this.folded = false;
    this.observeResultsPane();
  }

  observeResultsPane() {
    atom.workspace.onDidChangeActivePaneItem((item) => {
			console.log('item', item);
      if (item && item.get) {
        if (item.get(0).classList.contains('preview-pane')) {
          this.watchResults();
        } else {
          this.unwatchResults();
        }
      }
    });
  }

  watchResults() {
    this.resultsContainer = document.querySelector('.preview-pane .results-view');

    this.resultsObserver = new MutationObserver((mutations) => {
      if (mutations.length > 0 && this.folded) {
        this.fold();
      }
    });

    this.resultsObserver.observe(this.resultsContainer, {childList: true});
  }

  unwatchResults() {
    this.resultsObserver.disconnect();
  }

  fold() {
    const items = document.querySelectorAll('.results-view li:not(.collapsed)');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('collapsed');
    }
  }

  unfold() {
    const items = document.querySelectorAll('.results-view li.collapsed');
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

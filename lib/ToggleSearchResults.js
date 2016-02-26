'use babel';

class ToggleSearchResults {
  constructor() {
    this.resultsObserver = null;
    this.folded = false;
    this.observeResultsPane();
    this.resultsView = null;
    this.resultsPaneView = null;
  }

  observeResultsPane() {
    atom.workspace.onDidChangeActivePaneItem((item) => {
      if (item && item.constructor.name === 'ResultsPaneView') {
        this.resultsView = item.element.querySelector('.results-view');
        this.resultsPaneView = item;
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
        this.resultsView = null;
        this.resultsPaneView = null;
      }
    })
  }

  watchResults() {
    this.resultsObserver = new MutationObserver((mutations) => {
      if (mutations.length > 0 && this.folded) {
        for (let i = 0; i < mutations.length; i++) {
          let resultView = this.resultsPaneView.find(mutations[i].addedNodes[0]).view();
          if (resultView && resultView.constructor.name === 'ResultView') {
            this.foldItem(resultView);
            this.resultsPaneView.resultsView.renderResults();
          }
        }
      }
    });

    this.resultsObserver.observe(this.resultsView, {childList: true});
  }

  unwatchResults() {
    if (this.resultsObserver) {
      this.resultsObserver.disconnect();
    }
  }

  fold() {
    const resultViews = this.resultsPaneView.find('.path');

    for (let i = 0; i < resultViews.length; i++) {
      let resultView = this.resultsPaneView.find(resultViews[i]).view();
      if (resultView.constructor.name === 'ResultView') {
        this.foldItem(resultView);
        this.resultsPaneView.resultsView.renderResults();
      }
    }
  }

  unfold() {
    const resultViews = this.resultsPaneView.find('.path');

    for (let i = 0; i < resultViews.length; i++) {
      let resultView = this.resultsPaneView.find(resultViews[i]).view();
      if (resultView.constructor.name === 'ResultView') {
        this.unfoldItem(resultView);
      }
    }
  }

  foldItem(node) {
    node.addClass('collapsed');
    node.isExpanded = false;
  }

  unfoldItem(node) {
    node.removeClass('collapsed');
    node.isExpanded = true;
  }

  toggle() {
    this.folded ? this.unfold() : this.fold();
    this.folded = !this.folded;
  }
}

export default ToggleSearchResults;

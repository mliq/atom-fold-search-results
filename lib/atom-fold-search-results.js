'use babel';

import ToggleSearchResults from './ToggleSearchResults';

const toggler = new ToggleSearchResults();

export function activate() {
  atom.commands.add('.preview-pane', {
    'fold-search-results:toggle': toggle
  });

  toggler.observeResultsPane();
}

function toggle() {
  toggler.toggle();
}

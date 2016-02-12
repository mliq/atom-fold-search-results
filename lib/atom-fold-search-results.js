'use babel';

import ToggleSearchResults from './ToggleSearchResults';

export function activate() {
  const toggler = new ToggleSearchResults();

  function toggle() {
    toggler.toggle();
  }

  atom.commands.add('.preview-pane', {
    'fold-search-results:toggle': toggle
  });
}

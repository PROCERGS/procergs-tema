const EDIT_ACTIONS = new Set(['add', 'edit']);

const isSectionOverlayEnabled = ({ action, isCmsUI }) =>
  !isCmsUI && !EDIT_ACTIONS.has(action);

export default isSectionOverlayEnabled;

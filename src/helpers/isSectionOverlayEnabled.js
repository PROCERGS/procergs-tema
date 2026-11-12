import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

const EDIT_ACTIONS = new Set(['add', 'edit']);

const normalizePath = (path) =>
  (path || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';

const isSectionOverlayEnabled = ({ action, isCmsUI, pathname, content }) =>
  !isCmsUI &&
  !EDIT_ACTIONS.has(action) &&
  Boolean(content?.['@id']) &&
  normalizePath(pathname) === normalizePath(flattenToAppURL(content['@id']));

export default isSectionOverlayEnabled;

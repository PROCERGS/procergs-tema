import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import toHexColor from '../../helpers/toHexColor';

export const DEFAULT_BUTTON_COLORS = {
  background: '#1a7235',
  foreground: '#ffffff',
};

const ALIGNMENTS = ['left', 'center', 'right'];

const getHref = (href) => {
  const value =
    typeof href === 'string' ? href.trim() : href?.[0]?.['@id']?.trim?.();

  if (!value) return undefined;

  return isInternalURL(value) ? flattenToAppURL(value) : value;
};

export const normalizeButton = (data = {}) => ({
  label: data.title?.trim?.() || 'Botão',
  href: getHref(data.href),
  openLinkInNewTab: Boolean(data.openLinkInNewTab),
  alignment: ALIGNMENTS.includes(data.buttonAlignment)
    ? data.buttonAlignment
    : 'left',
  colors: {
    background: toHexColor(
      data.colorPair?.background,
      DEFAULT_BUTTON_COLORS.background,
    ),
    foreground: toHexColor(
      data.colorPair?.foreground,
      DEFAULT_BUTTON_COLORS.foreground,
    ),
  },
});

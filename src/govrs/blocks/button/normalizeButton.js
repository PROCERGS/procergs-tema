import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import { clampOpacity } from '../../helpers/colorContrast';
import toHexColor from '../../helpers/toHexColor';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';

export const DEFAULT_BUTTON_COLORS = {
  background: '#1a7235',
  foreground: '#ffffff',
  border: '#1a7235',
  backgroundOpacity: 1,
  borderOpacity: 1,
};

export const DEFAULT_BUTTON_HOVER_COLORS = {
  background: '#135428',
  foreground: '#ffffff',
  border: '#135428',
  backgroundOpacity: 1,
  borderOpacity: 1,
};

const ALIGNMENTS = ['left', 'center', 'right'];
const ICON_POSITIONS = ['top', 'left', 'right', 'bottom'];

const getHref = (href) => {
  const value =
    typeof href === 'string' ? href.trim() : href?.[0]?.['@id']?.trim?.();

  if (!value) return undefined;

  return isInternalURL(value) ? flattenToAppURL(value) : value;
};

const getIconUrl = (icon) => {
  if (typeof icon === 'string' && icon.trim()) {
    const value = icon.trim();

    return isInternalURL(value)
      ? `${flattenToAppURL(value)}/@@images/image`
      : value;
  }

  return resolveImageUrlFromContent(icon?.[0]);
};

export const normalizeButton = (data = {}) => {
  const background = toHexColor(
    data.colorPair?.background,
    DEFAULT_BUTTON_COLORS.background,
  );
  const hoverBackground = toHexColor(
    data.hoverColorPair?.background,
    DEFAULT_BUTTON_HOVER_COLORS.background,
  );

  return {
    label: data.title?.trim?.() || 'Botão',
    href: getHref(data.href),
    openLinkInNewTab: Boolean(data.openLinkInNewTab),
    alignment: ALIGNMENTS.includes(data.buttonAlignment)
      ? data.buttonAlignment
      : 'left',
    iconUrl: getIconUrl(data.icon),
    iconPosition: ICON_POSITIONS.includes(data.iconPosition)
      ? data.iconPosition
      : 'left',
    colors: {
      background,
      foreground: toHexColor(
        data.colorPair?.foreground,
        DEFAULT_BUTTON_COLORS.foreground,
      ),
      border: toHexColor(
        data.colorPair?.border,
        toHexColor(data.borderColor, background),
      ),
      backgroundOpacity: clampOpacity(
        data.colorPair?.backgroundOpacity,
        DEFAULT_BUTTON_COLORS.backgroundOpacity,
      ),
      borderOpacity: clampOpacity(
        data.colorPair?.borderOpacity,
        DEFAULT_BUTTON_COLORS.borderOpacity,
      ),
      hover: {
        background: hoverBackground,
        foreground: toHexColor(
          data.hoverColorPair?.foreground,
          DEFAULT_BUTTON_HOVER_COLORS.foreground,
        ),
        border: toHexColor(
          data.hoverColorPair?.border,
          toHexColor(data.hoverBorderColor, hoverBackground),
        ),
        backgroundOpacity: clampOpacity(
          data.hoverColorPair?.backgroundOpacity,
          DEFAULT_BUTTON_HOVER_COLORS.backgroundOpacity,
        ),
        borderOpacity: clampOpacity(
          data.hoverColorPair?.borderOpacity,
          DEFAULT_BUTTON_HOVER_COLORS.borderOpacity,
        ),
      },
    },
  };
};

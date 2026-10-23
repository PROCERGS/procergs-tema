export const DEFAULT_SITE_THEME_COLORS = Object.freeze({
  primaryColor: '#1A7235',
  secondaryColor: '#005CA9',
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  linkColor: '#1351B4',
});

const HEX_COLOR = /^#([0-9a-f]{6})$/i;

export const normalizeHexColor = (value, fallback = '#000000') => {
  const requested = typeof value === 'string' ? value.trim() : '';
  const normalized = requested.startsWith('#') ? requested : `#${requested}`;

  if (HEX_COLOR.test(normalized)) return normalized.toUpperCase();

  const safeFallback =
    typeof fallback === 'string' && HEX_COLOR.test(fallback.trim())
      ? fallback.trim()
      : '#000000';
  return safeFallback.toUpperCase();
};

const hexToRgb = (hex) => {
  const safe = normalizeHexColor(hex).slice(1);
  return [0, 2, 4].map((offset) =>
    parseInt(safe.slice(offset, offset + 2), 16),
  );
};

const rgbToHex = (rgb) =>
  `#${rgb
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`.toUpperCase();

export const mixHexColors = (foreground, background, foregroundWeight) => {
  const front = hexToRgb(foreground);
  const back = hexToRgb(background);
  const weight = Math.max(0, Math.min(1, foregroundWeight));

  return rgbToHex(
    front.map(
      (channel, index) => channel * weight + back[index] * (1 - weight),
    ),
  );
};

const relativeLuminance = (hex) => {
  const channels = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

export const getContrastRatio = (foreground, background) => {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const getReadableTextColor = (background) =>
  getContrastRatio('#000000', background) >=
  getContrastRatio('#FFFFFF', background)
    ? '#000000'
    : '#FFFFFF';

export const getSiteThemeColors = (data = {}) =>
  Object.entries(DEFAULT_SITE_THEME_COLORS).reduce(
    (colors, [name, fallback]) => ({
      ...colors,
      [name]: normalizeHexColor(data[name], fallback),
    }),
    {},
  );

export const getSiteThemeVariables = (data = {}) => {
  const colors = getSiteThemeColors(data);
  const {
    primaryColor,
    secondaryColor,
    textColor,
    backgroundColor,
    linkColor,
  } = colors;
  const [primaryRed, primaryGreen, primaryBlue] = hexToRgb(primaryColor);

  return {
    '--govrs-color-brand-primary': primaryColor,
    '--govrs-color-primary': primaryColor,
    '--govrs-color-brand-primary-strong': mixHexColors(
      primaryColor,
      '#000000',
      0.7,
    ),
    '--govrs-color-brand-primary-hover': mixHexColors(
      primaryColor,
      '#000000',
      0.82,
    ),
    '--govrs-color-brand-primary-soft': mixHexColors(
      primaryColor,
      backgroundColor,
      0.16,
    ),
    '--govrs-color-brand-primary-soft-alt': mixHexColors(
      primaryColor,
      backgroundColor,
      0.1,
    ),
    '--govrs-color-brand-primary-alpha-20': `rgba(${primaryRed}, ${primaryGreen}, ${primaryBlue}, 0.2)`,
    '--govrs-color-secondary': secondaryColor,
    '--procergs-color-secondary': secondaryColor,
    '--govrs-color-text-primary': textColor,
    '--govrs-color-text-secondary': mixHexColors(
      textColor,
      backgroundColor,
      0.78,
    ),
    '--govrs-color-text-muted': mixHexColors(textColor, backgroundColor, 0.62),
    '--govrs-color-text-subtle': mixHexColors(textColor, backgroundColor, 0.52),
    '--govrs-color-neutral-text-subtle': mixHexColors(
      textColor,
      backgroundColor,
      0.52,
    ),
    '--govrs-color-text-inverse': getReadableTextColor(primaryColor),
    '--govrs-color-surface-base': backgroundColor,
    '--govrs-color-surface-alt': mixHexColors(
      secondaryColor,
      backgroundColor,
      0.08,
    ),
    '--govrs-color-surface-soft': mixHexColors(
      secondaryColor,
      backgroundColor,
      0.04,
    ),
    '--govrs-color-border-default': mixHexColors(
      secondaryColor,
      backgroundColor,
      0.18,
    ),
    '--govrs-color-border-emphasis': mixHexColors(
      secondaryColor,
      backgroundColor,
      0.3,
    ),
    '--govrs-color-interactive-link': linkColor,
    '--govrs-color-interactive-link-subtle': mixHexColors(
      linkColor,
      backgroundColor,
      0.22,
    ),
  };
};

export const createSiteThemeCss = (data = {}) => {
  const declarations = Object.entries(getSiteThemeVariables(data))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return `:root:not(.high-contrast):not([data-govrs-contrast='high']) {\n${declarations}\n}`;
};

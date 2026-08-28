export const GOVRS_COLOR_PAIRS = [
  {
    name: 'surface',
    label: 'Superfície clara',
    background: '#ffffff',
    foreground: '#000000',
  },
  {
    name: 'surface-alt',
    label: 'Superfície cinza',
    background: '#f3f3f3',
    foreground: '#000000',
  },
  {
    name: 'brand',
    label: 'Verde GovRS',
    background: '#1a7235',
    foreground: '#ffffff',
  },
  {
    name: 'dark',
    label: 'Superfície escura',
    background: '#1b1b1b',
    foreground: '#ffffff',
  },
];

const expandHex = (value) => {
  const normalized = value?.trim?.().replace('#', '');

  if (/^[0-9a-f]{3}$/i.test(normalized)) {
    return normalized
      .split('')
      .map((character) => `${character}${character}`)
      .join('');
  }

  return /^[0-9a-f]{6}$/i.test(normalized) ? normalized : null;
};

export const parseHexColor = (value) => {
  const hex = expandHex(value);

  if (!hex) return null;

  return [0, 2, 4].map((index) =>
    Number.parseInt(hex.slice(index, index + 2), 16),
  );
};

const channelLuminance = (channel) => {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (rgb) =>
  0.2126 * channelLuminance(rgb[0]) +
  0.7152 * channelLuminance(rgb[1]) +
  0.0722 * channelLuminance(rgb[2]);

export const getContrastRatio = (background, foreground) => {
  const backgroundRgb = parseHexColor(background);
  const foregroundRgb = parseHexColor(foreground);

  if (!backgroundRgb || !foregroundRgb) return 0;

  const first = relativeLuminance(backgroundRgb);
  const second = relativeLuminance(foregroundRgb);
  const lightest = Math.max(first, second);
  const darkest = Math.min(first, second);

  return (lightest + 0.05) / (darkest + 0.05);
};

const composite = (overlay, base, opacity) =>
  overlay.map((channel, index) =>
    Math.round(channel * opacity + base[index] * (1 - opacity)),
  );

const rgbToHex = (rgb) =>
  `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

export const getSafeOverlayOpacity = (
  overlayColor,
  foregroundColor,
  requestedOpacity = 0.6,
) => {
  const overlay = parseHexColor(overlayColor);
  if (!overlay || !parseHexColor(foregroundColor)) return 0.6;

  const start = Math.max(0, Math.min(1, Number(requestedOpacity) || 0));

  for (let opacity = start; opacity <= 1; opacity += 0.01) {
    const overBlack = rgbToHex(composite(overlay, [0, 0, 0], opacity));
    const overWhite = rgbToHex(composite(overlay, [255, 255, 255], opacity));

    if (
      getContrastRatio(overBlack, foregroundColor) >= 4.5 &&
      getContrastRatio(overWhite, foregroundColor) >= 4.5
    ) {
      return Number(opacity.toFixed(2));
    }
  }

  return 1;
};

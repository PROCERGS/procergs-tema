const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const expandShortHex = (hex) => {
  if (hex.length !== 4) {
    return hex.toLowerCase();
  }

  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
};

const nestedColor = (value) =>
  value?.backgroundColor ||
  value?.background ||
  value?.style?.backgroundColor ||
  value?.['--background-color'] ||
  value?.['--govrs-background-color'];

const toHexColor = (value, fallback = '#ffffff') => {
  if (typeof value === 'string' && HEX_COLOR.test(value.trim())) {
    return expandShortHex(value.trim());
  }

  const nested = nestedColor(value);
  if (nested && nested !== value) {
    return toHexColor(nested, fallback);
  }

  return fallback;
};

export default toHexColor;

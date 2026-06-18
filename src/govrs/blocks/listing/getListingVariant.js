export const getListingVariant = (data = {}) => data.variant || 'default';

export const listingNeedsFullObjects = (data = {}) => {
  const variant = getListingVariant(data);

  if (variant === 'card') {
    return true;
  }

  if (
    variant === 'default' &&
    ['mixed', 'images'].includes(data.mediaPreset || 'mixed')
  ) {
    return true;
  }

  return false;
};

export const getListingVariation = (data = {}) => data.variation || 'default';

export const listingNeedsFullObjects = (data = {}) => {
  const variation = getListingVariation(data);

  if (variation === 'card') {
    return true;
  }

  if (
    variation === 'default' &&
    ['mixed', 'images'].includes(data.mediaPreset || 'mixed')
  ) {
    return true;
  }

  return false;
};

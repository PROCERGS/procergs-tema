export const getListingVariation = (data = {}) =>
  data.variation || data.listingBodyTemplate || 'default';

export const listingNeedsFullObjects = (data = {}) => {
  const variation = getListingVariation(data);

  if (variation === 'card') {
    return true;
  }

  if (variation === 'default') {
    if (data.showTags) {
      return true;
    }

    if (data.labeled && (data.groupBy || 'subject') === 'subject') {
      return true;
    }

    return ['mixed', 'images', 'icons'].includes(data.mediaPreset || 'mixed');
  }

  if (variation === 'link' && data.mediaPreset === 'icons') {
    return true;
  }

  return false;
};

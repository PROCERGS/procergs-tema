export const DS_LISTING_VARIATIONS = ['default', 'link', 'card'];

export const getListingVariation = (data = {}) =>
  data.variation || data.listingBodyTemplate || 'default';

export const isDsListingVariation = (variation) =>
  DS_LISTING_VARIATIONS.includes(variation);

export const resolveListingVariationConfig = (
  data = {},
  variationProp,
  variations = [],
) => {
  const variationId = getListingVariation(data);

  if (variationProp?.id === variationId) {
    return variationProp;
  }

  if (data.template && !data.variation) {
    return variations.find((item) => item.id === data.template);
  }

  return variations.find((item) => item.id === variationId);
};

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

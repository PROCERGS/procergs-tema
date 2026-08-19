import { getListingVariation } from './getListingVariation';

export const getListVariantProps = (data = {}) => {
  const variation = getListingVariation(data);

  switch (variation) {
    case 'link':
      return {
        variant: 'link',
        mediaPreset: data.mediaPreset || 'none',
        numbered: Boolean(data.numbered),
        invert: Boolean(data.invert),
      };
    case 'card':
      return {
        variant: 'card',
        perRow: data.perRow ?? 3,
        overflow: data.cardOverflow === 'scroll' ? 'scroll' : 'wrap',
      };
    default:
      return {
        variant: 'default',
        horizontal: Boolean(data.horizontal),
        labeled: Boolean(data.labeled),
        collapsible: Boolean(data.labeled) && data.collapsible !== false,
        mediaPreset: data.mediaPreset || 'mixed',
      };
  }
};

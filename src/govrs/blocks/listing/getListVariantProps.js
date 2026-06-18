import { getListingVariant } from './getListingVariant';

export const getListVariantProps = (data = {}) => {
  const variant = getListingVariant(data);

  switch (variant) {
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

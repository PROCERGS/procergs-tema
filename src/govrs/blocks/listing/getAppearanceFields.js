import { isDsListingVariation } from './getListingVariation';

export const getAppearanceFields = (variation, data) => {
  if (!isDsListingVariation(variation)) {
    return [];
  }

  switch (variation) {
    case 'link':
      return ['numbered', 'invert', 'mediaPreset'];
    case 'card':
      return [
        'perRow',
        'cardOverflow',
        'cardVariant',
        'cardSize',
        'showCardAction',
        'showTags',
        ...(data?.showTags ? ['tagsLimit'] : []),
      ];
    default:
      return [
        'horizontal',
        'labeled',
        ...(data?.labeled ? ['collapsible', 'groupBy'] : []),
        'mediaPreset',
      ];
  }
};

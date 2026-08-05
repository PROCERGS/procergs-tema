import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrl } from './resolveImageUrl';

export const resolveImageUrlFromContent = (item) => {
  if (!item) {
    return undefined;
  }

  if (item.image_field && item.image_scales) {
    return resolveImageUrl({
      '@id': item['@id'],
      image_field: item.image_field,
      image_scales: item.image_scales,
    });
  }

  if (item['@type'] === 'Image' && item['@id']) {
    return `${flattenToAppURL(item['@id'])}/@@images/image`;
  }

  if (item.image?.download) {
    return flattenToAppURL(item.image.download);
  }

  return undefined;
};

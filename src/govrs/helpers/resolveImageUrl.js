import {
  flattenScales,
  flattenToAppURL,
  isInternalURL,
} from '@plone/volto/helpers/Url/Url';

export const resolveImageUrl = (item) => {
  if (!item) {
    return undefined;
  }

  const url = item['@id'];
  if (!url) {
    return undefined;
  }

  if (!item.image_field && !item.image_scales) {
    return isInternalURL(url) ? undefined : url;
  }

  if (isInternalURL(url)) {
    const image = flattenScales(url, item.image_scales[item.image_field]?.[0]);

    if (!image?.download) {
      return undefined;
    }

    return `${flattenToAppURL(image.base_path || url)}/${image.download}`;
  }

  return url;
};

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';

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
    return `${flattenToAppURL(url)}/@@images/image`;
  }

  return url;
};

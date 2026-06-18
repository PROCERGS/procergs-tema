import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';

const getImageUrl = (data = {}) => {
  const { image, image_field, image_scales } = data;

  if (typeof image === 'string' && image) {
    if (image_field && image_scales) {
      return resolveImageUrlFromContent({
        '@id': image,
        image_field,
        image_scales,
      });
    }

    if (isInternalURL(image)) {
      return `${flattenToAppURL(image)}/@@images/image`;
    }

    return image;
  }

  return resolveImageUrlFromContent(image?.[0]);
};

const getLinkUrl = (data = {}, isEditMode) => {
  if (isEditMode) {
    return undefined;
  }

  const linkValue =
    typeof data.link === 'string'
      ? data.link.trim()
      : data.href?.[0]?.['@id']?.trim?.() || '';

  if (!linkValue) {
    return undefined;
  }

  return isInternalURL(linkValue) ? flattenToAppURL(linkValue) : linkValue;
};

export const normalizeBanner = (data = {}, { isEditMode = false } = {}) => {
  const imageItem = Array.isArray(data.image) ? data.image?.[0] : undefined;
  const imageUrl = getImageUrl(data);
  const imageAlt = (data.imageAlt || imageItem?.Title || '').trim();
  const type = data.type === 'default' || !data.type ? undefined : data.type;
  const linkUrl = getLinkUrl(data, isEditMode);

  return {
    ...(type ? { type } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    imageAlt,
    ...(linkUrl ? { linkUrl } : {}),
  };
};

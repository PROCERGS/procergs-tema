import { normalizeBanner } from '../banner/normalizeBanner';

export const getSecretariatIdentity = (data = {}) => {
  if (data.isSecretariat !== true) return undefined;

  const text = (data.secretariatText || '').trim();
  const { imageUrl, imageAlt } = normalizeBanner({
    image: data.secretariatImage,
    image_field: data.secretariatImageField,
    image_scales: data.secretariatImageScales,
  });

  return { text, imageUrl, imageAlt: text ? '' : imageAlt };
};

export const updateAccessibilityField = (
  data = {},
  id,
  value,
  itemInfo = {},
) => {
  const nextData = { ...data, [id]: value };

  if (id === 'secretariatImage') {
    delete nextData.secretariatImageField;
    delete nextData.secretariatImageScales;
    if (value) {
      if (itemInfo.image_field) {
        nextData.secretariatImageField = itemInfo.image_field;
      }
      if (itemInfo.image_scales) {
        nextData.secretariatImageScales = itemInfo.image_scales;
      }
    }
  }

  return nextData;
};

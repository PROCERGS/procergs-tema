export const CAROUSEL_ITEM_LIMIT = 5;

export const CAROUSEL_FETCH_SIZE = 30;

export const CAROUSEL_PORTAL_TYPES = ['Document', 'News Item'];

const EXCLUDED_PORTAL_TYPES = new Set([
  'Image',
  'File',
  'Folder',
  'Collection',
]);

const ALLOWED_PORTAL_TYPES = new Set(CAROUSEL_PORTAL_TYPES);

export const getItemPortalType = (item) => item?.['@type'] || item?.portal_type;

export const isCarouselContentItem = (item) => {
  const type = getItemPortalType(item);
  if (!type) {
    return false;
  }
  if (EXCLUDED_PORTAL_TYPES.has(type)) {
    return false;
  }
  return ALLOWED_PORTAL_TYPES.has(type);
};

export const filterCarouselContentItems = (items = []) =>
  items.filter(isCarouselContentItem);

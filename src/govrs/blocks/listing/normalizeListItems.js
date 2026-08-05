import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';
import { getListingVariation } from './getListingVariation';

const getItemId = (item) => item.UID || item['@id'] || item.id;

const getItemTitle = (item) => item.title || item.Title || item.id || '';

const getItemDescription = (item) => item.description || item.Description || '';

const getGroupLabel = (item, groupBy) => {
  if (groupBy === 'portal_type') {
    return item['@type'] || undefined;
  }

  return undefined;
};

const formatMeta = (item) => {
  if (item.effective) {
    return new Date(item.effective).toLocaleDateString();
  }

  return item['@type'] || undefined;
};

const getContentUrl = (item, { isEditMode, variation }) => {
  if (isEditMode || !item['@id'] || variation === 'default') {
    return undefined;
  }

  return flattenToAppURL(item['@id']);
};

export const normalizeListItems = (
  items = [],
  data = {},
  { isEditMode = false } = {},
) => {
  const variation = getListingVariation(data);
  const groupBy = data.groupBy || 'portal_type';

  return items.map((item) => {
    const id = getItemId(item);
    const title = getItemTitle(item);
    const description = getItemDescription(item);
    const image = resolveImageUrlFromContent(item);
    const contentUrl = getContentUrl(item, { isEditMode, variation });

    if (variation === 'link') {
      return {
        id,
        title,
        meta: formatMeta(item),
        ...(contentUrl ? { href: contentUrl } : {}),
      };
    }

    if (variation === 'card') {
      const cardItem = {
        id,
        title,
        description: description || undefined,
        image,
        imageAlt: title,
        variant: data.cardVariant || 'news',
        size: data.cardSize || 'small',
        ...(contentUrl ? { href: contentUrl } : {}),
      };

      if (data.showCardAction && contentUrl) {
        cardItem.acao = { label: 'Ler mais', url: contentUrl };
      }

      return cardItem;
    }

    const defaultItem = {
      id,
      title,
      text: description || undefined,
      image,
      imageAlt: title,
    };

    if (data.labeled && groupBy !== 'none') {
      defaultItem.label = getGroupLabel(item, groupBy);
    }

    return defaultItem;
  });
};

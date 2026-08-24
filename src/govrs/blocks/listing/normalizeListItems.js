import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';
import { getListingVariation } from './getListingVariation';

const CARD_TEXT_MAX_LENGTH = 140;

const getItemId = (item) => item.UID || item['@id'] || item.id;

const getItemTitle = (item) => item.title || item.Title || item.id || '';

const getItemDescription = (item) => item.description || item.Description || '';

const truncateText = (value) => {
  const text = String(value ?? '').trim();

  if (text.length <= CARD_TEXT_MAX_LENGTH) {
    return text;
  }

  const ellipsis = '...';
  return `${text.slice(0, CARD_TEXT_MAX_LENGTH - ellipsis.length).trimEnd()}${ellipsis}`;
};

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

const getSubjectTags = (item) => {
  const subjects = item.Subject || item.subjects;
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return undefined;
  }

  const tags = subjects.filter(Boolean);
  return tags.length > 0 ? tags : undefined;
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
        title: truncateText(title),
        description: description ? truncateText(description) : undefined,
        image,
        imageAlt: title,
        variant: data.cardVariant || 'news',
        size: data.cardSize || 'small',
        ...(contentUrl ? { href: contentUrl } : {}),
      };

      if (data.showCardAction && contentUrl) {
        cardItem.acao = { label: 'Ler mais', url: contentUrl };
      }

      if (data.showTags) {
        const tags = getSubjectTags(item);
        if (tags) {
          cardItem.tags = tags;
          cardItem.tagsLimit = Math.min(
            3,
            Math.max(1, Number(data.tagsLimit) || 3),
          );
        }
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

import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';
import { getListingVariation } from './getListingVariation';
import { resolveListItemMedia } from './resolveListItemMedia';

const CARD_TEXT_MAX_LENGTH = 140;
const UNGROUPED_LABEL = 'Outros';

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

const getSubjectTags = (item) => {
  const subjects = item.Subject || item.subjects;
  if (typeof subjects === 'string' && subjects.trim()) {
    return [subjects.trim()];
  }
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return undefined;
  }

  const tags = subjects.map((tag) => String(tag).trim()).filter(Boolean);
  return tags.length > 0 ? tags : undefined;
};

const formatGroupTag = (value) => String(value).trim().toLocaleUpperCase('pt-BR');

const getGroupLabel = (item, groupBy) => {
  if (groupBy === 'portal_type') {
    return item['@type'] || UNGROUPED_LABEL;
  }

  if (groupBy === 'subject') {
    const tags = getSubjectTags(item);
    if (!tags?.length) {
      return UNGROUPED_LABEL;
    }
    return formatGroupTag(tags[0]);
  }

  return undefined;
};

const formatMeta = (item) => {
  if (item.effective) {
    return new Date(item.effective).toLocaleDateString();
  }

  return item['@type'] || undefined;
};

const getContentUrl = (item, { isEditMode }) => {
  if (isEditMode || !item['@id']) {
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
  const groupBy = data.groupBy || 'subject';

  return items.map((item) => {
    const id = getItemId(item);
    const title = getItemTitle(item);
    const description = getItemDescription(item);
    const image = resolveImageUrlFromContent(item);
    const mediaPreset =
      data.mediaPreset || (variation === 'link' ? 'none' : 'mixed');
    const media = resolveListItemMedia(item, mediaPreset);
    const contentUrl = getContentUrl(item, { isEditMode });

    if (variation === 'link') {
      return {
        id,
        title,
        meta: formatMeta(item),
        ...(contentUrl ? { href: contentUrl } : {}),
        ...(media.icon ? { icon: media.icon } : {}),
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
      title: truncateText(title),
      text: description ? truncateText(description) : undefined,
      ...(contentUrl ? { href: contentUrl } : {}),
      ...(media.image ? { image: media.image, imageAlt: title } : {}),
      ...(media.icon ? { icon: media.icon } : {}),
    };

    if (data.labeled && groupBy !== 'none') {
      defaultItem.label = getGroupLabel(item, groupBy);
    }

    if (data.showTags) {
      defaultItem.tags = getSubjectTags(item) ?? [];
      defaultItem.tagsLimit = Math.min(
        3,
        Math.max(1, Number(data.tagsLimit) || 3),
      );
    }

    return defaultItem;
  });
};

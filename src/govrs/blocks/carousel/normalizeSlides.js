import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';
import { isCarouselContentItem } from './filterCarouselContentItems';

export { resolveImageUrlFromContent };

export const normalizeSlides = (items = [], { linkToContent = false } = {}) =>
  items.filter(isCarouselContentItem).map((item) => {
    const title = item.title || item.Title || item.id || '';
    const description = item.description || item.Description || '';
    const contentUrl =
      linkToContent && item['@id'] ? flattenToAppURL(item['@id']) : undefined;

    return {
      title: title || undefined,
      description: description || undefined,
      image: resolveImageUrlFromContent(item),
      imageAlt: title,
      ...(contentUrl ? { href: contentUrl } : {}),
    };
  });

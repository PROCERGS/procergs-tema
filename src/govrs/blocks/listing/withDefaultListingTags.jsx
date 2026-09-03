import React from 'react';

export const formatListingTagsText = (tags, tagsLimit) => {
  const limit = Math.min(3, Math.max(1, Number(tagsLimit) || 3));
  const visible = (tags ?? [])
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .slice(0, limit)
    .map((tag) => tag.toLocaleUpperCase('pt-BR'));

  return visible.join(', ');
};

export const withDefaultListingTags = (items = []) =>
  items.map((item) => {
    const tagsText = formatListingTagsText(item.tags, item.tagsLimit);
    if (!tagsText) {
      return item;
    }

    return {
      ...item,
      title: (
        <>
          <span className="govrs-list-default__tags">{tagsText}</span>
          {item.title}
        </>
      ),
    };
  });

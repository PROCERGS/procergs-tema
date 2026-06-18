import React from 'react';

export const normalizeItems = (items = []) =>
  items
    .filter((item) => item?.title?.trim())
    .map((item, index) => ({
      id: item.id || `accordion-item-${index}`,
      title: item.title.trim(),
      content: item.content ? (
        <div className="govrs-accordion-block__content">{item.content}</div>
      ) : null,
      disabled: Boolean(item.disabled),

      searchText: '',
    }));

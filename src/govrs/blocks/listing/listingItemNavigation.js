const flattenGroupedItems = (items = [], labeled = false) => {
  if (!labeled) {
    return items;
  }

  const groups = new Map();

  items.forEach((item) => {
    const label = item.label ?? null;
    const grouped = groups.get(label) ?? [];
    grouped.push(item);
    groups.set(label, grouped);
  });

  return Array.from(groups.values()).flat();
};

export const shouldHandleListingNavigation = (event) => {
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }

  return !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
};

export const getListingItemHrefFromEvent = (event, items, labeled = false) => {
  const itemEl = event.target.closest?.('.govrs-list-default__item');
  if (!itemEl) {
    return undefined;
  }

  const listRoot = event.currentTarget;
  const itemEls = [
    ...listRoot.querySelectorAll('.govrs-list-default__item'),
  ];
  const index = itemEls.indexOf(itemEl);
  if (index < 0) {
    return undefined;
  }

  return flattenGroupedItems(items, labeled)[index]?.href;
};

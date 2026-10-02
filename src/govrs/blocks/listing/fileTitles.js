export const getFileTitleKey = (item = {}) =>
  item.UID || item.uid || item['@id'] || item.id || '';

export const getOriginalFileTitle = (item = {}) => {
  const fieldName = item['@type'] === 'Image' ? 'image' : 'file';
  return (
    item.title || item.Title || item[fieldName]?.filename || item.filename || ''
  );
};

export const updateFileTitleOverride = (data = {}, item, value) => {
  const key = getFileTitleKey(item);
  if (!key) {
    return data;
  }

  const overrides = data.fileTitleOverrides || {};
  const title = value.trim();
  const originalTitle = getOriginalFileTitle(item).trim();

  if (title && title !== originalTitle) {
    if (overrides[key] === title) {
      return data;
    }
    return {
      ...data,
      fileTitleOverrides: { ...overrides, [key]: title },
    };
  }

  if (!Object.prototype.hasOwnProperty.call(overrides, key)) {
    return data;
  }

  const remaining = { ...overrides };
  delete remaining[key];
  if (Object.keys(remaining).length) {
    return { ...data, fileTitleOverrides: remaining };
  }

  const withoutOverrides = { ...data };
  delete withoutOverrides.fileTitleOverrides;
  return withoutOverrides;
};

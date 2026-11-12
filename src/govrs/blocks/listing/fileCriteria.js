import { getListingVariation } from './getListingVariation';

export const FILE_EXTENSION_INDEX = 'file_extension';

export const normalizeFileCriteria = (data = {}) => {
  const query = data.querystring?.query;
  if (!Array.isArray(query)) {
    return data;
  }

  const isFileListing = getListingVariation(data) === 'file';
  const normalizedQuery = query.filter(({ i }) =>
    isFileListing ? i !== 'portal_type' : i !== FILE_EXTENSION_INDEX,
  );
  return normalizedQuery.length === query.length
    ? data
    : {
        ...data,
        querystring: { ...data.querystring, query: normalizedQuery },
      };
};

export const buildFileListingQuery = (data = {}) => {
  const normalizedData = normalizeFileCriteria(data);
  if (getListingVariation(normalizedData) !== 'file') {
    return normalizedData;
  }

  const querystring = normalizedData.querystring || {};
  const query = querystring.query || [];
  const hasPath = query.some(({ i }) => i === 'path');

  return {
    ...normalizedData,
    querystring: {
      ...querystring,
      // Without an explicit location, list files from the current folder.
      ...(!hasPath ? { depth: querystring.depth ?? 1 } : {}),
      query: [
        ...query,
        ...(!hasPath
          ? [
              {
                i: 'path',
                o: 'plone.app.querystring.operation.string.relativePath',
                v: '',
              },
            ]
          : []),
        {
          i: 'portal_type',
          o: 'plone.app.querystring.operation.selection.any',
          v: ['File', 'Image'],
        },
      ],
    },
  };
};

export const getListingQueryIndexes = (indexes, isFileListing) => {
  if (!indexes) return indexes;

  return {
    ...indexes,
    ...(indexes[FILE_EXTENSION_INDEX]
      ? {
          [FILE_EXTENSION_INDEX]: {
            ...indexes[FILE_EXTENSION_INDEX],
            enabled: Boolean(isFileListing),
          },
        }
      : {}),
    ...(isFileListing && indexes.portal_type
      ? { portal_type: { ...indexes.portal_type, enabled: false } }
      : {}),
  };
};

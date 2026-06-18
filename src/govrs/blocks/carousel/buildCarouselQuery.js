import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import {
  CAROUSEL_FETCH_SIZE,
  CAROUSEL_PORTAL_TYPES,
} from './filterCarouselContentItems';

export const buildCarouselQuery = (data) => {
  const href = data?.href?.[0];
  if (!href?.['@id']) {
    return null;
  }

  const absolutePath = flattenToAppURL(href['@id']) || '/';

  return {
    b_size: CAROUSEL_FETCH_SIZE,
    limit: CAROUSEL_FETCH_SIZE,
    depth: 1,
    sort_on: data.sort_on || 'getObjPositionInParent',
    sort_order: data.sort_order || 'ascending',
    metadata_fields: '_all',
    query: [
      {
        i: 'path',
        o: 'plone.app.querystring.operation.string.absolutePath',
        v: absolutePath,
      },
      {
        i: 'portal_type',
        o: 'plone.app.querystring.operation.selection.any',
        v: CAROUSEL_PORTAL_TYPES,
      },
    ],
  };
};

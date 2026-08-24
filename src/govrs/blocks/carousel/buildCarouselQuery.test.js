import { buildCarouselQuery } from './buildCarouselQuery';
import { DEFAULT_API_PATH } from '../../../testing/mocks/ploneVoltoUrl';
import {
  CAROUSEL_FETCH_SIZE,
  CAROUSEL_PORTAL_TYPES,
} from './filterCarouselContentItems';

describe('buildCarouselQuery', () => {
  it('returns null when there is no href set', () => {
    expect(buildCarouselQuery({})).toBeNull();
    expect(buildCarouselQuery({ href: [] })).toBeNull();
  });

  it('builds a query targeting the flattened absolute path with sensible defaults', () => {
    const query = buildCarouselQuery({
      href: [{ '@id': `${DEFAULT_API_PATH}/news` }],
    });

    expect(query).toEqual({
      b_size: CAROUSEL_FETCH_SIZE,
      limit: CAROUSEL_FETCH_SIZE,
      depth: 1,
      sort_on: 'getObjPositionInParent',
      sort_order: 'ascending',
      metadata_fields: '_all',
      query: [
        {
          i: 'path',
          o: 'plone.app.querystring.operation.string.absolutePath',
          v: '/news',
        },
        {
          i: 'portal_type',
          o: 'plone.app.querystring.operation.selection.any',
          v: CAROUSEL_PORTAL_TYPES,
        },
      ],
    });
  });

  it('honors custom sort_on/sort_order', () => {
    const query = buildCarouselQuery({
      href: [{ '@id': `${DEFAULT_API_PATH}/news` }],
      sort_on: 'effective',
      sort_order: 'descending',
    });

    expect(query.sort_on).toBe('effective');
    expect(query.sort_order).toBe('descending');
  });

  it('defaults to the site root path when the href resolves to an empty path', () => {
    const query = buildCarouselQuery({ href: [{ '@id': DEFAULT_API_PATH }] });

    expect(query.query[0].v).toBe('/');
  });
});

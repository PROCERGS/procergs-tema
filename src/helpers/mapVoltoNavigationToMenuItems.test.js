import {
  appendAuthMenuItem,
  mapVoltoNavigationToFooterSections,
  mapVoltoNavigationToMenuItems,
} from './mapVoltoNavigationToMenuItems';
import { DEFAULT_API_PATH } from '../testing/mocks/ploneVoltoUrl';

describe('mapVoltoNavigationToMenuItems', () => {
  it('returns an empty array when given no items', () => {
    expect(mapVoltoNavigationToMenuItems()).toEqual([]);
    expect(mapVoltoNavigationToMenuItems([])).toEqual([]);
  });

  it('maps title/url/href from @id, flattening internal API URLs', () => {
    const items = [{ title: 'News', '@id': `${DEFAULT_API_PATH}/news` }];

    expect(mapVoltoNavigationToMenuItems(items)).toEqual([
      { title: 'News', url: '/news', href: '/news' },
    ]);
  });

  it('prefers item.url over item["@id"] when both are present', () => {
    const items = [
      { title: 'Events', url: '/events', '@id': `${DEFAULT_API_PATH}/other` },
    ];

    expect(mapVoltoNavigationToMenuItems(items)[0]).toMatchObject({
      url: '/events',
      href: '/events',
    });
  });

  it('normalizes the site root url ("") to "/"', () => {
    const items = [{ title: 'Home', '@id': '' }];

    expect(mapVoltoNavigationToMenuItems(items)[0]).toMatchObject({
      url: '/',
      href: '/',
    });
  });

  it('recursively maps nested items', () => {
    const items = [
      {
        title: 'Parent',
        url: '/parent',
        items: [{ title: 'Child', url: '/parent/child' }],
      },
    ];

    const [parent] = mapVoltoNavigationToMenuItems(items);

    expect(parent.items).toEqual([
      { title: 'Child', url: '/parent/child', href: '/parent/child' },
    ]);
  });

  it('omits the items key entirely when there are no children', () => {
    const [item] = mapVoltoNavigationToMenuItems([
      { title: 'Leaf', url: '/leaf' },
    ]);

    expect(item).not.toHaveProperty('items');
  });
});

describe('mapVoltoNavigationToFooterSections', () => {
  it('drops sections that have no items', () => {
    const sections = [{ title: 'Empty', items: [] }, { title: 'Also empty' }];

    expect(mapVoltoNavigationToFooterSections(sections)).toEqual([]);
  });

  it('keeps sections with items and flattens each entry to title/url/href', () => {
    const sections = [
      {
        title: 'Institucional',
        items: [{ title: 'About', url: '/about' }],
      },
    ];

    expect(mapVoltoNavigationToFooterSections(sections)).toEqual([
      {
        title: 'Institucional',
        items: [{ title: 'About', url: '/about', href: '/about' }],
      },
    ]);
  });
});

describe('appendAuthMenuItem', () => {
  const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

  it('appends a "Log in" item when there is no token', () => {
    const result = appendAuthMenuItem(
      [{ title: 'Home', url: '/' }],
      null,
      intl,
    );

    expect(result).toHaveLength(2);
    expect(result[1]).toEqual({
      title: 'Log in',
      url: '/login',
      href: '/login',
    });
  });

  it('appends a "Log out" item when a token is present', () => {
    const result = appendAuthMenuItem([], 'some-token', intl);

    expect(result).toEqual([
      { title: 'Log out', url: '/logout', href: '/logout' },
    ]);
  });

  it('does not mutate the original menu items array', () => {
    const original = [{ title: 'Home', url: '/' }];

    appendAuthMenuItem(original, null, intl);

    expect(original).toHaveLength(1);
  });
});

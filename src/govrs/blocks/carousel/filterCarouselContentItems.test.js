import {
  filterCarouselContentItems,
  getItemPortalType,
  isCarouselContentItem,
} from './filterCarouselContentItems';

describe('getItemPortalType', () => {
  it('prefers @type over portal_type', () => {
    expect(
      getItemPortalType({ '@type': 'Document', portal_type: 'News Item' }),
    ).toBe('Document');
  });

  it('falls back to portal_type when @type is absent', () => {
    expect(getItemPortalType({ portal_type: 'News Item' })).toBe('News Item');
  });

  it('returns undefined when there is no type information', () => {
    expect(getItemPortalType({})).toBeUndefined();
  });
});

describe('isCarouselContentItem', () => {
  it('returns false when the item has no type information', () => {
    expect(isCarouselContentItem({})).toBe(false);
  });

  it.each(['Image', 'File', 'Folder', 'Collection'])(
    'excludes %s items even if not explicitly allowed',
    (type) => {
      expect(isCarouselContentItem({ '@type': type })).toBe(false);
    },
  );

  it.each(['Document', 'News Item'])('allows %s items', (type) => {
    expect(isCarouselContentItem({ '@type': type })).toBe(true);
  });

  it('excludes unknown portal types', () => {
    expect(isCarouselContentItem({ '@type': 'Event' })).toBe(false);
  });
});

describe('filterCarouselContentItems', () => {
  it('returns an empty array for no items', () => {
    expect(filterCarouselContentItems()).toEqual([]);
  });

  it('keeps only allowed content types', () => {
    const items = [
      { '@type': 'Document', id: 'a' },
      { '@type': 'Image', id: 'b' },
      { '@type': 'News Item', id: 'c' },
      { '@type': 'Folder', id: 'd' },
    ];

    expect(filterCarouselContentItems(items).map((item) => item.id)).toEqual([
      'a',
      'c',
    ]);
  });
});

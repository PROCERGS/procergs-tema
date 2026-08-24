import { normalizeListItems } from './normalizeListItems';
import { DEFAULT_API_PATH } from '../../../testing/mocks/ploneVoltoUrl';

const baseItem = {
  UID: 'uid-1',
  '@id': `${DEFAULT_API_PATH}/news/an-item`,
  '@type': 'News Item',
  title: 'An item',
  description: 'A short description',
};

describe('normalizeListItems - link variation', () => {
  it('returns id/title/meta and a flattened href', () => {
    const [result] = normalizeListItems([baseItem], { variation: 'link' });

    expect(result).toMatchObject({
      id: 'uid-1',
      title: 'An item',
      meta: 'News Item',
      href: '/news/an-item',
    });
  });

  it('formats meta as a date when the item has an effective date', () => {
    const item = { ...baseItem, effective: '2024-01-15T00:00:00Z' };
    const [result] = normalizeListItems([item], { variation: 'link' });

    expect(result.meta).toBe(new Date(item.effective).toLocaleDateString());
  });

  it('omits href when the item has no @id', () => {
    const [result] = normalizeListItems([{ ...baseItem, '@id': undefined }], {
      variation: 'link',
    });

    expect(result).not.toHaveProperty('href');
  });

  it('omits href in edit mode', () => {
    const [result] = normalizeListItems(
      [baseItem],
      { variation: 'link' },
      { isEditMode: true },
    );

    expect(result).not.toHaveProperty('href');
  });
});

describe('normalizeListItems - card variation', () => {
  it('uses default card variant/size and includes a flattened href', () => {
    const [result] = normalizeListItems([baseItem], { variation: 'card' });

    expect(result).toMatchObject({
      id: 'uid-1',
      title: 'An item',
      description: 'A short description',
      variant: 'news',
      size: 'small',
      href: '/news/an-item',
    });
  });

  it('honors custom cardVariant/cardSize', () => {
    const [result] = normalizeListItems([baseItem], {
      variation: 'card',
      cardVariant: 'event',
      cardSize: 'large',
    });

    expect(result).toMatchObject({ variant: 'event', size: 'large' });
  });

  it('truncates long titles and descriptions to 140 characters with an ellipsis', () => {
    const longText = 'x'.repeat(200);
    const [result] = normalizeListItems(
      [{ ...baseItem, title: longText, description: longText }],
      { variation: 'card' },
    );

    expect(result.title).toHaveLength(140);
    expect(result.title.endsWith('...')).toBe(true);
    expect(result.description).toHaveLength(140);
  });

  it('adds a "Ler mais" action when showCardAction is set and there is a href', () => {
    const [result] = normalizeListItems([baseItem], {
      variation: 'card',
      showCardAction: true,
    });

    expect(result.acao).toEqual({ label: 'Ler mais', url: '/news/an-item' });
  });

  it('does not add an action when showCardAction is set but there is no href', () => {
    const [result] = normalizeListItems([{ ...baseItem, '@id': undefined }], {
      variation: 'card',
      showCardAction: true,
    });

    expect(result).not.toHaveProperty('acao');
  });

  it('includes tags (capped at tagsLimit, min 1 max 3) when showTags is set', () => {
    const item = { ...baseItem, Subject: ['a', 'b', 'c', 'd'] };
    const [result] = normalizeListItems([item], {
      variation: 'card',
      showTags: true,
      tagsLimit: 2,
    });

    expect(result.tags).toEqual(['a', 'b', 'c', 'd']);
    expect(result.tagsLimit).toBe(2);
  });

  it('omits tags when showTags is set but there are no subjects', () => {
    const [result] = normalizeListItems([baseItem], {
      variation: 'card',
      showTags: true,
    });

    expect(result).not.toHaveProperty('tags');
  });
});

describe('normalizeListItems - default variation', () => {
  it('never includes a href, even outside edit mode', () => {
    const [result] = normalizeListItems([baseItem], {});

    expect(result).not.toHaveProperty('href');
    expect(result).toMatchObject({
      id: 'uid-1',
      title: 'An item',
      text: 'A short description',
    });
  });

  it('adds a label from the group-by field when labeled is set', () => {
    const [result] = normalizeListItems([baseItem], { labeled: true });

    expect(result.label).toBe('News Item');
  });

  it('does not add a label when groupBy is "none"', () => {
    const [result] = normalizeListItems([baseItem], {
      labeled: true,
      groupBy: 'none',
    });

    expect(result).not.toHaveProperty('label');
  });

  it('does not add a label when labeled is not set', () => {
    const [result] = normalizeListItems([baseItem], {});

    expect(result).not.toHaveProperty('label');
  });
});

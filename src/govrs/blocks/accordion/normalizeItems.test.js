import { normalizeItems } from './normalizeItems';

describe('normalizeItems', () => {
  it('returns an empty array for no items', () => {
    expect(normalizeItems()).toEqual([]);
  });

  it('drops items without a non-blank title', () => {
    const items = [{ title: '  ' }, { title: '' }, {}];

    expect(normalizeItems(items)).toEqual([]);
  });

  it('trims the title and generates a fallback id based on position', () => {
    const [item] = normalizeItems([{ title: '  Hello  ' }]);

    expect(item.title).toBe('Hello');
    expect(item.id).toBe('accordion-item-0');
  });

  it('uses the provided id when present', () => {
    const [item] = normalizeItems([{ id: 'custom-id', title: 'Hello' }]);

    expect(item.id).toBe('custom-id');
  });

  it('wraps content in a div with the expected class name', () => {
    const [item] = normalizeItems([
      { title: 'Hello', content: 'Some content' },
    ]);

    expect(item.content).toMatchObject({
      type: 'div',
      props: {
        className: 'govrs-accordion-block__content',
        children: 'Some content',
      },
    });
  });

  it('sets content to null when there is no content', () => {
    const [item] = normalizeItems([{ title: 'Hello' }]);

    expect(item.content).toBeNull();
  });

  it('coerces disabled to a boolean and always sets an empty searchText', () => {
    const [enabled, disabled] = normalizeItems([
      { title: 'A', disabled: 0 },
      { title: 'B', disabled: 'yes' },
    ]);

    expect(enabled.disabled).toBe(false);
    expect(disabled.disabled).toBe(true);
    expect(enabled.searchText).toBe('');
    expect(disabled.searchText).toBe('');
  });

  it('keeps the index-based fallback id in sync with the filtered position, not the original one', () => {
    const items = [{ title: '' }, { title: 'First' }, { title: 'Second' }];

    const result = normalizeItems(items);

    expect(result.map((item) => item.id)).toEqual([
      'accordion-item-0',
      'accordion-item-1',
    ]);
  });
});

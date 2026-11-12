import { moveBlockEnhanced } from './Blocks';

jest.mock(
  '@plone/volto-original/helpers/Blocks/Blocks',
  () => {
    const getBlocksFieldname = (data) =>
      Object.keys(data).find((key) => key.endsWith('blocks')) || null;
    const getBlocksLayoutFieldname = (data) =>
      Object.keys(data).find((key) => key.endsWith('blocks_layout')) || null;
    const findContainer = (data, { containerId }) => {
      const blocksFieldname = getBlocksFieldname(data);
      if (!blocksFieldname) return undefined;
      if (data[blocksFieldname][containerId]) {
        return data[blocksFieldname][containerId];
      }

      return Object.values(data[blocksFieldname]).reduce(
        (found, block) => found || findContainer(block, { containerId }),
        undefined,
      );
    };

    return {
      findContainer,
      getBlocksFieldname,
      getBlocksLayoutFieldname,
    };
  },
  { virtual: true },
);

const container = (type, items, blocks) => ({
  '@type': type,
  blocks_layout: { items },
  blocks,
});

const createFormData = () => ({
  blocks_layout: { items: ['grid', 'root-leaf'] },
  blocks: {
    grid: container('gridBlock', ['group', 'grid-leaf'], {
      group: container('group', ['nested-a', 'nested-b'], {
        'nested-a': { '@type': 'text', value: 'A' },
        'nested-b': { '@type': 'text', value: 'B' },
      }),
      'grid-leaf': { '@type': 'teaser' },
    }),
    'root-leaf': { '@type': 'image' },
  },
});

describe('moveBlockEnhanced', () => {
  it('moves a deeply nested Group child to the page root', () => {
    const formData = createFormData();
    const result = moveBlockEnhanced(formData, {
      source: { id: 'nested-a', parent: 'group', position: 0 },
      destination: { parent: null, position: 1 },
    });

    expect(result.blocks_layout.items).toEqual([
      'grid',
      'nested-a',
      'root-leaf',
    ]);
    expect(result.blocks['nested-a']).toEqual({ '@type': 'text', value: 'A' });
    expect(result.blocks.grid.blocks.group.blocks_layout.items).toEqual([
      'nested-b',
    ]);
    expect(result.blocks.grid.blocks.group.blocks['nested-a']).toBeUndefined();
    expect(formData.blocks.grid.blocks.group.blocks['nested-a']).toBeDefined();
  });

  it('moves a page-root block into a nested Grid', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'root-leaf', parent: null, position: 1 },
      destination: { parent: 'grid', position: 1 },
    });

    expect(result.blocks_layout.items).toEqual(['grid']);
    expect(result.blocks['root-leaf']).toBeUndefined();
    expect(result.blocks.grid.blocks_layout.items).toEqual([
      'group',
      'root-leaf',
      'grid-leaf',
    ]);
    expect(result.blocks.grid.blocks['root-leaf']).toEqual({
      '@type': 'image',
    });
  });

  it('moves a Grid child out to the page root', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'grid-leaf', parent: 'grid', position: 1 },
      destination: { parent: null, position: 1 },
    });

    expect(result.blocks_layout.items).toEqual([
      'grid',
      'grid-leaf',
      'root-leaf',
    ]);
    expect(result.blocks.grid.blocks_layout.items).toEqual(['group']);
    expect(result.blocks['grid-leaf']).toEqual({ '@type': 'teaser' });
  });

  it('moves a Group child into its parent Grid', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'nested-b', parent: 'group', position: 1 },
      destination: { parent: 'grid', position: 2 },
    });

    expect(result.blocks.grid.blocks_layout.items).toEqual([
      'group',
      'grid-leaf',
      'nested-b',
    ]);
    expect(result.blocks.grid.blocks.group.blocks_layout.items).toEqual([
      'nested-a',
    ]);
    expect(result.blocks.grid.blocks['nested-b']).toEqual({
      '@type': 'text',
      value: 'B',
    });
  });

  it('moves an entire Group and preserves all of its children', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'group', parent: 'grid', position: 0 },
      destination: { parent: null, position: 1 },
    });

    expect(result.blocks_layout.items).toEqual(['grid', 'group', 'root-leaf']);
    expect(result.blocks.grid.blocks_layout.items).toEqual(['grid-leaf']);
    expect(result.blocks.group.blocks_layout.items).toEqual([
      'nested-a',
      'nested-b',
    ]);
    expect(result.blocks.group.blocks['nested-a']).toEqual({
      '@type': 'text',
      value: 'A',
    });
  });

  it('reorders an entire Grid and preserves its nested tree', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'grid', parent: null, position: 0 },
      destination: { parent: null, position: 1 },
    });

    expect(result.blocks_layout.items).toEqual(['root-leaf', 'grid']);
    expect(result.blocks.grid.blocks.group.blocks_layout.items).toEqual([
      'nested-a',
      'nested-b',
    ]);
  });

  it('reorders blocks inside a nested Group', () => {
    const result = moveBlockEnhanced(createFormData(), {
      source: { id: 'nested-a', parent: 'group', position: 0 },
      destination: { parent: 'group', position: 1 },
    });

    expect(result.blocks.grid.blocks.group.blocks_layout.items).toEqual([
      'nested-b',
      'nested-a',
    ]);
  });
});

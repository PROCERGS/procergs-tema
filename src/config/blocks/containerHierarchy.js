export const CONTAINER_BLOCK_TYPES = ['gridBlock', 'procergsSection'];
export const CAROUSEL_BLOCK_TYPE = 'carousel';

const unique = (items) => [...new Set(items)];

export const buildContainerHierarchy = ({
  sectionAllowedBlocks = [],
  gridAllowedBlocks = [],
}) => {
  const rootSectionAllowedBlocks = unique([
    ...sectionAllowedBlocks.filter(
      (blockType) => blockType !== CAROUSEL_BLOCK_TYPE,
    ),
    'gridBlock',
    'procergsSection',
  ]);

  return {
    rootSectionAllowedBlocks,
    terminalSectionAllowedBlocks: rootSectionAllowedBlocks.filter(
      (blockType) => !CONTAINER_BLOCK_TYPES.includes(blockType),
    ),
    gridAllowedBlocks: unique([
      ...gridAllowedBlocks.filter(
        (blockType) =>
          !CONTAINER_BLOCK_TYPES.includes(blockType) &&
          blockType !== CAROUSEL_BLOCK_TYPE,
      ),
      CAROUSEL_BLOCK_TYPE,
      'procergsSection',
    ]),
  };
};

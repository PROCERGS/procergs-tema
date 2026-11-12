const CAROUSEL_BLOCK_TYPE = 'carousel';
const GRID_BLOCK_TYPE = 'gridBlock';
const SECTION_BLOCK_TYPE = 'procergsSection';
const MAX_CAROUSEL_GRID_COLUMNS = 2;

const getGridColumnCount = (value) => {
  const columns = Number(value);
  return Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : null;
};

const getContainedBlockTypes = (data = {}) =>
  (data.blocks_layout?.items || []).flatMap((blockId) => {
    const child = data.blocks?.[blockId];
    if (!child) return [];

    return [child['@type'], ...getContainedBlockTypes(child)].filter(Boolean);
  });

const getBlockGridMaxColumns = (blockType, blocksConfig = {}) =>
  getGridColumnCount(blocksConfig?.[blockType]?.gridRules?.maxColumns);

export const getGridRuleBlockTypes = (blocksConfig = {}) =>
  Object.entries(blocksConfig)
    .filter(([, blockConfig]) => blockConfig.gridRules?.allowed)
    .map(([blockType]) => blockType);

export const getAllowedBlocksForContainer = ({
  blockType,
  data = {},
  allowedBlocks = [],
  blocksConfig = {},
  gridColumns,
}) => {
  const columnsLength = data.blocks_layout?.items?.length || 0;
  const effectiveGridColumns =
    blockType === GRID_BLOCK_TYPE
      ? getGridColumnCount(columnsLength)
      : getGridColumnCount(gridColumns);
  const carouselIsAllowed =
    blockType === GRID_BLOCK_TYPE && columnsLength <= MAX_CAROUSEL_GRID_COLUMNS;

  return allowedBlocks.filter((allowedBlock) => {
    if (
      allowedBlock === CAROUSEL_BLOCK_TYPE &&
      (blockType === SECTION_BLOCK_TYPE || !carouselIsAllowed)
    ) {
      return false;
    }

    const maxColumns = getBlockGridMaxColumns(allowedBlock, blocksConfig);
    return (
      !effectiveGridColumns || !maxColumns || effectiveGridColumns <= maxColumns
    );
  });
};

export const getContainerMaxLength = ({
  blockType,
  data = {},
  maxLength,
  blocksConfig = {},
}) => {
  if (blockType !== GRID_BLOCK_TYPE) return maxLength;

  const containedBlockTypes = getContainedBlockTypes(data);
  const configuredLimits = containedBlockTypes
    .map((containedBlockType) =>
      getBlockGridMaxColumns(containedBlockType, blocksConfig),
    )
    .filter(Boolean);
  const limits = [
    ...configuredLimits,
    ...(containedBlockTypes.includes(CAROUSEL_BLOCK_TYPE)
      ? [MAX_CAROUSEL_GRID_COLUMNS]
      : []),
  ];

  return limits.length > 0 ? Math.min(maxLength, ...limits) : maxLength;
};

export const getRenderableBlocksConfig = ({
  allowedBlocks = [],
  blocksConfig = {},
  fallbackBlocksConfig = {},
  data = {},
}) => {
  const existingBlockTypes = (data.blocks_layout?.items || [])
    .map((blockId) => data.blocks?.[blockId]?.['@type'])
    .filter(Boolean);
  const renderableBlockTypes = new Set([
    ...allowedBlocks,
    ...existingBlockTypes,
  ]);
  const availableBlocksConfig = {
    ...fallbackBlocksConfig,
    ...blocksConfig,
  };

  return Object.fromEntries(
    Object.entries(availableBlocksConfig).filter(([blockType]) =>
      renderableBlockTypes.has(blockType),
    ),
  );
};

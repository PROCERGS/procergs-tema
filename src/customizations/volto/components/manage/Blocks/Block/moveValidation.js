const findContainer = (data, containerId) => {
  if (!data?.blocks) return undefined;

  const directMatch = data.blocks[containerId];
  if (directMatch?.blocks && directMatch?.blocks_layout) return directMatch;

  return Object.values(data.blocks).reduce(
    (found, block) => found || findContainer(block, containerId),
    undefined,
  );
};

/**
 * Validate only the destination affected by a move.
 *
 * The original Volto callback validates every container on the page and
 * silently discards the drop when any pre-existing block is no longer allowed
 * by the current configuration. Reordering in place must always remain
 * possible, and moving a container preserves its complete child tree.
 */
export const isMoveAllowed = (
  formData,
  { source, destination },
  blocksConfig,
) => {
  if (source.parent === destination.parent) return true;

  const destinationContainer = destination.parent
    ? findContainer(formData, destination.parent)
    : formData;
  const movedBlock = destinationContainer?.blocks?.[source.id];

  if (!destinationContainer || !movedBlock) return false;

  const allBlockTypes = Object.keys(blocksConfig);
  const destinationConfig = destination.parent
    ? blocksConfig[destinationContainer['@type']]
    : null;
  const allowedBlockTypes = destination.parent
    ? [...(destinationConfig?.allowedBlocks || allBlockTypes), 'empty']
    : allBlockTypes;
  const maxLength = destinationConfig?.maxLength || Infinity;

  return (
    allowedBlockTypes.includes(movedBlock['@type']) &&
    destinationContainer.blocks_layout.items.length <= maxLength
  );
};

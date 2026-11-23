export default function getAvailableRegionBlocks(
  allowedBlocks,
  properties,
  blocksConfig,
) {
  if (!Array.isArray(allowedBlocks)) return allowedBlocks;

  const presentTypes = new Set(
    (properties.blocks_layout?.items || []).map(
      (id) => properties.blocks?.[id]?.['@type'],
    ),
  );
  return allowedBlocks.filter(
    (type) => !blocksConfig[type]?.unique || !presentTypes.has(type),
  );
}

const CONTAINER_BLOCK_TYPES = ['procergsSection', 'gridBlock'];

const isNestedContainer = (properties, isContainer = false) =>
  Boolean(isContainer) || CONTAINER_BLOCK_TYPES.includes(properties?.['@type']);

export default isNestedContainer;

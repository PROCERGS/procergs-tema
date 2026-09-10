import cloneDeep from 'lodash/cloneDeep';

// Resolved by Volto's customization webpack alias.
/* eslint-disable import/no-unresolved */
import {
  findContainer,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto-original/helpers/Blocks/Blocks';

export * from '@plone/volto-original/helpers/Blocks/Blocks';
/* eslint-enable import/no-unresolved */

const moveInArray = (items, from, to) => {
  const result = [...items];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
};

const insertInArray = (items, item, position) => {
  const result = [...items];
  result.splice(position, 0, item);
  return result;
};

const removeFromArray = (items, position) => [
  ...items.slice(0, position),
  ...items.slice(position + 1),
];

const resolveContainer = (formData, parentId) =>
  parentId ? findContainer(formData, { containerId: parentId }) : formData;

/**
 * Move a block between arbitrary levels of nested Group/Grid containers.
 *
 * Volto's implementation resolves destination containers recursively, but
 * reads source containers directly from the page's top-level `blocks`. That
 * fails as soon as the source parent is itself nested.
 */
export function moveBlockEnhanced(formData, { source, destination }) {
  const clonedFormData = cloneDeep(formData);
  const sourceContainer = resolveContainer(clonedFormData, source.parent);
  const destinationContainer = resolveContainer(
    clonedFormData,
    destination.parent,
  );

  if (!sourceContainer || !destinationContainer) return clonedFormData;

  const sourceBlocksFieldname = getBlocksFieldname(sourceContainer);
  const sourceLayoutFieldname = getBlocksLayoutFieldname(sourceContainer);
  const destinationBlocksFieldname = getBlocksFieldname(destinationContainer);
  const destinationLayoutFieldname =
    getBlocksLayoutFieldname(destinationContainer);

  if (
    !sourceBlocksFieldname ||
    !sourceLayoutFieldname ||
    !destinationBlocksFieldname ||
    !destinationLayoutFieldname
  ) {
    return clonedFormData;
  }

  if (sourceContainer === destinationContainer) {
    sourceContainer[sourceLayoutFieldname].items = moveInArray(
      sourceContainer[sourceLayoutFieldname].items,
      source.position,
      destination.position,
    );
    return clonedFormData;
  }

  const block = sourceContainer[sourceBlocksFieldname][source.id];
  if (!block) return clonedFormData;

  destinationContainer[destinationBlocksFieldname][source.id] = block;
  destinationContainer[destinationLayoutFieldname].items = insertInArray(
    destinationContainer[destinationLayoutFieldname].items,
    source.id,
    destination.position,
  );

  delete sourceContainer[sourceBlocksFieldname][source.id];
  sourceContainer[sourceLayoutFieldname].items = removeFromArray(
    sourceContainer[sourceLayoutFieldname].items,
    source.position,
  );

  return clonedFormData;
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import find from 'lodash/find';

import {
  flattenTree,
  getProjection,
  removeChildrenOf,
} from '@plone/volto/components/manage/Blocks/Block/Order/utilities';
import SortableItem from '@plone/volto/components/manage/Blocks/Block/Order/SortableItem';

import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

export function getMoveCoordinates({
  items,
  activeId,
  overId,
  parentId,
  depth,
  arrayMove,
}) {
  const activeIndex = items.findIndex(({ id }) => id === activeId);
  const overIndex = items.findIndex(({ id }) => id === overId);

  if (activeIndex < 0 || overIndex < 0) return null;

  const activeItem = items[activeIndex];
  const reorderedItems = arrayMove(
    items.map((item) =>
      item.id === activeId ? { ...item, depth, parentId } : item,
    ),
    activeIndex,
    overIndex,
  );
  const destinationIndex = reorderedItems.findIndex(
    ({ id }) => id === activeId,
  );

  return {
    source: {
      position: activeItem.index,
      parent: activeItem.parentId,
      id: activeId,
    },
    destination: {
      // `index` in the flattened tree belongs to each item's original
      // container. Count the destination's direct children instead so this
      // remains correct when crossing Group/Grid boundaries at any depth.
      position: reorderedItems
        .slice(0, destinationIndex)
        .filter((item) => item.parentId === parentId).length,
      parent: parentId,
    },
  };
}

export function Order({
  items = [],
  onMoveBlock,
  onDeleteBlock,
  onSelectBlock,
  indentationWidth = 25,
  removable,
  dndKitCore,
  dndKitSortable,
  dndKitUtilities,
  errors,
}) {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null);

  const {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    MeasuringStrategy,
    defaultDropAnimation,
  } = dndKitCore;
  const { SortableContext, arrayMove, verticalListSortingStrategy } =
    dndKitSortable;
  const { CSS } = dndKitUtilities;

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const dropAnimationConfig = {
    keyframes({ transform }) {
      return [
        { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
        {
          opacity: 0,
          transform: CSS.Transform.toString({
            ...transform.final,
            x: transform.final.x + 5,
            y: transform.final.y + 5,
          }),
        },
      ];
    },
    easing: 'ease-out',
    sideEffects({ active }) {
      active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: defaultDropAnimation.duration,
        easing: defaultDropAnimation.easing,
      });
    },
  };

  const flattenedItems = useMemo(
    () => removeChildrenOf(flattenTree(items), activeId ? [activeId] : []),
    [activeId, items],
  );
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
          arrayMove,
        )
      : null;
  const sensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, parentId, depth, data }) => (
          <SortableItem
            key={id}
            id={id}
            parentId={parentId}
            data={data}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            onRemove={removable ? () => handleRemove(id) : undefined}
            onSelectBlock={onSelectBlock}
            errors={errors?.[id] || {}}
          />
        ))}
        {createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId && activeItem ? (
              <SortableItem
                id={activeId}
                depth={activeItem.depth}
                clone
                data={find(flattenedItems, { id: activeId }).data}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }) {
    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems = JSON.parse(JSON.stringify(flattenedItems));
      const coordinates = getMoveCoordinates({
        items: clonedItems,
        activeId: active.id,
        overId: over.id,
        parentId,
        depth,
        arrayMove,
      });

      if (coordinates) onMoveBlock(coordinates);
    }

    resetState();
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function handleRemove(id) {
    onDeleteBlock(id);
  }

  function getMovementAnnouncement(eventName, activeId, overId) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }
}

export default injectLazyLibs([
  'dndKitCore',
  'dndKitSortable',
  'dndKitUtilities',
])(Order);

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import ContainerEdit from '@plone/volto/components/manage/Blocks/Container/Edit';
import { deleteBlock } from '@plone/volto/helpers/Blocks/Blocks';
import { setUIState } from '@plone/volto/actions/form/form';
import SectionBlockBody from './SectionBlockBody';

const deleteNestedBlock = (container, blockId, intl) => {
  if (container.blocks?.[blockId]) {
    return deleteBlock(container, blockId, intl);
  }

  for (const childId of container.blocks_layout?.items || []) {
    const child = container.blocks?.[childId];
    if (!child?.blocks) continue;

    const updatedChild = deleteNestedBlock(child, blockId, intl);
    if (updatedChild !== child) {
      return {
        ...container,
        blocks: {
          ...container.blocks,
          [childId]: updatedChild,
        },
      };
    }
  }

  return container;
};

const Edit = (props) => {
  const { block, data, className, style, onChangeBlock } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const hoveredBlock = useSelector((state) => state.form.ui.hovered);

  useEffect(() => {
    const handleOrderDelete = (event) => {
      const nestedDeleteButton = event.target.closest(
        '#sidebar-order .tree-item.depth-1 .action.delete',
      );
      if (!nestedDeleteButton || !hoveredBlock) return;

      const updatedData = deleteNestedBlock(data, hoveredBlock, intl);
      if (updatedData === data) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onChangeBlock(block, updatedData);
      dispatch(setUIState({ hovered: null, gridSelected: null }));
    };

    document.addEventListener('click', handleOrderDelete, true);
    return () => document.removeEventListener('click', handleOrderDelete, true);
  }, [block, data, dispatch, hoveredBlock, intl, onChangeBlock]);

  return (
    <SectionBlockBody
      data={data}
      className={className}
      style={style}
      isEditMode
    >
      <ContainerEdit {...props} direction="vertical" />
    </SectionBlockBody>
  );
};

Edit.propTypes = {
  block: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  manage: PropTypes.bool.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
};

export default compose(withBlockExtensions)(Edit);

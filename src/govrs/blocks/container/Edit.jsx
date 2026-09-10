import { useState } from 'react';
import { useIntl } from 'react-intl';
import cx from 'classnames';
import pickBy from 'lodash/pickBy';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlocksForm } from '@plone/volto/components/manage/Form';
import PropTypes from 'prop-types';
import ContainerData from '@plone/volto/components/manage/Blocks/Container/Data';
import DefaultEditBlockWrapper from '@plone/volto/components/manage/Blocks/Container/EditBlockWrapper';
import SimpleContainerToolbar from '@plone/volto/components/manage/Blocks/Container/SimpleContainerToolbar';
import { v4 as uuid } from 'uuid';
import { blocksFormGenerator } from '@plone/volto/helpers/Blocks/Blocks';
import DefaultTemplateChooser from '@plone/volto/components/manage/TemplateChooser/TemplateChooser';
import config from '@plone/volto/registry';
import { useGridColumns } from '../grid/GridContext';
import isNestedContainer from './isNestedContainer';
import {
  getAllowedBlocksForContainer,
  getContainerMaxLength,
  getRenderableBlocksConfig,
} from './restrictions';

const ContainerBlockEdit = (props) => {
  const {
    block,
    data,
    direction = 'horizontal',
    onChangeBlock,
    onChangeField,
    pathname,
    selected,
    manage,
  } = props;

  const intl = useIntl();
  const gridColumns = useGridColumns();
  const blockType = data['@type'];
  const metadata = props.metadata || props.properties;
  const isInitialized = data?.blocks && data?.blocks_layout;
  const properties = isInitialized ? data : blocksFormGenerator(0, '');
  const blockConfig =
    props.blocksConfig?.[blockType] || config.blocks.blocksConfig[blockType];
  const blocksConfig = blockConfig.blocksConfig || props.blocksConfig;
  const allowedBlocks = getAllowedBlocksForContainer({
    blockType,
    data,
    allowedBlocks: blockConfig.allowedBlocks,
    blocksConfig,
    gridColumns,
  });
  const maxLength = getContainerMaxLength({
    blockType,
    data,
    maxLength: blockConfig.maxLength || 8,
    blocksConfig,
  });
  const templates = blockConfig.templates;
  const ContainerToolbar =
    blockConfig.containerToolbar || SimpleContainerToolbar;
  const TemplateChooser = blockConfig.templateChooser || DefaultTemplateChooser;
  const EditBlockWrapper =
    blockConfig.editBlockWrapper || DefaultEditBlockWrapper;

  let [selectedBlock, setSelectedBlock] = useState(
    properties.blocks_layout.items[0],
  );
  if (props.setSelectedBlock) {
    ({ selectedBlock, setSelectedBlock } = props);
  }

  const blockState = {};

  const onAddNewBlock = () => {
    const newuuid = uuid();
    const type = allowedBlocks?.length === 1 ? allowedBlocks[0] : null;
    const blocks = data.blocks || properties.blocks;
    const blocks_layout = data.blocks_layout || properties.blocks_layout;
    const newFormData = {
      ...data,
      blocks: {
        ...blocks,
        [newuuid]: { '@type': type || 'empty' },
      },
      blocks_layout: {
        items: [...blocks_layout.items, newuuid],
      },
    };

    if (blocks_layout.items.length < maxLength) {
      onChangeBlock(block, newFormData);
    }
  };

  const onSelectTemplate = (templateIndex) => {
    const resultantTemplates =
      allowedBlocks?.length === 1 ? templates(allowedBlocks[0]) : templates();
    onChangeBlock(block, {
      ...data,
      ...resultantTemplates(intl)[templateIndex].blocksData,
    });
  };

  const allowedBlocksConfig = pickBy(blocksConfig, (value, key) =>
    allowedBlocks.includes(key),
  );
  const renderableBlocksConfig = getRenderableBlocksConfig({
    allowedBlocks,
    blocksConfig,
    fallbackBlocksConfig: config.blocks.blocksConfig,
    data: properties,
  });

  const containerProps = {
    ...props,
    allowedBlocks,
    allowedBlocksConfig,
    blocksConfig,
    blockType,
    maxLength,
    metadata,
    onAddNewBlock,
    onSelectTemplate,
    selectedBlock,
    setSelectedBlock,
    templates,
  };

  return (
    <>
      {data.headline && <h2 className="headline">{data.headline}</h2>}
      {selected && (
        <div
          className={cx(
            'govrs-container-toolbar-slot',
            `govrs-container-toolbar-slot--${blockType}`,
            {
              'govrs-container-toolbar-slot--nested': isNestedContainer(
                props.properties,
                props.isContainer,
              ),
            },
          )}
        >
          <ContainerToolbar {...containerProps} />
        </div>
      )}
      {!isInitialized && templates && (
        <TemplateChooser
          templates={
            allowedBlocks?.length === 1
              ? templates(allowedBlocks[0])
              : templates()
          }
          onSelectTemplate={onSelectTemplate}
        />
      )}
      <BlocksForm
        metadata={metadata}
        properties={properties}
        direction={direction}
        manage={manage}
        selectedBlock={selected ? selectedBlock : null}
        allowedBlocks={allowedBlocks}
        blocksConfig={renderableBlocksConfig}
        title={data.placeholder}
        isContainer
        isMainForm={false}
        stopPropagation={selectedBlock}
        disableAddBlockOnEnterKey
        onSelectBlock={(id) => setSelectedBlock(id)}
        onChangeFormData={(newFormData) =>
          onChangeBlock(block, { ...data, ...newFormData })
        }
        onChangeField={(id, value) => {
          if (['blocks', 'blocks_layout'].includes(id)) {
            blockState[id] = value;
            onChangeBlock(block, { ...data, ...blockState });
          } else {
            onChangeField(id, value);
          }
        }}
        pathname={pathname}
      >
        {({ draginfo }, editBlock, blockProps) => (
          <EditBlockWrapper draginfo={draginfo} blockProps={blockProps}>
            {editBlock}
          </EditBlockWrapper>
        )}
      </BlocksForm>
      <SidebarPortal selected={selected && !selectedBlock}>
        <ContainerData {...props} />
      </SidebarPortal>
    </>
  );
};

ContainerBlockEdit.propTypes = {
  block: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  onChangeField: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  manage: PropTypes.bool.isRequired,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  blocksConfig: PropTypes.objectOf(PropTypes.any),
  metadata: PropTypes.objectOf(PropTypes.any),
  properties: PropTypes.objectOf(PropTypes.any),
  isContainer: PropTypes.bool,
  setSelectedBlock: PropTypes.func,
};

export default ContainerBlockEdit;

import React from 'react';
import BlockChooserButton from '@plone/volto/components/manage/BlockChooser/BlockChooserButton';
import config from '@plone/volto/registry';

const GlobalRegionBlockChooser = ({
  block,
  data,
  allowedBlocks,
  blocksConfig,
  properties,
  onMutateBlock,
  selected,
}) =>
  (Array.isArray(allowedBlocks) && allowedBlocks.length === 0) ||
  (selected && config.experimental.addBlockButton.enabled) ? null : (
    <BlockChooserButton
      block={block}
      data={data}
      allowedBlocks={allowedBlocks}
      blocksConfig={blocksConfig}
      properties={properties}
      onMutateBlock={onMutateBlock}
      showRestricted
    />
  );

export default GlobalRegionBlockChooser;

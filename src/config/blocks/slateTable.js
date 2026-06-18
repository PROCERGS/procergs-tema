import SlateTableBlockView from '../../govrs/blocks/slateTable/View';
import SlateTableBlockEdit from '../../govrs/blocks/slateTable/Edit';

const configureSlateTableBlock = (config) => {
  const existing = config.blocks.blocksConfig.slateTable;

  if (!existing) {
    return config;
  }

  config.blocks.blocksConfig.slateTable = {
    ...existing,
    view: SlateTableBlockView,
    edit: SlateTableBlockEdit,
  };

  return config;
};

export default configureSlateTableBlock;

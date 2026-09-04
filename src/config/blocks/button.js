import linkSVG from '@plone/volto/icons/link.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import ButtonBlockView from '../../govrs/blocks/button/View';
import ButtonBlockEdit from '../../govrs/blocks/button/Edit';
import ButtonBlockSchema from '../../govrs/blocks/button/schema';

const configureButtonBlock = (config) => {
  config.blocks.blocksConfig.procergsButton = {
    id: 'procergsButton',
    title: 'Botão',
    icon: linkSVG,
    group: 'common',
    view: ButtonBlockView,
    edit: ButtonBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: ButtonBlockSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  return config;
};

export default configureButtonBlock;

import listBulletSVG from '@plone/volto/icons/list-bullet.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import AccordionBlockView from '../../govrs/blocks/accordion/View';
import AccordionBlockEdit from '../../govrs/blocks/accordion/Edit';
import AccordionBlockSchema from '../../govrs/blocks/accordion/schema';

const configureAccordionBlock = (config) => {
  config.blocks.blocksConfig.accordion = {
    id: 'accordion',
    title: 'Accordion',
    icon: listBulletSVG,
    group: 'common',
    view: AccordionBlockView,
    edit: AccordionBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: AccordionBlockSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  return config;
};

export default configureAccordionBlock;

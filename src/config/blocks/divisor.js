import divisorSVG from '../../icons/divisor.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import DivisorBlockView from '../../govrs/blocks/divisor/View';
import DivisorBlockEdit from '../../govrs/blocks/divisor/Edit';
import DivisorBlockSchema from '../../govrs/blocks/divisor/schema';

const configureDivisorBlock = (config) => {
  config.blocks.blocksConfig.procergsDivisor = {
    id: 'procergsDivisor',
    title: 'Divisor',
    icon: divisorSVG,
    group: 'common',
    view: DivisorBlockView,
    edit: DivisorBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: DivisorBlockSchema,
    gridRules: { allowed: true },
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  return config;
};

export default configureDivisorBlock;

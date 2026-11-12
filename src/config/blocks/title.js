import TitleBlockEdit from '../../govrs/blocks/title/Edit';
import TitleBlockView from '../../govrs/blocks/title/View';
import { NEWS_ITEM } from '../../govrs/blocks/title/PublicationDate';
import { PUBLICATION_DATE_ALIGNMENT_FIELD } from '../../govrs/blocks/title/schema';

const titleBlockSchema = ({ properties }) => ({
  properties: {
    required: {
      default: properties?.['@type'] === NEWS_ITEM,
    },
  },
});

const configureTitleBlock = (config) => {
  config.blocks.blocksConfig.title.edit = TitleBlockEdit;
  config.blocks.blocksConfig.title.view = TitleBlockView;
  config.blocks.blocksConfig.title.sidebarTab = 1;
  config.blocks.blocksConfig.title.blockSchema = titleBlockSchema;

  config.blocks.initialBlocks = {
    ...config.blocks.initialBlocks,
    [NEWS_ITEM]: [
      {
        '@type': 'title',
        required: true,
        [PUBLICATION_DATE_ALIGNMENT_FIELD]: 'left',
      },
    ],
  };

  return config;
};

export default configureTitleBlock;

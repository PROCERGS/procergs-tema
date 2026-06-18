import imagesSVG from '@plone/volto/icons/images.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import BannerBlockView from '../../govrs/blocks/banner/View';
import BannerBlockEdit from '../../govrs/blocks/banner/Edit';
import BannerBlockSchema from '../../govrs/blocks/banner/schema';

const configureBannerBlock = (config) => {
  config.blocks.blocksConfig.banner = {
    id: 'banner',
    title: 'Banner',
    icon: imagesSVG,
    group: 'media',
    view: BannerBlockView,
    edit: BannerBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: BannerBlockSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  return config;
};

export default configureBannerBlock;

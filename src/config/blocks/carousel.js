import imagesSVG from '@plone/volto/icons/images.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import CarouselBlockView from '../../govrs/blocks/carousel/View';
import CarouselBlockEdit from '../../govrs/blocks/carousel/Edit';
import CarouselBlockSchema from '../../govrs/blocks/carousel/schema';
import getCarouselBlockAsyncData from '../../govrs/blocks/carousel/getAsyncData';

const configureCarouselBlock = (config) => {
  config.blocks.blocksConfig.carousel = {
    id: 'carousel',
    title: 'Carousel',
    icon: imagesSVG,
    group: 'common',
    view: CarouselBlockView,
    edit: CarouselBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: CarouselBlockSchema,
    getAsyncData: getCarouselBlockAsyncData,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  return config;
};

export default configureCarouselBlock;

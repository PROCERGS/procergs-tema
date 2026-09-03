import '../theme/_main.scss';
import configureSettings from './settings';
import configureTextBlock from './blocks/text';
import configureMapsBlock from './blocks/maps';
import configureAccordionBlock from './blocks/accordion';
import configureCarouselBlock from './blocks/carousel';
import configureListingBlock from './blocks/listing';
import configureBannerBlock from './blocks/banner';
import configureSlateTableBlock from './blocks/slateTable';
import configureSectionBlock from './blocks/section';
import configureGlobalRegionBlocks from './globalRegions';
import ColorInputWidget from '../govrs/widgets/ColorInputWidget';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...(config.widgets.widget || {}),
    color_input: ColorInputWidget,
  };

  configureSettings(config);
  configureTextBlock(config);
  configureMapsBlock(config);
  configureAccordionBlock(config);
  configureCarouselBlock(config);
  configureListingBlock(config);
  configureBannerBlock(config);
  configureSlateTableBlock(config);
  configureSectionBlock(config);
  configureGlobalRegionBlocks(config);

  config.blocks.requiredBlocks = [];

  return config;
};

export default applyConfig;

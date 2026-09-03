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
import configureTitleBlock from './blocks/title';

const applyConfig = (config) => {
  configureSettings(config);
  configureTextBlock(config);
  configureMapsBlock(config);
  configureAccordionBlock(config);
  configureCarouselBlock(config);
  configureListingBlock(config);
  configureBannerBlock(config);
  configureSlateTableBlock(config);
  configureSectionBlock(config);

  config.blocks.requiredBlocks = [];

  configureTitleBlock(config);
  return config;
};

export default applyConfig;

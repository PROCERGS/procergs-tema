import '../theme/_main.scss';
import configureSettings from './settings';
import configureTextBlock from './blocks/text';
import configureMapsBlock from './blocks/maps';
import configureAccordionBlock from './blocks/accordion';
import configureCarouselBlock from './blocks/carousel';
import configureListingBlock from './blocks/listing';
import configureBannerBlock from './blocks/banner';
import configureSlateTableBlock from './blocks/slateTable';

const applyConfig = (config) => {
  configureSettings(config);
  configureTextBlock(config);
  configureMapsBlock(config);
  configureAccordionBlock(config);
  configureCarouselBlock(config);
  configureListingBlock(config);
  configureBannerBlock(config);
  configureSlateTableBlock(config);
  return config;
};

export default applyConfig;

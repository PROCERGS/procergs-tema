import '../theme/_main.scss';
import configureSettings from './settings';
import configureTextBlock from './blocks/text';
import configureMapsBlock from './blocks/maps';
import configureAccordionBlock from './blocks/accordion';
import configureCarouselBlock from './blocks/carousel';
import configureListingBlock from './blocks/listing';
import configureBannerBlock from './blocks/banner';
import configureSlateTableBlock from './blocks/slateTable';
import configureButtonBlock from './blocks/button';
import configureSectionBlock from './blocks/section';
import configureTitleBlock from './blocks/title';
import configureGlobalRegionBlocks from './globalRegions';
import ColorInputWidget from '../govrs/widgets/ColorInputWidget';
import ColorContrastWidget from '../govrs/widgets/ColorContrastWidget';
import ButtonIconWidget from '../govrs/widgets/ButtonIconWidget';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...(config.widgets.widget || {}),
    color_input: ColorInputWidget,
    color_contrast: ColorContrastWidget,
    button_icon: ButtonIconWidget,
  };

  configureSettings(config);
  configureTextBlock(config);
  configureMapsBlock(config);
  configureAccordionBlock(config);
  configureCarouselBlock(config);
  configureListingBlock(config);
  configureBannerBlock(config);
  configureSlateTableBlock(config);
  configureButtonBlock(config);
  configureSectionBlock(config);
  configureGlobalRegionBlocks(config);

  config.blocks.requiredBlocks = [];

  configureTitleBlock(config);
  return config;
};

export default applyConfig;

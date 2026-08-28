import cloneDeep from 'lodash/cloneDeep';
import layoutSVG from '@plone/volto/icons/grid-block.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import SectionBlockView from '../../govrs/blocks/section/View';
import SectionBlockEdit from '../../govrs/blocks/section/Edit';
import SectionBlockSchema, {
  sectionSchemaEnhancer,
} from '../../govrs/blocks/section/schema';
import sectionTemplates from '../../govrs/blocks/section/templates';
import ColorContrastWidget from '../../govrs/widgets/ColorContrastWidget';

const DEFAULT_ALLOWED_BLOCKS = [
  'slate',
  'image',
  'teaser',
  'listing',
  'banner',
  'carousel',
  'maps',
  'accordion',
  'slateTable',
  'gridBlock',
];

const sectionDataAdapter = ({ block, data, id, onChangeBlock, value }) => {
  const nextData = {
    ...data,
    [id]: value,
  };
  delete nextData.videoPoster;

  if (id === 'backgroundType') {
    if (value !== 'image') {
      delete nextData.backgroundImage;
    }
    if (value !== 'video') {
      delete nextData.videoSource;
      delete nextData.videoFile;
      delete nextData.videoUrl;
      delete nextData.videoStart;
      delete nextData.videoEnd;
    } else if (!nextData.videoSource) {
      nextData.videoSource = data.videoFile ? 'file' : 'youtube';
    }
  }
  if (id === 'videoSource') {
    if (value === 'file') {
      delete nextData.videoUrl;
    } else {
      delete nextData.videoFile;
    }
  }
  if (id === 'overlayHeader' && !value) {
    delete nextData.overlayAccessibilityBar;
  }

  onChangeBlock(block, nextData);
};

const configureSectionBlock = (config) => {
  const sectionSettings = config.settings.procergsSection || {};
  const allowedBlocks = sectionSettings.allowedBlocks || DEFAULT_ALLOWED_BLOCKS;

  config.widgets.widget.color_contrast = ColorContrastWidget;

  config.blocks.blocksConfig.procergsSection = {
    id: 'procergsSection',
    title: 'Grupo',
    icon: layoutSVG,
    group: 'common',
    view: SectionBlockView,
    edit: SectionBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: SectionBlockSchema,
    schemaEnhancer: sectionSchemaEnhancer,
    dataAdapter: sectionDataAdapter,
    templates: sectionTemplates,
    maxLength: sectionSettings.maxLength || 50,
    allowedBlocks,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  const childBlocksConfig = cloneDeep(config.blocks.blocksConfig);
  delete childBlocksConfig.procergsSection;
  config.blocks.blocksConfig.procergsSection.blocksConfig = childBlocksConfig;

  return config;
};

export default configureSectionBlock;

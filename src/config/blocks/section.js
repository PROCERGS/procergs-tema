import layoutSVG from '@plone/volto/icons/grid-block.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import SectionBlockView from '../../govrs/blocks/section/View';
import SectionBlockEdit from '../../govrs/blocks/section/Edit';
import SectionBlockSchema, {
  NestedSectionBlockSchema,
  backgroundSchemaEnhancer,
  sectionSchemaEnhancer,
} from '../../govrs/blocks/section/schema';
import sectionTemplates from '../../govrs/blocks/section/templates';
import GridBlockView from '../../govrs/blocks/grid/View';
import GridBlockEdit from '../../govrs/blocks/grid/Edit';
import GridBlockSchema, {
  gridSchemaEnhancer,
} from '../../govrs/blocks/grid/schema';
import restrictGridImageAlignment from '../../govrs/blocks/grid/imageSchema';
import backgroundDataAdapter from '../../govrs/blocks/container/backgroundDataAdapter';
import { getGridRuleBlockTypes } from '../../govrs/blocks/container/restrictions';
import { buildContainerHierarchy } from './containerHierarchy';

export const DEFAULT_ALLOWED_BLOCKS = [
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
  'procergsSection',
  'procergsButton',
];

const pickBlockConfigs = (blocksConfig, blockTypes) =>
  Object.fromEntries(
    blockTypes
      .filter((blockType) => blocksConfig?.[blockType])
      .map((blockType) => [blockType, blocksConfig[blockType]]),
  );

export const buildContainerBlocksConfig = (
  blocksConfig,
  sectionSettings = {},
) => {
  const configuredAllowedBlocks =
    sectionSettings.allowedBlocks || DEFAULT_ALLOWED_BLOCKS;
  const originalGridConfig = blocksConfig.gridBlock;
  const originalGridAllowedBlocks = originalGridConfig.allowedBlocks || [];
  const gridRuleBlockTypes = getGridRuleBlockTypes(blocksConfig);
  const {
    rootSectionAllowedBlocks,
    terminalSectionAllowedBlocks,
    gridAllowedBlocks,
  } = buildContainerHierarchy({
    sectionAllowedBlocks: configuredAllowedBlocks,
    gridAllowedBlocks: [...originalGridAllowedBlocks, ...gridRuleBlockTypes],
  });

  const commonSectionConfig = {
    id: 'procergsSection',
    title: 'Grupo',
    icon: layoutSVG,
    group: 'common',
    view: SectionBlockView,
    edit: SectionBlockEdit,
    schema: BlockSettingsSchema,
    dataAdapter: backgroundDataAdapter,
    templates: sectionTemplates,
    maxLength: sectionSettings.maxLength || 50,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  const terminalSectionConfig = {
    ...commonSectionConfig,
    blockSchema: NestedSectionBlockSchema,
    schemaEnhancer: backgroundSchemaEnhancer,
    allowedBlocks: terminalSectionAllowedBlocks,
    blocksConfig: pickBlockConfigs(blocksConfig, terminalSectionAllowedBlocks),
  };

  const originalGridBlocksConfig =
    originalGridConfig.blocksConfig || blocksConfig;
  const gridImageConfig = {
    ...(originalGridBlocksConfig.image || blocksConfig.image),
    schemaEnhancer: restrictGridImageAlignment,
  };
  const gridCarouselConfig =
    originalGridBlocksConfig.carousel || blocksConfig.carousel;
  const gridTerminalSectionConfig = {
    ...terminalSectionConfig,
    blocksConfig: {
      ...terminalSectionConfig.blocksConfig,
      image: gridImageConfig,
    },
  };

  const gridConfig = {
    ...originalGridConfig,
    view: GridBlockView,
    edit: GridBlockEdit,
    blockSchema: GridBlockSchema,
    schemaEnhancer: gridSchemaEnhancer,
    dataAdapter: backgroundDataAdapter,
    allowedBlocks: gridAllowedBlocks,
    blocksConfig: {
      ...pickBlockConfigs(originalGridBlocksConfig, originalGridAllowedBlocks),
      ...pickBlockConfigs(blocksConfig, gridRuleBlockTypes),
      ...(gridCarouselConfig ? { carousel: gridCarouselConfig } : {}),
      image: gridImageConfig,
      procergsSection: gridTerminalSectionConfig,
    },
  };

  const sectionConfig = {
    ...commonSectionConfig,
    blockSchema: SectionBlockSchema,
    schemaEnhancer: sectionSchemaEnhancer,
    allowedBlocks: rootSectionAllowedBlocks,
    blocksConfig: {
      ...pickBlockConfigs(blocksConfig, terminalSectionAllowedBlocks),
      gridBlock: gridConfig,
      procergsSection: terminalSectionConfig,
    },
  };

  return {
    gridConfig,
    sectionConfig,
    terminalSectionConfig,
    gridTerminalSectionConfig,
  };
};

const configureSectionBlock = (config) => {
  const sectionSettings = config.settings.procergsSection || {};
  const { gridConfig, sectionConfig } = buildContainerBlocksConfig(
    config.blocks.blocksConfig,
    sectionSettings,
  );

  config.blocks.blocksConfig.gridBlock = gridConfig;
  config.blocks.blocksConfig.procergsSection = sectionConfig;

  return config;
};

export default configureSectionBlock;

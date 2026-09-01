import layoutSVG from '@plone/volto/icons/grid-block.svg';
import stateBarSVG from '@plone/volto/icons/row-before.svg';
import accessibilitySVG from '@plone/volto/icons/accessibility.svg';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import { configureGlobalRegions } from '@procergs/volto-global-regions';
import { ProcergsGlobalHeaderBlock } from '../govrs/components/Header/Header';
import HeaderBlockEdit from '../govrs/blocks/globalHeader/Edit';
import HeaderBlockSchema from '../govrs/blocks/globalHeader/schema';
import { ProcergsGlobalStateBarBlock } from '../govrs/components/Header/StateBar';
import StateBarBlockEdit from '../govrs/blocks/globalStateBar/Edit';
import StateBarBlockSchema from '../govrs/blocks/globalStateBar/schema';
import { ProcergsGlobalAccessibilityBarBlock } from '../govrs/components/Header/AccessibilityBar';
import AccessibilityBarBlockEdit from '../govrs/blocks/globalAccessibility/Edit';
import AccessibilityBarBlockSchema from '../govrs/blocks/globalAccessibility/schema';
import { ProcergsGlobalFooterBlock } from '../govrs/components/Footer/Footer';
import FooterBlockEdit from '../govrs/blocks/globalFooter/Edit';
import FooterBlockSchema from '../govrs/blocks/globalFooter/schema';

export const HEADER_BLOCK_TYPE = 'procergsGlobalHeader';
export const STATE_BAR_BLOCK_TYPE = 'procergsGlobalStateBar';
export const ACCESSIBILITY_BAR_BLOCK_TYPE = 'procergsGlobalAccessibilityBar';
export const FOOTER_BLOCK_TYPE = 'procergsGlobalFooter';

const createSingleBlockRegion = (id, type) => ({
  blocks: {
    [id]: {
      '@type': type,
      allowOverlay: true,
    },
  },
  blocks_layout: {
    items: [id],
  },
});

export const createDefaultHeaderRegion = () => ({
  blocks: {
    'procergs-global-state-bar': {
      '@type': STATE_BAR_BLOCK_TYPE,
      allowOverlay: true,
    },
    'procergs-global-accessibility-bar': {
      '@type': ACCESSIBILITY_BAR_BLOCK_TYPE,
      allowOverlay: true,
    },
    'procergs-global-header': {
      '@type': HEADER_BLOCK_TYPE,
      variation: 'default',
      allowOverlay: true,
      showLogo: true,
      showTitle: true,
    },
  },
  blocks_layout: {
    items: [
      'procergs-global-state-bar',
      'procergs-global-accessibility-bar',
      'procergs-global-header',
    ],
  },
});

export const createDefaultFooterRegion = () =>
  createSingleBlockRegion('procergs-global-footer', FOOTER_BLOCK_TYPE);

const configureGlobalRegionBlocks = (config) => {
  config.blocks.blocksConfig[HEADER_BLOCK_TYPE] = {
    id: HEADER_BLOCK_TYPE,
    title: 'Cabeçalho GovRS',
    icon: layoutSVG,
    group: 'common',
    view: ProcergsGlobalHeaderBlock,
    edit: HeaderBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: HeaderBlockSchema,
    restricted: true,
    mostUsed: false,
    sidebarTab: 0,
    blockHasValue: () => true,
  };

  config.blocks.blocksConfig[STATE_BAR_BLOCK_TYPE] = {
    id: STATE_BAR_BLOCK_TYPE,
    title: 'Barra do Estado Standalone',
    icon: stateBarSVG,
    group: 'common',
    view: ProcergsGlobalStateBarBlock,
    edit: StateBarBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: StateBarBlockSchema,
    restricted: true,
    mostUsed: false,
    sidebarTab: 0,
    blockHasValue: () => true,
  };

  config.blocks.blocksConfig[ACCESSIBILITY_BAR_BLOCK_TYPE] = {
    id: ACCESSIBILITY_BAR_BLOCK_TYPE,
    title: 'Barra de Acessibilidade',
    icon: accessibilitySVG,
    group: 'common',
    view: ProcergsGlobalAccessibilityBarBlock,
    edit: AccessibilityBarBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: AccessibilityBarBlockSchema,
    restricted: true,
    mostUsed: false,
    sidebarTab: 0,
    blockHasValue: () => true,
  };

  config.blocks.blocksConfig[FOOTER_BLOCK_TYPE] = {
    id: FOOTER_BLOCK_TYPE,
    title: 'Rodapé GovRS',
    icon: layoutSVG,
    group: 'common',
    view: ProcergsGlobalFooterBlock,
    edit: FooterBlockEdit,
    schema: BlockSettingsSchema,
    blockSchema: FooterBlockSchema,
    restricted: true,
    mostUsed: false,
    sidebarTab: 0,
    blockHasValue: () => true,
  };

  return configureGlobalRegions(config, {
    activeRegion: 'header',
    fetchPath: '/?expand=actions',
    savePath: '/',
    regions: {
      header: {
        fieldName: 'header_region',
        title: 'Cabeçalho global',
        allowedBlocks: [
          STATE_BAR_BLOCK_TYPE,
          ACCESSIBILITY_BAR_BLOCK_TYPE,
          HEADER_BLOCK_TYPE,
        ],
        maxLength: 3,
        createDefault: createDefaultHeaderRegion,
      },
      footer: {
        fieldName: 'footer_region',
        title: 'Rodapé global',
        allowedBlocks: [FOOTER_BLOCK_TYPE],
        maxLength: 1,
        createDefault: createDefaultFooterRegion,
      },
    },
  });
};

export default configureGlobalRegionBlocks;

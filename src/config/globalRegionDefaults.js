export const HEADER_BLOCK_TYPE = 'procergsGlobalHeader';
export const STATE_BAR_BLOCK_TYPE = 'procergsGlobalStateBar';
export const ACCESSIBILITY_BAR_BLOCK_TYPE = 'procergsGlobalAccessibilityBar';
export const FOOTER_BLOCK_TYPE = 'procergsGlobalFooter';
export const BREADCRUMBS_BLOCK_TYPE = 'procergsGlobalBreadcrumbs';
export const THEME_BLOCK_TYPE = 'procergsGlobalTheme';

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
    'procergs-global-breadcrumbs': {
      '@type': BREADCRUMBS_BLOCK_TYPE,
      showHome: true,
      homeLabel: 'Página inicial',
      ariaLabel: 'Migalhas de pão',
      allowOverlay: true,
    },
  },
  blocks_layout: {
    items: [
      'procergs-global-state-bar',
      'procergs-global-accessibility-bar',
      'procergs-global-header',
      'procergs-global-breadcrumbs',
    ],
  },
});

export const createDefaultFooterRegion = () =>
  createSingleBlockRegion('procergs-global-footer', FOOTER_BLOCK_TYPE);

export const createDefaultThemeRegion = () => ({
  blocks: {
    'procergs-global-theme': {
      '@type': THEME_BLOCK_TYPE,
      primaryColor: '#1A7235',
      secondaryColor: '#005CA9',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
      linkColor: '#1351B4',
    },
  },
  blocks_layout: {
    items: ['procergs-global-theme'],
  },
});

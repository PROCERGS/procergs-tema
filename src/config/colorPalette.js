import themeSVG from '@plone/volto/icons/theme.svg';
import ColorPaletteControlPanel from '../govrs/components/SiteTheme/ColorPaletteControlPanel';
import colorPalette from '../reducers/colorPalette';

const configureColorPalette = (config) => {
  config.addonReducers.colorPalette = colorPalette;
  config.addonRoutes = [
    ...(config.addonRoutes || []),
    {
      path: '/controlpanel/color-palette',
      component: ColorPaletteControlPanel,
    },
  ];
  config.settings.controlPanelsIcons = {
    ...(config.settings.controlPanelsIcons || {}),
    'color-palette': themeSVG,
  };
  config.settings.controlpanels = [
    ...(config.settings.controlpanels || []),
    {
      '@id': '/color-palette',
      group: 'Content',
      title: 'Paleta de cores',
    },
  ];

  return config;
};

export default configureColorPalette;

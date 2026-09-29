import { getSiteThemeColors } from '../govrs/blocks/globalTheme/themeColors';

export const GET_COLOR_PALETTE = 'PROCERGS/GET_COLOR_PALETTE';
export const UPDATE_COLOR_PALETTE = 'PROCERGS/UPDATE_COLOR_PALETTE';

export const getColorPalette = () => ({
  type: GET_COLOR_PALETTE,
  request: {
    op: 'get',
    path: '/',
  },
});

export const updateColorPalette = (value) => {
  const colorPalette = getSiteThemeColors(value);

  return {
    type: UPDATE_COLOR_PALETTE,
    colorPalette,
    request: {
      op: 'patch',
      path: '/',
      data: {
        color_palette: colorPalette,
      },
      headers: {
        Prefer: 'return=representation',
      },
    },
  };
};

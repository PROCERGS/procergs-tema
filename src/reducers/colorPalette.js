import {
  GET_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
} from '../actions/colorPalette';
import {
  DEFAULT_SITE_THEME_COLORS,
  getSiteThemeColors,
} from '../govrs/blocks/globalTheme/themeColors';

const requestState = {
  loading: false,
  loaded: false,
  error: null,
};

export const initialState = {
  data: { ...DEFAULT_SITE_THEME_COLORS },
  get: { ...requestState },
  update: { ...requestState },
};

const pending = (state, key) => ({
  ...state,
  [key]: {
    loading: true,
    loaded: false,
    error: null,
  },
});

const failed = (state, key, error) => ({
  ...state,
  [key]: {
    loading: false,
    loaded: false,
    error,
  },
});

export default function colorPalette(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_COLOR_PALETTE}_PENDING`:
      return pending(state, 'get');
    case `${UPDATE_COLOR_PALETTE}_PENDING`:
      return pending(state, 'update');
    case `${GET_COLOR_PALETTE}_SUCCESS`:
      return {
        ...state,
        data: getSiteThemeColors(action.result?.color_palette),
        get: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${UPDATE_COLOR_PALETTE}_SUCCESS`:
      return {
        ...state,
        data: getSiteThemeColors(
          action.result?.color_palette || action.colorPalette,
        ),
        update: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${GET_COLOR_PALETTE}_FAIL`:
      return failed(state, 'get', action.error);
    case `${UPDATE_COLOR_PALETTE}_FAIL`:
      return failed(state, 'update', action.error);
    default:
      return state;
  }
}

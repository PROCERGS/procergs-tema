import {
  GET_COLOR_PALETTE,
  UPDATE_COLOR_PALETTE,
} from '../actions/colorPalette';
import colorPalette, { initialState } from './colorPalette';

const customPalette = {
  primaryColor: '#123456',
  secondaryColor: '#234567',
  textColor: '#101010',
  backgroundColor: '#FAFAFA',
  linkColor: '#345678',
};

describe('colorPalette reducer', () => {
  it('loads the palette from the site behavior', () => {
    expect(
      colorPalette(initialState, {
        type: `${GET_COLOR_PALETTE}_SUCCESS`,
        result: { color_palette: customPalette },
      }),
    ).toMatchObject({
      data: customPalette,
      get: { loaded: true, loading: false, error: null },
    });
  });

  it('keeps the submitted palette when PATCH has no response body', () => {
    expect(
      colorPalette(initialState, {
        type: `${UPDATE_COLOR_PALETTE}_SUCCESS`,
        colorPalette: customPalette,
      }),
    ).toMatchObject({
      data: customPalette,
      update: { loaded: true, loading: false, error: null },
    });
  });

  it('records update failures without discarding the active palette', () => {
    const error = { status: 403 };
    const state = { ...initialState, data: customPalette };

    expect(
      colorPalette(state, {
        type: `${UPDATE_COLOR_PALETTE}_FAIL`,
        error,
      }),
    ).toMatchObject({
      data: customPalette,
      update: { loaded: false, loading: false, error },
    });
  });
});

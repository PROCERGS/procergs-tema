import { getAppearanceFields } from './getAppearanceFields';

describe('getAppearanceFields', () => {
  it('returns DS fields for the default variation', () => {
    expect(getAppearanceFields('default')).toEqual([
      'horizontal',
      'labeled',
      'mediaPreset',
    ]);
  });

  it('returns DS fields for the link and card variations', () => {
    expect(getAppearanceFields('link')).toEqual([
      'numbered',
      'invert',
      'mediaPreset',
    ]);
    expect(getAppearanceFields('card')).toEqual([
      'perRow',
      'cardOverflow',
      'cardVariant',
      'cardSize',
      'showCardAction',
      'showTags',
    ]);
  });

  it('returns no appearance fields for Volto-native variations', () => {
    expect(getAppearanceFields('imageGallery')).toEqual([]);
    expect(getAppearanceFields('summary')).toEqual([]);
  });
});

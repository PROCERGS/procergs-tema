import {
  getListingVariation,
  isDsListingVariation,
  listingNeedsFullObjects,
  resolveListingVariationConfig,
} from './getListingVariation';

describe('getListingVariation', () => {
  it('defaults to "default" when no variation is set', () => {
    expect(getListingVariation()).toBe('default');
    expect(getListingVariation({})).toBe('default');
  });

  it('returns the configured variation', () => {
    expect(getListingVariation({ variation: 'card' })).toBe('card');
  });
});

describe('isDsListingVariation', () => {
  it('is true for DS-owned listing variations', () => {
    expect(isDsListingVariation('default')).toBe(true);
    expect(isDsListingVariation('link')).toBe(true);
    expect(isDsListingVariation('card')).toBe(true);
  });

  it('is false for Volto-native listing variations', () => {
    expect(isDsListingVariation('imageGallery')).toBe(false);
    expect(isDsListingVariation('summary')).toBe(false);
  });
});

describe('resolveListingVariationConfig', () => {
  const imageGallery = { id: 'imageGallery', template: () => null };
  const summary = { id: 'summary', template: () => null };
  const variations = [imageGallery, summary];

  it('prefers the injected variation when its id matches', () => {
    expect(
      resolveListingVariationConfig(
        { variation: 'summary' },
        summary,
        variations,
      ),
    ).toBe(summary);
  });

  it('looks up the variation from config when the injected one does not match', () => {
    expect(
      resolveListingVariationConfig(
        { variation: 'imageGallery' },
        summary,
        variations,
      ),
    ).toBe(imageGallery);
  });

  it('resolves a legacy template id when variation is unset', () => {
    expect(
      resolveListingVariationConfig(
        { template: 'imageGallery' },
        undefined,
        variations,
      ),
    ).toBe(imageGallery);
  });
});

describe('listingNeedsFullObjects', () => {
  it('is true for the card variation', () => {
    expect(listingNeedsFullObjects({ variation: 'card' })).toBe(true);
  });

  it('is true for the default variation with a mixed or images media preset', () => {
    expect(listingNeedsFullObjects({ mediaPreset: 'mixed' })).toBe(true);
    expect(listingNeedsFullObjects({ mediaPreset: 'images' })).toBe(true);
    expect(listingNeedsFullObjects({})).toBe(true); // mediaPreset defaults to 'mixed'
  });

  it('is false for the default variation with a non-media preset', () => {
    expect(listingNeedsFullObjects({ mediaPreset: 'none' })).toBe(false);
  });

  it('is false for the link variation', () => {
    expect(listingNeedsFullObjects({ variation: 'link' })).toBe(false);
  });
});

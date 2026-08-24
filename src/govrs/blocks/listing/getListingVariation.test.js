import {
  getListingVariation,
  listingNeedsFullObjects,
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

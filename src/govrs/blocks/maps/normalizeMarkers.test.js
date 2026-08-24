import {
  DEFAULT_MAP_ZOOM,
  getMapCenter,
  normalizeMarkers,
} from './normalizeMarkers';

describe('normalizeMarkers', () => {
  it('returns an empty array for no markers', () => {
    expect(normalizeMarkers()).toEqual([]);
    expect(normalizeMarkers([])).toEqual([]);
  });

  it('drops markers missing lat or lng', () => {
    const markers = [
      { lat: -30.03, lng: -51.23 },
      { lat: -30.03 },
      { lng: -51.23 },
      {},
    ];

    expect(normalizeMarkers(markers)).toHaveLength(1);
  });

  it('coerces lat/lng to numbers and generates a fallback id', () => {
    const [marker] = normalizeMarkers([{ lat: '-30.03', lng: '-51.23' }]);

    expect(marker).toEqual({
      id: 'marker-0',
      lat: -30.03,
      lng: -51.23,
      title: '',
    });
  });

  it('keeps a provided id and title', () => {
    const [marker] = normalizeMarkers([
      { id: 'hq', lat: -30.03, lng: -51.23, title: 'Headquarters' },
    ]);

    expect(marker).toMatchObject({ id: 'hq', title: 'Headquarters' });
  });

  it('allows lat/lng of 0 (falsy but valid)', () => {
    const [marker] = normalizeMarkers([{ lat: 0, lng: 0 }]);

    expect(marker).toMatchObject({ lat: 0, lng: 0 });
  });
});

describe('getMapCenter', () => {
  it('returns the default center when there are no markers', () => {
    expect(getMapCenter()).toEqual({ lat: -23.55, lng: -46.64 });
    expect(getMapCenter([])).toEqual({ lat: -23.55, lng: -46.64 });
  });

  it("returns the first marker's coordinates when markers are present", () => {
    const markers = [
      { lat: -30.03, lng: -51.23 },
      { lat: 1, lng: 2 },
    ];

    expect(getMapCenter(markers)).toEqual({ lat: -30.03, lng: -51.23 });
  });
});

describe('DEFAULT_MAP_ZOOM', () => {
  it('is 12', () => {
    expect(DEFAULT_MAP_ZOOM).toBe(12);
  });
});

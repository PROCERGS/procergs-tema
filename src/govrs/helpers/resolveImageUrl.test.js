import { resolveImageUrl } from './resolveImageUrl';
import { DEFAULT_API_PATH } from '../../testing/mocks/ploneVoltoUrl';

describe('resolveImageUrl', () => {
  it('returns undefined when there is no item', () => {
    expect(resolveImageUrl(undefined)).toBeUndefined();
  });

  it('returns undefined when the item has no @id', () => {
    expect(resolveImageUrl({})).toBeUndefined();
  });

  it('returns the url as-is for an external item without image fields', () => {
    const url = 'https://example.org/photo.jpg';

    expect(resolveImageUrl({ '@id': url })).toBe(url);
  });

  it('returns undefined for an internal item without image fields', () => {
    expect(
      resolveImageUrl({ '@id': `${DEFAULT_API_PATH}/some-page` }),
    ).toBeUndefined();
  });

  it('returns undefined when there is no scale for the configured image field', () => {
    const item = {
      '@id': `${DEFAULT_API_PATH}/page`,
      image_field: 'image',
      image_scales: { image: [] },
    };

    expect(resolveImageUrl(item)).toBeUndefined();
  });

  it('builds a flattened image url from the matching scale', () => {
    const item = {
      '@id': `${DEFAULT_API_PATH}/page`,
      image_field: 'image',
      image_scales: {
        image: [
          {
            download: `${DEFAULT_API_PATH}/page/@@images/image-preview.jpeg`,
            scales: {},
          },
        ],
      },
    };

    expect(resolveImageUrl(item)).toBe('/page/@@images/image-preview.jpeg');
  });

  it('honors a base_path different from the item url', () => {
    const item = {
      '@id': `${DEFAULT_API_PATH}/page`,
      image_field: 'image',
      image_scales: {
        image: [
          {
            base_path: `${DEFAULT_API_PATH}/other`,
            download: `${DEFAULT_API_PATH}/other/@@images/image-preview.jpeg`,
            scales: {},
          },
        ],
      },
    };

    expect(resolveImageUrl(item)).toBe('/other/@@images/image-preview.jpeg');
  });

  it('returns the raw url for an external item even with image fields', () => {
    const item = {
      '@id': 'https://example.org/page',
      image_field: 'image',
      image_scales: { image: [{ scales: {} }] },
    };

    expect(resolveImageUrl(item)).toBe('https://example.org/page');
  });
});

import { resolveImageUrlFromContent } from './resolveImageUrlFromContent';
import { DEFAULT_API_PATH } from '../../testing/mocks/ploneVoltoUrl';

describe('resolveImageUrlFromContent', () => {
  it('returns undefined when there is no item', () => {
    expect(resolveImageUrlFromContent(undefined)).toBeUndefined();
  });

  it('returns undefined when the item has no usable image information', () => {
    expect(resolveImageUrlFromContent({ '@type': 'Document' })).toBeUndefined();
  });

  it('delegates to resolveImageUrl when image_field/image_scales are present', () => {
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

    expect(resolveImageUrlFromContent(item)).toBe(
      '/page/@@images/image-preview.jpeg',
    );
  });

  it('builds the default view scale url for Image content', () => {
    const item = { '@type': 'Image', '@id': `${DEFAULT_API_PATH}/photo` };

    expect(resolveImageUrlFromContent(item)).toBe('/photo/@@images/image');
  });

  it('flattens item.image.download when present', () => {
    const item = {
      image: { download: `${DEFAULT_API_PATH}/photo/@@images/image` },
    };

    expect(resolveImageUrlFromContent(item)).toBe('/photo/@@images/image');
  });

  it('prefers image_field/image_scales over item.image.download', () => {
    const item = {
      '@id': `${DEFAULT_API_PATH}/page`,
      image_field: 'image',
      image_scales: {
        image: [
          {
            download: `${DEFAULT_API_PATH}/page/@@images/preview.jpeg`,
            scales: {},
          },
        ],
      },
      image: { download: `${DEFAULT_API_PATH}/other/@@images/image` },
    };

    expect(resolveImageUrlFromContent(item)).toBe(
      '/page/@@images/preview.jpeg',
    );
  });
});

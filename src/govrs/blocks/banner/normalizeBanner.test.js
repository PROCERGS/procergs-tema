import { normalizeBanner } from './normalizeBanner';
import { DEFAULT_API_PATH } from '../../../testing/mocks/ploneVoltoUrl';

describe('normalizeBanner', () => {
  it('returns a minimal shape for empty data', () => {
    expect(normalizeBanner()).toEqual({ imageAlt: '' });
  });

  it('omits the type when it is the default value', () => {
    expect(normalizeBanner({ type: 'default' })).not.toHaveProperty('type');
  });

  it('keeps a non-default type', () => {
    expect(normalizeBanner({ type: 'highlight' })).toMatchObject({
      type: 'highlight',
    });
  });

  it('resolves an image passed as a plain external url string', () => {
    const result = normalizeBanner({ image: 'https://example.org/pic.jpg' });

    expect(result.imageUrl).toBe('https://example.org/pic.jpg');
  });

  it('resolves an internal image url string to a flattened @@images url', () => {
    const result = normalizeBanner({ image: `${DEFAULT_API_PATH}/banner-pic` });

    expect(result.imageUrl).toBe('/banner-pic/@@images/image');
  });

  it('resolves an image selected as a content item (array form)', () => {
    const result = normalizeBanner({
      image: [
        {
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
        },
      ],
    });

    expect(result.imageUrl).toBe('/page/@@images/preview.jpeg');
  });

  it('falls back to the image Title for imageAlt when data.imageAlt is missing', () => {
    const result = normalizeBanner({
      image: [{ '@id': `${DEFAULT_API_PATH}/pic`, Title: 'A nice picture' }],
    });

    expect(result.imageAlt).toBe('A nice picture');
  });

  it('trims imageAlt and prefers it over the image Title', () => {
    const result = normalizeBanner({
      imageAlt: '  Custom alt  ',
      image: [{ '@id': `${DEFAULT_API_PATH}/pic`, Title: 'Ignored title' }],
    });

    expect(result.imageAlt).toBe('Custom alt');
  });

  it('flattens an internal link url from data.link', () => {
    const result = normalizeBanner({ link: `${DEFAULT_API_PATH}/target` });

    expect(result.linkUrl).toBe('/target');
  });

  it('keeps an external link url unchanged', () => {
    const result = normalizeBanner({ link: 'https://example.org/target' });

    expect(result.linkUrl).toBe('https://example.org/target');
  });

  it('falls back to data.href[0]["@id"] when data.link is absent', () => {
    const result = normalizeBanner({
      href: [{ '@id': `${DEFAULT_API_PATH}/from-href` }],
    });

    expect(result.linkUrl).toBe('/from-href');
  });

  it('omits linkUrl in edit mode', () => {
    const result = normalizeBanner(
      { link: `${DEFAULT_API_PATH}/target` },
      { isEditMode: true },
    );

    expect(result).not.toHaveProperty('linkUrl');
  });

  it('omits linkUrl when there is no usable link value', () => {
    expect(normalizeBanner({ link: '   ' })).not.toHaveProperty('linkUrl');
  });
});

import { normalizeSlides } from './normalizeSlides';
import { DEFAULT_API_PATH } from '../../../testing/mocks/ploneVoltoUrl';

describe('normalizeSlides', () => {
  it('returns an empty array for no items', () => {
    expect(normalizeSlides()).toEqual([]);
  });

  it('filters out items that are not valid carousel content', () => {
    const items = [
      { '@type': 'Document', title: 'A doc' },
      { '@type': 'Image', title: 'An image' },
    ];

    expect(normalizeSlides(items)).toHaveLength(1);
  });

  it('falls back through title/Title/id and description/Description', () => {
    const items = [
      {
        '@type': 'Document',
        Title: 'Fallback title',
        Description: 'Fallback desc',
      },
    ];

    const [slide] = normalizeSlides(items);

    expect(slide.title).toBe('Fallback title');
    expect(slide.description).toBe('Fallback desc');
    expect(slide.imageAlt).toBe('Fallback title');
  });

  it('uses undefined title/description rather than empty strings', () => {
    const items = [{ '@type': 'Document', id: 'no-title-doc' }];

    const [slide] = normalizeSlides(items);

    expect(slide.title).toBe('no-title-doc');
    expect(slide.description).toBeUndefined();
  });

  it('does not include an href by default', () => {
    const items = [
      {
        '@type': 'Document',
        title: 'A doc',
        '@id': `${DEFAULT_API_PATH}/a-doc`,
      },
    ];

    expect(normalizeSlides(items)[0]).not.toHaveProperty('href');
  });

  it('includes a flattened href when linkToContent is true', () => {
    const items = [
      {
        '@type': 'Document',
        title: 'A doc',
        '@id': `${DEFAULT_API_PATH}/a-doc`,
      },
    ];

    const [slide] = normalizeSlides(items, { linkToContent: true });

    expect(slide.href).toBe('/a-doc');
  });

  it('resolves the slide image through resolveImageUrlFromContent', () => {
    const items = [
      {
        '@type': 'Document',
        title: 'A doc',
        '@id': `${DEFAULT_API_PATH}/a-doc`,
        image_field: 'image',
        image_scales: {
          image: [
            {
              download: `${DEFAULT_API_PATH}/a-doc/@@images/preview.jpeg`,
              scales: {},
            },
          ],
        },
      },
    ];

    const [slide] = normalizeSlides(items);

    expect(slide.image).toBe('/a-doc/@@images/preview.jpeg');
  });
});

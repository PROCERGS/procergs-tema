import { getListVariantProps } from './getListVariantProps';

describe('getListVariantProps', () => {
  it('returns default variant props', () => {
    expect(getListVariantProps({})).toEqual({
      variant: 'default',
      horizontal: false,
      labeled: false,
      collapsible: false,
      mediaPreset: 'mixed',
    });
  });

  it('enables collapsible by default when labeled is set', () => {
    expect(getListVariantProps({ labeled: true })).toMatchObject({
      labeled: true,
      collapsible: true,
    });
  });

  it('allows explicitly disabling collapsible even when labeled', () => {
    expect(
      getListVariantProps({ labeled: true, collapsible: false }),
    ).toMatchObject({ collapsible: false });
  });

  it('returns link variant props', () => {
    expect(getListVariantProps({ variation: 'link' })).toEqual({
      variant: 'link',
      mediaPreset: 'none',
      numbered: false,
      invert: false,
    });
  });

  it('returns card variant props with default perRow and overflow', () => {
    expect(getListVariantProps({ variation: 'card' })).toEqual({
      variant: 'card',
      perRow: 3,
      overflow: 'wrap',
    });
  });

  it('honors a custom perRow and scroll overflow for cards', () => {
    expect(
      getListVariantProps({
        variation: 'card',
        perRow: 4,
        cardOverflow: 'scroll',
      }),
    ).toEqual({
      variant: 'card',
      perRow: 4,
      overflow: 'scroll',
    });
  });
});

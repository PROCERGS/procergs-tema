import {
  createSiteThemeCss,
  getContrastRatio,
  getSiteThemeVariables,
  normalizeHexColor,
} from './themeColors';

describe('site theme colors', () => {
  it('accepts only six-digit hexadecimal colors', () => {
    expect(normalizeHexColor('1351b4')).toBe('#1351B4');
    expect(normalizeHexColor('#not-a-color', '#FFFFFF')).toBe('#FFFFFF');
  });

  it('maps visual tokens without changing semantic action colors', () => {
    const variables = getSiteThemeVariables({ primaryColor: '#123456' });

    expect(variables['--govrs-color-brand-primary']).toBe('#123456');
    expect(variables['--govrs-color-success']).toBeUndefined();
    expect(variables['--govrs-color-warning']).toBeUndefined();
    expect(variables['--govrs-color-danger']).toBeUndefined();
    expect(variables['--govrs-color-error']).toBeUndefined();
  });

  it('does not apply the custom palette in high contrast mode', () => {
    const css = createSiteThemeCss();

    expect(css).toContain(':root:not(.high-contrast)');
    expect(css).toContain(":not([data-govrs-contrast='high'])");
  });

  it('calculates WCAG contrast ratios', () => {
    expect(getContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });
});

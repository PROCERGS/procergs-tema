import resolveBranding from './resolveBranding';
import { DEFAULT_API_PATH } from '../testing/mocks/ploneVoltoUrl';

describe('resolveBranding', () => {
  it('falls back to the default site title and no logo when nothing is provided', () => {
    expect(resolveBranding({})).toEqual({
      logoSrc: null,
      siteTitle: 'Site Modelo Matriz3',
      homeHref: '/',
      logoHref: '/',
      navRootPath: '/',
    });
  });

  it('uses the site logo and title when there is no navroot', () => {
    const site = {
      'plone.site_logo': `${DEFAULT_API_PATH}/logo.png`,
      'plone.site_title': 'Site Modelo',
    };

    expect(resolveBranding({ site })).toMatchObject({
      logoSrc: '/logo.png',
      siteTitle: 'Site Modelo',
    });
  });

  it('treats a navroot at "/" as not being a subsite', () => {
    const navroot = { '@id': DEFAULT_API_PATH, title: 'Root Title' };
    const site = { 'plone.site_title': 'Site Modelo' };

    const result = resolveBranding({ navroot, site });

    expect(result.navRootPath).toBe('/');
    expect(result.siteTitle).toBe('Site Modelo');
  });

  it('uses the navroot title as the site title for subsites', () => {
    const navroot = {
      '@id': `${DEFAULT_API_PATH}/subsite`,
      title: 'Subsite Title',
    };
    const site = { 'plone.site_title': 'Site Modelo' };

    const result = resolveBranding({ navroot, site });

    expect(result.siteTitle).toBe('Subsite Title');
    expect(result.navRootPath).toBe('/subsite');
    expect(result.homeHref).toBe('/subsite');
    expect(result.logoHref).toBe('/subsite');
  });

  it('normalizes trailing slashes off the navroot path', () => {
    const navroot = { '@id': `${DEFAULT_API_PATH}/subsite/` };

    expect(resolveBranding({ navroot }).navRootPath).toBe('/subsite');
  });

  it('prefers an inherited logo from procergs.sitebase.header over voltolighttheme.header', () => {
    const content = {
      '@components': {
        inherit: {
          'procergs.sitebase.header': {
            data: { logo: `${DEFAULT_API_PATH}/procergs-logo.png` },
          },
          'voltolighttheme.header': {
            data: { logo: `${DEFAULT_API_PATH}/other-logo.png` },
          },
        },
      },
    };

    expect(resolveBranding({ content }).logoSrc).toBe('/procergs-logo.png');
  });

  it('falls back to voltolighttheme.header when procergs.sitebase.header has no logo', () => {
    const content = {
      '@components': {
        inherit: {
          'voltolighttheme.header': {
            data: { logo: { '@id': `${DEFAULT_API_PATH}/other-logo.png` } },
          },
        },
      },
    };

    expect(resolveBranding({ content }).logoSrc).toBe('/other-logo.png');
  });

  it('falls back to the site logo when no inherited logo is present', () => {
    const content = { '@components': {} };
    const site = { 'plone.site_logo': `${DEFAULT_API_PATH}/site-logo.png` };

    expect(resolveBranding({ content, site }).logoSrc).toBe('/site-logo.png');
  });
});

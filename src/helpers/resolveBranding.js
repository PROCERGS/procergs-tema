import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

const inheritedLogoBehaviors = [
  'procergs.sitebase.header',
  'voltolighttheme.header',
];

function resolveUrl(value) {
  const url = typeof value === 'object' ? value?.['@id'] || value?.url : value;

  return url ? flattenToAppURL(url) : null;
}

function normalizePath(path) {
  return path?.replace(/\/+$/, '') || '/';
}

function resolveInheritedLogo(content) {
  const inherit = content?.['@components']?.inherit;

  for (const behavior of inheritedLogoBehaviors) {
    const logo = resolveUrl(inherit?.[behavior]?.data?.logo);

    if (logo) {
      return logo;
    }
  }

  return null;
}

export default function resolveBranding({ content, navroot, site }) {
  const navRootPath = normalizePath(resolveUrl(navroot?.['@id']));
  const siteRootPath = normalizePath(resolveUrl(site?.['@id']));
  const isSubsite = navRootPath !== siteRootPath;

  return {
    logoSrc:
      resolveInheritedLogo(content) || resolveUrl(site?.['plone.site_logo']),
    siteTitle:
      (isSubsite && navroot?.title) ||
      site?.['plone.site_title'] ||
      'Site Modelo Matriz3',
    homeHref: navRootPath,
    logoHref: navRootPath,
    navRootPath,
  };
}

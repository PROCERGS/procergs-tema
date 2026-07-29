import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

function mapItem(item) {
  const itemUrl = item.url ?? item['@id'] ?? '';
  const url = itemUrl === '' ? '/' : flattenToAppURL(itemUrl);
  const mapped = {
    title: item.title,
    url,
    href: url,
  };

  if (item.items?.length) {
    mapped.items = item.items.map((child) => mapItem(child));
  }

  return mapped;
}

export function mapVoltoNavigationToMenuItems(items = []) {
  return items.map((item) => mapItem(item));
}

export function mapVoltoNavigationToFooterSections(items = []) {
  return items
    .filter((section) => section.items?.length)
    .map((section) => ({
      title: section.title,
      items: section.items.map((item) => {
        const mapped = mapItem(item);

        return {
          title: mapped.title,
          url: mapped.url,
          href: mapped.href,
        };
      }),
    }));
}

export function appendAuthMenuItem(menuItems, token, intl) {
  const authItem = token
    ? {
        title: intl.formatMessage({ id: 'Log out', defaultMessage: 'Log out' }),
        url: '/logout',
        href: '/logout',
      }
    : {
        title: intl.formatMessage({ id: 'Log in', defaultMessage: 'Log in' }),
        url: '/login',
        href: '/login',
      };

  return [...menuItems, authItem];
}

export default mapVoltoNavigationToMenuItems;

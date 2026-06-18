import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

function mapItem(item) {
  const url = item.url === '' ? '/' : flattenToAppURL(item.url);
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
  return items.map((item) => {
    const mapped = mapItem(item);

    if (mapped.items?.length) {
      return {
        title: mapped.title,
        items: mapped.items,
      };
    }

    return {
      title: mapped.title,
      items: [
        {
          title: mapped.title,
          url: mapped.url,
          href: mapped.href,
        },
      ],
    };
  });
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

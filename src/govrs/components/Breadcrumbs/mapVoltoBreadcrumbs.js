const identity = (value) => value;

export const isHomePath = (pathname) => pathname === '' || pathname === '/';

const mapVoltoBreadcrumbs = (items = [], normalizeUrl = identity) =>
  items.filter(Boolean).map((item) => {
    const href = item.url || item['@id'];

    return {
      label: item.title,
      ...(href ? { href: normalizeUrl(href) } : {}),
    };
  });

export default mapVoltoBreadcrumbs;

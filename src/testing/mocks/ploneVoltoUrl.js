/**
 * Lightweight stand-in for `@plone/volto/helpers/Url/Url`, used only in unit
 * tests so pure logic modules can be tested without checking out the full
 * Volto core app (which these helpers normally read config from).
 *
 * It mirrors the parts of the real behavior these tests rely on:
 * - `flattenToAppURL` strips a known API host from a URL.
 * - `isInternalURL` treats relative paths and URLs under that API host as
 *   internal.
 * - `flattenScales` flattens an image scales payload the same way Volto does.
 *
 * See core/packages/volto/src/helpers/Url/Url.js in the sitebase-modelo
 * frontend monorepo for the real implementation this is modeled after.
 */

export const DEFAULT_API_PATH = 'http://localhost:8080/Plone';

export function flattenToAppURL(url) {
  return url ? url.replace(DEFAULT_API_PATH, '') : url;
}

export function isInternalURL(url) {
  if (!url) {
    return false;
  }

  return (
    url.indexOf(DEFAULT_API_PATH) !== -1 ||
    url.charAt(0) === '/' ||
    url.charAt(0) === '.' ||
    url.startsWith('#')
  );
}

export function flattenScales(path, image) {
  if (!image) {
    return undefined;
  }

  const basePath = image.base_path || path;
  const removeObjectIdFromURL = (scale) => scale.replace(`${basePath}/`, '');

  const scales = image.scales
    ? Object.fromEntries(
        Object.entries(image.scales).map(([key, value]) => [
          key,
          {
            ...value,
            download: flattenToAppURL(removeObjectIdFromURL(value.download)),
          },
        ]),
      )
    : image.scales;

  return {
    ...image,
    download: flattenToAppURL(removeObjectIdFromURL(image.download)),
    scales,
  };
}

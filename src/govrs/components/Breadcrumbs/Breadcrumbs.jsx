import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { BreadCrumbs } from '@procergs/react-govrs-ds';
import { getBreadcrumbs } from '@plone/volto/actions/breadcrumbs/breadcrumbs';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import mapVoltoBreadcrumbs, { isHomePath } from './mapVoltoBreadcrumbs';

export const ProcergsGlobalBreadcrumbsBlock = (props) => {
  const { data, pathname, path, metadata, isEditPreview = false } = props;
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(
    (state) => state.breadcrumbs?.items || [],
    shallowEqual,
  );
  const root = useSelector((state) => state.breadcrumbs?.root);
  const content = useSelector((state) => state.content?.data, shallowEqual);
  const regionProps = metadata?.globalRegionProps || {};
  const currentPathname = regionProps.pathname || pathname || path || '/';
  const normalizedPathname = getBaseUrl(currentPathname);
  const contentPathname = content?.['@id']
    ? getBaseUrl(flattenToAppURL(content['@id']))
    : null;
  const contentBreadcrumbs =
    contentPathname === normalizedPathname
      ? content?.['@components']?.breadcrumbs
      : null;
  const showHome = data?.showHome !== false;
  const allowOverlay = data?.allowOverlay !== false;
  const sourceItems = Array.isArray(contentBreadcrumbs?.items)
    ? contentBreadcrumbs.items
    : breadcrumbs;
  const mappedItems = mapVoltoBreadcrumbs(sourceItems, flattenToAppURL);
  const isHome = isHomePath(normalizedPathname);
  const items =
    !isHome &&
    contentPathname === normalizedPathname &&
    mappedItems.length === 0 &&
    content?.title
      ? [{ label: content.title }]
      : mappedItems;
  const previewItems = showHome
    ? [{ label: 'Página atual' }]
    : [{ label: 'Seção', href: '#' }, { label: 'Página atual' }];
  const visibleItems =
    isEditPreview && items.length === 0 ? previewItems : items;

  useEffect(() => {
    if (!hasApiExpander('breadcrumbs', normalizedPathname)) {
      dispatch(getBreadcrumbs(normalizedPathname));
    }
  }, [dispatch, normalizedPathname]);

  if (isHome && !isEditPreview) {
    return null;
  }

  if (!isEditPreview && (showHome ? 1 : 0) + visibleItems.length < 2) {
    return null;
  }

  return (
    <div
      className={cx('procergs-breadcrumbs-wrapper', {
        'allows-group-overlay': allowOverlay,
      })}
      style={
        regionProps.overlayForeground
          ? {
              '--procergs-overlay-header-foreground':
                regionProps.overlayForeground,
            }
          : undefined
      }
    >
      <div className="procergs-breadcrumbs-container">
        <BreadCrumbs
          items={visibleItems}
          homeHref={
            contentBreadcrumbs?.root
              ? flattenToAppURL(contentBreadcrumbs.root) || '/'
              : root || '/'
          }
          homeLabel={data?.homeLabel || 'Página inicial'}
          showHome={showHome}
          ariaLabel={data?.ariaLabel || 'Migalhas de pão'}
        />
      </div>
    </div>
  );
};

ProcergsGlobalBreadcrumbsBlock.propTypes = {
  data: PropTypes.shape({
    showHome: PropTypes.bool,
    homeLabel: PropTypes.string,
    ariaLabel: PropTypes.string,
    allowOverlay: PropTypes.bool,
  }),
  pathname: PropTypes.string,
  path: PropTypes.string,
  metadata: PropTypes.shape({
    globalRegionProps: PropTypes.shape({
      pathname: PropTypes.string,
      overlayForeground: PropTypes.string,
    }),
  }),
  isEditPreview: PropTypes.bool,
};

export default ProcergsGlobalBreadcrumbsBlock;

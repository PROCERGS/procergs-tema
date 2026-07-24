import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  BarraAcessibilidade,
  Header as GovrsHeader,
} from '@procergs/react-govrs-ds';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import {
  mapVoltoNavigationToMenuItems,
  appendAuthMenuItem,
} from '../../../helpers/mapVoltoNavigationToMenuItems';
import ProcergsLogo from './ProcergsLogo';

const Header = ({ pathname }) => {
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const navigationItems = useSelector(
    (state) => state.navigation.items,
    shallowEqual,
  );
  const site = useSelector((state) => state.site?.data, shallowEqual);

  const siteTitle = site?.['plone.site_title'] || 'Site Modelo Matriz3';
  const siteLogoUrl = flattenToAppURL(site?.['plone.site_logo']);
  const logo = siteLogoUrl ? (
    <img src={siteLogoUrl} alt="" className="procergs-header-logo" />
  ) : (
    <ProcergsLogo />
  );

  useEffect(() => {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(pathname))) {
      dispatch(getNavigation(getBaseUrl(pathname), settings.navDepth));
    }
  }, [pathname, token, dispatch]);

  useEffect(() => {
    const moveStandaloneBar = () => {
      const slot = document.querySelector('.procergs-standalone-bar-slot');
      const host = document.querySelector('.barra-estado-host');

      if (!slot || !host || slot.contains(host)) {
        return;
      }

      slot.appendChild(host);
    };

    moveStandaloneBar();

    const observer = new MutationObserver(() => {
      moveStandaloneBar();
    });

    observer.observe(document.body, {
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let resizeObserver;
    let observedHeader;
    let observedToolbar;

    const updateToolbarInsets = () => {
      const govrsHeader = headerRef.current?.querySelector(
        '.govrs-header-wrapper',
      );
      const toolbar = document.querySelector('#toolbar .toolbar-body');

      if (!govrsHeader || !toolbar) {
        return;
      }

      if (resizeObserver && govrsHeader !== observedHeader) {
        resizeObserver.observe(govrsHeader);
        observedHeader = govrsHeader;
      }

      if (resizeObserver && toolbar !== observedToolbar) {
        resizeObserver.observe(toolbar);
        observedToolbar = toolbar;
      }

      const headerRect = govrsHeader.getBoundingClientRect();
      const toolbarRect = toolbar.getBoundingClientRect();
      const overlapsVertically =
        toolbarRect.top < headerRect.bottom &&
        toolbarRect.bottom > headerRect.top;
      const leftInset =
        overlapsVertically && toolbarRect.left <= headerRect.left
          ? Math.max(
              0,
              Math.min(headerRect.width, toolbarRect.right - headerRect.left),
            )
          : 0;
      const rightInset =
        overlapsVertically && toolbarRect.right >= headerRect.right
          ? Math.max(
              0,
              Math.min(headerRect.width, headerRect.right - toolbarRect.left),
            )
          : 0;

      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-left',
        `${leftInset}px`,
      );
      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-right',
        `${rightInset}px`,
      );
    };

    updateToolbarInsets();

    const observer = new MutationObserver(updateToolbarInsets);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateToolbarInsets);
      updateToolbarInsets();
    }
    window.addEventListener('resize', updateToolbarInsets);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateToolbarInsets);
    };
  }, []);

  const menuItems = appendAuthMenuItem(
    mapVoltoNavigationToMenuItems(navigationItems),
    token,
    intl,
  );

  const handleSearch = (term) => {
    const path =
      pathname?.length > 0 ? `&path=${encodeURIComponent(pathname)}` : '';
    history.push(`./search?SearchableText=${encodeURIComponent(term)}${path}`);
  };

  return (
    <header ref={headerRef} className="procergs-header-wrapper" role="banner">
      <div className="procergs-standalone-bar-slot" />
      <BarraAcessibilidade
        shortcuts={[
          { title: 'Conteúdo', href: '#main' },
          { title: 'Menu', href: '#govrs-header-menu' },
          { title: 'Busca', href: '#govrs-header-search' },
        ]}
        hrefSitemap="/sitemap"
      />
      <GovrsHeader
        logo={logo}
        logoHref="/"
        logoAriaLabel={siteTitle}
        siteTitle={siteTitle}
        homeHref="/"
        menuItems={menuItems}
        onSearch={handleSearch}
        searchPlaceholder={intl.formatMessage({
          id: 'Search Site',
          defaultMessage: 'Search Site',
        })}
        searchInputAriaLabel={intl.formatMessage({
          id: 'Search',
          defaultMessage: 'Search',
        })}
        scrollTargetId="main"
        showScrollTopButton
      />
    </header>
  );
};

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Header;

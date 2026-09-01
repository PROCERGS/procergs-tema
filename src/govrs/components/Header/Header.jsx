import React, { useEffect, useRef, useState } from 'react';
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
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import {
  mapVoltoNavigationToMenuItems,
  appendAuthMenuItem,
} from '../../../helpers/mapVoltoNavigationToMenuItems';
import resolveBranding from '../../../helpers/resolveBranding';

const Header = ({ pathname, overlayForeground }) => {
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const navigationItems = useSelector(
    (state) => state.navigation.items,
    shallowEqual,
  );
  const content = useSelector((state) => state.content?.data, shallowEqual);
  const navroot = useSelector(
    (state) => state.navroot?.data?.navroot,
    shallowEqual,
  );
  const site = useSelector((state) => state.site?.data, shallowEqual);

  const { logoSrc, siteTitle, homeHref, logoHref } = resolveBranding({
    content,
    navroot,
    site,
  });
  const logo = logoSrc ? (
    <img src={logoSrc} alt="" className="procergs-header-logo" />
  ) : null;

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
    let observedAccessibilityBar;
    let observedHeaderWrapper;
    const headerElement = headerRef.current;
    const layoutRoot = document.documentElement;

    const setLayoutInsets = (left, right, top) => {
      const values = { left, right, top };

      Object.entries(values).forEach(([side, value]) => {
        const property = `--procergs-header-layout-inset-${side}`;
        headerElement?.style.setProperty(property, value);
        layoutRoot.style.setProperty(property, value);
      });
    };

    const updateToolbarInsets = () => {
      const headerWrapper = headerElement;
      const govrsHeader = headerElement?.querySelector('.govrs-header-wrapper');
      const accessibilityBar = headerElement?.querySelector('.acess-bar');
      const toolbar = document.querySelector('#toolbar .toolbar');
      const isPublicUi = document.body.classList.contains('public-ui');
      const isContentsView =
        document.body.classList.contains('view-contentsview');
      const shouldApplyLayoutInsets = isPublicUi || isContentsView;

      if (!govrsHeader) {
        setLayoutInsets('0px', '0px', '0px');
        return;
      }

      if (
        resizeObserver &&
        headerWrapper &&
        headerWrapper !== observedHeaderWrapper
      ) {
        resizeObserver.observe(headerWrapper);
        observedHeaderWrapper = headerWrapper;
      }
      if (resizeObserver && govrsHeader !== observedHeader) {
        resizeObserver.observe(govrsHeader);
        observedHeader = govrsHeader;
      }

      if (resizeObserver && toolbar && toolbar !== observedToolbar) {
        resizeObserver.observe(toolbar);
        observedToolbar = toolbar;
      }
      if (
        resizeObserver &&
        accessibilityBar &&
        accessibilityBar !== observedAccessibilityBar
      ) {
        resizeObserver.observe(accessibilityBar);
        observedAccessibilityBar = accessibilityBar;
      }

      const headerRect = govrsHeader.getBoundingClientRect();
      document.documentElement.style.setProperty(
        '--procergs-overlay-header-height',
        `${headerRect.height}px`,
      );
      document.documentElement.style.setProperty(
        '--procergs-overlay-header-total-height',
        `${headerWrapper?.getBoundingClientRect().height || headerRect.height}px`,
      );
      document.documentElement.style.setProperty(
        '--procergs-overlay-accessibility-height',
        `${accessibilityBar?.getBoundingClientRect().height || 0}px`,
      );
      const toolbarRect = toolbar?.getBoundingClientRect();
      if (!toolbarRect) {
        govrsHeader.style.setProperty(
          '--procergs-header-menu-inset-left',
          '0px',
        );
        govrsHeader.style.setProperty(
          '--procergs-header-menu-inset-right',
          '0px',
        );
        setLayoutInsets('0px', '0px', '0px');
        return;
      }
      const layoutRect = headerWrapper?.getBoundingClientRect() || headerRect;
      const overlapsVertically =
        toolbarRect.top < layoutRect.bottom &&
        toolbarRect.bottom > layoutRect.top;
      const isSideToolbar =
        toolbarRect.width < layoutRect.width &&
        toolbarRect.height > toolbarRect.width;
      const isTopToolbar =
        !isSideToolbar &&
        toolbarRect.top <= layoutRect.top &&
        toolbarRect.bottom > layoutRect.top;
      const leftInset =
        isSideToolbar &&
        overlapsVertically &&
        toolbarRect.left <= layoutRect.left
          ? Math.max(
              0,
              Math.min(layoutRect.width, toolbarRect.right - layoutRect.left),
            )
          : 0;
      const rightInset =
        isSideToolbar &&
        overlapsVertically &&
        toolbarRect.right >= layoutRect.right
          ? Math.max(
              0,
              Math.min(layoutRect.width, layoutRect.right - toolbarRect.left),
            )
          : 0;
      const topInset = isTopToolbar
        ? Math.max(0, toolbarRect.bottom - layoutRect.top)
        : 0;

      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-left',
        `${leftInset}px`,
      );
      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-right',
        `${rightInset}px`,
      );
      setLayoutInsets(
        shouldApplyLayoutInsets ? `${leftInset}px` : '0px',
        shouldApplyLayoutInsets ? `${rightInset}px` : '0px',
        shouldApplyLayoutInsets ? `${topInset}px` : '0px',
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
      document.documentElement.style.removeProperty(
        '--procergs-overlay-header-height',
      );
      document.documentElement.style.removeProperty(
        '--procergs-overlay-header-total-height',
      );
      document.documentElement.style.removeProperty(
        '--procergs-overlay-accessibility-height',
      );
      headerElement?.style.removeProperty(
        '--procergs-header-layout-inset-left',
      );
      layoutRoot.style.removeProperty('--procergs-header-layout-inset-left');
      headerElement?.style.removeProperty(
        '--procergs-header-layout-inset-right',
      );
      layoutRoot.style.removeProperty('--procergs-header-layout-inset-right');
      headerElement?.style.removeProperty('--procergs-header-layout-inset-top');
      layoutRoot.style.removeProperty('--procergs-header-layout-inset-top');
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

  const isPublicPage = () =>
    typeof document !== 'undefined' &&
    document.body.classList.contains('public-ui');

  const focusAfterRender = (selector) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const element = headerRef.current?.querySelector(selector);
        element?.focus();

        if (element instanceof HTMLInputElement) {
          element.select();
        }
      });
    });
  };

  const activateContentShortcut = () => {
    if (!isPublicPage()) return;

    const firstBlock = document.querySelector('#page-document > *');
    const target = firstBlock || document.getElementById('view');

    if (!(target instanceof HTMLElement)) return;

    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activateMenuShortcut = () => {
    if (!isPublicPage()) return;

    headerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(true);
    focusAfterRender('.govrs-menu-hamburger__toggle');
  };

  const activateSearchShortcut = () => {
    if (!isPublicPage()) return;

    setSearchActive(true);
    focusAfterRender('.govrs-search__field');
  };

  return (
    <header
      ref={headerRef}
      className="procergs-header-wrapper"
      role="banner"
      style={
        overlayForeground
          ? { '--procergs-overlay-header-foreground': overlayForeground }
          : undefined
      }
    >
      <div className="procergs-standalone-bar-slot" />
      <BarraAcessibilidade
        shortcuts={[
          {
            title: 'Conteúdo',
            href: '#view',
            onActivate: activateContentShortcut,
          },
          {
            title: 'Menu',
            href: '#main',
            onActivate: activateMenuShortcut,
          },
          {
            title: 'Busca',
            href: '#main',
            onActivate: activateSearchShortcut,
          },
        ]}
        hrefSitemap="/sitemap"
      />
      <GovrsHeader
        {...(logo ? { logo } : {})}
        logoHref={logoHref}
        logoAriaLabel={siteTitle}
        siteTitle={siteTitle}
        homeHref={homeHref}
        menuItems={menuItems}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        onSearch={handleSearch}
        searchActive={searchActive}
        onSearchActiveChange={setSearchActive}
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
  overlayForeground: PropTypes.string,
};

export default Header;

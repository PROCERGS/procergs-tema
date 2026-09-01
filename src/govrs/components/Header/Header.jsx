import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Header as GovrsHeader, MenuHamburger } from '@procergs/react-govrs-ds';
import { GlobalBlocksRegion } from '@procergs/volto-global-regions';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import {
  mapVoltoNavigationToMenuItems,
  appendAuthMenuItem,
} from '../../../helpers/mapVoltoNavigationToMenuItems';
import resolveBranding from '../../../helpers/resolveBranding';
import toHexColor from '../../helpers/toHexColor';

const DEFAULT_LOGO_BACKGROUND = '#ffffff';
const DEFAULT_MENU_BACKGROUND = '#172b36';

const resolveBackgroundColor = (value, fallback) =>
  toHexColor(value, fallback);

const clampOpacity = (value, fallback) => {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : fallback;
};

const colorWithOpacity = (color, opacity) => {
  const normalized = color.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return color;
  }

  const numeric = Number.parseInt(expanded, 16);
  return `rgb(${(numeric >> 16) & 255} ${(numeric >> 8) & 255} ${
    numeric & 255
  } / ${opacity})`;
};

const readableForeground = (color) => {
  const normalized = color.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => character + character)
          .join('')
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) {
    return '#ffffff';
  }

  const numeric = Number.parseInt(expanded, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;
  const luminance = (red * 299 + green * 587 + blue * 114) / 255000;

  return luminance > 0.58 ? '#1a1a1a' : '#ffffff';
};

const HeaderVariant2MenuItem = ({ item, level = 0 }) => {
  const children = item?.items?.filter(Boolean) || [];
  const hasChildren = children.length > 0;
  const href = item?.href || item?.url || '#';

  return (
    <li
      className={cx('procergs-header-v2__item', {
        'has-children': hasChildren,
        'is-nested': level > 0,
      })}
    >
      <a
        className="procergs-header-v2__link"
        href={href}
        target={item?.target}
        rel={item?.rel}
        aria-haspopup={hasChildren ? 'true' : undefined}
      >
        <span>{item?.title || item?.label}</span>
        {hasChildren ? (
          <span className="procergs-header-v2__chevron" aria-hidden="true" />
        ) : null}
      </a>
      {hasChildren ? (
        <ul className="procergs-header-v2__submenu">
          {children.map((child, index) => (
            <HeaderVariant2MenuItem
              key={child.id || child.href || child.url || index}
              item={child}
              level={level + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

HeaderVariant2MenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.node,
    label: PropTypes.node,
    href: PropTypes.string,
    url: PropTypes.string,
    target: PropTypes.string,
    rel: PropTypes.string,
    items: PropTypes.array,
  }).isRequired,
  level: PropTypes.number,
};

const HeaderVariant2 = ({
  logo,
  logoHref,
  siteTitle,
  showLogo,
  menuItems,
  menuOpen,
  onMenuOpenChange,
  logoBackgroundColor,
  logoBackgroundOpacity,
  menuBackgroundColor,
  menuBackgroundOpacity,
}) => {
  const logoColor = resolveBackgroundColor(
    logoBackgroundColor,
    DEFAULT_LOGO_BACKGROUND,
  );
  const menuColor = resolveBackgroundColor(
    menuBackgroundColor,
    DEFAULT_MENU_BACKGROUND,
  );
  const style = {
    '--procergs-header-v2-logo-background': colorWithOpacity(
      logoColor,
      clampOpacity(logoBackgroundOpacity, 0.82),
    ),
    '--procergs-header-v2-menu-background': colorWithOpacity(
      menuColor,
      clampOpacity(menuBackgroundOpacity, 0.78),
    ),
    '--procergs-header-v2-menu-foreground': readableForeground(menuColor),
  };

  return (
    <div
      className={cx('procergs-header-v2', {
        'is-logo-hidden': !showLogo,
      })}
      style={style}
    >
      {showLogo ? (
        <a
          className="procergs-header-v2__logo-panel"
          href={logoHref}
          aria-label={siteTitle}
        >
          {logo}
        </a>
      ) : null}
      <div className="procergs-header-v2__menu-panel">
        <nav
          className="procergs-header-v2__desktop-navigation"
          aria-label="Navegação principal"
        >
          <ul className="procergs-header-v2__menu">
            {menuItems.map((item, index) => (
              <HeaderVariant2MenuItem
                key={item.id || item.href || item.url || index}
                item={item}
              />
            ))}
          </ul>
        </nav>
        <div className="procergs-header-v2__mobile-navigation">
          <MenuHamburger
            id="procergs-header-v2-mobile-menu"
            items={menuItems}
            open={menuOpen}
            onOpenChange={onMenuOpenChange}
            navigationLabel="Navegação principal"
            openButtonLabel="Abrir menu"
            closeButtonLabel="Fechar menu"
            expandButtonLabel="Expandir submenu"
            collapseButtonLabel="Recolher submenu"
            maxDesktopLevels={3}
          />
        </div>
      </div>
    </div>
  );
};

HeaderVariant2.propTypes = {
  logo: PropTypes.node,
  logoHref: PropTypes.string,
  siteTitle: PropTypes.string,
  showLogo: PropTypes.bool,
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  menuOpen: PropTypes.bool,
  onMenuOpenChange: PropTypes.func.isRequired,
  logoBackgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  logoBackgroundOpacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  menuBackgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  menuBackgroundOpacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export const LegacyGovrsHeader = ({
  allowOverlay = true,
  showLogo = true,
  showTitle = true,
  variation = 'default',
  logoBackgroundColor,
  logoBackgroundOpacity,
  menuBackgroundColor,
  menuBackgroundOpacity,
  pathname,
  overlayForeground,
}) => {
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
    let resizeObserver;
    let observedHeader;
    let observedToolbar;
    let observedSidebar;
    let observedAccessibilityBar;
    let observedStateBar;
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
      const headerWrapper =
        headerElement?.closest('.global-blocks-region-header') || headerElement;
      const govrsHeader = headerElement?.querySelector(
        '.govrs-header-wrapper, .procergs-header-v2',
      );
      const stateBar = headerWrapper?.querySelector(
        '.procergs-state-bar-wrapper',
      );
      const accessibilityBar = headerWrapper?.querySelector(
        '.procergs-accessibility-wrapper .acess-bar',
      );
      const toolbar = document.querySelector('#toolbar .toolbar');
      const sidebar = document.querySelector('#sidebar .sidebar-container');

      if (!govrsHeader) {
        setLayoutInsets('0px', '0px', '0px');
        return;
      }

      if (resizeObserver && stateBar && stateBar !== observedStateBar) {
        resizeObserver.observe(stateBar);
        observedStateBar = stateBar;
      }
      if (resizeObserver && govrsHeader !== observedHeader) {
        resizeObserver.observe(govrsHeader);
        observedHeader = govrsHeader;
      }

      if (resizeObserver && toolbar && toolbar !== observedToolbar) {
        resizeObserver.observe(toolbar);
        observedToolbar = toolbar;
      }
      if (resizeObserver && sidebar && sidebar !== observedSidebar) {
        resizeObserver.observe(sidebar);
        observedSidebar = sidebar;
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
      const headerWrapperRect = headerWrapper?.getBoundingClientRect();
      const regionPartRects = headerWrapper
        ? [
            ...headerWrapper.querySelectorAll(
              '.procergs-state-bar-wrapper, .procergs-accessibility-wrapper, .procergs-header-wrapper',
            ),
          ].map((element) => element.getBoundingClientRect())
        : [];
      const headerTotalHeight = Math.max(
        headerRect.height,
        regionPartRects.reduce(
          (total, rect) => total + Math.max(0, rect.height),
          0,
        ),
      );

      document.documentElement.style.setProperty(
        '--procergs-overlay-header-height',
        `${headerRect.height}px`,
      );
      document.documentElement.style.setProperty(
        '--procergs-overlay-header-total-height',
        `${headerTotalHeight}px`,
      );
      document.documentElement.style.setProperty(
        '--procergs-overlay-accessibility-height',
        `${accessibilityBar?.getBoundingClientRect().height || 0}px`,
      );

      const isCmsEdit =
        document.body.classList.contains('cms-ui') &&
        (document.body.classList.contains('view-editview') ||
          document.body.classList.contains('view-addview'));
      if (isCmsEdit) {
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

      const toolbarRect = toolbar?.getBoundingClientRect();
      const sidebarRect = sidebar?.getBoundingClientRect();
      if (!toolbarRect && !sidebarRect) {
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

      const layoutRect = headerWrapperRect || headerRect;
      const getSideInsets = (panelRect) => {
        if (!panelRect) {
          return { left: 0, right: 0 };
        }

        const isSidePanel =
          panelRect.width < layoutRect.width &&
          panelRect.height > panelRect.width;

        if (!isSidePanel) {
          return { left: 0, right: 0 };
        }

        return {
          left:
            panelRect.left <= layoutRect.left
              ? Math.max(
                  0,
                  Math.min(layoutRect.width, panelRect.right - layoutRect.left),
                )
              : 0,
          right:
            panelRect.right >= layoutRect.right
              ? Math.max(
                  0,
                  Math.min(layoutRect.width, layoutRect.right - panelRect.left),
                )
              : 0,
        };
      };
      const toolbarInsets = getSideInsets(toolbarRect);
      const sidebarInsets = getSideInsets(sidebarRect);
      const leftInset = Math.max(toolbarInsets.left, sidebarInsets.left);
      const rightInset = Math.max(toolbarInsets.right, sidebarInsets.right);
      const isTopToolbar =
        toolbarRect &&
        toolbarInsets.left === 0 &&
        toolbarInsets.right === 0 &&
        toolbarRect.width >= toolbarRect.height &&
        toolbarRect.top <= 1;
      const topInset = isTopToolbar ? Math.max(0, toolbarRect.height) : 0;

      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-left',
        `${leftInset}px`,
      );
      govrsHeader.style.setProperty(
        '--procergs-header-menu-inset-right',
        `${rightInset}px`,
      );
      setLayoutInsets(`${leftInset}px`, `${rightInset}px`, `${topInset}px`);
    };

    updateToolbarInsets();

    const observer = new MutationObserver(updateToolbarInsets);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
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

  return (
    <header
      ref={headerRef}
      className={cx('procergs-header-wrapper', {
        'allows-group-overlay': allowOverlay,
        'is-logo-hidden': !showLogo,
        'is-title-hidden': variation === 'default2' || !showTitle,
        'is-variation-default2': variation === 'default2',
      })}
      role="banner"
      style={
        overlayForeground
          ? { '--procergs-overlay-header-foreground': overlayForeground }
          : undefined
      }
    >
      {variation === 'default2' ? (
        <HeaderVariant2
          logo={logo}
          logoHref={logoHref}
          siteTitle={siteTitle}
          showLogo={showLogo}
          menuItems={menuItems}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
          logoBackgroundColor={logoBackgroundColor}
          logoBackgroundOpacity={logoBackgroundOpacity}
          menuBackgroundColor={menuBackgroundColor}
          menuBackgroundOpacity={menuBackgroundOpacity}
        />
      ) : (
        <GovrsHeader
          logo={showLogo ? logo || undefined : false}
          logoHref={showLogo ? logoHref : undefined}
          logoAriaLabel={showLogo ? siteTitle : undefined}
          siteTitle={showTitle ? siteTitle : false}
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
      )}
    </header>
  );
};

LegacyGovrsHeader.propTypes = {
  allowOverlay: PropTypes.bool,
  showLogo: PropTypes.bool,
  showTitle: PropTypes.bool,
  variation: PropTypes.oneOf(['default', 'default2']),
  logoBackgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  logoBackgroundOpacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  menuBackgroundColor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  menuBackgroundOpacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  pathname: PropTypes.string.isRequired,
  overlayForeground: PropTypes.string,
};

export const ProcergsGlobalHeaderBlock = (props) => {
  const { data, pathname, path, metadata } = props;
  const regionProps = metadata?.globalRegionProps || {};

  return (
    <LegacyGovrsHeader
      allowOverlay={data?.allowOverlay !== false}
      showLogo={data?.showLogo !== false}
      showTitle={data?.showTitle !== false}
      variation={data?.variation || 'default'}
      logoBackgroundColor={data?.logoBackgroundColor}
      logoBackgroundOpacity={data?.logoBackgroundOpacity}
      menuBackgroundColor={data?.menuBackgroundColor}
      menuBackgroundOpacity={data?.menuBackgroundOpacity}
      pathname={regionProps.pathname || pathname || path || '/'}
      overlayForeground={regionProps.overlayForeground}
    />
  );
};

ProcergsGlobalHeaderBlock.propTypes = {
  data: PropTypes.shape({
    allowOverlay: PropTypes.bool,
    showLogo: PropTypes.bool,
    showTitle: PropTypes.bool,
    variation: PropTypes.oneOf(['default', 'default2']),
    logoBackgroundColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    logoBackgroundOpacity: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    menuBackgroundColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    menuBackgroundOpacity: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  pathname: PropTypes.string,
  path: PropTypes.string,
  metadata: PropTypes.shape({
    globalRegionProps: PropTypes.shape({
      pathname: PropTypes.string,
      overlayForeground: PropTypes.string,
    }),
  }),
};

const Header = ({ pathname, overlayForeground }) => (
  <GlobalBlocksRegion
    name="header"
    pathname={pathname}
    fallback={
      <LegacyGovrsHeader
        allowOverlay
        showLogo
        showTitle
        variation="default"
        pathname={pathname}
        overlayForeground={overlayForeground}
      />
    }
    viewProps={{
      location: { pathname },
      metadata: {
        globalRegionProps: {
          pathname,
          overlayForeground,
        },
      },
    }}
    editProps={{
      pathname,
      saveLabel: 'Salvar cabeçalho',
      cancelLabel: 'Cancelar',
      metadata: {
        globalRegionProps: {
          pathname,
          overlayForeground,
        },
      },
    }}
  />
);

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
  overlayForeground: PropTypes.string,
};

export default Header;

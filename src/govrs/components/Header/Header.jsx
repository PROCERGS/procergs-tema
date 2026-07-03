import React, { useEffect } from 'react';
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
import ProcergsLogo from './ProcergsLogo';

const Header = ({ pathname }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const navigationItems = useSelector(
    (state) => state.navigation.items,
    shallowEqual,
  );

  const siteTitle = 'Site Modelo Matriz3';

  useEffect(() => {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(pathname))) {
      dispatch(getNavigation(getBaseUrl(pathname), settings.navDepth));
    }
  }, [pathname, token, dispatch]);

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
    <header className="procergs-header-wrapper" role="banner">
      <BarraAcessibilidade
        shortcuts={[
          { title: 'Conteúdo', href: '#main' },
          { title: 'Menu', href: '#govrs-header-menu' },
          { title: 'Busca', href: '#govrs-header-search' },
        ]}
        hrefSitemap="/sitemap"
      />
      <GovrsHeader
        logo={<ProcergsLogo />}
        logoHref="/"
        logoAriaLabel="PROCERGS"
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

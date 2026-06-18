import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Footer as GovrsFooter } from '@procergs/react-govrs-ds';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import { mapVoltoNavigationToFooterSections } from '../../../helpers/mapVoltoNavigationToMenuItems';
import procergsLogo from '../../../assets/procergs-logo.svg';

const Footer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigationItems = useSelector(
    (state) => state.navigation.items,
    shallowEqual,
  );
  const footerSettings = config.settings.procergsFooter || {};

  useEffect(() => {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(pathname))) {
      dispatch(getNavigation(getBaseUrl(pathname), settings.navDepth));
    }
  }, [pathname, dispatch]);

  const items = mapVoltoNavigationToFooterSections(navigationItems);
  const {
    socialLinks = {},
    license = '',
    navigationLabel = 'Rodapé principal',
    asidePosition = 'after',
    images = [procergsLogo],
    children,
  } = footerSettings;

  return (
    <footer className="procergs-footer-wrapper">
      <GovrsFooter
        items={items}
        images={images}
        navigationLabel={navigationLabel}
        asidePosition={asidePosition}
        socialLinks={socialLinks}
        license={license}
      >
        {children}
      </GovrsFooter>
    </footer>
  );
};

export default Footer;

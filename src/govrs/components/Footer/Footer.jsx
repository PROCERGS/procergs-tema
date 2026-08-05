import React, { useEffect } from 'react';
import { Footer as GovrsFooter } from '@procergs/react-govrs-ds';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import { mapVoltoNavigationToFooterSections } from '../../../helpers/mapVoltoNavigationToMenuItems';
import resolveBranding from '../../../helpers/resolveBranding';
import procergsLogo from '../../../assets/procergs-logo.svg';

const Footer = () => {
  const dispatch = useDispatch();
  const navigationItems = useSelector(
    (state) => state.navigation.items,
    shallowEqual,
  );
  const navroot = useSelector(
    (state) => state.navroot?.data?.navroot,
    shallowEqual,
  );
  const footerSettings = config.settings.procergsFooter || {};
  const { navRootPath } = resolveBranding({ navroot });

  useEffect(() => {
    if (!hasApiExpander('navigation', navRootPath)) {
      dispatch(getNavigation(navRootPath, 2));
    }
  }, [dispatch, navRootPath]);

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

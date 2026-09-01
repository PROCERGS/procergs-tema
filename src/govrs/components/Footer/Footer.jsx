import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Footer as GovrsFooter } from '@procergs/react-govrs-ds';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import { mapVoltoNavigationToFooterSections } from '../../../helpers/mapVoltoNavigationToMenuItems';
import resolveBranding from '../../../helpers/resolveBranding';
import procergsLogo from '../../../assets/procergs-logo.svg';

const Footer = ({ overlayForeground }) => {
  const footerRef = useRef(null);
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

  useEffect(() => {
    const updateFooterHeight = () => {
      const height = footerRef.current?.getBoundingClientRect().height;
      if (height) {
        document.documentElement.style.setProperty(
          '--procergs-overlay-footer-height',
          `${height}px`,
        );
      }
    };
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateFooterHeight)
        : null;

    updateFooterHeight();
    if (footerRef.current) observer?.observe(footerRef.current);
    window.addEventListener('resize', updateFooterHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateFooterHeight);
      document.documentElement.style.removeProperty(
        '--procergs-overlay-footer-height',
      );
    };
  }, []);

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
    <footer
      ref={footerRef}
      className="procergs-footer-wrapper"
      style={
        overlayForeground
          ? { '--procergs-overlay-footer-foreground': overlayForeground }
          : undefined
      }
    >
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

Footer.propTypes = {
  overlayForeground: PropTypes.string,
};

export default Footer;

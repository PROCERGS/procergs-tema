import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Footer as GovrsFooter } from '@procergs/react-govrs-ds';
import { GlobalBlocksRegion } from '@procergs/volto-global-regions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import { mapVoltoNavigationToFooterSections } from '../../../helpers/mapVoltoNavigationToMenuItems';
import resolveBranding from '../../../helpers/resolveBranding';
import procergsLogo from '../../../assets/procergs-logo.svg';

export const LegacyGovrsFooter = ({
  allowOverlay = true,
  overlayForeground,
}) => {
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
    const footerElement = footerRef.current;
    const footerWrapper =
      footerElement?.closest('.global-blocks-region-footer') || footerElement;
    const updateFooterHeight = () => {
      const height = footerWrapper?.getBoundingClientRect().height;
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
    if (footerWrapper) observer?.observe(footerWrapper);
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
      className={
        allowOverlay
          ? 'procergs-footer-wrapper allows-group-overlay'
          : 'procergs-footer-wrapper'
      }
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

LegacyGovrsFooter.propTypes = {
  allowOverlay: PropTypes.bool,
  overlayForeground: PropTypes.string,
};

export const ProcergsGlobalFooterBlock = ({ data, metadata }) => {
  const regionProps = metadata?.globalRegionProps || {};

  return (
    <LegacyGovrsFooter
      allowOverlay={data?.allowOverlay !== false}
      overlayForeground={regionProps.overlayForeground}
    />
  );
};

ProcergsGlobalFooterBlock.propTypes = {
  data: PropTypes.shape({
    allowOverlay: PropTypes.bool,
  }),
  metadata: PropTypes.shape({
    globalRegionProps: PropTypes.shape({
      overlayForeground: PropTypes.string,
    }),
  }),
};

const Footer = ({ pathname, overlayForeground }) => (
  <GlobalBlocksRegion
    name="footer"
    pathname={pathname}
    fallback={
      <LegacyGovrsFooter allowOverlay overlayForeground={overlayForeground} />
    }
    viewProps={{
      location: { pathname },
      metadata: {
        globalRegionProps: {
          overlayForeground,
        },
      },
    }}
    editProps={{
      pathname,
      saveLabel: 'Salvar rodapé',
      cancelLabel: 'Cancelar',
      metadata: {
        globalRegionProps: {
          overlayForeground,
        },
      },
    }}
  />
);

Footer.propTypes = {
  pathname: PropTypes.string.isRequired,
  overlayForeground: PropTypes.string,
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { Footer as GovrsFooter } from '@procergs/react-govrs-ds';
import config from '@plone/volto/registry';
import Api from '@plone/volto/helpers/Api/Api';
import { mapVoltoNavigationToFooterSections } from '../../../helpers/mapVoltoNavigationToMenuItems';
import procergsLogo from '../../../assets/procergs-logo.svg';

const Footer = () => {
  const [navigationItems, setNavigationItems] = useState([]);
  const footerSettings = config.settings.procergsFooter || {};

  useEffect(() => {
    let isCurrent = true;
    const api = new Api();

    api
      .get('/@navigation', {
        params: { 'expand.navigation.depth': 2 },
      })
      .then((navigation) => {
        if (isCurrent) {
          setNavigationItems(
            navigation.items ??
              navigation.navigation?.items ??
              navigation['@components']?.navigation?.items ??
              [],
          );
        }
      })
      .catch(() => {
        if (isCurrent) {
          setNavigationItems([]);
        }
      });

    return () => {
      isCurrent = false;
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
